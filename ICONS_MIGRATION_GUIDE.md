# Phosphor Icons Migration Guide

## Problem
The current implementation imports the entire `@phosphor-icons/react` library (57MB) across 68+ files, but only uses 47 unique icons.

## Solution
Create a barrel export file that selectively imports only the icons used in the app.

---

## Step 1: Create Icon Barrel Export

**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/icons/index.ts`

```typescript
/**
 * Selective icon exports from @phosphor-icons/react
 * Only includes icons actually used in the app.
 *
 * Reduces bundle size from 57MB to ~2-3MB
 *
 * To add a new icon:
 * 1. Import it here: export { NewIcon } from '@phosphor-icons/react/dist/icons/NewIcon';
 * 2. Use it: import { NewIcon } from '@/components/icons';
 */

// Navigation & UI
export { ArrowLeft } from '@phosphor-icons/react/dist/icons/ArrowLeft';
export { ArrowRight } from '@phosphor-icons/react/dist/icons/ArrowRight';
export { ArrowCounterClockwise } from '@phosphor-icons/react/dist/icons/ArrowCounterClockwise';
export { ArrowSquareOut } from '@phosphor-icons/react/dist/icons/ArrowSquareOut';
export { CaretDown } from '@phosphor-icons/react/dist/icons/CaretDown';
export { CaretLeft } from '@phosphor-icons/react/dist/icons/CaretLeft';
export { CaretRight } from '@phosphor-icons/react/dist/icons/CaretRight';
export { CaretUp } from '@phosphor-icons/react/dist/icons/CaretUp';
export { X } from '@phosphor-icons/react/dist/icons/X';
export { List } from '@phosphor-icons/react/dist/icons/List';

// Actions
export { Plus } from '@phosphor-icons/react/dist/icons/Plus';
export { Minus } from '@phosphor-icons/react/dist/icons/Minus';
export { Check } from '@phosphor-icons/react/dist/icons/Check';
export { CheckCircle } from '@phosphor-icons/react/dist/icons/CheckCircle';
export { Trash } from '@phosphor-icons/react/dist/icons/Trash';
export { FloppyDisk } from '@phosphor-icons/react/dist/icons/FloppyDisk';
export { PencilSimple } from '@phosphor-icons/react/dist/icons/PencilSimple';

// E-commerce
export { ShoppingBag } from '@phosphor-icons/react/dist/icons/ShoppingBag';
export { Heart } from '@phosphor-icons/react/dist/icons/Heart';
export { Package } from '@phosphor-icons/react/dist/icons/Package';
export { Truck } from '@phosphor-icons/react/dist/icons/Truck';
export { Gift } from '@phosphor-icons/react/dist/icons/Gift';
export { Tag } from '@phosphor-icons/react/dist/icons/Tag';
export { GitDiff } from '@phosphor-icons/react/dist/icons/GitDiff';

// User & Account
export { User } from '@phosphor-icons/react/dist/icons/User';
export { Lock } from '@phosphor-icons/react/dist/icons/Lock';
export { Shield } from '@phosphor-icons/react/dist/icons/Shield';
export { ShieldCheck } from '@phosphor-icons/react/dist/icons/ShieldCheck';

// Communication
export { EnvelopeSimple } from '@phosphor-icons/react/dist/icons/EnvelopeSimple';
export { Phone } from '@phosphor-icons/react/dist/icons/Phone';

// Status & Feedback
export { SpinnerGap } from '@phosphor-icons/react/dist/icons/SpinnerGap';
export { WarningCircle } from '@phosphor-icons/react/dist/icons/WarningCircle';
export { Info } from '@phosphor-icons/react/dist/icons/Info';
export { Sparkle } from '@phosphor-icons/react/dist/icons/Sparkle';

// Media & Display
export { Eye } from '@phosphor-icons/react/dist/icons/Eye';
export { EyeSlash } from '@phosphor-icons/react/dist/icons/EyeSlash';
export { Camera } from '@phosphor-icons/react/dist/icons/Camera';
export { MagnifyingGlass } from '@phosphor-icons/react/dist/icons/MagnifyingGlass';

// Misc
export { Star } from '@phosphor-icons/react/dist/icons/Star';
export { Crown } from '@phosphor-icons/react/dist/icons/Crown';
export { Medal } from '@phosphor-icons/react/dist/icons/Medal';
export { Circle } from '@phosphor-icons/react/dist/icons/Circle';
export { Clock } from '@phosphor-icons/react/dist/icons/Clock';
export { MapPin } from '@phosphor-icons/react/dist/icons/MapPin';
export { Globe } from '@phosphor-icons/react/dist/icons/Globe';
export { TrendUp } from '@phosphor-icons/react/dist/icons/TrendUp';
export { Ruler } from '@phosphor-icons/react/dist/icons/Ruler';
export { SlidersHorizontal } from '@phosphor-icons/react/dist/icons/SlidersHorizontal';

// Type export for icon props
export type { IconProps } from '@phosphor-icons/react';
```

---

## Step 2: Update tsconfig Paths (Optional but Recommended)

**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/tsconfig.json`

Ensure you have the path alias configured:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Step 3: Automated Migration Script

**File**: `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/scripts/migrate-icons.sh`

