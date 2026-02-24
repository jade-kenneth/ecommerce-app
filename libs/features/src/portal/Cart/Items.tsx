'use client';

import { Minus, Package, Plus, Tag } from 'lucide-react';
import Image from 'next/image';
import { Show } from '~/components/Show';

import { useUpdateCartItemMutation } from '~/graphql/generated';
import { capitalize } from '~/utils/capitalize';
import { numberFormatter } from '~/utils/numberFormatter';
import { useCartContext } from './CartContext';
import { EmptyCart } from './EmptyCart';
import { RemoveItem } from './RemoveItem';

interface ItemsProps {
  isCheckout?: boolean;
}
export const Items = ({ isCheckout = false }: ItemsProps) => {
  const context = useCartContext();
  const [mutate] = useUpdateCartItemMutation();
  return (
    <div className="flex flex-col gap-6 mt-4 sm:mt-6">
      {!context.state.cart.items.length && <EmptyCart />}
      {context.state.cart.items.map((item) => {
        let quantity = item.quantity;
        const discount = item.discount ?? 0;
        const totalPrice = item.price * item.quantity;
        const discountedTotal = totalPrice * Math.max(0, 1 - discount / 100);
        const categories = item.categories?.length
          ? item.categories
              .map((value) =>
                capitalize(value, {
                  delimiter: capitalize.delimiters.UNDERSCORE,
                }),
              )
              .join(', ')
          : 'Uncategorized';
        return (
          <div
            key={item.productId}
            data-is-checkout={isCheckout}
            className="relative bg-white rounded-[24px] sm:rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md data-[is-checkout='true']:hover:shadow-none transition-shadow duration-200"
          >
            {discount > 0 && (
              <div className="absolute z-8 right-3 top-3 sm:right-5 sm:top-5 inline-flex items-center gap-1.5 rounded-full bg-error-500 px-3 py-1 text-[10px] font-semibold text-white shadow-sm sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs">
                <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {discount}% OFF
              </div>
            )}
            <div className="relative bg-cyan-50/60 px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6">
              <div className="mx-auto w-full max-w-[220px] sm:max-w-[260px]">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white bg-white shadow-md">
                  <Image
                    src={item.thumbnail || '/LogoBlack.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 260px, 220px"
                  />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-slate-900 sm:text-2xl">
                  {item.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 sm:text-sm">
                  <Package className="h-3.5 w-3.5 text-slate-500 sm:h-4 sm:w-4" />
                  <span className="leading-relaxed">{categories}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-3 flex flex-wrap items-end gap-3 sm:mt-4 sm:gap-4">
                <p className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  ₱
                  {numberFormatter.format(discountedTotal, {
                    locale: 'en-PH',
                  })}
                </p>
                {discount > 0 && (
                  <p className="text-base text-slate-400 line-through sm:text-xl">
                    ₱
                    {numberFormatter.format(totalPrice, {
                      locale: 'en-PH',
                    })}
                  </p>
                )}
              </div>

              {/* Quantity and Remove */}
              <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <Show when={!isCheckout}>
                  <div className="flex items-center justify-between rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 sm:min-w-[220px] sm:px-4">
                    <button
                      aria-label="Decrease quantity"
                      onClick={async () => {
                        if (quantity <= 1) return;
                        await mutate({
                          variables: {
                            input: {
                              productId: item.productId,
                              quantity: -1,
                            },
                          },
                        });
                        context.setQuantity(item.productId, item.quantity - 1);
                        quantity -= 1;
                      }}
                      className="rounded-full p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-base font-semibold sm:text-lg">
                      {item.quantity}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={async () => {
                        await mutate({
                          variables: {
                            input: {
                              productId: item.productId,
                              quantity: 1,
                            },
                          },
                        });
                        context.setQuantity(item.productId, item.quantity + 1);
                      }}
                      className="rounded-full p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </Show>

                <Show when={!isCheckout}>
                  <RemoveItem
                    item={item}
                    label="Remove"
                    className="w-full justify-center gap-2 rounded-full border border-error-200 bg-error-50 px-5 py-2.5 text-sm font-semibold text-error-600 hover:bg-error-100 sm:w-auto sm:px-6 sm:py-3"
                  />
                </Show>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
