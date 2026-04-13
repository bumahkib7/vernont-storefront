"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Minus,
  Plus,
  Check,
  Truck,
  ArrowCounterClockwise,
  CaretDown,
  CaretLeft,
  Package,
  MagnifyingGlass,
  ShieldCheck,
} from "@/components/icons";
import { PageLayout } from "@/components/layout/PageLayout";
import { ListingProductCard } from "@/components/ListingProductCard";
import { ProductReviews } from "@/components/ProductReviews";
import { WriteReviewForm } from "@/components/WriteReviewForm";
import { ProductSpecifications } from "@/components/product/ProductSpecifications";
import { useProductByHandle, useProducts, useProductReviewStats } from "@/lib/hooks";
import { transformProduct, transformProducts } from "@/lib/transforms";
import { productsApi, type ProductSpecificationsResponse } from "@/lib/api";
import { useCart, formatPriceMajor } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/ProductJsonLd";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { toast } from "sonner";
import { verticalConfig } from "@/config/vertical";

interface ProductPageClientProps {
  id: string;
}

function ConditionBadge({ condition, conditionGrade }: { condition?: string; conditionGrade?: 'A' | 'B' | 'C' }) {
  let label: string;
  let bgColor: string;
  let textColor: string;

  if (!condition || condition === 'new') {
    label = 'New';
    bgColor = 'bg-green-50 border-green-200';
    textColor = 'text-green-800';
  } else if (condition === 'pre_owned_a' || conditionGrade === 'A') {
    label = 'Excellent Condition';
    bgColor = 'bg-amber-50 border-amber-200';
    textColor = 'text-amber-800';
  } else if (condition === 'pre_owned_b' || conditionGrade === 'B') {
    label = 'Very Good Condition';
    bgColor = 'bg-blue-50 border-blue-200';
    textColor = 'text-blue-800';
  } else if (condition === 'pre_owned_c' || conditionGrade === 'C') {
    label = 'Good Condition';
    bgColor = 'bg-gray-50 border-gray-300';
    textColor = 'text-gray-700';
  } else {
    label = 'Authenticated';
    bgColor = 'bg-[#F9F7F4] border-[#E5E0D8]';
    textColor = 'text-[#6B5E4F]';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest border rounded-full ${bgColor} ${textColor}`}>
      <ShieldCheck className="w-3.5 h-3.5" weight="fill" />
      {label}
    </span>
  );
}

function AccordionSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E5E5E5]">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-5 text-left" aria-expanded={open}>
        <span className="text-base" style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}>{title}</span>
        <CaretDown className={`w-5 h-5 text-[#999] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5 text-sm text-[#666] leading-relaxed">{children}</div>}
    </div>
  );
}

export default function ProductPageClient({ id }: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [specsData, setSpecsData] = useState<ProductSpecificationsResponse | null>(null);

  const { addItem, currency } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addProduct: addRecentlyViewed } = useRecentlyViewed();

  const { data: productData, isLoading, error } = useProductByHandle(id);
  const { data: relatedData } = useProducts({ limit: 6 });
  const { data: reviewStatsData } = useProductReviewStats(productData?.product?.id || "");

  const product = useMemo(() => {
    if (!productData?.product) return null;
    return transformProduct(productData.product);
  }, [productData]);

  useEffect(() => {
    if (!product?.id) return;
    let cancelled = false;
    productsApi.getSpecifications(product.id).then((data) => {
      if (!cancelled) setSpecsData(data);
    });
    return () => { cancelled = true; };
  }, [product?.id]);

  // Track recently viewed product
  useEffect(() => {
    if (product?.id) {
      addRecentlyViewed(product.id);
    }
  }, [product?.id, addRecentlyViewed]);

  const relatedProducts = useMemo(() => {
    if (!relatedData?.items) return [];
    return transformProducts(relatedData.items)
      .filter(p => p.id !== id && p.handle !== id)
      .slice(0, 3);
  }, [relatedData, id]);

  // Derive gallery images: prepend the selected variant's image (deduped) so it
  // appears at position 0 when the user clicks a variant swatch. Computed here —
  // before the early returns — so hook ordering stays stable for the guard
  // useEffect below.
  const productImages = useMemo(() => {
    if (!product) return [] as string[];
    const selected = product.variants[selectedVariantIndex];
    const base = product.images.length > 0 ? product.images : [product.image];
    if (selected?.image) {
      return [selected.image, ...base.filter((img) => img !== selected.image)];
    }
    return base;
  }, [product, selectedVariantIndex]);

  // Guard against stale selectedImage index when the derived gallery shrinks
  // (e.g. switching from a variant-with-image to one without).
  useEffect(() => {
    if (selectedImage >= productImages.length && productImages.length > 0) {
      setSelectedImage(0);
    }
  }, [productImages.length, selectedImage]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-3 w-12 bg-[#F0F0F0] rounded-sm animate-pulse" />
            <div className="h-3 w-3 bg-[#F0F0F0] rounded-sm animate-pulse" />
            <div className="h-3 w-16 bg-[#F0F0F0] rounded-sm animate-pulse" />
            <div className="h-3 w-3 bg-[#F0F0F0] rounded-sm animate-pulse" />
            <div className="h-3 w-32 bg-[#F0F0F0] rounded-sm animate-pulse" />
          </div>

          <div className="grid lg:grid-cols-[1fr_440px] gap-12">
            {/* Left: Image gallery skeleton */}
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="hidden lg:flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 bg-[#F5F5F5] animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              {/* Main image */}
              <div className="flex-1 aspect-square bg-[#FAFAFA] animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>

            {/* Right: Product info skeleton */}
            <div className="space-y-6">
              {/* Brand */}
              <div className="h-3 w-20 bg-[#F0F0F0] rounded-sm animate-pulse" />
              {/* Title */}
              <div className="space-y-2">
                <div className="h-7 w-3/4 bg-[#F0F0F0] rounded-sm animate-pulse" style={{ animationDelay: "50ms" }} />
                <div className="h-7 w-1/2 bg-[#F0F0F0] rounded-sm animate-pulse" style={{ animationDelay: "100ms" }} />
              </div>
              {/* Price */}
              <div className="h-6 w-24 bg-[#F0F0F0] rounded-sm animate-pulse" style={{ animationDelay: "150ms" }} />
              {/* Trust badges */}
              <div className="flex gap-6 py-4 border-y border-[#F0F0F0]">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2" style={{ animationDelay: `${200 + i * 50}ms` }}>
                    <div className="w-4 h-4 bg-[#F0F0F0] rounded-full animate-pulse" />
                    <div className="h-3 w-24 bg-[#F0F0F0] rounded-sm animate-pulse" />
                  </div>
                ))}
              </div>
              {/* Variant selector */}
              <div className="space-y-3">
                <div className="h-3 w-16 bg-[#F0F0F0] rounded-sm animate-pulse" />
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 w-24 bg-[#F5F5F5] border border-[#E5E5E5] animate-pulse" style={{ animationDelay: `${300 + i * 50}ms` }} />
                  ))}
                </div>
              </div>
              {/* Add to cart button */}
              <div className="h-14 w-full bg-[#E8E8E8] animate-pulse" style={{ animationDelay: "400ms" }} />
              {/* Accordion sections */}
              <div className="space-y-0 pt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-5 border-b border-[#F0F0F0]">
                    <div className="h-4 w-32 bg-[#F0F0F0] rounded-sm animate-pulse" style={{ animationDelay: `${500 + i * 50}ms` }} />
                    <div className="h-4 w-4 bg-[#F0F0F0] rounded-sm animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !product) {
    return (
      <PageLayout>
        <div className="px-4 lg:px-6 py-32 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-[#CCC]" />
          <h1 className="text-2xl mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>Product not found</h1>
          <p className="text-[#999] mb-6 text-sm">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href={verticalConfig.catalogPath} className="inline-block px-8 py-3 bg-[#1A1A1A] text-white text-sm font-medium hover:bg-[#333] transition-colors">
            Browse All {verticalConfig.label}
          </Link>
        </div>
      </PageLayout>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const currentPrice = selectedVariant?.price ?? product.price;
  const currentOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const isWishlisted = isInWishlist(product.id);
  const hasDiscount = currentOriginalPrice && currentOriginalPrice > currentPrice;

  const handleAddToCart = async () => {
    const variantId = selectedVariant?.id || product.variantId;
    if (!variantId) return;
    try {
      await addItem(variantId, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add to cart");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const productUrl = typeof window !== "undefined" ? window.location.href : `https://vernont.com/product/${id}`;

  return (
    <PageLayout>
      {productData?.product && (
        <ProductJsonLd
          product={productData.product}
          url={productUrl}
          reviewStats={reviewStatsData?.stats || null}
        />
      )}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://vernont.com" },
          { name: verticalConfig.label, url: `https://vernont.com${verticalConfig.catalogPath}` },
          { name: product.name, url: productUrl },
        ]}
      />

      {/* Back button — SGH style */}
      <div className="px-4 lg:px-6 pt-4">
        <button onClick={() => window.history.back()} className="p-1 hover:opacity-60 transition-opacity">
          <CaretLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Product Section — Pret à Voir layout */}
      <section className="px-4 lg:px-8 py-6 lg:py-10 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-16">
          {/* LEFT: Image gallery with vertical dot navigation.
              self-start stops grid from stretching the column to match the right
              column's height; items-start keeps the image pinned to the top.
              Combined with lg:sticky so the gallery stays visible while the
              description column scrolls. Without this, a tall right column
              (expanded accordion, long description) pushed the image below the fold. */}
          <div className="flex items-start gap-4 lg:gap-8 lg:self-start lg:sticky lg:top-[80px]">
            {/* Vertical dot navigation - Moved OUTSIDE the image to prevent overlap */}
            {productImages.length > 1 && (
              <div className="flex flex-col gap-3 relative z-20">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-11 h-11 rounded-full border-2 transition-colors flex items-center justify-center ${
                      selectedImage === index
                        ? "bg-[#1A1A1A] border-[#1A1A1A]"
                        : "bg-transparent border-[#999] hover:border-[#1A1A1A]"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${selectedImage === index ? "bg-white" : "bg-[#999]"}`} />
                  </button>
                ))}
              </div>
            )}

            <div 
              className={`relative flex-1 aspect-[4/3] bg-white overflow-hidden group ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {productImages.map((src, idx) => (
                <div
                  key={`${src}-${idx}`}
                  className={`absolute inset-0 transition-opacity duration-150 ${
                    idx === selectedImage ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <div
                    className="relative w-full h-full"
                    style={{
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      transform: isZoomed ? "scale(2.5)" : "scale(1)",
                      transition: isZoomed ? "none" : "transform 0.3s ease-out"
                    }}
                  >
                    <Image
                      src={src}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-contain p-4 lg:p-6"
                      priority={idx === 0 || idx === 1}
                    />
                  </div>
                </div>
              ))}

              {/* Magnifying glass icon - fade out to hide when zoomed in */}
              <div 
                className={`absolute bottom-4 left-4 p-2 transition-opacity duration-300 pointer-events-none z-20 ${
                  isZoomed ? "opacity-0" : "opacity-100 text-[#999]"
                }`}
              >
                <MagnifyingGlass className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info — Pret a Voir style */}
          <div className="lg:sticky lg:top-[80px] lg:self-start">

            {/* Brand — large centered serif heading, uppercase */}
            {product.brand && (
              <h1 className="text-3xl lg:text-4xl font-bold tracking-widest uppercase text-center mb-6"
                  style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}>
                {product.brand}
              </h1>
            )}

            {/* Product name — uppercase small */}
            <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-center text-[#1A1A1A] pb-3 mb-0">
              {product.name}
            </h2>

            {/* Condition badge */}
            <div className="flex justify-center pb-5 mb-5 border-b border-[#E5E5E5]">
              <ConditionBadge condition={product.condition} conditionGrade={product.conditionGrade} />
            </div>

            {/* Frame / Lens specs */}
            {(product.frameMaterial || product.lensType || product.variants?.[0]?.sku) && (
              <div className="text-center space-y-1 mb-5 text-[13px] text-[#666]">
                {product.frameMaterial && <p>{product.frameMaterial}</p>}
                {product.lensType && <p>{product.lensType}</p>}
                {product.variants?.[0]?.sku && (
                  <p className="text-[13px] text-[#444] font-medium mt-2">
                    SKU: {product.variants[0].sku}
                  </p>
                )}
              </div>
            )}

            {/* Price row */}
            <div className="text-center mb-4">
              <span className="text-xl font-medium tabular-nums tracking-wide">
                {formatPriceMajor(currentPrice, currency)}
              </span>
              {hasDiscount && (
                <span className="ml-3 text-sm text-[#767676] line-through tabular-nums">
                  {formatPriceMajor(currentOriginalPrice!, currency)}
                </span>
              )}
            </div>

            {/* Wishlist — outline heart + text, centered. Heart pops on tap
                and gently spring-scales when toggling to 'saved' state. */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => toggleItem(product.id)}
                className="flex items-center gap-2 text-[12px] text-[#666] hover:text-[#1A1A1A] transition-colors"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <motion.span
                  key={isWishlisted ? "wish-on" : "wish-off"}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.28, times: [0, 0.5, 1], ease: "easeOut" }}
                  className="inline-flex"
                >
                  <Heart
                    weight={isWishlisted ? "fill" : "regular"}
                    className={`w-4 h-4 ${isWishlisted ? "text-[#1A1A1A]" : "text-[#666]"}`}
                  />
                </motion.span>
                {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Variant picker.
                Label resolution priority for each swatch:
                  1. variant.options values joined ("Black / M") — most
                     meaningful, comes from the ProductVariantOption rows in
                     the backend keyed by option title.
                  2. variant.title if it's not just a numeric placeholder.
                  3. "Option N" fallback.
                Selected swatch gets a visible ring + offset + checkmark
                badge so there's zero ambiguity about which variant will
                hit the cart when the user clicks Add to Bag. */}
            {product.variants.length > 1 && (() => {
              // Derive the picker group title ("COLOURS" / "SIZES" / "OPTIONS")
              // from whichever option name dominates the variant set.
              const optionKeys = Array.from(
                new Set(product.variants.flatMap((v) => (v.options ? Object.keys(v.options) : [])))
              );
              const primaryOption = optionKeys[0]; // e.g. "Color"
              const groupLabel = primaryOption
                ? `${product.variants.length} ${primaryOption.toUpperCase()}${primaryOption.endsWith("s") ? "" : "S"}`
                : `${product.variants.length} OPTIONS`;

              const labelFor = (variant: typeof product.variants[number], index: number) => {
                if (variant.options && Object.keys(variant.options).length > 0) {
                  return Object.values(variant.options).join(" / ");
                }
                const raw = variant.title?.trim();
                if (raw && !/^\d+$/.test(raw)) return raw;
                return `Option ${index + 1}`;
              };

              const selectedLabel = selectedVariant
                ? labelFor(selectedVariant, selectedVariantIndex)
                : `Option ${selectedVariantIndex + 1}`;

              return (
                <div className="mb-6 border-t border-b border-[#E5E5E5] py-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] text-center mb-1">
                    {groupLabel}
                  </p>
                  <p className="text-[11px] text-[#666] text-center mb-4">
                    Selected: <span className="font-medium text-[#1A1A1A]">{selectedLabel}</span>
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    {product.variants.map((variant, index) => {
                      const isSelected = selectedVariantIndex === index;
                      const displayLabel = labelFor(variant, index);
                      return (
                        <button
                          key={variant.id}
                          onClick={() => {
                            setSelectedVariantIndex(index);
                            setSelectedImage(0);
                          }}
                          className={`relative ${variant.image ? "w-20 h-14" : "min-w-16 h-12 px-3"} bg-white overflow-hidden transition-all ${
                            isSelected
                              ? "ring-2 ring-[#1A1A1A] ring-offset-2 border border-[#1A1A1A]"
                              : "border border-[#E5E5E5] hover:border-[#1A1A1A]"
                          }`}
                          aria-label={displayLabel}
                          aria-pressed={isSelected}
                          title={displayLabel}
                        >
                          {variant.image ? (
                            <Image
                              src={variant.image}
                              alt={displayLabel}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-center leading-tight flex items-center justify-center h-full font-medium whitespace-nowrap">
                              {displayLabel}
                            </span>
                          )}
                          {isSelected && (
                            <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" weight="bold" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Primary CTA — full-width black, Pret a Voir style */}
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.97 }}
              className={`relative overflow-hidden w-full py-4 text-[12px] font-bold uppercase tracking-[0.15em] transition-colors mb-2 ${
                isAdded
                  ? "bg-green-600 text-white"
                  : "bg-[#1A1A1A] text-white hover:bg-[#333]"
              }`}
            >
              {/* Crossfade the button label between idle and "Added to Bag".
                  AnimatePresence + mode=wait ensures the old text fades out
                  before the new one fades in so there's no visual stutter. */}
              <AnimatePresence mode="wait" initial={false}>
                {isAdded ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Added to Bag
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="block"
                  >
                    ADD TO CART OR ADD FREE LENSES
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Urgency line */}
            <p className="text-center text-[11px] text-[#666] tracking-wide mb-6">
              CHECK OUT IN 1 hrs — WE SHIP TODAY <span className="text-[#999]">(non prescription)</span>
            </p>

            {/* Confidence panel */}
            <div className="border border-[#E5E5E5] rounded px-5 py-4 mb-5">
              <p className="text-[12px] font-bold uppercase tracking-widest text-center text-[#1A1A1A] mb-3">Shop with Confidence</p>
              <p className="text-[11px] text-[#666] text-center mb-4">No Quibble Refunds on Frame and Lenses</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[12px] text-[#444]">
                  <Truck className="w-4 h-4 flex-shrink-0 text-[#666]" />
                  <span>Express Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[#444]">
                  <Package className="w-4 h-4 flex-shrink-0 text-[#666]" />
                  <span>24 Month Global Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[#444]">
                  <ArrowCounterClockwise className="w-4 h-4 flex-shrink-0 text-[#666]" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Authenticity guarantee */}
            <div className="flex items-start gap-3 bg-[#FAFAF7] border border-[#E8E5DF] rounded px-5 py-4 mb-5">
              <ShieldCheck className="w-6 h-6 text-[#1A1A1A] flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-[#1A1A1A]">
                  Authenticity Guaranteed
                </p>
                <p className="text-[11px] text-[#666] mt-0.5 leading-relaxed">
                  Every item verified by our qualified optometrist
                </p>
              </div>
            </div>

            {/* Accordion sections */}
            <div className="border-t border-[#E5E5E5]">
              <AccordionSection title="Product details" defaultOpen>
                <ProductSpecifications specs={specsData} product={product} />
                {product.description && <p className="mt-3">{product.description}</p>}
              </AccordionSection>

              <AccordionSection title="Size and fit">
                <div className="space-y-2">
                  {product.variants.length > 0 && (
                    <p>Available sizes: {product.variants.map(v => v.title).join(", ")}</p>
                  )}
                  {product.frameShape && <p>Frame shape: {product.frameShape}</p>}
                  <p>Refer to our <Link href="/size-guide" className="underline">size guide</Link> for detailed measurements.</p>
                </div>
              </AccordionSection>

              <AccordionSection title="Included with your order">
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Original brand case</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Cleaning cloth</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Certificate of authenticity</li>
                </ul>
              </AccordionSection>

              <AccordionSection title="Shipping and returns">
                <ul className="space-y-1.5">
                  <li>Standard delivery: 2-4 business days</li>
                  <li>Express delivery: 1-2 business days</li>
                  <li>International shipping available</li>
                  <li>30-day free returns</li>
                </ul>
              </AccordionSection>
            </div>
          </div>
        </div>
      </section>

      {/* You might also like — SGH style, 3 per row */}
      {relatedProducts.length > 0 && (
        <section className="py-10 lg:py-14 border-t border-[#E5E5E5]">
          <div className="px-4 lg:px-6">
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}>
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p, i) => (
                <ListingProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      <RecentlyViewed excludeId={product.id} />
    </PageLayout>
  );
}
