import type { Metadata } from "next";
import ShoesPageClient from "./ShoesPageClient";
import { shoesConfig } from "@/config/vertical/shoes";
import { BreadcrumbJsonLd } from "@/components/ProductJsonLd";

const { siteMetadata } = shoesConfig.content;

export const metadata: Metadata = {
  title: siteMetadata.titleDefault,
  description: siteMetadata.description,
  alternates: { canonical: "/shoes" },
  openGraph: {
    title: siteMetadata.titleDefault,
    description: siteMetadata.description,
    type: "website",
    url: "https://vernont.com/shoes",
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
    const res = await fetch(`${API_URL}/storefront/products?size=12&sortBy=featured&productType=SHOES`, {
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
  const { faqs } = shoesConfig.seoContent;
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

// Note: JSON-LD structured data uses string serialization of trusted, internally-defined
// content from our own config files (not user input), following the same pattern as /eyewear.
export default async function ShoesPage() {
  const topProducts = await fetchTopProducts();
  const itemListLd = buildItemListJsonLd(topProducts);
  const faqLd = buildFaqJsonLd();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Shoes", url: `${SITE_URL}/shoes` },
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
      <ShoesPageClient />
    </>
  );
}
