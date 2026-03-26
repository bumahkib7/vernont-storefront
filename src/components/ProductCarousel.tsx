"use client";

import * as React from "react";
import Link from "next/link";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import type { DisplayProduct } from "@/lib/transforms";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  products: DisplayProduct[];
  isLoading?: boolean;
}

export function ProductCarousel({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View All",
  products,
  isLoading = false,
}: ProductCarouselProps) {
  return (
    <section className="py-10 lg:py-14">
      <div className="px-4 lg:px-6">
        {/* Section header — SGH style: serif heading, left-aligned */}
        <div className="mb-6">
          {subtitle && (
            <p className="text-sm text-[#1A1A1A] mb-2">{subtitle}</p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/3] bg-[#F5F5F5] animate-pulse mb-3" />
                <div className="space-y-2 flex flex-col items-center">
                  <div className="h-3 w-16 bg-[#F5F5F5] animate-pulse" />
                  <div className="h-3 w-12 bg-[#F5F5F5] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* SGH-style 6-column product grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8">
            {products.slice(0, 12).map((product, index) => (
              <EnhancedProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {viewAllHref && (
          <div className="mt-8 text-center lg:text-left">
            <Link
              href={viewAllHref}
              className="text-[12px] font-medium uppercase tracking-[0.08em] underline underline-offset-4 text-[#1A1A1A] hover:opacity-60 transition-opacity"
            >
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