```bash
#!/bin/bash

# Find all TypeScript/TSX files with phosphor icon imports
echo "Finding files with @phosphor-icons/react imports..."

# Replace imports
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i.bak \
  's|from "@phosphor-icons/react"|from "@/components/icons"|g' {} \;

# Clean up backup files
find src -name "*.bak" -delete

echo "Migration complete!"
echo "Please run: pnpm build"
echo "And test the application thoroughly"
```

Make executable:
```bash
chmod +x scripts/migrate-icons.sh
```

---

## Step 4: Manual Migration (Safer Approach)

If you prefer manual migration, update each file:

### Before
```typescript
import { Heart, ShoppingBag, MagnifyingGlass } from "@phosphor-icons/react";
```

### After
```typescript
import { Heart, ShoppingBag, MagnifyingGlass } from "@/components/icons";
```

---

## Step 5: Files to Update (68 total)

Run this command to see all files that need updating:

```bash
grep -r 'from "@phosphor-icons/react"' src --include="*.tsx" --include="*.ts" -l
```

Key files:
1. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/layout/Header.tsx`
2. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/layout/Footer.tsx`
3. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ui/CartDrawer.tsx`
4. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ui/QuickView.tsx`
5. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/ai/shopping-assistant.tsx`
6. `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/app/page.tsx`
... (and 62 more)

---

## Step 6: Validation

After migration:

```bash
# 1. Check for any remaining direct imports (should be 0)
grep -r 'from "@phosphor-icons/react"' src --include="*.tsx" --include="*.ts" | wc -l

# 2. Build the project
pnpm build

# 3. Check bundle size reduction
pnpm run analyze

# 4. Look for:
#    - @phosphor-icons should show only icons used
#    - Bundle size should be ~55MB smaller
```

---

## Step 7: Testing Checklist

After migration, verify:

- [ ] All icons display correctly on homepage
- [ ] Header navigation icons work
- [ ] Cart icon and drawer icons show
- [ ] Product card wishlist hearts appear
- [ ] Search icon and magnifying glass work
- [ ] All form validation icons display
- [ ] Mobile menu icons render
- [ ] No console errors about missing icons
- [ ] TypeScript builds without errors
- [ ] Bundle analyzer shows reduced phosphor-icons size

---

## Expected Results

### Before Migration
- Bundle includes entire @phosphor-icons/react library
- Size: ~57MB of icon data
- All 1000+ icons included (but only 47 used)

### After Migration
- Bundle includes only 47 icons
- Size: ~2-3MB of icon data
- **Savings: 54-55MB (95% reduction)**

---

## Rollback Plan

If issues occur:

```bash
# 1. Restore backup files
find src -name "*.bak" -exec bash -c 'mv "$1" "${1%.bak}"' _ {} \;

# 2. Or use git
git checkout src/

# 3. Remove icon barrel
rm src/components/icons/index.ts
```

---

## Adding New Icons in the Future

When you need a new icon:

1. Add export to `/Users/kibuka/IdeaProjects/vernont/vernont-storefront/src/components/icons/index.ts`:
   ```typescript
   export { NewIcon } from '@phosphor-icons/react/dist/icons/NewIcon';
   ```

2. Import from barrel:
   ```typescript
   import { NewIcon } from '@/components/icons';
   ```

3. **DO NOT** import directly from `@phosphor-icons/react`

---

## Alternative: Tree-Shaking Investigation

If the barrel export doesn't work as expected, investigate Next.js tree-shaking:

```javascript
// next.config.ts
const nextConfig = {
  webpack: (config) => {
    config.optimization.sideEffects = false;
    return config;
  }
}
```

But the barrel export approach is more reliable and explicit.

---

## Notes

- **Icon Weights**: All icons default to "regular" weight. If you need other weights (thin, light, bold, fill), add them:
  ```typescript
  export { Heart } from '@phosphor-icons/react/dist/icons/Heart';
  export { HeartFill } from '@phosphor-icons/react/dist/icons/HeartFill';
  ```

- **Icon Props**: All icons accept the same props (size, color, weight, etc.) - no API changes

- **Performance**: Initial render may be slightly faster (less JS to parse), but main benefit is bundle size

- **Maintenance**: This list needs to be kept in sync with actual usage. Consider adding a lint rule to prevent direct imports.

---

## Success Metrics

Track these before and after:

1. **Bundle Size**
   ```bash
   pnpm run analyze
   # Check size of phosphor-icons chunk
   ```

2. **Build Output**
   ```bash
   pnpm build
   # Look at "First Load JS" for main pages
   ```

3. **Lighthouse Score**
   - Run on homepage
   - Performance score should improve by 5-10 points

4. **Network Tab**
   - Initial JS download reduced by 50-55MB (gzipped: ~15-20MB)

---

## Timeline

- **Setup**: 10 minutes (create barrel file)
- **Migration**: 30-60 minutes (update 68 files)
- **Testing**: 30 minutes (verify icons render)
- **Total**: ~2 hours for complete migration

---

## Questions?

If you encounter issues:
1. Check TypeScript errors first
2. Verify icon names match exactly (case-sensitive)
3. Ensure all icons are exported in barrel file
4. Test in development before production build
