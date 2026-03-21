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

declare global {
  interface Window {
    dataLayer: DataLayerEntry[];
    gtag: (...args: GtagArgs) => void;
  }
}
