import { AuthProvider } from '@portal/auth';
import { Provider } from '@portal/theme';

import { ClientApolloProvider } from './client-layout';
import './globals.css';

export const metadata = {
  title: 'Amy Store Web App',
  description: 'Your next gen shopping experience',
};
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
          </AuthProvider>
        </ClientApolloProvider>
      </body>
    </html>
  );
}
