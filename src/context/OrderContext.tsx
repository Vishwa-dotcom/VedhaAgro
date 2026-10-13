'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Order } from '@/types';
import { products as catalogProducts } from '@/lib/sampleData';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
  clearOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);
  const ordersRef = useRef<Order[]>([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('vedha-orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        const catalogById = new Map(catalogProducts.map((product) => [product.id, product]));
        // Convert date strings back to Date objects
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          items: order.items.map((item: Order['items'][number]) => ({
            ...item,
            productName: catalogById.get(item.productId)?.name ?? item.productName,
          })),
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
        }));
        ordersRef.current = ordersWithDates;
        setOrders(ordersWithDates);
      } catch (error) {
        console.error('Failed to load orders:', error);
      }
    }
    setMounted(true);
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('vedha-orders', JSON.stringify(orders));
    }
  }, [orders, mounted]);

  const addOrder = (order: Order) => {
    const nextOrders = [...ordersRef.current, order];
    localStorage.setItem('vedha-orders', JSON.stringify(nextOrders));
    ordersRef.current = nextOrders;
    setOrders(nextOrders);
  };

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  const clearOrders = () => {
    localStorage.setItem('vedha-orders', JSON.stringify([]));
    ordersRef.current = [];
    setOrders([]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        getOrderById,
        clearOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
