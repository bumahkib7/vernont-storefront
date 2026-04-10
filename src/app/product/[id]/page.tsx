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
      title: "Product Not Found | Vernont",
      description: "The product you're looking for could not be found.",
    };
  }

  // Determine category type (Sunglasses, Optical Frames, etc.)
  const category = product.title?.toLowerCase().includes("optical")
    ? "Optical Frames"
    : "Sunglasses";

  // Build SEO-optimized title: "{Brand} {ProductName} | Designer {Category} | Vernont"
  const pageTitle = product.brandName
    ? `${product.brandName} ${product.title} | Designer ${category} | Vernont`
    : `${product.title} | Designer ${category} | Vernont`;

  // Enhanced description with brand, benefits, and call-to-action (155-160 chars)
  const baseDescription = product.description?.substring(0, 80) || product.title;
  const description = product.brandName
    ? `Shop ${product.brandName} ${product.title}. Authentic designer ${category.toLowerCase()}. Free UK delivery & 30-day returns. ${baseDescription}`.substring(0, 160)
    : `Shop ${product.title}. Authentic designer ${category.toLowerCase()}. Free UK delivery & 30-day returns. ${baseDescription}`.substring(0, 160);

  const thumbnail = product.thumbnail || product.images?.[0];
  const canonicalPath = `/product/${product.handle || id}`;

  // Build keywords array
  const keywords = [
    product.brandName || "",
    product.title,
    `designer ${category.toLowerCase()}`,
    "luxury eyewear",
    "authentic designer glasses",
    category.toLowerCase(),
  ].filter(Boolean);

  return {
    title: pageTitle,
    description,
    keywords,
    openGraph: {
      title: pageTitle,
      description,
      type: "website",
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
