import type { Product as ApiProduct } from "@/lib/schemas";

interface ProductJsonLdProps {
  product: ApiProduct;
  url: string;
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  // Get first variant for pricing
  const variant = product.variants?.[0];
  const price = variant?.priceMinor
    ? variant.priceMinor / 100
    : product.lowestPriceMinor
      ? product.lowestPriceMinor / 100
      : 0;
  const currency = variant?.currency?.toUpperCase() || product.currency?.toUpperCase() || "GBP";

  // Get images
  const images = product.imageUrls || [];
  const thumbnail = product.thumbnail || images[0];

  // Build the JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: images.length > 0 ? images : thumbnail ? [thumbnail] : undefined,
    sku: variant?.sku || product.id,
    mpn: variant?.sku,
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
      availability:
        variant?.inventoryQuantity && variant.inventoryQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/InStock", // Default to in stock if unknown
      seller: {
        "@type": "Organization",
        name: "Vernont",
      },
    },
  };

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
