"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Award, Star } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { useProducts } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";
import { useHeroScroll } from "@/lib/useHeroScroll";
import type { DisplayProduct } from "@/lib/transforms";

type GradeFilter = "all" | "A" | "B" | "C";

const GRADE_INFO: Record<Exclude<GradeFilter, "all">, { label: string; description: string }> = {
  A: {
    label: "Grade A",
    description: "Like new condition. Minimal signs of wear. Pristine lenses and frame.",
  },
  B: {
    label: "Grade B",
    description: "Good condition. Minor cosmetic marks that don't affect functionality.",
  },
  C: {
    label: "Grade C",
    description: "Fair condition. Visible wear signs. Fully functional with character.",
  },
};

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="animate-pulse"
        >
          <div className="aspect-[3/4] bg-secondary relative">
            <div className="absolute inset-3 border border-[var(--secondary)]/10" />
          </div>
          <div className="pt-5 text-center space-y-2">
            <div className="h-3 w-16 bg-secondary mx-auto" />
            <div className="h-5 w-32 bg-secondary mx-auto" />
            <div className="h-3 w-24 bg-secondary mx-auto" />
            <div className="h-5 w-20 bg-secondary mx-auto" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function PreOwnedPage() {
  const { heroRef, heroY, heroOpacity, heroScale } = useHeroScroll();
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");

  const { data: productsData, isLoading, error } = useProducts({ limit: 100, condition: 'pre_owned' });

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
      {/* Hero */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=1920&q=80"
            alt="Pre-Owned Luxury Eyewear"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/50" />
        </motion.div>

        <div className="absolute inset-6 md:inset-8 border border-[var(--secondary)]/20 pointer-events-none" />

        <motion.div style={{ opacity: heroOpacity }} className="relative max-w-[1500px] mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-[var(--secondary)]" />
            <Shield className="h-5 w-5 text-[var(--secondary)]" />
            <span className="text-[var(--secondary)] tracking-wider uppercase text-xs">
              Authenticated & Inspected
            </span>
            <Shield className="h-5 w-5 text-[var(--secondary)]" />
            <span className="h-px w-12 bg-[var(--secondary)]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6"
          >
            Pre-Owned
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Authenticated luxury eyewear at exceptional value.
            Every piece inspected, graded, and guaranteed.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--secondary)]" />
            <Award className="h-5 w-5 text-[var(--secondary)]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--secondary)]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-[var(--secondary)] to-transparent"
          />
        </motion.div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 border-b border-[var(--border)]">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, title: "Expert Authenticated", desc: "Every piece verified by our specialists" },
              { icon: CheckCircle, title: "Quality Inspected", desc: "Thorough inspection and professional cleaning" },
              { icon: Award, title: "30-Day Guarantee", desc: "Full satisfaction guarantee on every purchase" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <Icon className="h-8 w-8 text-[var(--secondary)]" strokeWidth={1.5} />
                <h3 className="text-sm tracking-wider uppercase font-medium">{title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1500px] mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--secondary)]/50" />
              <div className="w-2 h-2 rotate-45 bg-[var(--secondary)]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--secondary)]/50" />
            </div>
            <h2 className="text-3xl md:text-4xl tracking-wide">
              Pre-Owned Collection
            </h2>
            <p className="text-muted-foreground mt-3">
              {isLoading ? "Loading..." : `${filteredProducts.length} pieces available`}
            </p>
          </motion.div>

          {/* Grade Filter Buttons */}
          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            {(["all", "A", "B", "C"] as GradeFilter[]).map((grade) => (
              <button
                key={grade}
                onClick={() => setGradeFilter(grade)}
                className={`px-5 py-2 text-xs tracking-wider uppercase border transition-all ${
                  gradeFilter === grade
                    ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                    : "bg-transparent text-[var(--foreground)] border-[var(--border)] hover:border-[var(--foreground)]"
                }`}
              >
                {grade === "all" ? "All Grades" : `Grade ${grade}`}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <ProductsSkeleton />
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-muted-foreground">Unable to load products. Please try again later.</p>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-[var(--secondary)]/30 rotate-45" />
              <h3 className="text-2xl tracking-wide mb-3">Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                {gradeFilter === "all"
                  ? "Pre-owned pieces are being curated. Check back soon."
                  : `No Grade ${gradeFilter} pieces available right now.`}
              </p>
              <Link href="/eyewear" className="btn-primary inline-block">
                Browse All Eyewear
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                >
                  <EnhancedProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Grade Guide */}
      <section className="py-16 bg-secondary">
        <div className="max-w-[1500px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl tracking-wide mb-3">Our Grading System</h2>
            <p className="text-muted-foreground">
              Every piece is carefully assessed and assigned a condition grade
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {(Object.entries(GRADE_INFO) as [string, { label: string; description: string }][]).map(
              ([grade, info], i) => (
                <motion.div
                  key={grade}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border border-[var(--border)] p-8 text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 border border-[var(--foreground)] mb-4">
                    <span className="text-lg font-medium">{grade}</span>
                  </div>
                  <h3 className="text-sm tracking-wider uppercase font-medium mb-3">{info.label}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{info.description}</p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-[var(--secondary)]" />
              <span className="text-[var(--secondary)] tracking-wider uppercase text-xs">
                Luxury for Less
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl tracking-wide mb-4">
              Sustainable Luxury
            </h2>
            <p className="text-muted-foreground mb-8">
              Give exceptional eyewear a second life. Same craftsmanship, remarkable value.
            </p>
            <Link href="/eyewear" className="btn-primary inline-block">
              View All Eyewear
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
