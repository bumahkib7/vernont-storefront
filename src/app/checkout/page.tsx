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
  Shield,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, formatPrice } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useStoreBranding } from "@/context/StoreConfigContext";
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

const TRUST_FEATURES = [
  { icon: Check, label: "100% Authentic" },
  { icon: Shield, label: "Secure checkout" },
  { icon: Truck, label: "Free shipping £75+" },
  { icon: RotateCcw, label: "30-day returns" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, items, subtotal, currency, clearCart, refreshCart, loading: cartLoading } = useCart();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { storeName } = useStoreBranding();
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

        const email = user?.email || response.customer.email;
        if (email) {
          setFormData((prev) => ({ ...prev, email }));
        }

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

        if (response.shipping_options.length > 0 && !selectedShippingId) {
          setSelectedShippingId(response.shipping_options[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch shipping options:", err);
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

  const selectedShipping = shippingOptions.find((opt) => opt.id === selectedShippingId);

  const shippingPriceMinor = selectedShipping?.amount ?? 0;
  const giftWrapPriceMinor = giftWrap ? 500 : 0;
  const discountMinor = cart?.discount_total ?? 0;
  const giftCardAmount = cart?.gift_card_total ?? 0;
  const giftCardApplied = !!cart?.gift_card_code;
  const totalMinor = subtotal + shippingPriceMinor + giftWrapPriceMinor - discountMinor - giftCardAmount;

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
      await cartApi.update(cart.id, {
        email: formData.email,
        shipping_address: address,
      });

      if (selectedShippingId) {
        await cartApi.addShippingMethod(cart.id, { option_id: selectedShippingId });
      }

      const paymentResponse = await cartApi.createPaymentSession(cart.id, {
        email: formData.email,
        gift_card_code: cart.gift_card_code || undefined,
      });

      setPaymentSession(paymentResponse.payment_session);
      await refreshCart();
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
  }, [cart, formData, selectedShippingId, refreshCart, getSelectedAddress]);

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
      await cartApi.update(cart.id, {
        promo_codes: [promoCode.trim().toUpperCase()],
      });

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
      const formatted = code.replace(/-/g, "");
      if (formatted.length !== 16) {
        throw new Error("Gift card code must be 16 characters (XXXX-XXXX-XXXX-XXXX)");
      }

      const formattedCode = formatted.replace(/(.{4})(?=.)/g, "$1-");

      await cartApi.update(cart.id, {
        gift_card_code: formattedCode,
      });

      await refreshCart();
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

      setOrderNumber(generatedOrderNumber);
      setIsProcessing(false);
      setPaymentSuccess(true); // Prevent early return while redirecting

      // Note: Server clears cart session cookie in confirm-payment response
      // Redirect to confirmation page with order ID
      window.location.href = `/checkout/confirmation?order_id=${order.id}`;
    } catch (err) {
      console.error("Order confirmation error:", err);
      setPaymentError("Payment successful but order creation failed. Please contact support.");
      setIsProcessing(false);
    }
  };

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

  if ((cartLoading && items.length === 0) || authLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (items.length === 0 && !paymentSuccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Success Overlay */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--background)] flex items-center justify-center"
          >
            <div className="text-center p-8 max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-[var(--success)] rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="h-10 w-10 text-white" strokeWidth={3} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                <p className="text-[var(--muted-foreground)] mb-6">
                  Thank you for your order. We&apos;ll send you a confirmation email shortly.
                </p>

                {orderNumber && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] rounded-lg border border-[var(--border)] mb-6">
                    <span className="text-sm text-[var(--muted-foreground)]">Order:</span>
                    <span className="font-semibold">{orderNumber}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <Link
                    href="/checkout/confirmation"
                    className="block w-full btn-primary btn-lg"
                  >
                    View Order Details
                  </Link>
                  <Link
                    href="/fragrances"
                    className="block w-full btn-secondary"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              {storeName || "Vernont"}
            </Link>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Lock className="h-4 w-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (index < currentStepIndex) {
                      setCurrentStep(step.id);
                    }
                  }}
                  disabled={index > currentStepIndex}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    index <= currentStepIndex
                      ? "text-[var(--primary)] font-medium"
                      : "text-[var(--muted-foreground)]"
                  } ${index < currentStepIndex ? "cursor-pointer hover:bg-[var(--surface)]" : ""}`}
                >
                  {index < currentStepIndex ? (
                    <span className="w-5 h-5 rounded-full bg-[var(--success)] flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                  ) : (
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                        index === currentStepIndex
                          ? "border-[var(--primary)] text-[var(--primary)]"
                          : "border-[var(--border)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <div className="bg-[var(--background)] rounded-lg border border-[var(--border)] p-6">
              <AnimatePresence mode="wait">
                {/* Information Step */}
                {currentStep === "information" && (
                  <motion.div
                    key="information"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="text-lg font-semibold mb-6">Contact Information</h2>

                    <div className="space-y-4 mb-8">
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email address"
                          className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all ${
                            errors.email ? "border-[var(--destructive)]" : "border-[var(--border)]"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-[var(--destructive)] text-xs mt-1">{errors.email}</p>
                        )}
                      </div>

                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name="saveInfo"
                          checked={formData.saveInfo}
                          onChange={handleInputChange}
                          className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        Email me with news and offers
                      </label>
                    </div>

                    <h2 className="text-lg font-semibold mb-6">Shipping Address</h2>

                    {loadingAddresses ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
                      </div>
                    ) : (
                      <>
                        {savedAddresses.length > 0 && (
                          <div className="space-y-3 mb-6">
                            {savedAddresses.map((addr) => (
                              <label
                                key={addr.id}
                                className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                                  selectedAddressId === addr.id
                                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="selectedAddress"
                                  checked={selectedAddressId === addr.id}
                                  onChange={() => handleSelectAddress(addr.id)}
                                  className="mt-1 text-[var(--primary)] focus:ring-[var(--primary)]"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[var(--primary)]" />
                                    <p className="font-medium text-sm">
                                      {addr.first_name} {addr.last_name}
                                    </p>
                                  </div>
                                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                    {formatAddress(addr)}
                                  </p>
                                  {addr.phone && (
                                    <p className="text-xs text-[var(--muted-foreground)]">
                                      {addr.phone}
                                    </p>
                                  )}
                                </div>
                              </label>
                            ))}

                            <button
                              onClick={handleAddNewAddress}
                              className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-all ${
                                showAddressForm && !selectedAddressId
                                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                                  : "border-[var(--border)] hover:border-[var(--primary)]/50"
                              }`}
                            >
                              <Plus className="h-4 w-4 text-[var(--primary)]" />
                              <span className="text-sm">Add new address</span>
                            </button>
                          </div>
                        )}

                        {(showAddressForm || savedAddresses.length === 0) && (
                          <div className="space-y-4">
                            <select
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                                  className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
                                    errors.firstName ? "border-[var(--destructive)]" : "border-[var(--border)]"
                                  }`}
                                />
                                {errors.firstName && (
                                  <p className="text-[var(--destructive)] text-xs mt-1">{errors.firstName}</p>
                                )}
                              </div>
                              <div>
                                <input
                                  type="text"
                                  name="lastName"
                                  value={formData.lastName}
                                  onChange={handleInputChange}
                                  placeholder="Last name"
                                  className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
                                    errors.lastName ? "border-[var(--destructive)]" : "border-[var(--border)]"
                                  }`}
                                />
                                {errors.lastName && (
                                  <p className="text-[var(--destructive)] text-xs mt-1">{errors.lastName}</p>
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
                                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
                                  errors.address ? "border-[var(--destructive)]" : "border-[var(--border)]"
                                }`}
                              />
                              {errors.address && (
                                <p className="text-[var(--destructive)] text-xs mt-1">{errors.address}</p>
                              )}
                            </div>

                            <input
                              type="text"
                              name="apartment"
                              value={formData.apartment}
                              onChange={handleInputChange}
                              placeholder="Apartment, suite, etc. (optional)"
                              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <input
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  placeholder="City"
                                  className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
                                    errors.city ? "border-[var(--destructive)]" : "border-[var(--border)]"
                                  }`}
                                />
                                {errors.city && (
                                  <p className="text-[var(--destructive)] text-xs mt-1">{errors.city}</p>
                                )}
                              </div>
                              <div>
                                <input
                                  type="text"
                                  name="postcode"
                                  value={formData.postcode}
                                  onChange={handleInputChange}
                                  placeholder="Postcode"
                                  className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
                                    errors.postcode ? "border-[var(--destructive)]" : "border-[var(--border)]"
                                  }`}
                                />
                                {errors.postcode && (
                                  <p className="text-[var(--destructive)] text-xs mt-1">{errors.postcode}</p>
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
                                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
                                  errors.phone ? "border-[var(--destructive)]" : "border-[var(--border)]"
                                }`}
                              />
                              {errors.phone && (
                                <p className="text-[var(--destructive)] text-xs mt-1">{errors.phone}</p>
                              )}
                            </div>

                            {isAuthenticated && (
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  name="saveAddress"
                                  checked={formData.saveAddress}
                                  onChange={handleInputChange}
                                  className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                                />
                                Save this address for future orders
                              </label>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Return to shop
                      </Link>
                      <button onClick={handleContinue} className="btn-primary">
                        Continue to Shipping
                      </button>
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
                    <div className="p-4 bg-[var(--surface)] rounded-lg mb-6 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Contact</span>
                        <span>{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Ship to</span>
                        <span className="text-right">
                          {selectedAddressId
                            ? formatAddress(savedAddresses.find((a) => a.id === selectedAddressId)!)
                            : `${formData.address}, ${formData.city}, ${formData.postcode}`}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-lg font-semibold mb-6">Delivery Method</h2>

                    {loadingShipping ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
                      </div>
                    ) : shippingOptions.length === 0 ? (
                      <div className="p-4 bg-[var(--surface)] rounded-lg text-center">
                        <p className="text-sm text-[var(--muted-foreground)]">
                          No shipping options available for your region.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {shippingOptions.map((option) => (
                          <label
                            key={option.id}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedShippingId === option.id
                                ? "border-[var(--primary)] bg-[var(--primary)]/5"
                                : "border-[var(--border)] hover:border-[var(--primary)]/50"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="radio"
                                name="shippingOption"
                                value={option.id}
                                checked={selectedShippingId === option.id}
                                onChange={() => setSelectedShippingId(option.id)}
                                className="text-[var(--primary)] focus:ring-[var(--primary)]"
                              />
                              <div>
                                <p className="font-medium text-sm">{option.name}</p>
                                {option.data?.description && (
                                  <p className="text-xs text-[var(--muted-foreground)]">
                                    {String(option.data.description)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="font-semibold text-sm">
                              {option.amount === 0 ? (
                                <span className="text-[var(--success)]">FREE</span>
                              ) : (
                                formatPrice(option.amount, currency)
                              )}
                            </span>
                          </label>
                        ))}
                        {errors.shipping && (
                          <p className="text-[var(--destructive)] text-xs">{errors.shipping}</p>
                        )}
                      </div>
                    )}

                    <div className="mt-6">
                      <label
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          giftWrap
                            ? "border-[var(--primary)] bg-[var(--primary)]/5"
                            : "border-[var(--border)] hover:border-[var(--primary)]/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={giftWrap}
                            onChange={(e) => setGiftWrap(e.target.checked)}
                            className="text-[var(--primary)] focus:ring-[var(--primary)]"
                          />
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-[var(--accent)]" />
                            <div>
                              <p className="font-medium text-sm">Gift Wrapping</p>
                              <p className="text-xs text-[var(--muted-foreground)]">
                                Premium packaging with handwritten note
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className="font-semibold text-sm">
                          {formatPrice(500, currency)}
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Return to information
                      </button>
                      <button
                        onClick={handleContinue}
                        disabled={!selectedShippingId && shippingOptions.length > 0}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Payment
                      </button>
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
                    <div className="p-4 bg-[var(--surface)] rounded-lg mb-6 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Contact</span>
                        <span>{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Ship to</span>
                        <span className="text-right">
                          {selectedAddressId
                            ? formatAddress(savedAddresses.find((a) => a.id === selectedAddressId)!)
                            : `${formData.address}, ${formData.city}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Method</span>
                        <span>{selectedShipping?.name || "Standard"}</span>
                      </div>
                    </div>

                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment
                    </h2>

                    {paymentError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg flex items-start gap-3"
                      >
                        <AlertCircle className="h-5 w-5 text-[var(--destructive)] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-[var(--destructive)]">{paymentError}</p>
                          <button
                            onClick={initializePayment}
                            className="text-sm text-[var(--destructive)] underline mt-2"
                          >
                            Try again
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {isLoadingPayment && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mb-4" />
                        <p className="text-sm text-[var(--muted-foreground)]">
                          Preparing secure payment...
                        </p>
                      </div>
                    )}

                    {paymentSession && !isLoadingPayment && !paymentError && (
                      <StripePaymentForm
                        clientSecret={paymentSession.client_secret}
                        publishableKey={paymentSession.publishable_key}
                        total={totalMinor}
                        currency={currency}
                        onSuccess={handleStripeSuccess}
                        onBack={handleBack}
                      />
                    )}

                    {paymentError && !isLoadingPayment && (
                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
                        <button
                          onClick={handleBack}
                          className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
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
            <div className="bg-[var(--background)] rounded-lg border border-[var(--border)] p-6 sticky top-24">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order Summary ({items.length})
              </h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-[var(--surface)] rounded-lg flex-shrink-0 overflow-hidden">
                      {item.thumbnail && (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--primary)] text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight">{item.title}</p>
                      {item.variant_title && (
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-[var(--surface)] text-[var(--foreground)] text-xs font-medium rounded border border-[var(--border)]">
                          {item.variant_title}
                        </span>
                      )}
                      <p className="text-xs text-[var(--muted-foreground)] mt-1 tabular-nums">
                        {formatPrice(item.unit_price, currency)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm tabular-nums">
                      {formatPrice(item.unit_price * item.quantity, currency)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Discount code"
                    disabled={promoApplied}
                    className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:bg-[var(--surface)]"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode || applyingPromo}
                  className="btn-secondary px-4 disabled:opacity-50"
                >
                  {applyingPromo ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : promoApplied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>

              {promoError && (
                <p className="text-sm text-[var(--destructive)] mb-2">{promoError}</p>
              )}

              {promoApplied && (
                <p className="text-sm text-[var(--success)] mb-4 flex items-center gap-2">
                  <Check className="h-3 w-3" />
                  Code {promoCode.toUpperCase()} applied!
                </p>
              )}

              {/* Gift Card */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                    <input
                      type="text"
                      value={giftCardApplied ? (cart?.gift_card_code || "") : giftCardCode}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
                        const formatted = raw.replace(/(.{4})(?=.)/g, "$1-").slice(0, 19);
                        setGiftCardCode(formatted);
                      }}
                      placeholder="Gift card code"
                      disabled={giftCardApplied || applyingGiftCard}
                      maxLength={19}
                      className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:bg-[var(--surface)] uppercase"
                    />
                  </div>
                  {giftCardApplied ? (
                    <button
                      onClick={handleRemoveGiftCard}
                      disabled={applyingGiftCard}
                      className="btn-secondary px-4 text-[var(--destructive)] disabled:opacity-50"
                    >
                      {applyingGiftCard ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyGiftCard}
                      disabled={!giftCardCode || giftCardCode.length < 19 || applyingGiftCard}
                      className="btn-secondary px-4 disabled:opacity-50"
                    >
                      {applyingGiftCard ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </button>
                  )}
                </div>
                {giftCardError && (
                  <p className="text-sm text-[var(--destructive)] mt-2">{giftCardError}</p>
                )}
                {giftCardApplied && !giftCardError && (
                  <p className="text-sm text-[var(--success)] mt-2 flex items-center gap-2">
                    <Check className="h-3 w-3" />
                    Gift card applied: -{formatPrice(giftCardAmount, currency)}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-[var(--border)] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Subtotal</span>
                  <span className="tabular-nums">{formatPrice(subtotal, currency)}</span>
                </div>

                {discountMinor > 0 && (
                  <div className="flex justify-between text-sm text-[var(--success)]">
                    <span>Discount{promoApplied ? ` (${promoCode.toUpperCase()})` : ""}</span>
                    <span className="tabular-nums">-{formatPrice(discountMinor, currency)}</span>
                  </div>
                )}

                {giftCardAmount > 0 && (
                  <div className="flex justify-between text-sm text-[var(--success)]">
                    <span className="flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      Gift Card
                    </span>
                    <span className="tabular-nums">-{formatPrice(giftCardAmount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Shipping</span>
                  <span className="tabular-nums">
                    {shippingPriceMinor === 0 ? (
                      <span className="text-[var(--success)]">FREE</span>
                    ) : (
                      formatPrice(shippingPriceMinor, currency)
                    )}
                  </span>
                </div>

                {giftWrap && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Gift Wrap</span>
                    <span className="tabular-nums">{formatPrice(giftWrapPriceMinor, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-[var(--border)]">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg tabular-nums">
                    {formatPrice(totalMinor, currency)}
                  </span>
                </div>
              </div>

              {/* Trust Features */}
              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <div className="grid grid-cols-2 gap-3">
                  {TRUST_FEATURES.map((feature) => (
                    <div key={feature.label} className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <feature.icon className="h-3.5 w-3.5 text-[var(--success)]" />
                      <span>{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
