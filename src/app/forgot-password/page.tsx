"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, Loader2, Check } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setIsSuccess(true);
    } catch (err: any) {
      // Don't reveal if email exists or not for security
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Back Link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 font-serif text-muted-foreground hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-3">
                  Forgot Password?
                </h1>
                <p className="font-serif text-muted-foreground">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>

              {/* Card */}
              <div className="bg-card border border-border p-8">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-serif"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block font-display text-sm tracking-wider uppercase mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="pl-11 h-12 font-serif bg-background border-border focus:border-gold"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 btn-luxury bg-gold text-primary hover:bg-gold/90"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="h-20 w-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <Check className="h-10 w-10 text-green-500" />
                </motion.div>
                <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-3">
                  Check Your Email
                </h1>
                <p className="font-serif text-muted-foreground mb-8">
                  If an account exists with <span className="text-foreground">{email}</span>,
                  you&apos;ll receive a password reset link shortly.
                </p>

                <div className="bg-card border border-border p-6 mb-8">
                  <p className="font-serif text-sm text-muted-foreground">
                    Didn&apos;t receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-gold hover:underline"
                    >
                      try again
                    </button>
                  </p>
                </div>

                <Link href="/login">
                  <Button variant="outline" className="border-border hover:border-gold">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
}
