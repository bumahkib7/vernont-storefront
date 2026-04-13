"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown } from "@/components/icons";
import { PageLayout } from "@/components/layout/PageLayout";
import { ListingProductCard } from "@/components/ListingProductCard";
import { useProducts } from "@/lib/hooks";
import { transformProducts, filterByGender } from "@/lib/transforms";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function UnisexPage() {
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const { data: productsData, isLoading, error } = useProducts({ limit: 50 });

  const displayProducts = useMemo(() => {
    if (!productsData?.items) return [];
    const all = transformProducts(productsData.items);
    const filtered = filterByGender(all, "unisex");
    switch (sortBy) {
      case "price-low": return [...filtered].sort((a, b) => a.price - b.price);
      case "price-high": return [...filtered].sort((a, b) => b.price - a.price);
      case "newest": return [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default: return filtered;
    }
  }, [productsData, sortBy]);

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || "Featured";

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1920&q=80"
          alt="Unisex eyewear"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center text-white px-4"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-3">Collection</p>
          <h1
            className="text-4xl md:text-6xl tracking-wide mb-4"
            style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
          >
            Unisex
          </h1>
          <p className="text-sm md:text-base text-white/70 max-w-lg mx-auto">
            Frames that transcend trends, designed for exceptional craftsmanship
          </p>
        </motion.div>
      </section>

      {/* Products */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 md:py-16">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E5E5]">
          <p className="text-[13px] text-[#666]">
            {isLoading ? "Loading..." : `${displayProducts.length} frames`}
          </p>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-[12px] border border-[#E5E5E5] px-4 py-2 hover:border-[#1A1A1A] transition-colors"
            >
              Sort: {currentSortLabel}
              <CaretDown className={`h-3 w-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-full mt-1 bg-white border border-[#E5E5E5] shadow-lg z-20 min-w-[180px]"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                      className={`block w-full text-left px-4 py-2.5 text-[12px] hover:bg-[#F5F5F5] transition-colors ${
                        sortBy === opt.value ? "font-medium text-[#1A1A1A]" : "text-[#666]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-[#E5E5E5] p-2 lg:p-4 bg-white">
                <div className="w-full aspect-[4/3] bg-[#FAFAFA] mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="flex flex-col items-center gap-2 px-1 mb-2">
                  <div className="h-3 w-3/4 bg-[#F0F0F0] rounded-sm animate-pulse" />
                  <div className="h-3 w-1/3 bg-[#F0F0F0] rounded-sm animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-[#666] text-sm">Unable to load products. Please try again later.</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl mb-3" style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}>
              Coming Soon
            </h3>
            <p className="text-[#666] text-sm mb-6">Our unisex collection is being curated.</p>
            <Link
              href="/eyewear"
              className="inline-block px-8 py-3 bg-[#1A1A1A] text-white text-[12px] font-medium uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
            >
              Browse All Eyewear
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {displayProducts.map((product, index) => (
              <ListingProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
