import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ClothingItem } from '@/types/clothingItem';

type CartItem = ClothingItem & { quantity: number; size: string };

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: ClothingItem, size: string, quantity?: number) => void;
  decrementFromCart: (id: string, size: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: ClothingItem, size: string, quantity = 1) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id && i.size === size);
      if (exists) {
        return prev.map((i) => (i._id === item._id && i.size === size ? { ...i, quantity: i.quantity + quantity } : i));
      } else {
        return [...prev, { ...item, quantity, size }];
      }
    });
  };

  const decrementFromCart = (id: string, size: string) => {
    setCart((prev) =>
      prev.flatMap((i) => {
        if (i._id === id && i.size === size) {
          if (i.quantity > 1) {
            return { ...i, quantity: i.quantity - 1 };
          } else {
            return [];
          }
        }
        return i;
      }),
    );
  };

  const clearCart = () => setCart([]);

  return <CartContext.Provider value={{ cart, addToCart, decrementFromCart, clearCart }}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
