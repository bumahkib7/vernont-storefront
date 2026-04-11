"use client";

// Root error boundary. Next.js 15+ requires this file to be a client component
// because it receives a `reset` function that re-renders the segment. We log
// the error in a useEffect so Sentry/PostHog exception capture picks it up.
import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#FAFAFA] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[480px] flex flex-col items-center justify-center text-center gap-8">
        <Link href="/">
          <span
            className="text-2xl uppercase text-[#1A1A1A]"
            style={{
              fontFamily: '"Crimson Pro", Georgia, serif',
              letterSpacing: "0.2em",
            }}
          >
            Vernont
          </span>
        </Link>

        <div className="space-y-3">
          <h1
            className="text-3xl text-[#1A1A1A]"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
          >
            Something went wrong.
          </h1>
          <p className="text-sm text-[#666] leading-relaxed">
            We&apos;re looking into it. Please try again in a moment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#1A1A1A] text-white text-sm uppercase tracking-wider hover:bg-[#333] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-[#1A1A1A] text-[#1A1A1A] text-sm uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-colors text-center"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
