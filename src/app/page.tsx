"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";

export default function Home() {
  const { data: productsData } = useProducts({ limit: 12 });
  const displayProducts = productsData?.items ? transformProducts(productsData.items) : [];
  // Show first 4 products as featured
  const featuredProducts = displayProducts.slice(0, 4);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative h-[85vh] min-h-[600px]">
          <Image
            src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-6 lg:px-12 pb-16 lg:pb-24">
              <h1 className="text-white text-5xl sm:text-6xl lg:text-8xl max-w-4xl mb-8">
                Fragrance, distilled to its essence
              </h1>
              <Link
                href="/fragrances"
                className="inline-block text-white text-sm tracking-widest uppercase border-b border-white pb-1 hover:opacity-70 transition-opacity"
              >
                Discover
              </Link>
            </div>
          </div>
        </section>

        {/* Intro Text */}
        <section className="py-24 lg:py-40 px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-2xl sm:text-3xl lg:text-4xl leading-relaxed">
              We create fragrances for those who appreciate restraint.
              Each composition is an exercise in balance—nothing excessive,
              nothing superfluous.
            </p>
          </div>
        </section>

        {/* Featured Products */}
        <section className="px-6 lg:px-12 pb-24 lg:pb-40">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-sm tracking-widest uppercase text-muted-foreground">
              Featured
            </h2>
            <Link
              href="/fragrances"
              className="text-sm tracking-wide hover:opacity-50 transition-opacity"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-secondary animate-pulse" />
              ))
            )}
          </div>
        </section>

        {/* Split Section */}
        <section className="grid lg:grid-cols-2 min-h-[80vh]">
          <div className="relative aspect-square lg:aspect-auto">
            <Image
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-center px-6 lg:px-16 py-16 lg:py-24 bg-secondary">
            <div className="max-w-md">
              <p className="text-sm tracking-widest uppercase text-muted-foreground mb-6">
                Our approach
              </p>
              <h2 className="text-3xl lg:text-4xl mb-8">
                Less, but better
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We work with exceptional raw materials, sourced responsibly
                from around the world. Our perfumers share our belief that
                true luxury lies in simplicity.
              </p>
              <Link
                href="/about"
                className="text-sm tracking-widest uppercase border-b border-foreground pb-1 hover:opacity-50 transition-opacity"
              >
                Learn more
              </Link>
            </div>
          </div>
        </section>

        {/* Collections */}
        <section className="py-24 lg:py-40 px-6 lg:px-12">
          <h2 className="text-sm tracking-widest uppercase text-muted-foreground mb-12">
            Collections
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { name: "Signature", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80", href: "/collections/signature" },
              { name: "Nordic", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80", href: "/collections/nordic" },
              { name: "Evening", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80", href: "/collections/evening" },
            ].map((col) => (
              <Link key={col.name} href={col.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden mb-4">
                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <span className="text-sm tracking-wide">{col.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-foreground text-background">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl mb-6">
              Stay informed
            </h2>
            <p className="text-background/60 mb-10">
              New releases and exclusive offers, delivered to your inbox.
            </p>
            <form className="flex border-b border-background/30">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent py-4 text-background placeholder:text-background/40 outline-none"
              />
              <button
                type="submit"
                className="px-4 text-sm tracking-widest uppercase hover:opacity-70 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
