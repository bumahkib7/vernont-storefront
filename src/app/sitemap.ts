import { MetadataRoute } from "next";
import { getAllVerticals } from "@/config/vertical";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const revalidate = 300; // 5 min — short so sitemap updates propagate quickly

const staticPages = [
  { url: "/", priority: 1.0, changeFrequency: "daily" as const },
  // Vertical catalog pages (eyewear, shoes, bags, etc.) — auto-discovered from registry
  ...getAllVerticals().map((v) => ({
    url: v.catalogPath,
    priority: 0.9,
    changeFrequency: "daily" as const,
  })),
  { url: "/new", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/pre-owned", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/gifts", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/for-him", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/for-her", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/unisex", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/brands", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/contact", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/craftsmanship", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/imprint", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/press", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/size-guide", priority: 0.6, changeFrequency: "monthly" as const },

  { url: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/collections", priority: 0.8, changeFrequency: "weekly" as const },
  // NB: `/search` intentionally excluded — Google discourages indexing
  // internal search results; it wastes crawl budget.
  { url: "/return-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/sustainability", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/try-on", priority: 0.2, changeFrequency: "yearly" as const },
  { url: "/shipping", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/returns", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
];

interface SitemapEntry {
  path: string;
  lastModified: string | null;
  priority: number;
  changeFrequency: string;
}

interface SitemapData {
  products: SitemapEntry[];
  collections: SitemapEntry[];
  categories: SitemapEntry[];
  brands: SitemapEntry[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Static pages: omit lastModified entirely. A request-time timestamp is a
  // lie — Google detects churning `<lastmod>` and downgrades sitemap trust.
  const entries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  try {
    const response = await fetch(`${API_URL}/store/seo/sitemap`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error("Failed to fetch sitemap data:", response.status);
      return entries;
    }

    const data: SitemapData = await response.json();

    const allEntries = [
      ...data.products,
      ...data.collections,
      ...data.categories,
      ...data.brands,
    ];

    for (const entry of allEntries) {
      entries.push({
        url: `${BASE_URL}${entry.path}`,
        // Only include lastModified when the backend gave us a real DB timestamp.
        ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
        changeFrequency: entry.changeFrequency as any,
        priority: entry.priority,
      });
    }
  } catch (error) {
    console.error("Failed to fetch sitemap data from backend:", error);
  }

  // Blog posts
  try {
    const blogRes = await fetch(`${API_URL}/store/blog/v2/posts?size=500`, {
      next: { revalidate: 300 },
    });
    if (blogRes.ok) {
      const blogData = await blogRes.json();
      const posts: { slug: string; publishedAt?: string | null }[] = blogData.posts || [];
      for (const post of posts) {
        entries.push({
          url: `${BASE_URL}/blog/${post.slug}`,
          ...(post.publishedAt ? { lastModified: post.publishedAt } : {}),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
  }

  return entries;
}
