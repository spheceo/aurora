import { z } from "zod";
import { shopifyFetch } from "./shopifyFetch";

const ProductVariantSchema = z.object({
    id: z.string(),
    title: z.string(),
    price: z.string(),
    soldOut: z.boolean(),
})

export const ProductSchema = z.object({
    id: z.string(),
    variantId: z.string(),
    numericId: z.number(),
    title: z.string(),
    description: z.string(),
    price: z.string(),
    variantCount: z.number(),
    selectedVariantTitle: z.string().optional(),
    variants: z.array(ProductVariantSchema),
    soldOut: z.boolean(),
    collections: z.array(z.object({
      id: z.string(),
      title: z.string(),
      handle: z.string()
    })),
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
          variants(first: 20) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
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
          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
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
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
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
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
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

function normalizeVariantTitle(title?: string | null) {
    return title === "Default Title" ? undefined : title || undefined;
}

function mapVariants(node: any) {
    return (node.variants?.edges || []).map((variantEdge: any) => ({
      id: variantEdge.node.id,
      title: variantEdge.node.title,
      price: `${variantEdge.node.price?.amount} ${variantEdge.node.price?.currencyCode}`,
      soldOut: !(variantEdge.node.availableForSale ?? true),
    }));
}

function selectDefaultVariant(variants: Array<z.infer<typeof ProductVariantSchema>>) {
    return variants.find((variant) => !variant.soldOut) || variants[0];
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
      const variants = mapVariants(node)
      const defaultVariant = selectDefaultVariant(variants)
      const numericId = extractNumericId(node.id)
      return {
        id: node.id,
        variantId: defaultVariant?.id || node.id,
        numericId,
        title: node.title,
        description: node.description || '',
        price: `${node.priceRange?.minVariantPrice?.amount} ${node.priceRange?.minVariantPrice?.currencyCode}`,
        variantCount: variants.length,
        selectedVariantTitle: normalizeVariantTitle(defaultVariant?.title),
        variants,
        soldOut: defaultVariant ? defaultVariant.soldOut : !(node.availableForSale ?? true),
        collections: node.collections?.edges?.map((collectionEdge: any) => ({
          id: collectionEdge.node.id,
          title: collectionEdge.node.title,
          handle: collectionEdge.node.handle
        })) || [],
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

    const variants = mapVariants(node)
    const defaultVariant = selectDefaultVariant(variants)

    return {
      id: node.id,
      variantId: defaultVariant?.id || node.id,
      numericId,
      title: node.title,
      description: node.description || '',
      price: `${node.priceRange?.minVariantPrice?.amount} ${node.priceRange?.minVariantPrice?.currencyCode}`,
      variantCount: variants.length,
      selectedVariantTitle: normalizeVariantTitle(defaultVariant?.title),
      variants,
      soldOut: defaultVariant ? defaultVariant.soldOut : !(node.availableForSale ?? true),
      collections: node.collections?.edges?.map((collectionEdge: any) => ({
        id: collectionEdge.node.id,
        title: collectionEdge.node.title,
        handle: collectionEdge.node.handle
      })) || [],
      assets: node.images?.edges?.map((imgEdge: any) => ({
        id: imgEdge.node.id,
        url: imgEdge.node.url,
        altText: imgEdge.node.altText
      })) || []
    } as z.infer<typeof ProductSchema>
}
