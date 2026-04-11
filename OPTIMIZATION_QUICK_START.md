# Quick Start: Bundle Optimization

## Step 1: Remove Unused Dependencies (5 min)

```bash
cd /Users/kibuka/IdeaProjects/vernont/vernont-storefront
pnpm remove @fontsource/cormorant-garamond @fontsource/crimson-pro @fontsource/playfair-display
```

---

## Step 2: Add Dynamic Imports to Layout (15 min)

**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/app/layout.tsx`

```typescript
// Add at top
import dynamic from 'next/dynamic';

// Replace static imports with dynamic
const CartDrawer = dynamic(() => import('@/components/ui/CartDrawer').then(mod => ({ default: mod.CartDrawer })), {
  ssr: false
});

const CompareDrawer = dynamic(() => import('@/components/ui/CompareDrawer').then(mod => ({ default: mod.CompareDrawer })), {
  ssr: false
});

const ShoppingAssistant = dynamic(() => import('@/components/ai/shopping-assistant').then(mod => ({ default: mod.ShoppingAssistant })), {
  ssr: false
});

const BackToTop = dynamic(() => import('@/components/ui/BackToTop').then(mod => ({ default: mod.BackToTop })), {
  ssr: false
});
```

---

## Step 3: Create Icon Barrel Export (30 min)

**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/icons/index.ts` (NEW)

```typescript
// Only export icons actually used in the app
export { Heart } from '@phosphor-icons/react/dist/icons/Heart';
export { ShoppingBag } from '@phosphor-icons/react/dist/icons/ShoppingBag';
export { MagnifyingGlass } from '@phosphor-icons/react/dist/icons/MagnifyingGlass';
export { X } from '@phosphor-icons/react/dist/icons/X';
export { Plus } from '@phosphor-icons/react/dist/icons/Plus';
export { Minus } from '@phosphor-icons/react/dist/icons/Minus';
export { User } from '@phosphor-icons/react/dist/icons/User';
export { List } from '@phosphor-icons/react/dist/icons/List';
export { CaretRight } from '@phosphor-icons/react/dist/icons/CaretRight';
export { CaretLeft } from '@phosphor-icons/react/dist/icons/CaretLeft';
export { SpinnerGap } from '@phosphor-icons/react/dist/icons/SpinnerGap';
export { Star } from '@phosphor-icons/react/dist/icons/Star';
export { ArrowRight } from '@phosphor-icons/react/dist/icons/ArrowRight';
export { Truck } from '@phosphor-icons/react/dist/icons/Truck';
export { Gift } from '@phosphor-icons/react/dist/icons/Gift';
export { Lock } from '@phosphor-icons/react/dist/icons/Lock';
export { Shield } from '@phosphor-icons/react/dist/icons/Shield';
export { Eye } from '@phosphor-icons/react/dist/icons/Eye';
export { Package } from '@phosphor-icons/react/dist/icons/Package';
export { ChatCircle } from '@phosphor-icons/react/dist/icons/ChatCircle';
export { PaperPlaneRight } from '@phosphor-icons/react/dist/icons/PaperPlaneRight';
export { Sparkle } from '@phosphor-icons/react/dist/icons/Sparkle';
export { WarningCircle } from '@phosphor-icons/react/dist/icons/WarningCircle';
export { ArrowLeft } from '@phosphor-icons/react/dist/icons/ArrowLeft';
export { ArrowCounterClockwise } from '@phosphor-icons/react/dist/icons/ArrowCounterClockwise';
export { ShoppingCart } from '@phosphor-icons/react/dist/icons/ShoppingCart';
export { ArrowClockwise } from '@phosphor-icons/react/dist/icons/ArrowClockwise';
export { Tag } from '@phosphor-icons/react/dist/icons/Tag';
export { Headphones } from '@phosphor-icons/react/dist/icons/Headphones';
export { XCircle } from '@phosphor-icons/react/dist/icons/XCircle';
export { GitDiff } from '@phosphor-icons/react/dist/icons/GitDiff';
export { Shuffle } from '@phosphor-icons/react/dist/icons/Shuffle';

// Add more as needed
```

Then update imports across the codebase:

```bash
# Find and replace
# Before: import { Heart, ShoppingBag } from "@phosphor-icons/react";
# After:  import { Heart, ShoppingBag } from "@/components/icons";
```

---

## Step 4: Lazy Load PostHog (20 min)

**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/providers/PostHogProvider.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

let posthogInstance: any = null;

export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);

  // Load PostHog only after user consent
  useEffect(() => {
    const loadPostHog = async () => {
      // Check for cookie consent (adjust based on your consent implementation)
      const consent = localStorage.getItem('cookie-consent');
      if (consent !== 'accepted') return;

      if (!posthogInstance) {
        const posthogModule = await import('posthog-js');
        const posthog = posthogModule.default;

        const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

        if (apiKey) {
          posthog.init(apiKey, {
            api_host: apiHost || 'https://us.i.posthog.com',
            loaded: () => setIsLoaded(true),
          });
          posthogInstance = posthog;
        }
      }
    };

    loadPostHog();
  }, []);

  // Track page views
  useEffect(() => {
    if (isLoaded && posthogInstance) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      posthogInstance.capture('$pageview', { path: url });
    }
  }, [pathname, searchParams, isLoaded]);

  return null;
}
```

---

## Step 5: Run Bundle Analyzer (5 min)

```bash
pnpm run analyze

# This will:
# 1. Build the production bundle
# 2. Generate interactive visualization
# 3. Open in browser showing all chunks
```

Look for:
- Large chunks that can be code-split
- Duplicate dependencies
- Unexpectedly large packages

---

## Step 6: Validate Results

```bash
# 1. Build production
pnpm build

# 2. Check output sizes
# Look for "First Load JS" column
# Target: <200KB for main pages

# 3. Test locally
pnpm start

# 4. Open DevTools
# - Network tab: Check bundle sizes
# - Performance tab: Run Lighthouse
# - Target: 90+ performance score
```

---

## Quick Wins Summary

| Optimization | Time | Savings | Difficulty |
|--------------|------|---------|------------|
| Remove unused fonts | 5 min | 0KB* | Easy |
| Dynamic imports (layout) | 15 min | 150-200KB | Easy |
| Icon barrel export | 30 min | 50-55MB | Medium |
| Lazy load PostHog | 20 min | 35MB | Medium |
| **Total** | **70 min** | **~60MB** | - |

*Not bundled since unused, but cleaner deps

---

## Testing Checklist

After changes:
- [ ] `pnpm build` succeeds
- [ ] No TypeScript errors
- [ ] Cart opens/closes correctly
- [ ] Compare drawer works
- [ ] Shopping assistant loads on click
- [ ] Icons display correctly
- [ ] Analytics tracks (if consent given)
- [ ] Lighthouse score improved
- [ ] Bundle size reduced (check build output)

---

## Rollback Plan

If issues occur:

```bash
# Revert changes
git checkout src/app/layout.tsx
git checkout src/providers/PostHogProvider.tsx

# Reinstall fonts if needed
pnpm add @fontsource/cormorant-garamond @fontsource/crimson-pro @fontsource/playfair-display
```

---

## Next Steps

After completing quick wins:

1. **Phase 2**: CSS animations for simple transitions
2. **Phase 3**: Stripe lazy loading on checkout
3. **Continuous**: Monitor bundle sizes on every build
4. **Advanced**: Consider react-spring instead of framer-motion

See `BUNDLE_OPTIMIZATION_ANALYSIS.md` for detailed implementation guide.
