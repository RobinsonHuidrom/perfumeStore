"use client";

import React from "react";
import Link from "next/link";
import { PerfumeProduct } from "@/lib/medusa";
import { Sparkles, ArrowRight, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface FeaturedCollectionBannerProps {
  products: PerfumeProduct[];
}

export const FeaturedCollectionBanner: React.FC<FeaturedCollectionBannerProps> = ({ products }) => {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = React.useState<string | null>(null);

  // Find products belonging to custom collections (e.g. Luminous Edition) or fallback to top 3 featured
  const collectionProducts = products.filter(
    (p) => (p.collectionTitle && p.collectionTitle.toLowerCase().includes("luminous")) || p.title.includes("Cypress") || p.title.includes("Vétiver") || p.title.includes("Ambre")
  ).slice(0, 3);

  if (collectionProducts.length === 0) return null;

  const handleQuickAdd = (product: PerfumeProduct) => {
    addToCart(product, "50ml", 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Luxury Promo Banner Container */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-gold-500/30 p-8 sm:p-12 shadow-2xl bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-obsidian-800">
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 pb-8 border-b border-gold-500/15">
          <div className="max-w-2xl">
            <span className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.3em] text-gold-400 bg-gold-500/10 px-4 py-1.5 rounded-full border border-gold-500/20 mb-4">
              <Sparkles size={13} className="text-gold-400" />
              <span>Featured Atelier Collection</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-3">
              Luminous Edition
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              Curated haute parfumerie extractions formulated in Paris. Experience rare, smoldering woods and luminous evening signatures crafted for unforgettable elegance.
            </p>
          </div>

          <Link
            href="/#catalog"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-900 font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-gold-500/15 self-start lg:self-center"
          >
            <span>Explore All 15 Extractions</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* 3-Card Featured Collection Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {collectionProducts.map((product) => {
            const price = product.variants?.[0]?.prices?.[0]?.amount || 130;
            const image = product.images?.[0]?.url || "http://localhost:9000/static/perfume_1.png";

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl bg-obsidian-800/80 border border-gold-500/20 hover:border-gold-500/50 p-5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl bg-obsidian-900/90 p-3 border border-gold-500/10 flex items-center justify-center">
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-mono text-gold-400 bg-obsidian-900/90 px-2 py-0.5 rounded border border-gold-500/20">
                      Luminous Series
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-white group-hover:text-gold-400 transition-colors mb-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-light line-clamp-2 mb-3">
                    {product.description || "Extrait de Parfum handcrafted in Paris with rare botanical extractions."}
                  </p>
                </div>

                <div className="pt-3 border-t border-gold-500/10 flex items-center justify-between">
                  <div className="font-serif font-bold text-white text-base">
                    ₹{price} <span className="text-[10px] font-mono text-gray-400">INR</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className={`p-2.5 rounded-lg text-xs transition-colors ${
                        addedId === product.id
                          ? "bg-emerald-600 text-white"
                          : "bg-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-obsidian-900"
                      }`}
                      title="Quick Add 50ml"
                    >
                      {addedId === product.id ? <Check size={15} /> : <ShoppingBag size={15} />}
                    </button>
                    <Link
                      href={`/products/${product.handle}`}
                      className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-500/20 text-gray-300 hover:text-white text-[11px] font-mono uppercase tracking-wider"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
