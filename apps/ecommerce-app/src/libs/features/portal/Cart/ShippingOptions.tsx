import { MdLocalShipping } from 'react-icons/md';
import { ShippingType } from '~/graphql/generated';
import { useCartContext } from './CartContext';

type ShippingOption = {
  name: string;
  description: string;
  type: ShippingType;
  price: string;
};

type Props = {
  option: ShippingOption;
  selected: boolean;
  onSelect: () => void;
};

export const shippingMethods: ShippingOption[] = [
  {
    name: 'Standard Shipping',
    description: 'Estimated delivery: 5-7 business days',
    type: ShippingType.Standard,
    price: '5',
  },
  {
    name: 'Express Shipping',
    description: 'Estimated delivery: 2-3 business days',
    type: ShippingType.Express,
    price: '15',
  },
  {
    name: 'Same Day Shipping',
    description: 'Estimated delivery: 1 business day',
    type: ShippingType.SameDay,
    price: '25',
  },
];
export function ShippingOptionCard({ option, selected, onSelect }: Props) {
  return (
    <div
      data-selected-shipping={selected}
      onClick={onSelect}
      className="
        mt-3 p-6 rounded-lg cursor-pointer border-[2px]
        border-carbon-700-value hover:border-primary-700-value
        data-[selected-shipping=true]:border-primary-700-value
        data-[selected-shipping=true]:bg-primary-200-value
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
        <MdLocalShipping
          data-selected-shipping={selected}
          className="
            h-10 w-10 p-2 rounded-md text-primary-900-value bg-carbon-950-value
            data-[selected-shipping=true]:bg-primary-700-value
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
          {option.name}
        </p>
      </div>

      <p className="text-carbon-400-value text-sm mt-1">{option.description}</p>
    </div>
  );
}

export const ShippingOptions = () => {
  const context = useCartContext();
  return (
    <div>
      <p className="text-carbon-25-value flex gap-3 items-center text-lg font-bold">
        <MdLocalShipping className="text-primary-900-value h-11 w-11" />{' '}
        Shipping Method
      </p>
      {shippingMethods.map((method) => (
        <ShippingOptionCard
          key={method.type}
          option={method}
          selected={method.type === context.state.cart.shipping?.type}
          onSelect={() => {
            context.setState({
              ...context.state,
              cart: {
                ...context.state.cart,
                shipping: {
                  type: method.type,
                  fee: method.price,
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
