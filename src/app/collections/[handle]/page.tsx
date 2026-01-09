"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, X, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { useCollectionByHandle, useCollectionProducts } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";
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
        className="flex items-center gap-2 font-serif text-sm border border-border px-4 py-2 hover:border-gold transition-colors"
      >
        <span>Sort: {currentLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
                className={`block w-full text-left px-4 py-3 font-serif text-sm hover:bg-secondary transition-colors ${
                  value === option.value ? "text-gold" : ""
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="animate-pulse"
        >
          <div className="aspect-[3/4] bg-secondary relative">
            <div className="absolute inset-3 border border-gold/10" />
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

function HeroSkeleton() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-secondary" />
      <div className="absolute inset-6 md:inset-8 border border-gold/10 pointer-events-none" />
      <div className="relative container mx-auto px-4 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-secondary/50 mx-auto" />
          <div className="h-16 w-80 bg-secondary/50 mx-auto" />
          <div className="h-6 w-96 bg-secondary/50 mx-auto max-w-full" />
        </div>
      </div>
    </section>
  );
}

export default function CollectionPage() {
  const params = useParams();
  const handle = params.handle as string;
  const [sortBy, setSortBy] = useState("featured");
  const { heroRef, heroY, heroOpacity, heroScale } = useHeroScroll();

  // Fetch collection details
  const {
    data: collectionData,
    isLoading: isCollectionLoading,
    error: collectionError
  } = useCollectionByHandle(handle);

  // Fetch products in collection
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError
  } = useCollectionProducts(handle, { limit: 50 });

  const collection = collectionData?.collection;

  // Transform and sort products
  const displayProducts = useMemo(() => {
    if (!productsData?.items) return [];
    let products = transformProducts(productsData.items);

    switch (sortBy) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price);
      case "newest":
        return [...products].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default:
        return products;
    }
  }, [productsData, sortBy]);

  const isLoading = isCollectionLoading || isProductsLoading;
  const error = collectionError || productsError;

  // Format handle for display (capitalize, replace hyphens)
  const formattedHandle = handle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (error && !isLoading) {
    return (
      <PageLayout>
        <section className="py-32 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="deco-sunburst w-full h-full" />
          </div>

          <div className="container mx-auto px-4 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 mx-auto mb-8 border-2 border-gold/30 rotate-45 flex items-center justify-center">
                <X className="h-10 w-10 text-gold -rotate-45" />
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-12 bg-gold/50" />
                <span className="font-display text-gold tracking-[0.3em] uppercase text-xs">
                  Not Found
                </span>
                <span className="h-px w-12 bg-gold/50" />
              </div>

              <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
                Collection Unavailable
              </h1>
              <p className="font-serif text-muted-foreground mb-8 max-w-md mx-auto">
                The &ldquo;{formattedHandle}&rdquo; collection doesn&apos;t exist or hasn&apos;t been created yet.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/collections"
                  className="btn-deco-ornate inline-flex items-center gap-2"
                >
                  <span>Browse Collections</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/fragrances"
                  className="font-display text-sm tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition-colors"
                >
                  View All Fragrances
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Immersive Hero */}
      {isCollectionLoading ? (
        <HeroSkeleton />
      ) : (
        <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
          <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
            <Image
              src={collection?.thumbnail || "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80"}
              alt={collection?.title || "Collection"}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="deco-hero-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
          </motion.div>

          {/* Art Deco Frame */}
          <div className="absolute inset-6 md:inset-8 border border-gold/20 pointer-events-none" />
          <div className="absolute inset-10 md:inset-12 border border-gold/10 pointer-events-none hidden md:block" />

          {/* Corner accents */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8 w-16 h-16 border-l-2 border-t-2 border-gold" />
          <div className="absolute top-6 right-6 md:top-8 md:right-8 w-16 h-16 border-r-2 border-t-2 border-gold" />
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 w-16 h-16 border-l-2 border-b-2 border-gold" />
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-16 h-16 border-r-2 border-b-2 border-gold" />

          {/* Content */}
          <motion.div style={{ opacity: heroOpacity }} className="relative container mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <span className="h-px w-12 bg-gold" />
              <span className="font-display text-gold tracking-[0.4em] uppercase text-xs">
                The Collection
              </span>
              <span className="h-px w-12 bg-gold" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6"
            >
              {collection?.title}
            </motion.h1>

            {collection?.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="font-serif text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
              >
                {collection.description}
              </motion.p>
            )}

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 flex items-center justify-center gap-3"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
              <Sparkles className="h-5 w-5 text-gold" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
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
              className="w-px h-12 bg-gradient-to-b from-gold to-transparent"
            />
          </motion.div>
        </section>
      )}

      {/* Products Section */}
      <section className="py-16 md:py-24 deco-section-light">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
              <div className="w-2 h-2 rotate-45 bg-gold" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide">
              {collection?.title || formattedHandle} Fragrances
            </h2>
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-border"
          >
            <p className="font-serif text-muted-foreground">
              {isLoading ? (
                <span className="inline-block w-32 h-4 bg-secondary animate-pulse" />
              ) : (
                `${displayProducts.length} ${displayProducts.length === 1 ? "fragrance" : "fragrances"}`
              )}
            </p>

            <SortDropdown value={sortBy} onChange={setSortBy} />
          </motion.div>

          {/* Products Grid */}
          {isProductsLoading ? (
            <ProductsSkeleton />
          ) : displayProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-gold/30 rotate-45" />
              <h3 className="font-display text-2xl tracking-wide mb-3">Coming Soon</h3>
              <p className="font-serif text-muted-foreground mb-6">
                This collection is being curated. Check back soon.
              </p>
              <Link href="/fragrances" className="btn-deco-ornate inline-block">
                Browse All Fragrances
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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
                  <EnhancedProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="deco-sunburst w-full h-full" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-gold" />
              <span className="font-display text-gold tracking-[0.3em] uppercase text-xs">
                Explore More
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
              Discover Other Collections
            </h2>
            <p className="font-serif text-muted-foreground mb-8">
              Each collection tells a unique story, crafted with passion
              and the finest ingredients
            </p>

            <Link
              href="/collections"
              className="btn-deco-ornate inline-flex items-center gap-2"
            >
              <span>View All Collections</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
