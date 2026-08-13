"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Award } from "lucide-react";
import { SmokeRevealCanvas, PerfumeSmokeTheme } from "./SmokeRevealCanvas";

export interface FeaturedPerfume {
  handle: string;
  title: string;
  subtitle: string;
  price: string;
  notes: string;
  image: string;
  edition: string;
  badge: string;
  smokeTheme: PerfumeSmokeTheme;
}

const HERO_FEATURED_PERFUMES: FeaturedPerfume[] = [
  {
    handle: "noir-elegance",
    title: "Noir Élégance",
    subtitle: "Master Creation",
    price: "₹140 INR",
    notes: "Top: Black Pepper • Heart: Damask Rose • Base: Smoked Oud",
    image: "/hero_perfume.png",
    edition: "EDITION 2026",
    badge: "99.8% Pure Botanicals",
    smokeTheme: {
      primaryGlow: "rgba(212, 175, 55,",   // Warm Amber Gold
      secondaryGlow: "rgba(180, 130, 40,",  // Smoked Oud
      smokeCore: "rgba(25, 20, 15,",       // Obsidian Smoke
      particleAccent: "#D4AF37",
    },
  },
  {
    handle: "velvet-rose-oud",
    title: "Velvet Rose & Oud",
    subtitle: "Royal Collection",
    price: "₹155 INR",
    notes: "Top: Crimson Clove • Heart: Taif Rose • Base: Dark Agarwood",
    image: "/perfume_2.png",
    edition: "LIMITED HARVEST",
    badge: "Grasse Rose Absolute",
    smokeTheme: {
      primaryGlow: "rgba(225, 112, 120,",  // Taif Crimson Rose
      secondaryGlow: "rgba(190, 80, 100,", // Deep Velvet Rose
      smokeCore: "rgba(35, 15, 25,",       // Dark Agarwood Vapor
      particleAccent: "#E17078",
    },
  },
  {
    handle: "celestial-bergamot",
    title: "Celestial Bergamot",
    subtitle: "Luminous Edition",
    price: "₹120 INR",
    notes: "Top: Calabrian Bergamot • Heart: Neroli Petals • Base: White Amber",
    image: "/perfume_3.png",
    edition: "SUMMER SOLSTICE",
    badge: "Sun-Drenched Citrus",
    smokeTheme: {
      primaryGlow: "rgba(255, 220, 130,",  // Luminous Bergamot Gold
      secondaryGlow: "rgba(230, 190, 90,", // Neroli Sunlit Glow
      smokeCore: "rgba(30, 30, 25,",       // White Amber Vapor
      particleAccent: "#FFDC82",
    },
  },
];

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealTriggerKey, setRevealTriggerKey] = useState(0);

  // 9.5-second auto-slide interval providing 2.5s initial smoke, 3.3s slow product reveal, and 3.7s resting view
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % HERO_FEATURED_PERFUMES.length;
        setRevealTriggerKey(Date.now());
        return next;
      });
    }, 9500);

    return () => clearInterval(timer);
  }, []);

  const handleSelectPerfume = (idx: number) => {
    setCurrentIndex(idx);
    setRevealTriggerKey(Date.now());
  };

  const activePerfume = HERO_FEATURED_PERFUMES[currentIndex];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-obsidian-900 pt-8 pb-16">
      
      {/* Dynamic background ambient lighting based on perfume theme */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] rounded-full blur-[160px] pointer-events-none transition-colors duration-1000 opacity-20"
        style={{
          background: `radial-gradient(circle, ${activePerfume.smokeTheme.primaryGlow}0.6) 0%, transparent 70%)`,
        }}
      />
      <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-amber-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Sub-badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-obsidian-800/80 mb-6 backdrop-blur-md">
              <Sparkles size={14} className="text-gold-400 animate-spin-slow" />
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

          {/* Right Column: Clean & Uncluttered Smoke Reveal Product Showcase (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            
            {/* Glowing Orbit Backdrop Ring */}
            <div className="absolute w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] rounded-full border border-gold-500/20 pointer-events-none"></div>
            <div className="absolute w-[290px] h-[290px] sm:w-[380px] sm:h-[380px] rounded-full border border-gold-500/10 pointer-events-none"></div>

            {/* Main Fixed Showcase Container */}
            <div className="relative z-10 w-full max-w-md">
              
              <Link
                href={`/products/${activePerfume.handle}`}
                className="block glass-panel rounded-3xl p-6 sm:p-8 border border-gold-500/30 gold-border-glow shadow-2xl relative overflow-hidden group"
              >
                {/* Gold Ray Light Accent */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-gold-500/15 rounded-full blur-3xl pointer-events-none"></div>

                {/* Top Badge Overlay */}
                <div className="flex items-center justify-between mb-4 z-20 relative">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono text-gold-400 bg-gold-500/10 px-3.5 py-1 rounded-full border border-gold-500/20">
                    <Award size={12} />
                    <span>{activePerfume.subtitle}</span>
                  </span>

                  <span className="text-[10px] font-mono text-gold-500/80 tracking-widest uppercase">
                    {activePerfume.edition}
                  </span>
                </div>

                {/* SMOKE / GAS REVEAL CANVAS CONTAINER */}
                <div className="relative aspect-[4/5] w-full flex items-center justify-center p-2 mb-4">
                  <SmokeRevealCanvas
                    key={activePerfume.handle}
                    imageSrc={activePerfume.image}
                    altText={activePerfume.title}
                    triggerKey={revealTriggerKey}
                    theme={activePerfume.smokeTheme}
                    className="w-full h-full"
                  />
                </div>

                {/* Scent Profile Overlay Badge */}
                <div className="p-4 rounded-2xl bg-obsidian-900/90 border border-gold-500/20 backdrop-blur-md space-y-2 relative z-20">
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
            </div>

            {/* Sleek Minimalist Luxury Bar Line Slider Indicator */}
            <div className="mt-6 w-full max-w-md flex flex-col items-center gap-2 z-20 px-2">
              <div className="w-full flex items-center gap-2.5">
                {HERO_FEATURED_PERFUMES.map((perfume, idx) => (
                  <button
                    key={perfume.handle}
                    onClick={() => handleSelectPerfume(idx)}
                    className="group relative flex-1 h-1.5 rounded-full overflow-hidden bg-obsidian-800/80 border border-gold-500/10 hover:border-gold-500/40 transition-colors py-1 cursor-pointer"
                    title={perfume.title}
                  >
                    {/* Animated Gold Progress Fill Bar for Active Slide */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 rounded-full transition-all duration-500 ${
                        currentIndex === idx ? "w-full opacity-100 shadow-[0_0_10px_rgba(212,175,55,0.7)]" : "w-0 opacity-0"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-gold-400/70 tracking-widest px-0.5">
                <span>0{currentIndex + 1} / 0{HERO_FEATURED_PERFUMES.length}</span>
                <span className="uppercase text-[10px] tracking-widest text-gray-400 font-serif">
                  {activePerfume.title}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};


