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
      <body className="w-full">
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
