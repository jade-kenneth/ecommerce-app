'use client';
import { useRouter } from 'next/navigation';
import { Sticky } from '~/components/Sticky';

import { Navbar } from '~/features/portal';
import { Checkout } from '~/features/portal/Checkout/Checkout';
import { Highlight } from '~/features/portal/Highlight';
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
