import type { Metadata } from "next";
import { getVertical } from "@/config/vertical";
import CategoryPageClient from "@/app/category/[handle]/CategoryPageClient";
import { BreadcrumbJsonLd } from "@/components/ProductJsonLd";

const SITE_URL = "https://vernont.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type CategoryShape = {
  id?: string;
  name?: string | null;
  handle?: string | null;
  description?: string | null;
};

type TopProduct = {
  id: string;
  name?: string | null;
  title?: string | null;
  handle?: string | null;
  slug?: string | null;
};

async function fetchCategory(handle: string): Promise<CategoryShape | null> {
  try {
    const direct = await fetch(`${API_URL}/store/categories/${handle}`, {
      next: { revalidate: 300, tags: ["products"] },
    });
    if (direct.ok) {
      const data = (await direct.json()) as
        | { product_category?: CategoryShape; category?: CategoryShape }
        | CategoryShape;
      const anyData = data as {
        product_category?: CategoryShape;
        category?: CategoryShape;
      } & CategoryShape;
      return anyData.product_category ?? anyData.category ?? (data as CategoryShape) ?? null;
    }

    // Fallback: categories under /store/product-categories
    const fallback = await fetch(
      `${API_URL}/store/product-categories?handle=${encodeURIComponent(handle)}`,
      { next: { revalidate: 300, tags: ["products"] } }
    );
    if (!fallback.ok) return null;
    const data = (await fallback.json()) as {
      product_categories?: CategoryShape[];
    };
    return data?.product_categories?.[0] ?? null;
  } catch {
    return null;
  }
}

async function fetchCategoryProducts(
  handle: string,
  categoryId?: string,
  productType?: string
): Promise<TopProduct[]> {
  try {
    const params = new URLSearchParams({ size: "12" });
    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.set("category", handle);
    }
    if (productType) {
      params.set("productType", productType);
    }
    const res = await fetch(`${API_URL}/storefront/products?${params.toString()}`, {
      next: { revalidate: 300, tags: ["products"] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: TopProduct[] };
    return Array.isArray(data?.items) ? data.items.slice(0, 12) : [];
  } catch {
    return [];
  }
}

function humanizeHandle(handle: string) {
  return handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, " ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string; handle: string }>;
}): Promise<Metadata> {
  const { vertical, handle } = await params;
  const config = getVertical(vertical);
  try {
    const category = await fetchCategory(handle);
    const name = category?.name || humanizeHandle(handle);
    const verticalLabel = config?.label || humanizeHandle(vertical);
    const title = `${name} | ${verticalLabel} | Vernont`;
    const description =
      category?.description && category.description.trim().length > 0
        ? category.description
        : `Shop ${name.toLowerCase()} ${verticalLabel.toLowerCase()} from the world's most prestigious designer brands. Free UK delivery and 30-day returns.`;
    return {
      title,
      description,
      alternates: { canonical: `/${vertical}/category/${handle}` },
      openGraph: {
        title,
        description,
        type: "website",
        url: `${SITE_URL}/${vertical}/category/${handle}`,
      },
    };
  } catch {
    return {
      title: "Category | Vernont",
      description: "Browse our designer collection.",
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

export default async function VerticalCategoryPage({
  params,
}: {
  params: Promise<{ vertical: string; handle: string }>;
}) {
  const { vertical, handle } = await params;
  const config = getVertical(vertical);
  const category = await fetchCategory(handle);
  const products = await fetchCategoryProducts(
    handle,
    category?.id,
    config?.productType
  );
  const categoryName = category?.name || humanizeHandle(handle);
  const verticalLabel = config?.label || humanizeHandle(vertical);

  const itemListLd = buildItemListJsonLd(products);

  // All JSON-LD values are from our own backend and config -- safe to render.
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: verticalLabel, url: `${SITE_URL}/${vertical}` },
          { name: categoryName, url: `${SITE_URL}/${vertical}/category/${handle}` },
        ]}
      />
      {itemListLd && (
        <script
          type="application/ld+json"
          // Safe: JSON.stringify of internally-defined schema.org data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}
      <CategoryPageClient />
    </>
  );
}
