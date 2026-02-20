'use client';

import { omit } from 'es-toolkit';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  CartStatus,
  CategoryType,
  PaymentMethodType,
  ShippingType,
  useCartQuery,
  useProductsQuery,
} from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';

export interface Item {
  thumbnail: string;
  name: string;
  price: number;
  productId: string;
  quantity: number;
  discount: number;
  categories?: CategoryType[] | null;
}

export type CartItem = {
  items: Item[];
  subtotal?: string | null;
  tax?: string | null;
  status?: CartStatus;
  shipping?: {
    fee?: string;
    type?: ShippingType;
    description?: string;
  };
  paymentMethod?: PaymentMethodType;
};

type CartState = {
  cart: CartItem;
  itemsCount: number;
};

type CartAction =
  | { type: 'mergeState'; payload: Partial<CartState> }
  | { type: 'setCart'; payload: CartItem }
  | { type: 'addItem'; payload: Item }
  | { type: 'setQuantity'; payload: { id: string; quantity: number } }
  | { type: 'removeItem'; payload: { id: string } };

const initialCart: CartItem = {
  items: [],
  paymentMethod: PaymentMethodType.Gcash,
  shipping: {
    type: ShippingType.Standard,
    description: '3-5 business days',
    fee: '50',
  },
};

const getItemsCount = (items: Item[]) =>
  items.reduce((sum, curr) => sum + (curr.quantity ?? 0), 0);

const reducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'mergeState': {
      const nextCart = {
        ...state.cart,
        ...(action.payload.cart ?? {}),
      };
      const nextState = {
        ...state,
        ...action.payload,
        cart: nextCart,
      };
      return {
        ...nextState,
        itemsCount: getItemsCount(nextCart.items ?? []),
      };
    }
    case 'setCart': {
      return {
        cart: action.payload,
        itemsCount: getItemsCount(action.payload.items ?? []),
      };
    }
    case 'addItem': {
      const existingIndex = state.cart.items.findIndex(
        (i) => i.productId === action.payload.productId,
      );

      const updatedItems = [...state.cart.items];

      if (existingIndex !== -1) {
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
      } else {
        updatedItems.push(action.payload);
      }
      return {
        ...state,
        cart: { ...state.cart, items: updatedItems },
        itemsCount: getItemsCount(updatedItems),
      };
    }
    case 'setQuantity': {
      const existingIndex = state.cart.items.findIndex(
        (i) => i.productId === action.payload.id,
      );
      if (existingIndex === -1) return state;

      const updatedItems = [...state.cart.items];

      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: action.payload.quantity,
      };
      return {
        ...state,
        cart: { ...state.cart, items: updatedItems },
        itemsCount: getItemsCount(updatedItems),
      };
    }
    case 'removeItem': {
      const updatedItems = state.cart.items.filter(
        (i) => i.productId !== action.payload.id,
      );
      return {
        ...state,
        cart: { ...state.cart, items: updatedItems },
        itemsCount: getItemsCount(updatedItems),
      };
    }
    default:
      return state;
  }
};

export const useCart = () => {
  const [state, dispatch] = useReducer(reducer, {
    cart: initialCart,
    itemsCount: 0,
  });

  const globalStore = useGlobalStore((state) => state);

  const { itemsCount } = state;

  const { data: cartQuery } = useCartQuery({
    skip: !globalStore.authenticate.isAuthenticated,
  });

  const productIds = useMemo(
    () => cartQuery?.cart.items?.map((p) => p?.productId).filter(Boolean) ?? [],
    [cartQuery],
  );

  const { data: productsData } = useProductsQuery({
    variables: {
      filter: {
        _id: { in: productIds },
      },
    },
  });

  const addCartItem = useCallback((newItem: Item) => {
    dispatch({ type: 'addItem', payload: newItem });
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'setQuantity', payload: { id, quantity } });
  }, []);

  const removeCartItem = useCallback((id: string) => {
    dispatch({ type: 'removeItem', payload: { id } });
  }, []);

  const setState = useCallback(
    (payload: CartState) => dispatch({ type: 'mergeState', payload }),
    [state],
  );

  useEffect(() => {
    if (!globalStore.authenticate.isAuthenticated) {
      dispatch({ type: 'setCart', payload: initialCart });
      return;
    }
    if (!cartQuery?.cart) return;

    const productsMap = new Map(
      productsData?.products.edges.map((p) => [
        p.node._id,
        {
          thumbnail: p.node.thumbnail,
          name: p.node.name,
          price: p.node.price,
          discount: p.node.discount,
          categories: p.node.category,
        },
      ]) ?? [],
    );

    const mergedItems = cartQuery.cart.items.map((item) => {
      const product = productsMap.get(item.productId);
      return {
        ...item,
        thumbnail: product?.thumbnail ?? './Logo.png',
        name: product?.name ?? 'Discontinued Product',
        price: product?.price ?? 0,
        discount: product?.discount ?? 0,
        categories: product?.categories ?? [],
      };
    });

    const nextCart: CartItem = {
      ...initialCart,
      ...cartQuery.cart,
      items: mergedItems.map((i) => omit(i, ['__typename'])),
    };

    dispatch({ type: 'setCart', payload: nextCart });
  }, [cartQuery, productsData]);

  return {
    state,
    itemsCount,
    setQuantity,
    addCartItem,
    removeCartItem,
    setState,
  };
};
