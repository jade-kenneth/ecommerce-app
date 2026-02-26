# Copilot Instructions (Project Standard)

Use these instructions as the default implementation standard for React work in this repository.

This project uses:

- React
- Next.js App Router
- Monorepo structure (`apps/*`, `libs/*`)
- GraphQL generated hooks (Apollo-style usage)

## Core Rule

Prefer simple, readable, feature-focused React code. Introduce abstraction only when repetition is real and the abstraction improves maintainability.

## React Patterns To Prefer (Default)

### 1. Custom Hooks for Reusable Logic

- Extract reusable behavior into hooks.
- Keep UI components focused on rendering and interaction.
- Place feature-specific hooks next to the feature that owns them.

Prefer:

- `features/<feature>/useX.ts`
- `libs/<module>/...` for shared hooks

Avoid:

- dumping unrelated hooks into a single global folder

### 2. Provider Pattern for App-Wide Services

Use providers for cross-app dependencies and services such as:

- auth/session
- API client/cache
- cart/global app state
- theme/config

Rules:

- Keep provider responsibilities narrow
- Compose providers at app boundaries (root/layout)
- Do not use providers for local component state

### 3. Feature Colocation (Primary Project Organization)

Organize files by feature/domain, not only by file type.

Prefer:

```txt
features/
  auth/
    AuthProvider.tsx
    useAuth.ts
    types.ts
    utils.ts
```

Avoid:

```txt
components/
hooks/
types/
utils/
```

when it separates files that belong to the same feature.

### 4. Server State via Data Hooks (GraphQL / Query Hooks)

Treat server state separately from client UI state.

Prefer:

- generated GraphQL hooks (e.g. `useProductsQuery`, `useMyOrdersQuery`)
- query/mutation abstractions with caching and invalidation

Avoid:

- repeating manual `useEffect` + `useState` fetch logic in multiple components
- mixing server state and local UI flags in the same ad-hoc structure

### 5. HOCs Only for Page-Level Cross-Cutting Concerns

Use Higher-Order Components for concerns like:

- auth gates
- role/permission checks
- layout wrappers
- page-level analytics/instrumentation

Prefer hooks for local reusable logic.

### 6. Suspense and App Router Boundaries

Use Suspense and App Router boundaries intentionally:

- define stable loading states
- keep server/client output consistent
- avoid hydration mismatches

## Additional Patterns (Use When Appropriate)

### Compound Components

Use for flexible APIs in shared UI components and design systems.

Example:

```tsx
<Modal>
  <Modal.Header />
  <Modal.Body />
  <Modal.Footer />
</Modal>
```

### Controlled vs Uncontrolled Inputs

- Use controlled inputs for validation-heavy forms and synchronized UI state.
- Use uncontrolled inputs when performance or library integration requires it.
- Mixing both is acceptable when using form libraries.

### Headless Components

Prefer headless logic + custom UI for reusable, design-system-aligned interactions.

### State Machines / Explicit State Enums

Prefer explicit status values (or reducers/state machines) for complex async flows:

```ts
status: 'idle' | 'loading' | 'success' | 'error';
```

Avoid impossible combinations of multiple booleans.

### Inversion of Control

Pass behavior/rendering into reusable components when flexibility is needed:

- callbacks (`onClose`, `onSelect`)
- render functions (`renderItem`)

## Next.js App Router Standards

### Server vs Client Components

- Default to Server Components unless client interactivity is required.
- Add `'use client'` only when needed (hooks, browser APIs, event handlers, local state).
- Keep client components small and focused.

### Hydration Safety (Mandatory)

Do not render unstable values during SSR/client hydration without safeguards.

Avoid in initial render:

- `Date.now()`
- `Math.random()`
- direct `window`, `document`, `localStorage`, `navigator` usage
- pathname-dependent styling that differs before/after mount

If browser-only behavior is required:

- defer to `useEffect`
- use mount flags for client-only rendering differences
- keep server and first client render markup stable

### Loading / Empty / Error States

For data-driven UI, provide:

- loading state
- empty state
- error state

Make these responsive and consistent with the feature UI.

## Performance and Lighthouse Standards (Default)

Follow `LIGHTHOUSE_PATTERN.md` as the performance implementation and review standard for frontend work.

### Core Web Vitals Priority Order

Prioritize changes that improve:

- `LCP` (fast main content render)
- `INP` / `TBT` (responsive interaction / low main-thread blocking)
- `CLS` (stable layout with no jumping)

Prefer fixing the largest user-visible bottleneck first instead of making many low-impact tweaks.

### LCP (Largest Contentful Paint)

