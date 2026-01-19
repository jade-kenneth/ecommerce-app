import { useRouter } from 'next/navigation';
import { LuMoveLeft } from 'react-icons/lu';
import { Items } from './Items';
import { OrderSummary } from './OrderSummary';
import PaymentMethod from './PaymentMethod';
export const Cart = () => {
  const router = useRouter();
  return (
    <div className="max-w-screen mt-10">
      <button
        className="flex gap-3 font-semibold items-center text-primary-700-value"
        onClick={() => router.push('/')}
      >
        <LuMoveLeft />
        Back to Shopping
      </button>

      <p className="text-heading-5 font-bold mt-5">Shopping Cart</p>

      <div className="flex justify-between ">
        <div className="flex flex-col w-[850px] justify-between ">
          <Items />
          <PaymentMethod />
        </div>
        <div className="flex flex-col gap-5">
          {/* <ShippingOptions /> */}
          <div className="relative h-[600px]">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};
