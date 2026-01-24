'use client';
import { useRouter } from 'next/navigation';
import { LuMoveLeft } from 'react-icons/lu';
import { Navbar } from '~/features/portal';
import { Checkout } from '~/features/portal/Checkout/Checkout';
import { Highlight } from '~/features/portal/Highlight';
export default function Index() {
  const router = useRouter();
  return (
    <div className="relative ">
      <div className="sticky top-0 z-50 bg-white border-b border-[#EAEAEA]">
        <Highlight />
        <Navbar />
      </div>
      <button
        className="flex mt-5 gap-3 max-w-screen font-semibold items-center text-cyan-700"
        onClick={() => router.push('/cart')}
      >
        <LuMoveLeft />
        Back to Cart
      </button>

      <Checkout />
    </div>
  );
}
