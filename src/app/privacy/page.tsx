import { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Vernont",
  description:
    "How Vernont collects, uses, and protects your personal data. Includes your UK GDPR rights, cookie policy, data retention, and third-party processors.",
};

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="max-w-[800px] mx-auto px-4 py-16">
        <h1
          className="text-4xl md:text-5xl tracking-wide mb-4"
          style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
        >
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-12">Last updated: 10 April 2026</p>

        <div className="space-y-12 text-[15px] leading-relaxed">
          {/* 1. Who we are */}
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              1. Who we are
            </h2>
            <p className="text-muted-foreground mb-3">
              Vernont is a luxury eyewear retailer operated by Vernont Ltd, a company
              registered in the United Kingdom. We design, curate, and sell premium
              eyewear online at{" "}
              <Link href="/" className="underline hover:text-foreground">
                vernont.com
              </Link>
              .
            </p>
            <p className="text-muted-foreground">
              For any questions about this policy or how we handle your data, contact
              our Data Protection Officer at{" "}
              <a
                href="mailto:privacy@vernont.com"
                className="underline hover:text-foreground"
              >
                privacy@vernont.com
              </a>
              .
            </p>
          </section>

          {/* 2. What data we collect */}
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              2. What data we collect
            </h2>

            <h3 className="font-semibold mb-2 text-foreground">Account data</h3>
            <p className="text-muted-foreground mb-4">
              Name, email address, password (stored as a cryptographic hash), and
              optionally your phone number.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">Order data</h3>
            <p className="text-muted-foreground mb-4">
              Shipping and billing addresses, order history, order status, and
              delivery tracking references.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">Payment data</h3>
            <p className="text-muted-foreground mb-4">
              Payments are processed by Stripe. We never receive or store your full
              card number. Stripe provides us with a card brand, last four digits, and
              expiry date for your order records.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">Analytics data</h3>
            <p className="text-muted-foreground mb-4">
              Page views, clicks, navigation paths, and session duration collected via
              Google Analytics (GA4) and PostHog. This data is only collected with
              your consent.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">Marketing data</h3>
            <p className="text-muted-foreground mb-4">
              Email address, marketing preferences, and engagement metrics (opens,
              clicks) managed through Klaviyo. Marketing emails are only sent with
              your explicit consent.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">
              Product interaction data
            </h3>
            <p className="text-muted-foreground mb-4">
              Wishlist items, product reviews, search queries, and items added to
              your cart.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">
              Device and browser data
            </h3>
            <p className="text-muted-foreground mb-4">
              IP address, browser type, operating system, screen resolution, and
              referring URL. Collected via cookies &mdash; see section 6 below.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">
              AI-generated content
            </h3>
            <p className="text-muted-foreground">
              We use AI tools to generate product descriptions and analyse product
              images. This does not involve your personal data.
            </p>
          </section>

          {/* 3. How we use your data */}
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              3. How we use your data
            </h2>
            <p className="text-muted-foreground mb-4">
              We process your data under the following legal bases:
            </p>

            <h3 className="font-semibold mb-2 text-foreground">
              Contract performance
            </h3>
            <p className="text-muted-foreground mb-4">
              Processing your orders, managing your account, handling returns and
              exchanges, and communicating about your purchases.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">
              Legitimate interest
            </h3>
            <p className="text-muted-foreground mb-4">
              Website analytics and performance monitoring, fraud prevention and
              security, and improving our products and services.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">Consent</h3>
            <p className="text-muted-foreground mb-4">
              Marketing emails and newsletters, analytics cookies, and marketing
              cookies. You can withdraw consent at any time through your{" "}
              <Link href="/consent" className="underline hover:text-foreground">
                cookie preferences
              </Link>{" "}
              or by unsubscribing from emails.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">
              Legal obligation
            </h3>
            <p className="text-muted-foreground">
              Retaining tax and financial records as required by UK law, and
              reporting suspected fraud to relevant authorities.
            </p>
          </section>

          {/* 4. Who we share data with */}
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              4. Who we share data with
            </h2>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal data. We share data with the following
              third-party processors, each bound by data processing agreements:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-muted-foreground border border-[var(--border)] rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[var(--surface)] border-b border-[var(--border)]">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Processor
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Purpose
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Data shared
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="px-4 py-3 font-medium">Stripe</td>
                    <td className="px-4 py-3">Payment processing (PCI DSS compliant)</td>
                    <td className="px-4 py-3">Payment details, billing address, email</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Cloudflare</td>
                    <td className="px-4 py-3">CDN, DNS, DDoS protection</td>
                    <td className="px-4 py-3">IP address, request metadata</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Cloudflare R2</td>
                    <td className="px-4 py-3">Image and asset storage</td>
                    <td className="px-4 py-3">No personal data (product images only)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Runix</td>
                    <td className="px-4 py-3">Hosting infrastructure (EU servers, Hetzner)</td>
                    <td className="px-4 py-3">All application data (encrypted at rest)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Resend</td>
                    <td className="px-4 py-3">Transactional email delivery</td>
                    <td className="px-4 py-3">Email address, name, order details</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Google Analytics (GA4)</td>
                    <td className="px-4 py-3">Website analytics (consent-gated)</td>
                    <td className="px-4 py-3">Pseudonymised browsing data, device info</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">PostHog</td>
                    <td className="px-4 py-3">Product analytics (consent-gated, EU hosting)</td>
                    <td className="px-4 py-3">Pseudonymised usage data</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Klaviyo</td>
                    <td className="px-4 py-3">Email marketing (consent-gated)</td>
                    <td className="px-4 py-3">Email, name, purchase history</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Anthropic (Claude)</td>
                    <td className="px-4 py-3">AI content generation</td>
                    <td className="px-4 py-3">No personal data (product descriptions only)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Google (Gemini)</td>
                    <td className="px-4 py-3">AI image analysis</td>
                    <td className="px-4 py-3">No personal data (product images only)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Your rights */}
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              5. Your rights under UK GDPR
            </h2>
            <p className="text-muted-foreground mb-4">
              You have the following rights over your personal data:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-3">
              <li>
                <strong className="text-foreground">Right to access</strong> &mdash;
                Request a copy of your data. You can do this instantly by clicking
                &ldquo;Download My Data&rdquo; in your{" "}
                <Link
                  href="/account/profile"
                  className="underline hover:text-foreground"
                >
                  account settings
                </Link>
                , or by emailing us.
              </li>
              <li>
                <strong className="text-foreground">Right to rectification</strong>{" "}
                &mdash; Update inaccurate data in your{" "}
                <Link
                  href="/account/profile"
                  className="underline hover:text-foreground"
                >
                  profile
                </Link>{" "}
                or contact us.
              </li>
              <li>
                <strong className="text-foreground">Right to erasure</strong> &mdash;
                Delete your account from your profile settings. We will erase all
                personal data except where retention is legally required (e.g. tax
                records).
              </li>
              <li>
                <strong className="text-foreground">
                  Right to restrict processing
                </strong>{" "}
                &mdash; Contact us to request we limit how we use your data.
              </li>
              <li>
                <strong className="text-foreground">Right to data portability</strong>{" "}
                &mdash; Download your data as a machine-readable JSON file from your
                account settings.
              </li>
              <li>
                <strong className="text-foreground">Right to object</strong> &mdash;
                Unsubscribe from marketing emails at any time using the link in any
                email, or manage preferences in your account.
              </li>
              <li>
                <strong className="text-foreground">
                  Right to withdraw consent
                </strong>{" "}
                &mdash; Manage cookie consent at{" "}
                <Link
                  href="/consent"
                  className="underline hover:text-foreground"
                >
                  /consent
                </Link>
                . Withdrawal does not affect lawfulness of processing before
                withdrawal.
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We will respond to rights requests within one month. If you are
              unsatisfied with our response, you have the right to complain to the{" "}
              <a
                href="https://ico.org.uk/make-a-complaint/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Information Commissioner&apos;s Office (ICO)
              </a>
              .
            </p>
          </section>

          {/* 6. Cookie policy */}
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              6. Cookies
            </h2>
            <p className="text-muted-foreground mb-4">
              We use cookies to operate the site, remember your preferences, and
              (with your consent) analyse how you use the site and deliver relevant
              marketing.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">
              Strictly necessary cookies
            </h3>
            <p className="text-muted-foreground mb-4">
              Authentication session, shopping cart, consent preference record. These
              cannot be disabled as they are essential for the site to function.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">
              Analytics cookies (consent required)
            </h3>
            <p className="text-muted-foreground mb-4">
              Google Analytics (GA4) and PostHog. Used to understand how visitors
              interact with the site so we can improve the experience.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">
              Marketing cookies (consent required)
            </h3>
            <p className="text-muted-foreground mb-4">
              Klaviyo and Google Tag Manager. Used to deliver relevant advertising
              and measure campaign effectiveness.
            </p>

            <h3 className="font-semibold mb-2 text-foreground">TCF v2.2 compliance</h3>
            <p className="text-muted-foreground mb-4">
              We store your consent choices in a <code className="text-xs bg-[var(--surface)] px-1.5 py-0.5 rounded">euconsent-v2</code> cookie
              in accordance with the IAB Transparency and Consent Framework v2.2.
            </p>

            <p className="text-muted-foreground">
              You can manage your cookie preferences at any time on our{" "}
              <Link href="/consent" className="underline hover:text-foreground">
                consent preferences page
              </Link>{" "}
              or view our full{" "}
              <Link href="/cookies" className="underline hover:text-foreground">
                cookie policy
              </Link>
              .
            </p>
          </section>

          {/* 7. Data retention */}
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              7. Data retention
            </h2>
            <p className="text-muted-foreground mb-4">
              We keep your data only as long as necessary:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong className="text-foreground">Account data</strong> &mdash;
                retained until you delete your account
              </li>
              <li>
                <strong className="text-foreground">Order and financial records</strong>{" "}
                &mdash; 7 years (UK tax law requirement)
              </li>
              <li>
                <strong className="text-foreground">Analytics data</strong> &mdash; 2
                years
              </li>
              <li>
                <strong className="text-foreground">Transactional email logs</strong>{" "}
                &mdash; 5 years
              </li>
              <li>
                <strong className="text-foreground">Consent records</strong> &mdash; 5
                years from the date consent was granted or revoked
              </li>
            </ul>
          </section>

          {/* 8. International transfers */}
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              8. International data transfers
            </h2>
            <p className="text-muted-foreground mb-3">
              Your data is primarily processed in the European Union. Our hosting
              infrastructure (Runix / Hetzner) is located in Germany. Some of our
              processors are based in the United States:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-3">
              <li>
                <strong className="text-foreground">Stripe</strong> and{" "}
                <strong className="text-foreground">Google</strong> &mdash; certified
                under the EU-US Data Privacy Framework
              </li>
              <li>
                <strong className="text-foreground">Anthropic</strong> &mdash;
                standard contractual clauses; no personal data is shared (product
                content only)
              </li>
            </ul>
            <p className="text-muted-foreground">
              We ensure all international transfers comply with UK GDPR requirements
              through adequacy decisions, standard contractual clauses, or binding
              corporate rules as appropriate.
            </p>
          </section>

          {/* 9. Children */}
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              9. Children&apos;s privacy
            </h2>
            <p className="text-muted-foreground">
              Our services are not directed at individuals under the age of 16. We do
              not knowingly collect personal data from children. If you believe a
              child has provided us with personal data, please contact us at{" "}
              <a
                href="mailto:privacy@vernont.com"
                className="underline hover:text-foreground"
              >
                privacy@vernont.com
              </a>{" "}
              and we will delete it promptly.
            </p>
          </section>

          {/* 10. Changes to this policy */}
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              10. Changes to this policy
            </h2>
            <p className="text-muted-foreground">
              We may update this policy from time to time. Where changes are
              significant, we will notify you by email and prompt you to review and
              re-confirm your consent preferences. The &ldquo;last updated&rdquo;
              date at the top of this page reflects the most recent revision.
            </p>
          </section>

          {/* 11. Contact */}
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              11. Contact
            </h2>
            <p className="text-muted-foreground mb-3">
              If you have any questions about this privacy policy or wish to exercise
              your rights, please contact us:
            </p>
            <address className="text-muted-foreground not-italic space-y-1">
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <a
                  href="mailto:privacy@vernont.com"
                  className="underline hover:text-foreground"
                >
                  privacy@vernont.com
                </a>
              </p>
              <p>
                <strong className="text-foreground">Post:</strong> Vernont Ltd, London,
                United Kingdom
              </p>
            </address>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
