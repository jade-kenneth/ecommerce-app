# GA4 + GTM Setup

This document captures the GA4 (gtag.js) and Google Tag Manager (GTM) setup that was just added to the Next.js app.

## What Was Added

1. **GTM script in `<head>` (as high as possible)**
   - Placed in the root layout using `next/script` with `strategy="beforeInteractive"`.
   - Container ID: `GTM-TPVR9TRQ`.

2. **GTM `<noscript>` fallback right after `<body>`**
   - Inserted immediately after the opening `<body>` tag.
   - Uses the same GTM container ID: `GTM-TPVR9TRQ`.

3. **GA4 gtag.js initialization**
   - Loads the GA4 script with `strategy="afterInteractive"`.
   - Initializes `dataLayer` and calls `gtag('config', ...)`.
   - Measurement ID: `G-N7BZ4QRB31`.

## Files Touched

- `apps/ecommerce-app/src/app/layout.tsx`

## GTM Utility Purpose

The `libs/utils/gtm.ts` module centralizes analytics tracking so the same event calls work on both web (GTM/GA4 via `dataLayer`) and native (Capacitor via Firebase Analytics). It provides:

- `gtmPageView(params?)`: pushes a `page_view` with page details + device type; also logs to Firebase and sets the current screen on native.
- `gtmEvent(event, params?)`: pushes simple event names (`add_to_cart`, `purchase`, `begin_checkout`, `view_item`) with optional params.
- `gtmPurchaseEvent(params)`: pushes a GA4‑style purchase payload (clears prior `ecommerce` first) and mirrors to Firebase on native.

## Latest Commit Summary (as of February 11, 2026)

Commit: `10aa9a4bff69760136ac24be7d23d32af804e33b`  
Subject: `feat: implement Google Tag Manager utility and integrate event tracking in Cards component`  
Commit date: `2026-02-11 20:50:15 +0800`

Files changed in that commit:
- `libs/global.d.ts`
- `libs/ui/components/Cards.tsx`
- `libs/utils/gtm.ts`
- `libs/utils/index.ts`

## Exact Snippets (as implemented)

### GTM `<head>` script

```tsx
<Script id="gtm-base" strategy="beforeInteractive">
  {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TPVR9TRQ');`}
</Script>
```

### GTM `<noscript>` after `<body>`

```tsx
<noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-TPVR9TRQ"
    height="0"
    width="0"
    style={{ display: 'none', visibility: 'hidden' }}
  />
</noscript>
```

### GA4 gtag.js setup

```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
  strategy="afterInteractive"
/>
<Script id="gtag-init" strategy="afterInteractive">
  {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
</Script>
```

## Notes / Next Options

- If you want the GA4 Measurement ID to be environment-driven, switch to `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- If you want SPA route changes tracked as pageviews, add a route-change handler to call `gtag('config', ...)` on navigation.
