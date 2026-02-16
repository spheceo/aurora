import { z } from "zod";
import { env } from "./env/server";
import { shopifyFetch } from "./shopifyFetch";

export const CheckoutLineItemSchema = z.object({
  variantId: z.string(),
  quantity: z.number(),
});

export const CheckoutInputSchema = z.object({
  lineItems: z.array(CheckoutLineItemSchema),
});

// Using Cart API (checkoutCreate was deprecated in API version 2023-10+)
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

function normalizeCheckoutUrl(rawUrl: string) {
  const url = rawUrl.startsWith("http")
    ? new URL(rawUrl)
    : new URL(rawUrl, `https://${env.SHOPIFY_DOMAIN}`);
  // Shopify requires using the full checkoutUrl it returns, so only enforce HTTPS.
  url.protocol = "https:";

  return url.toString();
}

export async function createCheckout(
  input: z.infer<typeof CheckoutInputSchema>,
) {
  const res = await shopifyFetch({
    query: CART_CREATE_MUTATION,
    variables: {
      input: {
        lines: input.lineItems.map((item) => ({
          merchandiseId: item.variantId,
          quantity: item.quantity,
        })),
      },
    },
  });

  console.log("Shopify cart response:", JSON.stringify(res.body, null, 2));

  // Check for GraphQL errors
  if (res.body?.errors?.length > 0) {
    console.error("GraphQL errors:", res.body.errors);
    throw new Error(res.body.errors[0].message || "Failed to create cart");
  }

  const cartData = res.body?.data?.cartCreate;

  if (cartData?.userErrors?.length > 0) {
    const error = cartData.userErrors[0];
    throw new Error(error.message || "Failed to create cart");
  }

  if (!cartData?.cart?.checkoutUrl) {
    throw new Error("No checkout URL returned from Shopify");
  }

  return {
    checkoutId: cartData.cart.id as string,
    checkoutUrl: normalizeCheckoutUrl(cartData.cart.checkoutUrl as string),
  };
}
