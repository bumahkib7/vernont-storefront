"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useCart, formatPrice } from "@/context/CartContext";

type CheckoutStep = "information" | "shipping" | "payment";

const deliveryOptions = [
  {
    id: "standard",
    name: "Standard Delivery",
    description: "5-7 business days",
    price: 0,
    freeThreshold: 75,
  },
  {
    id: "express",
    name: "Express Delivery",
    description: "2-3 business days",
    price: 9.95,
  },
  {
    id: "next-day",
    name: "Next Day Delivery",
    description: "Order before 2pm",
    price: 14.95,
  },
];

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
  const { items, subtotal, currency, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);

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
    deliveryOption: "standard",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
    saveInfo: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  const steps: { id: CheckoutStep; label: string }[] = [
    { id: "information", label: "Information" },
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const selectedDelivery = deliveryOptions.find(
    (d) => d.id === formData.deliveryOption
  );

  const deliveryPrice =
    formData.deliveryOption === "standard" && subtotal >= 75
      ? 0
      : selectedDelivery?.price || 0;

  const giftWrapPrice = giftWrap ? 5 : 0;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryPrice + giftWrapPrice - discount;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const validateStep = (step: CheckoutStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === "information") {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Invalid email";
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.postcode) newErrors.postcode = "Postcode is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
    }

    if (step === "payment") {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length < 16)
        newErrors.cardNumber = "Valid card number is required";
      if (!formData.cardExpiry || formData.cardExpiry.length < 5)
        newErrors.cardExpiry = "Valid expiry is required";
      if (!formData.cardCvc || formData.cardCvc.length < 3)
        newErrors.cardCvc = "Valid CVC is required";
      if (!formData.cardName) newErrors.cardName = "Name on card is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === "information") {
      setCurrentStep("shipping");
    } else if (currentStep === "shipping") {
      setCurrentStep("payment");
    }
  };

  const handleBack = () => {
    if (currentStep === "shipping") {
      setCurrentStep("information");
    } else if (currentStep === "payment") {
      setCurrentStep("shipping");
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoApplied(true);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep("payment")) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate order number
    const orderNumber = `VRN-${Date.now().toString(36).toUpperCase()}`;

    // Store order data for confirmation page
    sessionStorage.setItem(
      "vernont-order",
      JSON.stringify({
        orderNumber,
        items,
        subtotal,
        deliveryPrice,
        giftWrap: giftWrapPrice,
        discount,
        total,
        shipping: formData,
        currency,
      })
    );

    // Clear cart
    clearCart();

    // Redirect to confirmation
    router.push("/checkout/confirmation");
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <PageLayout>
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
                      </div>

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
                      {/* Summary */}
                      <div className="p-4 bg-secondary/50 mb-6 space-y-2">
                        <div className="flex justify-between font-serif text-sm">
                          <span className="text-muted-foreground">Contact</span>
                          <span>{formData.email}</span>
                        </div>
                        <div className="flex justify-between font-serif text-sm">
                          <span className="text-muted-foreground">Ship to</span>
                          <span>
                            {formData.address}, {formData.city}, {formData.postcode}
                          </span>
                        </div>
                      </div>

                      <h2 className="font-display text-xl tracking-wide mb-6">
                        Delivery Method
                      </h2>

                      <div className="space-y-3">
                        {deliveryOptions.map((option) => {
                          const isFree =
                            option.id === "standard" && subtotal >= 75;
                          return (
                            <label
                              key={option.id}
                              className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                                formData.deliveryOption === option.id
                                  ? "border-gold bg-gold/5"
                                  : "border-border hover:border-gold/50"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <input
                                  type="radio"
                                  name="deliveryOption"
                                  value={option.id}
                                  checked={formData.deliveryOption === option.id}
                                  onChange={handleInputChange}
                                  className="text-gold focus:ring-gold"
                                />
                                <div>
                                  <p className="font-display text-sm">
                                    {option.name}
                                  </p>
                                  <p className="font-serif text-xs text-muted-foreground">
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                {isFree ? (
                                  <span className="font-display text-sm text-gold">
                                    FREE
                                  </span>
                                ) : option.price === 0 ? (
                                  <div>
                                    <span className="font-display text-sm">FREE</span>
                                    <p className="font-serif text-xs text-muted-foreground">
                                      Orders over {formatPrice(75, currency)}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="font-display text-sm">
                                    {formatPrice(option.price, currency)}
                                  </span>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>

                      {/* Gift Wrap Option */}
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
                                <p className="font-display text-sm">
                                  Gift Wrapping
                                </p>
                                <p className="font-serif text-xs text-muted-foreground">
                                  Luxury packaging with handwritten note
                                </p>
                              </div>
                            </div>
                          </div>
                          <span className="font-display text-sm">
                            {formatPrice(5, currency)}
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
                      {/* Summary */}
                      <div className="p-4 bg-secondary/50 mb-6 space-y-2">
                        <div className="flex justify-between font-serif text-sm">
                          <span className="text-muted-foreground">Contact</span>
                          <span>{formData.email}</span>
                        </div>
                        <div className="flex justify-between font-serif text-sm">
                          <span className="text-muted-foreground">Ship to</span>
                          <span>
                            {formData.address}, {formData.city}
                          </span>
                        </div>
                        <div className="flex justify-between font-serif text-sm">
                          <span className="text-muted-foreground">Method</span>
                          <span>{selectedDelivery?.name}</span>
                        </div>
                      </div>

                      <h2 className="font-display text-xl tracking-wide mb-6 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment
                      </h2>

                      <div className="p-4 bg-secondary/30 mb-6 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gold" />
                        <span className="font-serif text-sm text-muted-foreground">
                          All transactions are secure and encrypted
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value);
                              setFormData((prev) => ({
                                ...prev,
                                cardNumber: formatted,
                              }));
                              if (errors.cardNumber) {
                                setErrors((prev) => ({ ...prev, cardNumber: "" }));
                              }
                            }}
                            placeholder="Card number"
                            maxLength={19}
                            className={`w-full px-4 py-3 border font-serif text-sm focus:outline-none focus:border-gold ${
                              errors.cardNumber ? "border-red-500" : "border-border"
                            }`}
                          />
                          {errors.cardNumber && (
                            <p className="text-red-500 text-xs mt-1 font-serif">
                              {errors.cardNumber}
                            </p>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            placeholder="Name on card"
                            className={`w-full px-4 py-3 border font-serif text-sm focus:outline-none focus:border-gold ${
                              errors.cardName ? "border-red-500" : "border-border"
                            }`}
                          />
                          {errors.cardName && (
                            <p className="text-red-500 text-xs mt-1 font-serif">
                              {errors.cardName}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={(e) => {
                                const formatted = formatExpiry(
                                  e.target.value.replace("/", "")
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  cardExpiry: formatted,
                                }));
                                if (errors.cardExpiry) {
                                  setErrors((prev) => ({ ...prev, cardExpiry: "" }));
                                }
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                              className={`w-full px-4 py-3 border font-serif text-sm focus:outline-none focus:border-gold ${
                                errors.cardExpiry ? "border-red-500" : "border-border"
                              }`}
                            />
                            {errors.cardExpiry && (
                              <p className="text-red-500 text-xs mt-1 font-serif">
                                {errors.cardExpiry}
                              </p>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              name="cardCvc"
                              value={formData.cardCvc}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setFormData((prev) => ({
                                  ...prev,
                                  cardCvc: value,
                                }));
                                if (errors.cardCvc) {
                                  setErrors((prev) => ({ ...prev, cardCvc: "" }));
                                }
                              }}
                              placeholder="CVC"
                              maxLength={4}
                              className={`w-full px-4 py-3 border font-serif text-sm focus:outline-none focus:border-gold ${
                                errors.cardCvc ? "border-red-500" : "border-border"
                              }`}
                            />
                            {errors.cardCvc && (
                              <p className="text-red-500 text-xs mt-1 font-serif">
                                {errors.cardCvc}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-8">
                        <button
                          onClick={handleBack}
                          className="flex items-center gap-2 font-serif text-sm text-muted-foreground hover:text-gold transition-colors"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Return to shipping
                        </button>
                        <Button
                          onClick={handlePlaceOrder}
                          disabled={isProcessing}
                          className="btn-luxury bg-gold text-primary hover:bg-gold/90 min-w-[200px]"
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

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                      <div className="relative w-16 h-16 bg-secondary flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-primary text-xs rounded-full flex items-center justify-center font-semibold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm truncate">{item.name}</p>
                        <p className="font-serif text-xs text-muted-foreground">
                          {item.size}
                        </p>
                      </div>
                      <p className="font-display text-sm">
                        {formatPrice(item.price * item.quantity, currency)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
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
                    disabled={promoApplied || !promoCode}
                    variant="outline"
                    className="border-border"
                  >
                    {promoApplied ? <Check className="h-4 w-4" /> : "Apply"}
                  </Button>
                </div>

                {promoApplied && (
                  <p className="text-sm text-gold font-serif mb-4">
                    Code WELCOME10 applied - 10% off!
                  </p>
                )}

                {/* Totals */}
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between font-serif text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal, currency)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between font-serif text-sm text-gold">
                      <span>Discount (10%)</span>
                      <span>-{formatPrice(discount, currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-serif text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {deliveryPrice === 0 ? (
                        <span className="text-gold">FREE</span>
                      ) : (
                        formatPrice(deliveryPrice, currency)
                      )}
                    </span>
                  </div>

                  {giftWrap && (
                    <div className="flex justify-between font-serif text-sm">
                      <span className="text-muted-foreground">Gift Wrap</span>
                      <span>{formatPrice(giftWrapPrice, currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-display text-lg">Total</span>
                    <span className="font-display text-lg">
                      {formatPrice(total, currency)}
                    </span>
                  </div>
                </div>

                {/* Trust badges */}
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
