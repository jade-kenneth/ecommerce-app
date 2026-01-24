import { Layout as AdminLayout } from '~/features/admin/features/Layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
