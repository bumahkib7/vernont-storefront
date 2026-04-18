"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogCard, type BlogCardPost } from "@/components/blog/BlogCard";
import { getVertical } from "@/config/vertical";
import type { VerticalConfig } from "@/config/vertical";

const CATEGORIES = ["All", "Guides", "Editorial", "Expert"] as const;
const PAGE_SIZE = 12;

const API_BASE =
  typeof window !== "undefined" && process.env.NODE_ENV === "production"
    ? "/api/proxy"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface BlogListResponse {
  posts: BlogCardPost[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}

export function VerticalBlogClient({ verticalId }: { verticalId: string }) {
  const config = getVertical(verticalId);
  if (!config) return null;

  return <VerticalBlogInner config={config} />;
}

function VerticalBlogInner({ config }: { config: VerticalConfig }) {
  const [posts, setPosts] = useState<BlogCardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const fetchPosts = useCallback(async (p: number, category: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        size: String(PAGE_SIZE),
      });
      if (category !== "All") {
        params.set("category", category.toLowerCase());
      }
      params.set("productType", config.productType);
      const res = await fetch(
        `${API_BASE}/store/blog/v2/posts?${params.toString()}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data: BlogListResponse = await res.json();
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [config.productType]);

  useEffect(() => {
    fetchPosts(page, activeCategory);
  }, [page, activeCategory, fetchPosts]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] w-full">
      <Header />

      <main className="w-full">
        {/* Hero header */}
        <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 pt-16 pb-10 text-center">
          <h1 className="text-[13px] font-bold tracking-[0.2em] uppercase mb-4">
            {config.label} Journal
          </h1>
          <p className="text-[14px] text-[#666] max-w-[500px] mx-auto">
            Insights into the world of {config.label.toLowerCase()}
          </p>
        </section>

        {/* Category tabs */}
        <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mb-10">
          <div className="flex items-center justify-center gap-6 border-b border-[#E5E5E5]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`pb-3 text-[12px] uppercase tracking-widest font-medium transition-colors ${
                  activeCategory === cat
                    ? "text-[#1A1A1A] border-b-2 border-[#1A1A1A]"
                    : "text-[#999] hover:text-[#666]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 pb-16">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-[16/9] bg-[#FAFAFA] animate-pulse mb-4" />
                  <div className="h-5 bg-[#FAFAFA] animate-pulse w-3/4 mb-2" />
                  <div className="h-4 bg-[#FAFAFA] animate-pulse w-full mb-1" />
                  <div className="h-4 bg-[#FAFAFA] animate-pulse w-2/3" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-[#999] text-sm">
              No articles found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-6 mt-16">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-6 py-2.5 text-[11px] uppercase tracking-widest font-medium border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1A1A1A]"
              >
                Previous
              </button>
              <span className="text-[12px] text-[#999]">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={page >= totalPages - 1}
                className="px-6 py-2.5 text-[11px] uppercase tracking-widest font-medium bg-[#1A1A1A] text-white hover:bg-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
