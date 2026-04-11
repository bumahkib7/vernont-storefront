import type { Metadata } from "next";
import CollectionPageClient from "./CollectionPageClient";
import { BreadcrumbJsonLd } from "@/components/ProductJsonLd";

const SITE_URL = "https://vernont.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type CollectionShape = {
  id?: string;
  title?: string | null;
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

async function fetchCollection(handle: string): Promise<CollectionShape | null> {
  try {
    const res = await fetch(`${API_URL}/store/collections/${handle}`, {
      next: { revalidate: 300, tags: ["products"] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { collection?: CollectionShape } & CollectionShape;
    return data?.collection ?? (data as CollectionShape) ?? null;
  } catch {
    return null;
  }
}

async function fetchCollectionProducts(handle: string): Promise<TopProduct[]> {
  try {
    const res = await fetch(
      `${API_URL}/store/collections/${handle}/products?limit=12`,
      { next: { revalidate: 300, tags: ["products"] } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { products?: TopProduct[] };
    return Array.isArray(data?.products) ? data.products.slice(0, 12) : [];
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
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  try {
    const collection = await fetchCollection(handle);
    const title = collection?.title || humanizeHandle(handle);
    const description =
      collection?.description && collection.description.trim().length > 0
        ? collection.description
        : `Shop ${title} collection. Curated designer eyewear with free UK delivery and 30-day returns.`;
    return {
      title: `${title} Collection | Designer Eyewear | Vernont`,
      description,
      alternates: { canonical: `/collections/${handle}` },
      openGraph: {
        title: `${title} Collection | Vernont`,
        description,
        type: "website",
        url: `${SITE_URL}/collections/${handle}`,
      },
    };
  } catch {
    return {
      title: "Collection | Vernont",
      description: "Browse our designer eyewear collection.",
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

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await fetchCollection(handle);
  const products = await fetchCollectionProducts(handle);
  const collectionTitle = collection?.title || humanizeHandle(handle);

  const itemListLd = buildItemListJsonLd(products);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Eyewear", url: `${SITE_URL}/eyewear` },
          { name: collectionTitle, url: `${SITE_URL}/collections/${handle}` },
        ]}
      />
      {itemListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}
      <CollectionPageClient />
    </>
  );
}
