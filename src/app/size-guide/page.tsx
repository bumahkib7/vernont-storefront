import { PageLayout } from "@/components/layout/PageLayout";
import { guides, verticalConfig } from "@/config/vertical";

export const metadata = {
  title: `Size Guide | Vernont`,
  description: `Find the perfect ${verticalConfig.label.toLowerCase()} size for your face. Guide to measurements, sizing, and materials.`,
};

export default function SizeGuidePage() {
  return (
    <PageLayout>
      <div className="max-w-[1500px] mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl tracking-wide mb-4">
            Size Guide
          </h1>
          <p className="text-muted-foreground">
            Find the perfect frame size and fit for your face.
          </p>
        </div>

        {/* Frame Sizes */}
        <section className="mb-16">
          <h2 className="text-2xl tracking-wide mb-6 pb-2 border-b border-border">
            Frame Size Chart
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-normal">Size</th>
                  <th className="text-left py-3 font-normal">Lens Width</th>
                  <th className="text-left py-3 font-normal">Bridge Width</th>
                  <th className="text-left py-3 font-normal">Temple Length</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {guides.frameSizes.map((row) => (
                  <tr key={row.size} className="border-b border-border">
                    <td className="py-4">{row.size}</td>
                    <td className="py-4">{row.lensWidth}</td>
                    <td className="py-4">{row.bridgeWidth}</td>
                    <td className="py-4">{row.templeLength}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {guides.sizeMeasurementNote}
          </p>
        </section>

        {/* Measurements Explained */}
        <section className="mb-16">
          <h2 className="text-2xl tracking-wide mb-6 pb-2 border-b border-border">
            Frame Materials
          </h2>
          <div className="space-y-6">
            {guides.frameMaterials.map((material) => (
              <div key={material.name} className="p-6 bg-secondary">
                <h3 className="text-lg mb-2">{material.name}</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Weight: {material.weight} | Durability: {material.durability} | Hypoallergenic: {material.hypoallergenic}
                </p>
                <p className="text-muted-foreground text-sm">
                  {material.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="p-8 bg-primary text-primary-foreground">
          <h2 className="text-xl tracking-wide mb-4">{verticalConfig.label} Care Tips</h2>
          <ul className="text-sm space-y-2 text-primary-foreground/80">
            {guides.careTips.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
