import { z } from "zod";
import { shopifyFetch } from "./shopifyFetch";

export const ProductSchema = z.object({
    id: z.string(),
    variantId: z.string(),
    numericId: z.number(),
    title: z.string(),
    description: z.string(),
    price: z.string(),
    soldOut: z.boolean(),
    assets: z.array(z.object({
      id: z.string().optional(),
      url: z.string(),
      altText: z.union([z.string(), z.null()])
    }))
})

export const ProductsResponseSchema = z.array(ProductSchema)

const PRODUCTS_QUERY = `query Products($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
              }
            }
          }
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
        }
      }
    }
}`

const PRODUCT_BY_ID_QUERY = `query ProductById($id: ID!) {
    product(id: $id) {
      id
      title
      description
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            availableForSale
          }
        }
      }
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
          }
        }
      }
    }
  }`

// Extract numeric ID from Shopify ID (e.g., "gid://shopify/Product/123" -> 123)
function extractNumericId(gid: string): number {
    const match = gid.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
}

// Reconstruct full Shopify GID from numeric ID
function buildGid(numericId: number): string {
    return `gid://shopify/Product/${numericId}`;
}

export async function getProducts({ first = 250, query }: { first?: number; query?: string } = {}) {
    const res = await shopifyFetch({
      query: PRODUCTS_QUERY,
      variables: { first, query: query && query.trim().length > 0 ? query : undefined }
    })

    // Transform the nested structure: res.body.data.products.edges -> flat array of products
    const edges = res.body?.data?.products?.edges || []
    const products = edges.map((edge: any) => {
      const node = edge.node
      const variant = node.variants?.edges?.[0]?.node
      const numericId = extractNumericId(node.id)
      return {
        id: node.id,
        variantId: variant?.id || node.id,
        numericId,
        title: node.title,
        description: node.description || '',
        price: `${node.priceRange?.minVariantPrice?.amount} ${node.priceRange?.minVariantPrice?.currencyCode}`,
        soldOut: !(variant?.availableForSale ?? node.availableForSale ?? true),
        assets: node.images?.edges?.map((imgEdge: any) => ({
          id: imgEdge.node.id,
          url: imgEdge.node.url,
          altText: imgEdge.node.altText
        })) || []
      }
    })

    return products as z.infer<typeof ProductsResponseSchema>
}

export async function getProductById(numericId: number) {
    const gid = buildGid(numericId)

    const res = await shopifyFetch({
      query: PRODUCT_BY_ID_QUERY,
      variables: { id: gid }
    })

    const node = res.body?.data?.product

    if (!node) {
      return null
    }

    const variant = node.variants?.edges?.[0]?.node

    return {
      id: node.id,
      variantId: variant?.id || node.id,
      numericId,
      title: node.title,
      description: node.description || '',
      price: `${node.priceRange?.minVariantPrice?.amount} ${node.priceRange?.minVariantPrice?.currencyCode}`,
      soldOut: !(variant?.availableForSale ?? node.availableForSale ?? true),
      assets: node.images?.edges?.map((imgEdge: any) => ({
        id: imgEdge.node.id,
        url: imgEdge.node.url,
        altText: imgEdge.node.altText
      })) || []
    } as z.infer<typeof ProductSchema>
}