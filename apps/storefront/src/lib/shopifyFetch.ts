import { env } from "./env/server";

export async function shopifyFetch({
    query,
    variables
  }: { query: string; variables?: Record<string, unknown> }) {
    const endpoint = `https://${env.SHOPIFY_DOMAIN!}/api/2026-01/graphql.json`;
    const key = env.SHOPIFY_TOKEN!;
  
    try {
      const result = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': key
        },
        body: JSON.stringify({ query, variables })
      });
  
      return {
        status: result.status,
        body: await result.json()
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        status: 500,
        error: 'Error receiving data'
      };
    }
}