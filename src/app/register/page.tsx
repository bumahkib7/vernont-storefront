"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const { register, loginWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Password strength
  const passwordStrength = getPasswordStrength(formData.password);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, router, redirect]);

  // Load Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize Google button
  useEffect(() => {
    if (!googleLoaded || !GOOGLE_CLIENT_ID || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signup-button"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "signup_with",
        shape: "rectangular",
      }
    );
  }, [googleLoaded]);

  const handleGoogleResponse = async (response: { credential: string }) => {
    setIsLoading(true);
    setError("");
    try {
      await loginWithGoogle(response.credential);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.firstName || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="py-12 lg:py-20">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                Create Account
              </h1>
              <p className="text-[var(--muted-foreground)]">
                Join us for a better shopping experience
              </p>
            </div>

            {/* Card */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 lg:p-8">
              {/* Google Sign Up */}
              {GOOGLE_CLIENT_ID && (
                <>
                  <div id="google-signup-button" className="w-full mb-6" />

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--border)]" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[var(--surface)] text-[var(--muted-foreground)]">
                        or register with email
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 rounded-lg text-[var(--destructive)] text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-12 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full ${
                              passwordStrength >= level
                                ? passwordStrength === 1
                                  ? "bg-red-500"
                                  : passwordStrength === 2
                                  ? "bg-orange-500"
                                  : passwordStrength === 3
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                                : "bg-[var(--border)]"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {passwordStrength === 1 && "Weak password"}
                        {passwordStrength === 2 && "Fair password"}
                        {passwordStrength === 3 && "Good password"}
                        {passwordStrength === 4 && "Strong password"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-12 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-[var(--destructive)]">Passwords do not match</p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`mt-0.5 w-5 h-5 border rounded flex items-center justify-center transition-colors ${
                      agreedToTerms
                        ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                        : "border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {agreedToTerms && <Check className="h-3 w-3" />}
                  </button>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[var(--primary)] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[var(--primary)] hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary btn-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <p className="mt-6 text-center text-[var(--muted-foreground)]">
                Already have an account?{" "}
                <Link
                  href={`/login${redirect !== "/account" ? `?redirect=${redirect}` : ""}`}
                  className="text-[var(--primary)] hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                <span>Secure registration</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>SSL encrypted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)]">
          <Header />
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          </div>
          <Footer />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}

function getPasswordStrength(password: string): number {
  if (!password) return 0;

  let strength = 0;

  // Length
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Has uppercase and lowercase
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

  // Has number or special char
  if (/[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength++;

  return Math.min(strength, 4);
}
