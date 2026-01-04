"use client";

import { useEffect, useState } from "react";
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
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/context/CartContext";

interface OrderData {
  orderNumber: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  deliveryPrice: number;
  giftWrap: number;
  discount: number;
  total: number;
  currency: string;
  shipping: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    postcode: string;
    country: string;
    phone: string;
    deliveryOption: string;
  };
}

const deliveryNames: Record<string, string> = {
  standard: "Standard Delivery (5-7 days)",
  express: "Express Delivery (2-3 days)",
  "next-day": "Next Day Delivery",
};

export default function ConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const orderData = sessionStorage.getItem("vernont-order");
    if (orderData) {
      setOrder(JSON.parse(orderData));
      // Clear the order data after displaying
      sessionStorage.removeItem("vernont-order");
    } else {
      // No order data, redirect to home
      router.push("/");
    }

    // Hide confetti after a few seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  if (!order) {
    return null;
  }

  const estimatedDelivery = () => {
    const today = new Date();
    let daysToAdd = 7;
    if (order.shipping.deliveryOption === "express") daysToAdd = 3;
    if (order.shipping.deliveryOption === "next-day") daysToAdd = 1;

    const delivery = new Date(today.setDate(today.getDate() + daysToAdd));
    return delivery.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <PageLayout>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: Math.random() * 360,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3"
              style={{
                backgroundColor: ["#D4AF37", "#B76E79", "#F7E7CE", "#1A1A1A"][
                  Math.floor(Math.random() * 4)
                ],
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 bg-gold rounded-full flex items-center justify-center"
            >
              <Check className="h-10 w-10 text-primary" />
            </motion.div>

            <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
              Thank You for Your Order
            </h1>
            <p className="font-serif text-muted-foreground mb-2">
              Your order has been confirmed and is being prepared with care.
            </p>
            <p className="font-display text-lg text-gold">
              Order #{order.orderNumber}
            </p>
          </motion.div>

          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-secondary/50 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gold" />
                <div>
                  <p className="font-display text-sm">Estimated Delivery</p>
                  <p className="font-serif text-muted-foreground text-sm">
                    {estimatedDelivery()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gold" />
                <div>
                  <p className="font-display text-sm">Shipping Method</p>
                  <p className="font-serif text-muted-foreground text-sm">
                    {deliveryNames[order.shipping.deliveryOption]}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-1 bg-border rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "25%" }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="h-full bg-gold rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-serif text-xs text-gold">Order Placed</span>
                <span className="font-serif text-xs text-muted-foreground">
                  Processing
                </span>
                <span className="font-serif text-xs text-muted-foreground">
                  Shipped
                </span>
                <span className="font-serif text-xs text-muted-foreground">
                  Delivered
                </span>
              </div>
            </div>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background border border-border p-6 mb-8"
          >
            <h2 className="font-display text-lg tracking-wide mb-6">
              Order Details
            </h2>

            {/* Items */}
            <div className="space-y-4 mb-6 pb-6 border-b border-border">
              {order.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-secondary flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-display">{item.name}</p>
                    <p className="font-serif text-sm text-muted-foreground">
                      {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-display">
                    {formatPrice(item.price * item.quantity, order.currency)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
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
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Gift className="h-3 w-3" /> Gift Wrap
                  </span>
                  <span>{formatPrice(order.giftWrap, order.currency)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-display text-lg">Total</span>
                <span className="font-display text-lg">
                  {formatPrice(order.total, order.currency)}
                </span>
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-gold" />
                  <h3 className="font-display text-sm">Shipping Address</h3>
                </div>
                <div className="font-serif text-sm text-muted-foreground space-y-1">
                  <p>
                    {order.shipping.firstName} {order.shipping.lastName}
                  </p>
                  <p>{order.shipping.address}</p>
                  {order.shipping.apartment && <p>{order.shipping.apartment}</p>}
                  <p>
                    {order.shipping.city}, {order.shipping.postcode}
                  </p>
                  <p>{order.shipping.phone}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-4 w-4 text-gold" />
                  <h3 className="font-display text-sm">Contact</h3>
                </div>
                <p className="font-serif text-sm text-muted-foreground">
                  {order.shipping.email}
                </p>

                <div className="flex items-center gap-2 mt-4 mb-3">
                  <CreditCard className="h-4 w-4 text-gold" />
                  <h3 className="font-display text-sm">Payment</h3>
                </div>
                <p className="font-serif text-sm text-muted-foreground">
                  Card ending in •••• 4242
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/fragrances">
              <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90 w-full sm:w-auto">
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="btn-outline-luxury w-full sm:w-auto"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </motion.div>

          {/* Confirmation Email Notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center font-serif text-sm text-muted-foreground mt-8"
          >
            A confirmation email has been sent to{" "}
            <span className="text-foreground">{order.shipping.email}</span>
          </motion.p>
        </div>
      </div>
    </PageLayout>
  );
}
