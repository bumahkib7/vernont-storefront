import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { guides, verticalConfig } from "@/config/vertical";

const LENS_TYPES = guides.lensTypes;

export default function LensGuidePage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            Lens Guide
          </h1>
          <p className="font-serif text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Understanding lens types helps you choose the right eyewear for your lifestyle.
            Here is everything you need to know about modern lens technology.
          </p>
        </div>

        {/* Lens Types */}
        <div className="space-y-8 mb-16">
          {LENS_TYPES.map((lens) => (
            <div
              key={lens.name}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                  <lens.icon className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <div>
                  <h2 className="font-display text-xl tracking-wide mb-2">{lens.name}</h2>
                  <p className="font-serif text-muted-foreground leading-relaxed">
                    {lens.description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-display text-sm tracking-wider uppercase text-muted-foreground mb-2">
                    Best For
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lens.bestFor.map((use) => (
                      <span
                        key={use}
                        className="px-3 py-1 bg-[var(--background)] border border-[var(--border)] rounded-full text-sm"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-sm tracking-wider uppercase text-muted-foreground mb-2">
                    How It Works
                  </h3>
                  <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                    {lens.howItWorks}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-12">
          <h2 className="font-display text-2xl tracking-wide mb-4">
            Ready to Find Your Perfect Pair?
          </h2>
          <p className="font-serif text-muted-foreground mb-8 max-w-md mx-auto">
            Browse our collection of designer frames with premium lens options.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={verticalConfig.catalogPath}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity rounded-md"
            >
              Shop {verticalConfig.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/face-shape-guide"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border)] font-medium hover:border-[var(--foreground)] transition-colors rounded-md"
            >
              Face Shape Guide
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
