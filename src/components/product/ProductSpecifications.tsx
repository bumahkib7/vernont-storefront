"use client";

import { useState } from "react";
import { ChevronDown, Check, Ruler, Eye, Package, Sparkles, Info } from "lucide-react";
import type { ProductSpecificationsResponse } from "@/lib/api";
import type { DisplayProduct } from "@/lib/transforms";

interface ProductSpecificationsProps {
  specs: ProductSpecificationsResponse | null;
  product: DisplayProduct;
}

interface AccordionSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function AccordionSection({ title, icon, defaultOpen = false, children }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <div className="flex items-center gap-3">
          <span className="text-neutral-400 group-hover:text-black transition-colors">
            {icon}
          </span>
          <span className="text-sm font-medium uppercase tracking-wider">
            {title}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[1000px] opacity-100 pb-6" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string | undefined | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2.5 border-b border-neutral-100 last:border-0">
      <span className="text-xs uppercase tracking-wider text-neutral-500">{label}</span>
      <span className="text-sm text-neutral-900 font-medium">{value}</span>
    </div>
  );
}

function MeasurementCard({ label, value, unit }: { label: string; value: number | string | undefined | null; unit?: string }) {
  if (!value) return null;
  return (
    <div className="text-center p-4 bg-neutral-50">
      <p className="text-2xl font-light tracking-tight text-black">
        {value}
        {unit && <span className="text-sm text-neutral-400 ml-0.5">{unit}</span>}
      </p>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">{label}</p>
    </div>
  );
}

