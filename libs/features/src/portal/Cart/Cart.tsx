'use client';

import { useRouter } from 'next/navigation';
import { LuMoveLeft } from 'react-icons/lu';
import { OrderSummary } from '../Checkout/OrderSummary';
import { Items } from './Items';
export const Cart = () => {
  const router = useRouter();
  return (
    <div className="max-w-screen mt-6 sm:mt-10 relative">
      <button
        className="flex gap-3 font-semibold items-center text-cyan-700 text-sm sm:text-base"
        onClick={() => router.push('/')}
      >
        <LuMoveLeft />
        Back to Shopping
      </button>

      <p className="text-2xl sm:text-heading-5 font-bold mt-4 sm:mt-5">
        Shopping Cart
      </p>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        <div className="flex flex-col flex-1 justify-between">
          <Items />
          {/* <PaymentMethod /> */}
        </div>
        <div className="flex w-full flex-1 flex-col gap-5 self-start lg:sticky lg:top-[170px] h-fit">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};