- Optimize the likely LCP element first (usually hero image/hero section/main heading block)
- Use correctly sized images and modern formats when possible
- Do not lazy-load above-the-fold hero content
- Preload only critical hero assets/fonts
- Reduce render-blocking CSS/scripts before first paint
- In Next.js, use `next/image` and mark the hero image as high priority when it is the LCP candidate
- For `next/image` with `fill`, always provide a `sizes` prop that matches the real rendered width (fixed thumbnails use fixed sizes like `40px`/`64px`; responsive heroes use breakpoint-based `sizes`)

### INP / TBT (Responsiveness)

- Reduce client-side JavaScript before adding micro-optimizations
- Code-split by route and lazy-load heavy components (charts, editors, large modals, maps)
- Keep `use client` surfaces small in App Router
- Avoid long synchronous tasks in render/event handlers
- Prefer server-rendered output when interactivity is not needed immediately
- Do not mount heavy hidden UI (forms/modals/editors) by default; lazy-load and conditionally mount them when opened
- Avoid continuous polling in always-visible UI; prefer event-driven sync (`visibilitychange`, `storage`, subscriptions) and adaptive intervals when polling is necessary

### CLS (Layout Stability)

- Always define dimensions or `aspect-ratio` for media (images/videos/embeds)
- Reserve space for UI that appears after load (banners, alerts, notices)
- Use font loading strategies that reduce reflow (for example `font-display: swap`)
- Do not inject content above existing content without reserved space

### Network and Script Loading

- Use cache-friendly static asset delivery (CDN + immutable caching where applicable)
- Prefetch selectively (likely next routes only)
- Treat external scripts/SDKs as optional at runtime and guard initialization
- Avoid turning many tiny assets into unnecessary network requests
- Avoid duplicate analytics/tag bootstraps (for example, initializing both a tag manager and direct analytics runtime globally unless there is a verified requirement)
- Keep route-specific tracking dependencies local to the route/component when possible instead of loading extra global scripts for a narrow use case

### App Router Performance Defaults

- Default to server components for route shells and layouts; isolate browser-only logic into small client bridge/components
- Do not mark an entire route/page as `'use client'` just because one section needs client hooks; move the interactive portion into a colocated client child
- Use `dynamic(..., { ssr: false })` only for truly browser-only widgets after attempting a hydration-stable render
- For client-only pages that still need metadata, add segment `layout.tsx` metadata exports instead of skipping route metadata entirely

### Metadata and Font Loading Standards

- Add App Router `metadata` / `generateMetadata` for core user-facing routes
- Prefer `next/font` for app typography and apply it at the root layout unless the project already uses another optimized strategy
- Use a root title template (`default` + `template`) so route titles stay consistent

### Lighthouse-Related Quality Gates

For page-level UI changes, Copilot should preserve or improve:

- Accessibility basics (labels, semantics, focus states, contrast)
- Best Practices (no console/runtime warnings from the change)
- SEO basics (page title/metadata/heading structure where relevant)

When making performance-focused changes, explicitly state which metric is expected to improve (`LCP`, `INP`/`TBT`, `CLS`) and why.

## Responsive Design Standards (Default)

Follow `RESPONSIVE_DESIGN_PATTERNS.md` as the responsive implementation and review standard for frontend work.

### Layout and Containers

- Do not use fixed container widths for page wrappers (avoid patterns like `width: 1200px`)
- Prefer `max-width` + `width: 100%` + responsive padding
- Scale padding/margins down on mobile
- Avoid excessive whitespace that creates unnecessary mobile scrolling
- Stack desktop side-by-side sections vertically on mobile in the correct reading order

### Grid and Flex Behavior

- Collapse desktop grids (`3-4` columns) to `1-2` columns on mobile based on content density
- Watch for card shrinkage, overflow, and uneven heights in responsive grids
- Convert horizontal flex layouts to `flex-col` or wrapping layouts on mobile
- Avoid `flex-wrap: nowrap` when it causes squeezed content
- Ensure chips/tags/button groups wrap instead of overflowing
- Intentionally reorder content on mobile when needed (for example image before text)

### Typography and Text

- Scale headings down for smaller screens (avoid oversized H1s that push content below the fold)
- Keep body text readable on mobile (typically `14-16px` minimum)
- Prevent long unbroken lines from breaking mobile layouts
- Use readable line-height on mobile
- Ensure long titles/usernames wrap or truncate cleanly (`ellipsis` where appropriate)

### Images and Media

- Make images responsive (`max-width: 100%; height: auto`)
- Preserve aspect ratio and avoid stretching (`object-fit: cover/contain` as needed)
- Verify hero/banner crops still preserve focal points on mobile
- Make carousels swipe-friendly and keep pagination indicators visible
- Ensure embedded video/iframes are responsive (no fixed-width embeds)

### Buttons and Tap Targets

- Keep buttons/links easy to tap (avoid tiny icon-only targets unless padded)
- Keep primary CTAs visible without excessive scrolling
- Stack or wrap button groups on mobile when horizontal layouts no longer fit
- Preserve spacing between actions to reduce mis-taps

