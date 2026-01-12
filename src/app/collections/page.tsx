"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCollections } from "@/lib/hooks";
import { getCollectionImage } from "@/lib/collection-images";

function CollectionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/3] bg-neutral-100" />
          <div className="mt-4 space-y-2">
            <div className="h-5 w-32 bg-neutral-100" />
            <div className="h-4 w-48 bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

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
  // Use curated fragrance images instead of backend thumbnails
  const imageUrl = getCollectionImage(collection.handle, index);

  return (
    <Link
      href={`/collections/${collection.handle}`}
      className="group block"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <Image
          src={imageUrl}
          alt={collection.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium tracking-tight group-hover:text-neutral-600 transition-colors">
            {collection.title}
          </h3>
          <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
        </div>
        {collection.description && (
          <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
            {collection.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function CollectionsPage() {
  const { data: collectionsData, isLoading, error } = useCollections();
  const collections = collectionsData?.collections ?? [];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm text-neutral-500 uppercase tracking-wide mb-3">
              Our Collections
            </p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Curated Fragrances
            </h1>
            <p className="text-lg text-neutral-600">
              Explore our carefully curated collections, each telling a unique story
              through the art of perfumery.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {isLoading ? (
            <CollectionsSkeleton />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-neutral-500">
                Unable to load collections. Please try again later.
              </p>
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-500">
                No collections available at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {collections.map((collection, index) => (
                <CollectionCard key={collection.id} collection={collection} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
            Not sure where to start?
          </h2>
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            Browse all our fragrances or use our filters to find your perfect scent.
          </p>
          <Link
            href="/fragrances"
            className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Shop All Fragrances
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
