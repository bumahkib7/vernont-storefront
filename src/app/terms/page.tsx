import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Terms of Service | Vernont",
  description: "Terms and conditions for using Vernont luxury perfumes website and services.",
};

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-8">
          Terms of Service
        </h1>
        <p className="font-serif text-muted-foreground mb-8">
          Last updated: January 2024
        </p>

        <div className="prose prose-lg max-w-none font-serif space-y-8">
          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the Vernont website and services, you accept and agree to be bound by
              these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">2. Use of Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to use our services only for lawful purposes and in accordance with these Terms.
              You are responsible for maintaining the confidentiality of your account information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">3. Products and Pricing</h2>
            <p className="text-muted-foreground leading-relaxed">
              All products are subject to availability. Prices are subject to change without notice.
              We reserve the right to limit quantities and to refuse or cancel any order.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">4. Orders and Payment</h2>
            <p className="text-muted-foreground leading-relaxed">
              By placing an order, you warrant that you are legally capable of entering into binding contracts.
              Payment must be received in full before products are dispatched. We accept major credit cards
              and other payment methods as indicated at checkout.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">5. Shipping and Delivery</h2>
            <p className="text-muted-foreground leading-relaxed">
              Delivery times are estimates and not guaranteed. Risk of loss and title pass to you upon
              delivery to the carrier. Please refer to our Shipping Policy for more details.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">6. Returns and Refunds</h2>
            <p className="text-muted-foreground leading-relaxed">
              We accept returns of unopened products within 30 days of purchase. Please refer to our
              Returns Policy for complete details on how to initiate a return.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the
              property of Vernont and is protected by intellectual property laws. You may not reproduce,
              distribute, or create derivative works without our express written consent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vernont shall not be liable for any indirect, incidental, special, or consequential damages
              arising from your use of our services or products.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">9. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws.
              Any disputes shall be resolved in the appropriate courts.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">10. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms of Service, please contact us at legal@vernont.com
              or through our Contact page.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
