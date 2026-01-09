"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCollections } from "@/lib/hooks";
import { useHeroScroll } from "@/lib/useHeroScroll";

// Loading skeleton with Art Deco styling
function CollectionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[16/10] bg-secondary relative">
            <div className="absolute inset-4 border border-gold/20" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-6 w-40 bg-secondary mx-auto" />
            <div className="h-4 w-64 bg-secondary mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Art Deco Collection Card
function CollectionCard({
  collection,
  index,
}: {
  collection: {
    id: string;
    handle: string;
    title: string;
    description?: string | null;
    thumbnail?: string | null;
  };
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.165, 0.84, 0.44, 1] }}
    >
      <Link
        href={`/collections/${collection.handle}`}
        className="group block relative"
      >
        {/* Main Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
          {/* Art Deco Frame */}
          <div className="absolute inset-4 border border-gold/30 z-10 pointer-events-none transition-all duration-700 group-hover:inset-6" />
          <div className="absolute inset-6 border border-gold/20 z-10 pointer-events-none transition-all duration-700 group-hover:inset-8" />

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gold z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gold z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12" />

          {/* Image with zoom effect */}
          <Image
            src={collection.thumbnail || "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80"}
            alt={collection.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            unoptimized
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-white">
            {/* Decorative line */}
            <motion.div
              className="w-0 h-px bg-gold mb-4 group-hover:w-16 transition-all duration-700"
            />

            <h3 className="font-display text-2xl md:text-3xl tracking-wide text-center mb-2">
              {collection.title}
            </h3>

            {collection.description && (
              <p className="font-serif text-sm text-white/80 text-center max-w-xs opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                {collection.description}
              </p>
            )}

            {/* CTA */}
            <div className="mt-4 flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200">
              <span className="font-display text-xs tracking-[0.3em] uppercase text-gold">
                Explore
              </span>
              <ArrowRight className="h-4 w-4 text-gold transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Art Deco Section Divider
function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
      <div className="w-2 h-2 rotate-45 bg-gold" />
      <div className="h-px w-8 bg-gold/50" />
      <Sparkles className="h-4 w-4 text-gold" />
      <div className="h-px w-8 bg-gold/50" />
      <div className="w-2 h-2 rotate-45 bg-gold" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
  );
}

export default function CollectionsPage() {
  const { heroRef, heroY, heroOpacity, heroScale } = useHeroScroll();

  const { data: collectionsData, isLoading, error } = useCollections();
  const collections = collectionsData?.collections ?? [];

  return (
    <PageLayout>
      {/* Immersive Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=1920&q=80"
            alt="Vernont Collections"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Art Deco Overlay Pattern */}
          <div className="deco-hero-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </motion.div>

        {/* Art Deco Frame */}
        <div className="absolute inset-8 border border-gold/20 pointer-events-none hidden md:block" />
        <div className="absolute inset-12 border border-gold/10 pointer-events-none hidden md:block" />

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

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative container mx-auto px-4 text-center text-white">
          {/* Decorative Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-gold" />
            <span className="font-display text-gold tracking-[0.4em] uppercase text-xs">
              Curated Excellence
            </span>
            <span className="h-px w-12 bg-gold" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6"
          >
            Our Collections
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-serif text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Each collection tells a unique story, crafted with passion
            and the finest ingredients from around the world
          </motion.p>

          {/* Decorative Element */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold" />
            <div className="w-3 h-3 rotate-45 border border-gold" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold" />
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

      {/* Collections Grid */}
      <section className="py-20 md:py-32 deco-section-light">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <SectionDivider />
            <h2 className="font-display text-3xl md:text-4xl tracking-wide mt-8 mb-4">
              Discover Your Signature
            </h2>
            <p className="font-serif text-muted-foreground max-w-lg mx-auto">
              From timeless classics to bold contemporary creations,
              find the collection that speaks to your soul
            </p>
          </motion.div>

          {/* Grid */}
          {isLoading ? (
            <CollectionsSkeleton />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-serif text-muted-foreground">
                Unable to load collections. Please try again later.
              </p>
            </motion.div>
          ) : collections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-serif text-muted-foreground">
                No collections found.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {collections.map((collection, index) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="deco-sunburst w-full h-full" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-gold" />
              <span className="font-display text-gold tracking-[0.3em] uppercase text-xs">
                Personalized
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
              Not Sure Where to Start?
            </h2>
            <p className="font-serif text-muted-foreground mb-8">
              Take our fragrance quiz and discover your perfect match
              based on your preferences and personality
            </p>

            <Link
              href="/fragrance-quiz"
              className="btn-deco-ornate inline-flex items-center gap-2"
            >
              <span>Take the Quiz</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
