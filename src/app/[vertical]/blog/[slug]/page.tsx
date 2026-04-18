import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVertical } from "@/config/vertical";
import { ArticlePageClient } from "@/app/blog/[slug]/ArticlePageClient";
import { BreadcrumbJsonLd } from "@/components/ProductJsonLd";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";

interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  category?: string | null;
  readingTimeMinutes?: number | null;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  author?: { name: string; credential?: string | null; avatar?: string | null } | null;
  blocks?: { type: string; [key: string]: unknown }[];
  postType?: string | null;
}

async function fetchPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/store/blog/v2/posts/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
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
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return { title: "Article Not Found" };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || "";

  return {
    title,
    description,
    // Canonical points to global /blog/ to avoid duplicate content
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      ...(post.coverImageUrl ? { images: [{ url: post.coverImageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function VerticalBlogArticlePage({
  params,
}: {
  params: Promise<{ vertical: string; slug: string }>;
}) {
  const { vertical, slug } = await params;
  const config = getVertical(vertical);
  const post = await fetchPost(slug);
  if (!post) notFound();

  const verticalLabel = config?.label || humanizeHandle(vertical);

  // JSON-LD Article structured data -- safe: server-fetched from our own backend.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.author
      ? { author: { "@type": "Person", name: post.author.name } }
      : {}),
    publisher: {
      "@type": "Organization",
      name: "Vernont",
      url: SITE_URL,
    },
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: verticalLabel, url: `${SITE_URL}/${vertical}` },
          { name: "Blog", url: `${SITE_URL}/${vertical}/blog` },
          { name: post.title, url: `${SITE_URL}/${vertical}/blog/${slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        // Safe: JSON.stringify of our own backend data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlePageClient post={post} />
    </>
  );
}
