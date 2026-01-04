"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      name: "Essential Cookies",
      description: "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.",
      required: true,
      enabled: true,
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.",
      required: false,
      enabled: false,
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description: "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.",
      required: false,
      enabled: false,
    },
    {
      id: "preferences",
      name: "Preference Cookies",
      description: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.",
      required: false,
      enabled: false,
    },
  ]);

  const [saved, setSaved] = useState(false);

  const toggleCookie = (id: string) => {
    setCookies(prev =>
      prev.map(cookie =>
        cookie.id === id && !cookie.required
          ? { ...cookie, enabled: !cookie.enabled }
          : cookie
      )
    );
    setSaved(false);
  };

  const acceptAll = () => {
    setCookies(prev => prev.map(cookie => ({ ...cookie, enabled: true })));
    setSaved(true);
  };

  const rejectAll = () => {
    setCookies(prev =>
      prev.map(cookie => ({ ...cookie, enabled: cookie.required }))
    );
    setSaved(true);
  };

  const savePreferences = () => {
    // In a real app, save to localStorage or send to server
    setSaved(true);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
          Cookie Settings
        </h1>
        <p className="font-serif text-muted-foreground mb-8 text-lg">
          Manage your cookie preferences. You can enable or disable different types of cookies below.
        </p>

        <div className="space-y-6 mb-8">
          {cookies.map((cookie) => (
            <Card key={cookie.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-xl tracking-wide">
                    {cookie.name}
                  </CardTitle>
                  <button
                    onClick={() => toggleCookie(cookie.id)}
                    disabled={cookie.required}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cookie.enabled ? "bg-gold" : "bg-muted"
                    } ${cookie.required ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cookie.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {cookie.required && (
                  <span className="text-xs font-serif text-gold uppercase tracking-wider">
                    Always Active
                  </span>
                )}
              </CardHeader>
              <CardContent>
                <CardDescription className="font-serif text-muted-foreground leading-relaxed">
                  {cookie.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={acceptAll} className="btn-luxury bg-gold text-primary hover:bg-gold/90">
            Accept All
          </Button>
          <Button onClick={rejectAll} variant="outline" className="btn-outline-luxury">
            Reject All
          </Button>
          <Button onClick={savePreferences} variant="outline" className="btn-outline-luxury">
            Save Preferences
          </Button>
        </div>

        {saved && (
          <p className="font-serif text-gold mb-8">
            Your cookie preferences have been saved.
          </p>
        )}

        <div className="prose prose-lg max-w-none font-serif space-y-8 border-t border-border pt-8">
          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your device when you visit a website.
              They are widely used to make websites work more efficiently and provide information
              to the website owners.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies to enhance your browsing experience, remember your preferences,
              analyze site traffic, and personalize content. Some cookies are essential for
              the website to function, while others help us improve your experience.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can control and manage cookies in various ways. Most web browsers allow you
              to manage your cookie preferences. You can set your browser to refuse cookies,
              or delete certain cookies. Please note that disabling cookies may affect the
              functionality of this and many other websites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              In addition to our own cookies, we may also use various third-party cookies to
              report usage statistics, deliver advertisements, and so on. These cookies may
              track your browsing activity across different websites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about our use of cookies, please contact us at
              privacy@vernont.com.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
