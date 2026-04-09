"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, Sparkle, Circle } from "@phosphor-icons/react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ListingProductCard } from "@/components/ListingProductCard";
import { CategoryButtons } from "@/components/CategoryButtons";
import { useProducts } from "@/lib/hooks";
import { transformProducts, filterByGender } from "@/lib/transforms";
import { useHeroScroll } from "@/lib/useHeroScroll";

// Sort dropdown
function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  const currentLabel = options.find((o) => o.value === value)?.label || "Featured";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm border border-border px-4 py-2 hover:border-[var(--foreground)] transition-colors"
      >
        <span>Sort: {currentLabel}</span>
        <CaretDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 bg-card border border-border shadow-lg z-20 min-w-[200px]"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-sm hover:bg-secondary transition-colors ${
                  value === option.value ? "text-[var(--secondary)]" : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Loading skeleton
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="animate-pulse"
        >
          <div className="aspect-[3/4] bg-secondary relative">
            <div className="absolute inset-3 border border-[var(--secondary)]/10" />
          </div>
          <div className="pt-5 text-center space-y-2">
            <div className="h-3 w-16 bg-secondary mx-auto" />
            <div className="h-5 w-32 bg-secondary mx-auto" />
            <div className="h-3 w-24 bg-secondary mx-auto" />
            <div className="h-5 w-20 bg-secondary mx-auto" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function UnisexPage() {
  const [sortBy, setSortBy] = useState("featured");
  const { heroRef, heroY, heroOpacity, heroScale } = useHeroScroll();

  // Fetch products from API
  const { data: productsData, isLoading, error } = useProducts({ limit: 50 });

  // Transform, filter, and sort products for unisex
  const displayProducts = useMemo(() => {
    if (!productsData?.items) return [];
    const allProducts = transformProducts(productsData.items);
    let unisexProducts = filterByGender(allProducts, 'unisex');

    switch (sortBy) {
      case "price-low":
        return [...unisexProducts].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...unisexProducts].sort((a, b) => b.price - a.price);
      case "newest":
        return [...unisexProducts].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default:
        return unisexProducts;
    }
  }, [productsData, sortBy]);

  return (
    <PageLayout>
      {/* Immersive Hero */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1920&q=80"
            alt="Unisex Eyewear"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
        </motion.div>

        <div className="absolute inset-6 md:inset-8 border border-[var(--secondary)]/20 pointer-events-none" />
        <div className="absolute inset-10 md:inset-12 border border-[var(--secondary)]/10 pointer-events-none hidden md:block" />


        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-[var(--secondary)]" />
            <Circle className="h-4 w-4 text-[var(--secondary)]" />
            <span className="text-[var(--secondary)] tracking-wider uppercase text-xs">
              Beyond Boundaries
            </span>
            <Circle className="h-4 w-4 text-[var(--secondary)]" />
            <span className="h-px w-12 bg-[var(--secondary)]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6"
          >
            Unisex
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Frames that transcend trends, designed for anyone
            who appreciates exceptional craftsmanship
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--secondary)]" />
            <Sparkle className="h-5 w-5 text-[var(--secondary)]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--secondary)]" />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-[var(--secondary)] to-transparent"
          />
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-24">
        <div className="px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--secondary)]/50" />
              <div className="w-2 h-2 rotate-45 bg-[var(--secondary)]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--secondary)]/50" />
            </div>
            <h2 className="text-3xl md:text-4xl tracking-wide">
              Unisex Eyewear
            </h2>
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-border"
          >
            <p className="text-muted-foreground">
              {isLoading ? (
                <span className="inline-block w-32 h-4 bg-secondary animate-pulse" />
              ) : (
                `${displayProducts.length} ${displayProducts.length === 1 ? "frame" : "frames"}`
              )}
            </p>

            <SortDropdown value={sortBy} onChange={setSortBy} />
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <ProductsSkeleton />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground">
                Unable to load products. Please try again later.
              </p>
            </motion.div>
          ) : displayProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-[var(--secondary)]/30 rotate-45" />
              <h3 className="text-2xl tracking-wide mb-3">Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                Our unisex collection is being curated.
              </p>
              <Link href="/eyewear" className="btn-primary inline-block">
                Browse All Eyewear
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: [0.165, 0.84, 0.44, 1]
                  }}
                >
                  <ListingProductCard product={product} index={index} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <CategoryButtons title="Shop by Frame Shape" />

      {/* Bottom CTA */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
        </div>

        <div className="px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkle className="h-5 w-5 text-[var(--secondary)]" />
              <span className="text-[var(--secondary)] tracking-wider uppercase text-xs">
                Personalized
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl tracking-wide mb-4">
              Find Your Style
            </h2>
            <p className="text-muted-foreground mb-8">
              Use our face shape guide to discover the perfect unisex frames
              that match your features
            </p>

            <Link
              href="/eyewear"
              className="btn-primary inline-block"
            >
              Find Your Fit
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
