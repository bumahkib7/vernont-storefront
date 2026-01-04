import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Imprint | Vernont",
  description: "Legal information and company details for Vernont luxury perfumes.",
};

export default function ImprintPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-8">
          Imprint
        </h1>

        <div className="prose prose-lg max-w-none font-serif space-y-8">
          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Company Information</h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              <p><strong>Vernont Luxury Fragrances GmbH</strong></p>
              <p>Parfümstraße 42</p>
              <p>80331 Munich</p>
              <p>Germany</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Contact Details</h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              <p><strong>Phone:</strong> +49 (0) 89 123 456 789</p>
              <p><strong>Email:</strong> info@vernont.com</p>
              <p><strong>Website:</strong> www.vernont.com</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Management</h2>
            <div className="text-muted-foreground leading-relaxed">
              <p><strong>Managing Directors:</strong></p>
              <p>Victoria Vernont (CEO)</p>
              <p>Marcus Beaumont (CFO)</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Registration</h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              <p><strong>Commercial Register:</strong> Munich District Court</p>
              <p><strong>Registration Number:</strong> HRB 123456</p>
              <p><strong>VAT ID:</strong> DE123456789</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Responsible for Content</h2>
            <div className="text-muted-foreground leading-relaxed">
              <p>Victoria Vernont</p>
              <p>Parfümstraße 42</p>
              <p>80331 Munich, Germany</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Dispute Resolution</h2>
            <p className="text-muted-foreground leading-relaxed">
              The European Commission provides a platform for online dispute resolution (OS):
              https://ec.europa.eu/consumers/odr. We are not obliged or willing to participate
              in dispute resolution proceedings before a consumer arbitration board.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Liability for Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              As a service provider, we are responsible for our own content on these pages
              in accordance with general laws. However, we are not obligated to monitor
              transmitted or stored third-party information or to investigate circumstances
              that indicate illegal activity.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Liability for Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website contains links to external third-party websites over whose content
              we have no influence. We cannot accept any liability for this external content.
              The respective provider or operator of the linked pages is always responsible
              for the content of those pages.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Copyright</h2>
            <p className="text-muted-foreground leading-relaxed">
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
