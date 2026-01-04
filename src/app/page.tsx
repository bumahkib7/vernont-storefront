"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Leaf, Gift, Play, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AnimatedSection, StaggeredChildren, StaggeredChild } from "@/components/ui/AnimatedSection";
import { TestimonialsCarousel } from "@/components/ui/TestimonialsCarousel";
import { ShippingBanner } from "@/components/ui/ShippingBanner";
import { products, getNewArrivals, getBestsellers } from "@/data/products";

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

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const featuredProducts = getBestsellers();
  const newArrivals = getNewArrivals();

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section with Parallax */}
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative container mx-auto px-4">
            <div className="max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4"
              >
                New Collection 2024
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wide mb-6"
              >
                The Art of
                <br />
                <span className="text-gold">Fragrance</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-lg md:text-xl text-white/80 mb-8 max-w-lg"
              >
                Discover our latest collection of exquisite perfumes,
                crafted with the finest ingredients from around the world.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/collections">
                  <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90 group">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="btn-outline-luxury border-white text-white hover:bg-white hover:text-primary">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Story
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center text-white/60"
            >
              <span className="font-serif text-xs tracking-wider uppercase mb-2">Scroll</span>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.div>
        </section>

        {/* Shipping Features */}
        <ShippingBanner />

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                Curated Selection
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
                Bestselling Fragrances
              </h2>
              <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
                Our most beloved scents, chosen by connoisseurs and cherished by those who appreciate
                the finer things in life.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <EnhancedProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <AnimatedSection className="text-center mt-12">
              <Link href="/fragrances">
                <Button variant="outline" className="btn-outline-luxury group">
                  View All Fragrances
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                Shop By
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide">
                Collections
              </h2>
            </AnimatedSection>

            <StaggeredChildren className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.15}>
              {collections.map((collection) => (
                <StaggeredChild key={collection.name}>
                  <Link
                    href={collection.href}
                    className="group relative aspect-[4/5] overflow-hidden block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
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
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <motion.h3
                        className="font-display text-2xl md:text-3xl tracking-wide mb-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        {collection.name}
                      </motion.h3>
                      <p className="font-serif text-white/80">{collection.description}</p>
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="mt-4 font-display text-xs tracking-widest uppercase border-b border-gold pb-1"
                      >
                        Discover
                      </motion.span>
                    </div>
                  </Link>
                </StaggeredChild>
              ))}
            </StaggeredChildren>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection direction="left" className="relative aspect-square lg:aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=800&q=80"
                  alt="Perfume craftsmanship"
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Decorative elements */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-gold z-[-1]"
                />
              </AnimatedSection>

              <AnimatedSection direction="right" className="lg:pl-12">
                <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                  Our Heritage
                </p>
                <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-6">
                  A Legacy of Excellence
                </h2>
                <div className="space-y-4 font-serif text-muted-foreground leading-relaxed">
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

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-8 mb-8">
                  <div className="text-center">
                    <motion.p
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      className="font-display text-3xl text-gold"
                    >
                      50+
                    </motion.p>
                    <p className="font-serif text-xs text-muted-foreground uppercase tracking-wider">Countries</p>
                  </div>
                  <div className="text-center">
                    <motion.p
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="font-display text-3xl text-gold"
                    >
                      200+
                    </motion.p>
                    <p className="font-serif text-xs text-muted-foreground uppercase tracking-wider">Ingredients</p>
                  </div>
                  <div className="text-center">
                    <motion.p
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="font-display text-3xl text-gold"
                    >
                      15+
                    </motion.p>
                    <p className="font-serif text-xs text-muted-foreground uppercase tracking-wider">Years</p>
                  </div>
                </div>

                <Link href="/about">
                  <Button variant="outline" className="btn-outline-luxury group">
                    Discover Our Story
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsCarousel />

        {/* New Arrivals */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                Just Arrived
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
                New Arrivals
              </h2>
              <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
                Be the first to experience our latest creations, each one a testament to
                our unwavering commitment to excellence.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.slice(0, 4).map((product, index) => (
                <EnhancedProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Full-width CTA */}
        <section className="relative py-32 overflow-hidden">
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
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>
          <div className="relative container mx-auto px-4 text-center">
            <AnimatedSection>
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
                Limited Edition
              </p>
              <h2 className="font-display text-3xl md:text-5xl tracking-wide text-white mb-6">
                The Signature Collection
              </h2>
              <p className="font-serif text-white/80 max-w-2xl mx-auto mb-8">
                An exclusive collection of rare and precious fragrances,
                available only at Vernont boutiques and online.
              </p>
              <Link href="/collections/signature">
                <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90 group">
                  Explore Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Instagram Feed */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-10">
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                @vernontperfumes
              </p>
              <h2 className="font-display text-2xl md:text-3xl tracking-wide">
                Follow Our Journey
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {instagramPosts.map((image, index) => (
                <motion.a
                  key={index}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative aspect-square overflow-hidden group"
                >
                  <Image
                    src={image}
                    alt={`Instagram post ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
