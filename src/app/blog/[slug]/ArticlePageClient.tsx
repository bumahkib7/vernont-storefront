"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlockRenderer, type BlogBlock } from "@/components/blog/BlockRenderer";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { BlogCard, type BlogCardPost } from "@/components/blog/BlogCard";
import { resolveImageUrl } from "@/lib/api";

const API_BASE =
  typeof window !== "undefined" && process.env.NODE_ENV === "production"
    ? "/api/proxy"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  category?: string | null;
  readingTimeMinutes?: number | null;
  publishedAt?: string | null;
  author?: { name: string; credential?: string | null; avatar?: string | null } | null;
  blocks?: BlogBlock[];
  postType?: string | null;
}

interface ArticlePageClientProps {
  post: BlogPost;
}

export function ArticlePageClient({ post }: ArticlePageClientProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogCardPost[]>([]);
  const coverUrl = resolveImageUrl(post.coverImageUrl);

  useEffect(() => {
    if (!post.category) return;
    let cancelled = false;
    const params = new URLSearchParams({
      category: post.category.toLowerCase(),
      size: "4",
    });
    fetch(`${API_BASE}/store/blog/v2/posts?${params.toString()}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.posts) {
          const filtered = (data.posts as BlogCardPost[]).filter(
            (p) => p.slug !== post.slug
          );
          setRelatedPosts(filtered.slice(0, 3));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [post.category, post.slug]);

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] w-full">
      <Header />

      <main className="w-full">
        {/* Cover image */}
        {coverUrl && (
          <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 pt-8">
            <div className="relative w-full aspect-[21/9] overflow-hidden">
              <Image
                src={coverUrl}
                alt={post.title}
                fill
                sizes="(max-width: 1400px) 100vw, 1400px"
                priority
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Article header */}
        <article className="w-full max-w-[800px] mx-auto px-4 lg:px-8 pt-10 pb-16">
          {/* Category + reading time */}
          <div className="flex items-center gap-3 mb-6">
            {post.category && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#999] bg-[#F5F5F5] px-2.5 py-1">
                {post.category}
              </span>
            )}
            {post.readingTimeMinutes && (
              <span className="text-[11px] text-[#999]">
                {post.readingTimeMinutes} min read
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl text-[#1A1A1A] mb-4 leading-tight"
            style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
          >
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className="text-[16px] text-[#666] leading-relaxed mb-6">
              {post.subtitle}
            </p>
          )}

          {/* Author + date */}
          <div className="flex items-center gap-3 text-[12px] text-[#999] mb-10 pb-8 border-b border-[#E5E5E5]">
            {post.author?.name && (
              <span className="font-medium text-[#1A1A1A]">
                {post.author.name}
              </span>
            )}
            {publishedDate && (
              <>
                <span className="w-px h-3 bg-[#DDD]" />
                <span>{publishedDate}</span>
              </>
            )}
          </div>

          {/* Block content */}
          {post.blocks && post.blocks.length > 0 && (
            <BlockRenderer blocks={post.blocks} />
          )}

          {/* Author card */}
          {post.author && <AuthorCard author={post.author} />}
        </article>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-16 border-t border-[#E5E5E5]">
            <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-center mb-12">
              RELATED ARTICLES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
