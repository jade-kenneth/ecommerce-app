export interface AsyncEvent {
  type: string;
  data: any;
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
