"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, TrendingUp, Clock, Tag, ArrowRight } from "lucide-react";
import { productsApi, type Product } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchSuggestions {
  products: string[];
  brands: string[];
}

// Popular searches to show when input is empty
const POPULAR_SEARCHES = [
  "Oud",
  "Rose",
  "Jasmine",
  "Sandalwood",
  "Amber",
  "Musk",
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({ products: [], brands: [] });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions({ products: [], brands: [] });
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Fetch suggestions and products in parallel
        const [suggestionsRes, productsRes] = await Promise.all([
          productsApi.getSuggestions(query, 5),
          productsApi.search(query, 4),
        ]);
        setSuggestions(suggestionsRes);
        setProducts(productsRes.products);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const saveRecentSearch = useCallback((searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  }, [recentSearches]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    saveRecentSearch(searchTerm.trim());
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const hasResults = suggestions.products.length > 0 || suggestions.brands.length > 0 || products.length > 0;
  const showEmptyState = query.length < 2;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-background"
        >
          {/* Close on background click */}
          <div className="absolute inset-0" onClick={onClose} />

          <div className="relative container mx-auto px-4 py-8 max-w-4xl">
            {/* Search Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-xl tracking-[0.2em] uppercase text-gold">Search</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:text-gold transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSubmit} className="relative mb-8">
              {/* Decorative corners */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-gold/40" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-gold/40" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-gold/40" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-gold/40" />

              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gold/60" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for fragrances, notes, brands..."
                className="w-full pl-14 pr-12 py-5 bg-transparent border border-gold/20 font-serif text-lg tracking-wide placeholder:text-muted-foreground placeholder:italic focus:outline-none focus:border-gold/60 transition-colors"
              />
              {loading && (
                <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gold/60" />
              )}
            </form>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto">
              {showEmptyState ? (
                /* Empty State - Show recent & popular searches */
                <div className="space-y-8">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-sm tracking-[0.15em] uppercase text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Recent Searches
                        </h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-muted-foreground hover:text-gold transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className="px-4 py-2 border border-gold/20 font-serif text-sm hover:border-gold hover:text-gold transition-all"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <h3 className="font-display text-sm tracking-[0.15em] uppercase text-muted-foreground flex items-center gap-2 mb-4">
                      <TrendingUp className="h-4 w-4" />
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-4 py-2 border border-gold/20 font-serif text-sm hover:border-gold hover:text-gold transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : hasResults ? (
                /* Search Results */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Suggestions Column */}
                  <div className="space-y-6">
                    {/* Brand Suggestions */}
                    {suggestions.brands.length > 0 && (
                      <div>
                        <h3 className="font-display text-xs tracking-[0.15em] uppercase text-muted-foreground mb-3">
                          Brands
                        </h3>
                        <div className="space-y-1">
                          {suggestions.brands.map((brand) => (
                            <button
                              key={brand}
                              onClick={() => handleSearch(brand)}
                              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gold/5 transition-colors group"
                            >
                              <Tag className="h-4 w-4 text-gold/60" />
                              <span className="font-serif">{brand}</span>
                              <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 text-gold transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Title Suggestions */}
                    {suggestions.products.length > 0 && (
                      <div>
                        <h3 className="font-display text-xs tracking-[0.15em] uppercase text-muted-foreground mb-3">
                          Suggestions
                        </h3>
                        <div className="space-y-1">
                          {suggestions.products.map((title) => (
                            <button
                              key={title}
                              onClick={() => handleSearch(title)}
                              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gold/5 transition-colors group"
                            >
                              <Search className="h-4 w-4 text-muted-foreground" />
                              <span className="font-serif">{title}</span>
                              <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 text-gold transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Products Column */}
                  {products.length > 0 && (
                    <div>
                      <h3 className="font-display text-xs tracking-[0.15em] uppercase text-muted-foreground mb-3">
                        Products
                      </h3>
                      <div className="space-y-3">
                        {products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.handle || product.id}`}
                            onClick={onClose}
                            className="flex items-center gap-4 p-3 border border-transparent hover:border-gold/20 hover:bg-gold/5 transition-all group"
                          >
                            {product.thumbnail ? (
                              <div className="relative w-16 h-16 bg-secondary flex-shrink-0">
                                <Image
                                  src={product.thumbnail}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-secondary flex-shrink-0 flex items-center justify-center">
                                <span className="text-2xl text-gold/40">V</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-display text-sm tracking-wide truncate group-hover:text-gold transition-colors">
                                {product.title}
                              </p>
                              {product.brand && (
                                <p className="font-serif text-xs text-muted-foreground truncate">
                                  {product.brand}
                                </p>
                              )}
                              {product.variants?.[0]?.priceMinor && (
                                <p className="font-display text-sm text-gold mt-1">
                                  {product.variants[0].currency || "GBP"}{" "}
                                  {(product.variants[0].priceMinor / 100).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* View All Results */}
                      <button
                        onClick={() => handleSearch(query)}
                        className="flex items-center justify-center gap-2 w-full mt-4 py-3 border border-gold/30 font-display text-xs tracking-[0.15em] uppercase hover:bg-gold hover:text-primary transition-all"
                      >
                        View All Results
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : query.length >= 2 && !loading ? (
                /* No Results */
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-gold/20 mb-4" />
                  <p className="font-display text-lg tracking-wide">No results found</p>
                  <p className="font-serif text-muted-foreground mt-2">
                    Try different keywords or browse our collections
                  </p>
                  <Link
                    href="/collections"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 border border-gold font-display text-xs tracking-[0.15em] uppercase hover:bg-gold hover:text-primary transition-all"
                  >
                    Browse Collections
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Keyboard hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd>
                to search
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd>
                to close
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
