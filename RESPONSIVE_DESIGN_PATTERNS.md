# Responsive Design Patterns

## Layout and Containers

### Main Wrapper / Container Width
- Should not be fixed (avoid `width: 1200px`)
- Use `max-width` + `width: 100%` + padding

### Spacing System
- Padding/margins should scale down on mobile
- Avoid huge whitespace that forces scrolling

### Section Stacking
- Desktop: side-by-side
- Mobile: stack vertically in the right order

## Grid and Flex Behavior

### Grid Columns
- Desktop: `grid-template-columns: repeat(3/4, 1fr)`
- Mobile: switch to `repeat(1, 1fr)` or `repeat(2, 1fr)` depending on content
- Watch for: cards getting too small, uneven heights, overflow

### Flex Rows
- Desktop: `flex-row`
- Mobile: `flex-col` (or wrap)
- Watch for: items squeezed because `flex-wrap: nowrap`

### Flex Wrapping
- Chips/tags/buttons should wrap instead of overflow

### Ordering
- Sometimes image/text order must swap on mobile (e.g., image first)

## Typography (Text)

### Font Sizes
- Headings should scale down (no giant H1 that pushes everything)
- Body text should stay readable (usually 14–16px minimum)

### Line Length / Readability
- Avoid long unbroken lines on mobile

### Line Height
- Increase a bit on mobile for readability

### Text Overflow
- Long titles/usernames should wrap or truncate (ellipsis) cleanly

## Images and Media

### Responsive Images
- Must scale with container (`max-width: 100%; height: auto`)

### Aspect Ratio
- Avoid stretched images; use `object-fit: cover/contain`

### Hero / Banner Images
- Ensure focal point still looks good on mobile (cropping can cut faces/text)

### Galleries / Carousels
- Swipe friendly
- Pagination dots visible

### Video Embeds
- Must be responsive (no fixed iframe width)

## Buttons and Tap Targets

### Tap Size
- Buttons/links should be easy to tap (no tiny icons)

### Primary CTA Visibility
- CTA should stay visible without scrolling too much

### Button Groups
- Desktop: horizontal
- Mobile: stack or wrap

### Spacing
- Avoid buttons too close together (mis-taps)

## Navigation (Most Common Mobile Breakpoints Issue)

### Navbar
- Switch to hamburger/drawer
- Logo + menu shouldn’t collide

### Dropdowns
- Must open within viewport
- Should be touch-friendly (not hover-only)

### Sticky Headers
- Should not cover content or block inputs

## Forms (Most Painful on Mobile If Not Responsive)

### Input Widths
- `width: 100%` on mobile

### Label + Input Layout
- Desktop: label beside input
- Mobile: label above input

### Keyboard Behavior
- Correct input types (`email`, `number`)

### Error Messages
- Should wrap and not break layout

### Multi-Column Forms
- Must collapse to single column

## Tables and Dense Content

### Tables
- Need a mobile strategy:
  - Horizontal scroll container, or
  - Convert to stacked cards, or
  - Hide less important columns

### Data Grids
- Must not overflow screen

## Cards and Content Blocks

### Card Width
- Must shrink cleanly without text/image overflow

### Card Grids
- Desktop 3–4 columns -> mobile 1 column (or 2 if small cards)

### Equal Height Assumptions
- Avoid layouts that break when one card has longer text

## Overflows and Breakpoints (The "Silent Killers")

### Horizontal Scrolling
- Any element causing sideways scroll is a bug (usually fixed widths)

### Long Words / URLs
- Should wrap (`word-break` / `overflow-wrap`)

### Absolute Positioned Elements
- Badges, floating buttons, decorations can overlap on mobile

## Modals, Drawers, Popups

### Modal Width / Height
- Should fit mobile viewport and allow scrolling inside

### Close Button
- Easy to tap, not off-screen

### Body Scroll Lock
- Background shouldn’t scroll under modal

## Performance-Related Responsiveness (Affects Mobile UX)

### Image Sizes
- Don’t load huge desktop images on mobile

### Lazy Loading
- For below-the-fold images/lists