export function ProductSpecifications({ specs, product }: ProductSpecificationsProps) {
  // Build a merged view: use specs from API if available, fall back to product metadata
  const hasSpecs = specs !== null;
  const hasProductMeta = !!(
    product.frameShape ||
    product.frameMaterial ||
    product.lensType ||
    product.measurements ||
    product.uvProtection ||
    product.faceShapes?.length
  );

  if (!hasSpecs && !hasProductMeta) {
    return (
      <div className="py-8 text-center">
        <Info className="w-8 h-8 mx-auto mb-3 text-neutral-300" />
        <p className="text-neutral-500">Specifications not available for this product.</p>
      </div>
    );
  }

  // Merge: API specs take priority, product metadata as fallback
  const frameColor = specs?.frame?.color || product.frameColor;
  const frameMaterial = specs?.frame?.material || product.frameMaterial;
  const frameShape = specs?.frame?.shape || product.frameShape;
  const frameType = specs?.frame?.type;

  const lensColor = specs?.lens?.color || product.lensColor;
  const lensMaterial = specs?.lens?.material;
  const lensTechnology = specs?.lens?.technology;
  const lensCoating = specs?.lens?.coating;
  const lensCategory = specs?.lens?.category;
  const uvProtection = specs?.lens?.uvProtection || product.uvProtection;
  const polarized = specs?.lens?.polarized;
  const lensType = product.lensType;

  const sizeLabel = specs?.measurements?.size || product.frameSize;
  const totalWidth = specs?.measurements?.totalWidth;
  const templeLength = specs?.measurements?.templeLength || product.measurements?.templeLength;
  const bridgeWidth = specs?.measurements?.bridgeWidth || product.measurements?.bridgeWidth;
  const lensWidth = specs?.measurements?.lensWidth || product.measurements?.lensWidth;
  const lensHeight = specs?.measurements?.lensHeight || product.measurements?.lensHeight;

  const fitType = specs?.fit?.type;
  const fitDescription = specs?.fit?.description;
  const faceShapes = specs?.fit?.faceShapes || product.faceShapes;
  const nosepadType = specs?.fit?.nosepadType;

  const styleCode = specs?.styleCode;
  const modelCode = specs?.modelCode;
  const description = specs?.description || product.description;
  const madeIn = specs?.madeIn || product.madeIn;

  const included = specs?.included;
  const careInstructions = specs?.careInstructions;
  const features = specs?.features;

  const hasFrameOrLens = frameColor || frameMaterial || frameShape || frameType || lensColor || lensMaterial || styleCode || modelCode;
  const hasLensDetails = lensColor || lensMaterial || lensTechnology || lensCoating || lensCategory || uvProtection || polarized !== undefined || (lensType && lensType.length > 0);
  const hasMeasurements = sizeLabel || totalWidth || templeLength || bridgeWidth || lensWidth || lensHeight;
  const hasFit = fitType || fitDescription || (faceShapes && faceShapes.length > 0) || nosepadType;
  const hasSizeFit = hasMeasurements || hasFit;

  return (
    <div className="max-w-3xl">
      {/* Product Details - always open */}
      <AccordionSection
        title="Product Details"
        icon={<Info className="w-4 h-4" />}
        defaultOpen={true}
      >
        {description && (
          <p className="text-sm text-neutral-600 leading-relaxed mb-6">{description}</p>
        )}

        {hasFrameOrLens && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Information */}
            {(styleCode || modelCode || product.brand || madeIn) && (
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3 pb-2 border-b border-neutral-200">
                  Product Information
                </h4>
                <SpecRow label="Brand" value={product.brand} />
                <SpecRow label="Style Code" value={styleCode} />
                <SpecRow label="Model Code" value={modelCode} />
                <SpecRow label="Made In" value={madeIn} />
              </div>
            )}

            {/* Frame Details */}
            {(frameColor || frameMaterial || frameShape || frameType) && (
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3 pb-2 border-b border-neutral-200">
                  Frame Details
                </h4>
                <SpecRow label="Color" value={frameColor} />
                <SpecRow label="Material" value={frameMaterial} />
                <SpecRow label="Shape" value={frameShape} />
                <SpecRow label="Type" value={frameType} />
              </div>
            )}
          </div>
        )}

        {/* Fallback: if no API specs but product has basic metadata, show it simply */}
        {!hasFrameOrLens && (product.brand || madeIn) && (
          <div>
            <SpecRow label="Brand" value={product.brand} />
            <SpecRow label="Made In" value={madeIn} />
          </div>
        )}
      </AccordionSection>

      {/* Lens Details */}
      {hasLensDetails && (
        <AccordionSection
          title="Lens Details"
          icon={<Eye className="w-4 h-4" />}
        >
          <div className="grid md:grid-cols-2 gap-x-8">
            <div>
              <SpecRow label="Color" value={lensColor} />
              <SpecRow label="Material" value={lensMaterial} />
              <SpecRow label="Technology" value={lensTechnology} />
              <SpecRow label="Coating" value={lensCoating} />
            </div>
            <div>
              <SpecRow label="Category" value={lensCategory} />
              <SpecRow label="UV Protection" value={uvProtection} />
              {lensType && lensType.length > 0 && (
                <SpecRow label="Lens Type" value={lensType.join(", ")} />
              )}
              {polarized !== undefined && polarized !== null && (
                <div className="flex justify-between py-2.5 border-b border-neutral-100 last:border-0">
                  <span className="text-xs uppercase tracking-wider text-neutral-500">Polarized</span>
                  {polarized ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white text-xs font-medium">
                      <Check className="w-3 h-3" />
                      Polarized
                    </span>
                  ) : (
                    <span className="text-sm text-neutral-900 font-medium">No</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </AccordionSection>
      )}

      {/* Size & Fit */}
      {hasSizeFit && (
        <AccordionSection
          title="Size & Fit"
          icon={<Ruler className="w-4 h-4" />}
        >
          {/* Visual measurement display */}
          {hasMeasurements && (
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sizeLabel && (
                  <MeasurementCard label="Size" value={sizeLabel} />
                )}
                {totalWidth && (
                  <MeasurementCard label="Total Width" value={totalWidth} unit="mm" />
                )}
                {templeLength && (
                  <MeasurementCard label="Temple Length" value={templeLength} unit="mm" />
                )}
                {bridgeWidth && (
                  <MeasurementCard label="Bridge Width" value={bridgeWidth} unit="mm" />
                )}
                {lensWidth && (
                  <MeasurementCard label="Lens Width" value={lensWidth} unit="mm" />
                )}
                {lensHeight && (
                  <MeasurementCard label="Lens Height" value={lensHeight} unit="mm" />
                )}
              </div>
            </div>
          )}

          {/* Fit details */}
          {hasFit && (
            <div className="space-y-3">
              {fitType && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-neutral-500">Fit Type</span>
                  <p className="text-sm font-medium mt-1">{fitType}</p>
                  {fitDescription && (
                    <p className="text-sm text-neutral-500 mt-1">{fitDescription}</p>
                  )}
                </div>
              )}

              {faceShapes && faceShapes.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-neutral-500">Recommended Face Shapes</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {faceShapes.map((shape) => (
                      <span
                        key={shape}
                        className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 text-sm"
                      >
                        {shape}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {nosepadType && (
                <SpecRow label="Nosepad" value={nosepadType} />
              )}
            </div>
          )}
        </AccordionSection>
      )}

      {/* What's Included */}
      {included && included.length > 0 && (
        <AccordionSection
          title="What's Included"
          icon={<Package className="w-4 h-4" />}
        >
          <ul className="space-y-2.5">
            {included.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-neutral-700">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </AccordionSection>
      )}

      {/* Care Instructions */}
      {careInstructions && careInstructions.length > 0 && (
        <AccordionSection
          title="Care Instructions"
          icon={<Sparkles className="w-4 h-4" />}
        >
          <ul className="space-y-2.5">
            {careInstructions.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </AccordionSection>
      )}

      {/* Features */}
      {features && features.length > 0 && (
        <AccordionSection
          title="Features"
          icon={<Sparkles className="w-4 h-4" />}
        >
          <div className="flex flex-wrap gap-2">
            {features.map((feature, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-black text-white text-xs font-medium uppercase tracking-wide"
              >
                {feature}
              </span>
            ))}
          </div>
        </AccordionSection>
      )}
    </div>
  );
}
