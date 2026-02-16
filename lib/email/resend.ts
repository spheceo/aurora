import { Resend } from "resend";
import { env } from "@/lib/env/server";

const FALLBACK_FROM_ADDRESS = "Aurora <onboarding@resend.dev>";
const DEFAULT_APP_URL = "https://aurora.crystals";

let resendClient: Resend | null = null;

function normalizeDomain(value: string) {
  return value.trim().replace(/^@+/, "").toLowerCase();
}

function removeTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getResendClient() {
  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }

  return resendClient;
}

export function getFromAddress() {
  if (!env.EMAIL_SENDER_DOMAIN) {
    return FALLBACK_FROM_ADDRESS;
  }

  const domain = normalizeDomain(env.EMAIL_SENDER_DOMAIN);
  return `Aurora <noreply@${domain}>`;
}

export function getAppUrl() {
  return removeTrailingSlash(env.APP_URL || DEFAULT_APP_URL);
}
