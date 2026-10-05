'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CartItem, Product } from '@/types';
import { getMinimumOrderQuantity, getProductPrice } from '@/lib/utils';
import { products as catalogProducts } from '@/lib/sampleData';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const itemsRef = useRef<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('vedha-cart');
    if (savedCart) {
      try {
        const catalogById = new Map(catalogProducts.map((product) => [product.id, product]));
        const savedItems = JSON.parse(savedCart) as CartItem[];
        const restoredItems = savedItems.map((item) => {
          const product = catalogById.get(item.productId) ?? item.product;
          if (!product) return item;
          const quantity = Math.max(getMinimumOrderQuantity(product), item.quantity);
          return {
            ...item,
            product,
            quantity,
            price: getProductPrice(product, quantity),
          };
        });
        itemsRef.current = restoredItems;
        setItems(restoredItems);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('vedha-cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const commitItems = (nextItems: CartItem[]) => {
    itemsRef.current = nextItems;
    setItems(nextItems);
    localStorage.setItem('vedha-cart', JSON.stringify(nextItems));
  };

  const addItem = (product: Product, quantity: number) => {
    const minimumOrderQuantity = getMinimumOrderQuantity(product);
    const requestedQuantity = Math.max(minimumOrderQuantity, quantity);
    const existingItem = itemsRef.current.find((item) => item.productId === product.id);
    const nextQuantity = (existingItem?.quantity ?? 0) + requestedQuantity;
    const nextItem: CartItem = existingItem
      ? {
          ...existingItem,
          quantity: nextQuantity,
          price: getProductPrice(product, nextQuantity),
          product,
        }
      : {
          id: `cart-${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          quantity: nextQuantity,
          price: getProductPrice(product, nextQuantity),
          addedAt: new Date(),
        };
    commitItems(existingItem
      ? itemsRef.current.map((item) => item.productId === product.id ? nextItem : item)
      : [...itemsRef.current, nextItem]);
  };

  const removeItem = (productId: string) => {
    commitItems(itemsRef.current.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    commitItems(itemsRef.current.map((item) => {
      if (item.productId !== productId) return item;
      const minimumQuantity = item.product
        ? getMinimumOrderQuantity(item.product)
        : 1;
      const nextQuantity = Math.max(minimumQuantity, quantity);
      return {
        ...item,
        quantity: nextQuantity,
        price: item.product ? getProductPrice(item.product, nextQuantity) : item.price,
      };
    }));
  };

  const clearCart = () => {
    commitItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTax = () => {
    return Math.round(getSubtotal() * 0.05); // 5% tax
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        getTax,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
