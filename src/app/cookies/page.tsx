"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

export default function CookiesPage() {
  const [cookies, setCookies] = useState<CookieCategory[]>([
    {
      id: "essential",
      name: "Essential",
      description:
        "Required for the site to function. Handles sessions, authentication, shopping cart, and security. These cannot be disabled.",
      required: true,
      enabled: true,
    },
    {
      id: "analytics",
      name: "Analytics",
      description:
        "Help us understand how visitors use the site so we can improve it. We use privacy-respecting analytics with no cross-site tracking.",
      required: false,
      enabled: false,
    },
    {
      id: "marketing",
      name: "Marketing",
      description:
        "Used by advertising partners to show you relevant ads on other sites based on your browsing activity.",
      required: false,
      enabled: false,
    },
    {
      id: "preferences",
      name: "Preferences",
      description:
        "Remember your settings like language, currency, and display preferences across visits.",
      required: false,
      enabled: false,
    },
  ]);

  const [saved, setSaved] = useState(false);

  const toggleCookie = (id: string) => {
    setCookies((prev) =>
      prev.map((c) =>
        c.id === id && !c.required ? { ...c, enabled: !c.enabled } : c
      )
    );
    setSaved(false);
  };

  const acceptAll = () => {
    setCookies((prev) => prev.map((c) => ({ ...c, enabled: true })));
    setSaved(true);
  };

  const rejectAll = () => {
    setCookies((prev) =>
      prev.map((c) => ({ ...c, enabled: c.required }))
    );
    setSaved(true);
  };

  const savePreferences = () => {
    setSaved(true);
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-2xl px-4 py-20 md:py-28">
        {/* Header */}
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Privacy
        </p>
        <h1 className="text-3xl md:text-4xl tracking-tight font-light mb-3">
          Cookie Preferences
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-12">
          We use cookies to keep the site working, remember your choices, and
          understand how people use Vernont. You decide which you&apos;re
          comfortable with.
        </p>

        {/* Toggles */}
        <div className="mb-10">
          {cookies.map((cookie, i) => (
            <div
              key={cookie.id}
              className={`flex items-start justify-between gap-8 py-5 ${
                i < cookies.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium">{cookie.name}</span>
                  {cookie.required && (
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      Always on
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cookie.description}
                </p>
              </div>
              <button
                onClick={() => toggleCookie(cookie.id)}
                disabled={cookie.required}
                aria-label={`Toggle ${cookie.name} cookies`}
                className={`mt-1 relative shrink-0 inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  cookie.enabled
                    ? "bg-foreground"
                    : "bg-muted-foreground/25"
                } ${cookie.required ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-background transition-transform ${
                    cookie.enabled ? "translate-x-[18px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={acceptAll}
            size="sm"
            className="bg-foreground text-background hover:bg-foreground/90 rounded-none px-6 text-xs uppercase tracking-wider"
          >
            Accept all
          </Button>
          <Button
            onClick={rejectAll}
            variant="outline"
            size="sm"
            className="rounded-none px-6 text-xs uppercase tracking-wider"
          >
            Essential only
          </Button>
          <Button
            onClick={savePreferences}
            variant="ghost"
            size="sm"
            className="text-xs uppercase tracking-wider text-muted-foreground"
          >
            Save choices
          </Button>
        </div>

        {saved && (
          <p className="text-sm text-muted-foreground mb-4">
            Preferences saved.
          </p>
        )}

        {/* Policy text */}
        <div className="mt-16 pt-10 border-t border-border space-y-8 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-foreground font-medium mb-2">
              What are cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help the site remember your actions and
              preferences over time.
            </p>
          </div>

          <div>
            <h2 className="text-foreground font-medium mb-2">
              How we use them
            </h2>
            <p>
              Essential cookies keep things like your shopping cart and login
              session working. Analytics cookies help us see which pages are
              popular and where people get stuck, so we can improve the
              experience. We don&apos;t sell your data.
            </p>
          </div>

          <div>
            <h2 className="text-foreground font-medium mb-2">
              Browser controls
            </h2>
            <p>
              Most browsers let you block or delete cookies through their
              settings. Be aware that blocking essential cookies will prevent
              parts of the site from working properly.
            </p>
          </div>

          <div>
            <h2 className="text-foreground font-medium mb-2">Questions</h2>
            <p>
              Reach us at{" "}
              <a
                href="mailto:privacy@vernont.com"
                className="text-foreground underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
              >
                privacy@vernont.com
              </a>{" "}
              with any questions about how we handle cookies or your data.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
