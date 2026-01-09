"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { useCategories, useCategoryProducts } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";
import { useHeroScroll } from "@/lib/useHeroScroll";

// Category hero images and descriptions
const categoryMeta: Record<string, { image: string; tagline: string; description: string }> = {
  floral: {
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80",
    tagline: "Blooming Elegance",
    description: "Delicate bouquets that capture the essence of spring gardens and romantic evenings"
  },
  oriental: {
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80",
    tagline: "Mysterious Allure",
    description: "Rich, warm compositions inspired by the exotic spices and resins of the East"
  },
  fresh: {
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1920&q=80",
    tagline: "Pure Vitality",
    description: "Invigorating scents that evoke ocean breezes and sun-drenched citrus groves"
  },
  gourmand: {
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1920&q=80",
    tagline: "Sweet Indulgence",
    description: "Delicious accords of vanilla, caramel, and spices that delight the senses"
  },
  woody: {
    image: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=1920&q=80",
    tagline: "Timeless Depth",
    description: "Sophisticated compositions of cedar, sandalwood, and precious woods"
  },
  citrus: {
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1920&q=80",
    tagline: "Radiant Energy",
    description: "Bright, zesty notes that spark joy and refresh the spirit"
  },
};

const defaultMeta = {
  image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80",
  tagline: "Discover Excellence",
  description: "Explore our carefully curated selection of exceptional fragrances"
};

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

// Sort dropdown with Art Deco styling
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

export default function CategoryPage() {
  const params = useParams();
  const handle = params.handle as string;
  const [sortBy, setSortBy] = useState("featured");
  const { heroRef, heroY, heroOpacity, heroScale } = useHeroScroll();

  // Fetch all categories to find current one
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();

  // Find the current category
  const category = useMemo(() => {
    if (!categoriesData?.product_categories) return null;
    return categoriesData.product_categories.find((c) => c.handle === handle);
  }, [categoriesData, handle]);

  // Fetch products in category
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError
  } = useCategoryProducts(handle, { limit: 50 });

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

  const isLoading = isCategoriesLoading || isProductsLoading;

  // Get category meta
  const meta = categoryMeta[handle.toLowerCase()] || defaultMeta;
  const categoryName = category?.name || handle.charAt(0).toUpperCase() + handle.slice(1);

  if (productsError && !isLoading) {
    return (
      <PageLayout>
        <section className="py-32">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 border-2 border-gold/30 rotate-45 flex items-center justify-center">
                <X className="h-8 w-8 text-gold -rotate-45" />
              </div>
              <h1 className="font-display text-3xl tracking-wide mb-4">Category Not Found</h1>
              <p className="font-serif text-muted-foreground mb-8">
                The category you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Link
                href="/collections"
                className="btn-deco-ornate inline-block"
              >
                Browse Collections
              </Link>
            </motion.div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Immersive Hero */}
      <section ref={heroRef} className="relative h-[60vh] min-h-[450px] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <Image
            src={meta.image}
            alt={categoryName}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="deco-hero-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
        </motion.div>

        {/* Art Deco Frame */}
        <div className="absolute inset-6 md:inset-8 border border-gold/20 pointer-events-none" />

        {/* Corner accents */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 w-12 h-12 border-l-2 border-t-2 border-gold" />
        <div className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 border-r-2 border-t-2 border-gold" />
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 w-12 h-12 border-l-2 border-b-2 border-gold" />
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 border-r-2 border-b-2 border-gold" />

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <span className="h-px w-8 bg-gold" />
            <span className="font-display text-gold tracking-[0.4em] uppercase text-xs">
              {meta.tagline}
            </span>
            <span className="h-px w-8 bg-gold" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-5xl md:text-7xl tracking-wider mb-4"
          >
            {categoryName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="font-serif text-lg text-white/80 max-w-xl mx-auto"
          >
            {category?.description || meta.description}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
            <Sparkles className="h-4 w-4 text-gold" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
          </motion.div>
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-24 deco-section-light">
        <div className="container mx-auto px-4">
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
              <h3 className="font-display text-2xl tracking-wide mb-3">No Fragrances Yet</h3>
              <p className="font-serif text-muted-foreground mb-6">
                This category is being curated. Check back soon.
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

      {/* Related Categories */}
      {categoriesData?.product_categories && categoriesData.product_categories.length > 1 && (
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-2xl md:text-3xl tracking-wide mb-3">
                Explore More Categories
              </h2>
              <div className="flex items-center justify-center gap-2 text-gold">
                <div className="h-px w-8 bg-gold/50" />
                <div className="w-2 h-2 rotate-45 bg-gold" />
                <div className="h-px w-8 bg-gold/50" />
              </div>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              {categoriesData.product_categories
                .filter((c) => c.handle !== handle && c.is_active !== false)
                .slice(0, 6)
                .map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/category/${cat.handle}`}
                      className="block px-6 py-3 border border-border hover:border-gold hover:text-gold transition-colors font-display text-sm tracking-wider uppercase"
                    >
                      {cat.name}
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
