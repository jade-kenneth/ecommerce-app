# Ecommerce App Improvement Tasks

This task list is based on the recent scan findings and aligned with the standards in `REACT_PATTERNS.md`.

## Goal

Stabilize admin auth/layout behavior, reduce hydration/UI regressions, and improve maintainability by applying consistent React patterns.

## Priority Legend

- `P0` Critical: broken behavior, auth/security/incorrect rendering
- `P1` High: user-facing bugs, hydration issues, production regressions
- `P2` Medium: UX/performance/maintainability improvements
- `P3` Low: cleanup/documentation/refactors

## P0 - Critical Fixes

### 1. Fix `withLayout` auth gating flow (premature render + sticky error)

- `Priority`: `P0`
- `Files`:
  - `libs/admin/layout/withLayout.tsx`
  - `apps/ecommerce-app/src/app/admin/layout.tsx`
- `Root cause analysis`:
  - Protected content can render before session finishes loading.
  - `error` state can remain after session recovers.
  - `role`, `permission`, and `redirectTo` options are not fully honored.
- `Tasks`:
  - Keep loading state active while `session.status === 'loading'`
  - Clear `error` on valid authenticated session
  - Replace hardcoded `['ADMIN']` with `options.role`
  - Implement/restore `permission` and optional `redirectTo` behavior
  - Ensure HOC output is stable during hydration
- `Fix implemented`:
  - Reworked `withLayout` to derive guard state from `useSession()` instead of local `loading/error` state.
  - Restored role-based access behavior from HOC options and kept optional redirect handling.
  - Removed sticky auth flash behavior by keeping guard rendering stable during auth resolution.
- `React patterns to use`:
  - `HOC Pattern` (page-level auth/layout)
  - `State Machine Pattern` (explicit auth status handling)
  - `Suspense / Hydration Safety` (stable initial render)
- `Acceptance criteria`:
  - Admin page does not flash protected content while auth is loading
  - Passing `role` and `permission` changes access behavior
  - Unauthorized state disappears after valid re-authentication

### 2. Make `useAuth` failure path deterministic (avoid infinite loading)

- `Priority`: `P0`
- `Files`:
  - `libs/providers/src/AuthProvider/useAuth.ts`
  - `libs/providers/src/AuthProvider/type.ts`
- `Root cause analysis`:
  - Errors in `getSession()` leave session stuck in `loading`
- `Tasks`:
  - Set session to a deterministic fallback (`error` or `unauthenticated`) in `catch`
  - Keep global auth store in sync on failure
  - (Optional) add minimal error logging for diagnosis
- `Fix implemented`:
  - Updated `useAuth` failure handling to transition session state deterministically on `getSession()` errors.
  - Synced the global auth store to unauthenticated on failure so consumers do not remain stuck in loading.
- `React patterns to use`:
  - `Provider Pattern` (auth provider as source of truth)
  - `Custom Hooks Pattern` (`useAuth` / `useSession` behavior)
  - `State Machine Pattern` (`loading` -> `authenticated` | `unauthenticated` | `error`)
- `Acceptance criteria`:
  - Auth provider never stays stuck in `loading` after a failed session check
  - Admin fallback screens render correctly on auth failures

### 3. Replace placeholder IDs (`FIXME`) in admin create flows

- `Priority`: `P0`
- `Files`:
  - `apps/ecommerce-app/src/app/admin/[slug]/Settings.tsx`
  - `libs/features/src/admin/features/Product/CreateProduct.tsx`
- `Root cause analysis`:
  - Hardcoded placeholder IDs can break create mutations or local optimistic UI
- `Tasks`:
  - Use backend-generated IDs from mutation responses
  - If optimistic UI is needed, generate temporary client IDs with clear replacement logic
  - Remove all `'FIXME'` placeholders in runtime payloads
- `Fix implemented`:
  - Replaced placeholder IDs with valid `ObjectId` values (`bson`) in admin create flows.
  - Restored optimistic product updates using valid temporary IDs and reconciled with server data via refetch.
- `React patterns to use`:
  - `Server State Pattern` (use mutation result as source of truth)
  - `Colocation Pattern` (keep create-flow helpers with feature)
- `Acceptance criteria`:
  - No runtime payloads contain `'FIXME'`
  - New products/config entries use valid IDs end-to-end

## P1 - High Priority Fixes

### 4. Fix admin sidebar hydration mismatch + invalid Tailwind gradient class

- `Priority`: `P1`
- `Files`:
  - `libs/features/src/admin/features/Layout/Sidebar.tsx`
- `Root cause analysis`:
  - `usePathname()` active-link styling can mismatch SSR/client hydration
  - `to-[bg-cyan-700]` is an invalid Tailwind class
- `Tasks`:
  - Delay pathname-dependent active styling until after mount
  - Add `aria-current="page"` on active links
  - Replace invalid gradient utility with `to-cyan-700`
- `Fix implemented`:
  - Added a mount guard before pathname-based active-link styling and added `aria-current` for the active route.
  - Fixed the invalid Tailwind gradient utility to a valid `from-cyan-600 to-cyan-700` pair.
- `React patterns to use`:
  - `Suspense / Hydration Safety` (stable server/client markup)
  - `Custom Hooks Pattern` (optional `useHasMounted` helper)
