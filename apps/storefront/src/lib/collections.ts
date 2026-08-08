import { z } from "zod";
import { shopifyFetch } from "./shopifyFetch";

export const CollectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  description: z.string(),
  image: z
    .object({
      url: z.string(),
      altText: z.union([z.string(), z.null()]).optional(),
    })
    .optional(),
});

export const CollectionsResponseSchema = z.array(CollectionSchema);

const COLLECTIONS_QUERY = `query Collections($first: Int!) {
  collections(first: $first) {
    edges {
      node {
        id
        title
        handle
        description
        image {
          url
          altText
        }
      }
    }
  }
}`;

export async function getCollections({ first = 50 }: { first?: number } = {}) {
  const res = await shopifyFetch({
    query: COLLECTIONS_QUERY,
    variables: { first },
  });

  const edges = res.body?.data?.collections?.edges || [];
  const collections = edges.map((edge: any) => {
    const node = edge.node;
    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description || "",
      image: node.image
        ? {
            url: node.image.url,
            altText: node.image.altText,
          }
        : undefined,
    };
  });

  return collections as z.infer<typeof CollectionsResponseSchema>;
}
