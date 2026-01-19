import { AdminLayout } from 'apps/ecommerce-app/src/libs/admin/admin-layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
