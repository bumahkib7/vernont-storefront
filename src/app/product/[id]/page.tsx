import type { Metadata } from "next";
import { redirect } from "next/navigation";
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
  // Non-null when the requested slug is an old handle that now redirects.
  redirectedFromHandle?: string | null;
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

  // Build the product name without duplicating the brand when the title
  // already starts with it (e.g. "Tomford Tomford" → "Tomford").
  const productDisplayName = formatProductName(product.title, product.brandName);

  // Auto-generated defaults — used when the admin hasn't set an override.
  const defaultTitle = collapseSpaces(
    product.brandName && !product.title.toLowerCase().startsWith(product.brandName.toLowerCase())
      ? `${product.brandName} ${productDisplayName} | Designer ${category} | Vernont`
      : `${productDisplayName} | Designer ${category} | Vernont`
  );

  const baseDescription = product.description?.substring(0, 80) || productDisplayName;
  const defaultDescription = collapseSpaces(
    (product.brandName && !product.title.toLowerCase().startsWith(product.brandName.toLowerCase())
      ? `Shop ${product.brandName} ${productDisplayName}. Authentic designer ${category.toLowerCase()}. Free UK delivery & 30-day returns. ${baseDescription}`
      : `Shop ${productDisplayName}. Authentic designer ${category.toLowerCase()}. Free UK delivery & 30-day returns. ${baseDescription}`)
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

  // Robots gate: admin override wins. Otherwise auto-noindex products that
  // look like test/broken data (e.g. £2.69 designer sunglasses, no image,
  // or empty description) so Google doesn't waste crawl budget on them
  // and they don't drag down site-wide quality signals.
  const hasImage = Boolean(product.thumbnail || product.images?.[0]);
  const priceLooksBroken =
    product.price !== null && product.price !== undefined && product.price < 10;
  const hasDescription =
    (product.description && product.description.trim().length >= 40) ||
    (product.metaDescription && product.metaDescription.trim().length >= 40);
  const autoNoindex = priceLooksBroken || !hasImage || !hasDescription;

  const robots = product.noindex || autoNoindex
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
  const product = await fetchProductSeo(id);

  // When the requested handle is a retired one the backend resolves it to
  // the current product and flags `redirectedFromHandle`. Issue an HTTP 308
  // so search engines update their index and external links stay valid.
  if (product?.redirectedFromHandle && product.handle && product.handle !== id) {
    redirect(`/product/${product.handle}`);
  }

  return (
    <>
      {product && <ProductJsonLdScript product={product} id={id} />}
      {product && <ProductSeoContent product={product} />}
      <ProductPageClient id={id} />
    </>
  );
}

// ─── Server-rendered SEO pieces ──────────────────────────────────────────

function collapseSpaces(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function formatProductName(title: string, brandName: string | null): string {
  const cleanTitle = collapseSpaces(title || "");
  if (!brandName) return cleanTitle;
  const brand = brandName.trim();
  const lowerBrand = brand.toLowerCase();
  const lowerTitle = cleanTitle.toLowerCase();
  if (lowerTitle === lowerBrand) return brand;
  if (lowerTitle.startsWith(`${lowerBrand} `)) return cleanTitle;
  return cleanTitle;
}

// Product fields come from our own backend, not user input — but we still
// escape `<`, `>`, `&`, and U+2028/U+2029 so a product description that
// happens to contain `</script>` or unusual Unicode can't break out of the
// JSON-LD <script> tag or the surrounding JavaScript parser.
function safeJsonForScriptTag(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function ProductJsonLdScript({ product, id }: { product: ProductSeoData; id: string }) {
  const displayName = formatProductName(product.title, product.brandName);
  const availability = product.availability?.toLowerCase().includes("out")
    ? "https://schema.org/OutOfStock"
    : "https://schema.org/InStock";
  const itemCondition = product.condition?.toLowerCase().includes("refurb")
    ? "https://schema.org/RefurbishedCondition"
    : product.condition?.toLowerCase().includes("used")
      ? "https://schema.org/UsedCondition"
      : "https://schema.org/NewCondition";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName,
    description: product.description || undefined,
    sku: product.sku || undefined,
    image: product.images?.length
      ? product.images
      : product.thumbnail
        ? [product.thumbnail]
        : undefined,
    url: `${SITE_URL}/product/${product.handle || id}`,
    brand: product.brandName ? { "@type": "Brand", name: product.brandName } : undefined,
    itemCondition,
  };

  if (product.price !== null && product.price !== undefined) {
    jsonLd.offers = {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: (product.currency || "GBP").toUpperCase(),
      availability,
      url: `${SITE_URL}/product/${product.handle || id}`,
    };
  }

  if (
    product.averageRating !== null &&
    product.averageRating !== undefined &&
    product.reviewCount > 0
  ) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonForScriptTag(jsonLd) }}
    />
  );
}

function ProductSeoContent({ product }: { product: ProductSeoData }) {
  const displayName = formatProductName(product.title, product.brandName);
  const priceLabel =
    product.price !== null && product.price !== undefined
      ? `${(product.currency || "GBP").toUpperCase()} ${product.price.toFixed(2)}`
      : null;
  const heroImage = product.thumbnail || product.images?.[0];
  const headingText = product.brandName ? `${product.brandName} ${displayName}` : displayName;

  return (
    <div className="sr-only" aria-hidden="true">
      <h1>{headingText}</h1>
      {product.brandName && <p>Brand: {product.brandName}</p>}
      {priceLabel && <p>Price: {priceLabel}</p>}
      {product.availability && <p>Availability: {product.availability}</p>}
      {product.sku && <p>SKU: {product.sku}</p>}
      {product.description && <p>{product.description}</p>}
      {heroImage && <img src={heroImage} alt={displayName} />}
    </div>
  );
}
