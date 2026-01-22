import { ToastContainer } from '~/components/ToastContainer';
import { AuthProvider } from '~/providers/AuthProvider';
import { ClientCartProvider } from '~/providers/CartProvider';
import { ClientApolloProvider } from '~/providers/ClientLayoutProvider';
import { LicenseProvider } from '~/providers/LicenseProvider';
import { Provider } from '~/theme/provider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-full">
        <Provider>
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
        </Provider>
      </body>
    </html>
  );
}
