"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PerfumeProduct } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Check, Eye, Tag } from "lucide-react";

interface ProductCardProps {
  product: PerfumeProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<"50ml" | "100ml">("50ml");
  const [added, setAdded] = useState(false);

  const variant =
    product.variants.find((v) =>
      v.title.toLowerCase().includes(selectedSize.toLowerCase()) ||
      (v.options && Object.values(v.options).some(val => val.toLowerCase().includes(selectedSize.toLowerCase())))
    ) || product.variants[0];

  const currentPrice = selectedSize === "50ml"
    ? (variant?.prices?.[0]?.amount || 135)
    : (product.variants[1]?.prices?.[0]?.amount || Math.round((variant?.prices?.[0]?.amount || 135) * 1.55));

  const originalPrice = selectedSize === "50ml"
    ? product.originalPrice50
    : product.originalPrice100;

  const imageUrl = product.images?.[0]?.url || product.thumbnail || "http://localhost:9000/static/perfume_1.png";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group glass-panel rounded-2xl p-4 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500 flex flex-col justify-between hover:shadow-2xl hover:shadow-gold-500/5 relative">
      <div>
        {/* Category Tag & Discount Badge (Compact) */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-[0.25em] text-gold-400/90 uppercase font-mono bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/15">
            {product.category || "Extrait de Parfum"}
          </span>

          {originalPrice ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono tracking-widest text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
              <Tag size={10} />
              <span>{product.discountBadge || "SPECIAL OFFER"}</span>
            </span>
          ) : (
            <span className="text-[10px] text-gray-400 font-mono tracking-widest">
              FRAGRANCE
            </span>
          )}
        </div>

        {/* Perfume Image Container (Compact aspect-ratio and padding) */}
        <Link href={`/products/${product.handle}`} className="block relative aspect-[1/1] w-full rounded-xl overflow-hidden bg-obsidian-800/80 mb-3 flex items-center justify-center p-2">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "http://localhost:9000/static/perfume_1.png";
            }}
          />
          <div className="absolute inset-0 bg-obsidian-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="px-3.5 py-1.5 bg-obsidian-900/90 text-gold-400 text-[11px] font-mono uppercase tracking-widest rounded-full border border-gold-500/30 flex items-center space-x-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye size={13} />
              <span>View Fragrance</span>
            </span>
          </div>
        </Link>

        {/* Title */}
        <Link href={`/products/${product.handle}`} className="block">
          <h3 className="text-lg font-serif text-white group-hover:text-gold-400 transition-colors mb-1 font-medium">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3 font-light">
          {product.description}
        </p>
      </div>

      <div>
        {/* Bottle Size Selector (Compact) */}
        <div className="mb-3">
          <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-medium">
            Select Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["50ml", "100ml"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => { e.preventDefault(); setSelectedSize(size); }}
                className={`py-1 px-2.5 text-xs font-mono rounded-lg border transition-all duration-200 ${
                  selectedSize === size
                    ? "bg-gold-500/20 text-gold-300 border-gold-500/60 shadow-sm font-semibold"
                    : "bg-obsidian-800/40 text-gray-400 border-gold-500/10 hover:border-gold-500/30"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Discount Display */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gold-500/10">
          <div>
            <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Price</span>
            <div className="flex items-baseline">
              {originalPrice && (
                <span className="line-through text-gray-500 text-xs font-mono mr-1.5">
                  ₹{originalPrice}
                </span>
              )}
              <span className={`text-base font-serif font-bold ${originalPrice ? "text-amber-400" : "text-white"}`}>
                ₹{currentPrice} <span className="text-[10px] text-gray-400 font-sans font-normal">INR</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center space-x-1.5 ${
              added
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                : originalPrice
                ? "bg-amber-500 hover:bg-amber-400 text-obsidian-900 shadow-md shadow-amber-500/20"
                : "bg-gold-500 hover:bg-gold-400 text-obsidian-900 shadow-md shadow-gold-500/10 hover:shadow-gold-500/30"
            }`}
          >
            {added ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
