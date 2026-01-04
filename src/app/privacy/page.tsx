import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Privacy Policy | Vernont",
  description: "Learn how Vernont collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-8">
          Privacy Policy
        </h1>
        <p className="font-serif text-muted-foreground mb-8">
          Last updated: January 2024
        </p>

        <div className="prose prose-lg max-w-none font-serif space-y-8">
          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Name, email address, and contact information</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely through our payment providers)</li>
              <li>Order history and preferences</li>
              <li>Communications you send to us</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our products and services</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">3. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share your information with:
              service providers who assist in our operations, payment processors, shipping carriers,
              and as required by law. All third parties are bound by confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your personal information,
              including encryption, secure servers, and regular security audits. However, no method
              of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">5. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance your browsing experience,
              analyze site traffic, and personalize content. You can manage your cookie preferences
              through our Cookie Settings page or your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes
              outlined in this policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">8. International Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not directed to individuals under 16. We do not knowingly collect
              personal information from children. If you believe we have collected such information,
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For privacy-related inquiries, please contact our Data Protection Officer at
              privacy@vernont.com or write to us at our registered address.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