- `Acceptance criteria`:
  - No hydration warning caused by admin sidebar active classes
  - Sidebar gradient renders consistently

### 5. Remove `dangerouslySetInnerHTML` from category labels

- `Priority`: `P1`
- `Files`:
  - `libs/features/src/portal/Categories.tsx`
- `Root cause analysis`:
  - Malformed category label HTML (`<p">...`)
  - `dangerouslySetInnerHTML` for simple labels is brittle and unnecessary
- `Tasks`:
  - Store category labels as plain text (and optionally line-break tokens)
  - Render text safely without `dangerouslySetInnerHTML`
  - Normalize malformed strings (`</br>`, stray tags)
  - Add image fallback UI if category image fails to load
- `Fix implemented`:
  - Removed `dangerouslySetInnerHTML` and render normalized label text safely.
  - Added malformed-label normalization and graceful image fallback UI for broken/missing category images.
- `React patterns to use`:
  - `Colocation Pattern` (keep parser/format helpers in component file or feature)
  - `Custom Hooks Pattern` (optional `useImageFallback`)
- `Acceptance criteria`:
  - No `dangerouslySetInnerHTML` in category card labels
  - All category names render correctly (including “Sweets & Candies”)
  - Broken image path shows graceful fallback

### 6. Harden Xendit script initialization on cart page

- `Priority`: `P1`
- `Files`:
  - `apps/ecommerce-app/src/app/cart/page.tsx`
- `Root cause analysis`:
  - Assumes `window.Xendit` and `NEXT_PUBLIC_XENDIT_PUBLIC_KEY` are always available
- `Tasks`:
  - Guard `window.Xendit` before use
  - Guard env var presence and fail gracefully (toast/log/no-op)
  - Add `onError` handler for script load failure
- `Fix implemented`:
  - Added Xendit global/env guards, `try/catch` around initialization, and script `onError` handling.
  - Added graceful failure messaging (toast/log) instead of crashing when the SDK is unavailable.
- `React patterns to use`:
  - `Custom Hooks Pattern` (optional `usePaymentScript`)
  - `Inversion of Control Pattern` (script loader callback injection if reused)
- `Acceptance criteria`:
  - No runtime crash if Xendit script fails to load
  - No runtime crash when public key is missing

## P2 - UX / Responsiveness / Maintainability

### 7. Make admin layout responsive (sidebar + content widths)

- `Priority`: `P2`
- `Files`:
  - `libs/features/src/admin/features/Layout/index.tsx`
  - `libs/features/src/admin/features/Layout/Sidebar.tsx`
- `Root cause analysis`:
  - Fixed `20%/80%` widths are desktop-only and break on mobile
- `Tasks`:
  - Introduce mobile layout (stacked, drawer, or collapsible sidebar)
  - Use responsive width utilities instead of fixed percentages
  - Preserve keyboard navigation and focus behavior
- `Fix implemented`:
  - Replaced fixed percentage layout with responsive sidebar/content sizing and added a mobile drawer pattern.
  - Added menu toggle, overlay, escape-to-close, and body scroll lock for mobile admin navigation.
- `React patterns to use`:
  - `Compound Component Pattern` (if building sidebar + mobile nav API)
  - `Headless Component Pattern` (if custom responsive nav logic is extracted)
  - `Colocation Pattern`
- `Acceptance criteria`:
  - Admin pages are usable on mobile widths
  - Sidebar remains accessible and navigable

### 8. Replace full page reload after rating submission

- `Priority`: `P2`
- `Files`:
  - `libs/features/src/portal/RatingModal.tsx`
- `Root cause analysis`:
  - `window.location.reload()` resets app state and degrades UX
- `Tasks`:
  - Close modal and update relevant UI state without full refresh
  - Trigger only the needed state refresh (e.g., rating state/license state)
  - Preserve success feedback
- `Fix implemented`:
  - Removed the hard page reload after rating submit success.
  - Updated the flow to close the modal, preserve success feedback, and refresh dependent UI state through providers/store updates.
- `React patterns to use`:
  - `Custom Hooks Pattern` (submission and post-submit behavior)
  - `Provider Pattern` (shared rating/license state updates)
  - `Server State Pattern` (if server state invalidation is needed)
- `Acceptance criteria`:
  - Successful rating submission does not reload the page
  - UI returns to a stable state after submit

### 9. Review browser-only event listeners and visibility checks for cleanup consistency

- `Priority`: `P2`
- `Files`:
  - `libs/providers/src/AuthProvider/useAuth.ts`
  - `libs/providers/src/LicenseProvider/useLicense.tsx`
- `Root cause analysis`:
  - Visibility-change listeners exist in multiple providers; behavior may drift
- `Tasks`:
  - Standardize event listener setup/cleanup patterns
  - Prevent duplicated or unnecessary revalidation work
  - Consider shared helper hook for visibility-triggered refresh behavior
- `Fix implemented`:
  - Standardized visibility listener setup/cleanup in auth and license providers.
  - Added visible-only triggers, in-flight dedupe guards, and mounted guards to avoid duplicate work and stale updates.
- `React patterns to use`:
  - `Custom Hooks Pattern`
  - `Provider Pattern`
