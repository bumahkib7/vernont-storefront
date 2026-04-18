"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { guides as _guides, verticalConfig } from "@/config/vertical";

const guides = _guides!;
import { motion } from "framer-motion";

export default function SizeGuidePage() {
  const colors = {
    text: "#1A1A1A",
    muted: "#666",
    border: "#E5E5E5",
    surface: "#F5F5F5",
    accent: "#999",
  };

  const headingFont: React.CSSProperties = {
    fontFamily: "'Crimson Pro', 'Georgia', serif",
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-4xl md:text-5xl tracking-wide mb-4"
            style={{ ...headingFont, color: colors.text }}
          >
            Size Guide
          </h1>
          <p style={{ color: colors.muted }}>
            Find the perfect frame size and fit for your face.
          </p>
        </motion.div>

        {/* Frame Sizes */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2
            className="text-2xl tracking-wide mb-6 pb-2"
            style={{
              ...headingFont,
              color: colors.text,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            Frame Size Chart
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th
                    className="text-left py-3 font-normal"
                    style={{ color: colors.text }}
                  >
                    Size
                  </th>
                  <th
                    className="text-left py-3 font-normal"
                    style={{ color: colors.text }}
                  >
                    Lens Width
                  </th>
                  <th
                    className="text-left py-3 font-normal"
                    style={{ color: colors.text }}
                  >
                    Bridge Width
                  </th>
                  <th
                    className="text-left py-3 font-normal"
                    style={{ color: colors.text }}
                  >
                    Temple Length
                  </th>
                </tr>
              </thead>
              <tbody>
                {guides.frameSizes.map((row) => (
                  <tr
                    key={row.size}
                    style={{ borderBottom: `1px solid ${colors.border}` }}
                  >
                    <td className="py-4" style={{ color: colors.muted }}>
                      {row.size}
                    </td>
                    <td className="py-4" style={{ color: colors.muted }}>
                      {row.lensWidth}
                    </td>
                    <td className="py-4" style={{ color: colors.muted }}>
                      {row.bridgeWidth}
                    </td>
                    <td className="py-4" style={{ color: colors.muted }}>
                      {row.templeLength}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-4" style={{ color: colors.muted }}>
            {guides.sizeMeasurementNote}
          </p>
        </motion.section>

        {/* Frame Materials */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2
            className="text-2xl tracking-wide mb-6 pb-2"
            style={{
              ...headingFont,
              color: colors.text,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            Frame Materials
          </h2>
          <div className="space-y-6">
            {guides.frameMaterials.map((material) => (
              <div
                key={material.name}
                className="p-6"
                style={{ backgroundColor: colors.surface }}
              >
                <h3
                  className="text-lg mb-2"
                  style={{ ...headingFont, color: colors.text }}
                >
                  {material.name}
                </h3>
                <p className="text-sm mb-2" style={{ color: colors.muted }}>
                  Weight: {material.weight} | Durability:{" "}
                  {material.durability} | Hypoallergenic:{" "}
                  {material.hypoallergenic}
                </p>
                <p className="text-sm" style={{ color: colors.muted }}>
                  {material.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Care Tips */}
        <motion.section
          className="p-8"
          style={{ backgroundColor: colors.text, color: "#FFFFFF" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2
            className="text-xl tracking-wide mb-4"
            style={{ ...headingFont, color: "#FFFFFF" }}
          >
            {verticalConfig.label} Care Tips
          </h2>
          <ul className="text-sm space-y-2" style={{ color: "rgba(255,255,255,0.8)" }}>
            {guides.careTips.map((tip) => (
              <li key={tip}>&#8226; {tip}</li>
            ))}
          </ul>
        </motion.section>
      </div>
    </PageLayout>
  );
}