### Navigation

- Switch navbars to hamburger/drawer patterns when space is constrained
- Prevent logo and navigation controls from colliding
- Ensure dropdowns open within the viewport
- Do not rely on hover-only interactions for mobile navigation
- Sticky headers must not cover content or block form inputs

### Forms

- Use `width: 100%` inputs on mobile
- Convert label/input side-by-side layouts into vertical layouts on mobile
- Use correct mobile-friendly input types (`email`, `number`, etc.)
- Ensure validation/error messages wrap without breaking layout
- Collapse multi-column forms to a single column on mobile

### Tables and Dense Content

- Always provide a mobile strategy for tables:
  - horizontal scroll container, or
  - stacked card representation, or
  - hidden lower-priority columns
- Prevent data grids from overflowing the viewport

### Cards and Content Blocks

- Ensure cards shrink cleanly without text or image overflow
- Collapse card grids from desktop multi-column layouts to mobile `1-2` columns
- Do not assume equal content heights; layouts must tolerate longer text

### Overflows and Breakpoints

- Treat horizontal page scrolling as a bug unless intentionally required
- Handle long words/URLs with wrapping (`word-break`, `overflow-wrap`)
- Check absolute-positioned badges/floating UI/decorations for mobile overlap issues

### Modals, Drawers, and Popups

- Fit modal dimensions to the mobile viewport and allow internal scrolling when needed
- Keep close controls visible and easy to tap
- Prevent background scroll while overlays are open when expected (`body` scroll lock)

### Mobile UX and Performance (Responsive Behavior)

- Do not send oversized desktop images to mobile devices when smaller assets are sufficient
- Use lazy loading for below-the-fold images and large content lists where appropriate

### Responsive Review Requirement

For user-facing UI changes, Copilot should verify or preserve:

- no horizontal overflow at common mobile widths
- readable typography and tap targets
- correct stacking/order of core content and actions
- responsive media behavior (images/video/hero crops)
- form/navigation usability on touch devices

## Component Design Rules

### Keep Components Focused

- One component should ideally do one thing well.
- Extract helpers/hooks before a component becomes hard to read.
- Prefer composition over deeply nested conditionals.

### API Design

- Prefer declarative props and composition
- Avoid prop overload and ambiguous booleans
- Use explicit prop names for behavior and state

### Accessibility

Always consider:

- semantic HTML
- keyboard interaction
- focus states
- `aria-*` attributes where needed
- accessible labels for controls and images

## Styling and UI Consistency

- Follow existing project UI patterns before introducing new visual systems.
- Keep responsive behavior explicit (mobile-first).
- Use intentional loading and unauthorized/empty states.
- Avoid visual changes that break existing layout conventions unless requested.

## Data and State Boundaries

Separate clearly:

- server state (API data, cached query results)
- client state (UI toggles, local form inputs)
- session/auth state (provider-managed)

Do not duplicate the same source of truth across multiple layers unless there is a clear synchronization strategy.

## Monorepo Conventions

- `apps/*`: application entrypoints and route composition
- `libs/*`: shared features, providers, UI, hooks, utilities
- Prefer adding shared logic to `libs/*` only when actually reused or intended for reuse
- Keep feature-specific code in the owning module

## Implementation Workflow (Copilot Behavior)

When generating code:

1. Match existing file/module patterns first.
2. Prefer the simplest pattern that fits.
3. Use feature colocation.
4. Use hooks/providers/query hooks consistently with current code.
5. Add loading/error/empty states when async data is involved.
6. Avoid hydration-unstable output in App Router.
7. Prefer choices that protect Core Web Vitals (LCP/INP/CLS) for user-facing pages.
8. For performance fixes, document the targeted Core Web Vital(s) and the mechanism (image sizing, reduced JS, layout stability, etc.).

## Avoid (Common Anti-Patterns)

- Over-abstracting early
- Repeating fetch logic across components
- Global utility dumping for feature-specific code
- HOCs for local logic that should be a hook
- Browser-only APIs during SSR render
- UI that renders differently on server and initial client render
- Lazy-loading critical above-the-fold content
- Full page reloads after local mutations when state updates/refetch will do
- Fixing hydration warnings by disabling SSR instead of stabilizing render logic

For cross-feature regression-prevention standards (auth guards, hydration safety, listener cleanup, optimistic IDs, script integration guards, etc.), follow `REGRESSION.md`.

## Quick Pattern Selection Guide

- Reusable logic inside components -> custom hook
- App-wide dependency/service -> provider
- Page wrapper/auth/layout concern -> HOC
- Flexible subcomponent API -> compound component
- Complex state transitions -> reducer/state machine
- Reusable logic with custom UI -> headless component pattern

## Final Principle

Patterns are tools, not goals. Choose the pattern that improves clarity, maintains consistency with this repo, and reduces future maintenance cost.
