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
  useSelfQuery,
} from '~/graphql/generated';

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
    description: 'Estimated delivery: 5-7 business days',
    fee: '5',
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
        quantity: Math.max(0, action.payload.quantity),
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

  const { itemsCount } = state;

  const { data: selfQuery } = useSelfQuery();
  const selfId = selfQuery?.self?._id;

  const { data: cartData } = useCartQuery({
    skip: !selfId,
    variables: { id: selfId ?? '' },
  });

  const productIds = useMemo(() => {
    const ids =
      cartData?.cart.items?.map((p) => p?.productId).filter(Boolean) ?? [];
    return Array.from(new Set(ids));
  }, [cartData]);

  const { data: productsData } = useProductsQuery({
    skip: productIds.length === 0,
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
    (next: Partial<CartState> | ((prev: CartState) => Partial<CartState>)) => {
      const payload = typeof next === 'function' ? next(state) : next;
      dispatch({ type: 'mergeState', payload });
    },
    [state],
  );

  useEffect(() => {
    if (!cartData?.cart) return;

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

    const mergedItems = cartData.cart.items.map((item) => {
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
      ...cartData.cart,
      items: mergedItems.map((i) => omit(i, ['__typename'])),
    };

    dispatch({ type: 'setCart', payload: nextCart });
  }, [cartData, productsData]);

  return {
    state,
    itemsCount,
    setQuantity,
    addCartItem,
    removeCartItem,
    setState,
  };
};
