import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

interface GlobalState {
  authenticate: {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
  };
  cart: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    count: number;
    setCount: (value: number) => void;
    '~touched': boolean;
  };
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    subscribeWithSelector((set) => ({
      authenticate: {
        isAuthenticated: false,
        setIsAuthenticated: (isAuthenticated: boolean) =>
          set((prev) => ({
            authenticate: {
              ...prev.authenticate,
              isAuthenticated,
            },
          })),
      },
      cart: {
        isOpen: false,
        '~touched': false,
        count: 0,
        setIsOpen: (isOpen) =>
          set((prev) => ({
            ...prev,
            cart: { ...prev.cart, isOpen, '~touched': true },
          })),
        setCount: (count) =>
          set((prev) => ({ ...prev, cart: { ...prev.cart, count } })),
      },
    }))
  )
);
