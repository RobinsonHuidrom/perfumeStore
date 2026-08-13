"use client";

import React, { useState, useRef } from "react";
import { PerfumeProduct } from "@/lib/medusa";
import { ProductCard } from "./ProductCard";
import { Search, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGridProps {
  products: PerfumeProduct[];
  serverCategories?: string[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, serverCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Floral & Fresh");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const defaultCategories = [
    "Floral & Fresh",
    "Woody & Amber",
    "Oriental & Spiced",
    "Gourmand & Musk",
  ];

  const activeCategories = serverCategories && serverCategories.length > 0 ? serverCategories : defaultCategories;

  const categories = [
    "All",
    "Offers 🔥",
    ...activeCategories,
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const isDiscounted =
      !!product.saleBadge ||
      !!product.discountBadge ||
      (product.variants &&
        product.variants.some(
          (v) => v.prices && v.prices.some((p) => p.original_amount && p.original_amount > p.amount)
        ));

    if (selectedCategory === "Offers 🔥") {
      return isDiscounted;
    }

    if (selectedCategory === "All") {
      return true;
    }

    const matchesCategoriesList =
      product.categoriesList &&
      product.categoriesList.some((cat) => cat.toLowerCase() === selectedCategory.toLowerCase());

    const matchesCategory =
      matchesCategoriesList ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesCategory;
  });

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section (Compact spacing) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-gold-500/10 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-mono tracking-widest uppercase mb-1">
            <Sparkles size={12} />
            <span>Fragrance Library</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-white">Curated Extractions</h2>
        </div>
        <p className="text-xs text-gray-400 max-w-md mt-2 md:mt-0 font-light">
          High-concentration Extrait de Parfum formulated in Paris using rare botanicals.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-8">
        {/* Category Carousel with Left / Right Arrows */}
        <div className="relative flex items-center w-full md:flex-1 max-w-3xl overflow-hidden pr-2">
          {/* Scroll Left Button */}
          <button
            onClick={() => handleScroll("left")}
            className="shrink-0 p-1.5 rounded-full bg-obsidian-800 border border-gold-500/20 text-gold-400 hover:text-white hover:border-gold-400 transition-colors mr-2 z-10 shadow-md"
            aria-label="Scroll Categories Left"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Scrollable Container (Native Scrollbar Completely Hidden) */}
          <div
            ref={scrollContainerRef}
            className="flex items-center space-x-2 overflow-x-auto py-1 scroll-smooth w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-[11px] rounded-full uppercase tracking-wider whitespace-nowrap transition-all duration-300 font-medium ${
                  selectedCategory === cat
                    ? "bg-gold-500 text-obsidian-900 shadow-md shadow-gold-500/20 font-bold"
                    : "bg-obsidian-800/80 text-gray-400 hover:text-white hover:bg-obsidian-700 border border-gold-500/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => handleScroll("right")}
            className="shrink-0 p-1.5 rounded-full bg-obsidian-800 border border-gold-500/20 text-gold-400 hover:text-white hover:border-gold-400 transition-colors ml-2 z-10 shadow-md"
            aria-label="Scroll Categories Right"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian-800/80 border border-gold-500/20 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-panel rounded-2xl border border-gold-500/10">
          <p className="text-gray-400 text-sm font-serif">No fragrances found matching your search.</p>
          <button
            onClick={() => {
              setSelectedCategory("Floral & Fresh");
              setSearchQuery("");
            }}
            className="mt-3 px-6 py-2 bg-gold-500/20 text-gold-400 rounded-full text-xs uppercase tracking-wider hover:bg-gold-500/30 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
