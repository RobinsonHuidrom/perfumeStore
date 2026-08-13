"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PerfumeProduct } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "./ProductCard";
import {
  ShoppingBag,
  Check,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Droplet,
  ChevronRight,
  Flame,
  Award
} from "lucide-react";

interface ProductDetailViewProps {
  product: PerfumeProduct;
  allProducts: PerfumeProduct[];
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
}) => {
  const { addToCart, setIsCheckoutOpen } = useCart();

  const [selectedSize, setSelectedSize] = useState<"50ml" | "100ml">("50ml");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"notes" | "story" | "shipping">("notes");
  const [added, setAdded] = useState<boolean>(false);
  const [isLoggedInUser, setIsLoggedInUser] = useState<boolean>(false);

  React.useEffect(() => {
    const user = localStorage.getItem("maison_current_user");
    setIsLoggedInUser(!!user);
  }, []);


  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: "http://localhost:9000/static/perfume_1.png" }];

  const variant =
    product.variants.find((v) =>
      v.title.toLowerCase().includes(selectedSize.toLowerCase()) ||
      (v.options && Object.values(v.options).some((val) => String(val).toLowerCase().includes(selectedSize.toLowerCase())))
    ) ||
    product.variants.find((v) => v.title.includes(selectedSize.replace("ml", ""))) ||
    product.variants[0];

  const currentPrice = variant?.prices?.[0]?.amount || 140;

  const originalPrice = selectedSize === "50ml"
    ? product.originalPrice50
    : product.originalPrice100;


  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    setIsCheckoutOpen(true);
  };

  const relatedProducts = allProducts
    .filter((p) => p.handle !== product.handle)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-gray-400 mb-8">
        <Link href="/" className="hover:text-gold-400 transition-colors flex items-center gap-1">
          <ArrowLeft size={14} />
          <span>Catalog</span>
        </Link>
        <ChevronRight size={12} className="text-gray-600" />
        <span className="text-gold-400/80">{product.category || "Fragrance"}</span>
        <ChevronRight size={12} className="text-gray-600" />
        <span className="text-white font-serif">{product.title}</span>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        
        {/* Left Gallery Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden glass-panel border border-gold-500/20 p-6 flex items-center justify-center bg-obsidian-800/80 group">
            <img
              src={images[activeImageIndex]?.url || images[0].url}
              alt={product.title}
              className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "http://localhost:9000/static/perfume_1.png";
              }}
            />
            {originalPrice && (
              <span className="absolute top-4 right-4 text-xs font-bold font-mono tracking-widest text-amber-300 bg-amber-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 animate-pulse">
                {product.discountBadge || "SPECIAL SALE"}
              </span>
            )}
            <span className="absolute top-4 left-4 text-[10px] tracking-[0.25em] text-gold-400 uppercase font-mono bg-obsidian-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-gold-500/20">
              HAUTE PARFUMERIE
            </span>
          </div>

          {images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden bg-obsidian-800 p-2 border transition-all duration-200 shrink-0 ${
                    activeImageIndex === idx
                      ? "border-gold-500 ring-2 ring-gold-500/30"
                      : "border-gold-500/10 hover:border-gold-500/30"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.title} angle ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
                <Award size={13} />
                <span>{product.concentration || "Extrait de Parfum (30% Oil Concentration)"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-gray-400 bg-obsidian-800 px-3 py-1 rounded-full border border-gold-500/10">
                <Flame size={13} className="text-amber-500" />
                <span>{product.sillage || "Sillage: 12h+ Enveloping"}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif text-white mb-4">
              {product.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Price Display with Discount Support */}
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8 p-4 rounded-xl bg-obsidian-800/60 border border-gold-500/10">
              <div className="flex items-baseline space-x-3">
                {originalPrice && (
                  <span className="line-through text-gray-500 text-lg font-mono">
                    ₹{originalPrice}
                  </span>
                )}
                <span className={`text-3xl font-serif font-bold ${originalPrice ? "text-amber-400" : "text-gold-400"}`}>
                  ₹{currentPrice} <span className="text-sm text-gray-400 font-sans font-normal">INR</span>
                </span>
                {originalPrice && (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Save ₹{originalPrice - currentPrice} INR
                  </span>
                )}
              </div>

              <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                Taxes included • Free Delivery
              </span>
            </div>

            {/* Bottle Size Selector */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest text-gray-300 font-mono mb-2">
                Select Bottle Volume
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(["50ml", "100ml"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-gold-500/15 border-gold-500 text-gold-300 shadow-lg shadow-gold-500/10"
                        : "bg-obsidian-800/40 border-gold-500/10 text-gray-400 hover:border-gold-500/30"
                    }`}
                  >
                    <div className="font-serif text-lg text-white font-bold">{size}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                      {size === "50ml" ? "Travel & Daily Signature" : "Grand Luxe Volume"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8 flex items-center space-x-4">
              <span className="text-xs uppercase tracking-widest text-gray-300 font-mono">
                Quantity
              </span>
              <div className="flex items-center space-x-3 bg-obsidian-800 rounded-xl px-3 py-2 border border-gold-500/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-gray-400 hover:text-white px-2 py-1 transition-colors"
                >
                  -
                </button>
                <span className="font-mono text-sm px-2 text-white font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-gray-400 hover:text-white px-2 py-1 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center space-x-2 ${
                  added
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : originalPrice
                    ? "bg-amber-500 hover:bg-amber-400 text-obsidian-900 shadow-xl shadow-amber-500/20 hover:scale-[1.01]"
                    : "bg-gold-500 hover:bg-gold-400 text-obsidian-900 shadow-xl shadow-gold-500/20 hover:scale-[1.01]"
                } ${isLoggedInUser ? "sm:col-span-2" : ""}`}
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              {!isLoggedInUser && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 rounded-xl font-medium text-xs uppercase tracking-[0.2em] bg-obsidian-800 border border-gold-500/40 text-gold-400 hover:text-white hover:border-gold-400 transition-all duration-300"
                >
                  Instant Express Checkout
                </button>
              )}
            </div>


            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gold-500/10 text-[11px] text-gray-400 font-mono">
              <div className="flex items-center space-x-1.5">
                <Truck size={15} className="text-gold-400 shrink-0" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck size={15} className="text-gold-400 shrink-0" />
                <span>Handcrafted in Paris</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Droplet size={15} className="text-gold-400 shrink-0" />
                <span>3 Free Samples Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fragrance Olfactory Pyramid & Tabs Section */}
      <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-gold-500/15 mb-20">
        <div className="flex border-b border-gold-500/15 mb-8 overflow-x-auto">
          {[
            { id: "notes", label: "Olfactory Pyramid & Notes" },
            { id: "story", label: "Atelier Story & Composition" },
            { id: "shipping", label: "Formulation & Guarantee" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "notes" | "story" | "shipping")}
              className={`pb-4 px-6 text-xs uppercase tracking-[0.2em] font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-gold-500 text-gold-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "notes" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-obsidian-800/50 border border-gold-500/10 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
                <Sparkles size={18} />
              </div>
              <h4 className="font-serif text-lg text-white">Top Notes</h4>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                First Impression (0-15 min)
              </p>
              <ul className="text-sm text-gray-200 font-light space-y-1 pt-2">
                {(product.topNotes || ["Black Pepper", "Bergamot"]).map((n, i) => (
                  <li key={i} className="text-gold-300">{n}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-obsidian-800/50 border border-gold-500/10 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
                <Droplet size={18} />
              </div>
              <h4 className="font-serif text-lg text-white">Heart Notes</h4>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                Scent Signature (2-6 hours)
              </p>
              <ul className="text-sm text-gray-200 font-light space-y-1 pt-2">
                {(product.heartNotes || ["Damask Rose", "Nutmeg"]).map((n, i) => (
                  <li key={i} className="text-gold-300">{n}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-obsidian-800/50 border border-gold-500/10 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
                <Flame size={18} />
              </div>
              <h4 className="font-serif text-lg text-white">Base Notes</h4>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                Lasting Sillage (8-16 hours)
              </p>
              <ul className="text-sm text-gray-200 font-light space-y-1 pt-2">
                {(product.baseNotes || ["Smoked Oud", "Amber"]).map((n, i) => (
                  <li key={i} className="text-gold-300">{n}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "story" && (
          <div className="max-w-3xl space-y-4 text-sm text-gray-300 font-light leading-relaxed">
            <h4 className="font-serif text-xl text-white mb-2">The Inspiration Behind {product.title}</h4>
            <p>
              {product.story || "Formulated in the heart of Paris, this extraction brings together centuries of French perfume craftsmanship."}
            </p>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300">
            <div className="space-y-2 p-4 rounded-xl bg-obsidian-800/40">
              <h5 className="font-serif text-sm text-white font-semibold">Complimentary Gift Packaging</h5>
              <p>Each bottle arrives in our signature matte black velvet-lined keepsake box.</p>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-obsidian-800/40">
              <h5 className="font-serif text-sm text-white font-semibold">Risk-Free Scent Guarantee</h5>
              <p>Try the included sample vial first. If you choose not to open the main bottle, return it within 30 days for a full refund.</p>
            </div>
          </div>
        )}
      </div>

      {/* Related Fragrances Section */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8 border-b border-gold-500/10 pb-4">
            <h3 className="text-2xl font-serif text-white">You May Also Appreciate</h3>
            <Link href="/#catalog" className="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300">
              View All 15 Fragrances →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
