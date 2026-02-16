import { Link, Section, Text } from "@react-email/components";
import type { CSSProperties } from "react";
import type { PaymentEmailPayload } from "@/lib/email/paymentEmailPayload";
import { AuroraEmailShell } from "./components/AuroraEmailShell";

type CustomerPaymentSuccessEmailProps = {
  appUrl: string;
  payload: PaymentEmailPayload;
};

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function getCustomerName(firstName?: string, fallback = "there") {
  return firstName?.trim() || fallback;
}

function getStatusCopy(status: string) {
  if (status === "paid") {
    return {
      eyebrow: "Payment received",
      title: "Thank you for your purchase.",
      subtitle:
        "Your payment was successful and your order is now being prepared.",
    };
  }

  if (status === "voided") {
    return {
      eyebrow: "Order update",
      title: "Your order payment was voided.",
      subtitle:
        "We received a payment status update from Shopify and wanted to keep you informed.",
    };
  }

  return {
    eyebrow: "Order update",
    title: `Your order status is now: ${status}.`,
    subtitle:
      "We received a payment-related update from Shopify and wanted to keep you informed.",
  };
}

// TODO: review template copy/styles before production.
export function CustomerPaymentSuccessEmail({
  appUrl,
  payload,
}: CustomerPaymentSuccessEmailProps) {
  const statusCopy = getStatusCopy(payload.financialStatus);

  return (
    <AuroraEmailShell
      previewText={`Order ${payload.orderId} update: ${payload.financialStatus}`}
      eyebrow={statusCopy.eyebrow}
      title={`${statusCopy.title} ${getCustomerName(payload.customer.firstName)}.`}
      subtitle={statusCopy.subtitle}
      ctaHref={appUrl}
      ctaLabel="Visit Aurora"
      appUrl={appUrl}
    >
      <Section style={styles.card}>
        <Text style={styles.paragraph}>
          Here is your latest order summary for reference.
        </Text>

        <Section style={styles.summaryGrid}>
          <Text style={styles.summaryLabel}>Order ID</Text>
          <Text style={styles.summaryValue}>{payload.orderId}</Text>

          <Text style={styles.summaryLabel}>Payment status</Text>
          <Text style={styles.summaryValue}>{payload.financialStatus}</Text>

          <Text style={styles.summaryLabel}>Order total</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(payload.amount, payload.currency)}
          </Text>
        </Section>

        {payload.items.length > 0 ? (
          <>
            <Text style={styles.summaryLabel}>Items</Text>
            {payload.items.map((item, index) => (
              <Text key={`${item.title}-${index}`} style={styles.itemRow}>
                {item.quantity} x {item.title}
              </Text>
            ))}
          </>
        ) : null}

        <Text style={styles.paragraph}>
          Questions about your order? Contact us at{" "}
          <Link href="mailto:hello@aurora.crystals" style={styles.link}>
            hello@aurora.crystals
          </Link>
          .
        </Text>
      </Section>
    </AuroraEmailShell>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #f0e8e9",
    borderRadius: "14px",
    padding: "20px",
  },
  paragraph: {
    margin: "0 0 14px",
    color: "#333333",
    fontSize: "14px",
    lineHeight: "1.65",
  },
  summaryGrid: {
    margin: "0 0 16px",
    padding: "14px",
    borderRadius: "10px",
    backgroundColor: "#fbf7f8",
    border: "1px solid #f3eaeb",
  },
  summaryLabel: {
    margin: "0 0 4px",
    color: "#7a686b",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: 600,
  },
  summaryValue: {
    margin: "0 0 12px",
    color: "#1f1f1f",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  itemRow: {
    margin: "0 0 10px",
    color: "#1f1f1f",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  link: {
    color: "#811A21",
    textDecoration: "underline",
    fontWeight: 600,
  },
};
