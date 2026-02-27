'use client';

import dynamic from 'next/dynamic';
import Script from 'next/script';
import { toaster } from '~/components';
import { Sticky } from '~/components/Sticky';

// Add global type for window.Xendit
declare global {
  interface Window {
    Xendit?: {
      setPublishableKey?: (key: string) => void;
    };
  }
}

import { Cart, Footer, FrequentlySearched, Highlight } from '~/features/portal';

const ClientOnlyNavbar = dynamic(
  () => import('~/features/portal').then((mod) => mod.Navbar),
  { ssr: false },
);

export default function Index() {
  const handleXenditLoad = () => {
    const publicKey = process.env.NEXT_PUBLIC_XENDIT_PUBLIC_KEY;

    if (!publicKey) {
      console.error('Xendit public key is missing.');
      toaster.error({
        description:
          'Payment service is not configured. Please try again later.',
      });
      return;
    }

    if (typeof window === 'undefined') return;

    if (typeof window.Xendit?.setPublishableKey !== 'function') {
      console.error('Xendit script loaded but Xendit API is unavailable.');
      toaster.error({
        description:
          'Payment service failed to initialize. Please refresh and try again.',
      });
      return;
    }

    try {
      window.Xendit.setPublishableKey(publicKey);
      console.log('Xendit initialized successfully with public key.');
    } catch (error) {
      console.error('Failed to initialize Xendit:', error);
      toaster.error({
        description:
          'Payment service failed to initialize. Please refresh and try again.',
      });
    }
  };

  return (
    <>
      <Script
        src="https://js.xendit.co/v1/xendit.min.js"
        strategy="afterInteractive"
        onLoad={handleXenditLoad}
        onError={() => {
          console.error('Failed to load Xendit script.');
          toaster.error({
            description:
              'Unable to load payment service. Please check your connection and try again.',
          });
        }}
      />

      <Sticky>
        <Highlight />
        <ClientOnlyNavbar />
      </Sticky>
      <FrequentlySearched />
      <Cart />
      <Footer />
    </>
  );
}
