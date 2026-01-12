"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Minus,
  Plus,
  Check,
  Truck,
  RotateCcw,
  Shield,
  Star,
  ChevronRight,
  Share2,
  Scale,
  Package,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { ProductReviews } from "@/components/ProductReviews";
import { WriteReviewForm } from "@/components/WriteReviewForm";
import { useProductByHandle, useProducts, useProductReviewStats } from "@/lib/hooks";
import { transformProduct, transformProducts } from "@/lib/transforms";
import { useCart, formatPriceMajor } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/ProductJsonLd";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const INFO_TABS = [
  { id: "notes", label: "Fragrance Notes" },
  { id: "details", label: "Details" },
  { id: "shipping", label: "Shipping & Returns" },
  { id: "reviews", label: "Reviews" },
];

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("notes");
  const [showWriteReview, setShowWriteReview] = useState(false);

  const { addItem, currency } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addToCompare, isComparing, itemCount: compareCount } = useCompare();

  const { data: productData, isLoading, error } = useProductByHandle(id);
  const { data: relatedData } = useProducts({ limit: 8 });
  const { data: reviewStatsData } = useProductReviewStats(productData?.product?.id || "");

  const product = useMemo(() => {
    if (!productData?.product) return null;
    return transformProduct(productData.product);
  }, [productData]);

  const relatedProducts = useMemo(() => {
    if (!relatedData?.items) return [];
    return transformProducts(relatedData.items)
      .filter(p => p.id !== id && p.handle !== id)
      .slice(0, 4);
  }, [relatedData, id]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="space-y-4">
              <div className="aspect-square bg-neutral-100 animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-neutral-100 animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-24 bg-neutral-100 animate-pulse" />
              <div className="h-8 w-64 bg-neutral-100 animate-pulse" />
              <div className="h-6 w-32 bg-neutral-100 animate-pulse" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !product) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-32 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
          <h1 className="text-2xl font-light tracking-tight mb-2">Product not found</h1>
          <p className="text-neutral-500 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/fragrances"
            className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Browse All Fragrances
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
  const isCompared = isComparing(product.id);
  const discount = currentOriginalPrice && currentOriginalPrice > currentPrice
    ? Math.round((1 - currentPrice / currentOriginalPrice) * 100)
    : null;

  const handleAddToCart = async () => {
    const variantId = selectedVariant?.id || product.variantId;
    if (!variantId) return;

    try {
      await addItem(variantId, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleAddToCompare = () => {
    addToCompare({
      id: product.id,
      name: product.name,
      brand: product.brand || "",
      handle: product.handle,
      thumbnail: product.image,
      price: currentPrice,
      originalPrice: currentOriginalPrice || undefined,
      notes: product.notes,
      longevity: product.longevity,
      sillage: product.sillage,
    });
  };

  const productUrl = typeof window !== 'undefined' ? window.location.href : `https://vernont.com/product/${id}`;
  const avgRating = reviewStatsData?.stats?.average_rating || 0;
  const totalReviews = reviewStatsData?.stats?.total_reviews || 0;

  return (
    <PageLayout>
      {productData?.product && <ProductJsonLd product={productData.product} url={productUrl} />}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://vernont.com" },
          { name: "Fragrances", url: "https://vernont.com/fragrances" },
          { name: product.name, url: productUrl },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/fragrances" className="hover:text-black transition-colors">Fragrances</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black truncate">{product.name}</span>
        </div>
      </nav>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-neutral-50 overflow-hidden">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-2 py-1 bg-black text-white text-xs font-medium">New</span>
                )}
                {discount && (
                  <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium">-{discount}%</span>
                )}
              </div>

              {/* Share button */}
              <button
                className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white transition-colors"
                onClick={() => navigator.share?.({ url: productUrl, title: product.name })}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-black" : "border-transparent hover:border-neutral-300"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Brand */}
            {product.brand && (
              <Link
                href={`/brands/${product.brand.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-neutral-500 hover:text-black transition-colors"
              >
                {product.brand}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-light tracking-tight mt-1 mb-3">{product.name}</h1>

            {/* Rating */}
            <button
              onClick={() => setActiveTab("reviews")}
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(avgRating) ? "text-yellow-400 fill-current" : "text-neutral-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-500">
                {totalReviews > 0
                  ? `${avgRating.toFixed(1)} (${totalReviews} reviews)`
                  : "Be the first to review"}
              </span>
            </button>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-medium">
                {formatPriceMajor(currentPrice, currency)}
              </span>
              {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                <>
                  <span className="text-lg text-neutral-400 line-through">
                    {formatPriceMajor(currentOriginalPrice, currency)}
                  </span>
                  <span className="text-sm font-medium text-red-600">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-6 py-4 border-y border-neutral-200">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>In stock</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Truck className="w-4 h-4" />
                <span>Delivers in 2-4 days</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Shield className="w-4 h-4" />
                <span>100% Authentic</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-neutral-600 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Size</span>
                  {selectedVariant?.title && (
                    <span className="text-sm text-neutral-500">{selectedVariant.title}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantIndex(index)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        selectedVariantIndex === index
                          ? "border-black bg-black text-white"
                          : "border-neutral-200 hover:border-black"
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <span className="text-sm font-medium block mb-3">Quantity</span>
              <div className="inline-flex items-center border border-neutral-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-neutral-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-neutral-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  isAdded
                    ? "bg-green-600 text-white"
                    : "bg-black text-white hover:bg-neutral-800"
                }`}
              >
                {isAdded ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Added to Bag
                  </span>
                ) : (
                  "Add to Bag"
                )}
              </button>
              <button
                onClick={() => toggleItem(product.id)}
                className={`p-4 border transition-colors ${
                  isWishlisted
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 hover:border-black"
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleAddToCompare}
                disabled={isCompared || compareCount >= 3}
                className={`p-4 border transition-colors ${
                  isCompared
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
                aria-label={isCompared ? "In compare list" : "Add to compare"}
              >
                <Scale className="w-5 h-5" />
              </button>
            </div>

            {/* Secondary Info */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-neutral-200">
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto mb-1 text-neutral-400" />
                <p className="text-xs text-neutral-500">Free shipping £75+</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-5 h-5 mx-auto mb-1 text-neutral-400" />
                <p className="text-xs text-neutral-500">30-day returns</p>
              </div>
              <div className="text-center">
                <Package className="w-5 h-5 mx-auto mb-1 text-neutral-400" />
                <p className="text-xs text-neutral-500">Free samples</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-16">
        {/* Tab Headers */}
        <div className="flex gap-1 border-b border-neutral-200 mb-8 overflow-x-auto">
          {INFO_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-2xl">
          {activeTab === "notes" && (
            <div className="space-y-6">
              {product.notes && (product.notes.top.length > 0 || product.notes.heart.length > 0 || product.notes.base.length > 0) ? (
                <>
                  <div className="grid md:grid-cols-3 gap-6">
                    {product.notes.top.length > 0 && (
                      <div className="p-4 bg-neutral-50">
                        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Top Notes</p>
                        <div className="flex flex-wrap gap-2">
                          {product.notes.top.map((note) => (
                            <span key={note} className="px-2 py-1 bg-white text-sm border border-neutral-200">{note}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.notes.heart.length > 0 && (
                      <div className="p-4 bg-neutral-50">
                        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Heart Notes</p>
                        <div className="flex flex-wrap gap-2">
                          {product.notes.heart.map((note) => (
                            <span key={note} className="px-2 py-1 bg-white text-sm border border-neutral-200">{note}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.notes.base.length > 0 && (
                      <div className="p-4 bg-neutral-50">
                        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Base Notes</p>
                        <div className="flex flex-wrap gap-2">
                          {product.notes.base.map((note) => (
                            <span key={note} className="px-2 py-1 bg-white text-sm border border-neutral-200">{note}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">
                    Top notes are the first impression. Heart notes emerge as top notes fade. Base notes are the lasting foundation.
                  </p>
                </>
              ) : (
                <p className="text-neutral-500">Fragrance notes information not available for this product.</p>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {product.brand && (
                  <div>
                    <p className="text-sm text-neutral-500">Brand</p>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                )}
                {product.category && (
                  <div>
                    <p className="text-sm text-neutral-500">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                )}
                {selectedVariant?.title && (
                  <div>
                    <p className="text-sm text-neutral-500">Available Sizes</p>
                    <p className="font-medium">{product.variants.map(v => v.title).join(", ")}</p>
                  </div>
                )}
                {(selectedVariant?.sku || product.variants?.[0]?.sku) && (
                  <div>
                    <p className="text-sm text-neutral-500">SKU</p>
                    <p className="font-medium">{selectedVariant?.sku || product.variants?.[0]?.sku}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Shipping</h3>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Free standard shipping on orders over £75
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Standard delivery: 2-4 business days
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Express delivery: 1-2 business days (£5.99)
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Returns</h3>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    30-day return policy for unopened items
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Free returns on orders over £75
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Full refund processed within 5-7 business days
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-4xl">
              {/* Write Review Button / Form */}
              <div className="mb-8">
                {showWriteReview ? (
                  <div className="p-6 bg-neutral-50">
                    <WriteReviewForm
                      productId={product.id}
                      productName={product.name}
                      variantId={selectedVariant?.id}
                      variantTitle={selectedVariant?.title}
                      onSuccess={() => setShowWriteReview(false)}
                      onCancel={() => setShowWriteReview(false)}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowWriteReview(true)}
                    className="px-6 py-3 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Reviews List */}
              <ProductReviews productId={product.id} />
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-neutral-50 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-light tracking-tight">You May Also Like</h2>
                <p className="text-neutral-500">Based on your browsing</p>
              </div>
              <Link
                href="/fragrances"
                className="text-sm hover:underline flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <EnhancedProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
