'use client';

import { CircleCheckBig, LoaderCircle, Truck } from 'lucide-react';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { ShippingType, useShippingOptionsQuery } from '~/graphql/generated';
import { useCartContext } from '../Cart/CartContext';

type ShippingOption = {
  _id: string;
  label: string;
  description: string;
  type: ShippingType;
  fee: string;
};

type ShippingOptionCardProps = {
  option: ShippingOption;
  selected: boolean;
  onSelect: () => void;
};

const sectionCardClassName =
  'rounded-2xl bg-white/95 p-5 shadow-[0_12px_30px_rgba(2,6,23,0.08)]';

const sectionDescriptionClassName = 'mt-1 text-xs text-carbon-500';

const shippingStateClassName =
  'mt-4 flex items-center gap-2 rounded-xl bg-carbon-25/50 px-4 py-3 text-sm text-carbon-500';

const formatShippingFee = (fee: string) => {
  const numericFee = Number(fee);

  if (Number.isNaN(numericFee)) {
    return fee;
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(numericFee);
};

function ShippingOptionCard({
  option,
  selected,
  onSelect,
}: ShippingOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={twMerge(
        'w-full rounded-2xl bg-white p-4 text-left shadow-[0_8px_18px_rgba(2,6,23,0.08)] transition duration-200',
        selected
          ? 'ring-2 ring-cyan-200 shadow-[0_0_0_3px_rgba(6,182,212,0.14),0_16px_28px_rgba(2,6,23,0.16)]'
          : 'hover:shadow-[0_12px_22px_rgba(2,6,23,0.14)]',
      )}
      aria-pressed={selected}
    >
      <input
        type="radio"
        name="shippingMethod"
        value={option.type}
        checked={selected}
        readOnly
        className="sr-only"
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={twMerge(
              'rounded-lg p-2.5 text-white shadow-sm',
              selected ? 'bg-cyan-600' : 'bg-carbon-900',
            )}
          >
            <Truck className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-carbon-25">{option.label}</p>
            <p className="mt-1 text-xs text-carbon-500">{option.description}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-carbon-400">
            Shipping Fee
          </p>
          <p className="text-sm font-semibold text-carbon-25">
            {formatShippingFee(option.fee)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end">
        <span
          className={twMerge(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
            selected
              ? 'bg-cyan-100 text-cyan-800'
              : 'bg-carbon-100/40 text-carbon-500',
          )}
        >
          <CircleCheckBig className="h-3.5 w-3.5" />
          {selected ? 'Selected' : 'Choose this option'}
        </span>
      </div>
    </button>
  );
}

export const ShippingOptions = () => {
  const context = useCartContext();
  const query = useShippingOptionsQuery();

  const shippingMethods: ShippingOption[] = (
    query.data?.shippingOptions ?? []
  ).map((method) => ({
    _id: method._id,
    label: method.label,
    type: method.type,
    description: method.description || method.estimatedDays || 'No details',
    fee: method.fee,
  }));

  useEffect(() => {
    if (!shippingMethods.length) return;

    const selectedType = context.state.cart.shipping?.type;
    const selectedMethod = shippingMethods.find(
      (method) => method.type === selectedType,
    );

    if (selectedMethod) return;

    const fallbackMethod = shippingMethods[0];

    context.setState({
      ...context.state,
      cart: {
        ...context.state.cart,
        shipping: {
          type: fallbackMethod.type,
          fee: fallbackMethod.fee,
          description: fallbackMethod.description,
        },
      },
    });
  }, [shippingMethods, context.state]);

  return (
    <section className="mt-5 rounded-3xl bg-gradient-to-br from-white via-cyan-50/40 to-white p-6 ring-1 ring-cyan-100/60 shadow-[0_20px_45px_rgba(2,6,23,0.08)] sm:p-7">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-cyan-600 p-2 text-white shadow-sm">
          <Truck className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipping Method</h2>
          <p className="text-sm text-carbon-500">
            Select your preferred delivery option for this order.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div className={sectionCardClassName}>
          <h3 className="text-base font-semibold text-carbon-25">
            Available Options
          </h3>
          <p className={sectionDescriptionClassName}>
            Shipping fee and delivery details depend on your selected method.
          </p>

          {query.loading ? (
            <div className={shippingStateClassName}>
              <LoaderCircle className="h-4 w-4 animate-spin text-cyan-700" />
              Loading shipping methods...
            </div>
          ) : null}

          {!query.loading && !shippingMethods.length ? (
            <div className={shippingStateClassName}>
              No active shipping methods are available right now.
            </div>
          ) : null}

          <div className="mt-4 space-y-3">
            {shippingMethods.map((method) => (
              <ShippingOptionCard
                key={method._id}
                option={method}
                selected={method.type === context.state.cart.shipping?.type}
                onSelect={() => {
                  context.setState({
                    ...context.state,
                    cart: {
                      ...context.state.cart,
                      shipping: {
                        type: method.type,
                        fee: method.fee,
                        description: method.description,
                      },
                    },
                  });
                }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-3 text-xs text-cyan-900">
          Shipping fee is included in your order summary before checkout.
        </div>
      </div>
    </section>
  );
};
