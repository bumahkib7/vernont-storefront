import type { Metadata } from "next";
import { getVertical, getAllVerticals } from "@/config/vertical";
import { CatalogPageClient } from "@/components/catalog/CatalogPageClient";
import { BreadcrumbJsonLd } from "@/components/ProductJsonLd";

const SITE_URL = "https://vernont.com";

function humanizeHandle(handle: string) {
  return handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, " ");
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
  const verticalLabel = config?.label || humanizeHandle(vertical);

  const title = `${verticalLabel} New Arrivals | Vernont`;
  const description = `Discover the latest ${verticalLabel.toLowerCase()} arrivals at Vernont. Shop new designer products with free UK delivery and 30-day returns.`;

  return {
    title,
    description,
    alternates: { canonical: `/${vertical}/new` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${vertical}/new`,
    },
  };
}

export default async function VerticalNewArrivalsPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  const config = getVertical(vertical);
  const verticalLabel = config?.label || humanizeHandle(vertical);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: verticalLabel, url: `${SITE_URL}/${vertical}` },
          { name: "New Arrivals", url: `${SITE_URL}/${vertical}/new` },
        ]}
      />
      <CatalogPageClient verticalId={vertical} />
    </>
  );
}
