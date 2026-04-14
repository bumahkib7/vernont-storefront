"use client";

import Image from "next/image";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/api";

export interface BlogCardPost {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  category?: string | null;
  readingTimeMinutes?: number | null;
  author?: { name: string; credential?: string | null; avatar?: string | null } | null;
  postType?: string | null;
}

interface BlogCardProps {
  post: BlogCardPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = resolveImageUrl(post.coverImageUrl) || "/images/placeholder.png";

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      {/* Cover image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#F5F5F5] mb-4">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {post.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">
            {post.category}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className="text-lg text-[#1A1A1A] mb-2 group-hover:opacity-70 transition-opacity leading-snug"
        style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
      >
        {post.title}
      </h3>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-sm text-[#666] line-clamp-2 mb-3 leading-relaxed">
          {post.excerpt}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 text-[11px] text-[#999]">
        {post.author?.name && <span>{post.author.name}</span>}
        {post.author?.name && post.readingTimeMinutes && (
          <span className="w-px h-3 bg-[#DDD]" />
        )}
        {post.readingTimeMinutes && (
          <span>{post.readingTimeMinutes} min read</span>
        )}
      </div>
    </Link>
  );
}
