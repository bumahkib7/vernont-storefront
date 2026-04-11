/**
 * Selective icon exports from @phosphor-icons/react
 * Only includes icons actually used in the Vernont storefront.
 *
 * Reduces bundle size from 57MB to ~2-3MB (95% reduction)
 *
 * Usage:
 *   import { Heart, ShoppingBag } from '@/components/icons';
 *
 * To add a new icon:
 *   1. Add export here: export { NewIcon } from '@phosphor-icons/react/dist/icons/NewIcon';
 *   2. Use it: import { NewIcon } from '@/components/icons';
 *
 * DO NOT import directly from '@phosphor-icons/react' - always use this barrel export
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
export { GridFour } from '@phosphor-icons/react/dist/icons/GridFour';
export { SquaresFour } from '@phosphor-icons/react/dist/icons/SquaresFour';
export { SignOut } from '@phosphor-icons/react/dist/icons/SignOut';
export { DownloadSimple } from '@phosphor-icons/react/dist/icons/DownloadSimple';
export { Funnel } from '@phosphor-icons/react/dist/icons/Funnel';

// Actions
export { Plus } from '@phosphor-icons/react/dist/icons/Plus';
export { Minus } from '@phosphor-icons/react/dist/icons/Minus';
export { Check } from '@phosphor-icons/react/dist/icons/Check';
export { CheckCircle } from '@phosphor-icons/react/dist/icons/CheckCircle';
export { Trash } from '@phosphor-icons/react/dist/icons/Trash';
export { FloppyDisk } from '@phosphor-icons/react/dist/icons/FloppyDisk';
export { PencilSimple } from '@phosphor-icons/react/dist/icons/PencilSimple';
export { ThumbsUp } from '@phosphor-icons/react/dist/icons/ThumbsUp';
export { ThumbsDown } from '@phosphor-icons/react/dist/icons/ThumbsDown';
export { Flag } from '@phosphor-icons/react/dist/icons/Flag';

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
export { CreditCard } from '@phosphor-icons/react/dist/icons/CreditCard';
export { Gear } from '@phosphor-icons/react/dist/icons/Gear';

// Communication
export { EnvelopeSimple } from '@phosphor-icons/react/dist/icons/EnvelopeSimple';
export { Phone } from '@phosphor-icons/react/dist/icons/Phone';
export { ChatCircle } from '@phosphor-icons/react/dist/icons/ChatCircle';
export { PaperPlaneRight } from '@phosphor-icons/react/dist/icons/PaperPlaneRight';

// Status & Feedback
export { SpinnerGap } from '@phosphor-icons/react/dist/icons/SpinnerGap';
export { WarningCircle } from '@phosphor-icons/react/dist/icons/WarningCircle';
export { Info } from '@phosphor-icons/react/dist/icons/Info';
export { Sparkle } from '@phosphor-icons/react/dist/icons/Sparkle';
export { XCircle } from '@phosphor-icons/react/dist/icons/XCircle';

// Media & Display
export { Eye } from '@phosphor-icons/react/dist/icons/Eye';
export { EyeSlash } from '@phosphor-icons/react/dist/icons/EyeSlash';
export { Camera } from '@phosphor-icons/react/dist/icons/Camera';
export { MagnifyingGlass } from '@phosphor-icons/react/dist/icons/MagnifyingGlass';
export { Image } from '@phosphor-icons/react/dist/icons/Image';

// Shopping & Compare
export { ShoppingCart } from '@phosphor-icons/react/dist/icons/ShoppingCart';
export { ArrowClockwise } from '@phosphor-icons/react/dist/icons/ArrowClockwise';
export { Shuffle } from '@phosphor-icons/react/dist/icons/Shuffle';
export { Headphones } from '@phosphor-icons/react/dist/icons/Headphones';

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

// Type exports for TypeScript
export type { IconProps, Icon } from '@phosphor-icons/react';
