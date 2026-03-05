'use client';
import { useRouter } from 'next/navigation';
import { Sticky } from '~/components/Sticky';

import { Highlight, Navbar } from '~/features/portal';
import { Checkout } from '~/features/portal/Checkout/Checkout';
export default function Index() {
  const router = useRouter();
  return (
    <div className="relative">
      <Sticky>
        <Highlight />
        <Navbar />
      </Sticky>

      <Checkout />
    </div>
  );
}
