"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ListingProductCard } from "@/components/ListingProductCard";
import { useCategories, useCategoryProducts } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";

const categoryMeta: Record<string, { image: string; description: string }> = {
  sunglasses: {
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1920&q=80",
    description: "Designer sunglasses from the world's most coveted brands",
  },
  aviator: {
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80",
    description: "Timeless teardrop silhouettes that evoke effortless style",
  },
  "cat-eye": {
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80",
    description: "Upswept frames with dramatic flair and vintage sophistication",
  },
  round: {
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1920&q=80",
    description: "Circular frames with intellectual charm and laid-back refinement",
  },
  wayfarer: {
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1920&q=80",
    description: "Iconic trapezoidal frames that define casual elegance",
  },
  square: {
    image: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=1920&q=80",
    description: "Angular frames that convey confidence and modern sensibility",
  },
  rectangular: {
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1920&q=80",
    description: "Clean, proportioned frames with understated elegance",
  },
  oversized: {
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80",
    description: "Generously proportioned frames that command attention",
  },
  optical: {
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&q=80",
    description: "Prescription-ready frames combining clarity with style",
  },
};

const defaultMeta = {
  image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80",
  description: "Explore our carefully curated selection of exceptional eyewear",
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function CategoryPage() {
  const params = useParams();
  const handle = params.handle as string;
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();

  const category = useMemo(() => {
    if (!categoriesData?.product_categories) return null;
    return categoriesData.product_categories.find((c) => c.handle === handle);
  }, [categoriesData, handle]);

  const {
    data: productsData,
    isLoading: isProductsLoading,
  } = useCategoryProducts(handle, { limit: 50 });

  const displayProducts = useMemo(() => {
    if (!productsData?.items) return [];
    const products = transformProducts(productsData.items);

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
  const meta = categoryMeta[handle.toLowerCase()] || defaultMeta;
  const categoryName = category?.name || handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, " ");
  const currentSort = sortOptions.find((o) => o.value === sortBy)?.label || "Featured";

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden bg-[#0a0a0a]">
        <Image
          src={meta.image}
          alt={categoryName}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative w-full w-full px-6 lg:px-20 pb-12 lg:pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs tracking-wider uppercase text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <CaretRight className="w-3 h-3" />
            <Link href="/eyewear" className="hover:text-white transition-colors">Eyewear</Link>
            <CaretRight className="w-3 h-3" />
            <span className="text-white/80">{categoryName}</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-3">
            {categoryName}
          </h1>
          <p className="text-white/60 max-w-lg text-lg font-light">
            {category?.description || meta.description}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 lg:py-28 px-6 lg:px-20">
        <div className="w-full">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-[var(--border)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              {isLoading ? (
                <span className="inline-block w-24 h-4 bg-[var(--surface)] animate-pulse rounded-sm" />
              ) : (
                `${displayProducts.length} product${displayProducts.length !== 1 ? "s" : ""}`
              )}
            </p>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-sm px-4 py-2 border border-[var(--border)] rounded-sm hover:border-[var(--foreground)] transition-colors"
              >
                <span>Sort: {currentSort}</span>
                <CaretDown className={`h-4 w-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>

              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-[var(--background)] border border-[var(--border)] rounded-sm shadow-md z-20 min-w-[200px]">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--surface)] transition-colors ${
                          sortBy === option.value ? "font-medium text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Grid */}
          {isProductsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[var(--surface)] rounded-sm" />
                  <div className="pt-4 space-y-2">
                    <div className="h-3 w-16 bg-[var(--surface)] rounded-sm" />
                    <div className="h-4 w-32 bg-[var(--surface)] rounded-sm" />
                    <div className="h-4 w-20 bg-[var(--surface)] rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-light tracking-tight mb-2">No Frames Yet</h3>
              <p className="text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto">
                We&apos;re adding pieces to this category. Explore our other categories in the meantime.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/eyewear"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Browse All Eyewear
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm text-neutral-600 hover:text-black transition-colors"
                >
                  Explore Collections
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {displayProducts.map((product, index) => (
                <ListingProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      {categoriesData?.product_categories && categoriesData.product_categories.length > 1 && (
        <section className="py-16 lg:py-20 px-6 lg:px-20 border-t border-[var(--border)]">
          <div className="w-full">
            <h2 className="text-sm font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-8">
              More Categories
            </h2>

            <div className="flex flex-wrap gap-3">
              {categoriesData.product_categories
                .filter((c) => c.handle !== handle && c.is_active !== false)
                .slice(0, 8)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.handle}`}
                    className="px-5 py-2.5 border border-[var(--border)] rounded-sm text-sm hover:border-[var(--foreground)] transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
