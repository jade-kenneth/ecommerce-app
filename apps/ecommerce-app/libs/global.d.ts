export {};

type GtagParams = Record<string, unknown>;
type GtagArgs =
  | ['js', Date]
  | ['config', string, GtagParams?]
  | ['event', string, GtagParams?]
  | ['set', GtagParams]
  | ['consent', 'default' | 'update', GtagParams]
  | [string, ...unknown[]];

type DataLayerEntry = {
  event?: string;
  ecommerce?: Record<string, unknown> | null;
  timestamp?: number;
  [key: string]: unknown;
};

type TurnstileRenderOptions = {
  action?: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  sitekey: string;
  theme?: 'auto' | 'light' | 'dark';
};

type TurnstileApi = {
  remove?: (widgetId: string) => void;
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    dataLayer: DataLayerEntry[];
    gtag: (...args: GtagArgs) => void;
    turnstile?: TurnstileApi;
  }
}
