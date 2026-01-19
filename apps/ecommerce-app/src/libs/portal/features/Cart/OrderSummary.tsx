import { capitalize, numberFormatter } from '../../../global/src';
import { useCreateGcashPaymentMutation } from '../../../global/src/graphql/generated';
import { useCartContext } from './CartContext';

export const OrderSummary = () => {
  const context = useCartContext();

  const totalAmount = context.state.cart.items.reduce((total, item) => {
    return total + Number(item.price) * (item.quantity || 1);
  }, 0);

  const totalAmountWithShippingAndTax =
    totalAmount +
    Number(context.state.cart.shipping?.fee || 0) +
    totalAmount * 0.12; // Assuming 12% VAT

  const [mutate] = useCreateGcashPaymentMutation();
  return (
    <div className="sticky top-0">
      <div className="  bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal (6 items)</span>
            <span className="font-medium">
              ₱{numberFormatter.format(totalAmount)}
            </span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span className="font-medium">
              ₱
              {numberFormatter.format(
                Number(context.state.cart.shipping?.fee || 0)
              )}
            </span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Tax (12% VAT)</span>
            <span className="font-medium">
              ₱{numberFormatter.format(totalAmount * 0.12)}
            </span>
          </div>

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
                  {context.state.cart.shipping?.description ?? 'No description'}
                  )
                </span>
              </p>
            </div>
          </div>
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

      <div className="max-w-md mx-auto mt-6 space-y-4">
        <button
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl shadow bg-primary-700-value transition"
          onClick={async () => {
            const res = await mutate({
              variables: {
                input: {
                  amount: totalAmountWithShippingAndTax as unknown as string,
                  failureUrl: window.location.href,
                  successUrl: window.location.href,
                  referenceId: `order-${Date.now()}`,
                  description: 'Payment for order #' + `order-${Date.now()}`,
                },
              },
            });

            const checkoutUrl =
              res.data?.createGcashPayment?.actions?.[0]?.value;
            if (checkoutUrl) {
              window.location.href = checkoutUrl;
            }
          }}
        >
          Proceed to Checkout
        </button>

        <button className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
