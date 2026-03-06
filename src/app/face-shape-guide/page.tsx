"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { guides, verticalConfig } from "@/config/vertical";

const FACE_SHAPES = guides.faceShapes;

export default function FaceShapeGuidePage() {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const activeShape = FACE_SHAPES.find((s) => s.id === selectedShape);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            Face Shape Guide
          </h1>
          <p className="font-serif text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Finding the perfect frames starts with knowing your face shape.
            Select yours below to discover which styles will look best on you.
          </p>
        </div>

        {/* Face Shape Selector */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          {FACE_SHAPES.map((shape) => (
            <button
              key={shape.id}
              onClick={() => setSelectedShape(shape.id === selectedShape ? null : shape.id)}
              className={`p-6 text-center border-2 transition-all rounded-lg ${
                selectedShape === shape.id
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-[var(--border)] hover:border-[var(--primary)]/50"
              }`}
            >
              <div className="w-16 h-20 mx-auto mb-3 border-2 border-current rounded-[40%] opacity-60" />
              <span className="font-medium">{shape.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Shape Details */}
        {activeShape && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 md:p-12 mb-16">
            <h2 className="font-display text-2xl md:text-3xl tracking-wide mb-4">
              {activeShape.name} Face Shape
            </h2>
            <p className="font-serif text-muted-foreground text-lg leading-relaxed mb-8">
              {activeShape.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-display text-lg tracking-wide mb-3 text-[var(--success)]">
                  Recommended Frames
                </h3>
                <ul className="space-y-2">
                  {activeShape.recommended.map((frame) => (
                    <li key={frame} className="flex items-center gap-2 font-serif">
                      <Check className="h-4 w-4 text-[var(--success)]" />
                      {frame}
                    </li>
                  ))}
                </ul>
              </div>

              {activeShape.avoid.length > 0 && (
                <div>
                  <h3 className="font-display text-lg tracking-wide mb-3 text-[var(--destructive)]">
                    Styles to Avoid
                  </h3>
                  <ul className="space-y-2">
                    {activeShape.avoid.map((frame) => (
                      <li key={frame} className="flex items-center gap-2 font-serif text-muted-foreground">
                        <span className="w-4 h-4 flex items-center justify-center text-[var(--destructive)]">x</span>
                        {frame}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-6 mb-8">
              <p className="font-serif text-muted-foreground italic">
                {activeShape.tip}
              </p>
            </div>

            <Link
              href={`/eyewear?faceShape=${activeShape.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity rounded-md"
            >
              Shop {activeShape.name} Face Frames
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* General Tips */}
        <div className="text-center">
          <h2 className="font-display text-2xl tracking-wide mb-4">
            Not Sure About Your Face Shape?
          </h2>
          <p className="font-serif text-muted-foreground mb-6 max-w-xl mx-auto">
            Stand in front of a mirror, pull your hair back, and trace the outline of your face.
            The shape you see will match one of the five categories above.
          </p>
          <Link
            href={verticalConfig.catalogPath}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            Browse All {verticalConfig.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
