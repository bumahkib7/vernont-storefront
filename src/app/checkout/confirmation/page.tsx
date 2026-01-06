"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Package,
  Truck,
  Mail,
  MapPin,
  CreditCard,
  Gift,
  ArrowRight,
  Download,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/context/CartContext";

interface OrderItem {
  title: string;
  variant_title?: string;
  quantity: number;
  unit_price: number;
  thumbnail?: string;
}

interface OrderData {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  deliveryPrice: number;
  giftWrap: number;
  discount: number;
  total: number;
  currency: string;
  email: string;
  shipping?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    postal_code?: string;
    country_code?: string;
    phone?: string;
  };
}

// Confetti piece component
const ConfettiPiece = ({ index, total }: { index: number; total: number }) => {
  const colors = ["#D4AF37", "#B76E79", "#F7E7CE", "#1A1A1A", "#D4AF37"];
  const shapes = ["square", "diamond", "circle", "star"];

  const randomValues = useMemo(() => ({
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    size: 6 + Math.random() * 10,
    rotation: Math.random() * 720 - 360,
    swingAmount: 50 + Math.random() * 100,
  }), []);

  const getShapeStyle = () => {
    switch (randomValues.shape) {
      case "diamond":
        return { transform: "rotate(45deg)" };
      case "circle":
        return { borderRadius: "50%" };
      case "star":
        return {
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{
        x: `${randomValues.x}vw`,
        y: -20,
        rotate: 0,
        opacity: 1,
      }}
      animate={{
        y: "110vh",
        rotate: randomValues.rotation,
        x: [
          `${randomValues.x}vw`,
          `${randomValues.x + randomValues.swingAmount / 10}vw`,
          `${randomValues.x - randomValues.swingAmount / 10}vw`,
          `${randomValues.x}vw`,
        ],
        opacity: [1, 1, 1, 0],
      }}
      transition={{
        duration: randomValues.duration,
        delay: randomValues.delay,
        ease: "linear",
        x: {
          duration: randomValues.duration,
          repeat: 0,
          ease: "easeInOut",
        },
      }}
      style={{
        width: randomValues.size,
        height: randomValues.size,
        backgroundColor: randomValues.color,
        ...getShapeStyle(),
      }}
    />
  );
};

// Sparkle burst component
const SparkleBurst = () => (
  <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute left-1/2 top-1/2"
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [0, 1.5, 0],
          opacity: [1, 0.8, 0],
          x: Math.cos((i * 30 * Math.PI) / 180) * 150,
          y: Math.sin((i * 30 * Math.PI) / 180) * 150,
        }}
        transition={{
          duration: 1,
          delay: 0.3,
          ease: "easeOut",
        }}
      >
        <Sparkles className="h-4 w-4 text-gold" />
      </motion.div>
    ))}
  </motion.div>
);

