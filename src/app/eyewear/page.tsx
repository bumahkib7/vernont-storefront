import type { Metadata } from "next";
import EyewearPageClient from "./EyewearPageClient";
import { SEO_FAQS } from "@/config/seo/eyewear-faqs";
import { BreadcrumbJsonLd } from "@/components/ProductJsonLd";

export const metadata: Metadata = {
  title: "Shop Designer Eyewear | Sunglasses & Optical Frames",
  description:
    "Explore our curated collection of designer sunglasses and optical frames from Prada, Ray-Ban, Miu Miu, Celine, Oliver Peoples, Oakley, Tom Ford. Free UK delivery, 30-day returns.",
  alternates: { canonical: "/eyewear" },
  openGraph: {
    title: "Shop Designer Eyewear | Vernont",
    description:
      "Authentic designer sunglasses and optical frames curated from the world's most prestigious brands.",
    type: "website",
    url: "https://vernont.com/eyewear",
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
  try {
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
  } catch {
    return null;
  }
}

function buildFaqJsonLd() {
  try {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: SEO_FAQS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: {
          "@type": "Answer",
          text: a,
        },
      })),
    };
  } catch {
    return null;
  }
}

export default async function EyewearPage() {
  const topProducts = await fetchTopProducts("size=12&sortBy=featured");

  const itemListLd = buildItemListJsonLd(topProducts);
  const faqLd = buildFaqJsonLd();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Eyewear", url: `${SITE_URL}/eyewear` },
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
      <EyewearPageClient />
    </>
  );
}