- `Acceptance criteria`:
  - Listener registration/cleanup is consistent
  - No obvious duplicate refresh calls on visibility changes

## P3 - Cleanup / Consistency

### 10. Align admin exports and folder structure consistency

- `Priority`: `P3`
- `Files`:
  - `libs/admin/index.ts`
  - `libs/admin/layout/*`
- `Root cause analysis`:
  - Export surface may drift as components move between `libs/admin/` and `libs/admin/layout/`
- `Tasks`:
  - Decide final ownership for fallback components (`libs/admin/` vs `libs/admin/layout/`)
  - Make barrel exports reflect actual file locations
  - Keep imports consistent (`~/admin` vs `~/admin/layout`) based on intended public API
- `Fix implemented`:
  - Standardized fallback ownership under `libs/admin/layout/*` and aligned layout barrel exports with actual files.
  - Standardized admin app imports toward the public `~/admin` path.
- `React patterns to use`:
  - `Colocation Pattern`
- `Acceptance criteria`:
  - One clear public import path for admin layout utilities
  - No broken re-exports after refactors

### 11. Add lightweight docs/tests around admin auth guard behavior

- `Priority`: `P3`
- `Files`:
  - `libs/admin/layout/withLayout.tsx`
  - (optional) test files near `libs/admin/layout`
- `Root cause analysis`:
  - Auth/role/permission regressions are easy to reintroduce
- `Tasks`:
  - Document expected states: loading / unauthenticated / unauthorized / authorized
  - Add tests for HOC behavior (if test setup is available)
- `Fix implemented`:
  - Added explicit guard-state typing and a pure guard-state resolver in `withLayout.tsx`.
  - Refactored HOC branching to use the resolver and documented expected guard behavior for future tests.
- `React patterns to use`:
  - `HOC Pattern`
  - `State Machine Pattern`
- `Acceptance criteria`:
  - Expected guard behavior is documented and/or test-covered

## Suggested Implementation Order (Recommended)

1. Fix `withLayout` auth flow and option handling (`P0`)
2. Fix `useAuth` failure path (`P0`)
3. Remove `FIXME` IDs (`P0`)
4. Fix admin sidebar hydration + gradient class (`P1`)
5. Refactor `Categories` label rendering and image fallback (`P1`)
6. Harden Xendit script loading (`P1`)
7. Improve admin responsive layout (`P2`)
8. Remove rating modal hard reload (`P2`)
9. Cleanup exports/docs/tests (`P3`)

## React Pattern Mapping Summary

- `Custom Hooks`: auth/session helpers, mount detection, script loading, image fallback
- `Provider Pattern`: auth/license/rating shared state handling
- `Colocation`: keep feature-specific helpers near admin/portal features
- `Server State Pattern`: use mutation/query results as source of truth (no placeholder IDs)
- `HOC Pattern`: admin route auth/layout/permission wrapper (`withLayout`)
- `State Machine Pattern`: explicit auth and async submission states
- `Suspense / Hydration Safety`: avoid SSR/client mismatches in pathname/browser-only rendering
- `Headless / Compound Components`: optional for responsive admin nav refactor if complexity grows

## Definition of Done (Overall)

- Admin routes are auth-safe and hydration-stable
- No placeholder runtime IDs remain in admin create flows
- Category labels/images render safely without raw HTML injection
- Payment script integration fails gracefully
- Admin layout is usable on mobile
- Documentation and exports reflect the final architecture

## Root Cause Analysis and Fix Log

This section documents the root cause and the implemented fix for each task above.

### 1. `withLayout` auth gating flow (premature render + sticky error)

- `Status`: `Completed`
- `Root cause analysis`:
  - `withLayout` duplicated auth state (`loading` / `error`) locally instead of deriving it from `useSession()`.
  - Effect timing allowed `loading` to turn `false` while the session was still unresolved, causing protected-content flash.
  - Error state could persist after auth recovered because it was stored separately and not consistently reset.
  - Access options drifted from runtime behavior (hardcoded checks vs configurable HOC API).
- `Fix implemented`:
  - Reworked `withLayout` to derive guard behavior directly from `useSession()`.
  - Removed effect-driven local loading/error state from the HOC.
  - Restored role-based access checks from `options.role`.
  - Added/kept optional redirect behavior via `redirectTo` + `router.replace(...)`.
  - Simplified the HOC API later by removing the unused `permission` option from implementation and focusing on role-based gating.

### 2. `useAuth` failure path deterministic (avoid infinite loading)

- `Status`: `Completed`
- `Root cause analysis`:
  - `getSession()` failures were swallowed without transitioning state, so `session.status` could remain `loading`.
  - Global auth store and session state could drift on failed session checks.
- `Fix implemented`:
  - Updated `catch` path in `libs/providers/src/AuthProvider/useAuth.ts` to set auth state deterministically.
  - `globalStore.setIsAuthenticated(false)` is now called on failure.
  - `session` is now set to `{ status: 'error' }` so consumers can render fallback UI.

### 3. Replace placeholder IDs (`FIXME`) in admin create flows

- `Status`: `Completed`
- `Root cause analysis`:
  - Placeholder runtime IDs (`'FIXME'`) were used in create/optimistic flows, which can break cache behavior and create invalid payloads.
  - Product create mutation flow did not return created entities, so optimistic UI had no real backend ID to use.
