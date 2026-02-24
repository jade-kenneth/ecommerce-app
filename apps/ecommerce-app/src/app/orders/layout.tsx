import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Track your purchases, order status, and order history on Amy.',
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
