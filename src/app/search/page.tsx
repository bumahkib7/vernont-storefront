"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { productsApi, type Product } from "@/lib/api";
import { transformProducts, type DisplayProduct } from "@/lib/transforms";

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

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [searchInput, setSearchInput] = useState(query);

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

  // Transform and sort products
  const displayProducts = useMemo(() => {
    if (products.length === 0) return [];
    let transformed = transformProducts(products);

    switch (sortBy) {
      case "price-low":
        return [...transformed].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...transformed].sort((a, b) => b.price - a.price);
      case "name-asc":
        return [...transformed].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...transformed].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return transformed;
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
    <PageLayout>
      {/* Search Header */}
      <section className="border-b border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-12">
          {/* Back link */}
          <Link
            href="/fragrances"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-serif text-sm">Back to all fragrances</span>
          </Link>

          {/* Search input */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            {/* Decorative corners */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-gold/40" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-gold/40" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-gold/40" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-gold/40" />

            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gold/60" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for fragrances, notes, brands..."
              className="w-full pl-14 pr-12 py-5 bg-background border border-gold/20 font-serif text-lg tracking-wide placeholder:text-muted-foreground placeholder:italic focus:outline-none focus:border-gold/60 transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>

          {/* Search info */}
          {query && (
            <div className="mt-6">
              <h1 className="font-display text-2xl md:text-3xl tracking-wide">
                Search results for{" "}
                <span className="text-gold italic">&ldquo;{query}&rdquo;</span>
              </h1>
              {!loading && (
                <p className="font-serif text-muted-foreground mt-2">
                  {displayProducts.length === 0
                    ? "No products found"
                    : `Found ${displayProducts.length} fragrance${displayProducts.length !== 1 ? "s" : ""}`}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Filters bar */}
      {query && displayProducts.length > 0 && (
        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="font-serif text-sm">
                  {displayProducts.length} result{displayProducts.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="font-serif bg-transparent border border-border px-4 py-2 focus:outline-none focus:border-gold text-sm"
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {!query ? (
            /* No query - show prompt */
            <div className="text-center py-16">
              <div className="relative inline-block mb-8">
                {/* Decorative frame */}
                <div className="absolute -inset-4 border border-gold/20" />
                <div className="absolute -inset-6 border border-gold/10" />
                <Search className="h-16 w-16 text-gold/30" />
              </div>
              <h2 className="font-display text-2xl tracking-wide mb-4">
                Discover Your Signature Scent
              </h2>
              <p className="font-serif text-muted-foreground max-w-md mx-auto mb-8">
                Enter a search term above to explore our collection of exquisite fragrances.
                Search by name, brand, or fragrance notes.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Oud", "Rose", "Jasmine", "Sandalwood", "Amber"].map((term) => (
                  <button
                    key={term}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
                    className="px-4 py-2 border border-gold/30 font-serif text-sm hover:border-gold hover:text-gold transition-all"
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
              <p className="font-serif text-muted-foreground mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-gold font-display text-xs tracking-[0.15em] uppercase hover:bg-gold hover:text-primary transition-all"
              >
                Try Again
              </button>
            </div>
          ) : displayProducts.length === 0 ? (
            /* No results */
            <div className="text-center py-16">
              <div className="relative inline-block mb-8">
                <div className="absolute -inset-4 border border-gold/20" />
                <Search className="h-12 w-12 text-gold/20" />
              </div>
              <h2 className="font-display text-xl tracking-wide mb-4">
                No fragrances found
              </h2>
              <p className="font-serif text-muted-foreground max-w-md mx-auto mb-8">
                We couldn&apos;t find any products matching &ldquo;{query}&rdquo;.
                Try different keywords or browse our collections.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/fragrances"
                  className="px-6 py-3 border border-gold font-display text-xs tracking-[0.15em] uppercase hover:bg-gold hover:text-primary transition-all"
                >
                  Browse All Fragrances
                </Link>
                <Link
                  href="/collections"
                  className="px-6 py-3 border border-border font-display text-xs tracking-[0.15em] uppercase hover:border-gold transition-all"
                >
                  View Collections
                </Link>
              </div>
            </div>
          ) : (
            <ProductGrid products={displayProducts} />
          )}
        </div>
      </section>
    </PageLayout>
  );
}

// Wrap in Suspense for useSearchParams
export default function SearchPage() {
  return (
    <Suspense fallback={
      <PageLayout>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ProductsSkeleton />
          </div>
        </section>
      </PageLayout>
    }>
      <SearchContent />
    </Suspense>
  );
}