- `Fix implemented`:
  - Replaced config create placeholder IDs with generated valid ObjectIds (`bson`) in `Settings.tsx`.
  - Restored optimistic product updates but replaced fake IDs with valid temporary ObjectIds (`bson`) in `CreateProduct.tsx`.
  - Kept Apollo cache optimistic insert in `ManageInventory.tsx` and followed it with `query.refetch()` to reconcile temp rows with server truth.

### 4. Admin sidebar hydration mismatch + invalid Tailwind gradient class

- `Status`: `Completed`
- `Root cause analysis`:
  - Active nav link classes depended on `usePathname()` during hydration, which can differ server vs client.
  - Sidebar gradient used an invalid Tailwind utility (`to-[bg-cyan-700]`), so styles were inconsistent.
- `Fix implemented`:
  - Added a mount flag (`hasMounted`) and delayed pathname-based active styling until after mount.
  - Added `aria-current="page"` to active links for accessibility.
  - Replaced invalid gradient classes with `from-cyan-600 to-cyan-700`.

### 5. Remove `dangerouslySetInnerHTML` from category labels

- `Status`: `Completed`
- `Root cause analysis`:
  - Category labels contained malformed inline HTML strings (for example stray tags / invalid `<br>` usage).
  - `dangerouslySetInnerHTML` was being used for simple label rendering, increasing fragility and risk.
  - Broken/missing category images had no graceful fallback.
- `Fix implemented`:
  - Removed `dangerouslySetInnerHTML` and render labels as normalized safe text.
  - Added label normalization to handle malformed strings (`</br>`, stray tags, broken wrappers).
  - Added image fallback UI (initials badge) for missing/broken category images.
  - Marked the component as client-rendered to support image fallback state.

### 6. Harden Xendit script initialization on cart page

- `Status`: `Completed`
- `Root cause analysis`:
  - Cart page assumed Xendit script global and publishable key env var were always available.
  - Missing script/global/env caused runtime exceptions in payment initialization.
- `Fix implemented`:
  - Guarded `window.Xendit` and `setPublishableKey` before use.
  - Guarded `NEXT_PUBLIC_XENDIT_PUBLIC_KEY` and failed gracefully with user-facing toasts.
  - Wrapped publishable key initialization in `try/catch`.
  - Added `Script` load error handling (`onError`) and console diagnostics.

### 7. Make admin layout responsive (sidebar + content widths)

- `Status`: `Completed`
- `Root cause analysis`:
  - Admin layout used fixed `20% / 80%` widths, which only works on desktop.
  - No mobile navigation pattern existed for admin pages.
- `Fix implemented`:
  - Replaced fixed widths with responsive layout sizing (`md:w-72` sidebar + `flex-1` content).
  - Added mobile top bar with menu toggle.
  - Added mobile sidebar drawer with overlay/backdrop.
  - Added accessibility and UX behaviors: `Escape` close, `aria-*` menu attributes, body-scroll lock while drawer is open.
  - Updated `Sidebar` root sizing so it works in both desktop and drawer contexts.

### 8. Replace full page reload after rating submission

- `Status`: `Completed`
- `Root cause analysis`:
  - Rating submit success path used `window.location.reload()`, which resets app state and creates unnecessary UX disruption.
  - The refresh was being used as a blunt mechanism to update UI state after submission.
- `Fix implemented`:
  - Removed hard reload from `libs/features/src/portal/RatingModal.tsx`.
  - Kept success toast feedback.
  - Closed the rating modal on success (`ratingStore.setIsOpen(false)` via `setRatingModalOpen(false)`).
  - Updated license UI state through `useLicenseContext().clearLicense()` instead of reloading the page.

### 9. Review browser-only event listeners and visibility checks for cleanup consistency

- `Status`: `Completed`
- `Root cause analysis`:
  - `useAuth` and `useLicense` both registered `visibilitychange` listeners with slightly different patterns.
  - Revalidation could run unnecessarily on non-visible transitions and could overlap with in-flight requests.
  - Async callbacks could attempt state updates after unmount.
- `Fix implemented`:
  - Standardized listener setup/cleanup in both providers.
  - Added visible-only revalidation (`document.visibilityState === 'visible'`).
  - Added in-flight request guards (`isRefreshingRef` / `isValidatingRef`) to prevent duplicate refresh work.
  - Added mounted guards (`isMountedRef`) to prevent state updates after unmount.

### 10. Align admin exports and folder structure consistency

- `Status`: `Completed`
- `Root cause analysis`:
  - Admin fallback components and `withLayout` lived under `libs/admin/layout`, but the barrel export surface did not expose all layout-owned utilities.
  - App imports could drift between `~/admin` and `~/admin/layout`.
- `Fix implemented`:
  - Chose `libs/admin/layout/*` as the ownership location for layout fallbacks.
  - Expanded `libs/admin/layout/index.ts` to export `withLayout`, `DefaultLoading`, `DefaultUnauthorized`, and `FallbackShell`.
  - Standardized app usage toward a single public import path (`~/admin`) in admin app layout code.

### 11. Add lightweight docs/tests around admin auth guard behavior

