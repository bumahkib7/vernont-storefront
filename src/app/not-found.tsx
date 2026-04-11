// Root 404 page. Server component — no client JS shipped for this route.
import Link from "next/link";

export default function NotFound() {
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
            Page not found
          </h1>
          <p className="text-sm text-[#666] leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/eyewear"
            className="px-6 py-3 bg-[#1A1A1A] text-white text-sm uppercase tracking-wider hover:bg-[#333] transition-colors"
          >
            Browse Eyewear
          </Link>
          <Link
            href="/"
            className="text-xs text-[#666] hover:text-[#1A1A1A] underline underline-offset-4 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
