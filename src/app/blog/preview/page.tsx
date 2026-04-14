"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlockRenderer, type BlogBlock } from "@/components/blog/BlockRenderer";
import { AuthorCard } from "@/components/blog/AuthorCard";
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
  author?: {
    name: string;
    credential?: string | null;
    avatar?: string | null;
  } | null;
  blocks?: BlogBlock[];
}

function PreviewContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No preview token provided.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetch(
      `${API_BASE}/store/blog/v2/preview?token=${encodeURIComponent(token)}`,
      { credentials: "include" }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or expired preview token.");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="w-full max-w-[800px] mx-auto px-4 py-20">
        <div className="h-8 bg-[#FAFAFA] animate-pulse w-3/4 mb-4" />
        <div className="h-5 bg-[#FAFAFA] animate-pulse w-full mb-2" />
        <div className="h-5 bg-[#FAFAFA] animate-pulse w-2/3" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="w-full max-w-[800px] mx-auto px-4 py-20 text-center">
        <h1
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
        >
          Preview Unavailable
        </h1>
        <p className="text-sm text-[#666]">
          {error || "The preview link is invalid or has expired."}
        </p>
      </div>
    );
  }

  const coverUrl = resolveImageUrl(post.coverImageUrl);

  return (
    <>
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

      <article className="w-full max-w-[800px] mx-auto px-4 lg:px-8 pt-10 pb-16">
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

        <h1
          className="text-3xl md:text-4xl text-[#1A1A1A] mb-4 leading-tight"
          style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
        >
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="text-[16px] text-[#666] leading-relaxed mb-6">
            {post.subtitle}
          </p>
        )}

        <div className="flex items-center gap-3 text-[12px] text-[#999] mb-10 pb-8 border-b border-[#E5E5E5]">
          {post.author?.name && (
            <span className="font-medium text-[#1A1A1A]">
              {post.author.name}
            </span>
          )}
        </div>

        {post.blocks && post.blocks.length > 0 && (
          <BlockRenderer blocks={post.blocks} />
        )}

        {post.author && <AuthorCard author={post.author} />}
      </article>
    </>
  );
}

export default function BlogPreviewPage() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] w-full">
      {/* Preview banner */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white text-center py-2 text-sm font-semibold tracking-wider">
        PREVIEW
      </div>
      <div className="pt-10">
        <Header />
        <main className="w-full">
          <Suspense
            fallback={
              <div className="w-full max-w-[800px] mx-auto px-4 py-20">
                <div className="h-8 bg-[#FAFAFA] animate-pulse w-3/4 mb-4" />
                <div className="h-5 bg-[#FAFAFA] animate-pulse w-full mb-2" />
                <div className="h-5 bg-[#FAFAFA] animate-pulse w-2/3" />
              </div>
            }
          >
            <PreviewContent />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
