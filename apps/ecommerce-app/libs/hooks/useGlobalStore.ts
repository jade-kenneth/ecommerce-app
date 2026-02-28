import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

interface GlobalState {
  authenticate: {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    isAuthDialogOpen: boolean;
    setAuthDialogOpen: (value: boolean) => void;
    setUser: (user: { email?: string; userId?: string }) => void;
    email?: string;
    userId?: string;
  };

  cart: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    '~touched': boolean;
  };

  rating: {
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
        isAuthDialogOpen: false,
        setAuthDialogOpen: (isAuthDialogOpen: boolean) =>
          set((prev) => ({
            authenticate: {
              ...prev.authenticate,
              isAuthDialogOpen,
            },
          })),
        email: undefined,
        userId: undefined,
        setUser: ({ email, userId }) =>
          set((prev) => ({
            authenticate: {
              ...prev.authenticate,
              email: email ?? prev.authenticate.email,
              userId: userId ?? prev.authenticate.userId,
            },
          })),
      },
      cart: {
        isOpen: false,
        '~touched': false,
        setIsOpen: (isOpen) =>
          set((prev) => ({
            ...prev,
            cart: { ...prev.cart, isOpen, '~touched': true },
          })),
      },
      rating: {
        isOpen: false,
        setIsOpen: (isOpen: boolean) =>
          set((prev) => ({
            ...prev,
            rating: {
              ...prev.rating,
              isOpen,
            },
          })),
      },
    })),
  ),
);
