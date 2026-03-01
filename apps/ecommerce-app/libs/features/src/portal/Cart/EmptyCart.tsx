import { CartIcon } from '~/icons/CartIcon';
import { useRouter } from 'next/navigation';
export const EmptyCart = () => {
  const router = useRouter();
  return (
    <div className="flex border-[1px] rounded-md border-carbon-900 flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <CartIcon />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Your cart is empty
      </h3>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        Looks like you haven&apos;t added anything to your cart yet. Start
        shopping to fill it up!
      </p>

      <button
        onClick={() => router.push('/')}
        className="w-fit p-3 bg-cyan-600 text-white font-semibold rounded-xl shadow bg-cyan-700 transition"
      >
        Continue Shopping
      </button>
    </div>
  );
};
