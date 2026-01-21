'use client';

import dynamic from 'next/dynamic';
import Script from 'next/script';

// Add global type for window.Xendit
declare global {
  interface Window {
    Xendit: {
      setPublishableKey: (key: string) => void;
    };
  }
}

import { Cart, Footer, FrequentlySearched, Highlight } from '~/features/portal';

const ClientOnlyNavbar = dynamic(
  () => import('~/features/portal').then((mod) => mod.Navbar),
  { ssr: false }
);

export default function Index() {
  return (
    <>
      <Script
        src="https://js.xendit.co/v1/xendit.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.Xendit.setPublishableKey(
            process.env.NEXT_PUBLIC_XENDIT_PUBLIC_KEY!
          );
        }}
      />

      <div className="sticky top-0 z-50 bg-white border-b border-[#EAEAEA]">
        <Highlight />
        <ClientOnlyNavbar />
      </div>
      <FrequentlySearched />
      <Cart />
      <Footer />
    </>
  );
}
