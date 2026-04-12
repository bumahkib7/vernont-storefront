"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CookieConsent } from "@/components/ui/CookieConsent";

function ConsentPageInner() {
  const searchParams = useSearchParams();
  const forceShow = searchParams.get("reconsent") === "true";

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-[22px] font-semibold text-[#1A1A1A] mb-2">
          Privacy Preferences
        </h1>
        <p className="text-[14px] text-[#666] mb-8 leading-relaxed">
          Manage how we use cookies and third-party services. Your choices are
          saved locally and synced to our servers for compliance. You can update
          your preferences at any time.
        </p>
        <CookieConsent mode="page" forceShow={forceShow} />
      </div>
    </main>
  );
}

export default function ConsentPage() {
  return (
    <Suspense fallback={null}>
      <ConsentPageInner />
    </Suspense>
  );
}
