'use client';

import { useRouter } from 'next/navigation';
import { LuMoveLeft } from 'react-icons/lu';
import { OrderSummary } from '../Checkout/OrderSummary';
import { Items } from './Items';
export const Cart = () => {
  const router = useRouter();
  return (
    <div className="max-w-screen mt-10 relative ">
      <button
        className="flex gap-3 font-semibold items-center text-cyan-700"
        onClick={() => router.push('/')}
      >
        <LuMoveLeft />
        Back to Shopping
      </button>

      <p className="text-heading-5 font-bold mt-5">Shopping Cart</p>

      <div className="flex justify-between gap-10">
        <div className="flex flex-col flex-[1.5] w-[850px] justify-between ">
          <Items />
          {/* <PaymentMethod /> */}
        </div>
        <div className="flex flex-1 flex-col gap-5 self-start sticky top-[170px] h-fit">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};
