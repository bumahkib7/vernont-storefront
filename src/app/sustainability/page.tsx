import Image from "next/image";
import { Leaf, Recycle, Heart, Globe } from "@phosphor-icons/react/ssr";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Sustainability | Vernont",
  description: "Our commitment to sustainable and ethical practices in luxury eyewear.",
};

export default function SustainabilityPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1920&q=80"
            alt="Sustainability"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative max-w-[1500px] mx-auto px-4 text-center text-white">
          <p className="tracking-wider uppercase text-sm mb-4" style={{ color: "#999" }}>
            Our Commitment
          </p>
          <h1
            className="text-4xl md:text-6xl tracking-wide mb-4"
            style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
          >
            Sustainability
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Luxury that respects our planet. Our commitment to sustainable practices.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <Leaf className="h-12 w-12 mx-auto mb-4" style={{ color: "#999" }} />
              <h3
                className="text-lg tracking-wide mb-3"
                style={{ color: "#1A1A1A", fontFamily: "'Crimson Pro', 'Georgia', serif" }}
              >
                Ethical Sourcing
              </h3>
              <p className="text-sm" style={{ color: "#666" }}>
                We source materials from certified sustainable producers and ethical suppliers worldwide.
              </p>
            </div>
            <div className="text-center p-6">
              <Recycle className="h-12 w-12 mx-auto mb-4" style={{ color: "#999" }} />
              <h3
                className="text-lg tracking-wide mb-3"
                style={{ color: "#1A1A1A", fontFamily: "'Crimson Pro', 'Georgia', serif" }}
              >
                Eco Packaging
              </h3>
              <p className="text-sm" style={{ color: "#666" }}>
                Our packaging is made from recycled and recyclable materials with minimal plastic.
              </p>
            </div>
            <div className="text-center p-6">
              <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: "#999" }} />
              <h3
                className="text-lg tracking-wide mb-3"
                style={{ color: "#1A1A1A", fontFamily: "'Crimson Pro', 'Georgia', serif" }}
              >
                Cruelty-Free
              </h3>
              <p className="text-sm" style={{ color: "#666" }}>
                We never test on animals and are certified cruelty-free by Leaping Bunny.
              </p>
            </div>
            <div className="text-center p-6">
              <Globe className="h-12 w-12 mx-auto mb-4" style={{ color: "#999" }} />
              <h3
                className="text-lg tracking-wide mb-3"
                style={{ color: "#1A1A1A", fontFamily: "'Crimson Pro', 'Georgia', serif" }}
              >
                Carbon Neutral
              </h3>
              <p className="text-sm" style={{ color: "#666" }}>
                We offset our carbon footprint through verified environmental projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-20" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl tracking-wide mb-4"
                style={{ color: "#1A1A1A", fontFamily: "'Crimson Pro', 'Georgia', serif" }}
              >
                Our 2025 Goals
              </h2>
              <p style={{ color: "#666" }}>
                We&apos;ve set ambitious targets to reduce our environmental impact.
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 flex items-center justify-center text-xl"
                  style={{ backgroundColor: "#F5F5F5", color: "#1A1A1A", border: "1px solid #E5E5E5" }}
                >
                  100%
                </div>
                <div>
                  <h3
                    className="text-lg mb-2"
                    style={{ color: "#1A1A1A", fontFamily: "'Crimson Pro', 'Georgia', serif" }}
                  >
                    Sustainable Packaging
                  </h3>
                  <p style={{ color: "#666" }}>
                    All packaging will be recycled, recyclable, or biodegradable by 2025.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 flex items-center justify-center text-xl"
                  style={{ backgroundColor: "#F5F5F5", color: "#1A1A1A", border: "1px solid #E5E5E5" }}
                >
                  50%
                </div>
                <div>
                  <h3
                    className="text-lg mb-2"
                    style={{ color: "#1A1A1A", fontFamily: "'Crimson Pro', 'Georgia', serif" }}
                  >
                    Reduced Carbon Emissions
                  </h3>
                  <p style={{ color: "#666" }}>
                    Cut our operational carbon emissions by half through efficiency improvements.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 flex items-center justify-center text-xl"
                  style={{ backgroundColor: "#F5F5F5", color: "#1A1A1A", border: "1px solid #E5E5E5" }}
                >
                  0%
                </div>
                <div>
                  <h3
                    className="text-lg mb-2"
                    style={{ color: "#1A1A1A", fontFamily: "'Crimson Pro', 'Georgia', serif" }}
                  >
                    Zero Waste to Landfill
                  </h3>
                  <p style={{ color: "#666" }}>
                    Eliminate all waste sent to landfill from our production facilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-20">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80"
                alt="Sustainable materials"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="tracking-wider uppercase text-sm mb-3" style={{ color: "#999" }}>
                Responsible Sourcing
              </p>
              <h2
                className="text-3xl tracking-wide mb-6"
                style={{ color: "#1A1A1A", fontFamily: "'Crimson Pro', 'Georgia', serif" }}
              >
                Our Materials
              </h2>
              <div className="space-y-4 leading-relaxed" style={{ color: "#666" }}>
                <p>
                  Every material we use is carefully selected not only for its quality
                  but also for its environmental and social impact. We work directly with
                  manufacturers and suppliers who share our values.
                </p>
                <p>
                  From plant-based bio-acetate to responsibly sourced titanium and recycled
                  packaging, we ensure that our luxury doesn&apos;t come at the cost of
                  our planet or the communities that produce these premium materials.
                </p>
                <p>
                  We are committed to the principles of ethical sourcing in everything we do,
                  using recycled metals and bio-based plastics wherever possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
