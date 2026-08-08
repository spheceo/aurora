import type { Metadata } from "next";
import { getProductById } from "@/lib/products";
import { siteConfig } from "@/lib/seo";

type ProductLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

const parsePrice = (price: string) => {
  const [amount] = price.split(" ");
  const parsed = Number.parseFloat(amount);
  return Number.isFinite(parsed) ? parsed : 0;
};

const loadProduct = async (id: string) => {
  const numericId = Number.parseInt(id, 10);
  if (!Number.isFinite(numericId)) {
    return null;
  }

  return getProductById(numericId);
};

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);

  if (!product) {
    return {
      title: "Product not found",
      alternates: {
        canonical: `/product/${id}`,
      },
    };
  }

  const image = product.assets[0]?.url ?? siteConfig.ogImage;
  const description = product.description || `Shop ${product.title} at Aurora ZA.`;

  return {
    title: `${product.title} Crystal`,
    description,
    alternates: {
      canonical: `/product/${product.numericId}`,
    },
    openGraph: {
      type: "website",
      title: `${product.title} | Aurora ZA`,
      description,
      url: `${siteConfig.url}/product/${product.numericId}`,
      images: [
        {
          url: image,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Aurora ZA`,
      description,
      images: [image],
    },
  };
}

export default async function ProductIdLayout({ children, params }: ProductLayoutProps) {
  const { id } = await params;
  const product = await loadProduct(id);

  if (!product) {
    return children;
  }

  const image = product.assets[0]?.url ?? siteConfig.ogImage;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: [image],
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "ZAR",
      price: parsePrice(product.price),
      availability: product.soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: `${siteConfig.url}/product/${product.numericId}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}
