import { ORPCError, os } from "@orpc/server";
import { z } from "zod";
import { getAnnouncement } from "../announcement";
import { getPricingAccess } from "../auth/pricing";
import { CheckoutInputSchema, createCheckout } from "../checkout";
import { getCollections } from "../collections";
import { getProductById, getProducts } from "../products";

const requirePricingAccess = os.middleware(async ({ next }) => {
  const access = await getPricingAccess();
  if (!access.approved) {
    throw new ORPCError("FORBIDDEN", {
      message: "An approved wholesale account is required to checkout",
    });
  }

  return next();
});

const products = os
  .input(
    z.optional(
      z.object({
        first: z.number().optional(),
        query: z.string().optional(),
      }),
    ),
  )
  .handler(async ({ input }) => {
    const data = await getProducts({
      first: input?.first,
      query: input?.query,
    });
    return data;
  });

const collections = os
  .input(
    z.optional(
      z.object({
        first: z.number().optional(),
      }),
    ),
  )
  .handler(async ({ input }) => {
    const data = await getCollections({
      first: input?.first,
    });
    return data;
  });

const productById = os
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    const data = await getProductById(input.id);
    return data;
  });

const announcement = os.handler(async () => {
  const data = await getAnnouncement();
  return data;
});

const pricingAccess = os.handler(async () => {
  const access = await getPricingAccess();
  return { approved: access.approved };
});

const checkout = os
  .use(requirePricingAccess)
  .input(CheckoutInputSchema)
  .handler(async ({ input }) => {
    const data = await createCheckout(input);
    return data;
  });

export const router = {
  products,
  collections,
  productById,
  announcement,
  pricingAccess,
  checkout,
};
