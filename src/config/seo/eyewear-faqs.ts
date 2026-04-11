/**
 * Eyewear SEO FAQs
 *
 * Shared between the server page (for FAQPage JSON-LD emission) and the
 * client component (for the visible FAQ accordion). Keep in sync with
 * any on-page FAQ changes so the structured data stays truthful.
 */
export const SEO_FAQS = [
  {
    q: "Are all your sunglasses authentic designer products?",
    a: "Yes, 100%. We source all eyewear directly from authorized brand retailers and manufacturers. Every pair comes with authenticity certificates and original packaging.",
  },
  {
    q: "What does polarized mean, and do I need it?",
    a: "Polarized lenses have a special filter that blocks intense reflected light (glare) from horizontal surfaces. They're highly recommended for driving, water activities, and snow sports, significantly reducing eye strain and improving visual comfort.",
  },
  {
    q: "Can I get prescription lenses in these frames?",
    a: "Many of our optical frames and select sunglass styles are prescription-ready. Look for \u201CPrescription Available\u201D tags on product pages, or contact our optometry team for personalized guidance.",
  },
  {
    q: "Do your sunglasses provide UV protection?",
    a: "All our sunglasses offer 100% UVA and UVB protection as standard. UV protection is essential for long-term eye health, preventing cataracts and other sun-related damage.",
  },
  {
    q: "What's your return policy if the frames don't fit?",
    a: "We offer a 30-day money-back guarantee. If you're not completely satisfied with the fit, style, or quality, return your eyewear in its original condition for a full refund. Return shipping is free within the UK.",
  },
] as const;

export type SeoFaq = (typeof SEO_FAQS)[number];
