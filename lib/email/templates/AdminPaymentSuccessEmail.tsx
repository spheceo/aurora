import { Section, Text } from "@react-email/components";
import type { CSSProperties } from "react";
import type { PaymentEmailPayload } from "@/lib/email/paymentEmailPayload";
import { AuroraEmailShell } from "./components/AuroraEmailShell";

type AdminPaymentSuccessEmailProps = {
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

function formatPaidAt(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);
}

function getCustomerName(
  firstName?: string,
  lastName?: string,
  fallback = "Unknown customer",
) {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  return name || fallback;
}

// TODO: review template copy/styles before production.
export function AdminPaymentSuccessEmail({
  appUrl,
  payload,
}: AdminPaymentSuccessEmailProps) {
  const itemCount = payload.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AuroraEmailShell
      previewText={`New paid order ${payload.orderId}`}
      eyebrow="Admin payment alert"
      title="A new order has been paid"
      subtitle="A customer payment was confirmed. Review the order details below."
      ctaHref={appUrl}
      ctaLabel="Open Aurora"
      appUrl={appUrl}
    >
      <Section style={styles.card}>
        <Text style={styles.label}>Order ID</Text>
        <Text style={styles.value}>{payload.orderId}</Text>

        <Text style={styles.label}>Amount paid</Text>
        <Text style={styles.value}>
          {formatCurrency(payload.amount, payload.currency)}
        </Text>

        <Text style={styles.label}>Paid at</Text>
        <Text style={styles.value}>{formatPaidAt(payload.paidAt)}</Text>

        <Text style={styles.label}>Source</Text>
        <Text style={styles.value}>{payload.source}</Text>

        <Text style={styles.label}>Customer</Text>
        <Text style={styles.value}>
          {getCustomerName(
            payload.customer.firstName,
            payload.customer.lastName,
            payload.customer.email,
          )}
          {"\n"}
          {payload.customer.email}
        </Text>

        <Text style={styles.label}>Items ({itemCount})</Text>
        {payload.items.map((item, index) => (
          <Text key={`${item.title}-${index}`} style={styles.itemRow}>
            {item.quantity} x {item.title}
            {typeof item.unitPrice === "number"
              ? ` (${formatCurrency(item.unitPrice, payload.currency)} each)`
              : ""}
          </Text>
        ))}
      </Section>

      {payload.shippingAddress ? (
        <Section style={styles.addressCard}>
          <Text style={styles.label}>Shipping address</Text>
          <Text style={styles.value}>{payload.shippingAddress.line1}</Text>
          <Text style={styles.value}>
            {payload.shippingAddress.city}, {payload.shippingAddress.region}
          </Text>
          <Text style={styles.value}>
            {payload.shippingAddress.postalCode},{" "}
            {payload.shippingAddress.country}
          </Text>
        </Section>
      ) : null}
    </AuroraEmailShell>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    backgroundColor: "#fcf9f9",
    border: "1px solid #f0e8e9",
    borderRadius: "14px",
    padding: "20px",
  },
  addressCard: {
    marginTop: "18px",
    backgroundColor: "#ffffff",
    border: "1px solid #f0e8e9",
    borderRadius: "14px",
    padding: "20px",
  },
  label: {
    margin: "0 0 4px",
    color: "#7a686b",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: 600,
  },
  value: {
    margin: "0 0 14px",
    color: "#1f1f1f",
    fontSize: "14px",
    lineHeight: "1.6",
    whiteSpace: "pre-line",
  },
  itemRow: {
    margin: "0 0 10px",
    color: "#1f1f1f",
    fontSize: "14px",
    lineHeight: "1.5",
  },
};
