'use client';

import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { Input } from '~/components/Input';
import { Show } from '~/components/Show';
import { capitalize } from '~/utils/capitalize';
import { useCartContext } from './CartContext';
import { ConfirmRemoveItem } from './ConfirmRemoveItem';
import { EmptyCart } from './EmptyCart';

interface ItemsProps {
  isCheckout?: boolean;
}
export const Items = ({ isCheckout = false }: ItemsProps) => {
  const context = useCartContext();

  return (
    <div className="flex flex-col gap-5 mt-4 sm:mt-5">
      {!context.state.cart.items.length && <EmptyCart />}
      {context.state.cart.items.map((item) => {
        let quantity = item.quantity;
        return (
          <div
            key={item.productId}
            data-is-checkout={isCheckout}
            className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md data-[is-checkout='true']:hover:shadow-none transition-shadow duration-200"
          >
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
              {/* Image */}
              <div className="flex-shrink-0">
                <Image
                  src={item.thumbnail || ''}
                  alt="Product Image"
                  width={100}
                  height={100}
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg"
                />
              </div>

              {/* Details */}
              <div className="flex-grow flex flex-col justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Categories:{' '}
                    {item.categories?.map((v) =>
                      capitalize(v, {
                        delimiter: capitalize.delimiters.UNDERSCORE,
                      }),
                    )}
                  </p>
                </div>

                {/* Price */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-sm sm:text-lg line-through font-bold text-gray-500 dark:text-white">
                    ₱{(item.price * item.quantity).toLocaleString('en-PH')}
                  </span>

                  <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    ₱
                    {(
                      item.price *
                      item.quantity *
                      (1 - item.discount / 100)
                    ).toLocaleString('en-PH')}
                  </span>

                  <span className="text-xs sm:text-md text-error-500 font-semibold">
                    {item.discount}% OFF
                  </span>
                </div>
              </div>

              {/* Quantity and Remove */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:gap-5">
                {/* Quantity Selector */}
                <Show when={!isCheckout}>
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800">
                    <button
                      onClick={() => {
                        if (quantity <= 1) return;
                        context.setQuantity(item.productId, item.quantity - 1);
                        quantity -= 1;
                      }}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <Input
                      inputProps={{
                        type: 'text',
                        style: { background: 'none' },
                      }}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key !== 'Backspace' &&
                          e.key !== 'Delete' &&
                          e.key !== 'ArrowLeft' &&
                          e.key !== 'ArrowRight' &&
                          e.key !== 'Tab'
                        ) {
                          e.preventDefault();
                        }
                      }}
                      value={item.quantity.toString()}
                      className="w-12 sm:w-[70px] text-center border-0 bg-transparent text-gray-900 dark:text-white font-semibold focus:outline-none"
                      onChange={(e) => {
                        context.setQuantity(item.productId, Number(e));
                      }}
                    />

                    <button
                      onClick={() => {
                        context.setQuantity(item.productId, item.quantity + 1);
                      }}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </Show>

                {/* Remove Button */}
                <Show when={!isCheckout}>
                  <ConfirmRemoveItem item={item} />
                </Show>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
