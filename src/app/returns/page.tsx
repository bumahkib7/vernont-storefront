"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowCounterClockwise, SpinnerGap, Package, WarningCircle } from "@/components/icons";
import { ordersApi, returnsApi } from "@/lib/api";

export default function GuestReturnsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Try to find the order
      const response = await ordersApi.get(orderNumber);

      // Check if email matches
      if (response.order.email.toLowerCase() !== email.toLowerCase()) {
        setError("The email address does not match this order. Please check and try again.");
        setIsLoading(false);
        return;
      }

      // Redirect to order details page where they can initiate return
      router.push(`/account/orders/${orderNumber}`);
    } catch (err: any) {
      setError(
        err.message ||
        "Order not found. Please check your order number and email address."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <Header />

      <main className="w-full">
        {/* Page Header */}
        <section className="w-full border-b border-[#E5E5E5] py-16 bg-[#FAFAFA]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mx-auto mb-6">
              <ArrowCounterClockwise className="h-8 w-8 text-[#1A1A1A]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Return Your Order
            </h1>
            <p className="text-[#666] max-w-2xl mx-auto">
              Enter your email address and order number to view your order and initiate a return.
            </p>
          </div>
        </section>

        {/* Return Form */}
        <section className="w-full py-16">
          <div className="max-w-[600px] mx-auto px-4 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 border border-[#E5E5E5] focus:outline-none focus:border-[#1A1A1A] text-[14px]"
                />
                <p className="text-xs text-[#999] mt-2">
                  Enter the email address used when placing your order
                </p>
              </div>

              {/* Order Number */}
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., #12345 or order_abc123"
                  required
                  className="w-full px-4 py-3 border border-[#E5E5E5] focus:outline-none focus:border-[#1A1A1A] text-[14px]"
                />
                <p className="text-xs text-[#999] mt-2">
                  You can find your order number in the confirmation email
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 flex items-start gap-3">
                  <WarningCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-900">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A1A1A] text-white py-3.5 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <SpinnerGap className="h-4 w-4 animate-spin" />
                    <span>Finding Order...</span>
                  </>
                ) : (
                  <span>View Order</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E5E5]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#999] uppercase tracking-wider text-xs">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Account Login Link */}
            <div className="text-center space-y-4">
              <Link
                href="/account/returns"
                className="block w-full py-3.5 border border-[#E5E5E5] text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#FAFAFA] transition-colors"
              >
                View Returns in Your Account
              </Link>
              <p className="text-xs text-[#999]">
                Log in to track your returns and access your full order history
              </p>
            </div>
          </div>
        </section>

        {/* Return Policy Highlight */}
        <section className="w-full py-16 bg-[#FAFAFA] border-t border-[#E5E5E5]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold tracking-tight mb-8">
                Our Return Policy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2">
                    14-Day Returns
                  </h3>
                  <p className="text-[13px] text-[#666]">
                    Returns accepted within 14 days of delivery
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mb-4">
                    <ArrowCounterClockwise className="h-6 w-6 text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2">
                    Free Returns
                  </h3>
                  <p className="text-[13px] text-[#666]">
                    We cover return shipping on all orders
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mb-4">
                    <SpinnerGap className="h-6 w-6 text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2">
                    Fast Refunds
                  </h3>
                  <p className="text-[13px] text-[#666]">
                    Processed within 5-7 business days
                  </p>
                </div>
              </div>
              <div className="mt-12">
                <Link
                  href="/return-policy"
                  className="text-[12px] uppercase tracking-wider text-[#1A1A1A] hover:underline font-medium"
                >
                  View Full Return Policy →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
