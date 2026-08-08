import { os } from "@orpc/server";
import { z } from "zod";
import { getProducts, getProductById } from "../products";
import { getCollections } from "../collections";
import { getAnnouncement } from "../announcement";
import { createCheckout, CheckoutInputSchema } from "../checkout";

const products = os
  .input(
    z.optional(z.object({
      first: z.number().optional(),
      query: z.string().optional()
    }))
  )
  .handler(async({ input }) => {
    const data = await getProducts({
      first: input?.first,
      query: input?.query
    });
    return data;
  });

const collections = os
  .input(
    z.optional(z.object({
      first: z.number().optional()
    }))
  )
  .handler(async({ input }) => {
    const data = await getCollections({
      first: input?.first
    });
    return data;
  });

const productById = os
  .input(z.object({
    id: z.number()
  }))
  .handler(async({ input }) => {
    const data = await getProductById(input.id);
    return data;
  });

const announcement = os
  .handler(async() => {
    const data = await getAnnouncement();
    return data ;
  });

const checkout = os
  .input(CheckoutInputSchema)
  .handler(async({ input }) => {
    const data = await createCheckout(input);
    return data;
  });

export const router = {
  products,
  collections,
  productById,
  announcement,
  checkout
}