- `Status`: `Completed` (docs/testability)
- `Root cause analysis`:
  - `withLayout` guard behavior (loading / unauthenticated / unauthorized / authorized) existed implicitly in branching logic, making regressions easier to reintroduce.
  - `libs/admin` does not currently have a dedicated local test target/config, so dropping in tests without setup would be incomplete.
- `Fix implemented`:
  - Added explicit guard-state type (`WithLayoutGuardState`) in `libs/admin/layout/withLayout.tsx`.
  - Added pure resolver function (`resolveWithLayoutGuardState`) that centralizes guard-state decisions.
  - Documented render priority and expected behavior with JSDoc in `withLayout.tsx`.
  - Refactored HOC render branching to use the pure resolver (behavior preserved, easier future unit testing).

## Performance and Lighthouse Follow-Up (Audit Backlog)

This section captures the static scan findings focused on `Performance and Lighthouse Standards` (`LCP`, `INP/TBT`, `CLS`, hydration-safe rendering, and script loading).

## P1 - High Impact Lighthouse / Core Web Vitals Improvements

### 12. Split root layout client logic to shrink global hydration boundary

- `Priority`: `P1`
- `Status`: `Completed`
- `Files`:
  - `apps/ecommerce-app/src/app/layout.tsx`
  - (new) client-only deep-link bridge component near app root
- `Root cause analysis`:
  - `apps/ecommerce-app/src/app/layout.tsx` is a client component and contains Capacitor deep-link listeners, analytics scripts, and provider composition.
  - This expands the client boundary for every route and increases baseline JS/hydration work, hurting `LCP` and `INP`.
- `Recommended fix`:
  - Convert root layout back to a Server Component.
  - Move Capacitor deep-link logic (`useRouter`, `useEffect`, `App.addListener`) into a small nested client component rendered inside the layout.
  - Keep analytics scripts and providers in the root, but avoid making the whole layout client-only unless strictly necessary.
- `Root cause analysis (fix context)`:
  - The root layout was client-only because it mixed global shell rendering with Capacitor deep-link effects, which widened the hydration boundary for every route.
- `Fix implemented`:
  - Converted `apps/ecommerce-app/src/app/layout.tsx` back to a server layout (removed `'use client'`, `useRouter`, and deep-link effect).
  - Added `apps/ecommerce-app/src/app/CapacitorDeepLinkBridge.tsx` as a client-only component for Capacitor deep-link handling.
  - Preserved analytics scripts and provider composition in the root layout while keeping the deep-link effect mounted via the bridge component.
- `Core Web Vitals improved`:
  - `LCP` (primary): shrinking the root client boundary reduces baseline hydration cost before first meaningful render across routes.
  - `INP` / `TBT` (secondary): less global client JavaScript and hydration work reduces early main-thread pressure.
- `React / Lighthouse patterns to use`:
  - `Suspense / Hydration Safety`
  - `Performance and Lighthouse Standards` (minimize `use client` surfaces)
- `Acceptance criteria`:
  - Root layout no longer requires `'use client'`
  - Deep-link behavior still works on Capacitor builds
  - No regressions in provider availability

### 13. Reduce homepage client-only rendering for above-the-fold content

- `Priority`: `P1`
- `Status`: `Completed`
- `Files`:
  - `apps/ecommerce-app/src/app/page.tsx`
  - `libs/features/src/portal/*` (homepage sections)
- `Root cause analysis`:
  - Homepage route is client-rendered and disables SSR for key UI (`Navbar`, `Categories`) with `dynamic(..., { ssr: false })`.
  - Several visible product sections rely on client-side query hooks, delaying rendered content until hydration/network complete.
- `Recommended fix`:
  - Make homepage route a Server Component where possible.
  - SSR above-the-fold content (hero/carousel shell, static labels, categories if possible) and defer only interaction-heavy pieces.
  - Replace `ssr: false` workarounds with hydration-stable render logic where feasible.
  - Consider server data fetching for at least the first product section shown above the fold.
- `Root cause analysis (fix context)`:
  - The homepage route became client-only because it imported the client-marked `~/features/portal` barrel and wrapped static-safe sections (`Categories`) in `ssr: false` dynamic imports.
- `Fix implemented`:
  - Converted `apps/ecommerce-app/src/app/page.tsx` to a server route by removing `'use client'`.
  - Stopped importing homepage sections from the client-only `~/features/portal` barrel in the route file; imported server-safe modules directly.
  - Removed the `ssr: false` dynamic wrapper for `Categories` and render it directly (SSR-enabled).
  - Isolated query-heavy product sections into `apps/ecommerce-app/src/app/HomeProductSections.tsx` (client wrapper) to keep the route shell server-rendered.
  - Marked `libs/features/src/portal/Carousel.tsx` as a client component so it can be imported directly from the server route without forcing the entire route to be client-only.
- `Core Web Vitals improved`:
  - `LCP` (primary): more above-the-fold homepage shell content renders from server HTML instead of waiting for route-level hydration.
  - `INP` / `TBT` (secondary): reducing the homepage client surface lowers initial JavaScript/hydration work.
- `React / Lighthouse patterns to use`:
  - `Server vs Client Components`
  - `Server State Pattern`
  - `LCP / Hydration Safety`
