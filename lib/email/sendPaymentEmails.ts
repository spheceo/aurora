import type { Resend } from "resend";
import { env } from "@/lib/env/server";
import type { PaymentSucceededWebhookInput } from "@/lib/webhooks/paymentSucceededSchema";
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

export async function sendPaymentEmails(
  payload: PaymentSucceededWebhookInput,
): Promise<SendPaymentEmailsResult> {
  const resend = getResendClient();
  const appUrl = getAppUrl();
  const fromAddress = getFromAddress();
  const result: SendPaymentEmailsResult = {};

  try {
    const adminResponse = await resend.emails.send({
      from: fromAddress,
      to: env.ADMIN_NOTIFICATION_EMAIL,
      subject: `New paid order received - ${payload.orderId}`,
      react: AdminPaymentSuccessEmail({ appUrl, payload }),
      replyTo: payload.customer.email,
    });

    result.adminMessageId = getMessageId(adminResponse);
  } catch (error) {
    console.error("Failed to send admin payment success email", {
      orderId: payload.orderId,
      source: payload.source,
      reason: error instanceof Error ? error.message : "Unknown",
    });

    throw new PaymentEmailSendError(
      "Failed to send admin payment success email",
      result,
    );
  }

  try {
    const customerResponse = await resend.emails.send({
      from: fromAddress,
      to: payload.customer.email,
      subject: "Thanks for your purchase - Aurora",
      react: CustomerPaymentSuccessEmail({ appUrl, payload }),
      replyTo: "hello@aurora.crystals",
    });

    result.customerMessageId = getMessageId(customerResponse);
  } catch (error) {
    console.error("Failed to send customer payment success email", {
      orderId: payload.orderId,
      source: payload.source,
      reason: error instanceof Error ? error.message : "Unknown",
    });

    throw new PaymentEmailSendError(
      "Failed to send customer payment success email",
      result,
    );
  }

  return result;
}
