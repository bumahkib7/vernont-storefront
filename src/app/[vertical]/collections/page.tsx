import type { Metadata } from "next";
import { getVertical, getAllVerticals } from "@/config/vertical";
import { VerticalCollectionsClient } from "@/components/catalog/VerticalCollectionsClient";

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
    return { title: "Collections | Vernont" };
  }

  const title = `${config.label} Collections | Vernont`;
  const description = `Browse our curated ${config.label.toLowerCase()} collections. ${config.content.siteMetadata.description}`;

  return {
    title,
    description,
    alternates: { canonical: `/${vertical}/collections` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://vernont.com/${vertical}/collections`,
    },
  };
}

export default async function VerticalCollectionsPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  return <VerticalCollectionsClient verticalId={vertical} />;
}
