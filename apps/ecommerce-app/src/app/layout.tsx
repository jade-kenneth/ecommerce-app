import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ToastContainer } from '~/components/ToastContainer';
import { AuthProvider } from '~/providers/AuthProvider';
import { ClientCartProvider } from '~/providers/CartProvider';
import { ClientApolloProvider } from '~/providers/ClientLayoutProvider';
import { LicenseProvider } from '~/providers/LicenseProvider';
import { CapacitorDeepLinkBridge } from './CapacitorDeepLinkBridge';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Amy Store',
    template: '%s | Amy Store',
  },
  metadataBase: new URL('https://amy-store.site'),
  description:
    'Amy Store ecommerce app for shopping, checkout, and order tracking.',
  applicationName: 'Amy Store',
  icons: {
    icon: '/Logo.png',
    shortcut: '/Logo.png',
    apple: '/Logo.png',
  },
  verification: {
    google: 'jojN1BJdPqWwW9QxYEXfV3CXAZ6zGju9yGUO9FX67As',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <Script id="gtm-base" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TPVR9TRQ');`}
        </Script>
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Amy Store',
              url: 'https://amy-store.site',
              logo: 'https://amy-store.site/Logo.png',
            }),
          }}
        />
      </head>
      <body className={`${inter.className} w-full`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TPVR9TRQ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <CapacitorDeepLinkBridge />
        <ClientApolloProvider>
          <AuthProvider>
            <ClientCartProvider>
              <LicenseProvider excludePaths={['/admin']}>
                {children}
              </LicenseProvider>
              <ToastContainer />
            </ClientCartProvider>
          </AuthProvider>
        </ClientApolloProvider>
      </body>
    </html>
  );
}
