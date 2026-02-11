'use client';
import Script from 'next/script';
import { ToastContainer } from '~/components/ToastContainer';
import { AuthProvider } from '~/providers/AuthProvider';
import { ClientCartProvider } from '~/providers/CartProvider';
import { ClientApolloProvider } from '~/providers/ClientLayoutProvider';
import { LicenseProvider } from '~/providers/LicenseProvider';
import './globals.css';

const GA_MEASUREMENT_ID = 'G-N7BZ4QRB31';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="gtm-base" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TPVR9TRQ');`}
        </Script>
      </head>
      <body className="w-full">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TPVR9TRQ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
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
        <ClientApolloProvider>
          <ClientCartProvider>
            <AuthProvider>
              <LicenseProvider excludePaths={['/admin']}>
                {children}
              </LicenseProvider>
              <ToastContainer />
            </AuthProvider>
          </ClientCartProvider>
        </ClientApolloProvider>
      </body>
    </html>
  );
}
