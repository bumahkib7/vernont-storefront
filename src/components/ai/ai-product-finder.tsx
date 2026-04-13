"use client";

import { useState, useRef } from "react";
import { Sparkle, MagnifyingGlass, SpinnerGap, ArrowRight } from "@/components/icons";
import { motion, AnimatePresence } from "framer-motion";
import { aiApi, resolveImageUrl, ApiError } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

interface FoundProduct {
  id: string;
  handle: string;
  title: string;
  brand?: string;
  thumbnail?: string;
  price?: string;
  priceMinor?: number;
  currency?: string;
}

/**
 * AI Product Finder — a prominent inline search bar that uses the AI agent
 * to find products based on natural language. Lives on the homepage and
 * collection pages as a first-class feature, not a hidden chat widget.
 */
export function AiProductFinder() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<FoundProduct[]>([]);
  const [aiSummary, setAiSummary] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q || isSearching) return;

    setIsSearching(true);
    setResults([]);
    setAiSummary("");
    setHasSearched(true);

    try {
      const response = await aiApi.findProducts(q);
      if (response.products) {
        setResults(
          response.products.map((p: any) => ({
            id: p.id,
            handle: p.handle || p.id,
            title: p.title,
            brand: p.brand,
            thumbnail: p.thumbnail,
            priceMinor: p.variants?.[0]?.priceMinor || p.lowestPriceMinor,
            currency: p.variants?.[0]?.currency || p.currency || "GBP",
          }))
        );
      }
    } catch (err) {
      // Fallback: no results
      setAiSummary("I couldn't find products matching that description. Try different keywords!");
    } finally {
      setIsSearching(false);
    }
  };

  const formatPrice = (priceMinor?: number, currency?: string) => {
    if (!priceMinor) return null;
    const symbols: Record<string, string> = { GBP: "£", EUR: "€", USD: "$" };
    const sym = symbols[currency || "GBP"] || "£";
    return `${sym}${(priceMinor / 100).toFixed(2)}`;
  };

  const suggestions = [
    "Bold sunglasses under £400",
    "Classic aviator frames",
    "Lightweight everyday glasses",
  ];

  return (
    <section className="w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white text-[10px] uppercase tracking-[0.2em] rounded-full mb-4">
          <Sparkle className="w-3 h-3 text-yellow-400" />
          AI-Powered Discovery
        </div>
        <h2 className="text-2xl md:text-3xl tracking-tight font-light">
          Describe what you&apos;re looking for
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Our AI searches the entire catalog to find your perfect match
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
        className="relative max-w-2xl mx-auto mb-6"
      >
        <div className="relative">
          <Sparkle className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. &quot;oversized tortoiseshell for a round face&quot;"
            className="w-full pl-14 pr-14 py-4 text-base border border-neutral-300 rounded-full focus:outline-none focus:border-black transition-colors bg-white"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors disabled:opacity-30"
          >
            {isSearching ? (
              <SpinnerGap className="w-4 h-4 animate-spin" />
            ) : (
              <MagnifyingGlass className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* Quick suggestion chips */}
      {!hasSearched && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); handleSearch(s); }}
              className="px-4 py-2 border border-neutral-200 rounded-full text-xs hover:border-black hover:bg-neutral-50 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 py-8 text-sm text-neutral-500"
          >
            <SpinnerGap className="w-4 h-4 animate-spin" />
            Searching our catalog...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {!isSearching && hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {aiSummary && (
              <p className="text-center text-sm text-neutral-600 mb-6">{aiSummary}</p>
            )}

            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {results.slice(0, 8).map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/product/${product.handle}`}
                      className="block group"
                    >
                      <div className="aspect-square relative bg-white rounded-lg overflow-hidden mb-2">
                        {resolveImageUrl(product.thumbnail) ? (
                          <Image
                            src={resolveImageUrl(product.thumbnail)!}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <Sparkle className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        {product.brand && (
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{product.brand}</p>
                        )}
                        <p className="text-sm font-medium truncate group-hover:text-neutral-600 transition-colors">{product.title}</p>
                        {formatPrice(product.priceMinor, product.currency) && (
                          <p className="text-sm">{formatPrice(product.priceMinor, product.currency)}</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : !aiSummary ? (
              <p className="text-center text-sm text-neutral-500 py-4">
                No products found. Try describing what you&apos;re looking for differently.
              </p>
            ) : null}

            {results.length > 0 && (
              <div className="text-center mt-6">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all"
                >
                  View all results
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
