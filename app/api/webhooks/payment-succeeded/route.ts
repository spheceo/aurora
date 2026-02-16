import { NextResponse } from "next/server";
import {
  PaymentEmailSendError,
  sendPaymentEmails,
} from "@/lib/email/sendPaymentEmails";
import { PaymentSucceededWebhookSchema } from "@/lib/webhooks/paymentSucceededSchema";

export const runtime = "nodejs";

function getWebhookOrderId(payload: { id: string | number; name?: string }) {
  if (payload.name) {
    return payload.name;
  }

  return String(payload.id);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unsupported content type. Expected application/json.",
      },
      { status: 415 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  console.info("[webhook:payment_succeeded] raw_payload", body);

  const parsedPayload = PaymentSucceededWebhookSchema.safeParse(body);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid webhook payload.",
        issues: parsedPayload.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const payload = parsedPayload.data;
  const attempt = request.headers.get("x-retry-count") || "1";
  const topic = request.headers.get("x-shopify-topic") || "unknown";
  const orderId = getWebhookOrderId(payload);

  console.info("[webhook:payment_succeeded] received", {
    orderId,
    topic,
    attempt,
  });

  // TODO: Restrict this endpoint to Shopify webhook payloads with HMAC verification.
  try {
    const emailResult = await sendPaymentEmails(payload);

    console.info("[webhook:payment_succeeded] emails sent", {
      orderId,
      topic,
      adminMessageId: emailResult.adminMessageId,
      customerMessageId: emailResult.customerMessageId,
    });

    return NextResponse.json({
      ok: true,
      orderId,
      ...emailResult,
    });
  } catch (error) {
    console.error("[webhook:payment_succeeded] email dispatch failed", {
      orderId,
      topic,
      reason: error instanceof Error ? error.message : "Unknown",
      partialResult:
        error instanceof PaymentEmailSendError
          ? error.partialResult
          : undefined,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to send one or more transactional emails.",
      },
      { status: 502 },
    );
  }
}
