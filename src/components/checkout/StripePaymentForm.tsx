"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Lock, WarningCircle, ArrowLeft, SpinnerGap, Shield } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { formatPrice } from "@/context/CartContext";

// Stripe appearance matching SGH-inspired design system
const stripeAppearance = {
  theme: "stripe" as const,
  variables: {
    fontFamily: '"Manrope", system-ui, -apple-system, sans-serif',
    fontSizeBase: "14px",
    colorPrimary: "#1A1A1A",
    colorBackground: "#FFFFFF",
    colorText: "#1A1A1A",
    colorDanger: "#dc2626",
    borderRadius: "2px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #E5E5E5",
      padding: "12px 14px",
      borderRadius: "2px",
      fontSize: "14px",
      transition: "border-color 0.15s ease",
    },
    ".Input:hover": {
      borderColor: "#D4D4D4",
    },
    ".Input:focus": {
      borderColor: "#1A1A1A",
      boxShadow: "none",
    },
    ".Label": {
      fontSize: "11px",
      fontWeight: "500",
      marginBottom: "6px",
      color: "#666",
      letterSpacing: "0.05em",
      textTransform: "uppercase" as const,
    },
    ".Error": {
      color: "#dc2626",
      fontSize: "12px",
      marginTop: "4px",
    },
    ".Tab": {
      borderRadius: "2px",
      border: "1px solid #E5E5E5",
      padding: "12px 16px",
    },
    ".Tab:hover": {
      borderColor: "#D4D4D4",
    },
    ".Tab--selected": {
      borderColor: "#1A1A1A",
      backgroundColor: "#FFFFFF",
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
      <div className="mb-6 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-sm flex items-center gap-3">
        <div className="w-8 h-8 rounded-sm bg-[var(--success)]/10 flex items-center justify-center">
          <Shield className="h-4 w-4 text-[var(--success)]" />
        </div>
        <div>
          <p className="text-xs font-medium tracking-wider uppercase">Secure Payment</p>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            All transactions are encrypted by Stripe
          </p>
        </div>
      </div>

      {/* Payment Element — shows all Stripe-enabled methods including Apple Pay, Google Pay */}
      <div className="mb-6">
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: "tabs",
            wallets: {
              applePay: "auto",
              googlePay: "auto",
            },
            paymentMethodOrder: ["apple_pay", "google_pay", "card"],
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-sm flex items-start gap-3"
        >
          <WarningCircle className="h-5 w-5 text-[var(--destructive)] flex-shrink-0 mt-0.5" />
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
          className="btn-primary min-w-[200px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <SpinnerGap className="h-4 w-4 animate-spin" />
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
        <SpinnerGap className="h-8 w-8 animate-spin text-[var(--primary)] mb-4" />
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
