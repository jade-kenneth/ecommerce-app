import { AuthProvider } from '../libs/global/src/auth';
import ToastContainer from '../libs/global/src/components/ToastContainer';
import { Provider } from '../libs/global/theme/src';
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
            <ToastContainer />
          </AuthProvider>
        </ClientApolloProvider>
      </body>
    </html>
  );
}
