export type CreateGcashPaymentInput = {
  amount: string;
  referenceId: string;
  successUrl: string;
  failureUrl: string;
  description: string;
};

type ChannelProperties = {
  success_return_url: string;
  failure_return_url: string;
};

type PaymentAction = {
  type: string;
  descriptor: string;
  value: string;
};
export type PaymentRequestResponse = {
  payment_request_id: string;
  country: string;
  currency: string;
  business_id: string;
  reference_id: string;
  description: string;
  created: string;
  updated: string;
  status: string;
  capture_method: string;
  channel_code: string;
  request_amount: string;
  channel_properties: ChannelProperties;
  type: string;
  actions: [PaymentAction];
};
