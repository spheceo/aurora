import { z } from "zod";

const MoneyStringSchema = z
  .string()
  .regex(/^-?\d+(\.\d+)?$/, "must be a valid numeric string");

const ShopifyOrderLineItemSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1).optional(),
    quantity: z.number().int().min(1),
    price: MoneyStringSchema.optional(),
  })
  .passthrough();

const ShopifyCustomerSchema = z
  .object({
    email: z.string().email().optional(),
    first_name: z.string().trim().min(1).optional(),
    last_name: z.string().trim().min(1).optional(),
  })
  .passthrough();

const ShopifyShippingAddressSchema = z
  .object({
    address1: z.string().trim().min(1).optional(),
    city: z.string().trim().min(1).optional(),
    province: z.string().trim().min(1).optional(),
    zip: z.string().trim().min(1).optional(),
    country: z.string().trim().min(1).optional(),
  })
  .passthrough();

export const PaymentSucceededWebhookSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    name: z.string().trim().min(1).optional(),
    order_number: z.number().int().optional(),
    contact_email: z.string().email().optional(),
    email: z.string().email().optional(),
    customer: ShopifyCustomerSchema.optional(),
    line_items: z.array(ShopifyOrderLineItemSchema).min(1),
    currency: z
      .string()
      .trim()
      .length(3, "currency must be a 3-letter ISO code")
      .transform((value) => value.toUpperCase()),
    current_total_price: MoneyStringSchema.optional(),
    total_price: MoneyStringSchema.optional(),
    processed_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
    created_at: z.string().datetime().optional(),
    shipping_address: ShopifyShippingAddressSchema.optional(),
  })
  .passthrough();

export type PaymentSucceededWebhookInput = z.infer<
  typeof PaymentSucceededWebhookSchema
>;
