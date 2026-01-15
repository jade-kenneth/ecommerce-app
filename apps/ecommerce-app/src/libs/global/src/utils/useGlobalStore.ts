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
        setIsOpen: (isOpen) =>
          set((prev) => ({ ...prev, cart: { ...prev.cart, isOpen } })),
      },
    }))
  )
);
