"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowLeft, SlidersHorizontal, X, Loader2, Heart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { productsApi, type Product } from "@/lib/api";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/context/CartContext";

// Loading skeleton
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-[var(--surface)] rounded-lg" />
          <div className="pt-4 space-y-2">
            <div className="h-3 w-16 bg-[var(--surface)] rounded" />
            <div className="h-4 w-32 bg-[var(--surface)] rounded" />
            <div className="h-4 w-20 bg-[var(--surface)] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const variant = product.variants?.[0];
  const price = variant?.priceMinor ?? product.lowestPriceMinor ?? 0;
  const compareAtPrice = variant?.compareAtPriceMinor;
  const currency = variant?.currency ?? product.currency ?? "GBP";

  return (
    <div className="group relative">
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleItem(product.id);
        }}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </button>

      <Link href={`/product/${product.handle || product.id}`}>
        {/* Image */}
        <div className="aspect-square relative bg-[var(--surface)] rounded-lg overflow-hidden mb-3">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--muted-foreground)]">
              No image
            </div>
          )}

          {/* Sale Badge */}
          {compareAtPrice && compareAtPrice > price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              Sale
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          {product.brand && (
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">
              {product.brand}
            </p>
          )}
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{formatPrice(price, currency)}</p>
            {compareAtPrice && compareAtPrice > price && (
              <p className="text-sm text-[var(--muted-foreground)] line-through">
                {formatPrice(compareAtPrice, currency)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [searchInput, setSearchInput] = useState(query);

  // Sync search input with URL query
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Fetch products when query changes
  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productsApi.list({ query, limit: 50 });
        setProducts(response.items);
      } catch (err) {
        console.error("Search error:", err);
        setError("Unable to search products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (products.length === 0) return [];
    let sorted = [...products];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) =>
          (a.lowestPriceMinor ?? 0) - (b.lowestPriceMinor ?? 0)
        );
      case "price-high":
        return sorted.sort((a, b) =>
          (b.lowestPriceMinor ?? 0) - (a.lowestPriceMinor ?? 0)
        );
      case "name-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    router.push("/search");
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          {/* Back link */}
          <Link
            href="/fragrances"
            className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to all fragrances</span>
          </Link>

          {/* Search input */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, brand, SKU, or product ID..."
              className="w-full pl-12 pr-12 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>

          {/* Search info */}
          {query && (
            <div className="mt-6">
              <h1 className="text-2xl lg:text-3xl font-bold">
                Search results for &ldquo;{query}&rdquo;
              </h1>
              {!loading && (
                <p className="text-[var(--muted-foreground)] mt-2">
                  {sortedProducts.length === 0
                    ? "No products found"
                    : `Found ${sortedProducts.length} product${sortedProducts.length !== 1 ? "s" : ""}`}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Filters bar */}
        {query && sortedProducts.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--border)] mb-8">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm">
                {sortedProducts.length} result{sortedProducts.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        )}

        {/* Results */}
        {!query ? (
          /* No query - show prompt */
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-[var(--muted-foreground)]" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              Search our collection
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-md mx-auto mb-8">
              Search by product name, brand, SKU, or even product ID to find exactly what you&apos;re looking for.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Oud", "Rose", "Tom Ford", "Creed", "Gift Sets"].map((term) => (
                <button
                  key={term}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
                  className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-sm hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : loading ? (
          <ProductsSkeleton />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-[var(--muted-foreground)] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : sortedProducts.length === 0 ? (
          /* No results */
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-[var(--muted-foreground)]" />
            </div>
            <h2 className="text-xl font-bold mb-4">
              No products found
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-md mx-auto mb-8">
              We couldn&apos;t find any products matching &ldquo;{query}&rdquo;.
              Try different keywords or browse our collections.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/fragrances" className="btn-primary">
                Browse All Fragrances
              </Link>
              <Link href="/collections" className="btn-secondary">
                View Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)]">
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
