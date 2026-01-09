"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Lock,
  Truck,
  CreditCard,
  Check,
  ShoppingBag,
  ArrowLeft,
  Gift,
  Tag,
  AlertCircle,
  Loader2,
  Plus,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useCart, formatPrice } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { StripePaymentForm } from "@/components/checkout/StripePaymentForm";
import {
  cartApi,
  customerApi,
  shippingApi,
  PaymentSession,
  ApiError,
  CustomerAddress,
  ShippingOption,
} from "@/lib/api";

type CheckoutStep = "information" | "shipping" | "payment";

const countries = [
  { code: "GB", name: "United Kingdom" },
  { code: "IE", name: "Ireland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "AU", name: "Australia" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, items, subtotal, currency, clearCart, refreshCart, loading: cartLoading } = useCart();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);

  // Gift card state
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardError, setGiftCardError] = useState<string | null>(null);
  const [applyingGiftCard, setApplyingGiftCard] = useState(false);

  // User & addresses state
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Shipping options state
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Backend payment state
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postcode: "",
    country: "GB",
    phone: "",
    saveAddress: false,
    saveInfo: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user is logged in and fetch saved addresses
  useEffect(() => {
    const fetchUserData = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        setLoadingAddresses(true);
        return;
      }

      if (!isAuthenticated) {
        setShowAddressForm(true);
        setLoadingAddresses(false);
        return;
      }

      setLoadingAddresses(true);
      try {
        const response = await customerApi.getProfile();
        setSavedAddresses(response.customer.addresses || []);

        // Pre-fill email from user context or customer profile
        const email = user?.email || response.customer.email;
        if (email) {
          setFormData((prev) => ({ ...prev, email }));
        }

        // If no saved addresses, show form; otherwise hide it and let user select
        if (!response.customer.addresses || response.customer.addresses.length === 0) {
          setShowAddressForm(true);
        } else {
          setShowAddressForm(false);
        }
      } catch (err) {
        console.error("Failed to fetch customer profile:", err);
        setShowAddressForm(true);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, authLoading, user?.email]);

  // Fetch shipping options when cart is available
  useEffect(() => {
    const fetchShippingOptions = async () => {
      if (!cart?.id) return;

      setLoadingShipping(true);
      try {
        const response = await shippingApi.getOptions(cart.id);
        setShippingOptions(response.shipping_options);

        // Auto-select first option if none selected
        if (response.shipping_options.length > 0 && !selectedShippingId) {
          setSelectedShippingId(response.shipping_options[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch shipping options:", err);
        // Fallback to empty - will show message
        setShippingOptions([]);
      } finally {
        setLoadingShipping(false);
      }
    };

    fetchShippingOptions();
  }, [cart?.id, selectedShippingId]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.push("/");
    }
  }, [items, router, cartLoading]);

  const steps: { id: CheckoutStep; label: string }[] = [
    { id: "information", label: "Information" },
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // Get selected shipping option
  const selectedShipping = shippingOptions.find((opt) => opt.id === selectedShippingId);

  // Prices in minor units - use cart values from backend when available
  const shippingPriceMinor = selectedShipping?.amount ?? 0;
  const giftWrapPriceMinor = giftWrap ? 500 : 0;
  // Use discount from cart (set by backend when promo code applied)
  const discountMinor = cart?.discount_total ?? 0;
  // Gift card amount from cart (set by backend when gift card applied)
  const giftCardAmount = cart?.gift_card_total ?? 0;
  const giftCardApplied = !!cart?.gift_card_code;
  // Total from cart already includes gift card deduction, but we add shipping/gift wrap client-side
  const totalMinor = subtotal + shippingPriceMinor + giftWrapPriceMinor - discountMinor - giftCardAmount;

  // Get currently selected address (either saved or from form)
  const getSelectedAddress = useCallback((): {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    postal_code: string;
    country_code: string;
    phone?: string;
  } | null => {
    if (selectedAddressId) {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      if (addr) {
        return {
          first_name: addr.first_name || "",
          last_name: addr.last_name || "",
          address_1: addr.address_1 || "",
          address_2: addr.address_2 || undefined,
          city: addr.city || "",
          postal_code: addr.postal_code || "",
          country_code: addr.country_code || "GB",
          phone: addr.phone || undefined,
        };
      }
    }

    if (formData.address && formData.city && formData.postcode) {
      return {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        address_2: formData.apartment || undefined,
        city: formData.city,
        postal_code: formData.postcode,
        country_code: formData.country,
        phone: formData.phone || undefined,
      };
    }

    return null;
  }, [selectedAddressId, savedAddresses, formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: CheckoutStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === "information") {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Invalid email";

      // Only validate address fields if using form (not saved address)
      if (!selectedAddressId) {
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.address) newErrors.address = "Address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.postcode) newErrors.postcode = "Postcode is required";
        if (!formData.phone) newErrors.phone = "Phone is required";
      }
    }

    if (step === "shipping") {
      if (!selectedShippingId && shippingOptions.length > 0) {
        newErrors.shipping = "Please select a shipping method";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save new address if logged in and checkbox is checked
  const saveNewAddressIfNeeded = async () => {
    if (!isAuthenticated || !formData.saveAddress || selectedAddressId) return;

    try {
      await customerApi.createAddress({
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        address_2: formData.apartment || undefined,
        city: formData.city,
        country_code: formData.country,
        postal_code: formData.postcode,
        phone: formData.phone || undefined,
      });
    } catch (err) {
      console.error("Failed to save address:", err);
    }
  };

  // Initialize payment when entering payment step
  const initializePayment = useCallback(async () => {
    if (!cart) {
      setPaymentError("No cart found. Please try again.");
      return;
    }

    const address = getSelectedAddress();
    if (!address) {
      setPaymentError("Please provide a shipping address.");
      return;
    }

    setIsLoadingPayment(true);
    setPaymentError(null);

    try {
      // Step 1: Update cart with email and shipping address
      await cartApi.update(cart.id, {
        email: formData.email,
        shipping_address: address,
        // Promo codes are already applied via handleApplyPromo
      });

      // Step 2: Add shipping method if selected
      if (selectedShippingId) {
        await cartApi.addShippingMethod(cart.id, { option_id: selectedShippingId });
      }

      // Step 3: Create payment session (gift card is already on cart)
      const paymentResponse = await cartApi.createPaymentSession(cart.id, {
        email: formData.email,
        gift_card_code: cart.gift_card_code || undefined,
      });

      setPaymentSession(paymentResponse.payment_session);

      // Refresh cart to get updated totals
      await refreshCart();

      // Save new address if requested
      await saveNewAddressIfNeeded();
    } catch (err) {
      console.error("Payment initialization error:", err);
      if (err instanceof ApiError) {
        setPaymentError(err.message);
      } else {
        setPaymentError("Failed to initialize payment. Please try again.");
      }
    } finally {
      setIsLoadingPayment(false);
    }
  }, [cart, formData, selectedShippingId, promoApplied, refreshCart, getSelectedAddress]);

  const handleContinue = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === "information") {
      setCurrentStep("shipping");
    } else if (currentStep === "shipping") {
      setCurrentStep("payment");
      await initializePayment();
    }
  };

  const handleBack = () => {
    if (currentStep === "shipping") {
      setCurrentStep("information");
    } else if (currentStep === "payment") {
      setCurrentStep("shipping");
      setPaymentSession(null);
      setPaymentError(null);
    }
  };

  const handleApplyPromo = async () => {
    if (!cart || !promoCode.trim()) return;

    setApplyingPromo(true);
    setPromoError(null);

    try {
      // Call backend to apply promo code
      await cartApi.update(cart.id, {
        promo_codes: [promoCode.trim().toUpperCase()],
      });

      // Refresh cart to get updated discount
      await refreshCart();
      setPromoApplied(true);
    } catch (err) {
      console.error("Failed to apply promo code:", err);
      if (err instanceof ApiError) {
        setPromoError(err.message);
      } else {
        setPromoError("Invalid promo code");
      }
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleApplyGiftCard = async () => {
    if (!cart || !giftCardCode.trim()) return;

    setApplyingGiftCard(true);
    setGiftCardError(null);

    try {
      const code = giftCardCode.trim().toUpperCase();

      // Basic format validation (XXXX-XXXX-XXXX-XXXX)
      const formatted = code.replace(/-/g, "");
      if (formatted.length !== 16) {
        throw new Error("Gift card code must be 16 characters (XXXX-XXXX-XXXX-XXXX)");
      }

      // Format the code nicely
      const formattedCode = formatted.replace(/(.{4})(?=.)/g, "$1-");

      // Apply gift card via cart update API (like promo codes)
      await cartApi.update(cart.id, {
        gift_card_code: formattedCode,
      });

      // Refresh cart to get updated totals with gift card applied
      await refreshCart();

      // Clear the input field (code is now stored on cart)
      setGiftCardCode("");

    } catch (err) {
      console.error("Failed to apply gift card:", err);
      if (err instanceof ApiError) {
        setGiftCardError(err.message);
      } else if (err instanceof Error) {
        setGiftCardError(err.message);
      } else {
        setGiftCardError("Invalid gift card code");
      }
    } finally {
      setApplyingGiftCard(false);
    }
  };

  const handleRemoveGiftCard = async () => {
    if (!cart) return;

    setApplyingGiftCard(true);
    try {
      // Remove gift card by sending empty string
      await cartApi.update(cart.id, {
        gift_card_code: "",
      });
      await refreshCart();
      setGiftCardError(null);
    } catch (err) {
      console.error("Failed to remove gift card:", err);
    } finally {
      setApplyingGiftCard(false);
    }
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    setShowAddressForm(false);
  };

  const handleAddNewAddress = () => {
    setSelectedAddressId(null);
    setShowAddressForm(true);
  };

  // Handle successful Stripe payment
  const handleStripeSuccess = async (paymentIntentId: string) => {
    if (!cart) return;

    setIsProcessing(true);

    try {
      const response = await cartApi.confirmPayment(cart.id, paymentIntentId);
      const order = response.order;

      const address = getSelectedAddress();
      const generatedOrderNumber = `VRN-${order.display_id || order.id.slice(0, 8)}`;

      sessionStorage.setItem(
        "vernont-order",
        JSON.stringify({
          orderNumber: generatedOrderNumber,
          items: items.map((item) => ({
            title: item.title,
            variant_title: item.variant_title,
            quantity: item.quantity,
            unit_price: item.unit_price,
            thumbnail: item.thumbnail,
          })),
          subtotal: subtotal,
          deliveryPrice: shippingPriceMinor,
          giftWrap: giftWrapPriceMinor,
          discount: discountMinor,
          total: order.total,
          shipping: address,
          email: formData.email,
          currency: order.currency_code?.toUpperCase() || currency,
        })
      );

      // Show success celebration - user navigates manually
      setOrderNumber(generatedOrderNumber);
      setPaymentSuccess(true);
      setIsProcessing(false);
      clearCart();
    } catch (err) {
      console.error("Order confirmation error:", err);
      setPaymentError("Payment successful but order creation failed. Please contact support.");
      setIsProcessing(false);
    }
  };

  // Format address for display
  const formatAddress = (addr: CustomerAddress) => {
    const parts = [
      addr.address_1,
      addr.address_2,
      addr.city,
      addr.postal_code,
      addr.country_code,
    ].filter(Boolean);
    return parts.join(", ");
  };

  // Show loading if cart or auth is loading
  if ((cartLoading && items.length === 0) || authLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </PageLayout>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <PageLayout>
      {/* Payment Success Celebration Overlay */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex items-center justify-center"
          >
            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{
                    x: `${Math.random() * 100}vw`,
                    y: -20,
                    rotate: 0,
                    opacity: 1,
                  }}
                  animate={{
                    y: "110vh",
                    rotate: Math.random() * 720 - 360,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 1,
                    ease: "linear",
                  }}
                  style={{
                    width: 8 + Math.random() * 8,
                    height: 8 + Math.random() * 8,
                    backgroundColor: ["#D4AF37", "#B76E79", "#F7E7CE", "#1A1A1A"][
                      Math.floor(Math.random() * 4)
                    ],
                    transform: Math.random() > 0.5 ? "rotate(45deg)" : "none",
                    borderRadius: Math.random() > 0.7 ? "50%" : "0",
                  }}
                />
              ))}
            </div>

            {/* Success Content */}
            <div className="text-center relative z-10">
              {/* Animated Check */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative inline-block mb-8"
              >
                {/* Outer diamond frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -inset-6 border-2 border-gold/40 rotate-45"
                />

                {/* Main circle */}
                <div className="w-28 h-28 bg-gold flex items-center justify-center relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <Check className="h-14 w-14 text-primary" strokeWidth={3} />
                  </motion.div>
                </div>

                {/* Corner decorations */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-gold" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-gold" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-gold" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-gold" />

                {/* Sparkle burst */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [1, 0.8, 0],
                      x: Math.cos((i * 45 * Math.PI) / 180) * 100,
                      y: Math.sin((i * 45 * Math.PI) / 180) * 100,
                    }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <Sparkles className="h-5 w-5 text-gold" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="h-px w-12 bg-gold/60" />
                  <span className="text-gold text-xs">&#9670;&#9670;&#9670;</span>
                  <span className="h-px w-12 bg-gold/60" />
                </div>

                <h2 className="font-display text-4xl md:text-5xl tracking-[0.1em] mb-4">
                  Payment Successful
                </h2>
                <p className="font-serif text-muted-foreground text-lg mb-6">
                  Your order has been placed successfully
                </p>

                {orderNumber && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gold/10 border border-gold/30"
                  >
                    <span className="font-display text-sm tracking-[0.2em] uppercase text-gold">
                      Order
                    </span>
                    <span className="font-display text-xl tracking-wider">
                      {orderNumber}
                    </span>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-10"
                >
                  <Link
                    href="/checkout/confirmation"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-primary font-display text-sm tracking-[0.15em] uppercase hover:bg-gold/90 transition-colors"
                  >
                    View Order Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-secondary/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/">
              <h1 className="font-display text-2xl tracking-[0.3em] uppercase mb-4">
                Vernont
              </h1>
            </Link>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (index < currentStepIndex) {
                        setCurrentStep(step.id);
                      }
                    }}
                    disabled={index > currentStepIndex}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-serif transition-colors ${
                      index <= currentStepIndex
                        ? "text-gold"
                        : "text-muted-foreground"
                    } ${index < currentStepIndex ? "cursor-pointer hover:underline" : ""}`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                          index === currentStepIndex
                            ? "border-gold text-gold"
                            : "border-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                    {step.label}
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
            {/* Main Form */}
            <div className="lg:col-span-7">
              <div className="bg-background p-6 md:p-8 shadow-sm">
                <AnimatePresence mode="wait">
                  {/* Information Step */}
                  {currentStep === "information" && (
                    <motion.div
                      key="information"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <h2 className="font-display text-xl tracking-wide mb-6">
                        Contact Information
                      </h2>

                      <div className="space-y-4 mb-8">
                        <div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email address"
                            className={`w-full px-4 py-3 border font-serif text-sm focus:outline-none focus:border-gold transition-colors ${
                              errors.email ? "border-red-500" : "border-border"
                            }`}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1 font-serif">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <label className="flex items-center gap-2 font-serif text-sm">
                          <input
                            type="checkbox"
                            name="saveInfo"
                            checked={formData.saveInfo}
                            onChange={handleInputChange}
                            className="rounded border-border"
                          />
                          Email me with news and offers
                        </label>
                      </div>

                      <h2 className="font-display text-xl tracking-wide mb-6">
                        Shipping Address
                      </h2>

                      {/* Saved Addresses */}
                      {loadingAddresses ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-gold" />
                        </div>
                      ) : (
                        <>
                          {savedAddresses.length > 0 && (
                            <div className="space-y-3 mb-6">
                              {savedAddresses.map((addr) => (
                                <label
                                  key={addr.id}
                                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                                    selectedAddressId === addr.id
                                      ? "border-gold bg-gold/5"
                                      : "border-border hover:border-gold/50"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="selectedAddress"
                                    checked={selectedAddressId === addr.id}
                                    onChange={() => handleSelectAddress(addr.id)}
                                    className="mt-1 text-gold focus:ring-gold"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-gold" />
                                      <p className="font-display text-sm">
                                        {addr.first_name} {addr.last_name}
                                      </p>
                                    </div>
                                    <p className="font-serif text-xs text-muted-foreground mt-1">
                                      {formatAddress(addr)}
                                    </p>
                                    {addr.phone && (
                                      <p className="font-serif text-xs text-muted-foreground">
                                        {addr.phone}
                                      </p>
                                    )}
                                  </div>
                                </label>
                              ))}

                              {/* Add new address option */}
                              <button
                                onClick={handleAddNewAddress}
                                className={`w-full flex items-center gap-3 p-4 border transition-colors ${
                                  showAddressForm && !selectedAddressId
                                    ? "border-gold bg-gold/5"
                                    : "border-border hover:border-gold/50"
                                }`}
                              >
                                <Plus className="h-4 w-4 text-gold" />
                                <span className="font-serif text-sm">Add new address</span>
                              </button>
                            </div>
                          )}

                          {/* Address Form */}
                          {(showAddressForm || savedAddresses.length === 0) && (
                            <div className="space-y-4">
                              <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-border font-serif text-sm focus:outline-none focus:border-gold"
                              >
                                {countries.map((country) => (
                                  <option key={country.code} value={country.code}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="First name"
                                    className={`w-full px-4 py-3 border font-serif text-sm focus:outline-none focus:border-gold ${
                                      errors.firstName ? "border-red-500" : "border-border"
                                    }`}
                                  />
                                  {errors.firstName && (
                                    <p className="text-red-500 text-xs mt-1 font-serif">
                                      {errors.firstName}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Last name"
                                    className={`w-full px-4 py-3 border font-serif text-sm focus:outline-none focus:border-gold ${
                                      errors.lastName ? "border-red-500" : "border-border"
                                    }`}
                                  />
                                  {errors.lastName && (
                                    <p className="text-red-500 text-xs mt-1 font-serif">
                                      {errors.lastName}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <input
                                  type="text"
                                  name="address"
                                  value={formData.address}
                                  onChange={handleInputChange}
                                  placeholder="Address"
                                  className={`w-full px-4 py-3 border font-serif text-sm focus:outline-none focus:border-gold ${
                                    errors.address ? "border-red-500" : "border-border"
                                  }`}
                                />
                                {errors.address && (
                                  <p className="text-red-500 text-xs mt-1 font-serif">
                                    {errors.address}
                                  </p>
                                )}
                              </div>

                              <input
                                type="text"
                                name="apartment"
                                value={formData.apartment}
                                onChange={handleInputChange}
                                placeholder="Apartment, suite, etc. (optional)"
                                className="w-full px-4 py-3 border border-border font-serif text-sm focus:outline-none focus:border-gold"
                              />

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="City"
                                    className={`w-full px-4 py-3 border font-serif text-sm focus:outline-none focus:border-gold ${
                                      errors.city ? "border-red-500" : "border-border"
                                    }`}
                                  />
                                  {errors.city && (
                                    <p className="text-red-500 text-xs mt-1 font-serif">
                                      {errors.city}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    name="postcode"
                                    value={formData.postcode}
                                    onChange={handleInputChange}
                                    placeholder="Postcode"
                                    className={`w-full px-4 py-3 border font-serif text-sm focus:outline-none focus:border-gold ${
                                      errors.postcode ? "border-red-500" : "border-border"
                                    }`}
                                  />
                                  {errors.postcode && (
                                    <p className="text-red-500 text-xs mt-1 font-serif">
                                      {errors.postcode}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <input
                                  type="tel"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  placeholder="Phone number"
                                  className={`w-full px-4 py-3 border font-serif text-sm focus:outline-none focus:border-gold ${
                                    errors.phone ? "border-red-500" : "border-border"
                                  }`}
                                />
                                {errors.phone && (
                                  <p className="text-red-500 text-xs mt-1 font-serif">
                                    {errors.phone}
                                  </p>
                                )}
                              </div>

                              {isAuthenticated && (
                                <label className="flex items-center gap-2 font-serif text-sm">
                                  <input
                                    type="checkbox"
                                    name="saveAddress"
                                    checked={formData.saveAddress}
                                    onChange={handleInputChange}
                                    className="rounded border-border text-gold focus:ring-gold"
                                  />
                                  Save this address for future orders
                                </label>
                              )}
                            </div>
                          )}
                        </>
                      )}

                      <div className="flex items-center justify-between mt-8">
                        <Link
                          href="/"
                          className="flex items-center gap-2 font-serif text-sm text-muted-foreground hover:text-gold transition-colors"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Return to shop
                        </Link>
                        <Button
                          onClick={handleContinue}
                          className="btn-luxury bg-gold text-primary hover:bg-gold/90"
                        >
                          Continue to Shipping
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Shipping Step */}
                  {currentStep === "shipping" && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="p-4 bg-secondary/50 mb-6 space-y-2">
                        <div className="flex justify-between font-serif text-sm">
                          <span className="text-muted-foreground">Contact</span>
                          <span>{formData.email}</span>
                        </div>
                        <div className="flex justify-between font-serif text-sm">
                          <span className="text-muted-foreground">Ship to</span>
                          <span>
                            {selectedAddressId
                              ? formatAddress(savedAddresses.find((a) => a.id === selectedAddressId)!)
                              : `${formData.address}, ${formData.city}, ${formData.postcode}`}
                          </span>
                        </div>
                      </div>

                      <h2 className="font-display text-xl tracking-wide mb-6">
                        Delivery Method
                      </h2>

                      {loadingShipping ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-gold" />
                        </div>
                      ) : shippingOptions.length === 0 ? (
                        <div className="p-4 bg-secondary/50 text-center">
                          <p className="font-serif text-sm text-muted-foreground">
                            No shipping options available for your region.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {shippingOptions.map((option) => (
                            <label
                              key={option.id}
                              className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                                selectedShippingId === option.id
                                  ? "border-gold bg-gold/5"
                                  : "border-border hover:border-gold/50"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <input
                                  type="radio"
                                  name="shippingOption"
                                  value={option.id}
                                  checked={selectedShippingId === option.id}
                                  onChange={() => setSelectedShippingId(option.id)}
                                  className="text-gold focus:ring-gold"
                                />
                                <div>
                                  <p className="font-display text-sm">{option.name}</p>
                                  {option.data?.description && (
                                    <p className="font-serif text-xs text-muted-foreground">
                                      {String(option.data.description)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="font-display text-sm">
                                {option.amount === 0 ? (
                                  <span className="text-gold">FREE</span>
                                ) : (
                                  formatPrice(option.amount, currency)
                                )}
                              </span>
                            </label>
                          ))}
                          {errors.shipping && (
                            <p className="text-red-500 text-xs font-serif">{errors.shipping}</p>
                          )}
                        </div>
                      )}

                      <div className="mt-6">
                        <label
                          className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                            giftWrap
                              ? "border-gold bg-gold/5"
                              : "border-border hover:border-gold/50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={giftWrap}
                              onChange={(e) => setGiftWrap(e.target.checked)}
                              className="text-gold focus:ring-gold"
                            />
                            <div className="flex items-center gap-2">
                              <Gift className="h-4 w-4 text-gold" />
                              <div>
                                <p className="font-display text-sm">Gift Wrapping</p>
                                <p className="font-serif text-xs text-muted-foreground">
                                  Luxury packaging with handwritten note
                                </p>
                              </div>
                            </div>
                          </div>
                          <span className="font-display text-sm">
                            {formatPrice(500, currency)}
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center justify-between mt-8">
                        <button
                          onClick={handleBack}
                          className="flex items-center gap-2 font-serif text-sm text-muted-foreground hover:text-gold transition-colors"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Return to information
                        </button>
                        <Button
                          onClick={handleContinue}
                          disabled={!selectedShippingId && shippingOptions.length > 0}
                          className="btn-luxury bg-gold text-primary hover:bg-gold/90"
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Payment Step */}
                  {currentStep === "payment" && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="p-4 bg-secondary/50 mb-6 space-y-2">
                        <div className="flex justify-between font-serif text-sm">
                          <span className="text-muted-foreground">Contact</span>
                          <span>{formData.email}</span>
                        </div>
                        <div className="flex justify-between font-serif text-sm">
                          <span className="text-muted-foreground">Ship to</span>
                          <span>
                            {selectedAddressId
                              ? formatAddress(savedAddresses.find((a) => a.id === selectedAddressId)!)
                              : `${formData.address}, ${formData.city}`}
                          </span>
                        </div>
                        <div className="flex justify-between font-serif text-sm">
                          <span className="text-muted-foreground">Method</span>
                          <span>{selectedShipping?.name || "Standard"}</span>
                        </div>
                      </div>

                      <h2 className="font-display text-xl tracking-wide mb-6 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment
                      </h2>

                      {paymentError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3"
                        >
                          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-red-700 font-serif">{paymentError}</p>
                            <button
                              onClick={initializePayment}
                              className="text-sm text-red-600 underline mt-2 font-serif"
                            >
                              Try again
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {isLoadingPayment && (
                        <div className="flex flex-col items-center justify-center py-12">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full mb-4"
                          />
                          <p className="font-serif text-sm text-muted-foreground">
                            Preparing secure payment...
                          </p>
                        </div>
                      )}

                      {paymentSession && !isLoadingPayment && !paymentError && (
                        <StripePaymentForm
                          clientSecret={paymentSession.client_secret}
                          publishableKey={paymentSession.publishable_key}
                          total={totalMinor / 100}
                          currency={currency}
                          onSuccess={handleStripeSuccess}
                          onBack={handleBack}
                        />
                      )}

                      {paymentError && !isLoadingPayment && (
                        <div className="flex items-center justify-between mt-8">
                          <button
                            onClick={handleBack}
                            className="flex items-center gap-2 font-serif text-sm text-muted-foreground hover:text-gold transition-colors"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Return to shipping
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-background p-6 shadow-sm sticky top-24">
                <h3 className="font-display text-lg tracking-wide mb-6 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 bg-secondary flex-shrink-0">
                        {item.thumbnail && (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-primary text-xs rounded-full flex items-center justify-center font-semibold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm truncate">{item.title}</p>
                        {item.variant_title && (
                          <p className="font-serif text-xs text-muted-foreground">
                            {item.variant_title}
                          </p>
                        )}
                      </div>
                      <p className="font-display text-sm">
                        {formatPrice(item.unit_price * item.quantity, currency)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Discount code"
                      disabled={promoApplied}
                      className="w-full pl-10 pr-4 py-3 border border-border font-serif text-sm focus:outline-none focus:border-gold disabled:bg-secondary"
                    />
                  </div>
                  <Button
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !promoCode || applyingPromo}
                    variant="outline"
                    className="border-border"
                  >
                    {applyingPromo ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : promoApplied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>

                {promoError && (
                  <p className="text-sm text-red-500 font-serif mb-2">
                    {promoError}
                  </p>
                )}

                {promoApplied && (
                  <p className="text-sm text-gold font-serif mb-4 flex items-center gap-2">
                    <Check className="h-3 w-3" />
                    Code {promoCode.toUpperCase()} applied!
                  </p>
                )}

                {/* Gift Card Input */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={giftCardApplied ? (cart?.gift_card_code || "") : giftCardCode}
                        onChange={(e) => {
                          // Format as XXXX-XXXX-XXXX-XXXX
                          const raw = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
                          const formatted = raw.replace(/(.{4})(?=.)/g, "$1-").slice(0, 19);
                          setGiftCardCode(formatted);
                        }}
                        placeholder="Gift card code"
                        disabled={giftCardApplied || applyingGiftCard}
                        maxLength={19}
                        className="w-full pl-10 pr-4 py-3 border border-border font-serif text-sm focus:outline-none focus:border-gold disabled:bg-secondary uppercase"
                      />
                    </div>
                    {giftCardApplied ? (
                      <Button
                        onClick={handleRemoveGiftCard}
                        disabled={applyingGiftCard}
                        variant="outline"
                        className="border-border text-red-500 hover:text-red-600"
                      >
                        {applyingGiftCard ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleApplyGiftCard}
                        disabled={!giftCardCode || giftCardCode.length < 19 || applyingGiftCard}
                        variant="outline"
                        className="border-border"
                      >
                        {applyingGiftCard ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                      </Button>
                    )}
                  </div>
                  {giftCardError && (
                    <p className="text-sm text-red-500 font-serif mt-2">
                      {giftCardError}
                    </p>
                  )}
                  {giftCardApplied && !giftCardError && (
                    <p className="text-sm text-gold font-serif mt-2 flex items-center gap-2">
                      <Check className="h-3 w-3" />
                      Gift card applied: -{formatPrice(giftCardAmount, currency)}
                    </p>
                  )}
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between font-serif text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal, currency)}</span>
                  </div>

                  {discountMinor > 0 && (
                    <div className="flex justify-between font-serif text-sm text-gold">
                      <span>Discount{promoApplied ? ` (${promoCode.toUpperCase()})` : ""}</span>
                      <span>-{formatPrice(discountMinor, currency)}</span>
                    </div>
                  )}

                  {giftCardAmount > 0 && (
                    <div className="flex justify-between font-serif text-sm text-gold">
                      <span className="flex items-center gap-1">
                        <Gift className="h-3 w-3" />
                        Gift Card
                      </span>
                      <span>-{formatPrice(giftCardAmount, currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-serif text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shippingPriceMinor === 0 ? (
                        <span className="text-gold">FREE</span>
                      ) : (
                        formatPrice(shippingPriceMinor, currency)
                      )}
                    </span>
                  </div>

                  {giftWrap && (
                    <div className="flex justify-between font-serif text-sm">
                      <span className="text-muted-foreground">Gift Wrap</span>
                      <span>{formatPrice(giftWrapPriceMinor, currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-display text-lg">Total</span>
                    <span className="font-display text-lg">
                      {formatPrice(totalMinor, currency)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span className="font-serif">Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Truck className="h-3 w-3" />
                    <span className="font-serif">Free UK Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
