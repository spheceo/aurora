import type { Resend } from "resend";
import { env } from "@/lib/env/server";
import type { PaymentSucceededWebhookInput } from "@/lib/webhooks/paymentSucceededSchema";
import { SUPPORT_EMAIL } from "./constants";
import type { PaymentEmailPayload } from "./paymentEmailPayload";
import { getAppUrl, getFromAddress, getResendClient } from "./resend";
import { AdminPaymentSuccessEmail } from "./templates/AdminPaymentSuccessEmail";
import { CustomerPaymentSuccessEmail } from "./templates/CustomerPaymentSuccessEmail";

export type SendPaymentEmailsResult = {
  adminMessageId?: string;
  customerMessageId?: string;
};

export class PaymentEmailSendError extends Error {
  readonly partialResult: SendPaymentEmailsResult;

  constructor(message: string, partialResult: SendPaymentEmailsResult) {
    super(message);
    this.name = "PaymentEmailSendError";
    this.partialResult = partialResult;
  }
}

type ResendSendResponse = Awaited<ReturnType<Resend["emails"]["send"]>>;

function getMessageId(response: ResendSendResponse) {
  if (response.error) {
    throw new Error(response.error.message || "Unknown Resend error");
  }

  if (!response.data?.id) {
    throw new Error("Resend did not return a message id");
  }

  return response.data.id;
}

function pickOrderId(payload: PaymentSucceededWebhookInput) {
  if (payload.name) {
    return payload.name;
  }

  if (typeof payload.order_number !== "undefined") {
    return `#${payload.order_number}`;
  }

  if (typeof payload.id !== "undefined") {
    return String(payload.id);
  }

  return "Unknown order";
}

function pickEventAt(payload: PaymentSucceededWebhookInput) {
  return (
    payload.processed_at ||
    payload.updated_at ||
    payload.created_at ||
    new Date().toISOString()
  );
}

function parseAmount(payload: PaymentSucceededWebhookInput) {
  const raw = payload.current_total_price || payload.total_price;

  if (!raw) {
    return undefined;
  }

  const value = Number.parseFloat(raw);

  if (Number.isNaN(value) || value < 0) {
    return undefined;
  }

  return value;
}

function sumLineItems(payload: PaymentSucceededWebhookInput) {
  if (!payload.line_items?.length) {
    return 0;
  }

  return payload.line_items.reduce((total, item) => {
    const quantity = item.quantity || 1;
    const price = item.price ? Number.parseFloat(item.price) : 0;

    if (Number.isNaN(price)) {
      return total;
    }

    return total + quantity * price;
  }, 0);
}

function pickCustomerEmail(payload: PaymentSucceededWebhookInput) {
  return payload.contact_email || payload.email || payload.customer?.email;
}

function normalizePayload(
  payload: PaymentSucceededWebhookInput,
): PaymentEmailPayload {
  const orderId = pickOrderId(payload);
  const amount = parseAmount(payload) ?? sumLineItems(payload);

  const normalizedItems = (payload.line_items || []).map((item, index) => {
    const title = item.title || item.name || `Item ${index + 1}`;
    const unitPrice = item.price ? Number.parseFloat(item.price) : undefined;

    return {
      title,
      quantity: item.quantity || 1,
      unitPrice:
        typeof unitPrice === "number" && !Number.isNaN(unitPrice)
          ? unitPrice
          : undefined,
    };
  });

  const shippingAddress = payload.shipping_address?.address1
    ? {
        line1: payload.shipping_address.address1,
        city: payload.shipping_address.city || "",
        region: payload.shipping_address.province || "",
        postalCode: payload.shipping_address.zip || "",
        country: payload.shipping_address.country || "",
      }
    : undefined;

  return {
    source: "shopify",
    orderId,
    eventAt: pickEventAt(payload),
    amount,
    currency: payload.currency || "USD",
    financialStatus: payload.financial_status || "unknown",
    cancelReason: payload.cancel_reason,
    cancelledAt: payload.cancelled_at,
    customer: {
      email: pickCustomerEmail(payload),
      firstName: payload.customer?.first_name,
      lastName: payload.customer?.last_name,
    },
    items: normalizedItems,
    shippingAddress,
  };
}

function getAdminSubject(payload: PaymentEmailPayload) {
  return `Shopify order update (${payload.financialStatus}) - ${payload.orderId}`;
}

function getCustomerSubject(payload: PaymentEmailPayload) {
  if (payload.financialStatus === "paid") {
    return "Thanks for your purchase - Aurora";
  }

  return `Order status update (${payload.financialStatus}) - Aurora`;
}

export async function sendPaymentEmails(
  payload: PaymentSucceededWebhookInput,
): Promise<SendPaymentEmailsResult> {
  const resend = getResendClient();
  const appUrl = getAppUrl();
  const fromAddress = getFromAddress();
  const result: SendPaymentEmailsResult = {};
  const normalizedPayload = normalizePayload(payload);

  try {
    const adminResponse = await resend.emails.send({
      from: fromAddress,
      to: env.ADMIN_NOTIFICATION_EMAIL,
      subject: getAdminSubject(normalizedPayload),
      react: AdminPaymentSuccessEmail({ appUrl, payload: normalizedPayload }),
      replyTo: normalizedPayload.customer.email || SUPPORT_EMAIL,
    });

    result.adminMessageId = getMessageId(adminResponse);
  } catch (error) {
    console.error("Failed to send admin payment success email", {
      orderId: normalizedPayload.orderId,
      source: normalizedPayload.source,
      financialStatus: normalizedPayload.financialStatus,
      reason: error instanceof Error ? error.message : "Unknown",
    });

    throw new PaymentEmailSendError(
      "Failed to send admin payment success email",
      result,
    );
  }

  if (!normalizedPayload.customer.email) {
    console.warn(
      "Skipping customer email: no customer email in Shopify payload",
      {
        orderId: normalizedPayload.orderId,
        financialStatus: normalizedPayload.financialStatus,
      },
    );

    return result;
  }

  try {
    const customerResponse = await resend.emails.send({
      from: fromAddress,
      to: normalizedPayload.customer.email,
      subject: getCustomerSubject(normalizedPayload),
      react: CustomerPaymentSuccessEmail({
        appUrl,
        payload: normalizedPayload,
      }),
      replyTo: SUPPORT_EMAIL,
    });

    result.customerMessageId = getMessageId(customerResponse);
  } catch (error) {
    console.error("Failed to send customer payment success email", {
      orderId: normalizedPayload.orderId,
      source: normalizedPayload.source,
      financialStatus: normalizedPayload.financialStatus,
      reason: error instanceof Error ? error.message : "Unknown",
    });

    throw new PaymentEmailSendError(
      "Failed to send customer payment success email",
      result,
    );
  }

  return result;
}
