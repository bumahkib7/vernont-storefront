"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Lock, AlertCircle, ArrowLeft, Loader2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/context/CartContext";

// Stripe appearance matching Clarity Commerce design system
const stripeAppearance = {
  theme: "stripe" as const,
  variables: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSizeBase: "14px",
    colorPrimary: "#18181b",
    colorBackground: "#ffffff",
    colorText: "#18181b",
    colorDanger: "#dc2626",
    borderRadius: "8px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #e4e4e7",
      padding: "12px 14px",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    },
    ".Input:hover": {
      borderColor: "#a1a1aa",
    },
    ".Input:focus": {
      borderColor: "#18181b",
      boxShadow: "0 0 0 3px rgba(24, 24, 27, 0.1)",
    },
    ".Label": {
      fontSize: "13px",
      fontWeight: "500",
      marginBottom: "6px",
      color: "#3f3f46",
    },
    ".Error": {
      color: "#dc2626",
      fontSize: "12px",
      marginTop: "4px",
    },
    ".Tab": {
      borderRadius: "8px",
      border: "1px solid #e4e4e7",
      padding: "12px 16px",
    },
    ".Tab:hover": {
      borderColor: "#a1a1aa",
    },
    ".Tab--selected": {
      borderColor: "#18181b",
      backgroundColor: "#fafafa",
    },
  },
};

interface StripePaymentFormProps {
  clientSecret: string;
  publishableKey: string;
  total: number;
  currency: string;
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
}

// Inner component that uses Stripe hooks
function PaymentForm({
  total,
  currency,
  onSuccess,
  onBack,
}: {
  total: number;
  currency: string;
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
        },
        redirect: "if_required",
      });

      if (submitError) {
        setError(submitError.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      } else if (paymentIntent && paymentIntent.status === "requires_action") {
        setError("Additional authentication required. Please complete the verification.");
      } else {
        setError("Payment was not completed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Security Badge */}
      <div className="mb-6 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
          <Shield className="h-4 w-4 text-[var(--success)]" />
        </div>
        <div>
          <p className="text-sm font-medium">Secure Payment</p>
          <p className="text-xs text-[var(--muted-foreground)]">
            All transactions are encrypted by Stripe
          </p>
        </div>
      </div>

      {/* Payment Element */}
      <div className="mb-6">
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-[var(--destructive)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--destructive)]">{error}</p>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to shipping
        </button>

        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing || !isReady}
          className="btn-primary min-w-[180px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Pay {formatPrice(total, currency)}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// Wrapper component that sets up Stripe Elements
export function StripePaymentForm({
  clientSecret,
  publishableKey,
  total,
  currency,
  onSuccess,
  onBack,
}: StripePaymentFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    if (publishableKey) {
      setStripePromise(loadStripe(publishableKey));
    }
  }, [publishableKey]);

  if (!stripePromise || !clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)] mb-4" />
        <p className="text-sm text-[var(--muted-foreground)]">
          Loading payment options...
        </p>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: stripeAppearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        total={total}
        currency={currency}
        onSuccess={onSuccess}
        onBack={onBack}
      />
    </Elements>
  );
}

export default StripePaymentForm;
