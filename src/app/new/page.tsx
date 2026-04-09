"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkle, Star } from "@phosphor-icons/react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ListingProductCard } from "@/components/ListingProductCard";
import { CategoryButtons } from "@/components/CategoryButtons";
import { useProducts } from "@/lib/hooks";
import { transformProducts, getNewArrivals } from "@/lib/transforms";
import { useHeroScroll } from "@/lib/useHeroScroll";

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
            <Star className="h-5 w-5 text-[var(--secondary)] fill-[var(--secondary)]" />
            <span className="text-[var(--secondary)] tracking-wider uppercase text-xs">
              Just Arrived
            </span>
            <Star className="h-5 w-5 text-[var(--secondary)] fill-[var(--secondary)]" />
            <span className="h-px w-12 bg-[var(--secondary)]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6"
          >
            New Arrivals
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
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
              Latest Creations
            </h2>
            <p className="text-muted-foreground mt-3">
              {isLoading ? "Loading..." : `${newProducts.length} New Arrivals`}
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
              <p className="text-muted-foreground">
                Unable to load products. Please try again later.
              </p>
            </motion.div>
          ) : newProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-[var(--secondary)]/30 rotate-45" />
              <h3 className="text-2xl tracking-wide mb-3">Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                New arrivals are on their way. Check back soon.
              </p>
              <Link href="/eyewear" className="btn-primary inline-block">
                Browse All Eyewear
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                  <ListingProductCard product={product} index={index} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <CategoryButtons title="Explore by Style" />

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
                Stay Updated
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl tracking-wide mb-4">
              Never Miss a Launch
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to be the first to know about our newest
              creations and exclusive releases
            </p>

            <Link
              href="/eyewear"
              className="btn-primary inline-block"
            >
              View All Eyewear
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
