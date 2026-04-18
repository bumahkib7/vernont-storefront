import type { Metadata } from "next";
import { getVertical, getAllVerticals } from "@/config/vertical";
import { CatalogPageClient } from "@/components/catalog/CatalogPageClient";
import { BreadcrumbJsonLd } from "@/components/ProductJsonLd";

const SITE_URL = "https://vernont.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type TopProduct = {
  id: string;
  name?: string | null;
  title?: string | null;
  handle?: string | null;
  slug?: string | null;
};

async function fetchTopProducts(searchParams: string): Promise<TopProduct[]> {
  try {
    const res = await fetch(`${API_URL}/storefront/products?${searchParams}`, {
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

function buildFaqJsonLd(faqs: { q: string; a: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}

export async function generateStaticParams() {
  return getAllVerticals().map((v) => ({ vertical: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical } = await params;
  const config = getVertical(vertical);
  if (!config) {
    return { title: "Not Found" };
  }

  const { siteMetadata } = config.content;
  return {
    title: siteMetadata.titleDefault,
    description: siteMetadata.description,
    keywords: siteMetadata.keywords,
    alternates: { canonical: `/${vertical}` },
    openGraph: {
      title: siteMetadata.titleDefault,
      description: siteMetadata.description,
      type: "website",
      url: `${SITE_URL}/${vertical}`,
    },
  };
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  const config = getVertical(vertical)!;

  const topProducts = await fetchTopProducts(
    `size=12&sortBy=featured&productType=${encodeURIComponent(config.productType)}`
  );

  const itemListLd = buildItemListJsonLd(topProducts);
  const faqLd = buildFaqJsonLd(config.seoContent.faqs);

  // JSON-LD content is safe: all values come from our own vertical config
  // and server-fetched product data, not user-supplied input.
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: config.label, url: `${SITE_URL}/${vertical}` },
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
      <CatalogPageClient verticalId={vertical} />
    </>
  );
}
