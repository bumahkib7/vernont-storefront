import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Our Story | Vernont",
  description: "Discover the heritage and craftsmanship behind Vernont luxury eyewear.",
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
              src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=1920&q=80"
              alt="Vernont Heritage"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 text-center text-white w-full">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-4 opacity-80">
              Our Heritage
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              The Vernont Story
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              A legacy of excellence, crafted with passion since the beginning
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
                  A Passion for Perfection
                </h2>
                <div className="space-y-4 text-[#666] leading-relaxed">
                  <p>
                    Vernont was born from a deep appreciation for the art of eyewear curation and
                    a desire to create frames that transcend the ordinary. Our founder
                    believed that a truly exceptional frame has the power to evoke confidence,
                    capture personality, and define style.
                  </p>
                  <p>
                    What began as a small optical studio has grown into a house renowned for its
                    commitment to quality, innovation, and the finest materials sourced
                    from around the world.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"
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
                <h3 className="text-xl font-bold tracking-tight mb-4">Craftsmanship</h3>
                <p className="text-[#666] leading-relaxed">
                  Every frame is meticulously crafted by our master artisans,
                  combining traditional techniques with innovative approaches to create
                  eyewear of exceptional quality.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">◆</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-4">Quality</h3>
                <p className="text-[#666] leading-relaxed">
                  We source only the finest materials from ethical suppliers around
                  the world, ensuring each frame meets our exacting standards of
                  excellence.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">✤</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-4">Sustainability</h3>
                <p className="text-[#666] leading-relaxed">
                  We are committed to responsible practices, from sustainable sourcing
                  to eco-friendly packaging, ensuring our luxury leaves a positive
                  impact on the world.
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
                  src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80"
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
                  The Art of Creation
                </h2>
                <div className="space-y-4 text-[#666] leading-relaxed">
                  <p>
                    Each Vernont frame begins with an inspiration—a silhouette, a material,
                    a vision. Our master artisans translate these inspirations into
                    optical masterpieces through a process that can take months or
                    even years to perfect.
                  </p>
                  <p>
                    We work with the finest materials: Italian acetate, Japanese titanium,
                    German hinges, and many more premium components that form the
                    foundation of our exceptional creations.
                  </p>
                  <p>
                    The result is a collection of eyewear that tells stories, evokes
                    confidence, and creates lasting impressions.
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
              The Artisans Behind Vernont
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
              Our team of passionate designers, craftspeople, and eyewear enthusiasts
              work together to bring you exceptional frames. United by a shared love
              for the art of eyewear curation, we are dedicated to creating designs that inspire
              and delight.
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
