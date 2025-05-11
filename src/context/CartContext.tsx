'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productType: 'dress' | 'bracelet' | 'necklace';
  measurements?: {
    shoulders?: number;
    waist?: number;
    hips?: number;
    wrist?: number;
    neck?: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number, measurements?: Record<string, number | undefined>) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isInitialized: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const defaultContext: CartContextType = {
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  total: 0,
  isInitialized: false
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      localStorage.removeItem('cart');
    }
    setIsInitialized(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted || !isInitialized) return;
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems, isMounted, isInitialized]);

  const addToCart = (item: CartItem) => {
    if (!isMounted || !isInitialized) return;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    if (!isMounted || !isInitialized) return;
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number, measurements?: Record<string, number | undefined>) => {
    if (!isMounted || !isInitialized) return;

    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { 
          ...item, 
          quantity,
          measurements: measurements || item.measurements
        } : item
      )
    );
  };

  const clearCart = () => {
    if (!isMounted || !isInitialized) return;
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    total,
    isInitialized
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  
  if (typeof window === 'undefined') {
    return defaultContext;
  }

  if (!context) {
    console.warn('useCart was called outside of CartProvider');
    return defaultContext;
  }

  if (!context.isInitialized) {
    return defaultContext;
  }

  return context;
}