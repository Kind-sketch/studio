
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { products as sampleProducts } from '@/lib/data';

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  product: Product;
  quantity: number;
  buyer: string;
  orderDate: string;
  status: OrderStatus;
}

interface ArtisanContextType {
  products: Product[];
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const ArtisanContext = createContext<ArtisanContextType | undefined>(undefined);

export function ArtisanProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load products from localStorage
    const storedProducts = localStorage.getItem('myArtisanProducts');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }

    // Load orders from localStorage or create mock data
    const storedOrders = localStorage.getItem('myOrders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Create some initial mock orders if none exist
      const mockOrders: Order[] = sampleProducts.slice(3, 5).map((p, i) => ({
        id: `order-${i + 1}`,
        product: p,
        quantity: 1,
        buyer: `Customer ${i + 1}`,
        orderDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Processing',
      }));
      setOrders(mockOrders);
      localStorage.setItem('myOrders', JSON.stringify(mockOrders));
    }
  }, []);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      localStorage.setItem('myOrders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  };

  const value = { products, orders, updateOrderStatus };

  return (
    <ArtisanContext.Provider value={value}>
      {children}
    </ArtisanContext.Provider>
  );
}

export function useArtisan() {
  const context = useContext(ArtisanContext);
  if (context === undefined) {
    throw new Error('useArtisan must be used within an ArtisanProvider');
  }
  return context;
}
