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
  // Admin-editable SEO overrides — all optional, backend returns null
  // when the admin hasn't configured an override for the field.
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string[] | null;
  canonicalUrl?: string | null;
  noindex?: boolean;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
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

  // Auto-generated defaults — used when the admin hasn't set an override.
  const defaultTitle = product.brandName
    ? `${product.brandName} ${product.title} | Designer ${category} | Vernont`
    : `${product.title} | Designer ${category} | Vernont`;

  const baseDescription = product.description?.substring(0, 80) || product.title;
  const defaultDescription = (product.brandName
    ? `Shop ${product.brandName} ${product.title}. Authentic designer ${category.toLowerCase()}. Free UK delivery & 30-day returns. ${baseDescription}`
    : `Shop ${product.title}. Authentic designer ${category.toLowerCase()}. Free UK delivery & 30-day returns. ${baseDescription}`
  ).substring(0, 160);

  // Override resolution: backend-edited meta wins, everything else falls
  // back to the auto-generated defaults above.
  const pageTitle = product.metaTitle?.trim() || defaultTitle;
  const description = product.metaDescription?.trim() || defaultDescription;

  // OG / share-card fields cascade: og* override → meta* override → auto.
  const ogTitle = product.ogTitle?.trim() || pageTitle;
  const ogDescription = product.ogDescription?.trim() || description;
  const shareImage = product.ogImageUrl?.trim() || product.thumbnail || product.images?.[0];

  // Canonical: admin override wins, otherwise the product's own path.
  const canonicalPath = `/product/${product.handle || id}`;
  const canonical = product.canonicalUrl?.trim() || canonicalPath;

  // Keywords: admin-supplied list wins. Falls back to a computed default
  // that blends brand + title + category for legacy PDPs.
  const keywords =
    product.metaKeywords && product.metaKeywords.length > 0
      ? product.metaKeywords
      : [
          product.brandName || "",
          product.title,
          `designer ${category.toLowerCase()}`,
          "luxury eyewear",
          "authentic designer glasses",
          category.toLowerCase(),
        ].filter(Boolean);

  // Robots: if the admin flagged noindex, emit the directive and also
  // block Googlebot explicitly. Otherwise use the standard indexable
  // defaults from the root layout.
  const robots = product.noindex
    ? { index: false, follow: true, googleBot: { index: false, follow: true } }
    : undefined;

  // Map backend availability status to Open Graph product:availability values.
  // Spec expects the two-word forms "instock" / "out of stock" for the
  // product namespace tags emitted via the `other` Metadata field.
  const mapAvailability = (status: string | null | undefined): string | null => {
    if (!status) return null;
    const normalized = status.toLowerCase().trim();
    if (normalized === "instock" || normalized.includes("in stock") || normalized.includes("available")) {
      return "instock";
    }
    if (normalized.includes("out of stock") || normalized.includes("discontinued")) {
      return "out of stock";
    }
    if (normalized.includes("preorder")) return "preorder";
    return null;
  };

  // Build product-specific Open Graph tags for the `other` metadata field.
  // Only emit keys whose source values are defined so we never render empty
  // meta tags in the HTML head.
  const productTags: Record<string, string> = {};

  if (product.price !== null && product.price !== undefined) {
    productTags["product:price:amount"] = product.price.toFixed(2);
  }

  if (product.currency) {
    productTags["product:price:currency"] = product.currency;
  }

  const mappedAvailability = mapAvailability(product.availability);
  if (mappedAvailability) {
    productTags["product:availability"] = mappedAvailability;
  }

  if (product.condition) {
    productTags["product:condition"] = product.condition.toLowerCase();
  }

  if (product.brandName) {
    productTags["product:brand"] = product.brandName;
  }

  if (product.sku) {
    productTags["product:retailer_item_id"] = product.sku;
  }

  // Whether to upgrade og:type to "product". Only do so when we actually
  // have product namespace tags to emit — otherwise keep the default
  // "website" type for the share card. We override og:type via the `other`
  // field because Next.js's typed OpenGraph union doesn't include "product".
  const hasProductTags = Object.keys(productTags).length > 0;
  if (hasProductTags) {
    productTags["og:type"] = "product";
  }

  return {
    title: pageTitle,
    description,
    keywords,
    robots,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: shareImage ? [{ url: shareImage, width: 1200, height: 630 }] : [],
      url: `${SITE_URL}${canonicalPath}`,
    },
    other: hasProductTags ? productTags : undefined,
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: shareImage ? [shareImage] : [],
      // Twitter also supports product-specific fields
      ...(product.price !== null && product.price !== undefined
        ? {
            data1: `${product.currency || "GBP"} ${product.price.toFixed(2)}`,
            label1: "Price",
          }
        : {}),
      ...(product.brandName
        ? {
            data2: product.brandName,
            label2: "Brand",
          }
        : {}),
    },
    alternates: {
      canonical,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductPageClient id={id} />;
}