- `Acceptance criteria`:
  - Homepage serves meaningful above-the-fold HTML before hydration
  - Fewer/no `ssr: false` wrappers for primary content
  - No hydration mismatch warnings introduced

### 14. Server-render product detail primary data for better LCP

- `Priority`: `P1`
- `Status`: `Completed`
- `Files`:
  - `apps/ecommerce-app/src/app/product/[productId]/page.tsx`
  - `apps/ecommerce-app/src/app/product/[productId]/ProductDetailsClient.tsx`
- `Root cause analysis`:
  - Product detail route fetches the main product via client-side `useProductsQuery`, so hero image/title/price wait for hydration and client network fetch.
  - Product pages are likely conversion-critical routes where LCP matters most.
- `Recommended fix`:
  - Fetch primary product data in the server route/page (or a server component) and pass serialized product data to a smaller client component for cart actions.
  - Keep interactive mutations (add to cart) in client components only.
  - Optionally defer related-products fetch if it is not needed for first paint.
- `Root cause analysis (fix context)`:
  - The route server component only passed `productId`, so the client component blocked primary UI rendering on a client-side GraphQL query.
- `Fix implemented`:
  - Added server-side product fetch in `apps/ecommerce-app/src/app/product/[productId]/page.tsx` and passed the result as `initialProduct`.
  - Updated `ProductDetailsClient` to render from `initialProduct` immediately and only fall back to client fetching when server data is unavailable.
  - Prevented duplicate loading spinner/render blocking when `initialProduct` exists by deriving `isProductLoading`.
- `Core Web Vitals improved`:
  - `LCP` (primary): hero image, product name, and price can render in server HTML instead of waiting for client query hydration.
  - `INP` (secondary): less first-load client work before meaningful content is visible reduces perceived interaction delay risk.
- `React / Lighthouse patterns to use`:
  - `Server State Pattern`
  - `Server vs Client Components`
  - `LCP-first rendering`
- `Acceptance criteria`:
  - Product hero/title/price render in server HTML
  - Add-to-cart behavior remains functional
  - Product page LCP content no longer depends on client query hydration

### 15. Optimize homepage carousel hero for LCP (Swiper + image hints)

- `Priority`: `P1`
- `Status`: `Completed`
- `Files`:
  - `libs/features/src/portal/Carousel.tsx`
  - `apps/ecommerce-app/src/app/page.tsx`
- `Root cause analysis`:
  - Homepage hero uses Swiper (JS + CSS) in above-the-fold content.
  - Carousel images do not provide explicit `priority`/`sizes` hints for the LCP candidate.
- `Recommended fix`:
  - Mark the first visible slide image as `priority`.
  - Add `sizes` to carousel images for responsive downloads.
  - Consider rendering a static first hero image and hydrating Swiper after initial paint.
  - Review whether autoplay/pagination can be delayed or reduced for first render.
- `Root cause analysis (fix context)`:
  - The carousel hero already had image dimensions, but it lacked explicit LCP loading priority and responsive size hints, so the browser could delay or over-download the first slide image.
- `Fix implemented`:
  - Updated `libs/features/src/portal/Carousel.tsx` to mark the first slide (`index === 0`) as the likely LCP image and load it with `priority`.
  - Added responsive `sizes` for carousel hero images to improve source selection and reduce oversized downloads.
  - Improved slide `alt` text for better semantics/debuggability.
- `Core Web Vitals improved`:
  - `LCP` (primary): first hero slide is prioritized and receives responsive image sizing hints, improving first meaningful visual paint of the homepage hero.
  - `INP` (secondary): smaller image payload selection can reduce network/main-thread pressure during initial load on slower devices.
- `React / Lighthouse patterns to use`:
  - `LCP Patterns`
  - `Code Splitting / Defer heavy UI`
- `Acceptance criteria`:
  - Hero/LCP image has correct loading priority and responsive sizing hints
  - Carousel does not regress UX on desktop/mobile

## P2 - Medium Impact Performance / Responsiveness Improvements

### 16. Lazy-load heavy modal logic in global top bar (`RatingModal`)

- `Priority`: `P2`
- `Status`: `Completed`
- `Files`:
  - `libs/features/src/portal/Highlight.tsx`
  - `libs/features/src/portal/RatingModal.tsx`
- `Root cause analysis`:
  - `RatingModal` (form + zod + dialog + axios) is mounted inside the always-visible `Highlight` bar on many pages even when closed.
  - This increases baseline JS bundle and hydration cost for routes where the modal is rarely used.
- `Recommended fix`:
  - Lazy-load `RatingModal` with `dynamic()` or conditional import when `ratingStore.isOpen === true`.
  - Keep only the trigger/open-state logic mounted in the top bar.
- `Root cause analysis (fix context)`:
  - `Highlight` imported and rendered `RatingModal` unconditionally, so the modal/form/validation bundle was part of the initial top-bar path even when the dialog stayed closed.
- `Fix implemented`:
  - Replaced the direct `RatingModal` import in `libs/features/src/portal/Highlight.tsx` with a dynamic import (`LazyRatingModal`).
  - Read `rating.isOpen` from the global store and only mount the modal component when it is actually open.
  - Kept `LicenseTimer` and the top bar UI mounted so the modal can still be triggered via store state changes.
