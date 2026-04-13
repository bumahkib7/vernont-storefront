"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, Package, Heart, ArrowRight } from "@/components/icons";
import { PageLayout } from "@/components/layout/PageLayout";
import { ListingProductCard } from "@/components/ListingProductCard";
import { useProducts } from "@/lib/hooks";
import { transformProducts, getBestsellers } from "@/lib/transforms";

const giftServices = [
  {
    icon: Gift,
    title: "Complimentary Gift Wrap",
    description: "Every order arrives beautifully wrapped in our signature packaging",
  },
  {
    icon: Package,
    title: "Personalised Message",
    description: "Add a handwritten note to make your gift extra special",
  },
  {
    icon: Heart,
    title: "Gift Cards Available",
    description: "Let them choose their perfect frame with a Vernont gift card",
  },
];

const giftCategories = [
  { title: "Gift Cards", description: "Let them choose", href: "/eyewear", icon: Package },
  { title: "Cases & Pouches", description: "Premium protection", href: "/eyewear", icon: Heart },
  { title: "Chains & Cords", description: "Stylish accessories", href: "/eyewear", icon: Gift },
  { title: "Cleaning Kits", description: "Luxury lens care", href: "/eyewear", icon: Package },
];

export default function GiftsPage() {
  const { data: productsData, isLoading, error } = useProducts({ limit: 20 });

  const bestsellers = useMemo(() => {
    if (!productsData?.items) return [];
    const all = transformProducts(productsData.items);
    const best = getBestsellers(all);
    return best.length > 0 ? best.slice(0, 4) : all.slice(0, 4);
  }, [productsData]);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=1920&q=80"
          alt="Gifts"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center text-white px-4"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-3">The Art of Giving</p>
          <h1
            className="text-4xl md:text-6xl tracking-wide mb-4"
            style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
          >
            Gifts
          </h1>
          <p className="text-sm md:text-base text-white/70 max-w-lg mx-auto">
            Give the gift of luxury. Every Vernont frame comes beautifully presented.
          </p>
        </motion.div>
      </section>

      {/* Gift Services */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 md:py-20">
        <div className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl tracking-wide"
            style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
          >
            Our Gift Services
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {giftServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 border border-[#E5E5E5]"
            >
              <service.icon className="h-8 w-8 mx-auto mb-4 text-[#999]" />
              <h3 className="text-[14px] font-medium tracking-wide mb-2 text-[#1A1A1A]">
                {service.title}
              </h3>
              <p className="text-[13px] text-[#666]">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gift Categories */}
      <section className="bg-[#FAFAFA] py-14 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2
              className="text-2xl md:text-3xl tracking-wide"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
            >
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {giftCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={cat.href}
                  className="group block p-6 lg:p-8 border border-[#E5E5E5] bg-white hover:border-[#1A1A1A] transition-colors text-center"
                >
                  <cat.icon className="h-10 w-10 mx-auto mb-3 text-[#CCC] group-hover:text-[#1A1A1A] transition-colors" />
                  <h3 className="text-[13px] font-medium tracking-wide mb-1 text-[#1A1A1A]">
                    {cat.title}
                  </h3>
                  <p className="text-[12px] text-[#999]">{cat.description}</p>
                  <div className="flex items-center justify-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#1A1A1A]">Explore</span>
                    <ArrowRight className="h-3 w-3 text-[#1A1A1A]" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Gift Choices */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 md:py-20">
        <div className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl tracking-wide"
            style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
          >
            Popular Gift Choices
          </h2>
          <p className="text-[13px] text-[#666] mt-2">Bestselling eyewear</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-[#E5E5E5] p-2 lg:p-4 bg-white">
                <div className="w-full aspect-[4/3] bg-[#FAFAFA] mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="flex flex-col items-center gap-2 px-1 mb-2">
                  <div className="h-3 w-3/4 bg-[#F0F0F0] rounded-sm animate-pulse" />
                  <div className="h-3 w-1/3 bg-[#F0F0F0] rounded-sm animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-[#666] text-sm">Unable to load products.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {bestsellers.map((product, index) => (
                <ListingProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/eyewear"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#1A1A1A] text-white text-[12px] font-medium uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
              >
                View All Eyewear
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </section>
    </PageLayout>
  );
}
