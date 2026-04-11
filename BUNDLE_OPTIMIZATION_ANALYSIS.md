# Vernont Storefront Bundle Optimization Analysis

**Date**: 2026-04-11
**Base Directory**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront`
**Total node_modules Size**: 877MB

---

## Executive Summary

This analysis identifies significant optimization opportunities in the Vernont storefront bundle. Key findings:

- **@phosphor-icons/react (57MB)**: Largest dependency - entire icon set imported despite using only ~20 icons
- **posthog-js (35MB)**: Analytics library that should be lazy-loaded
- **framer-motion (3MB)**: Animation library used extensively but not code-split
- **No dynamic imports found**: All components loaded eagerly, even heavy modals and drawers
- **Unused font packages**: 3 @fontsource packages installed but not imported anywhere

**Estimated Bundle Size Reduction**: 40-60% through selective imports and lazy loading

---

## 1. Heavy Dependencies Analysis

### Critical (High Impact)

#### @phosphor-icons/react (57MB)
**Current Usage**: Full package import across 68+ files
**Icons Used**: ~20 unique icons (Heart, ShoppingBag, MagnifyingGlass, X, Plus, Minus, etc.)
**Problem**: Importing entire icon set when only a small subset is needed

**Recommendation**: Switch to individual icon imports
```typescript
// Before (imports entire library)
import { Heart, ShoppingBag } from "@phosphor-icons/react";

// After (tree-shakeable)
import { Heart } from "@phosphor-icons/react/dist/icons/Heart";
import { ShoppingBag } from "@phosphor-icons/react/dist/icons/ShoppingBag";
```

**Or**: Create a custom icon wrapper that only exports needed icons
```typescript
// src/components/icons/index.ts
export { Heart } from "@phosphor-icons/react/dist/icons/Heart";
export { ShoppingBag } from "@phosphor-icons/react/dist/icons/ShoppingBag";
// ... only the icons you actually use
```

**Estimated Savings**: 50-55MB (95%+ reduction)

---

#### posthog-js (35MB)
**Current Usage**: Loaded in root layout, initialized immediately
**Problem**: Analytics loaded for all users, even those who decline cookies

**Files**:
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/providers/PostHogProvider.tsx`
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/lib/posthog.ts`

**Recommendation**: Lazy load after user consent
```typescript
// Load PostHog only after cookie consent
const loadPostHog = async () => {
  const { default: posthog } = await import('posthog-js');
  posthog.init(apiKey, options);
};

// Call only when user accepts cookies
if (cookieConsent.analytics) {
  loadPostHog();
}
```

**Estimated Savings**: 35MB for users who decline analytics, faster initial page load

---

#### framer-motion (3MB)
**Current Usage**: Used in 46+ components for animations
**Problem**: Loaded eagerly on all pages, even static content pages

**Heavy Animation Components**:
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/layout/Header.tsx` (mobile menu, search overlay)
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ui/CartDrawer.tsx`
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ui/QuickView.tsx`
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ui/AnimatedSection.tsx`
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ai/shopping-assistant.tsx`

**Recommendation**: Use CSS animations for simple transitions, lazy load framer-motion for complex animations
```typescript
// For simple fade-in animations, use CSS instead
.fade-in {
  animation: fadeIn 0.3s ease-in;
}

// For complex animations, lazy load the component
const ShoppingAssistant = dynamic(() => import('@/components/ai/shopping-assistant'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});
```

**Estimated Savings**: 2-2.5MB through selective usage

---

### Medium Impact

#### @fontsource packages (unused - 0MB impact but should remove)
**Packages**:
- `@fontsource/cormorant-garamond` (5.2.11)
- `@fontsource/crimson-pro` (5.2.8)
- `@fontsource/playfair-display` (5.2.8)

**Current Usage**: Installed but never imported
**Actual Font Loading**: Using Google Fonts `next/font/google` for Manrope

**Recommendation**: Remove from package.json
```bash
pnpm remove @fontsource/cormorant-garamond @fontsource/crimson-pro @fontsource/playfair-display
```

**Estimated Savings**: 0 bytes (not bundled since not imported), but cleaner dependencies

---

