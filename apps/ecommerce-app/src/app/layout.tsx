import { AuthProvider } from '../libs/global/src/auth';
import ToastContainer from '../libs/global/src/components/ToastContainer';
import { Provider } from '../libs/global/theme/src';
import { ClientCartProvider } from './cart-provider';
import { ClientApolloProvider } from './client-layout';
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
