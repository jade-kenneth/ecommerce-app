import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review your cart items and continue to checkout on Amy.',
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
