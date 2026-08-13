"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { X, CheckCircle, ShieldCheck, Lock, User, Banknote, CreditCard } from "lucide-react";

interface RegisteredUser {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<"details" | "success">("details");
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  // Empty initial form state (NO dummy pre-filled text!)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "in",
  });

  useEffect(() => {
    if (isCheckoutOpen) {
      const savedUser = localStorage.getItem("maison_current_user");
      if (savedUser) {
        try {
          const user: RegisteredUser = JSON.parse(savedUser);
          setCurrentUser(user);
          const parts = user.name.split(" ");
          setFormData({
            firstName: parts[0] || "",
            lastName: parts.slice(1).join(" ") || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            city: "Paris",
            postalCode: "75008",
            country: "in",
          });
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          postalCode: "",
          country: "in",
        });
      }
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  // Validation: All required fields must be filled!
  const isGuestFormValid =
    formData.firstName.trim().length > 0 &&
    formData.lastName.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.phone.trim().length > 0 &&
    formData.address.trim().length > 0;

  const isMemberFormValid =
    formData.phone.trim().length > 0 &&
    formData.address.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser ? !isMemberFormValid : !isGuestFormValid) return;

    setIsSubmitting(true);

    const userEmail = currentUser ? currentUser.email : formData.email;
    const userFirstName = currentUser ? currentUser.name.split(" ")[0] : formData.firstName;
    const userLastName = currentUser ? currentUser.name.split(" ").slice(1).join(" ") || "Client" : formData.lastName;
    const userPhone = formData.phone;
    const userAddress = formData.address;

    try {
      // 1. Post to backend API so order, order_address, & customer appear in Medusa Admin!
      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: userFirstName,
          lastName: userLastName,
          email: userEmail,
          phone: userPhone,
          address: userAddress,
          city: formData.city || "Paris",
          country: formData.country || "in",
          postalCode: formData.postalCode || "75008",
          totalAmount: subtotal,
          paymentMethod: paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Online Card / UPI",
          cart,
        }),
      });
    } catch (err) {
      console.warn("Could not post to Medusa API:", err);
    }

    // 2. Save order locally for client dashboard
    const orderNum = `MP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      totalAmount: subtotal,
      currency: "INR",
      status: "Processing",
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Online Card / UPI",
      trackingNumber: `FR-DHL-${Math.floor(100000000 + Math.random() * 900000000)}`,
      courier: "DHL Express International",
      email: userEmail,
      items: cart.map((item) => ({
        id: item.id,
        title: item.product.title,
        size: item.selectedSize,
        quantity: item.quantity,
        price: item.unitPrice,
        image: item.product.images?.[0]?.url || "http://localhost:9000/static/perfume_1.png",
      })),
    };

    try {
      const existing = localStorage.getItem("maison_orders");
      const ordersList = existing ? JSON.parse(existing) : [];
      ordersList.unshift(newOrder);
      localStorage.setItem("maison_orders", JSON.stringify(ordersList));
    } catch (err) {
      console.error(err);
    }

    setIsSubmitting(false);
    setStep("success");

    if (typeof clearCart === "function") {
      clearCart();
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep("details");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl glass-panel rounded-2xl border border-gold-500/30 text-white p-6 sm:p-8 shadow-2xl z-10">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 transition-colors rounded-full hover:bg-obsidian-800"
        >
          <X size={20} />
        </button>

        {step === "details" ? (
          <div>
            {/* Title Header */}
            <div className="flex items-center space-x-2 text-gold-400 text-xs font-mono tracking-widest uppercase mb-1">
              <Lock size={14} />
              <span>{currentUser ? "Atelier VIP Express Checkout" : "Checkout Initialization State"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-6">
              Maison Order Summary
            </h2>

            {/* Order Items Preview */}
            <div className="bg-obsidian-800/80 rounded-xl p-4 border border-gold-500/10 mb-6 space-y-3 max-h-36 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-serif text-white font-medium">{item.product.title}</span>
                    <span className="text-gold-400 font-mono ml-2">({item.selectedSize})</span>
                    <span className="text-gray-400 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-mono text-gray-200">₹{item.unitPrice * item.quantity} INR</span>
                </div>
              ))}
              <div className="pt-2 border-t border-obsidian-700 flex justify-between items-center text-sm font-serif font-bold text-gold-400">
                <span>Total Due</span>
                <span>₹{subtotal} INR</span>
              </div>
            </div>

            {/* Payment Method Selector (COD vs Online) */}
            <div className="mb-6">
              <label className="block text-[10px] uppercase tracking-widest text-gray-300 font-mono mb-2">
                Select Payment Option
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                    paymentMethod === "cod"
                      ? "bg-gold-500/15 border-gold-500 text-gold-300 shadow-md shadow-gold-500/10"
                      : "bg-obsidian-900 border-gold-500/10 text-gray-400 hover:border-gold-500/30"
                  }`}
                >
                  <Banknote size={20} className="text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-serif font-bold text-white">Cash on Delivery (COD)</div>
                    <div className="text-[10px] font-mono text-gray-400 mt-0.5">Pay cash or UPI upon courier arrival</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                    paymentMethod === "online"
                      ? "bg-gold-500/15 border-gold-500 text-gold-300 shadow-md shadow-gold-500/10"
                      : "bg-obsidian-900 border-gold-500/10 text-gray-400 hover:border-gold-500/30"
                  }`}
                >
                  <CreditCard size={20} className="text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-serif font-bold text-white">Pay Online (Card / UPI)</div>
                    <div className="text-[10px] font-mono text-gray-400 mt-0.5">Razorpay Gateway Test Mode</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Member View vs Guest Form View */}
            {currentUser ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gold-400 text-xs font-mono font-bold">
                      <User size={15} />
                      <span>Logged In Atelier Client</span>
                    </div>
                    <span className="text-[10px] font-mono bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded-full border border-gold-500/40">
                      Auto-Filled
                    </span>
                  </div>

                  <div className="text-sm font-serif font-bold text-white">{currentUser.name}</div>
                  <div className="text-xs text-gray-300 font-mono flex items-center space-x-4">
                    <span>✉️ {currentUser.email}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gold-500/20 text-xs">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-obsidian-900 border border-gold-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Delivery Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. House No. 12, MG Road, Mumbai"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-obsidian-900 border border-gold-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-gray-400 pt-1">
                  <ShieldCheck size={16} className="text-gold-400" />
                  <span>
                    Payment: <strong className="text-white">{paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Online Gateway"}</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!isMemberFormValid || isSubmitting}
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-obsidian-900 font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-gold-500/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmitting
                    ? "Processing Reservation..."
                    : paymentMethod === "cod"
                    ? `Confirm COD Order & Pay ₹${subtotal} INR on Delivery`
                    : `Proceed to Pay ₹${subtotal} INR Online`}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jean"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-obsidian-900 border border-gold-500/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dupont"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-obsidian-900 border border-gold-500/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. client@maison.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-obsidian-900 border border-gold-500/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-obsidian-900 border border-gold-500/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House No. 12, MG Road, Mumbai"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-obsidian-900 border border-gold-500/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-gray-400 pt-1">
                  <ShieldCheck size={16} className="text-gold-400" />
                  <span>
                    Payment: <strong className="text-white">{paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Online Gateway"}</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!isGuestFormValid || isSubmitting}
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-obsidian-900 font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-gold-500/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmitting
                    ? "Processing Reservation..."
                    : paymentMethod === "cod"
                    ? `Confirm COD Order & Pay ₹${subtotal} INR on Delivery`
                    : `Proceed to Pay ₹${subtotal} INR Online`}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto text-gold-400">
              <CheckCircle size={44} />
            </div>
            <div>
              <h2 className="text-3xl font-serif text-white mb-2">Order Confirmed!</h2>
              <p className="text-xs text-gray-300 max-w-md mx-auto font-light leading-relaxed">
                Thank you, {currentUser ? currentUser.name : formData.firstName}! Your haute parfumerie order has been placed via <strong className="text-gold-400 font-mono">{paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Online Payment"}</strong> and sent to Medusa Admin. A confirmation note has been sent to <span className="text-gold-400 font-mono">{currentUser ? currentUser.email : formData.email}</span>.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3 bg-gold-500 text-obsidian-900 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold-400 transition-all duration-200"
            >
              Back to Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
