import type { Metadata } from "next";
import { getVertical, getAllVerticals } from "@/config/vertical";
import { VerticalBlogClient } from "@/components/catalog/VerticalBlogClient";

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
    return { title: "Blog | Vernont" };
  }

  const title = `${config.label} Blog | Vernont`;
  const description = `Read our latest articles about ${config.label.toLowerCase()}. Expert guides, style tips, and brand spotlights.`;

  return {
    title,
    description,
    alternates: { canonical: `/${vertical}/blog` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://vernont.com/${vertical}/blog`,
    },
  };
}

export default async function VerticalBlogPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  return <VerticalBlogClient verticalId={vertical} />;
}
