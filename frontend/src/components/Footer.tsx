"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, MapPin, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-obsidian-900 border-t border-gold-500/10 pt-20 pb-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter / Membership section */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 mb-16 border border-gold-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-mono tracking-widest uppercase mb-2">
                <Sparkles size={12} />
                <span>Private Atelier Club</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-serif text-white mb-3">
                Receive Complimentary Discovery Samples
              </h3>
              <p className="text-xs sm:text-sm font-light text-gray-300 max-w-lg">
                Subscribe to receive private invitations to limited-edition extractions and seasonal harvests.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="w-full bg-obsidian-800 border border-gold-500/20 rounded-full px-5 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-obsidian-900 font-bold text-xs uppercase tracking-wider rounded-full transition-colors shrink-0 flex items-center space-x-1"
                >
                  <span>Join</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16 border-b border-gold-500/10 pb-16">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-obsidian-900 font-serif font-bold text-sm">
                M
              </div>
              <span className="font-serif text-lg text-white font-bold tracking-widest uppercase">
                Maison de Parfum
              </span>
            </div>
            <p className="text-xs font-light leading-relaxed">
              Haute Parfumerie born in Paris and distilled in Grasse. Formulated with 100% natural, sustainably harvested botanicals.
            </p>
            <div className="text-[10px] uppercase font-mono tracking-widest text-gold-400">
              Grasse • Paris • London • Tokyo
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-serif text-white text-sm uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <Link href="/#catalog" className="hover:text-gold-400 transition-colors">15 Fragrances Library</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">About Our Atelier</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-400 transition-colors">Contact Us & Concierge</Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-gold-400 transition-colors">Special Offers & Discounts</Link>
              </li>
            </ul>
          </div>

          {/* Olfactory Families */}
          <div>
            <h4 className="font-serif text-white text-sm uppercase tracking-widest mb-4">Fragrance Families</h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li><span className="hover:text-gold-400 transition-colors cursor-pointer">Woody & Amber Extractions</span></li>
              <li><span className="hover:text-gold-400 transition-colors cursor-pointer">Floral & Fresh Waters</span></li>
              <li><span className="hover:text-gold-400 transition-colors cursor-pointer">Oriental & Spiced Resins</span></li>
              <li><span className="hover:text-gold-400 transition-colors cursor-pointer">Gourmand & Musk Accords</span></li>
            </ul>
          </div>

          {/* Direct Concierge Contact */}
          <div>
            <h4 className="font-serif text-white text-sm uppercase tracking-widest mb-4">Atelier Concierge</h4>
            <ul className="space-y-3 text-xs font-light">
              <li className="flex items-start space-x-2">
                <MapPin size={15} className="text-gold-400 shrink-0 mt-0.5" />
                <span>18 Rue Saint-Honoré, 75001 Paris, France</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={15} className="text-gold-400 shrink-0" />
                <span>+33 1 42 68 55 00</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={15} className="text-gold-400 shrink-0" />
                <span>concierge@maisondeparfum.fr</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-gray-400 space-y-4 sm:space-y-0">
          <div>
            © 2026 Maison de Parfum Paris. All rights reserved. Powered by Medusa v2.
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
