"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Award, ShieldCheck, Droplets } from "lucide-react";

const HERO_FEATURED_PERFUMES = [
  {
    handle: "noir-elegance",
    title: "Noir Élégance",
    subtitle: "Master Creation",
    price: "₹140 INR",
    notes: "Top: Black Pepper • Heart: Damask Rose • Base: Smoked Oud",
    image: "/hero_perfume.png",
    edition: "EDITION 2026",
    badge: "99.8% Pure Botanicals",
  },
  {
    handle: "velvet-rose-oud",
    title: "Velvet Rose & Oud",
    subtitle: "Royal Collection",
    price: "₹155 INR",
    notes: "Top: Crimson Clove • Heart: Taif Rose • Base: Dark Agarwood",
    image: "http://localhost:9000/static/perfume_2.png",
    edition: "LIMITED HARVEST",
    badge: "Grasse Rose Absolute",
  },
  {
    handle: "celestial-bergamot",
    title: "Celestial Bergamot",
    subtitle: "Luminous Edition",
    price: "₹120 INR",
    notes: "Top: Calabrian Bergamot • Heart: Neroli Petals • Base: White Amber",
    image: "http://localhost:9000/static/perfume_3.png",
    edition: "SUMMER SOLSTICE",
    badge: "Sun-Drenched Citrus",
  },
];

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Adjusted to 3.5 seconds (3500ms) for a smooth, relaxed luxury pace
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_FEATURED_PERFUMES.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const activePerfume = HERO_FEATURED_PERFUMES[currentIndex];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-obsidian-900 pt-8 pb-16">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gold-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Sub-badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-obsidian-800/80 mb-6 backdrop-blur-md">
              <Sparkles size={14} className="text-gold-400" />
              <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-medium">
                Haute Parfumerie • Paris & Grasse
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight leading-[1.08] mb-6 text-white">
              The Art of <span className="gold-gradient-text italic font-serif">Unforgettable</span> Scent
            </h1>

            {/* Description */}
            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-gray-300 font-light leading-relaxed mb-8 tracking-wide">
              Handcrafted extractions formulated in Paris. Explore our signature library of 15 rare Extrait de Parfum creations, blending first-harvest flora, smoldering woods, and timeless French elegance.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-12">
              <a
                href="#catalog"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-obsidian-900 font-semibold text-xs uppercase tracking-[0.2em] rounded-full shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:scale-[1.02] transition-all duration-300 text-center"
              >
                Explore 15 Fragrances
              </a>
              <a
                href="#about"
                className="w-full sm:w-auto px-8 py-4 border border-gold-500/30 text-gold-400 hover:text-white hover:border-gold-400 font-medium text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 bg-obsidian-800/40 backdrop-blur-sm text-center"
              >
                Our Paris Atelier
              </a>
            </div>

            {/* Feature Highlights Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gold-500/10 max-w-xl mx-auto lg:mx-0 text-left">
              <div>
                <span className="block font-serif text-2xl font-bold text-gold-400">15</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">Rare Extractions</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-gold-400">32%</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">Oil Concentration</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-gold-400">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">Grasse Botanicals</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3.5-Second Cycling Perfume Showcase (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            
            {/* Glowing Orbit Backdrop Ring */}
            <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full border border-gold-500/20 animate-pulse-glow pointer-events-none"></div>
            <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-gold-500/10 pointer-events-none"></div>

            {/* Main Floating Showcase Card with Smooth Fade Transition */}
            <div className="relative z-10 w-full max-w-md animate-float">
              
              <Link
                href={`/products/${activePerfume.handle}`}
                className="block glass-panel rounded-3xl p-6 sm:p-8 border border-gold-500/30 gold-border-glow shadow-2xl relative overflow-hidden group transition-all duration-700"
              >
                {/* Gold Ray Light Accent */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/15 rounded-full blur-3xl pointer-events-none"></div>

                {/* Top Badge Overlay */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-mono text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
                    <Award size={12} />
                    <span>{activePerfume.subtitle}</span>
                  </span>
                  <span className="text-[10px] font-mono text-gold-500/80 tracking-widest">
                    {activePerfume.edition}
                  </span>
                </div>

                {/* Perfume Bottle Image (Smooth 700ms fade & scale transition) */}
                <div className="relative aspect-[4/5] w-full flex items-center justify-center p-2 mb-4">
                  <img
                    key={activePerfume.handle}
                    src={activePerfume.image}
                    alt={activePerfume.title}
                    className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(212,175,55,0.25)] transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/hero_perfume.png";
                    }}
                  />
                </div>

                {/* Scent Profile Overlay Badge */}
                <div className="p-4 rounded-2xl bg-obsidian-900/90 border border-gold-500/20 backdrop-blur-md space-y-2">
                  <div className="flex items-center justify-between text-xs font-serif text-white">
                    <span className="font-bold tracking-wide text-base group-hover:text-gold-400 transition-colors">
                      {activePerfume.title}
                    </span>
                    <span className="text-gold-400 font-mono font-bold">{activePerfume.price}</span>
                  </div>
                  <p className="text-[11px] text-gray-300 font-light line-clamp-1">
                    {activePerfume.notes}
                  </p>
                </div>
              </Link>

              {/* Floating Badge 1: Botanical Extract */}
              <div className="absolute -bottom-4 -left-4 glass-panel px-4 py-2.5 rounded-2xl border border-gold-500/30 flex items-center space-x-2 text-xs shadow-xl hidden sm:flex">
                <Droplets size={16} className="text-gold-400" />
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-mono">Extraction</span>
                  <span className="font-serif text-white font-medium">{activePerfume.badge}</span>
                </div>
              </div>

              {/* Floating Badge 2: Paris Seal */}
              <div className="absolute -top-4 -right-4 glass-panel px-4 py-2.5 rounded-2xl border border-gold-500/30 flex items-center space-x-2 text-xs shadow-xl hidden sm:flex">
                <ShieldCheck size={16} className="text-gold-400" />
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-mono">Origin</span>
                  <span className="font-serif text-white font-medium">Paris Atelier Seal</span>
                </div>
              </div>
            </div>

            {/* Carousel Control Dots & Indicators */}
            <div className="mt-8 flex items-center space-x-3 z-20">
              {HERO_FEATURED_PERFUMES.map((perfume, idx) => (
                <button
                  key={perfume.handle}
                  onClick={() => setCurrentIndex(idx)}
                  className={`group flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
                    currentIndex === idx
                      ? "bg-gold-500/20 border-gold-500 text-gold-400 shadow-md"
                      : "bg-obsidian-800/60 border-gold-500/10 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                  <span className="text-xs font-serif hidden sm:inline">{perfume.title}</span>
                  {currentIndex === idx && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping"></span>
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
