import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description:
    'Complete your order with shipping and payment details on Amy checkout.',
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
