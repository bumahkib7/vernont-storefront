import type { Metadata } from "next";
import { getVertical, getAllVerticals } from "@/config/vertical";
import { VerticalBrandsClient } from "@/components/catalog/VerticalBrandsClient";

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
    return { title: "Brands | Vernont" };
  }

  const title = `${config.label} Brands | Vernont`;
  const description = `Discover our curated selection of ${config.label.toLowerCase()} brands. Authentic designer products with free UK delivery and 30-day returns.`;

  return {
    title,
    description,
    alternates: { canonical: `/${vertical}/brands` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://vernont.com/${vertical}/brands`,
    },
  };
}

export default async function VerticalBrandsPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  return <VerticalBrandsClient verticalId={vertical} />;
}
