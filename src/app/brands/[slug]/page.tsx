import type { Metadata } from "next";
import BrandDetailPageClient from "./BrandDetailPageClient";
import { BreadcrumbJsonLd } from "@/components/ProductJsonLd";

const SITE_URL = "https://vernont.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type BrandShape = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
};

type TopProduct = {
  id: string;
  name?: string | null;
  title?: string | null;
  handle?: string | null;
  slug?: string | null;
};

async function fetchBrand(slug: string): Promise<BrandShape | null> {
  try {
    const res = await fetch(`${API_URL}/store/brands/${slug}`, {
      next: { revalidate: 300, tags: ["products"] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { brand?: BrandShape } & BrandShape;
    return data?.brand ?? (data as BrandShape) ?? null;
  } catch {
    return null;
  }
}

async function fetchBrandProducts(brandId: string): Promise<TopProduct[]> {
  try {
    const res = await fetch(
      `${API_URL}/storefront/products?size=12&brandId=${encodeURIComponent(brandId)}`,
      { next: { revalidate: 300, tags: ["products"] } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: TopProduct[] };
    return Array.isArray(data?.items) ? data.items.slice(0, 12) : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const brand = await fetchBrand(slug);
    if (!brand || !brand.name) {
      return {
        title: "Brand not found | Vernont",
        description: "The brand you're looking for isn't available.",
      };
    }
    const title = `${brand.name} Eyewear | Designer Sunglasses & Frames | Vernont`;
    const description = `Shop authentic ${brand.name} eyewear. Designer sunglasses and optical frames with free UK delivery and 30-day returns.`;
    return {
      title,
      description,
      alternates: { canonical: `/brands/${slug}` },
      openGraph: {
        title,
        description,
        type: "website",
        url: `${SITE_URL}/brands/${slug}`,
      },
    };
  } catch {
    return {
      title: "Brand not found | Vernont",
      description: "The brand you're looking for isn't available.",
    };
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

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await fetchBrand(slug);
  const products = brand?.id ? await fetchBrandProducts(brand.id) : [];

  const itemListLd = buildItemListJsonLd(products);

  return (
    <>
      {brand?.name && (
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Eyewear", url: `${SITE_URL}/eyewear` },
            { name: brand.name, url: `${SITE_URL}/brands/${slug}` },
          ]}
        />
      )}
      {itemListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}
      <BrandDetailPageClient />
    </>
  );
}