export default function ConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiCount] = useState(80);

  useEffect(() => {
    const orderData = sessionStorage.getItem("vernont-order");
    if (orderData) {
      try {
        setOrder(JSON.parse(orderData));
        sessionStorage.removeItem("vernont-order");
      } catch {
        router.push("/");
      }
    } else {
      router.push("/");
    }

    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, [router]);

  if (!order) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full"
          />
        </div>
      </PageLayout>
    );
  }

  const estimatedDelivery = () => {
    const today = new Date();
    const delivery = new Date(today.setDate(today.getDate() + 5));
    return delivery.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <PageLayout>
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(confettiCount)].map((_, i) => (
              <ConfettiPiece key={i} index={i} total={confettiCount} />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Art Deco Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 30px,
              rgba(212, 175, 55, 1) 30px,
              rgba(212, 175, 55, 1) 31px
            )`
          }} />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="max-w-3xl mx-auto">
            {/* Success Header with Art Deco Styling */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
              className="text-center mb-16"
            >
              {/* Animated Success Icon */}
              <div className="relative inline-block mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="relative"
                >
                  {/* Outer ring */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute -inset-4 border-2 border-gold/30 rotate-45"
                  />

                  {/* Main circle */}
                  <div className="w-24 h-24 bg-gold flex items-center justify-center relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <Check className="h-12 w-12 text-primary" strokeWidth={3} />
                    </motion.div>
                  </div>

                  {/* Corner decorations */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-gold" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-gold" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-gold" />
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-gold" />
                </motion.div>

                <SparkleBurst />
              </div>

              {/* Decorative Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex items-center justify-center gap-4 mb-8"
              >
                <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
                <span className="text-gold text-xs">&#9670;&#9670;&#9670;</span>
                <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-display text-4xl md:text-5xl tracking-[0.1em] mb-4"
              >
                Order Confirmed
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-muted-foreground text-lg mb-6 max-w-md mx-auto"
              >
                Thank you for your purchase. Your order is being prepared with the utmost care.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gold/10 border border-gold/30"
              >
                <span className="font-display text-sm tracking-[0.2em] uppercase text-gold">
                  Order
                </span>
                <span className="font-display text-lg tracking-wider">
                  {order.orderNumber}
                </span>
              </motion.div>
            </motion.div>

            {/* Order Status Card with Art Deco Frame */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative bg-[#0D0D0D] text-[#F5F0E1] p-8 mb-8"
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-gold" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-gold" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-gold" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-gold" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-gold/40 rotate-45 flex items-center justify-center">
                    <Package className="h-5 w-5 text-gold -rotate-45" />
                  </div>
                  <div>
                    <p className="font-display text-sm tracking-wider">Estimated Delivery</p>
                    <p className="font-serif text-gold">{estimatedDelivery()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-gold/40 rotate-45 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-gold -rotate-45" />
                  </div>
                  <div>
                    <p className="font-display text-sm tracking-wider">Shipping Method</p>
                    <p className="font-serif text-gold">Standard Delivery</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative pt-2">
                <div className="h-1 bg-[#333] relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "25%" }}
                    transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                    className="h-full bg-gold"
                  />
                  {/* Progress diamonds */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 bg-gold rotate-45" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/3 -translate-x-1/2 w-3 h-3 border border-gold/40 rotate-45 bg-[#0D0D0D]" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-2/3 -translate-x-1/2 w-3 h-3 border border-gold/40 rotate-45 bg-[#0D0D0D]" />
                  <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 border border-gold/40 rotate-45 bg-[#0D0D0D]" />
                </div>
                <div className="flex justify-between mt-4">
                  <span className="font-display text-[10px] tracking-wider text-gold uppercase">Confirmed</span>
                  <span className="font-display text-[10px] tracking-wider text-[#666] uppercase">Processing</span>
                  <span className="font-display text-[10px] tracking-wider text-[#666] uppercase">Shipped</span>
                  <span className="font-display text-[10px] tracking-wider text-[#666] uppercase">Delivered</span>
                </div>
              </div>
            </motion.div>

            {/* Order Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-background border border-gold/20 p-8 mb-8 relative"
            >
              {/* Decorative header */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              <div className="flex items-center gap-3 mb-8">
                <span className="w-1.5 h-1.5 bg-gold rotate-45" />
                <h2 className="font-display text-lg tracking-[0.15em] uppercase">
                  Order Details
                </h2>
              </div>

              {/* Items */}
              <div className="space-y-4 mb-8 pb-8 border-b border-gold/10">
                {order.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="relative w-20 h-20 bg-secondary flex-shrink-0 overflow-hidden">
                      {item.thumbnail && (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                      <div className="absolute inset-0 border border-gold/10" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display tracking-wide">{item.title}</p>
                      {item.variant_title && (
                        <p className="font-serif text-sm text-muted-foreground">
                          {item.variant_title}
                        </p>
                      )}
                      <p className="font-serif text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-display">
                      {formatPrice(item.unit_price * item.quantity, order.currency)}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between font-serif text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal, order.currency)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between font-serif text-sm text-gold">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount, order.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-serif text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {order.deliveryPrice === 0 ? (
                      <span className="text-gold">FREE</span>
                    ) : (
                      formatPrice(order.deliveryPrice, order.currency)
                    )}
                  </span>
                </div>
                {order.giftWrap > 0 && (
                  <div className="flex justify-between font-serif text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Gift className="h-3 w-3 text-gold" /> Gift Wrap
                    </span>
                    <span>{formatPrice(order.giftWrap, order.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-4 border-t border-gold/20">
                  <span className="font-display text-xl tracking-wider">Total</span>
                  <span className="font-display text-xl text-gold">
                    {formatPrice(order.total, order.currency)}
                  </span>
                </div>
              </div>

              {/* Shipping & Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gold/10">
                {order.shipping && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-4 w-4 text-gold" />
                      <h3 className="font-display text-xs tracking-[0.2em] uppercase">
                        Shipping Address
                      </h3>
                    </div>
                    <div className="font-serif text-sm text-muted-foreground space-y-1">
                      <p>{order.shipping.first_name} {order.shipping.last_name}</p>
                      <p>{order.shipping.address_1}</p>
                      {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
                      <p>{order.shipping.city}, {order.shipping.postal_code}</p>
                      {order.shipping.phone && <p>{order.shipping.phone}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-4 w-4 text-gold" />
                    <h3 className="font-display text-xs tracking-[0.2em] uppercase">
                      Contact
                    </h3>
                  </div>
                  <p className="font-serif text-sm text-muted-foreground">
                    {order.email}
                  </p>

                  <div className="flex items-center gap-2 mt-6 mb-4">
                    <CreditCard className="h-4 w-4 text-gold" />
                    <h3 className="font-display text-xs tracking-[0.2em] uppercase">
                      Payment
                    </h3>
                  </div>
                  <p className="font-serif text-sm text-muted-foreground">
                    Paid via Stripe
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/fragrances">
                <button className="btn-deco-filled group flex items-center justify-center gap-3 w-full sm:w-auto">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <button
                onClick={() => window.print()}
                className="btn-deco flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Download Receipt
              </button>
            </motion.div>

            {/* Confirmation Email Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center mt-12"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="h-px w-8 bg-gold/30" />
                <span className="text-gold text-[10px]">&#9670;</span>
                <span className="h-px w-8 bg-gold/30" />
              </div>
              <p className="font-serif text-sm text-muted-foreground">
                A confirmation email has been sent to{" "}
                <span className="text-gold">{order.email}</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
