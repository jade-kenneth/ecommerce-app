# Responsiveness Guide

This project uses Tailwind CSS with custom breakpoints. The primary goal is to keep layouts readable at `375px` while scaling cleanly at tablet and desktop widths without horizontal overflow.

**Breakpoints**
- `sm`: 375px (mobile)
- `md`: 768px
- `lg`: 1040px (tablet landscape)
- `xl`: 1280px (desktop)
- `2xl`: 1536px

**Global Rules**
- `apps/ecommerce-app/src/app/globals.css`
  - `html, body { overflow-x: hidden; }` to prevent horizontal scroll.
  - `img/video/svg` are constrained to `max-width: 100%` to avoid overflow.
  - `.max-w-screen` controls page padding and width per breakpoint.

## Component Notes

**Layout**
- `libs/features/src/portal/layout/Layout.tsx`
  - Uses `w-full` with `overflow-x-hidden` to prevent accidental side-scroll.

**Highlight Bar**
- `libs/features/src/portal/Highlight.tsx`
  - Switches to stacked layout on small screens; icon sizes scale down.

**Navbar**
- `libs/features/src/portal/Navbar.tsx`
  - Mobile: stacked layout with full-width search.
  - Desktop: 3-column grid (`logo | search | actions`).
  - Includes a mobile drawer menu using `Dialog` for quick links and categories.

**Carousel**
- `libs/features/src/portal/Carousel.tsx`
  - Uses `clamp` heights and responsive border radius; image is `object-cover`.

**Categories**
- `libs/features/src/portal/Categories.tsx`
  - `grid-cols-2` on mobile, `md:grid-cols-3`, `lg:grid-cols-6`.
  - Card sizes scale with responsive padding and image sizes.

**Product Cards**
- `libs/ui/components/Cards.tsx`
  - Fixed widths removed; cards stretch with grid.
  - Badge and text sizes scale down for small screens.

**Product Grids**
- `libs/features/src/portal/TopSelling.tsx`
- `libs/features/src/portal/HighPoint.tsx`
- `libs/features/src/portal/JustForYou.tsx`
  - `grid-cols-2` on mobile, `md:grid-cols-3`, `lg:grid-cols-4`, `xl:grid-cols-5`.

**Cart**
- `libs/features/src/portal/Cart/Cart.tsx`
- `libs/features/src/portal/Cart/Items.tsx`
  - Mobile: stacked layout for item cards and summary.
  - Desktop: side-by-side with sticky summary.

**Checkout**
- `libs/features/src/portal/Checkout/Checkout.tsx`
  - Stacks sections on mobile, splits columns on large screens.

**Auth Dialogs**
- `libs/features/src/portal/AuthForm.tsx`
- `libs/features/src/portal/LoginForm.tsx`
- `libs/features/src/portal/SignupForm.tsx`
  - Compact spacing and smaller header sizes for mobile.
  - Close button positioned outside top-right without off-screen overflow.

**Footer**
- `libs/features/src/portal/Footer.tsx`
  - Tablet: 2-column grid (`lg`).
  - Desktop: 4-column layout (`xl`).

## Adding New Components

Checklist:
- Avoid fixed widths; prefer `w-full`, `max-w-*`, and responsive grids.
- Use `min-w-0` when flex children can overflow.
- Prefer `clamp()` or responsive utility classes for heights/spacing.
- Test at 375px, 1040px, and 1280px.
