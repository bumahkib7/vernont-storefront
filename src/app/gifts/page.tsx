"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, Package, Heart, Sparkle, ArrowRight } from "@phosphor-icons/react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ListingProductCard } from "@/components/ListingProductCard";
import { useProducts } from "@/lib/hooks";
import { transformProducts, getBestsellers } from "@/lib/transforms";
import { useHeroScroll } from "@/lib/useHeroScroll";

const giftCategories = [
  {
    title: "Gift Cards",
    description: "Let them choose their perfect frame",
    icon: Package,
    href: "/gifts/cards",
  },
  {
    title: "Cases & Pouches",
    description: "Premium protective cases she or he will love",
    icon: Heart,
    href: "/gifts/cases",
  },
  {
    title: "Chains & Cords",
    description: "Sophisticated eyewear chains and accessories",
    icon: Sparkle,
    href: "/gifts/chains",
  },
  {
    title: "Cleaning Kits",
    description: "Luxury lens care and cleaning sets",
    icon: Gift,
    href: "/gifts/cleaning-kits",
  },
];

// Loading skeleton
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {[...Array(4)].map((_, i) => (
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

export default function GiftsPage() {
  const { heroRef, heroY, heroOpacity, heroScale } = useHeroScroll();

  // Fetch products from API
  const { data: productsData, isLoading, error } = useProducts({ limit: 20 });

  // Transform and get bestsellers
  const bestsellers = useMemo(() => {
    if (!productsData?.items) return [];
    const allProducts = transformProducts(productsData.items);
    const bestsellerProducts = getBestsellers(allProducts);
    return bestsellerProducts.length > 0 ? bestsellerProducts.slice(0, 4) : allProducts.slice(0, 4);
  }, [productsData]);

  return (
    <PageLayout>
      {/* Immersive Hero */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=1920&q=80"
            alt="Gifts"
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
            <Gift className="h-5 w-5 text-[var(--secondary)]" />
            <span className="text-[var(--secondary)] tracking-wider uppercase text-xs">
              The Art of Giving
            </span>
            <Gift className="h-5 w-5 text-[var(--secondary)]" />
            <span className="h-px w-12 bg-[var(--secondary)]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6"
          >
            Gifts
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Give the gift of luxury. Every Vernont frame comes beautifully presented
            with complimentary gift wrapping.
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

      {/* Gift Services */}
      <section className="py-16 md:py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
        </div>

        <div className="px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--secondary)]/50" />
              <div className="w-2 h-2 rotate-45 bg-[var(--secondary)]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--secondary)]/50" />
            </div>
            <h2 className="text-3xl md:text-4xl tracking-wide">
              Our Gift Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Gift,
                title: "Complimentary Gift Wrap",
                description: "Every order arrives beautifully wrapped in our signature packaging"
              },
              {
                icon: Package,
                title: "Personalized Message",
                description: "Add a handwritten note to make your gift extra special"
              },
              {
                icon: Sparkle,
                title: "Gift Cards Available",
                description: "Let them choose their perfect frame with a Vernont gift card"
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 border border-border bg-card/50"
              >
                <service.icon className="h-10 w-10 mx-auto mb-4 text-[var(--secondary)]" />
                <h3 className="text-lg tracking-wide mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Categories */}
      <section className="py-16 md:py-24">
        <div className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--secondary)]/50" />
              <div className="w-2 h-2 rotate-45 bg-[var(--secondary)]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--secondary)]/50" />
            </div>
            <h2 className="text-3xl md:text-4xl tracking-wide">
              Shop by Category
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={category.href}
                  className="group block p-8 border border-border hover:border-[var(--foreground)] transition-all duration-500 text-center bg-card relative overflow-hidden"
                >
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--secondary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <category.icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground group-hover:text-[var(--foreground)] transition-colors duration-500" />
                  <h3 className="text-lg tracking-wide mb-2 group-hover:text-[var(--foreground)] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs tracking-[0.2em] uppercase text-[var(--secondary)]">
                      Explore
                    </span>
                    <ArrowRight className="h-4 w-4 text-[var(--secondary)]" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers as Gift Ideas */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--secondary)]/50" />
              <div className="w-2 h-2 rotate-45 bg-[var(--secondary)]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--secondary)]/50" />
            </div>
            <h2 className="text-3xl md:text-4xl tracking-wide">
              Popular Gift Choices
            </h2>
            <p className="text-muted-foreground mt-3">
              Bestselling Eyewear
            </p>
          </motion.div>

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
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {bestsellers.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.165, 0.84, 0.44, 1]
                    }}
                  >
                    <ListingProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Link href="/eyewear" className="btn-primary inline-flex items-center gap-2">
                  <span>View All Eyewear</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 relative overflow-hidden">
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
              Not Sure What to Choose?
            </h2>
            <p className="text-muted-foreground mb-8">
              Try our face shape guide to find the perfect frame
              that flatters their features
            </p>

            <Link
              href="/eyewear"
              className="btn-primary inline-block"
            >
              Find Your Frame Shape
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
