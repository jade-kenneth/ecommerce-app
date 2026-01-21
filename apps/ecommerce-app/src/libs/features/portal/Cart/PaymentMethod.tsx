import { twMerge } from 'tailwind-merge';
import { PaymentMethodType } from '~/graphql/generated';
import { useCartContext } from './CartContext';

type PaymentOptionCardProps = {
  title: string;
  description: string;
  type: PaymentMethodType;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
};

export function PaymentOptionCard({
  title,
  description,
  type,
  icon,
  selected,
  onSelect,
}: PaymentOptionCardProps) {
  return (
    <button
      onClick={onSelect}
      data-selected={selected}
      className={twMerge(
        'text-left w-full rounded-xl p-5 border transition',
        selected
          ? 'bg-primary-50-value border-primary-300-value shadow-sm'
          : 'border-carbon-200-value hover:border-primary-400-value'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={twMerge(
            'p-3 rounded-lg',
            selected
              ? 'bg-primary-600-value text-white'
              : 'bg-carbon-900-value text-carbon-100-value'
          )}
        >
          {icon}
        </div>

        <div>
          <p className="text-lg font-semibold text-carbon-25-value">{title}</p>
          <p className="text-sm text-carbon-500-value">{description}</p>
        </div>
      </div>
    </button>
  );
}

export type PaymentOption = {
  title: string;
  description: string;
  type: PaymentMethodType;
  icon: React.ReactNode;
};

const WalletIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {' '}
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7h18M5 11h14M4 15h8"
    />{' '}
  </svg>
);
const CardIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {' '}
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7h18M3 12h18m-7 5h7"
    />{' '}
  </svg>
);
const BankIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {' '}
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10h18M5 21h14M3 10l9-7 9 7M9 21v-8h6v8"
    />{' '}
  </svg>
);
const QrIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {' '}
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h6v6H3zM3 15h6v6H3zM15 3h6v6h-6zM15 15h3v3h3v3h-6z"
    />{' '}
  </svg>
);
export const paymentMethods: PaymentOption[] = [
  {
    title: 'GCash',
    description: 'Digital wallet payment',
    type: PaymentMethodType.Gcash,
    icon: <WalletIcon />,
  },
  {
    title: 'Credit/Debit Card',
    description: 'Visa, Mastercard, AmEx',
    type: PaymentMethodType.Card,
    icon: <CardIcon />,
  },
  {
    title: 'Bank Transfer',
    description: 'Direct bank transfer',
    type: PaymentMethodType.BankTransfer,
    icon: <BankIcon />,
  },
  {
    title: 'Cash on Delivery',
    description: 'Pay when you receive',
    type: PaymentMethodType.CashOnDelivery,
    icon: <QrIcon />,
  },
];
export default function PaymentMethod() {
  const context = useCartContext();

  return (
    <div className="w-[inherit] mx-auto py-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <PaymentOptionCard
            key={method.type}
            title={method.title}
            description={method.description}
            type={method.type}
            icon={method.icon}
            selected={context.state.cart.paymentMethod === method.type}
            onSelect={() =>
              context.setState({
                ...context.state,
                cart: {
                  ...context.state.cart,
                  paymentMethod: method.type,
                },
              })
            }
          />
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <p className="text-blue-800 text-sm">
          <span className="font-semibold">Secure Payment:</span> All
          transactions are encrypted and secure. Your payment information is
          protected.
        </p>
      </div>
    </div>
  );
}
