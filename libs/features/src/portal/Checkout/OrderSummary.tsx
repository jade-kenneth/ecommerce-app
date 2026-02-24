'use client';

import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { Show } from '~/components/Show';
import {
  PaymentMethodType,
  useCheckoutMutation,
  useCreateGcashPaymentMutation,
  usePaymentMethodsQuery,
  useShippingOptionsQuery,
} from '~/graphql/generated';
import { gtm } from '~/utils';
import { capitalize } from '~/utils/capitalize';
import { APP_URL_SCHEME } from '~/utils/constant';
import { numberFormatter } from '~/utils/numberFormatter';
import { useCartContext } from '../Cart/CartContext';

interface OrderSummaryProps {
  isCheckout?: boolean;
}

const readGaClientIdFromCookie = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;

  const rawGaCookie = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('_ga='))
    ?.slice(4);

  if (!rawGaCookie) return undefined;

  const parts = rawGaCookie.split('.');
  if (parts.length < 4) return undefined;

  const clientIdParts = parts.slice(-2);
  if (clientIdParts.some((part) => !part)) return undefined;

  return clientIdParts.join('.');
};

export const OrderSummary = ({ isCheckout }: OrderSummaryProps) => {
  const context = useCartContext();
  const paymentMethodsQuery = usePaymentMethodsQuery();
  const shippingOptionsQuery = useShippingOptionsQuery();

  const totalAmount = context.state.cart.items.reduce((total, item) => {
    return total + Number(item.price) * (item.quantity || 1);
  }, 0);
  const router = useRouter();
  const totalAmountWithShippingAndTax =
    totalAmount +
    Number(context.state.cart.shipping?.fee || 0) +
    totalAmount * 0.12; // Assuming 12% VAT

  const [mutate] = useCreateGcashPaymentMutation();
  const [order] = useCheckoutMutation();
  return (
    <div>
      <div
        className={twMerge('  bg-white rounded-2xl shadow-lg p-6 space-y-6')}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal ({context.state.itemsCount} items)</span>
            <span className="font-medium">
              ₱{numberFormatter.format(totalAmount)}
            </span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span className="font-medium">
              ₱
              {numberFormatter.format(
                Number(context.state.cart.shipping?.fee || 0),
              )}
            </span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Tax (12% VAT)</span>
            <span className="font-medium">
              ₱{numberFormatter.format(totalAmount * 0.12)}
            </span>
          </div>

          <Show when={isCheckout}>
            <hr className="border-gray-200" />
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {capitalize(context.state.cart.paymentMethod ?? '', {
                    delimiter: capitalize.delimiters.UNDERSCORE,
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Shipping Method</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {capitalize(context.state.cart.shipping?.type ?? '', {
                    delimiter: capitalize.delimiters.UNDERSCORE,
                  })}{' '}
                  <span className="text-sm font-normal text-gray-600">
                    (
                    {context.state.cart.shipping?.description ??
                      'No description'}
                    )
                  </span>
                </p>
              </div>
            </div>
          </Show>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            Total Amount
          </span>
          <span className="text-2xl font-bold text-green-600">
            ₱{numberFormatter.format(totalAmountWithShippingAndTax)}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Free returns within 30
            days
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-600">✓</span> 100% Money-back guarantee
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Secure encrypted payment
          </p>
        </div>
      </div>

      <div className="max-w-full mx-auto mt-6 space-y-4">
        <Show
          when={!isCheckout}
          fallback={
            <button
              className="w-full py-3  text-white font-semibold rounded-xl shadow bg-cyan-700 transition"
              onClick={async () => {
                const clientId = readGaClientIdFromCookie();

                const paymentMethods =
                  paymentMethodsQuery.data?.paymentMethods ?? [];
                const shippingOptions =
                  shippingOptionsQuery.data?.shippingOptions ?? [];

                const selectedPaymentType =
                  context.state.cart.paymentMethod ?? paymentMethods[0]?.type;

                const paymentMethodId =
                  paymentMethods.find(
                    (method) => method.type === selectedPaymentType,
                  )?._id ?? paymentMethods[0]?._id;

                const selectedShippingType =
                  context.state.cart.shipping?.type ?? shippingOptions[0]?.type;

                const shippingOptionId =
                  shippingOptions.find(
                    (option) => option.type === selectedShippingType,
                  )?._id ?? shippingOptions[0]?._id;

                if (!paymentMethodId || !shippingOptionId) {
                  return;
                }

                const orderRes = await order({
                  variables: {
                    input: {
                      clientId,
                      shippingOptionId,
                      paymentMethodId,
                    },
                  },
                });
                const orderId = orderRes.data?.checkout._id;
                const baseUrl =
                  (process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/$/, '') ||
                  window.location.origin;

                const isCashOnDelivery =
                  selectedPaymentType === PaymentMethodType.CashOnDelivery;

                const successPath = isCashOnDelivery
                  ? '/payment/cod/success'
                  : '/payment/success';

                const failurePath = '/payment/failure';

                const successUrl = orderId
                  ? `${baseUrl}${successPath}?orderId=${encodeURIComponent(
                      orderId,
                    )}`
                  : baseUrl;

                const failureUrl = orderId
                  ? `${baseUrl}${failurePath}?orderId=${encodeURIComponent(
                      orderId,
                    )}`
                  : baseUrl;

                const referenceId = orderId
                  ? `order-${orderId}`
                  : `order-${Date.now()}`;

                const description = orderId
                  ? `Payment for order #${orderId}`
                  : 'Payment for order';

                if (isCashOnDelivery) {
                  if (Capacitor.getPlatform() === 'web') {
                    window.location.href = successUrl;
                  } else {
                    window.location.href = `${APP_URL_SCHEME}://payment/failure?orderId=${orderId}`;
                  }
                } else {
                  const res = await mutate({
                    variables: {
                      input: {
                        amount: totalAmountWithShippingAndTax as unknown as string,
                        failureUrl:
                          Capacitor.getPlatform() === 'web'
                            ? failureUrl
                            : `${APP_URL_SCHEME}://payment/failure?orderId=${orderId}`,
                        successUrl:
                          Capacitor.getPlatform() === 'web'
                            ? successUrl
                            : `${APP_URL_SCHEME}://payment/success?orderId=${orderId}`,
                        referenceId,
                        description,
                      },
                    },
                  });

                  const checkoutUrl =
                    res.data?.createGcashPayment?.actions?.[0]?.value;
                  if (checkoutUrl) {
                    await Browser.open({ url: checkoutUrl });
                  }
                }
              }}
            >
              Place Order
            </button>
          }
        >
          <button
            className="w-full py-3  text-white font-semibold rounded-xl shadow bg-cyan-700 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={context.state.itemsCount === 0}
            data-disabled={context.state.itemsCount === 0}
            onClick={async () => {
              gtm.gtmEvent('begin_checkout', {
                valueWithShippingAndTax: totalAmountWithShippingAndTax,
                currency: 'PHP',
                payment_type: context.state.cart.paymentMethod,
                items: context.state.cart.items.map((item) => ({
                  item_id: item.productId,
                  item_name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  categories: item.categories,
                })),
                total: context.state.cart.items.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0,
                ),
              });
              router.replace('/cart/checkout');
            }}
          >
            Proceed to Checkout
          </button>
        </Show>
        <Show when={!isCheckout}>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-carbon-950 py-3  text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
          >
            Continue Shopping
          </button>
        </Show>
      </div>
    </div>
  );
};
