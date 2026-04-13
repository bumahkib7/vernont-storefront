import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Imprint | Vernont",
  description: "Legal information and company details for Vernont luxury eyewear.",
};

export default function ImprintPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-16" style={{ color: "#1A1A1A" }}>
        <h1
          className="text-4xl md:text-5xl tracking-wide mb-8"
          style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
        >
          Imprint
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
            >
              Company Information
            </h2>
            <div className="leading-relaxed space-y-2" style={{ color: "#666" }}>
              <p><strong>Vernont Luxury Eyewear GmbH</strong></p>
              <p>Parfümstraße 42</p>
              <p>80331 Munich</p>
              <p>Germany</p>
            </div>
          </section>

          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
            >
              Contact Details
            </h2>
            <div className="leading-relaxed space-y-2" style={{ color: "#666" }}>
              <p><strong>Phone:</strong> +49 (0) 89 123 456 789</p>
              <p><strong>Email:</strong> info@vernont.com</p>
              <p><strong>Website:</strong> www.vernont.com</p>
            </div>
          </section>

          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
            >
              Management
            </h2>
            <div className="leading-relaxed" style={{ color: "#666" }}>
              <p><strong>Managing Directors:</strong></p>
              <p>Victoria Vernont (CEO)</p>
              <p>Marcus Beaumont (CFO)</p>
            </div>
          </section>

          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
            >
              Registration
            </h2>
            <div className="leading-relaxed space-y-2" style={{ color: "#666" }}>
              <p><strong>Commercial Register:</strong> Munich District Court</p>
              <p><strong>Registration Number:</strong> HRB 123456</p>
              <p><strong>VAT ID:</strong> DE123456789</p>
            </div>
          </section>

          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
            >
              Responsible for Content
            </h2>
            <div className="leading-relaxed" style={{ color: "#666" }}>
              <p>Victoria Vernont</p>
              <p>Parfümstraße 42</p>
              <p>80331 Munich, Germany</p>
            </div>
          </section>

          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
            >
              Dispute Resolution
            </h2>
            <p className="leading-relaxed" style={{ color: "#666" }}>
              The European Commission provides a platform for online dispute resolution (OS):
              https://ec.europa.eu/consumers/odr. We are not obliged or willing to participate
              in dispute resolution proceedings before a consumer arbitration board.
            </p>
          </section>

          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
            >
              Liability for Content
            </h2>
            <p className="leading-relaxed" style={{ color: "#666" }}>
              As a service provider, we are responsible for our own content on these pages
              in accordance with general laws. However, we are not obligated to monitor
              transmitted or stored third-party information or to investigate circumstances
              that indicate illegal activity.
            </p>
          </section>

          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
            >
              Liability for Links
            </h2>
            <p className="leading-relaxed" style={{ color: "#666" }}>
              Our website contains links to external third-party websites over whose content
              we have no influence. We cannot accept any liability for this external content.
              The respective provider or operator of the linked pages is always responsible
              for the content of those pages.
            </p>
          </section>

          <section>
            <h2
              className="text-2xl tracking-wide mb-4"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
            >
              Copyright
            </h2>
            <p className="leading-relaxed" style={{ color: "#666" }}>
              The content and works created by the site operators on these pages are subject
              to copyright law. Duplication, processing, distribution, and any kind of
              exploitation outside the limits of copyright require the written consent of
              the respective author or creator.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
