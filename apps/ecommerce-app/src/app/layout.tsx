'use client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@global';
import { AuthProvider } from '@portal/auth';
import { Provider } from '@portal/theme';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-full">
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            <Provider> {children}</Provider>
          </AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
