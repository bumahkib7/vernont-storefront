import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Size Guide | Vernont",
  description: "Find the perfect fragrance size for your needs. Guide to perfume concentrations and bottle sizes.",
};

export default function SizeGuidePage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            Size Guide
          </h1>
          <p className="font-serif text-muted-foreground">
            Find the perfect size and concentration for your fragrance needs.
          </p>
        </div>

        {/* Bottle Sizes */}
        <section className="mb-16">
          <h2 className="font-display text-2xl tracking-wide mb-6 pb-2 border-b border-border">
            Bottle Sizes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full font-serif text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-display font-normal">Size</th>
                  <th className="text-left py-3 font-display font-normal">Best For</th>
                  <th className="text-left py-3 font-display font-normal">Approx. Sprays</th>
                  <th className="text-left py-3 font-display font-normal">Duration</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="py-4">10ml / 0.34 fl oz</td>
                  <td className="py-4">Travel, Discovery</td>
                  <td className="py-4">~100 sprays</td>
                  <td className="py-4">~1 month</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-4">30ml / 1 fl oz</td>
                  <td className="py-4">Trial, Travel</td>
                  <td className="py-4">~300 sprays</td>
                  <td className="py-4">~2-3 months</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-4">50ml / 1.7 fl oz</td>
                  <td className="py-4">Everyday Use</td>
                  <td className="py-4">~500 sprays</td>
                  <td className="py-4">~4-6 months</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-4">100ml / 3.4 fl oz</td>
                  <td className="py-4">Signature Scent, Best Value</td>
                  <td className="py-4">~1000 sprays</td>
                  <td className="py-4">~8-12 months</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-serif text-xs text-muted-foreground mt-4">
            * Based on daily use of 3-5 sprays. Actual duration may vary based on usage.
          </p>
        </section>

        {/* Concentrations */}
        <section className="mb-16">
          <h2 className="font-display text-2xl tracking-wide mb-6 pb-2 border-b border-border">
            Fragrance Concentrations
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-secondary">
              <h3 className="font-display text-lg mb-2">Parfum (Extrait)</h3>
              <p className="font-serif text-muted-foreground text-sm mb-2">
                Concentration: 20-30% | Longevity: 8-12+ hours
              </p>
              <p className="font-serif text-muted-foreground text-sm">
                The most concentrated and long-lasting form of fragrance. Rich, luxurious, and perfect
                for special occasions. A little goes a long way.
              </p>
            </div>

            <div className="p-6 bg-secondary">
              <h3 className="font-display text-lg mb-2">Eau de Parfum (EDP)</h3>
              <p className="font-serif text-muted-foreground text-sm mb-2">
                Concentration: 15-20% | Longevity: 6-8 hours
              </p>
              <p className="font-serif text-muted-foreground text-sm">
                Our most popular concentration. Offers excellent longevity and projection while
                remaining versatile for day or night wear.
              </p>
            </div>

            <div className="p-6 bg-secondary">
              <h3 className="font-display text-lg mb-2">Eau de Toilette (EDT)</h3>
              <p className="font-serif text-muted-foreground text-sm mb-2">
                Concentration: 5-15% | Longevity: 4-6 hours
              </p>
              <p className="font-serif text-muted-foreground text-sm">
                Lighter and fresher than EDP. Ideal for everyday wear and warmer weather.
                Perfect for those who prefer a more subtle scent.
              </p>
            </div>

            <div className="p-6 bg-secondary">
              <h3 className="font-display text-lg mb-2">Eau de Cologne (EDC)</h3>
              <p className="font-serif text-muted-foreground text-sm mb-2">
                Concentration: 2-5% | Longevity: 2-4 hours
              </p>
              <p className="font-serif text-muted-foreground text-sm">
                The lightest concentration. Refreshing and invigorating, perfect for a quick
                pick-me-up or for layering with other fragrances.
              </p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="p-8 bg-primary text-primary-foreground">
          <h2 className="font-display text-xl tracking-wide mb-4">Application Tips</h2>
          <ul className="font-serif text-sm space-y-2 text-primary-foreground/80">
            <li>• Apply to pulse points: wrists, neck, behind ears, and inner elbows</li>
            <li>• Don&apos;t rub fragrance after applying - let it settle naturally</li>
            <li>• Apply to moisturized skin for better longevity</li>
            <li>• Store your fragrance away from direct sunlight and heat</li>
            <li>• For longer wear, spray on clothing (test on hidden area first)</li>
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
