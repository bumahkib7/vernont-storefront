import type { Metadata } from "next";
import BagsPageClient from "./BagsPageClient";
import { bagsConfig } from "@/config/vertical/bags";
import { BreadcrumbJsonLd } from "@/components/ProductJsonLd";

const { siteMetadata } = bagsConfig.content;

export const metadata: Metadata = {
  title: siteMetadata.titleDefault,
  description: siteMetadata.description,
  alternates: { canonical: "/bags" },
  openGraph: {
    title: siteMetadata.titleDefault,
    description: siteMetadata.description,
    type: "website",
    url: "https://vernont.com/bags",
  },
};

const SITE_URL = "https://vernont.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type TopProduct = {
  id: string;
  name?: string | null;
  title?: string | null;
  handle?: string | null;
  slug?: string | null;
};

async function fetchTopProducts(): Promise<TopProduct[]> {
  try {
    const res = await fetch(`${API_URL}/storefront/products?size=12&sortBy=featured&productType=BAGS`, {
      next: { revalidate: 300, tags: ["products"] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: TopProduct[] };
    return Array.isArray(data?.items) ? data.items.slice(0, 12) : [];
  } catch {
    return [];
  }
}

function buildItemListJsonLd(products: TopProduct[]) {
  if (!products.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/product/${p.handle ?? p.slug ?? p.id}`,
      name: p.name ?? p.title ?? "Product",
    })),
  };
}

function buildFaqJsonLd() {
  const faqs = bagsConfig.seoContent.faqs;
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// Note: JSON-LD uses trusted content from our own config files, not user input.
// This follows the same pattern established in /eyewear/page.tsx.
export default async function BagsPage() {
  const topProducts = await fetchTopProducts();
  const itemListLd = buildItemListJsonLd(topProducts);
  const faqLd = buildFaqJsonLd();

  // JSON-LD script tags use dangerouslySetInnerHTML with JSON.stringify of
  // our own config objects — safe since the content is developer-authored,
  // not derived from user input.
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Bags", url: `${SITE_URL}/bags` },
        ]}
      />
      {itemListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <BagsPageClient />
    </>
  );
}
