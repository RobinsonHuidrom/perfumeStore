"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PerfumeProduct, PerfumeVariant } from "@/lib/medusa";

export interface CartItem {
  id: string;
  product: PerfumeProduct;
  variant: PerfumeVariant;
  selectedSize: string; // "50ml" | "100ml"
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: PerfumeProduct, size: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (val: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("maison_perfume_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Could not load cart from storage", e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("maison_perfume_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Could not save cart to storage", e);
    }
  }, [cart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("maison_perfume_cart");
  };

  const addToCart = (product: PerfumeProduct, size: string, quantity = 1) => {
    const variant =
      product.variants.find((v) =>
        v.title.toLowerCase().includes(size.toLowerCase()) ||
        (v.options && Object.values(v.options).some(val => String(val).toLowerCase().includes(size.toLowerCase())))
      ) || product.variants[0];

    const price = variant?.prices?.[0]?.amount || 135;
    const itemId = `${product.id}-${size}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          variant,
          selectedSize: size,
          quantity,
          unitPrice: price,
        },
      ];
    });

    setIsOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCheckoutOpen,
        setIsCheckoutOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
