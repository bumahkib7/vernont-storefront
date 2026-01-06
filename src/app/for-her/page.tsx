"use client";

import { useMemo } from "react";
import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { useProducts } from "@/lib/hooks";
import { transformProducts, filterByGender } from "@/lib/transforms";

// Loading skeleton
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-secondary" />
          <div className="pt-5 text-center space-y-2">
            <div className="h-3 w-16 bg-secondary mx-auto" />
            <div className="h-5 w-32 bg-secondary mx-auto" />
            <div className="h-3 w-24 bg-secondary mx-auto" />
            <div className="h-5 w-20 bg-secondary mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ForHerPage() {
  // Fetch products from API
  const { data: productsData, isLoading, error } = useProducts({ limit: 50 });

  // Transform and filter products for women
  const womenProducts = useMemo(() => {
    if (!productsData?.items) return [];
    const allProducts = transformProducts(productsData.items);
    return filterByGender(allProducts, 'women');
  }, [productsData]);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1920&q=80"
            alt="Fragrances for Her"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Timeless Femininity
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            For Her
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            Fragrances that celebrate the essence of femininity, from ethereal florals
            to captivating orientals
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <>
              <div className="text-center mb-12">
                <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                  Loading...
                </p>
                <h2 className="font-display text-3xl md:text-4xl tracking-wide">
                  Feminine Fragrances
                </h2>
              </div>
              <ProductsSkeleton />
            </>
          ) : error ? (
            <div className="text-center py-12">
              <p className="font-serif text-muted-foreground">
                Unable to load products. Please try again later.
              </p>
            </div>
          ) : womenProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-muted-foreground">
                No fragrances found in this category.
              </p>
            </div>
          ) : (
            <ProductGrid
              products={womenProducts}
              title="Feminine Fragrances"
              subtitle={`${womenProducts.length} Perfumes`}
            />
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl tracking-wide">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Floral", "Oriental", "Fresh", "Gourmand"].map((category) => (
              <div
                key={category}
                className="text-center p-6 border border-border hover:border-gold transition-colors cursor-pointer"
              >
                <h3 className="font-display text-lg tracking-wide">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
