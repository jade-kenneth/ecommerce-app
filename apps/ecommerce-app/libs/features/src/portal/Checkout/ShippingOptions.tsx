'use client';

import {
  ShippingType,
  useShippingOptionsQuery,
} from 'libs/graphql/src/generated';
import { Truck } from 'lucide-react';
import { useEffect } from 'react';
import { useCartContext } from '../Cart/CartContext';

type ShippingOption = {
  _id: string;
  label: string;
  description: string;
  type: ShippingType;
  fee: string;
};

type Props = {
  option: ShippingOption;
  selected: boolean;
  onSelect: () => void;
};

export function ShippingOptionCard({ option, selected, onSelect }: Props) {
  return (
    <div
      data-selected-shipping={selected}
      onClick={onSelect}
      className="
        mt-3 p-6 rounded-lg cursor-pointer border-[2px]
        border-carbon-700 hover:border-cyan-700
        data-[selected-shipping=true]:border-cyan-700
        data-[selected-shipping=true]:bg-cyan-200
      "
    >
      {/* Hidden Radio */}
      <input
        type="radio"
        name="shippingMethod"
        value={option.type}
        className="hidden"
      />

      <div className="flex items-center gap-3">
        <Truck
          data-selected-shipping={selected}
          className="
            h-10 w-10 p-2 rounded-md text-cyan-900 bg-carbon-950
            data-[selected-shipping=true]:bg-cyan-700
            data-[selected-shipping=true]:text-white
          "
        />
        <p
          data-selected-shipping={selected}
          className="
            font-semibold
            data-[selected-shipping=true]:text-black
          "
        >
          {option.label}
        </p>
      </div>

      <p className="text-carbon-400 text-sm mt-1">{option.description}</p>
    </div>
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
    <div>
      <p className="text-carbon-25 flex gap-3 items-center text-lg font-bold">
        <Truck className="text-cyan-900 h-11 w-11" /> Shipping Method
      </p>

      {query.loading && (
        <p className="text-sm text-gray-500 mt-2">
          Loading shipping methods...
        </p>
      )}

      {!query.loading && !shippingMethods.length && (
        <p className="text-sm text-gray-500 mt-2">
          No active shipping methods are available right now.
        </p>
      )}

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
  );
};
