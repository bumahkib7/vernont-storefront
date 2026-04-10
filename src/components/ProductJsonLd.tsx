import type { Product as ApiProduct, ReviewStats } from "@/lib/schemas";

interface ProductJsonLdProps {
  product: ApiProduct;
  url: string;
  reviewStats?: ReviewStats | null;
}

export function ProductJsonLd({ product, url, reviewStats }: ProductJsonLdProps) {
  // Get first variant for pricing
  const variant = product.variants?.[0];
  const price = variant?.priceMinor
    ? variant.priceMinor / 100
    : product.lowestPriceMinor
      ? product.lowestPriceMinor / 100
      : 0;
  const currency = variant?.currency?.toUpperCase() || product.currency?.toUpperCase() || "GBP";

  // Get images - ensure we have an array
  const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls
    : product.thumbnail
      ? [product.thumbnail]
      : [];

  // Determine availability status
  const inventoryQuantity = variant?.inventoryQuantity ?? 0;
  let availabilityStatus = "https://schema.org/InStock";
  if (inventoryQuantity === 0) {
    availabilityStatus = "https://schema.org/OutOfStock";
  } else if (inventoryQuantity < 5) {
    availabilityStatus = "https://schema.org/LimitedAvailability";
  }

  // Map product condition
  const itemCondition = product.condition?.toLowerCase() === "new"
    ? "https://schema.org/NewCondition"
    : product.condition?.toLowerCase() === "used"
      ? "https://schema.org/UsedCondition"
      : "https://schema.org/RefurbishedCondition";

  // Build the JSON-LD schema
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || `${product.title} - Available at Vernont`,
    image: images,
    sku: variant?.sku || product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || "Vernont",
    },
    url: url,
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: availabilityStatus,
      itemCondition: itemCondition,
      seller: {
        "@type": "Organization",
        name: "Vernont",
        url: "https://vernont.com",
      },
    },
  };

  // Add MPN if available
  if (variant?.sku) {
    jsonLd.mpn = variant.sku;
  }

  // Add compareAt price if available
  if (variant?.compareAtPriceMinor && variant.compareAtPriceMinor > (variant.priceMinor || 0)) {
    jsonLd.offers.priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }

  // Add aggregateRating if reviews exist
  if (reviewStats && reviewStats.total_reviews > 0 && reviewStats.average_rating) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviewStats.average_rating.toFixed(1),
      reviewCount: reviewStats.total_reviews,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Breadcrumb JSON-LD for product pages
interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Organization JSON-LD for the store
interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  socialLinks?: {
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    youtube?: string | null;
    linkedin?: string | null;
  };
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
  description,
  socialLinks,
}: OrganizationJsonLdProps) {
  const sameAs = [
    socialLinks?.facebook,
    socialLinks?.instagram,
    socialLinks?.twitter,
    socialLinks?.youtube,
    socialLinks?.linkedin,
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// WebSite JSON-LD with search action
interface WebsiteJsonLdProps {
  name: string;
  url: string;
  searchUrl?: string;
}

export function WebsiteJsonLd({ name, url, searchUrl }: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    ...(searchUrl && {
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${searchUrl}?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
