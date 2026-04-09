import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";

interface Props {
  params: Promise<{ id: string }>;
}

interface ProductSeoData {
  title: string;
  description: string | null;
  handle: string;
  thumbnail: string | null;
  images: string[];
  brandName: string | null;
  price: number | null;
  currency: string;
  availability: string;
  sku: string | null;
  condition: string;
  reviewCount: number;
  averageRating: number | null;
  updatedAt: string | null;
}

async function fetchProductSeo(handle: string): Promise<ProductSeoData | null> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/store/seo/products/${encodeURIComponent(handle)}`,
      { next: { revalidate: 60, tags: ["products"] } },
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductSeo(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const pageTitle = product.brandName
    ? `${product.title} by ${product.brandName} | Vernont`
    : `${product.title} | Vernont`;
  const description = product.description?.substring(0, 160) || `Shop ${product.title} at Vernont`;
  const thumbnail = product.thumbnail || product.images?.[0];
  const canonicalPath = `/product/${product.handle || id}`;

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      type: "article",
      images: thumbnail ? [{ url: thumbnail, width: 1200, height: 630 }] : [],
      url: `${SITE_URL}${canonicalPath}`,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
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
