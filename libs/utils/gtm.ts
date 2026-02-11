import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import { Capacitor } from '@capacitor/core';

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

function gtmPageView(params?: Record<string, any>) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    pageTitle: document.title,
    pagePath: window.location.pathname,
    pageHostname: window.location.hostname,
    deviceType: getDeviceType(),
    timestamp: Date.now(),
    ...params,
  });

  if (Capacitor.isNativePlatform()) {
    FirebaseAnalytics.logEvent({
      name: 'page_view',
      params: {
        page_title: document.title,
        page_path: window.location.pathname,
        page_hostname: window.location.hostname,
        device_type: getDeviceType(),
        ...params,
      },
    });

    FirebaseAnalytics.setCurrentScreen({
      screenName: window.location.pathname,
      screenClassOverride: document.title,
    });
  }
}

type event = 'add_to_cart' | 'purchase' | 'begin_checkout' | 'view_item';

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

  if (Capacitor.isNativePlatform()) {
    FirebaseAnalytics.logEvent({
      name: 'purchase',
      params: {
        transaction_id: transactionId,
        value: amount,
        currency,
        payment_type: paymentType,
        coupon,
      },
    });
  }
}

export const gtm = {
  gtmPageView,
  gtmEvent,
  gtmPurchaseEvent,
};
