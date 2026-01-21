import { ToastContainer } from '~/components/ToastContainer';
import { AuthProvider } from '~/providers/AuthProvider';
import { ClientCartProvider } from '~/providers/CartProvider';
import { ClientApolloProvider } from '~/providers/ClientLayoutProvider';
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
        <ClientApolloProvider>
          <ClientCartProvider>
            <AuthProvider>
              <Provider>{children}</Provider>
              <ToastContainer />
            </AuthProvider>
          </ClientCartProvider>
        </ClientApolloProvider>
      </body>
    </html>
  );
}
