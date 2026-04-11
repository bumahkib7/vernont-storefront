"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shield, CheckCircle, Medal } from "@/components/icons";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductCarousel } from "@/components/ProductCarousel";
import { ServicesGrid } from "@/components/ServicesGrid";
import { ListingProductCard } from "@/components/ListingProductCard";
import { useProducts } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";
import type { DisplayProduct } from "@/lib/transforms";

type GradeFilter = "all" | "A" | "B" | "C";

const GRADES: { key: GradeFilter; label: string; description: string }[] = [
  { key: "A", label: "Grade A", description: "Like new. Minimal wear. Pristine lenses and frame." },
  { key: "B", label: "Grade B", description: "Good condition. Minor cosmetic marks. Fully functional." },
  { key: "C", label: "Grade C", description: "Fair condition. Visible wear. Full character and function." },
];

export default function PreOwnedPage() {
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");
  const { data: productsData, isLoading, error } = useProducts({ limit: 100, condition: "pre_owned" });

  const preOwnedProducts = useMemo(() => {
    if (!productsData?.items) return [];
    return transformProducts(productsData.items);
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    if (gradeFilter === "all") return preOwnedProducts;
    return preOwnedProducts.filter((p) => p.conditionGrade === gradeFilter);
  }, [preOwnedProducts, gradeFilter]);

  return (
    <PageLayout>
      {/* Hero — Clean, shorter, strong CTA */}
      <section className="relative h-[55vh] min-h-[420px] max-h-[600px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=1920&q=80"
          alt="Pre-Owned Luxury Eyewear"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="relative max-w-[1500px] w-full mx-auto px-6 lg:px-20 pb-12 lg:pb-16">
          <p className="text-xs text-white/60 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5" />
            Authenticated &amp; Inspected
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight mb-3">
            Pre-Owned
          </h1>
          <p className="text-white/70 text-lg max-w-md mb-6">
            Authenticated luxury eyewear at exceptional value. Every piece inspected, graded, and guaranteed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#collection"
              className="inline-flex items-center px-8 py-3 bg-white text-black text-sm font-medium uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              Shop All
            </Link>
            <Link
              href="#grades"
              className="inline-flex items-center px-8 py-3 border border-white/50 text-white text-sm font-medium uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              Grading Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals — Clean horizontal row */}
      <section className="py-8 border-b border-[var(--border)]">
        <div className="px-6 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: Shield, title: "Expert Authenticated", desc: "Verified by our specialists" },
              { icon: CheckCircle, title: "Quality Inspected", desc: "Professional cleaning included" },
              { icon: Medal, title: "30-Day Guarantee", desc: "Full satisfaction guarantee" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection — Grade Funnel + Product Grid */}
      <section id="collection" className="py-16 lg:py-24">
        <div className="px-6 lg:px-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-medium tracking-tight">Pre-Owned Collection</h2>
              <p className="text-[var(--muted-foreground)] mt-1">
                {isLoading ? "Loading..." : `${filteredProducts.length} pieces available`}
              </p>
            </div>

            {/* Grade Funnel Pills */}
            <div className="flex gap-2">
              {(["all", "A", "B", "C"] as GradeFilter[]).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setGradeFilter(grade)}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-all ${
                    gradeFilter === grade
                      ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                      : "border-[var(--border)] hover:border-[var(--foreground)]"
                  }`}
                >
                  {grade === "all" ? "All" : `Grade ${grade}`}
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-[3/4] bg-[var(--surface)] animate-pulse" />
                  <div className="pt-4 space-y-2">
                    <div className="h-3 w-16 bg-[var(--surface)] animate-pulse" />
                    <div className="h-4 w-28 bg-[var(--surface)] animate-pulse" />
                    <div className="h-3 w-20 bg-[var(--surface)] animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-[var(--muted-foreground)]">Unable to load products. Please try again later.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-[var(--border)] flex items-center justify-center">
                <Shield className="h-6 w-6 text-[var(--muted-foreground)]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-light tracking-tight mb-2">Coming Soon</h3>
              <p className="text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto">
                {gradeFilter === "all"
                  ? "Pre-owned pieces are being curated. Check back soon."
                  : `No Grade ${gradeFilter} pieces available right now.`}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {gradeFilter !== "all" && (
                  <button
                    onClick={() => setGradeFilter("all")}
                    className="px-8 py-3 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium uppercase tracking-wider"
                  >
                    View All Grades
                  </button>
                )}
                <Link
                  href="/eyewear"
                  className="px-8 py-3 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  Browse All Eyewear
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredProducts.map((product, index) => (
                <ListingProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Grading System */}
      <section id="grades" className="py-16 lg:py-24 bg-[var(--surface)]">
        <div className="px-6 lg:px-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-medium tracking-tight mb-2">Our Grading System</h2>
            <p className="text-[var(--muted-foreground)]">
              Every piece is carefully assessed and assigned a condition grade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {GRADES.map((grade) => (
              <button
                key={grade.key}
                onClick={() => { setGradeFilter(grade.key); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}
                className="group border border-[var(--border)] p-8 text-center hover:border-[var(--foreground)] transition-colors bg-[var(--background)]"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-[var(--foreground)] mb-4 group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] transition-colors">
                  <span className="text-xl font-medium">{grade.key}</span>
                </div>
                <h3 className="text-sm font-medium uppercase tracking-wider mb-2">{grade.label}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{grade.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Editorial — Split layout */}
      <section className="py-16 lg:py-24">
        <div className="px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
            <div className="relative aspect-[4/3] lg:aspect-auto">
              <Image
                src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&q=80"
                alt="Sustainable luxury eyewear"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-16 bg-[#0a0a0a] text-white">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Sustainable Luxury</p>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight mb-4">
                Give Exceptional Eyewear a Second Life
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Every pre-owned piece we sell extends the lifecycle of premium craftsmanship.
                Same designer quality, remarkable value, and a more sustainable choice.
              </p>
              <Link
                href="/eyewear"
                className="inline-flex items-center px-8 py-3 bg-white text-black text-sm font-medium uppercase tracking-wider hover:bg-white/90 transition-colors w-fit"
              >
                View All Eyewear
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <ServicesGrid />
    </PageLayout>
  );
}
