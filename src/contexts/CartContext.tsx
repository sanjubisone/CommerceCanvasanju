'use client';

import type { Product, CartItem } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  browsingHistory: string[];
  addToBrowsingHistory: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [browsingHistory, setBrowsingHistory] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
    const storedHistory = localStorage.getItem('browsingHistory');
    if (storedHistory) {
      setBrowsingHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('browsingHistory', JSON.stringify(browsingHistory));
  }, [browsingHistory]);

  const addToBrowsingHistory = (productId: string) => {
    setBrowsingHistory(prevHistory => {
      const updatedHistory = [productId, ...prevHistory.filter(id => id !== productId)];
      // Keep history to a reasonable length, e.g., last 20 viewed items
      return updatedHistory.slice(0, 20); 
    });
  };

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantityToAdd, product.stock) }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: Math.min(quantityToAdd, product.stock) }];
    });
    toast({
      title: `${product.name} added to cart!`,
      description: `Quantity: ${quantityToAdd}`,
      variant: 'default',
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
      title: 'Item removed from cart',
      variant: 'destructive',
    });
  };

  const updateQuantity = (productId:string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) } : item
      ).filter(item => item.quantity > 0) // Remove if quantity becomes 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        browsingHistory,
        addToBrowsingHistory,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
