"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";

export const CartDrawer = () => {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, setIsCheckoutOpen } = useCart();

  if (!isOpen) return null;

  const handleStartCheckout = () => {
    closeCart();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-obsidian-900 border-l border-gold-500/20 text-white flex flex-col justify-between shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-gold-500/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag size={20} className="text-gold-500" />
              <h2 className="text-xl font-serif tracking-wide text-white">Your Perfume Bag</h2>
            </div>
            <button
              onClick={closeCart}
              className="text-gray-400 hover:text-white p-2 transition-colors rounded-full hover:bg-obsidian-800"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length > 0 ? (
              cart.map((item) => {
                const img = item.product.images?.[0]?.url || item.product.thumbnail || "http://localhost:9000/static/perfume_1.png";
                return (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-3 rounded-xl bg-obsidian-800/60 border border-gold-500/10"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-obsidian-900 p-1 shrink-0 flex items-center justify-center">
                      <img
                        src={img}
                        alt={item.product.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-serif text-white truncate font-medium">
                        {item.product.title}
                      </h4>
                      <p className="text-[10px] text-gold-400 uppercase tracking-widest font-mono mt-0.5">
                        Bottle Size: {item.selectedSize}
                      </p>
                      <p className="text-xs text-gray-300 font-serif mt-1">
                        ₹{item.unitPrice} INR
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded bg-obsidian-700 text-gray-300 hover:text-white hover:bg-obsidian-600 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-mono px-2 text-white font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded bg-obsidian-700 text-gray-300 hover:text-white hover:bg-obsidian-600 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Remove Item */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-red-400 p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-obsidian-800 flex items-center justify-center mx-auto text-gold-500">
                  <ShoppingBag size={28} />
                </div>
                <p className="text-sm font-serif text-gray-400">Your fragrance bag is empty.</p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-gold-500/20 text-gold-400 rounded-full text-xs uppercase tracking-wider hover:bg-gold-500/30 transition-colors"
                >
                  Discover Perfumes
                </button>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gold-500/10 bg-obsidian-800/40 space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-gold-400" />
                  <span>Complimentary Shipping</span>
                </span>
                <span className="text-emerald-400 font-mono">Free</span>
              </div>

              <div className="flex items-center justify-between text-sm font-serif text-white pt-2 border-t border-obsidian-700">
                <span>Subtotal</span>
                <span className="text-lg font-bold text-gold-400">₹{subtotal} INR</span>
              </div>

              <button
                onClick={handleStartCheckout}
                className="w-full py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-obsidian-900 font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Initialize Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