- `Core Web Vitals improved`:
  - `INP` / `TBT` (primary): reduces initial JS and hydration work on pages with the top bar by deferring heavy modal/form code until needed.
  - `LCP` (secondary): smaller initial client payload reduces contention with rendering/network work on first load.
- `React / Lighthouse patterns to use`:
  - `Code Splitting`
  - `Headless / Inversion of Control` (optional trigger + modal separation)
- `Acceptance criteria`:
  - `RatingModal` code is not included in the initial bundle path unless needed
  - Modal still opens and submits correctly

### 17. Reduce main-thread churn from `LicenseTimer` polling

- `Priority`: `P2`
- `Status`: `Completed`
- `Files`:
  - `libs/features/src/portal/LicenseTimer.tsx`
- `Root cause analysis`:
  - Timer runs every second and reads localStorage + updates state continuously, which can add main-thread noise and rerenders on every page showing the top bar.
- `Recommended fix`:
  - Only start interval when a license expiry timestamp exists.
  - Reduce update frequency when far from expiry (for example minute-level until near expiration).
  - Avoid repeated localStorage reads after expiry is known unless a visibility or storage event indicates change.
- `Root cause analysis (fix context)`:
  - `LicenseTimer` performed a 1-second interval on every page with the top bar, and each tick read localStorage plus updated state even when no license expiry existed.
- `Fix implemented`:
  - Removed per-second localStorage polling from `LicenseTimer` and replaced it with storage/visibility-triggered expiry resync.
  - Timer interval now starts only when `expiresAt` exists.
  - Added adaptive interval frequency (1s near expiry, 15s/60s when farther away) to reduce unnecessary updates.
  - Removed the unused `useLicenseContext` dependency from the expiry effect.
- `Core Web Vitals improved`:
  - `INP` / `TBT` (primary): reduces continuous main-thread work and rerenders from always-on 1s polling in the global top bar.
  - `LCP` (secondary, indirect): lowers initial and background client work competing with rendering on low-end devices.
- `React / Lighthouse patterns to use`:
  - `Custom Hooks Pattern`
  - `INP/TBT Patterns` (avoid continuous work)
- `Acceptance criteria`:
  - Timer still updates accurately enough for UX
  - Reduced interval work/rerenders during normal browsing

### 18. Add `sizes` for `next/image fill` usages on key UI surfaces

- `Priority`: `P2`
- `Status`: `Completed`
- `Files`:
  - `apps/ecommerce-app/src/app/product/[productId]/ProductDetailsClient.tsx`
  - `libs/features/src/portal/Navbar.tsx`
  - `libs/features/src/portal/Cart/Items.tsx`
  - `apps/ecommerce-app/src/app/orders/page.tsx`
  - `apps/ecommerce-app/src/app/admin/[slug]/ManageOrders.tsx`
- `Root cause analysis`:
  - `fill` images without `sizes` can cause larger-than-needed image downloads, affecting bandwidth and LCP.
- `Recommended fix`:
  - Add explicit `sizes` for each `fill` image based on actual rendered width:
    - thumbnails (`40px`, `64px`, etc.)
    - responsive product hero image (breakpoint-based sizes)
  - Verify no layout regressions after adding `sizes`.
- `Root cause analysis (fix context)`:
  - Several key `fill` images on product and order/cart surfaces were missing `sizes`, causing the browser to assume a much larger rendered width (often close to viewport width) and select oversized image candidates.
  - This increased image transfer cost on critical and repeated UI surfaces, especially the product hero and list thumbnails.
- `Fix implemented`:
  - Added responsive `sizes` to the product hero image in `apps/ecommerce-app/src/app/product/[productId]/ProductDetailsClient.tsx`.
  - Added fixed-size thumbnail `sizes` for search, order list, and admin order dialog thumbnails in `libs/features/src/portal/Navbar.tsx`, `apps/ecommerce-app/src/app/orders/page.tsx`, and `apps/ecommerce-app/src/app/admin/[slug]/ManageOrders.tsx`.
  - Added constrained responsive `sizes` for cart item image cards in `libs/features/src/portal/Cart/Items.tsx` based on the component max-width (`220px` / `260px`).
- `Core Web Vitals improved`:
  - `LCP` (primary): improves browser image candidate selection for the product hero and other visible imagery, reducing oversized downloads on initial render.
  - `INP` (secondary, indirect): smaller image payloads can reduce image decode/network contention during page interaction on slower devices.
- `React / Lighthouse patterns to use`:
  - `LCP Patterns`
  - `CLS Patterns`
- `Acceptance criteria`:
  - All key `fill` images include `sizes`
  - No visual regressions in thumbnails or hero image rendering

### 19. Review analytics script strategy to reduce first-load overhead

- `Priority`: `P2`
- `Status`: `Completed`
- `Files`:
  - `apps/ecommerce-app/src/app/layout.tsx`
- `Root cause analysis`:
  - Both GTM and direct GA scripts are loaded in root layout, which may duplicate tracking responsibilities and increase early JS/network work.
  - `beforeInteractive` GTM can compete with critical rendering depending on tag configuration.
- `Recommended fix`:
  - Confirm whether GA is already managed inside GTM; remove duplicate initialization if redundant.
  - Keep only the minimum required analytics on initial load.
  - Audit tag timing/strategy to protect `LCP` on landing pages.
