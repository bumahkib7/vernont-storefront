import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchProduct(handle: string) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/storefront/products?size=100`,
      { next: { revalidate: 300 } },
    );
    if (!response.ok) return null;
    const data = await response.json();
    const product = data.items?.find(
      (p: any) => p.handle === handle || p.id === handle,
    );
    return product || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const title = product.title;
  const description = product.description?.substring(0, 160) || `Shop ${title} at Vernont`;
  const thumbnail = product.thumbnail || product.imageUrls?.[0];
  const canonicalPath = `/product/${product.handle || id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: thumbnail ? [{ url: thumbnail, width: 1200, height: 630 }] : [],
      url: `${SITE_URL}${canonicalPath}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: thumbnail ? [thumbnail] : [],
    },
    alternates: {
      canonical: canonicalPath,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductPageClient id={id} />;
}
