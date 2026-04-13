import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Our Story | Vernont",
  description: "Discover pre-owned luxury eyewear, authenticated by qualified optometrists. Sustainable style, uncompromising quality.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <Header />

      <main className="w-full">
        {/* Hero */}
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center border-b border-[#E5E5E5]">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1574258495973-f7a4e88f1e96?w=1920&q=80"
              alt="Vernont Heritage"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 text-center text-white w-full">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-4 opacity-80">
              Pre-Owned Luxury Eyewear
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              The Vernont Story
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Authenticated luxury frames, given a second life — with care, expertise, and purpose
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="w-full py-20">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#999] mb-3">
                  The Beginning
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  A Passion for Pre-Owned Luxury
                </h2>
                <div className="space-y-4 text-[#666] leading-relaxed">
                  <p>
                    Vernont was born from a simple conviction: the world&apos;s finest eyewear
                    deserves more than one life. Premium frames from houses like Miu Miu,
                    Maui Jim, and Bottega Veneta are built to last — yet so many sit
                    unused in drawers after a single season. We set out to change that.
                  </p>
                  <p>
                    What began as a passion for exceptional eyewear has grown into a
                    curated marketplace for pre-owned luxury frames — each one authenticated,
                    inspected, and graded so you can buy with confidence.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80"
                  alt="Vernont craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="w-full py-20 bg-[#FAFAFA] border-y border-[#E5E5E5]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#999] mb-3">
                Our Philosophy
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                What We Stand For
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">✦</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-4">Authentication</h3>
                <p className="text-[#666] leading-relaxed">
                  Every frame is inspected and verified by a qualified optometrist.
                  We check for authenticity, structural integrity, lens quality, and
                  cosmetic condition before anything reaches our shelves.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">◆</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-4">Condition Grading</h3>
                <p className="text-[#666] leading-relaxed">
                  Each item is graded transparently: <strong>Excellent</strong> shows
                  minimal signs of wear, <strong>Very Good</strong> has light cosmetic
                  marks, and <strong>Good</strong> has visible wear that doesn&apos;t
                  affect performance. No surprises — just honesty.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">✤</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-4">Sustainability</h3>
                <p className="text-[#666] leading-relaxed">
                  Buying pre-owned luxury eyewear keeps beautifully made frames in
                  circulation and out of landfill. Every purchase is a choice for the
                  planet — premium style with a smaller footprint.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Craftsmanship */}
        <section className="w-full py-20">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/5] order-2 lg:order-1">
                <Image
                  src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80"
                  alt="Eyewear materials"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#999] mb-3">
                  The Process
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  How We Authenticate
                </h2>
                <div className="space-y-4 text-[#666] leading-relaxed">
                  <p>
                    Every frame that enters Vernont goes through a rigorous multi-point
                    inspection carried out by a qualified optometrist. We verify brand
                    authenticity, examine hinges and temple arms for structural soundness,
                    and assess lenses for clarity, coatings, and UV protection.
                  </p>
                  <p>
                    Items that pass are cleaned, polished, and assigned a condition grade —
                    Excellent, Very Good, or Good — so you know exactly what you&apos;re
                    getting. Frames that don&apos;t meet our standards are returned to the seller.
                  </p>
                  <p>
                    The result is a curated collection of pre-owned designer eyewear
                    you can trust — Italian acetate, Japanese titanium, and German
                    engineering, all at a fraction of the original price.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="w-full py-20 bg-[#1A1A1A] text-white">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-3">
              Our Team
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              The People Behind Vernont
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
              Our team of optical professionals and eyewear enthusiasts curate, inspect,
              and grade every frame by hand. United by a belief that luxury should be
              accessible and sustainable, we are dedicated to giving the world&apos;s
              finest eyewear the second life it deserves.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-16 border-t border-[#E5E5E5]">
          <div className="max-w-[800px] mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Explore Our Collection</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/eyewear"
                className="px-8 py-3.5 bg-[#1A1A1A] text-white text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-black transition-colors"
              >
                Shop All Eyewear
              </Link>
              <Link
                href="/brands"
                className="px-8 py-3.5 border border-[#E5E5E5] text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#FAFAFA] transition-colors"
              >
                View Brands
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
