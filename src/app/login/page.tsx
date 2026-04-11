"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeSlash, SpinnerGap } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const { login, loginWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, router, redirect]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (!googleLoaded || !GOOGLE_CLIENT_ID || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "filled_blue", size: "large", width: "100%", text: "continue_with", shape: "rectangular" }
    );
  }, [googleLoaded]);

  const handleGoogleResponse = async (response: { credential: string }) => {
    setIsLoading(true); setError("");
    try {
      await loginWithGoogle(response.credential);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password"); return; }
    setIsLoading(true);
    try {
      await login(email, password);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <SpinnerGap className="h-8 w-8 animate-spin text-[#1A1A1A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center py-12 px-4 relative">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#EBEBEB] p-8 lg:p-10">
        
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl md:text-2xl font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-8" style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}>
            VERNONT
          </Link>
          <div className="text-left">
             <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Sign in</h1>
             <p className="text-[13px] text-[#666]">Sign in or create an account</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded text-red-600 text-[13px]">
            {error}
          </div>
        )}

        {GOOGLE_CLIENT_ID && (
          <div className="mb-6">
             <div id="google-signin-button" className="w-full relative z-10" />
             {/* Fallback styling placeholder for the blue button look */}
             <div className="relative mt-6 mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E5E5]" /></div>
                <div className="relative flex justify-center text-[12px]"><span className="px-3 bg-white text-[#999]">or</span></div>
             </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 bg-white border border-[#CCCCCC] rounded text-[14px] text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition-colors"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white border border-[#CCCCCC] rounded text-[14px] text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition-colors pr-10"
              disabled={isLoading}
            />
            <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#1A1A1A]"
               aria-label={showPassword ? "Hide password" : "Show password"}
            >
               {showPassword ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#5f9e90] hover:bg-[#5a7670] text-white text-[13px] font-medium transition-colors flex items-center justify-center gap-2 mt-2 rounded"
          >
            {isLoading ? <SpinnerGap className="h-4 w-4 animate-spin" /> : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-[#999]">
          By continuing, you agree to our <Link href="/terms" className="underline hover:text-[#666]">Terms of service</Link>
        </p>

        <p className="mt-4 text-center text-[12px] text-[#666]">
          Don&apos;t have an account? <Link href={`/register${redirect !== "/account" ? `?redirect=${redirect}` : ""}`} className="text-[#6b8982] hover:underline">Create one</Link>
        </p>
      </div>

      <div className="absolute bottom-8 text-[12px] text-[#6b8982] hover:underline">
         <Link href="/privacy">Privacy policy</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <LoginContent />
    </Suspense>
  );
}

declare global { interface Window { google?: any; } }