- `Root cause analysis (fix context)`:
  - Root layout initialized both GTM and direct GA (`gtag.js` + `gtag('config')`), which duplicates analytics bootstrap work on every route.
  - The only direct `gtag` dependency in the app was checkout `client_id` retrieval, so the app paid global script cost for a single checkout-specific need.
- `Fix implemented`:
  - Removed direct GA script loading and `gtag` initialization from `apps/ecommerce-app/src/app/layout.tsx`, keeping GTM as the single analytics bootstrap path.
  - Updated `libs/features/src/portal/Checkout/OrderSummary.tsx` to read GA client ID from the standard `_ga` cookie instead of requiring `window.gtag('get', ...)`.
  - Checkout mutation now still sends `clientId` when available, but no longer depends on a root-level GA runtime.
- `Core Web Vitals improved`:
  - `LCP` (primary): reduces duplicate analytics script/network and initialization work during first load across all pages.
  - `INP` / `TBT` (secondary): lowers early main-thread scripting overhead by removing redundant GA bootstrap code.
- `React / Lighthouse patterns to use`:
  - `Network and Script Loading`
  - `Best Practices`
- `Acceptance criteria`:
  - No duplicate analytics initialization
  - No regression in analytics tracking events required by the business

## P3 - Low Effort / High Signal Quality Improvements

### 20. Add App Router metadata and modern font loading strategy

- `Priority`: `P3`
- `Status`: `Completed`
- `Files`:
  - `apps/ecommerce-app/src/app/layout.tsx`
  - route files under `apps/ecommerce-app/src/app/*`
- `Root cause analysis`:
  - No App Router metadata exports / `next/font` usage were identified in the scan, leaving Lighthouse SEO and font-loading optimization opportunities on the table.
- `Recommended fix`:
  - Add root and route-level `metadata` / `generateMetadata` for core pages.
  - Adopt `next/font` for primary typography to improve loading and reduce CLS risk from late font swaps.
- `Root cause analysis (fix context)`:
  - The App Router had no `metadata` exports, so core routes relied on generic browser titles and missed structured page-level metadata for Lighthouse SEO checks.
  - Typography relied on default font loading behavior instead of `next/font`, increasing the risk of font-related layout shifts and inconsistent rendering during initial paint.
- `Fix implemented`:
  - Added root App Router `metadata` and `next/font` (`Inter`) in `apps/ecommerce-app/src/app/layout.tsx`, including a title template and base app description.
  - Added route metadata for the homepage in `apps/ecommerce-app/src/app/page.tsx`.
  - Added `generateMetadata` for the dynamic product route in `apps/ecommerce-app/src/app/product/[productId]/page.tsx`.
  - Added segment metadata layouts for `cart`, `cart/checkout`, and `orders` routes so client pages still receive route-specific metadata.
- `Core Web Vitals improved`:
  - `CLS` (primary): `next/font` reduces layout shift risk from late web font swaps by using optimized font loading and fallback handling.
  - `LCP` (secondary): optimized font delivery can reduce render-blocking behavior for text-heavy first paint content on slower devices.
  - `SEO` (Lighthouse category, non-CWV): route-level metadata improves page titles/descriptions for search and audit quality.
- `React / Lighthouse patterns to use`:
  - `SEO`
  - `CLS Patterns`
- `Acceptance criteria`:
  - Core routes expose meaningful metadata
  - Font loading is configured through `next/font` (or equivalent stable strategy)

### 21. Improve product static params build performance (`generateStaticParams`)

- `Priority`: `P3`
- `Status`: `Completed`
- `Files`:
  - `apps/ecommerce-app/src/app/product/[productId]/page.tsx`
- `Root cause analysis`:
  - `generateStaticParams()` uses `cache: 'no-store'`, which forces uncached requests during build-time param generation and can slow builds significantly.
- `Recommended fix`:
  - Replace `cache: 'no-store'` with a build-appropriate caching strategy (or omit it) for static param collection.
  - Keep fallback behavior for empty datasets, but avoid unnecessary uncached requests in build pipelines.
- `Root cause analysis (fix context)`:
  - The backlog item was based on an earlier version of `apps/ecommerce-app/src/app/product/[productId]/page.tsx` that declared `generateStaticParams()` with an uncached fetch (`cache: 'no-store'`).
  - The current route implementation no longer defines `generateStaticParams()`, so the specific build-time no-store regression path is no longer present.
- `Fix implemented`:
  - Verified the current product route no longer includes `generateStaticParams()` in `apps/ecommerce-app/src/app/product/[productId]/page.tsx`, which removes the prior `cache: 'no-store'` build-time cost.
  - Marked this task completed as an obsolete/regressed-away issue in the current code state.
- `Core Web Vitals improved`:
  - No direct Core Web Vitals change (build-time/deploy pipeline optimization task).
  - Indirect benefit: faster builds can improve iteration/deploy speed, but do not directly change runtime `LCP`/`INP`/`CLS` in production clients.
- `React / Lighthouse patterns to use`:
  - `Network and Loading Patterns`
  - Build-time optimization (supports faster deploy feedback loops)
- `Acceptance criteria`:
  - Product static param generation remains correct
  - Build-time fetching is not forced to `no-store` without a strong reason
