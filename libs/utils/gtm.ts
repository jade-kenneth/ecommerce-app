function getDeviceType(): string | undefined {
  if (typeof navigator === 'undefined') return undefined;
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua))
    return 'tablet';
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua,
    )
  ) {
    return 'mobile';
  }
  return 'desktop';
}

type event =
  | 'add_to_cart'
  | 'purchase'
  | 'begin_checkout'
  | 'view_item'
  | 'contact_admin';

function gtmEvent(event: event, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...params,
    timestamp: Date.now(),
  });
}

function gtmPurchaseEvent(params: {
  transactionId: string;
  amount: number;
  currency?: string;
  paymentType?: string;
  coupon?: string;
}) {
  if (typeof window === 'undefined') return;

  const {
    transactionId,
    amount,
    currency = 'PHP',
    paymentType = 'Unknown',
    coupon,
  } = params;

  window.dataLayer = window.dataLayer || [];

  // Clear previous ecommerce object (GA4 best practice)
  window.dataLayer.push({ ecommerce: null });

  // Push the purchase event
  window.dataLayer.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: transactionId,
      value: amount,
      currency,
      coupon,
      payment_type: paymentType,
      items: [
        {
          item_id: 'deposit',
          item_name: 'Wallet Deposit',
          price: amount,
          quantity: 1,
          item_category: 'Deposit',
          item_brand: paymentType,
        },
      ],
    },
    deviceType: getDeviceType(),
    timestamp: Date.now(),
  });
}

export const gtm = {
  gtmEvent,
  gtmPurchaseEvent,
};
