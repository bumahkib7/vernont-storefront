"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { useProducts } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";
import { useCompare } from "@/context/CompareContext";
import {
  Check,
  Truck,
  RotateCcw,
  Gift,
  Star,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Fragrance notes - clean, no emojis
const FRAGRANCE_NOTES = [
  "Oud", "Rose", "Vanilla", "Bergamot", "Sandalwood", "Amber",
  "Jasmine", "Musk", "Citrus", "Leather", "Vetiver", "Iris",
];

// Visual categories
const VISUAL_CATEGORIES = [
  {
    label: "For Her",
    href: "/fragrances?category=women",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
  },
  {
    label: "For Him",
    href: "/fragrances?category=men",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400",
  },
  {
    label: "Unisex",
    href: "/fragrances?category=unisex",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400",
  },
  {
    label: "Niche",
    href: "/fragrances?type=niche",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400",
  },
  {
    label: "Gift Sets",
    href: "/fragrances?category=gift-sets",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
  },
  {
    label: "New In",
    href: "/fragrances?sort=newest",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400",
  },
];

// Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    text: "Arrived in 2 days, exactly as described. Authentic product with great packaging.",
    author: "Sarah T.",
    location: "London",
    rating: 5,
  },
  {
    id: 2,
    text: "Best selection of niche fragrances I've found. The samples are a game-changer.",
    author: "James M.",
    location: "Manchester",
    rating: 5,
  },
  {
    id: 3,
    text: "Customer service was exceptional. They really know their fragrances.",
    author: "Emily R.",
    location: "Edinburgh",
    rating: 5,
  },
];

export default function Home() {
  const { data: productsData, isLoading } = useProducts({ limit: 12 });
  const { openDrawer } = useCompare();

  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const displayProducts = productsData?.items ? transformProducts(productsData.items) : [];
  const bestSellers = displayProducts.slice(0, 8);
  const newArrivals = displayProducts.slice(4, 12);

  const toggleNote = (note: string) => {
    setSelectedNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollProducts = (containerId: string, direction: 'left' | 'right') => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main>
        {/* Hero Section - Clean, Editorial Style */}
        <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 min-h-[85vh]">
              {/* Left: Content */}
              <div className="flex flex-col justify-center px-6 lg:px-12 py-16 lg:py-24">
                <p className="text-sm tracking-[0.2em] text-white/60 uppercase mb-6">
                  Authentic Fragrances
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-6 leading-[1.1]">
                  Find Your
                  <span className="block font-medium">Signature Scent</span>
                </h1>
                <p className="text-lg text-white/70 mb-10 max-w-md leading-relaxed">
                  Discover 2,400+ fragrances from 180+ designer and niche brands.
                  Free samples included with every order.
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <Link
                    href="/fragrances"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors"
                  >
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/quiz"
                    className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    Take the Quiz
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/50">
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> 100% Authentic
                  </span>
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Free UK Delivery
                  </span>
                  <span className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" /> 30-Day Returns
                  </span>
                </div>
              </div>

              {/* Right: Image Grid */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4">
                  {displayProducts.slice(0, 4).map((product, index) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.handle || product.id}`}
                      className={`relative overflow-hidden group ${
                        index === 0 ? 'row-span-2' : ''
                      }`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-sm font-medium truncate">{product.name}</p>
                        <p className="text-white/70 text-sm">£{Math.round(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Band */}
        <section className="py-4 bg-[var(--surface)] border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center lg:justify-between items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Authentic Products</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Free Shipping £75+</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                <span>30-Day Returns</span>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <Gift className="h-4 w-4" />
                <span>Free Samples</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span className="font-medium">4.8</span>
                <span className="text-[var(--muted-foreground)]">(12,400+ reviews)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-16 lg:py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-medium">Best Sellers</h2>
                <p className="text-[var(--muted-foreground)] mt-1">Our most loved fragrances</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollProducts('bestsellers-scroll', 'left')}
                  className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollProducts('bestsellers-scroll', 'right')}
                  className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <Link
                  href="/fragrances?sort=bestselling"
                  className="hidden sm:flex items-center gap-1 ml-4 text-sm font-medium hover:underline"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div
              id="bestsellers-scroll"
              className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x"
            >
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[260px] aspect-[3/4] bg-[var(--surface)] animate-pulse rounded-lg" />
                  ))
                : bestSellers.map((product, index) => (
                    <div key={product.id} className="flex-shrink-0 w-[260px] snap-start">
                      <EnhancedProductCard product={product} index={index} />
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="py-16 lg:py-20 px-6 lg:px-12 bg-[var(--surface)]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-medium">Shop by Category</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
              {VISUAL_CATEGORIES.map((category) => (
                <Link
                  key={category.label}
                  href={category.href}
                  className="group relative aspect-[3/4] overflow-hidden bg-[var(--background)]"
                >
                  <Image
                    src={category.image}
                    alt={category.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="text-white font-medium">{category.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Notes */}
        <section className="py-16 lg:py-20 px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-medium mb-3">Shop by Notes</h2>
            <p className="text-[var(--muted-foreground)] mb-8">
              Select your preferred scent profiles
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {FRAGRANCE_NOTES.map((note) => (
                <button
                  key={note}
                  onClick={() => toggleNote(note)}
                  className={`px-4 py-2 text-sm border transition-all ${
                    selectedNotes.includes(note)
                      ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                      : "border-[var(--border)] hover:border-[var(--foreground)]"
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>

            {selectedNotes.length > 0 && (
              <div className="space-y-3">
                <Link
                  href={`/fragrances?notes=${selectedNotes.join(",")}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity"
                >
                  Show Results
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setSelectedNotes([])}
                  className="block mx-auto text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16 lg:py-20 px-6 lg:px-12 bg-[var(--surface)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-medium">New Arrivals</h2>
                <p className="text-[var(--muted-foreground)] mt-1">Fresh additions to our collection</p>
              </div>
              <Link
                href="/fragrances?sort=newest"
                className="flex items-center gap-1 text-sm font-medium hover:underline"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {newArrivals.map((product, index) => (
                <EnhancedProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-16 lg:py-20 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-3xl font-medium mb-1">4.8 out of 5</p>
              <p className="text-[var(--muted-foreground)]">Based on 12,400+ reviews</p>
            </div>

            {/* Testimonial */}
            <div className="bg-[var(--surface)] p-8 lg:p-10 text-center relative">
              <div className="min-h-[120px] flex items-center justify-center">
                <div key={currentTestimonial}>
                  <p className="text-xl lg:text-2xl font-light leading-relaxed mb-6 max-w-2xl mx-auto">
                    "{TESTIMONIALS[currentTestimonial].text}"
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">{TESTIMONIALS[currentTestimonial].author}</span>
                    <span className="text-[var(--muted-foreground)]"> — {TESTIMONIALS[currentTestimonial].location}</span>
                  </p>
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTestimonial
                        ? "bg-[var(--foreground)]"
                        : "bg-[var(--border)]"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-6">
              <Link href="/reviews" className="text-sm font-medium hover:underline">
                Read All Reviews
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 lg:py-20 px-6 lg:px-12 bg-[#0a0a0a] text-white">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-medium mb-3">
              Get 10% Off Your First Order
            </h2>
            <p className="text-white/60 mb-8">
              Plus early access to new arrivals and exclusive offers.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black font-medium hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            <p className="text-xs text-white/40 mt-4">
              Unsubscribe anytime. No spam.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
