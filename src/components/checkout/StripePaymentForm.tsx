"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/context/CartContext";

// Stripe appearance for luxury styling
const stripeAppearance = {
  theme: "flat" as const,
  variables: {
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontSizeBase: "16px",
    colorPrimary: "#D4AF37",
    colorBackground: "#FFFFFF",
    colorText: "#1A1A1A",
    colorDanger: "#B76E79",
    borderRadius: "0px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #E5E5E5",
      padding: "12px 16px",
    },
    ".Input:focus": {
      border: "1px solid #D4AF37",
      boxShadow: "0 0 0 1px #D4AF37",
    },
    ".Label": {
      fontFamily: '"Crimson Pro", Georgia, serif',
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "8px",
    },
    ".Error": {
      color: "#B76E79",
      fontSize: "13px",
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
        // 3D Secure or other authentication required
        // Stripe handles this automatically with redirect: "if_required"
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
      <div className="p-4 bg-secondary/30 mb-6 flex items-center gap-2">
        <Lock className="h-4 w-4 text-gold" />
        <span className="font-serif text-sm text-muted-foreground">
          All transactions are secure and encrypted by Stripe
        </span>
      </div>

      <div className="mb-6">
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-serif">{error}</p>
        </motion.div>
      )}

      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex items-center gap-2 font-serif text-sm text-muted-foreground hover:text-gold transition-colors disabled:opacity-50"
        >
          Return to shipping
        </button>
        <Button
          type="submit"
          disabled={!stripe || !elements || isProcessing || !isReady}
          className="btn-luxury bg-gold text-primary hover:bg-gold/90 min-w-[200px] disabled:opacity-50"
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full"
            />
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Pay {formatPrice(total, currency)}
            </>
          )}
        </Button>
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
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full"
        />
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
