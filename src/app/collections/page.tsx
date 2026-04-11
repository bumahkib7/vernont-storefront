"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
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

      {/* SEO Content Section */}
      <section className="max-w-[1500px] mx-auto px-6 lg:px-20 py-12 border-b border-neutral-200">
        <div className="prose max-w-none">
          <div className="mb-8">
            <p className="text-[15px] leading-relaxed text-neutral-700 mb-4">
              Explore Vernont's expertly curated eyewear collections, each thoughtfully designed around specific styles, occasions, or trends. Our collections make it easy to discover frames that align with your aesthetic preferences, lifestyle needs, or the season's latest fashion movements. From timeless classics that never go out of style to avant-garde designs pushing the boundaries of contemporary eyewear, each collection tells a unique story through carefully selected pieces from the world's finest brands.
            </p>
            <p className="text-[15px] leading-relaxed text-neutral-700">
              Whether you're building a wardrobe of versatile everyday frames, seeking statement sunglasses for special occasions, or looking for performance eyewear for outdoor adventures, our collections provide curated starting points for your perfect eyewear discovery journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-sm">
              <h2 className="text-[18px] font-semibold text-neutral-900 mb-3">Seasonal Collections</h2>
              <p className="text-[14px] leading-relaxed text-neutral-700 mb-3">
                Our seasonal collections capture the essence of each time of year, featuring frames and lens colors perfectly suited to spring blooms, summer adventures, autumn elegance, and winter sports. Updated quarterly with fresh arrivals and trending styles.
              </p>
              <p className="text-[13px] text-neutral-600">
                <strong>Includes:</strong> Summer Essentials, Winter Sports, Spring Renewal, Autumn Classics
              </p>
            </div>

            <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-sm">
              <h2 className="text-[18px] font-semibold text-neutral-900 mb-3">Lifestyle Collections</h2>
              <p className="text-[14px] leading-relaxed text-neutral-700 mb-3">
                Curated around how you live and what you love. From beach vacations and urban commutes to mountain adventures and office-ready professional frames, these collections match eyewear to your activities and environment.
              </p>
              <p className="text-[13px] text-neutral-600">
                <strong>Includes:</strong> Outdoor Performance, Urban Commuter, Beach & Resort, Professional Collection
              </p>
            </div>

            <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-sm">
              <h2 className="text-[18px] font-semibold text-neutral-900 mb-3">Designer Collaborations</h2>
              <p className="text-[14px] leading-relaxed text-neutral-700 mb-3">
                Exclusive limited-edition collections from designer partnerships and special brand capsule releases. These unique pieces blend fashion house heritage with innovative eyewear design for truly distinctive frames.
              </p>
              <p className="text-[13px] text-neutral-600">
                <strong>Includes:</strong> Limited editions, celebrity collaborations, artist partnerships, heritage re-issues
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-neutral-900 mb-4">How Our Collections Work</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-[16px] font-medium text-neutral-900 mb-2">Expertly Curated</h3>
                <p className="text-[14px] text-neutral-700 mb-4">
                  Each collection is assembled by our team of eyewear specialists and fashion consultants who analyze trends, customer preferences, and seasonal needs. We hand-select every piece to ensure cohesive aesthetics and complementary styles within each collection.
                </p>
                <h3 className="text-[16px] font-medium text-neutral-900 mb-2">Multi-Brand Selections</h3>
                <p className="text-[14px] text-neutral-700">
                  Unlike single-brand showcases, our collections span multiple designers and price points, allowing you to compare styles, discover new brands, and find the perfect frame regardless of your budget or brand loyalty.
                </p>
              </div>
              <div>
                <h3 className="text-[16px] font-medium text-neutral-900 mb-2">Regularly Refreshed</h3>
                <p className="text-[14px] text-neutral-700 mb-4">
                  Collections evolve with fashion cycles, customer feedback, and new product launches. We continuously add fresh arrivals and retire dated styles to keep every collection current, relevant, and inspiring.
                </p>
                <h3 className="text-[16px] font-medium text-neutral-900 mb-2">Easy Navigation</h3>
                <p className="text-[14px] text-neutral-700">
                  Shopping by collection simplifies your search by pre-filtering thousands of frames down to curated selections. Save time, discover unexpected styles, and find frames that match your intended use or aesthetic preference.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 p-6 rounded-lg mb-8">
            <h2 className="text-[18px] font-semibold text-neutral-900 mb-3">Popular Collection Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[14px]">
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Bestsellers</h3>
                <p className="text-neutral-600 text-[13px]">Customer favorites and top-rated frames</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">New Arrivals</h3>
                <p className="text-neutral-600 text-[13px]">Latest releases and fresh styles</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Sale Items</h3>
                <p className="text-neutral-600 text-[13px]">Premium frames at discounted prices</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Timeless Classics</h3>
                <p className="text-neutral-600 text-[13px]">Iconic styles that transcend trends</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Bold & Statement</h3>
                <p className="text-neutral-600 text-[13px]">Oversized, colorful, and dramatic frames</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Minimalist</h3>
                <p className="text-neutral-600 text-[13px]">Clean lines and understated elegance</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Sport & Active</h3>
                <p className="text-neutral-600 text-[13px]">Performance eyewear for athletes</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Eco-Friendly</h3>
                <p className="text-neutral-600 text-[13px]">Sustainable materials and production</p>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-neutral-300 pl-6">
            <h2 className="text-[18px] font-semibold text-neutral-900 mb-3">Shopping Tips: Making the Most of Our Collections</h2>
            <ul className="space-y-2 text-[14px] text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="text-neutral-500 mt-1">•</span>
                <span><strong>Start Broad, Then Filter:</strong> Browse a collection that matches your general style, then use filters for color, price, or brand to narrow results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-500 mt-1">•</span>
                <span><strong>Mix Collections:</strong> Don't limit yourself to one collection - explore multiple to discover diverse styles and compare options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-500 mt-1">•</span>
                <span><strong>Check Back Regularly:</strong> Collections update frequently with new additions, so your perfect frame might arrive next week</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-500 mt-1">•</span>
                <span><strong>Save Favorites:</strong> Use your wishlist to bookmark frames from different collections for easy comparison later</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

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