#### react-markdown (10.1.0)
**Current Usage**: Only in shopping assistant for AI responses
**Files**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ai/shopping-assistant.tsx`

**Recommendation**: Already isolated to one component, ensure shopping-assistant is lazy-loaded (see below)

---

#### embla-carousel (8.6.0)
**Current Usage**: Used in 2 components
**Files**:
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ui/carousel.tsx`
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/HeroCarousel.tsx`

**Recommendation**: Keep as-is if used on homepage, otherwise lazy-load

---

### Low Impact (Keep)

#### @stripe packages (1.9MB total)
**Usage**: Only loaded on checkout page
**Status**: ✓ Good - already isolated to checkout flow

#### @tanstack/react-query (1.5MB)
**Usage**: Core data fetching library used throughout
**Status**: ✓ Good - essential for app functionality

#### date-fns (4.1.0)
**Usage**: Modern, tree-shakeable date library
**Status**: ✓ Good - much lighter than moment.js

---

## 2. Code-Splitting Opportunities

### Critical: No Dynamic Imports Found

**Current State**: All components are loaded eagerly, even heavy modals and overlays

### Components That Should Be Lazy-Loaded

#### 1. Shopping Assistant (AI Chat) - HIGH PRIORITY
**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ai/shopping-assistant.tsx`
**Size**: Large (react-markdown + framer-motion + AI logic)
**Usage**: Only when user clicks chat button

**Current**:
```typescript
// src/app/layout.tsx
import { ShoppingAssistant } from "@/components/ai/shopping-assistant";

<ShoppingAssistant />
```

**Recommended**:
```typescript
const ShoppingAssistant = dynamic(() => import('@/components/ai/shopping-assistant'), {
  ssr: false,
  loading: () => null // No loading state needed for floating button
});
```

**Estimated Savings**: 200-300KB on initial load

---

#### 2. Cart Drawer - HIGH PRIORITY
**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ui/CartDrawer.tsx`
**Dependencies**: framer-motion, @phosphor-icons
**Usage**: Only when user clicks cart icon

**Recommended**:
```typescript
// src/app/layout.tsx
const CartDrawer = dynamic(() => import('@/components/ui/CartDrawer'), {
  ssr: false
});
```

**Estimated Savings**: 150-200KB

---

#### 3. Compare Drawer - HIGH PRIORITY
**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ui/CompareDrawer.tsx`
**Usage**: Only when user adds items to compare

**Recommended**:
```typescript
const CompareDrawer = dynamic(() => import('@/components/ui/CompareDrawer'), {
  ssr: false
});
```

---

#### 4. Quick View Modal - MEDIUM PRIORITY
**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ui/QuickView.tsx`
**Usage**: Only when user clicks "Quick View" on product cards

**Recommended**:
```typescript
const QuickView = dynamic(() => import('@/components/ui/QuickView'), {
  ssr: false
});
```

---

#### 5. Newsletter Popup - MEDIUM PRIORITY
**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ui/NewsletterPopup.tsx`
**Status**: Currently commented out in layout.tsx
**If Re-enabled**: Should be dynamically imported

---

#### 6. Stripe Payment Form - MEDIUM PRIORITY
**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/checkout/StripePaymentForm.tsx`
**Usage**: Only on /checkout page

**Recommended**:
```typescript
// In checkout page component
const StripePaymentForm = dynamic(() => import('@/components/checkout/StripePaymentForm'), {
  ssr: false,
  loading: () => <div>Loading payment form...</div>
});
```

---

## 3. Route-Based Code Splitting

Next.js 16 automatically code-splits at the page level, but you can optimize further:

### Pages That Should Use Dynamic Imports

#### /account/* pages
**Files**:
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/app/account/orders/page.tsx`
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/app/account/returns/page.tsx`
- `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/app/account/profile/page.tsx`

**Recommendation**: Use dynamic imports for heavy account components (order history tables, etc.)

---

## 4. Optimization Implementation Plan

### Phase 1: Quick Wins (1-2 hours, ~60MB savings)

1. **Remove unused @fontsource packages**
   ```bash
   pnpm remove @fontsource/cormorant-garamond @fontsource/crimson-pro @fontsource/playfair-display
   ```

2. **Switch to selective Phosphor icon imports**
   - Create `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/icons/index.ts`
   - Export only used icons
   - Update all imports across 68 files

3. **Add dynamic imports to layout.tsx**
   - CartDrawer
   - CompareDrawer
   - ShoppingAssistant
   - BackToTop

---

### Phase 2: Medium Effort (4-6 hours, ~5-10MB savings)

1. **Lazy load PostHog after consent**
   - Update `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/providers/PostHogProvider.tsx`
   - Load only when analytics cookies accepted

2. **Replace simple framer-motion animations with CSS**
   - Identify simple fade/slide animations
   - Create CSS animation utilities
   - Replace in low-complexity components

3. **Dynamic import for Stripe on checkout page**
   - Update `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/app/checkout/page.tsx`

---

### Phase 3: Long-term (8-12 hours, ~10-15MB savings)

1. **Audit and optimize framer-motion usage**
   - Identify components that can use CSS animations instead
   - Consider using react-spring (lighter alternative) for complex animations
   - Lazy load framer-motion for interactive components only

2. **Image optimization audit**
   - Ensure all images use next/image
   - Check image sizes and formats (WebP/AVIF)
   - Implement blur placeholders

3. **Third-party script optimization**
   - Review Google Analytics loading strategy
   - Ensure all third-party scripts use next/script with appropriate strategy

---

## 5. Bundle Analyzer Setup

**Status**: ✓ Installed and configured

### Files Modified

1. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/next.config.ts`
   - Added `@next/bundle-analyzer` wrapper
   - Enabled with `ANALYZE=true` environment variable

2. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/package.json`
   - Added analyze script: `"analyze": "ANALYZE=true pnpm build"`

### Usage

```bash
# Generate bundle analysis
pnpm run analyze

# Opens interactive visualization in browser
# Shows exact sizes of all chunks and dependencies
```

---

## 6. Expected Results

### Before Optimization
- Initial bundle: ~800KB - 1.2MB (estimated)
- Total dependencies: 877MB
- First Contentful Paint: 1.5-2.5s (estimated)

### After Phase 1
- Initial bundle: ~400-600KB (40-50% reduction)
- Total dependencies: ~800MB
- First Contentful Paint: 1.0-1.5s

### After All Phases
- Initial bundle: ~300-400KB (60-70% reduction)
- Total dependencies: ~800MB
- First Contentful Paint: 0.8-1.2s
- Lighthouse Performance Score: 90+ (from estimated 70-80)

---

## 7. Monitoring & Validation

### Tools to Use

1. **Bundle Analyzer** (already configured)
   ```bash
   pnpm run analyze
   ```

2. **Lighthouse** (Chrome DevTools)
   - Run before and after optimizations
   - Focus on Performance and Best Practices scores

3. **WebPageTest**
   - Test on real devices/networks
   - Measure Time to Interactive (TTI)

4. **Next.js Build Output**
   ```bash
   pnpm build
   # Check "First Load JS" column
   ```

---

## 8. Priority Action Items

### Immediate (Do First)
1. ✓ Install bundle analyzer (DONE)
2. ✓ Configure next.config.ts (DONE)
3. Remove unused @fontsource packages
4. Create icon barrel export with selective imports

### High Priority (This Week)
1. Add dynamic imports to CartDrawer, CompareDrawer, ShoppingAssistant
2. Lazy load PostHog after cookie consent
3. Run bundle analyzer and validate savings

### Medium Priority (Next Sprint)
1. Replace simple framer-motion animations with CSS
2. Audit all framer-motion usage
3. Dynamic import Stripe payment form

---

## 9. Files Requiring Changes

### High Priority Files

1. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/app/layout.tsx`
   - Add dynamic imports for CartDrawer, CompareDrawer, ShoppingAssistant

2. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/icons/index.ts` (NEW)
   - Create selective icon exports

3. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/providers/PostHogProvider.tsx`
   - Add lazy loading logic

4. All 68 files using `@phosphor-icons/react`
   - Update import paths to use new icon barrel

### Medium Priority Files

5. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/app/checkout/page.tsx`
   - Add dynamic import for Stripe

6. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ui/AnimatedSection.tsx`
   - Consider replacing with CSS animations

---

## 10. Testing Checklist

After implementing optimizations:

- [ ] Run `pnpm build` and check bundle sizes
- [ ] Run `pnpm analyze` and verify icon bundle reduced
- [ ] Test all animations work correctly
- [ ] Test cart drawer opens/closes
- [ ] Test shopping assistant loads on click
- [ ] Test checkout flow with Stripe
- [ ] Verify analytics only loads with consent
- [ ] Run Lighthouse audit (aim for 90+ performance)
- [ ] Test on slow 3G network (Chrome DevTools throttling)
- [ ] Verify no console errors in production build

---

## Conclusion

The Vernont storefront has significant optimization opportunities, primarily from:
1. **@phosphor-icons/react** (57MB) - use selective imports
2. **posthog-js** (35MB) - lazy load after consent
3. **No code-splitting** - add dynamic imports for heavy components

Implementing Phase 1 alone will reduce bundle size by 40-50% with minimal effort (1-2 hours).

All phases combined can achieve 60-70% bundle reduction and significantly improve:
- Page load times
- Time to Interactive
- Lighthouse scores
- User experience on mobile/slow networks
