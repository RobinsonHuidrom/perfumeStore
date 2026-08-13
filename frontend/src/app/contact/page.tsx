"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "Bespoke Scent Consultation",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: "", email: "", subject: "Bespoke Scent Consultation", message: "" });
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-obsidian-900 text-white selection:bg-gold-500 selection:text-obsidian-900 flex flex-col justify-between">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-obsidian-800/80 mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-gold-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-medium">
              CLIENT RELATIONS & CONCIERGE
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif text-white mb-4">
            Connect With Our <span className="gold-gradient-text italic font-serif">Atelier</span>
          </h1>
          <p className="text-base text-gray-300 font-light leading-relaxed">
            Whether you seek a bespoke fragrance consultation, order assistance, or press inquiries, our Parisian concierge team is at your service.
          </p>
        </div>

        {/* Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Left Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-gold-500/20 relative">
              
              <h2 className="text-2xl font-serif text-white mb-6">Send An Inquiry</h2>

              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-serif text-white">Inquiry Received</h3>
                  <p className="text-xs text-gray-300 max-w-md mx-auto font-light">
                    Thank you, {formState.name || "valued guest"}. Our Parisian fragrance concierge will review your message and respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-300 font-mono mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Henri Laurent"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-obsidian-800/80 border border-gold-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-300 font-mono mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="henri@atelier.fr"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-obsidian-800/80 border border-gold-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-300 font-mono mb-2">
                      Inquiry Subject
                    </label>
                    <select
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full bg-obsidian-800/80 border border-gold-500/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                    >
                      <option value="Bespoke Scent Consultation">Bespoke Scent Consultation</option>
                      <option value="Order & Delivery Status">Order & Delivery Status</option>
                      <option value="Private Atelier Visit">Private Atelier Visit (Paris / Grasse)</option>
                      <option value="Press & Wholesale Enquiries">Press & Wholesale Enquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-300 font-mono mb-2">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please share details regarding your fragrance preferences or inquiry..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full bg-obsidian-800/80 border border-gold-500/20 rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-obsidian-900 font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl shadow-gold-500/10"
                  >
                    <Send size={16} />
                    <span>Send Atelier Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Atelier Locations & Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Contact Card */}
            <div className="glass-panel rounded-3xl p-8 border border-gold-500/20 space-y-6">
              <h3 className="text-xl font-serif text-white">Concierge Desk</h3>
              
              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start space-x-3 text-gray-300">
                  <Phone size={18} className="text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-500 uppercase tracking-widest">Telephone Concierge</span>
                    <span className="text-white text-sm">+33 1 42 68 55 00</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-gray-300">
                  <Mail size={18} className="text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-500 uppercase tracking-widest">Email Concierge</span>
                    <span className="text-white text-sm">concierge@maisondeparfum.fr</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-gray-300">
                  <Clock size={18} className="text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-500 uppercase tracking-widest">Operating Hours</span>
                    <span className="text-white text-sm">Mon – Sat: 10:00 AM – 7:00 PM CET</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Atelier Location 1: Paris */}
            <div className="glass-panel rounded-3xl p-8 border border-gold-500/15 space-y-3">
              <div className="flex items-center space-x-2 text-gold-400">
                <MapPin size={18} />
                <span className="font-serif text-lg text-white font-bold">Paris Flagship Boutique</span>
              </div>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                18 Rue Saint-Honoré, 75001 Paris, France
              </p>
              <span className="inline-block text-[10px] font-mono text-gold-400 uppercase tracking-widest bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/20">
                Private Consultation Available
              </span>
            </div>

            {/* Atelier Location 2: Grasse */}
            <div className="glass-panel rounded-3xl p-8 border border-gold-500/15 space-y-3">
              <div className="flex items-center space-x-2 text-gold-400">
                <MapPin size={18} />
                <span className="font-serif text-lg text-white font-bold">Grasse Distillation Lab</span>
              </div>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                42 Route de Cannes, 06130 Grasse, France
              </p>
              <span className="inline-block text-[10px] font-mono text-gray-400 uppercase tracking-widest bg-obsidian-800 px-2.5 py-1 rounded-full border border-gold-500/10">
                Botanical Research Facility
              </span>
            </div>

          </div>
        </div>
      </div>

      <CartDrawer />
      <CheckoutModal />
      <Footer />
    </main>
  );
}
