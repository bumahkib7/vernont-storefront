"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, ShoppingBag, Share2, Check, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { products, getProductById } from "@/data/products";
import { useCart, formatPrice } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const product = getProductById(id);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("50ml");
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addItem, currency } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const sizes = [
    { size: "30ml", price: product ? product.price * 0.6 : 0 },
    { size: "50ml", price: product?.price || 0 },
    { size: "100ml", price: product ? product.price * 1.6 : 0 },
  ];

  const relatedProducts = products.filter(p => p.id !== id).slice(0, 4);

  if (!product) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
            <p className="font-serif text-muted-foreground mb-8">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/fragrances">
              <Button className="btn-outline-luxury">Browse All Fragrances</Button>
            </Link>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  const currentPrice = sizes.find(s => s.size === selectedSize)?.price || product.price;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      size: selectedSize,
      quantity,
      image: product.image,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} by ${product.brand}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Multiple product images (simulated)
  const productImages = [
    product.image,
    product.image.replace("?w=800", "?w=801"),
    product.image.replace("?w=800", "?w=802"),
  ];

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-border"
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="font-serif text-sm text-muted-foreground">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/fragrances" className="hover:text-gold transition-colors">Fragrances</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </motion.div>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main Image */}
              <div className="relative aspect-square bg-secondary mb-4 overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={productImages[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
                {product.isNew && (
                  <Badge className="absolute top-4 left-4 bg-gold text-primary font-display text-xs tracking-wider">
                    New
                  </Badge>
                )}
                {product.isBestseller && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-display text-xs tracking-wider">
                    Bestseller
                  </Badge>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 border-2 transition-colors ${
                      selectedImage === index ? "border-gold" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="font-serif text-gold tracking-[0.2em] uppercase text-sm mb-2">
                {product.brand}
              </p>
              <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-2">
                {product.name}
              </h1>
              <p className="font-serif text-muted-foreground mb-6">
                {product.category}
              </p>

              <motion.p
                key={currentPrice}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-2xl mb-8"
              >
                {formatPrice(currentPrice, currency)}
              </motion.p>

              {product.description && (
                <p className="font-serif text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Size Selection */}
              <div className="mb-8">
                <p className="font-display text-sm tracking-wider uppercase mb-3">Size</p>
                <div className="flex gap-3">
                  {sizes.map((s) => (
                    <motion.button
                      key={s.size}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-5 py-3 border font-serif text-sm transition-all ${
                        selectedSize === s.size
                          ? "border-gold text-gold bg-gold/10"
                          : "border-border hover:border-gold"
                      }`}
                    >
                      <span className="block">{s.size}</span>
                      <span className="text-xs text-muted-foreground">{formatPrice(s.price, currency)}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="font-display text-sm tracking-wider uppercase mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-secondary transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </motion.button>
                    <span className="w-12 text-center font-serif">{quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-secondary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 mb-8">
                <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleAddToCart}
                    className={`w-full btn-luxury py-6 transition-all ${
                      isAdded
                        ? "bg-green-600 hover:bg-green-600"
                        : "bg-gold text-primary hover:bg-gold/90"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isAdded ? (
                        <motion.span
                          key="added"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center text-white"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Added to Bag!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add to Bag
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleItem(product.id)}
                    className={`h-14 w-14 border-border hover:border-gold ${
                      isWishlisted ? "bg-rose-50" : ""
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="h-14 w-14 border-border hover:border-gold"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Shipping Info */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-secondary mb-8">
                <div className="flex items-center gap-2 text-xs">
                  <Truck className="h-4 w-4 text-gold flex-shrink-0" />
                  <span className="font-serif">Free UK Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <RotateCcw className="h-4 w-4 text-gold flex-shrink-0" />
                  <span className="font-serif">30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4 text-gold flex-shrink-0" />
                  <span className="font-serif">Secure Payment</span>
                </div>
              </div>

              {/* Notes */}
              {product.notes && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="border-t border-border pt-8"
                >
                  <p className="font-display text-sm tracking-wider uppercase mb-4">
                    Fragrance Notes
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-secondary/50">
                      <p className="font-serif text-xs text-gold uppercase tracking-wider mb-2">Top</p>
                      <p className="font-serif text-sm text-muted-foreground">
                        {product.notes.top.join(", ")}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-secondary/50">
                      <p className="font-serif text-xs text-gold uppercase tracking-wider mb-2">Heart</p>
                      <p className="font-serif text-sm text-muted-foreground">
                        {product.notes.heart.join(", ")}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-secondary/50">
                      <p className="font-serif text-xs text-gold uppercase tracking-wider mb-2">Base</p>
                      <p className="font-serif text-sm text-muted-foreground">
                        {product.notes.base.join(", ")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
              Complete Your Collection
            </p>
            <h2 className="font-display text-2xl md:text-3xl tracking-wide">
              You May Also Like
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((product, index) => (
              <EnhancedProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
