import { shopifyFetch } from "./shopifyFetch";

const ANNOUNCEMENT_QUERY = `{
  shop {
    metafield(namespace: "custom", key: "announcement") {
      value
      type
    }
  }
}`;

export async function getAnnouncement() {
  const res = await shopifyFetch({
    query: ANNOUNCEMENT_QUERY
  });

  const metafield = res.body?.data?.shop?.metafield;
  
  return metafield?.value || null;
}

// * add this in another file to be called in.
const res = await getAnnouncement();
console.log(`Announcement: "${res}"`)
// * ends here