"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Leaf, Gift, Play, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { Button } from "@/components/ui/button";
import { AnimatedSection, StaggeredChildren, StaggeredChild } from "@/components/ui/AnimatedSection";
import { TestimonialsCarousel } from "@/components/ui/TestimonialsCarousel";
import { ShippingBanner } from "@/components/ui/ShippingBanner";
import { useProducts } from "@/lib/hooks";
import { transformProducts, getBestsellers, getNewArrivals } from "@/lib/transforms";

const collections = [
  {
    name: "For Her",
    description: "Timeless femininity",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80",
    href: "/for-her",
  },
  {
    name: "For Him",
    description: "Bold sophistication",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80",
    href: "/for-him",
  },
  {
    name: "Unisex",
    description: "Beyond boundaries",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
    href: "/unisex",
  },
];

const instagramPosts = [
  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&q=80",
  "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80",
  "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=400&q=80",
];

// Product card skeleton
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-secondary" />
      <div className="pt-5 text-center space-y-2">
        <div className="h-3 w-16 bg-secondary mx-auto" />
        <div className="h-5 w-32 bg-secondary mx-auto" />
        <div className="h-3 w-24 bg-secondary mx-auto" />
        <div className="h-5 w-20 bg-secondary mx-auto" />
      </div>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Fetch products from API
  const { data: productsData, isLoading } = useProducts({ limit: 20 });

  // Transform and filter products
  const displayProducts = useMemo(() => {
    if (!productsData?.items) return [];
    return transformProducts(productsData.items);
  }, [productsData]);

  const featuredProducts = useMemo(() => {
    const bestsellers = getBestsellers(displayProducts);
    return bestsellers.length > 0 ? bestsellers.slice(0, 4) : displayProducts.slice(0, 4);
  }, [displayProducts]);

  const newArrivals = useMemo(() => {
    const newItems = getNewArrivals(displayProducts);
    return newItems.length > 0 ? newItems.slice(0, 4) : displayProducts.slice(0, 4);
  }, [displayProducts]);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Art Deco Hero Section with Parallax */}
        <section ref={heroRef} className="relative h-[100vh] min-h-[700px] flex items-center overflow-hidden">
          <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80"
              alt="Luxury perfume bottles"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            {/* Art Deco Geometric Overlay */}
            <div className="deco-hero-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </motion.div>

          {/* Art Deco Frame */}
          <div className="deco-hero-frame hidden md:block" />

          {/* Corner Decorations */}
          <div className="deco-corner deco-corner-tl hidden md:block">
            <div className="deco-corner-inner" />
          </div>
          <div className="deco-corner deco-corner-tr hidden md:block">
            <div className="deco-corner-inner" />
          </div>
          <div className="deco-corner deco-corner-bl hidden md:block">
            <div className="deco-corner-inner" />
          </div>
          <div className="deco-corner deco-corner-br hidden md:block">
            <div className="deco-corner-inner" />
          </div>

          <motion.div style={{ opacity: heroOpacity }} className="relative container mx-auto px-4 md:px-12">
            <div className="max-w-3xl">
              {/* Art Deco Label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-6"
              >
                <span className="h-px w-12 bg-gold" />
                <span className="font-display text-gold tracking-[0.4em] uppercase text-xs">
                  New Collection 2024
                </span>
                <span className="h-px w-12 bg-gold" />
              </motion.div>

              {/* Art Deco Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-display text-5xl md:text-7xl lg:text-[6rem] text-white tracking-[0.05em] leading-[0.9] mb-8"
              >
                <span className="block">The Art of</span>
                <span className="block text-gold deco-text-stepped">Fragrance</span>
              </motion.h1>

              {/* Decorative Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex items-center gap-3 mb-8 origin-left"
              >
                <span className="h-px w-16 bg-gold/60" />
                <span className="w-2 h-2 bg-gold rotate-45" />
                <span className="h-px w-24 bg-gold/40" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="font-serif text-lg md:text-xl text-white/80 mb-10 max-w-xl leading-relaxed"
              >
                Discover our latest collection of exquisite perfumes,
                crafted with the finest ingredients from around the world.
              </motion.p>

              {/* Art Deco Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-6"
              >
                <Link href="/collections">
                  <button className="btn-deco-filled group flex items-center gap-3">
                    Explore Collection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link href="/about">
                  <button className="btn-deco group flex items-center gap-3 border-white/60 text-white hover:border-gold hover:text-gold">
                    <Play className="h-4 w-4" />
                    Watch Story
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Art Deco Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <span className="font-display text-[10px] tracking-[0.3em] uppercase text-white/60 mb-3">Scroll</span>
              <div className="flex flex-col items-center gap-1">
                <span className="w-px h-6 bg-gradient-to-b from-gold to-transparent" />
                <span className="w-1.5 h-1.5 bg-gold rotate-45" />
              </div>
            </motion.div>
          </motion.div>

          {/* Side Decoration */}
          <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4">
            <span className="w-px h-20 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
            <span className="w-2 h-2 border border-gold/40 rotate-45" />
            <span className="font-display text-[10px] tracking-[0.2em] text-gold/60 rotate-90 origin-center whitespace-nowrap">VERNONT ◆ MMXXIV</span>
            <span className="w-2 h-2 border border-gold/40 rotate-45" />
            <span className="w-px h-20 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
          </div>
        </section>

        {/* Shipping Features */}
        <ShippingBanner />

        {/* Art Deco Featured Products */}
        <section className="py-24 deco-section-light deco-pattern-overlay">
          <div className="container mx-auto px-4">
            {/* Art Deco Section Header */}
            <AnimatedSection className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
                <span className="text-gold text-xs">◆</span>
                <span className="font-display text-gold tracking-[0.4em] uppercase text-xs">
                  Curated Selection
                </span>
                <span className="text-gold text-xs">◆</span>
                <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl tracking-[0.1em] mb-6 deco-headline">
                Bestselling Fragrances
              </h2>
              <p className="font-serif text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                Our most beloved scents, chosen by connoisseurs and cherished by those who appreciate
                the finer things in life.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {isLoading ? (
                <>
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                </>
              ) : (
                featuredProducts.map((product, index) => (
                  <EnhancedProductCard key={product.id} product={product} index={index} />
                ))
              )}
            </div>

            <AnimatedSection className="text-center mt-16">
              <Link href="/fragrances">
                <button className="btn-deco-ornate group inline-flex items-center gap-3">
                  View All Fragrances
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Art Deco Collections Grid */}
        <section className="py-24 bg-[#0D0D0D] relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 50px,
                rgba(212, 175, 55, 0.5) 50px,
                rgba(212, 175, 55, 0.5) 51px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 50px,
                rgba(212, 175, 55, 0.5) 50px,
                rgba(212, 175, 55, 0.5) 51px
              )`
            }} />
          </div>

          <div className="container mx-auto px-4 relative">
            {/* Art Deco Section Header */}
            <AnimatedSection className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-8 bg-gold/40" />
                <span className="text-gold text-[10px]">◆◆◆</span>
                <span className="h-px w-8 bg-gold/40" />
              </div>
              <p className="font-display text-gold tracking-[0.4em] uppercase text-xs mb-4">
                Shop By
              </p>
              <h2 className="font-display text-4xl md:text-5xl tracking-[0.15em] text-white">
                Collections
              </h2>
            </AnimatedSection>

            <StaggeredChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
              {collections.map((collection) => (
                <StaggeredChild key={collection.name}>
                  <Link
                    href={collection.href}
                    className="group relative aspect-[3/4] overflow-hidden block deco-frame-corners"
                  >
                    {/* Image with zoom */}
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </motion.div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:from-black/90 transition-all duration-500" />

                    {/* Inner Frame */}
                    <div className="absolute inset-4 border border-gold/0 group-hover:border-gold/40 transition-all duration-500" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end text-white p-8">
                      {/* Decorative top element */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="h-px w-6 bg-gold" />
                        <span className="w-1.5 h-1.5 bg-gold rotate-45" />
                        <span className="h-px w-6 bg-gold" />
                      </div>

                      <h3 className="font-display text-2xl md:text-3xl tracking-[0.2em] uppercase mb-2">
                        {collection.name}
                      </h3>
                      <p className="font-serif text-white/70 text-sm tracking-wide mb-6">
                        {collection.description}
                      </p>

                      {/* Art Deco Button */}
                      <span className="relative px-6 py-2 font-display text-[10px] tracking-[0.3em] uppercase text-gold border border-gold/60 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        Discover
                      </span>
                    </div>
                  </Link>
                </StaggeredChild>
              ))}
            </StaggeredChildren>
          </div>
        </section>

        {/* Art Deco Story Section */}
        <section className="py-28 overflow-hidden deco-section-light">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image with Art Deco Frame */}
              <AnimatedSection direction="left" className="relative">
                <div className="relative aspect-[4/5] deco-stepped-border">
                  <Image
                    src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=800&q=80"
                    alt="Perfume craftsmanship"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Inner frame */}
                  <div className="absolute inset-4 border border-gold/20 pointer-events-none" />
                </div>

                {/* Decorative Corner Elements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-8 -right-8 w-40 h-40 border border-gold/30 hidden lg:block"
                >
                  <div className="absolute inset-2 border border-gold/20" />
                  <div className="absolute bottom-4 right-4 w-3 h-3 bg-gold rotate-45" />
                </motion.div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -top-6 -left-6 bg-gold text-primary px-6 py-4 hidden lg:block"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
                >
                  <span className="font-display text-3xl block">1909</span>
                  <span className="font-display text-[10px] tracking-[0.2em] uppercase">Est.</span>
                </motion.div>
              </AnimatedSection>

              {/* Content */}
              <AnimatedSection direction="right" className="lg:pl-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-10 bg-gold" />
                  <span className="font-display text-gold tracking-[0.4em] uppercase text-xs">
                    Our Heritage
                  </span>
                </div>

                <h2 className="font-display text-4xl md:text-5xl tracking-[0.08em] mb-8 leading-tight">
                  A Legacy of<br />
                  <span className="text-gold">Excellence</span>
                </h2>

                {/* Decorative Divider */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="h-px w-8 bg-gold/60" />
                  <span className="w-1.5 h-1.5 bg-gold rotate-45" />
                  <span className="h-px w-16 bg-gold/40" />
                </div>

                <div className="space-y-5 font-serif text-muted-foreground text-lg leading-relaxed">
                  <p>
                    At Vernont, we believe that fragrance is more than a scent—it&apos;s an
                    experience, a memory, a statement. Our master perfumers combine centuries-old
                    techniques with innovative approaches to create fragrances that captivate the senses.
                  </p>
                  <p>
                    Each bottle represents countless hours of meticulous craftsmanship,
                    from sourcing the rarest ingredients to achieving the perfect balance
                    of notes that define our signature style.
                  </p>
                </div>

                {/* Art Deco Stats */}
                <div className="grid grid-cols-3 gap-8 mt-12 mb-12">
                  {[
                    { value: "50+", label: "Countries" },
                    { value: "200+", label: "Ingredients" },
                    { value: "115", label: "Years" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center relative"
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-px bg-gold/40" />
                      <p className="font-display text-4xl text-gold mb-1">{stat.value}</p>
                      <p className="font-display text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <Link href="/about">
                  <button className="btn-deco group inline-flex items-center gap-3">
                    Discover Our Story
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Testimonials - Commented out */}
        {/* <TestimonialsCarousel /> */}

        {/* Art Deco New Arrivals */}
        <section className="py-24 deco-pattern-overlay">
          <div className="container mx-auto px-4">
            {/* Art Deco Section Header */}
            <AnimatedSection className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
                <span className="text-gold text-xs">◆</span>
                <span className="font-display text-gold tracking-[0.4em] uppercase text-xs">
                  Just Arrived
                </span>
                <span className="text-gold text-xs">◆</span>
                <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl tracking-[0.1em] mb-6 deco-headline">
                New Arrivals
              </h2>
              <p className="font-serif text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                Be the first to experience our latest creations, each one a testament to
                our unwavering commitment to excellence.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {isLoading ? (
                <>
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                </>
              ) : (
                newArrivals.map((product, index) => (
                  <EnhancedProductCard key={product.id} product={product} index={index} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Art Deco Full-width CTA */}
        <section className="relative py-40 overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src="https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=1920&q=80"
              alt="Luxury perfume experience"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/70" />
            {/* Art Deco geometric overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </motion.div>

          {/* Decorative Frame */}
          <div className="absolute inset-8 md:inset-16 border border-gold/20 pointer-events-none hidden md:block">
            <div className="absolute inset-3 border border-gold/10" />
          </div>

          {/* Corner Ornaments */}
          <div className="hidden md:block">
            <div className="absolute top-16 left-16 w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gold" />
              <div className="absolute top-0 left-0 w-0.5 h-full bg-gold" />
              <div className="absolute top-4 left-4 w-3 h-3 border border-gold rotate-45" />
            </div>
            <div className="absolute top-16 right-16 w-16 h-16">
              <div className="absolute top-0 right-0 w-full h-0.5 bg-gold" />
              <div className="absolute top-0 right-0 w-0.5 h-full bg-gold" />
              <div className="absolute top-4 right-4 w-3 h-3 border border-gold rotate-45" />
            </div>
            <div className="absolute bottom-16 left-16 w-16 h-16">
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />
              <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gold" />
              <div className="absolute bottom-4 left-4 w-3 h-3 border border-gold rotate-45" />
            </div>
            <div className="absolute bottom-16 right-16 w-16 h-16">
              <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gold" />
              <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gold" />
              <div className="absolute bottom-4 right-4 w-3 h-3 border border-gold rotate-45" />
            </div>
          </div>

          <div className="relative container mx-auto px-4 text-center">
            <AnimatedSection>
              {/* Decorative Header */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="hidden sm:block h-px w-20 bg-gradient-to-r from-transparent to-gold" />
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rotate-45" />
                  <span className="font-display text-gold tracking-[0.5em] uppercase text-xs">
                    Limited Edition
                  </span>
                  <span className="w-1.5 h-1.5 bg-gold rotate-45" />
                </div>
                <span className="hidden sm:block h-px w-20 bg-gradient-to-l from-transparent to-gold" />
              </div>

              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-[0.1em] text-white mb-8 leading-tight">
                The Signature<br />
                <span className="text-gold">Collection</span>
              </h2>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="h-px w-12 bg-gold/60" />
                <span className="w-2 h-2 bg-gold rotate-45" />
                <span className="h-px w-12 bg-gold/60" />
              </div>

              <p className="font-serif text-white/80 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
                An exclusive collection of rare and precious fragrances,
                available only at Vernont boutiques and online.
              </p>

              <Link href="/collections/signature">
                <button className="btn-deco-filled group inline-flex items-center gap-3">
                  Explore Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Art Deco Instagram Feed */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            {/* Art Deco Header */}
            <AnimatedSection className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="h-px w-12 bg-gold/40" />
                <span className="text-gold text-[10px]">◆</span>
                <span className="h-px w-12 bg-gold/40" />
              </div>
              <p className="font-display text-gold tracking-[0.4em] uppercase text-xs mb-3">
                @vernontperfumes
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em]">
                Follow Our Journey
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {instagramPosts.map((image, index) => (
                <motion.a
                  key={index}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="relative aspect-square overflow-hidden group"
                >
                  <Image
                    src={image}
                    alt={`Instagram post ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  {/* Art Deco Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex flex-col items-center justify-center">
                    {/* Inner frame on hover */}
                    <div className="absolute inset-3 border border-gold/0 group-hover:border-gold/60 transition-all duration-500" />
                    <span className="text-gold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">◆</span>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Decorative Footer */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <span className="h-px w-20 bg-gradient-to-r from-transparent to-gold/40" />
              <span className="text-gold text-xs">◆◆◆</span>
              <span className="h-px w-20 bg-gradient-to-l from-transparent to-gold/40" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
