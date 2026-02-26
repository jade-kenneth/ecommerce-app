# Lighthouse Patterns Guide

This guide summarizes practical frontend patterns that consistently improve Lighthouse scores and Core Web Vitals without wasting time on low-impact tweaks.

It is written for modern React/Next.js apps (including App Router) and should be used as a build/review checklist, not just a one-time optimization pass.

## Core Principle

Optimize what users feel first:

- `LCP` (Largest Contentful Paint): how fast the main content appears
- `INP` (Interaction to Next Paint): how responsive the UI feels
- `CLS` (Cumulative Layout Shift): how stable the layout is

If these are healthy, Lighthouse performance scores usually improve as a result.

Note:

- `TBT` (Total Blocking Time) is still useful in Lighthouse (lab) as a proxy for responsiveness, but `INP` is the user-facing Core Web Vitals metric to care about in production.

## 1. LCP Patterns (Make the Main Thing Load Fast)

LCP is usually your hero image, hero section, or main heading/content block.

### Priorities

- Make the LCP element small, optimized, and discoverable early
- Remove render-blocking work before the LCP is painted
- Avoid lazy-loading content that is visible on initial load

### Do

- Serve correctly sized images (avoid shipping huge originals)
- Use modern image formats (`WebP`, `AVIF`) when possible
- Preload the LCP image (hero) if it is above the fold
- Preload only critical fonts used in the first viewport
- Keep critical CSS small
- Defer or delay non-critical scripts

### Avoid

- Lazy-loading the hero image
- Loading multiple heavy fonts/styles before first paint
- Injecting large JS bundles that block rendering

### Next.js Notes

- Use `next/image` for responsive sizing and optimized delivery
- Mark the hero image as high priority when it is the LCP candidate
- Prefer Server Components for above-the-fold content when possible

## 2. INP / TBT Patterns (Keep the Main Thread Responsive)

Users feel slow interaction when the main thread is blocked by JavaScript, hydration, or expensive rendering work.

### Priorities

- Reduce shipped JavaScript
- Break up long tasks
- Hydrate only what needs interactivity

### Do

- Remove unused dependencies and large client-side libraries
- Code-split at route and feature boundaries
- Lazy-load heavy UI (charts, editors, large modals, maps)
- Break expensive work into smaller chunks
- Move CPU-heavy work to Web Workers when needed
- Keep `use client` boundaries small in Next.js App Router

### Avoid

- Shipping utility-heavy bundles to the client for simple pages
- Rendering large interactive trees above the fold if they are not needed immediately
- Putting heavy computations directly in render paths

### React Patterns That Help

- Feature colocation (easier to split and lazy-load by feature)
- Server state libraries/hooks for API data (instead of duplicated local async logic)
- Explicit async states (`loading`, `success`, `error`) to avoid unnecessary rerenders

## 3. CLS Patterns (Keep Layout Stable)

CLS issues usually come from images, embeds, fonts, and UI injected after initial render.

### Do

- Always set `width`/`height` or `aspect-ratio` for:
  - images
  - videos
  - embeds
  - ad slots
- Reserve space for UI that appears after load:
  - banners
  - alerts
  - cookie notices
- Use `font-display: swap` (or equivalent)
- Preload only critical fonts to reduce layout reflow

### Avoid

- Injecting new content above existing content after load without reserved space
- Loading fonts late that replace text metrics significantly
- Rendering image containers with unknown dimensions

## 4. Network and Loading Patterns (High Impact, Often Missed)

### Do

- Use CDN caching for static assets
- Use immutable cache headers for versioned assets
- Reduce request count (bundle icons intelligently, avoid fragmented asset requests)
- Inline only tiny critical assets when justified
- Prefetch only likely next routes/assets

### Avoid

- Aggressive prefetching of low-probability routes
- Loading many separate icon/image requests for UI chrome
- Treating cache policy as an afterthought

## 5. React / Next.js Architecture Patterns That Improve Lighthouse

Performance is often a side effect of architecture decisions.

### Keep Renders Cheap

- Split very large components into smaller units
- Avoid broad context updates for frequently changing values
- Use selectors for global stores when available
- Memoize only when it prevents real expensive rerenders (not by default)

### Use the Right State for the Job

- Server state -> query/data hooks (GraphQL generated hooks, SWR, TanStack Query)
- Local UI state -> component state
- Global UI state -> small scoped store or context with selectors

### Be Intentional With Hydration

- Default to Server Components in App Router
- Keep client components small and focused
- Avoid hydration-unstable render logic (random values, browser APIs, pathname-only visual differences without mount guard)

## 6. Lighthouse Categories Beyond Performance (Fast Wins)

### Accessibility

- Use proper labels and semantic HTML
- Ensure keyboard access and visible focus states
- Maintain sufficient color contrast
- Add accessible names for buttons/icons/inputs/images

### Best Practices

- Avoid console errors and runtime warnings
- Avoid unsafe browser APIs and mixed content
- Handle script errors and failed integrations gracefully

### SEO

- Set meaningful page titles and metadata
- Use structured heading hierarchy (`h1` -> `h2` ...)
- Ensure links are crawlable
- Add canonical URLs when applicable

## 7. A Practical Optimization Routine (Per Page / Feature)

Use this sequence to avoid premature micro-optimizations:

1. Run Lighthouse and identify the current LCP element.
2. Fix the biggest LCP issue first (hero image, fonts, render-blocking resources).
3. Reduce main-thread blocking (bundle size, code splitting, heavy client components).
4. Fix CLS by reserving space and stabilizing fonts/media.
5. Re-run Lighthouse and compare before/after.
6. Stop when improvements become low-impact relative to effort.

## 8. PR Review Checklist (Lighthouse-Oriented)

- Is the above-the-fold content optimized for LCP?
- Are large client-only components lazy-loaded or split when possible?
- Are image dimensions/aspect ratios defined to prevent CLS?
- Are scripts and SDKs guarded and non-blocking where possible?
- Is hydration stable (no browser-only values in initial SSR render)?
- Are there unnecessary rerenders or broad state updates?
- Did the change introduce console errors/warnings?

## 9. Anti-Patterns to Avoid

- Optimizing Lighthouse score only, not user experience
- Lazy-loading critical above-the-fold content
- Adding heavy client libraries for simple UI
- Full page reloads after mutations when local/state updates would work
- Fixing hydration warnings by disabling SSR instead of stabilizing render logic
- Overusing memoization without profiling evidence

## Summary

The best Lighthouse improvements usually come from:

- faster LCP content delivery
- less JavaScript and lighter hydration
- stable layout rendering
- disciplined React/Next.js architecture choices

Treat Lighthouse as feedback, not the goal. The goal is fast, stable, responsive UI for real users.
