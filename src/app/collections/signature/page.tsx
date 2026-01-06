"use client";

import { useMemo } from "react";
import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { useProducts } from "@/lib/hooks";
import { transformProducts, filterByCollection } from "@/lib/transforms";

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

export default function SignatureCollectionPage() {
  // Fetch products from API
  const { data: productsData, isLoading, error } = useProducts({ limit: 50 });

  // Transform and filter products for signature collection
  const signatureProducts = useMemo(() => {
    if (!productsData?.items) return [];
    const allProducts = transformProducts(productsData.items);
    return filterByCollection(allProducts, 'signature');
  }, [productsData]);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80"
            alt="Signature Collection"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            The Collection
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            Signature
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            Our most iconic fragrances that define the Vernont legacy.
            Each one a masterpiece of perfumery art.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-display text-2xl tracking-wide mb-6">The Essence of Vernont</h2>
          <p className="font-serif text-muted-foreground leading-relaxed">
            The Signature Collection represents the very heart of Vernont. These are the
            fragrances that established our reputation for excellence—each one a perfect
            balance of artistry and emotion. From the mysterious depths of Velvet Oud to
            the romantic allure of Midnight Rose, these scents are designed to become
            part of your identity.
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
                  Signature Fragrances
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
          ) : signatureProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-muted-foreground">
                No fragrances found in this collection.
              </p>
            </div>
          ) : (
            <ProductGrid
              products={signatureProducts}
              title="Signature Fragrances"
              subtitle={`${signatureProducts.length} Iconic Scents`}
            />
          )}
        </div>
      </section>
    </PageLayout>
  );
}
