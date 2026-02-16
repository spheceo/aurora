export type PaymentEmailPayload = {
  source: "shopify";
  orderId: string;
  eventAt: string;
  amount: number;
  currency: string;
  financialStatus: string;
  cancelReason?: string;
  cancelledAt?: string;
  customer: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    unitPrice?: number;
  }>;
  shippingAddress?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
};
