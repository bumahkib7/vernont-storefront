import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Leaf, Gift } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Sample product data with beautiful perfume images from Unsplash
const featuredProducts = [
  {
    id: "1",
    name: "Midnight Rose",
    brand: "Vernont",
    price: 245,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    category: "Eau de Parfum",
    isNew: true,
  },
  {
    id: "2",
    name: "Golden Amber",
    brand: "Vernont",
    price: 320,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
    category: "Parfum",
    isBestseller: true,
  },
  {
    id: "3",
    name: "Velvet Oud",
    brand: "Vernont",
    price: 395,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
    category: "Eau de Parfum",
  },
  {
    id: "4",
    name: "Jasmine Dreams",
    brand: "Vernont",
    price: 275,
    originalPrice: 340,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80",
    category: "Eau de Toilette",
  },
];

const newArrivals = [
  {
    id: "5",
    name: "Crystal Iris",
    brand: "Vernont",
    price: 285,
    image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=800&q=80",
    category: "Eau de Parfum",
    isNew: true,
  },
  {
    id: "6",
    name: "Noir Essence",
    brand: "Vernont",
    price: 355,
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80",
    category: "Parfum",
    isNew: true,
  },
  {
    id: "7",
    name: "Silk Magnolia",
    brand: "Vernont",
    price: 265,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80",
    category: "Eau de Parfum",
    isNew: true,
  },
  {
    id: "8",
    name: "Royal Sandalwood",
    brand: "Vernont",
    price: 425,
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80",
    category: "Parfum Intense",
    isNew: true,
  },
];

const collections = [
  {
    name: "For Her",
    description: "Timeless femininity",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80",
    href: "/for-her",
  },
  {
    name: "For Him",
    description: "Bold sophistication",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80",
    href: "/for-him",
  },
  {
    name: "Unisex",
    description: "Beyond boundaries",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
    href: "/unisex",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80"
              alt="Luxury perfume bottles"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>

          <div className="relative container mx-auto px-4">
            <div className="max-w-2xl">
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4 animate-fade-in">
                New Collection 2024
              </p>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white tracking-wide mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                The Art of
                <br />
                <span className="text-gold">Fragrance</span>
              </h1>
              <p className="font-serif text-lg text-white/80 mb-8 max-w-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Discover our latest collection of exquisite perfumes,
                crafted with the finest ingredients from around the world.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Link href="/collections">
                  <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="btn-outline-luxury border-white text-white hover:bg-white hover:text-primary">
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Strip */}
        <section className="bg-secondary py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center gap-4 text-center md:text-left">
                <Sparkles className="h-8 w-8 text-gold" />
                <div>
                  <h4 className="font-display text-sm tracking-wider uppercase">Luxury Crafted</h4>
                  <p className="font-serif text-sm text-muted-foreground">Hand-blended perfumes</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 text-center md:text-left">
                <Leaf className="h-8 w-8 text-gold" />
                <div>
                  <h4 className="font-display text-sm tracking-wider uppercase">Sustainably Sourced</h4>
                  <p className="font-serif text-sm text-muted-foreground">Ethical ingredients</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 text-center md:text-left">
                <Gift className="h-8 w-8 text-gold" />
                <div>
                  <h4 className="font-display text-sm tracking-wider uppercase">Gift Wrapping</h4>
                  <p className="font-serif text-sm text-muted-foreground">Complimentary service</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                Curated Selection
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
                Bestselling Fragrances
              </h2>
              <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
                Our most beloved scents, chosen by connoisseurs and cherished by those who appreciate
                the finer things in life.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/fragrances">
                <Button variant="outline" className="btn-outline-luxury">
                  View All Fragrances
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                Shop By
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide">
                Collections
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Link
                  key={collection.name}
                  href={collection.href}
                  className="group relative aspect-[4/5] overflow-hidden"
                >
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h3 className="font-display text-2xl md:text-3xl tracking-wide mb-2">
                      {collection.name}
                    </h3>
                    <p className="font-serif text-white/80">{collection.description}</p>
                    <span className="mt-4 font-display text-xs tracking-widest uppercase border-b border-gold pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Discover
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-square lg:aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=800&q=80"
                  alt="Perfume craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:pl-12">
                <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                  Our Heritage
                </p>
                <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-6">
                  A Legacy of Excellence
                </h2>
                <div className="space-y-4 font-serif text-muted-foreground leading-relaxed">
                  <p>
                    At Vernont, we believe that fragrance is more than a scent—it&apos;s an
                    experience, a memory, a statement. Our master perfumers combine centuries-old
                    techniques with innovative approaches to create fragrances that captivate the senses.
                  </p>
                  <p>
                    Each bottle represents countless hours of meticulous craftsmanship,
                    from sourcing the rarest ingredients to achieving the perfect balance
                    of notes that define our signature style.
                  </p>
                </div>
                <Link href="/about" className="inline-block mt-8">
                  <Button variant="outline" className="btn-outline-luxury">
                    Discover Our Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Separator className="max-w-4xl mx-auto" />

        {/* New Arrivals */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                Just Arrived
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
                New Arrivals
              </h2>
              <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
                Be the first to experience our latest creations, each one a testament to
                our unwavering commitment to excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* Full-width CTA */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=1920&q=80"
              alt="Luxury perfume experience"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
              Limited Edition
            </p>
            <h2 className="font-display text-3xl md:text-5xl tracking-wide text-white mb-6">
              The Signature Collection
            </h2>
            <p className="font-serif text-white/80 max-w-2xl mx-auto mb-8">
              An exclusive collection of rare and precious fragrances,
              available only at Vernont boutiques and online.
            </p>
            <Link href="/collections/signature">
              <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90">
                Explore Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
