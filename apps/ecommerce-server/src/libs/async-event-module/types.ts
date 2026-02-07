export interface AsyncEventPayloads {
  SuccessfulSignup: {
    emailAddress: string;
    firstName: string;
  };
  PasswordResetRequested: {
    emailAddress: string;
    resetToken: string;
  };
  OrderCreated: {
    orderId: string;
    accountId: string;
    emailAddress?: string;
    total: string;
    itemCount: number;
    items: {
      name: string;
      image?: string;
      quantity: number;
      total: string;
    }[];
  };
}

export type AsyncEventType = keyof AsyncEventPayloads;

export interface AsyncEvent<TType extends AsyncEventType = AsyncEventType> {
  type: TType;
  data: AsyncEventPayloads[TType];
  id: string;
}
export interface AsyncEventModuleOptions {
  context: string; // topic suffix
  kafka: {
    brokers: string[];
    clientId?: string;
  };
  redis?: {
    host: string;
    port: number;
  };
  concurrency?: number;
}
