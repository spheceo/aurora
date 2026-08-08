import { Text } from "@react-email/components";
import { Resend } from "resend";
import { AuroraEmailShell } from "./shell";

type ApprovalEmailInput = {
  to: string;
  companyName: string;
  status: "approved" | "rejected";
  reason?: string | null;
  appUrl?: string;
};

function getFromAddress() {
  const domain = process.env.EMAIL_SENDER_DOMAIN?.trim()
    .replace(/^@+/, "")
    .toLowerCase();
  return domain
    ? `Aurora <noreply@${domain}>`
    : "Aurora <onboarding@resend.dev>";
}

export async function sendAccountDecisionEmail(input: ApprovalEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured; skipping account decision email");
    return { skipped: true as const };
  }

  const approved = input.status === "approved";
  const appUrl = (input.appUrl || process.env.APP_URL || "https://aurora.crystals").replace(/\/+$/, "");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const subject = approved
    ? "Your Aurora wholesale account is active"
    : "Update on your Aurora wholesale application";

  const response = await resend.emails.send({
    from: getFromAddress(),
    to: input.to,
    subject,
    react: (
      <AuroraEmailShell
        previewText={subject}
        eyebrow="Wholesale account"
        title={approved ? "You’re approved" : "Application update"}
        subtitle={approved
          ? `${input.companyName} can now view wholesale pricing and place orders.`
          : `We’re unable to approve ${input.companyName} at this time.`}
        appUrl={appUrl}
        ctaHref={approved ? `${appUrl}/shop` : undefined}
        ctaLabel={approved ? "View wholesale catalogue" : undefined}
      >
        <Text style={{ color: "#4b4b4b", fontSize: "14px", lineHeight: "1.6" }}>
          {approved
            ? "Sign in with your company email to access pricing and checkout."
            : input.reason || "Please contact Aurora if you would like us to review additional information."}
        </Text>
      </AuroraEmailShell>
    ),
  });

  if (response.error) {
    throw new Error(`Unable to send account decision email: ${response.error.message}`);
  }

  return { skipped: false as const, id: response.data?.id };
}
