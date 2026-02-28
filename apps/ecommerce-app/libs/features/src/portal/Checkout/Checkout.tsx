'use client';

import { Items } from '../Cart/Items';
import { Footer } from '../Footer';
import { OrderSummary } from './OrderSummary';
import PaymentMethod from './PaymentMethod';
import { ShippingOptions } from './ShippingOptions';

export const Checkout = () => {
  return (
    <>
      <div className="max-w-screen flex flex-col lg:flex-row gap-8 lg:gap-10 mb-5">
        <div className="flex-1">
          <Items isCheckout />
        </div>
        <div className="flex-1">
          <ShippingOptions />
          <PaymentMethod />
          <div className="flex w-full flex-1 flex-col gap-5 self-start lg:sticky lg:top-[170px] h-fit">
            <OrderSummary isCheckout />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
