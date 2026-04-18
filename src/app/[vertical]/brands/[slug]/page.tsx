import type { Metadata } from "next";
import { getVertical } from "@/config/vertical";
import BrandDetailPageClient from "@/app/brands/[slug]/BrandDetailPageClient";
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

async function fetchBrandProducts(
  brandId: string,
  productType: string
): Promise<TopProduct[]> {
  try {
    const res = await fetch(
      `${API_URL}/storefront/products?size=12&brandId=${encodeURIComponent(brandId)}&productType=${encodeURIComponent(productType)}`,
      { next: { revalidate: 300, tags: ["products"] } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: TopProduct[] };
    return Array.isArray(data?.items) ? data.items.slice(0, 12) : [];
  } catch {
    return [];
  }
}

function humanizeHandle(handle: string) {
  return handle
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string; slug: string }>;
}): Promise<Metadata> {
  const { vertical, slug } = await params;
  const config = getVertical(vertical);
  try {
    const brand = await fetchBrand(slug);
    if (!brand || !brand.name) {
      return {
        title: "Brand not found | Vernont",
        description: "The brand you're looking for isn't available.",
      };
    }
    const verticalLabel = config?.label || humanizeHandle(vertical);
    const title = `${brand.name} ${verticalLabel} | Vernont`;
    const description = `Shop authentic ${brand.name} ${verticalLabel.toLowerCase()}. Designer products with free UK delivery and 30-day returns.`;
    return {
      title,
      description,
      alternates: { canonical: `/${vertical}/brands/${slug}` },
      openGraph: {
        title,
        description,
        type: "website",
        url: `${SITE_URL}/${vertical}/brands/${slug}`,
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

export default async function VerticalBrandDetailPage({
  params,
}: {
  params: Promise<{ vertical: string; slug: string }>;
}) {
  const { vertical, slug } = await params;
  const config = getVertical(vertical);
  const brand = await fetchBrand(slug);
  const products =
    brand?.id && config
      ? await fetchBrandProducts(brand.id, config.productType)
      : [];
  const verticalLabel = config?.label || humanizeHandle(vertical);

  const itemListLd = buildItemListJsonLd(products);

  // JSON-LD: safe -- all values from our own backend, not user input.
  return (
    <>
      {brand?.name && (
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: `${SITE_URL}/` },
            { name: verticalLabel, url: `${SITE_URL}/${vertical}` },
            { name: "Brands", url: `${SITE_URL}/${vertical}/brands` },
            { name: brand.name, url: `${SITE_URL}/${vertical}/brands/${slug}` },
          ]}
        />
      )}
      {itemListLd && (
        <script
          type="application/ld+json"
          // Safe: JSON.stringify of server-fetched product data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}
      <BrandDetailPageClient />
    </>
  );
}
