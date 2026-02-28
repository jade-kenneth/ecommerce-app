'use client';

import { Portal } from '@ark-ui/react';
import { useRemoveFromCartMutation } from 'libs/graphql/src/generated';
import { AlertDialog } from 'libs/ui/components/ui/AlertDialog';
import { useDisclosure } from 'libs/utils/useDisclosure';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { useCartContext } from './CartContext';
import { Item } from './useCart';

interface ConfirmRemoveItemProps {
  item: Item;
  className?: string;
  label?: string;
}
export const RemoveItem = ({
  item,
  className,
  label,
}: ConfirmRemoveItemProps) => {
  const context = useCartContext();
  const discountPercentage = item.discount / 100;

  const discounted = item.price * item.quantity * discountPercentage;
  const priceAfterDiscount = item.price - item.price * discountPercentage;
  const [removeFromCart] = useRemoveFromCartMutation();
  const disclosure = useDisclosure();
  return (
    <AlertDialog.Root open={disclosure.open} onOpenChange={disclosure.onToggle}>
      <AlertDialog.Trigger
        className={`flex gap-2 py-2 items-center text-error-500 rounded-lg ${className ?? ''}`}
      >
        <Trash className="size-4" />
        <span>{label ?? 'Remove Item'}</span>
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop />
      <Portal>
        <AlertDialog.Positioner>
          <AlertDialog.Content className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-[480px] py-6 space-y-4">
            {/* Title */}
            <AlertDialog.Title className="text-2xl px-6 font-semibold">
              Wait! Don’t remove this item yet
            </AlertDialog.Title>

            {/* Subtitle */}
            <AlertDialog.Description className="text-gray-500 px-6 text-sm">
              This item currently has a discount and helps reduce your delivery
              fee.
            </AlertDialog.Description>

            {/* Item Card */}
            <div className="flex items-center gap-4 border-t  px-6 pt-4">
              <Image
                src={item.thumbnail}
                className="w-16 h-16 rounded-xl object-cover"
                alt={item.name}
                width={64}
                height={64}
              />

              <div className="flex flex-col">
                <p className="font-semibold text-lg">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="text-base font-medium">₱{priceAfterDiscount}</p>
              </div>
            </div>

            {/* Savings */}
            <div className="space-y-1 px-6">
              <p className="text-red-600 font-semibold flex items-center gap-1">
                🔥 You save ₱{discounted} on this item today
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-md">
                  SALE
                </span>
              </p>
            </div>

            {/* Warning Box */}
            <div className="bg-yellow-50 mx-6 border p-4 border-yellow-100 rounded-xl  space-y-2">
              <p className="font-semibold text-yellow-800 flex items-center gap-2">
                ⚠ You might miss out!
              </p>

              <p className="text-sm text-yellow-800 flex items-center gap-2">
                🥇 This is a bestseller today
                <span className="bg-orange-500 text-black text-xs px-2 py-0.5 rounded-md">
                  Only {item.quantity} left in stock
                </span>
              </p>

              <p className="text-sm text-yellow-800 flex items-center gap-2">
                👍 92% of customers kept this item
              </p>
            </div>

            {/* Buttons */}
            <AlertDialog.Footer className="flex pb-1 gap-3 pt-2 px-6">
              <button
                onClick={() => disclosure.onToggle()}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium"
              >
                Keep Item
              </button>

              <button
                onClick={async () => {
                  await removeFromCart({
                    variables: { input: { productId: item.productId } },
                  });
                  context.removeCartItem(item.productId);
                }}
                className="flex-1 py-3 border rounded-xl text-gray-700 font-medium hover:bg-gray-100"
              >
                Remove Anyway
              </button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Positioner>
      </Portal>
    </AlertDialog.Root>
  );
};
