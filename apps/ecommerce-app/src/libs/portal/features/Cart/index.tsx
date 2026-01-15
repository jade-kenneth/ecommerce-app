import { LuMoveLeft } from 'react-icons/lu';
import { useGlobalStore } from '../../../global/src';
import { Items } from './Items';

export const Cart = () => {
  const globalStore = useGlobalStore((state) => state);
  return (
    <div className="max-w-screen mt-10">
      <button
        className="flex gap-3 font-semibold items-center text-primary-700-value"
        onClick={() => globalStore.cart.setIsOpen(false)}
      >
        <LuMoveLeft />
        Back to Shopping
      </button>

      <p className="text-heading-5 font-bold mt-5">Shopping Cart</p>

      <Items />
    </div>
  );
};
