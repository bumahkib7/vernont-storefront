"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Package,
  Truck,
  Mail,
  MapPin,
  CreditCard,
  ArrowRight,
  Download,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PrintableReceipt } from "@/components/checkout/PrintableReceipt";
import { formatPrice } from "@/context/CartContext";
import { cartApi, ordersApi } from "@/lib/api";

interface OrderItem {
  title: string;
  variant_title?: string | null;
  quantity: number;
  unit_price: number;
  thumbnail?: string | null;
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

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initOrder = async () => {
      const paymentIntent = searchParams.get("payment_intent");
      const redirectStatus = searchParams.get("redirect_status");
      const orderId = searchParams.get("order_id");

      if (paymentIntent && redirectStatus === "succeeded") {
        try {
          const cartId = localStorage.getItem("vernont_cart_id");
          if (cartId) {
            // Confirm payment and get order ID
            const confirmResponse = await cartApi.confirmPayment(cartId, paymentIntent);
            const confirmedOrderId = confirmResponse.order.id;

            // Fetch full order details
            const response = await ordersApi.get(confirmedOrderId);
            const orderResponse = response.order;

            const orderData: OrderData = {
              orderNumber: `VRN-${orderResponse.display_id || orderResponse.id.slice(0, 8)}`,
              items: orderResponse.items?.map((item) => ({
                title: item.title,
                variant_title: item.variant_title,
                quantity: item.quantity,
                unit_price: item.unit_price,
                thumbnail: item.thumbnail,
              })) || [],
              subtotal: orderResponse.subtotal || 0,
              deliveryPrice: orderResponse.shipping || 0,
              giftWrap: 0,
              discount: orderResponse.discount || 0,
              total: orderResponse.total || 0,
              currency: orderResponse.currency_code?.toUpperCase() || "GBP",
              email: orderResponse.email || "",
              shipping: undefined, // Shipping address would need to be added to schema
            };

            // Clear cart ID after successful order
            localStorage.removeItem("vernont_cart_id");

            setOrder(orderData);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error("Failed to confirm payment from redirect:", err);
        }
      }

      if (orderId) {
        try {
          const response = await ordersApi.get(orderId);
          const orderResponse = response.order;

          const orderData: OrderData = {
            orderNumber: `VRN-${orderResponse.display_id || orderResponse.id.slice(0, 8)}`,
            items: orderResponse.items?.map((item) => ({
              title: item.title,
              variant_title: item.variant_title,
              quantity: item.quantity,
              unit_price: item.unit_price,
              thumbnail: item.thumbnail,
            })) || [],
            subtotal: orderResponse.subtotal || 0,
            deliveryPrice: orderResponse.shipping || 0,
            giftWrap: 0,
            discount: orderResponse.discount || 0,
            total: orderResponse.total || 0,
            currency: orderResponse.currency_code?.toUpperCase() || "GBP",
            email: orderResponse.email || "",
            shipping: undefined, // Shipping address would need to be added to schema
          };

          setOrder(orderData);
          setIsLoading(false);
          return;
        } catch (err) {
          console.error("Failed to fetch order:", err);
        }
      }

      const sessionOrderData = sessionStorage.getItem("vernont-order");
      if (sessionOrderData) {
        try {
          setOrder(JSON.parse(sessionOrderData));
          sessionStorage.removeItem("vernont-order");
          setIsLoading(false);
          return;
        } catch {
          // Invalid JSON, continue to redirect
        }
      }

      router.push("/");
    };

    initOrder();
  }, [router, searchParams]);

  if (!order) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border border-neutral-300 border-t-black rounded-full animate-spin" />
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
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-16 md:py-24">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-6">
              <Check className="h-8 w-8 text-white" strokeWidth={2} />
            </div>

            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
              Thank you for your order
            </h1>

            <p className="text-neutral-500 mb-6">
              Your order has been confirmed and will be shipped soon.
            </p>

            <p className="text-sm">
              Order number: <span className="font-medium">{order.orderNumber}</span>
            </p>
          </div>

          {/* Order Status */}
          <div className="border-t border-b border-neutral-200 py-8 mb-8">
            <div className="flex justify-between items-start gap-8">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Estimated delivery</p>
                  <p className="text-sm text-neutral-500">{estimatedDelivery()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Shipping method</p>
                  <p className="text-sm text-neutral-500">Standard Delivery</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-black" />
                  <span className="text-xs font-medium">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neutral-200" />
                  <span className="text-xs text-neutral-400">Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neutral-200" />
                  <span className="text-xs text-neutral-400">Shipped</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neutral-200" />
                  <span className="text-xs text-neutral-400">Delivered</span>
                </div>
              </div>
              <div className="h-0.5 bg-neutral-200 relative">
                <div className="absolute left-0 top-0 h-full w-1/4 bg-black" />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-sm font-medium uppercase tracking-wide mb-6">
              Order Details
            </h2>

            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-neutral-100 flex-shrink-0">
                    {item.thumbnail && (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    {item.variant_title && (
                      <p className="text-sm text-neutral-500">{item.variant_title}</p>
                    )}
                    <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(item.unit_price * item.quantity, order.currency)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-neutral-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatPrice(order.subtotal, order.currency)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Discount</span>
                  <span className="text-green-600">-{formatPrice(order.discount, order.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span>
                  {order.deliveryPrice === 0 ? "Free" : formatPrice(order.deliveryPrice, order.currency)}
                </span>
              </div>
              <div className="flex justify-between text-base font-medium pt-2 border-t border-neutral-200">
                <span>Total</span>
                <span>{formatPrice(order.total, order.currency)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 pb-8 border-b border-neutral-200">
            {order.shipping && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  <h3 className="text-sm font-medium uppercase tracking-wide">
                    Shipping Address
                  </h3>
                </div>
                <div className="text-sm text-neutral-600 space-y-0.5">
                  <p>{order.shipping.first_name} {order.shipping.last_name}</p>
                  <p>{order.shipping.address_1}</p>
                  {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
                  <p>{order.shipping.city}, {order.shipping.postal_code}</p>
                  {order.shipping.phone && <p>{order.shipping.phone}</p>}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4 text-neutral-400" />
                <h3 className="text-sm font-medium uppercase tracking-wide">
                  Contact
                </h3>
              </div>
              <p className="text-sm text-neutral-600 mb-6">{order.email}</p>

              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-neutral-400" />
                <h3 className="text-sm font-medium uppercase tracking-wide">
                  Payment
                </h3>
              </div>
              <p className="text-sm text-neutral-600">Paid via Stripe</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link href="/fragrances">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors w-full sm:w-auto">
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition-colors w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </button>
          </div>

          {/* Email Notice */}
          <p className="text-center text-sm text-neutral-500">
            A confirmation email has been sent to {order.email}
          </p>
        </div>
      </div>

      {/* Printable Receipt */}
      <PrintableReceipt order={order} />
    </PageLayout>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <PageLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-6 h-6 border border-neutral-300 border-t-black rounded-full animate-spin" />
          </div>
        </PageLayout>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
