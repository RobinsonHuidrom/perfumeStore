"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Sparkles, Menu, X, User, LogOut } from "lucide-react";

export const Header = () => {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem("maison_current_user");
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    const interval = setInterval(checkUser, 1000);
    return () => {
      window.removeEventListener("storage", checkUser);
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem("maison_current_user");
    setCurrentUser(null);
  };

  const firstName = currentUser ? currentUser.name.split(" ")[0] : "";

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gold-500/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-gold-500 p-2 transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Brand Logo with Link to Homepage */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-400 flex items-center justify-center text-obsidian-900 font-serif font-bold shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform duration-300">
            M
          </div>
          <div>
            <span className="text-xl md:text-2xl font-serif tracking-widest text-white group-hover:text-gold-400 transition-colors uppercase font-bold block">
              Maison de Parfum
            </span>
            <span className="block text-[10px] tracking-[0.3em] text-gold-500/80 uppercase font-sans">
              Haute Parfumerie Paris
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] font-medium uppercase text-gray-300">
          <Link href="/#catalog" className="hover:text-gold-400 transition-colors relative py-1 group">
            Collection
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="hover:text-gold-400 transition-colors relative py-1 group">
            About Atelier
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="hover:text-gold-400 transition-colors relative py-1 group">
            Contact Us
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Right Utility Icons */}
        <div className="flex items-center space-x-5">
          <div className="hidden sm:flex items-center text-xs tracking-wider text-gray-400 border border-gold-500/20 rounded-full px-3 py-1 bg-obsidian-800/50">
            <Sparkles size={12} className="text-gold-500 mr-1.5" />
            <span>Complimentary Shipping</span>
          </div>

          {/* Dynamic Account Link or Logged In User */}
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-gold-500/10 border border-gold-500/30 rounded-full px-3 py-1.5">
              <Link
                href="/account"
                className="flex items-center space-x-1.5 text-gold-300 hover:text-gold-400 transition-colors"
              >
                <User size={16} className="text-gold-400" />
                <span className="text-xs font-mono font-bold tracking-wider">{firstName}</span>
              </Link>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="text-gray-400 hover:text-red-400 transition-colors pl-1 border-l border-gold-500/20"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              href="/account"
              className="p-2 text-gray-200 hover:text-gold-400 transition-all duration-200 group flex items-center space-x-1"
              aria-label="Client Account & Orders"
            >
              <User size={20} className="group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline text-[11px] font-mono uppercase tracking-widest text-gray-300 group-hover:text-gold-400">Account</span>
            </Link>
          )}

          {/* Cart Icon Button */}
          <button
            onClick={openCart}
            className="relative p-2 text-gray-200 hover:text-gold-400 transition-all duration-200 group"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-obsidian-900 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-gold-500/10 px-6 py-6 space-y-4 text-sm uppercase tracking-widest text-center">
          <Link
            href="/#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-200 hover:text-gold-400 py-2"
          >
            Collection
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-200 hover:text-gold-400 py-2"
          >
            About Atelier
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-200 hover:text-gold-400 py-2"
          >
            Contact Us
          </Link>
          <Link
            href="/account"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gold-400 hover:text-gold-300 py-2 font-mono"
          >
            {currentUser ? `Account (${firstName})` : "Sign In / Register"}
          </Link>
        </div>
      )}
    </header>
  );
};
