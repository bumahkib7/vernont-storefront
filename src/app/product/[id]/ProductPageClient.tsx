"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "@phosphor-icons/react";
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
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/ProductJsonLd";
import { toast } from "sonner";
import { verticalConfig } from "@/config/vertical";

interface ProductPageClientProps {
  id: string;
}

function AccordionSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E5E5E5]">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-5 text-left">
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
  const [specsData, setSpecsData] = useState<ProductSpecificationsResponse | null>(null);

  const { addItem, currency } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

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

  const relatedProducts = useMemo(() => {
    if (!relatedData?.items) return [];
    return transformProducts(relatedData.items)
      .filter(p => p.id !== id && p.handle !== id)
      .slice(0, 3);
  }, [relatedData, id]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="px-4 lg:px-6 py-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <div className="aspect-square bg-[#F0F0F0] animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 w-24 bg-[#F0F0F0] animate-pulse" />
              <div className="h-8 w-48 bg-[#F0F0F0] animate-pulse" />
              <div className="h-4 w-32 bg-[#F0F0F0] animate-pulse" />
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
  const productImages = product.images.length > 0 ? product.images : [product.image];
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

  const productUrl = typeof window !== "undefined" ? window.location.href : `https://vernont.com/product/${id}`;

  return (
    <PageLayout>
      {productData?.product && <ProductJsonLd product={productData.product} url={productUrl} />}
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

      {/* Product Section — SGH layout: large image LEFT, info RIGHT */}
      <section className="px-4 lg:px-6 py-4 lg:py-6">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-10">
          {/* LEFT: Product Image */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-[#F0F0F0] overflow-hidden">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-8 lg:p-12"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-[#F0F0F0] overflow-hidden border-2 ${
                      selectedImage === index ? "border-[#1A1A1A]" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info — SGH style */}
          <div className="lg:sticky lg:top-[80px] lg:self-start">
            {/* Price + Wishlist row */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xl font-medium tabular-nums">
                  {formatPriceMajor(currentPrice, currency)}
                </span>
                {hasDiscount && (
                  <span className="ml-2 text-sm text-[#999] line-through tabular-nums">
                    {formatPriceMajor(currentOriginalPrice!, currency)}
                  </span>
                )}
              </div>
              <button
                onClick={() => toggleItem(product.id)}
                className="p-1 hover:opacity-60 transition-opacity"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#1A1A1A] text-[#1A1A1A]" : "text-[#999]"}`} />
              </button>
            </div>

            {/* Brand — serif, large */}
            {product.brand && (
              <h1 className="text-2xl lg:text-3xl mb-1" style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}>
                {product.brand}
              </h1>
            )}

            {/* Model name */}
            <p className="text-sm text-[#666] mb-1">{product.name}</p>

            {/* Badges */}
            {product.isBestseller && (
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-4">Best Seller</p>
            )}

            {/* Frame / Lens specs if available */}
            {(product.frameShape || product.frameMaterial || product.lensType) && (
              <div className="space-y-1 mb-4 text-[13px]">
                {product.frameMaterial && (
                  <p><span className="text-[#999] uppercase tracking-wider text-[11px]">Frame</span> <span className="ml-2 font-medium">{product.frameMaterial}</span></p>
                )}
                {product.lensType && (
                  <p><span className="text-[#999] uppercase tracking-wider text-[11px]">Lenses</span> <span className="ml-2 font-medium">{product.lensType}</span></p>
                )}
              </div>
            )}

            {/* Variant swatches — SGH style thumbnail boxes */}
            {product.variants.length > 1 && (
              <div className="flex gap-2 mb-6">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`w-16 h-16 border-2 bg-[#F0F0F0] flex items-center justify-center transition-colors ${
                      selectedVariantIndex === index ? "border-[#1A1A1A]" : "border-transparent"
                    }`}
                  >
                    <span className="text-[10px] text-center leading-tight">{variant.title}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Add to bag — SGH style: full-width, black, rounded-full */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-sm font-medium rounded-full transition-colors mb-3 ${
                isAdded
                  ? "bg-green-600 text-white"
                  : "bg-[#1A1A1A] text-white hover:bg-[#333]"
              }`}
            >
              {isAdded ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Added to bag
                </span>
              ) : (
                "Add to bag"
              )}
            </button>

            {/* Payment methods */}
            <p className="text-center text-[12px] text-[#999] mb-6">
              <span className="font-medium text-[#1A1A1A]">Apple Pay</span>, <span className="font-medium text-[#1A1A1A]">Google Pay</span> and all major cards accepted.
            </p>

            {/* Delivery info — SGH style */}
            <div className="space-y-4 mb-6 py-4 border-t border-[#E5E5E5]">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#1A1A1A] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-wider">Free Home Delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ArrowCounterClockwise className="w-5 h-5 text-[#1A1A1A] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-wider">Free Returns</p>
                  <p className="text-[12px] text-[#999]">Within 30 days</p>
                </div>
              </div>
            </div>

            {/* Accordion sections — inside info column for mobile flow */}
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
    </PageLayout>
  );
}
