import Image from "next/image";
import { Download, Mail } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Press | Vernont",
  description: "Press resources, media kit, and contact information for Vernont luxury perfumes.",
};

const pressReleases = [
  {
    date: "January 2024",
    title: "Vernont Launches New Signature Collection",
    excerpt: "The luxury fragrance house unveils its most ambitious collection to date...",
  },
  {
    date: "December 2023",
    title: "Vernont Opens Flagship Store in Paris",
    excerpt: "The brand expands its retail presence with a stunning new boutique...",
  },
  {
    date: "November 2023",
    title: "Sustainability Initiative Announcement",
    excerpt: "Vernont commits to 100% sustainable packaging by 2025...",
  },
];

const pressFeatures = [
  { publication: "Vogue", quote: "The epitome of modern luxury fragrance." },
  { publication: "Harper's Bazaar", quote: "Vernont redefines what it means to smell exceptional." },
  { publication: "Elle", quote: "A new era in fine perfumery has arrived." },
  { publication: "GQ", quote: "The fragrance brand every connoisseur should know." },
];

export default function PressPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Media Center
          </p>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            Press
          </h1>
          <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
            Media resources, press releases, and contact information for journalists and media professionals.
          </p>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-2xl tracking-wide mb-6">Press Contact</h2>
              <p className="font-serif text-muted-foreground mb-6">
                For press inquiries, interview requests, and media information, please contact our press office.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gold" />
                  <span className="font-serif">press@vernont.com</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl tracking-wide mb-6">Media Kit</h2>
              <p className="font-serif text-muted-foreground mb-6">
                Download our media kit including logos, product images, and brand guidelines.
              </p>
              <Button className="btn-outline-luxury">
                <Download className="h-4 w-4 mr-2" />
                Download Media Kit
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Press Features */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl tracking-wide text-center mb-12">
            As Seen In
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {pressFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <p className="font-display text-xl tracking-wider mb-2">{feature.publication}</p>
                <p className="font-serif text-sm text-primary-foreground/70 italic">
                  &ldquo;{feature.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl tracking-wide mb-8">Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="p-6 border border-border hover:border-gold transition-colors">
                <p className="font-serif text-sm text-gold mb-2">{release.date}</p>
                <h3 className="font-display text-lg tracking-wide mb-2">{release.title}</h3>
                <p className="font-serif text-muted-foreground">{release.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
