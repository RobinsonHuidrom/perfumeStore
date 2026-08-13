import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import Link from "next/link";
import { Sparkles, Award, ShieldCheck, Droplet, Heart, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-obsidian-900 text-white selection:bg-gold-500 selection:text-obsidian-900 flex flex-col justify-between">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-obsidian-800/80 mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-gold-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-medium">
              ESTABLISHED IN GRASSE • 1924
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif text-white mb-6">
            The Heritage of <span className="gold-gradient-text italic font-serif">Haute Parfumerie</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed">
            For over a century, Maison de Parfum has preserved the sacred art of French scent creation. We blend first-harvest flora, rare resinous woods, and centuries-old copper pot distillation.
          </p>
        </div>

        {/* Story Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-mono">
              OUR ATELIER PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white">
              Where Science Meets Olfactory Artistry
            </h2>
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              In our Grasse laboratory, master perfumers select only first-harvest flower petals harvested at dawn when their essential oil density is at its peak. Each formula undergoes 6 months of dark maceration to achieve unparalleled depth and eternal sillage.
            </p>
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              We reject mass manufacturing. Every batch is limited to 500 numbered bottles, hand-filled, sealed with our golden wax emblem, and packaged in velvet-lined keepsake boxes.
            </p>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="glass-panel rounded-3xl p-4 border border-gold-500/30 gold-border-glow shadow-2xl">
              <img
                src="http://localhost:9000/static/perfume_1.png"
                alt="Atelier Perfume Creation"
                className="w-full aspect-[4/3] object-contain rounded-2xl bg-obsidian-800/80 p-6"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-panel px-6 py-4 rounded-2xl border border-gold-500/30 hidden sm:block">
              <span className="block font-serif text-2xl text-gold-400 font-bold">100%</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Grasse Flower Extractions</span>
            </div>
          </div>
        </div>

        {/* The 3 Pillars */}
        <div className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3">Our Three Sacrosanct Pillars</h3>
            <p className="text-xs text-gray-400 font-light">Every creation bearing our hallmark adheres to strict standards of excellence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel rounded-2xl p-8 border border-gold-500/15 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
                <Droplet size={22} />
              </div>
              <h4 className="font-serif text-xl text-white">First-Harvest Botanicals</h4>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Hand-picked Bulgarian roses, Tunisian neroli, and Calabrian bergamot extracted within hours of harvest.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-8 border border-gold-500/15 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
                <Award size={22} />
              </div>
              <h4 className="font-serif text-xl text-white">30%+ Pure Extractions</h4>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                We formulate strictly in Extrait de Parfum concentration, guaranteeing 12 to 16 hours of radiant sillage.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-8 border border-gold-500/15 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
                <ShieldCheck size={22} />
              </div>
              <h4 className="font-serif text-xl text-white">Sustainable Luxury</h4>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Refillable heavy glass crystal bottles crafted in Normandy, paired with 100% recyclable keepsake packaging.
              </p>
            </div>
          </div>
        </div>

        {/* Master Perfumer Quote Callout */}
        <div className="glass-panel rounded-3xl p-10 sm:p-16 border border-gold-500/20 text-center max-w-4xl mx-auto mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <Heart size={32} className="text-gold-400 mx-auto mb-6 opacity-80" />
          <blockquote className="font-serif text-xl sm:text-3xl text-white italic leading-relaxed mb-6">
            &quot;A true perfume is not merely a fragrance; it is an invisible cloak of memory, confidence, and desire that lingers long after you leave the room.&quot;
          </blockquote>
          <cite className="block text-xs uppercase tracking-[0.25em] text-gold-400 font-mono not-italic">
            — Jean-Luc Laurent • Head Nose & Master Perfumer
          </cite>
        </div>

        {/* Explore CTA */}
        <div className="text-center">
          <Link
            href="/#catalog"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gold-500 text-obsidian-900 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-gold-400 transition-colors shadow-xl shadow-gold-500/20"
          >
            <span>Explore The 15 Extractions</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <CartDrawer />
      <CheckoutModal />
      <Footer />
    </main>
  );
}
