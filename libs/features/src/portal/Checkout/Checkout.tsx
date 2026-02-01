'use client';

import { Items } from '../Cart/Items';
import { Footer } from '../Footer';
import { OrderSummary } from './OrderSummary';
import PaymentMethod from './PaymentMethod';
import { ShippingOptions } from './ShippingOptions';

export const Checkout = () => {
  return (
    <>
      <div className="max-w-screen flex gap-10 mb-5">
        <div className="flex-[1.4]">
          <Items isCheckout />
        </div>
        <div className="flex-1">
          <ShippingOptions />
          <PaymentMethod />
          <OrderSummary isCheckout />
        </div>
      </div>
      <Footer />
    </>
  );
};
