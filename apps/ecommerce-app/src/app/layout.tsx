import { AuthProvider } from '@portal/auth';

import ToastContainer from 'libs/general/src/components/ToastContainer';
import { ClientApolloProvider } from './client-layout';
import './globals.css';

export const metadata = {
  title: 'Amy Store Web App',
  description: 'Your next gen shopping experience',
};

import { Provider } from '@portal/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-full">
        <ClientApolloProvider>
          <AuthProvider>
            <Provider> {children}</Provider>
            <ToastContainer />
          </AuthProvider>
        </ClientApolloProvider>
      </body>
    </html>
  );
}
