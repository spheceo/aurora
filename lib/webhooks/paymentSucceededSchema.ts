import { z } from "zod";

const CurrencyCodeSchema = z
  .string()
  .trim()
  .length(3, "currency must be a 3-letter ISO code")
  .transform((value) => value.toUpperCase())
  .refine((value) => /^[A-Z]{3}$/.test(value), {
    message: "currency must be a 3-letter ISO code",
  });

const ItemSchema = z
  .object({
    title: z.string().trim().min(1, "item title is required"),
    quantity: z.number().int().min(1, "item quantity must be at least 1"),
    unitPrice: z
      .number()
      .positive("item unitPrice must be positive")
      .optional(),
  })
  .strict();

const ShippingAddressSchema = z
  .object({
    line1: z.string().trim().min(1, "shippingAddress.line1 is required"),
    city: z.string().trim().min(1, "shippingAddress.city is required"),
    region: z.string().trim().min(1, "shippingAddress.region is required"),
    postalCode: z
      .string()
      .trim()
      .min(1, "shippingAddress.postalCode is required"),
    country: z.string().trim().min(1, "shippingAddress.country is required"),
  })
  .strict();

const CustomerSchema = z
  .object({
    email: z.string().email("customer.email must be a valid email"),
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
  })
  .strict();

export const PaymentSucceededWebhookSchema = z
  .object({
    event: z.literal("payment_succeeded"),
    source: z.string().trim().min(1, "source is required"),
    orderId: z.string().trim().min(1, "orderId is required"),
    paidAt: z
      .string()
      .datetime({ message: "paidAt must be a valid ISO datetime" }),
    amount: z.number().positive("amount must be positive"),
    currency: CurrencyCodeSchema,
    customer: CustomerSchema,
    items: z.array(ItemSchema).min(1, "items must contain at least one item"),
    shippingAddress: ShippingAddressSchema.optional(),
    meta: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type PaymentSucceededWebhookInput = z.infer<
  typeof PaymentSucceededWebhookSchema
>;
