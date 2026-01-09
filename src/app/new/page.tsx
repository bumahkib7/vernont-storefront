"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { CategoryButtons } from "@/components/CategoryButtons";
import { useProducts } from "@/lib/hooks";
import { transformProducts, getNewArrivals } from "@/lib/transforms";
import { useHeroScroll } from "@/lib/useHeroScroll";

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

export default function NewArrivalsPage() {
  const { heroRef, heroY, heroOpacity, heroScale } = useHeroScroll();

  // Fetch products from API
  const { data: productsData, isLoading, error } = useProducts({ limit: 50 });

  // Transform and filter new arrivals
  const newProducts = useMemo(() => {
    if (!productsData?.items) return [];
    const allProducts = transformProducts(productsData.items);
    const arrivals = getNewArrivals(allProducts);
    // If no products tagged as "new", show all products
    return arrivals.length > 0 ? arrivals : allProducts.slice(0, 12);
  }, [productsData]);

  return (
    <PageLayout>
      {/* Immersive Hero */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=1920&q=80"
            alt="New Arrivals"
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
            <Star className="h-5 w-5 text-gold fill-gold" />
            <span className="font-display text-gold tracking-[0.4em] uppercase text-xs">
              Just Arrived
            </span>
            <Star className="h-5 w-5 text-gold fill-gold" />
            <span className="h-px w-12 bg-gold" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6"
          >
            New Arrivals
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="font-serif text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Be the first to experience our latest creations,
            each one a testament to our unwavering commitment to excellence
          </motion.p>

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
              Latest Creations
            </h2>
            <p className="font-serif text-muted-foreground mt-3">
              {isLoading ? "Loading..." : `${newProducts.length} New Fragrances`}
            </p>
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
              <p className="font-serif text-muted-foreground">
                Unable to load products. Please try again later.
              </p>
            </motion.div>
          ) : newProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-gold/30 rotate-45" />
              <h3 className="font-display text-2xl tracking-wide mb-3">Coming Soon</h3>
              <p className="font-serif text-muted-foreground mb-6">
                New arrivals are on their way. Check back soon.
              </p>
              <Link href="/fragrances" className="btn-deco-ornate inline-block">
                Browse All Fragrances
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {newProducts.map((product, index) => (
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

      {/* Categories Section */}
      <CategoryButtons title="Explore by Scent Family" />

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
                Stay Updated
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
              Never Miss a Launch
            </h2>
            <p className="font-serif text-muted-foreground mb-8">
              Subscribe to be the first to know about our newest
              creations and exclusive releases
            </p>

            <Link
              href="/fragrances"
              className="btn-deco-ornate inline-block"
            >
              View All Fragrances
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
