import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

interface GlobalState {
  authenticate: {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    isAuthDialogOpen: boolean;
    setAuthDialogOpen: (value: boolean) => void;
    setUser: (email: string) => void;
    email?: string;
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
        isAuthDialogOpen: false,
        setAuthDialogOpen: (isAuthDialogOpen: boolean) =>
          set((prev) => ({
            authenticate: {
              ...prev.authenticate,
              isAuthDialogOpen,
            },
          })),
        email: '',
        setUser: (email) =>
          set((prev) => ({
            ...prev,
            user: {
              ...prev,
              email,
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
    })),
  ),
);
