"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCollections } from "@/lib/hooks";
import { getCollectionImage } from "@/lib/collection-images";

export default function CollectionsPage() {
  const { data: collectionsData, isLoading, error } = useCollections();
  const collections = collectionsData?.collections ?? [];
  const featured = collections[0];
  const rest = collections.slice(1);

  return (
    <PageLayout>
      {/* Featured Collection Hero */}
      {featured && !isLoading && (
        <Link
          href={`/collections/${featured.handle}`}
          className="group block relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden"
        >
          <Image
            src={getCollectionImage(featured.handle, 0, featured.thumbnail)}
            alt={featured.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-[1500px] w-full mx-auto px-6 lg:px-20 pb-12 lg:pb-16">
              <p className="text-xs text-white/60 uppercase tracking-widest mb-2">Featured Collection</p>
              <h1 className="text-4xl sm:text-5xl text-white font-light tracking-tight mb-2">
                {featured.title}
              </h1>
              {featured.description && (
                <p className="text-white/70 text-lg max-w-md mb-4">{featured.description}</p>
              )}
              <span className="inline-flex items-center gap-2 text-white text-sm font-medium uppercase tracking-wider border-b border-white/50 pb-0.5 group-hover:border-white transition-colors">
                Explore Collection <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Page Header (shown when no featured or loading) */}
      {(!featured || isLoading) && (
        <section className="pt-12 pb-8 md:pt-16 md:pb-12">
          <div className="max-w-[1500px] mx-auto px-6 lg:px-20">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-widest mb-3">
              Our Collections
            </p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Curated Eyewear
            </h1>
          </div>
        </section>
      )}

      {/* Collections Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-20">
          {/* Section header when featured exists */}
          {featured && !isLoading && (
            <div className="mb-10">
              <h2 className="text-2xl lg:text-3xl font-medium tracking-tight">All Collections</h2>
              <p className="text-[var(--muted-foreground)] mt-1">
                {collections.length} {collections.length === 1 ? "collection" : "collections"}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[var(--surface)]" />
                  <div className="mt-4 space-y-2">
                    <div className="h-5 w-32 bg-[var(--surface)]" />
                    <div className="h-4 w-48 bg-[var(--surface)]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-[var(--muted-foreground)]">Unable to load collections.</p>
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--muted-foreground)] mb-6">No collections available yet.</p>
              <Link href="/eyewear" className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium">
                Shop All Eyewear <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {(featured ? rest : collections).map((collection, index) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)]">
                    <Image
                      src={getCollectionImage(collection.handle, index + 1, collection.thumbnail)}
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white text-lg font-medium tracking-tight drop-shadow-lg">
                        {collection.title}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <h3 className="text-base font-medium tracking-tight">{collection.title}</h3>
                    <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-1 transition-all" />
                  </div>
                  {collection.description && (
                    <p className="mt-1 text-sm text-[var(--muted-foreground)] line-clamp-1">{collection.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 lg:py-20 bg-[var(--surface)]">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-20 text-center">
          <h2 className="text-2xl lg:text-3xl font-light tracking-tight mb-3">
            Not sure where to start?
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
            Browse all our eyewear or use our filters to find your perfect frame.
          </p>
          <Link
            href="/eyewear"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Shop All Eyewear
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
