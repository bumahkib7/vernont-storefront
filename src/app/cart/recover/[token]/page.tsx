"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface RecoveredCart {
  id: string;
  email: string;
  item_count: number;
  total: number;
  currency_code: string;
}

export default function CartRecoverPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [cart, setCart] = useState<RecoveredCart | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function recoverCart() {
      try {
        const response = await fetch(`${API_BASE_URL}/store/carts/recover/${token}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setError(data.error || "This recovery link is invalid or has expired.");
          setStatus("error");
          return;
        }

        const data = await response.json();
        setCart(data.cart);
        setStatus("success");
      } catch {
        setError("Something went wrong. Please try again.");
        setStatus("error");
      }
    }

    if (token) {
      recoverCart();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center"
      >
        {status === "loading" && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-neutral-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-neutral-900">
              Restoring your cart...
            </h1>
            <p className="text-neutral-500 mt-2">
              Please wait while we load your saved items.
            </p>
          </>
        )}

        {status === "success" && cart && (
          <>
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-xl font-semibold text-neutral-900">
              Your cart has been restored!
            </h1>
            <p className="text-neutral-500 mt-2">
              {cart.item_count} item{cart.item_count !== 1 ? "s" : ""} ready for checkout.
            </p>
            <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500">Cart total</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                {cart.currency_code.toUpperCase()} {Number(cart.total).toFixed(2)}
              </p>
            </div>
            <Link
              href="/checkout"
              className="mt-6 inline-flex items-center justify-center w-full bg-neutral-900 text-white rounded-lg px-6 py-3 font-medium hover:bg-neutral-800 transition-colors"
            >
              Continue to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="mt-3 inline-block text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              Continue shopping
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-neutral-900">
              Unable to restore cart
            </h1>
            <p className="text-neutral-500 mt-2">{error}</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center w-full bg-neutral-900 text-white rounded-lg px-6 py-3 font-medium hover:bg-neutral-800 transition-colors"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
