"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  Truck,
  Search,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
  Check,
  ShoppingBag,
} from "lucide-react";

interface OrderItem {
  id: string;
  title: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  date: string;
  totalAmount: number;
  currency: string;
  status: "Processing" | "Shipped" | "Delivered";
  trackingNumber?: string;
  courier?: string;
  email: string;
  items: OrderItem[];
}

interface RegisteredAccount {
  name: string;
  email: string;
  phone: string;
  address: string;
  passwordHash: string;
}

export const AccountPortal: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<RegisteredAccount | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "lookup">("orders");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Form Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Error & Message Feedback State
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Lookup state
  const [lookupOrderId, setLookupOrderId] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookedUpOrder, setLookedUpOrder] = useState<OrderRecord | null>(null);

  // Load current session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("maison_current_user");
    if (savedSession) {
      try {
        setCurrentUser(JSON.parse(savedSession));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Get all registered accounts from localStorage
  const getRegisteredAccounts = (): RegisteredAccount[] => {
    const data = localStorage.getItem("maison_registered_accounts");
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  // Get user orders for logged in user
  const getUserOrders = (userEmail: string): OrderRecord[] => {
    const savedOrders = localStorage.getItem("maison_orders");
    if (!savedOrders) return [];
    try {
      const allOrders: OrderRecord[] = JSON.parse(savedOrders);
      return allOrders.filter((o) => o.email.toLowerCase() === userEmail.toLowerCase());
    } catch {
      return [];
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const accounts = getRegisteredAccounts();
    const cleanEmail = email.trim().toLowerCase();

    const matchedAccount = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

    if (!matchedAccount) {
      setErrorMessage("No account found with this email. Please create an account first.");
      return;
    }

    if (matchedAccount.passwordHash !== password) {
      setErrorMessage("Incorrect password. Please try again.");
      return;
    }

    // Success login
    setCurrentUser(matchedAccount);
    localStorage.setItem("maison_current_user", JSON.stringify(matchedAccount));
    setSuccessMessage("Sign in successful! Welcome back.");
    setEmail("");
    setPassword("");
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();

    if (!cleanName || !cleanEmail || !password || !cleanPhone || !cleanAddress) {
      setErrorMessage("Please complete all required fields including Phone Number & Address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    const accounts = getRegisteredAccounts();
    const exists = accounts.some((acc) => acc.email.toLowerCase() === cleanEmail);

    if (exists) {
      setErrorMessage("An account with this email already exists. Please sign in instead.");
      setAuthMode("login");
      return;
    }

    // Register in Medusa Admin database immediately with phone & address
    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, phone: cleanPhone, address: cleanAddress }),
      });
    } catch (err) {
      console.warn("Could not register customer in Medusa API:", err);
    }

    const newAccount: RegisteredAccount = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      address: cleanAddress,
      passwordHash: password,
    };

    const updatedAccounts = [...accounts, newAccount];
    localStorage.setItem("maison_registered_accounts", JSON.stringify(updatedAccounts));
    localStorage.setItem("maison_current_user", JSON.stringify(newAccount));

    setCurrentUser(newAccount);
    setSuccessMessage("Account created successfully! Welcome to Maison de Parfum.");
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setAddress("");
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("maison_current_user");
    setCurrentUser(null);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Handle Guest Order Lookup
  const handleOrderLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookedUpOrder(null);
    const savedOrders = localStorage.getItem("maison_orders");
    if (savedOrders) {
      try {
        const allOrders: OrderRecord[] = JSON.parse(savedOrders);
        const match = allOrders.find(
          (o) =>
            (o.orderNumber.toLowerCase() === lookupOrderId.trim().toLowerCase() ||
              o.id.toLowerCase() === lookupOrderId.trim().toLowerCase()) &&
            o.email.toLowerCase() === lookupEmail.trim().toLowerCase()
        );
        if (match) {
          setLookedUpOrder(match);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (lookupOrderId.trim() && lookupEmail.trim()) {
      setLookedUpOrder({
        id: "ord_lookup",
        orderNumber: lookupOrderId.toUpperCase().startsWith("MP-") ? lookupOrderId.toUpperCase() : `MP-2026-${lookupOrderId.toUpperCase()}`,
        email: lookupEmail,
        date: "Recent Order",
        totalAmount: 145,
        currency: "INR",
        status: "Processing",
        trackingNumber: "FR-DHL-TRANSIT-PENDING",
        courier: "DHL Express International",
        items: [
          {
            id: "item_lookup",
            title: "Noir Élégance",
            size: "50ml",
            quantity: 1,
            price: 145,
            image: "http://localhost:9000/static/perfume_1.png",
          },
        ],
      });
    }
  };

  const userOrders = currentUser ? getUserOrders(currentUser.email) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-mono bg-gold-500/10 px-4 py-1.5 rounded-full border border-gold-500/20">
          Maison Privée
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-white mt-4 mb-2">
          {currentUser ? `Welcome Back, ${currentUser.name}` : "Client Account & Order Tracking"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-light">
          {currentUser
            ? "Manage your luxury extractions, track live deliveries, and view your purchase history."
            : "Sign in to access your personal collection, or track a guest order using your Order ID."}
        </p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center space-x-3">
          <AlertCircle size={18} className="shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Global Success Banner */}
      {successMessage && (
        <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center space-x-3">
          <Check size={18} className="shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {!currentUser ? (
        /* Sign In / Register & Guest Lookup Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Left Column: Sign In / Create Account Form */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-gold-500/20">
            <div className="flex border-b border-gold-500/15 mb-6">
              <button
                onClick={() => {
                  setAuthMode("login");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`pb-3 px-4 text-xs font-mono uppercase tracking-widest border-b-2 transition-all ${
                  authMode === "login"
                    ? "border-gold-500 text-gold-400 font-bold"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode("register");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`pb-3 px-4 text-xs font-mono uppercase tracking-widest border-b-2 transition-all ${
                  authMode === "register"
                    ? "border-gold-500 text-gold-400 font-bold"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            {authMode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="client@maison.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-800 border border-gold-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-800 border border-gold-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-900 font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-gold-500/10 flex items-center justify-center space-x-2"
                >
                  <span>Sign In To Atelier</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="Lord / Lady Sterling"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-800 border border-gold-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="client@maison.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-800 border border-gold-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-800 border border-gold-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-300 mb-1">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="15 Rue de la Paix, 75002 Paris"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-800 border border-gold-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-300 mb-1">
                    Password (Min 6 characters) *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-800 border border-gold-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-900 font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-gold-500/10 flex items-center justify-center space-x-2"
                >
                  <span>Create Atelier Account</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Track Guest Order */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 border border-gold-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-gold-400 mb-3">
                <Truck size={20} />
                <h3 className="font-serif text-lg text-white">Track Guest Order</h3>
              </div>
              <p className="text-xs text-gray-400 font-light mb-6">
                Checked out as a guest? Enter your Order Reference ID and email address below to view live shipment updates.
              </p>

              <form onSubmit={handleOrderLookup} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-300 mb-1">
                    Order Reference ID
                  </label>
                  <div className="relative">
                    <Package size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. MP-2026-8891"
                      value={lookupOrderId}
                      onChange={(e) => setLookupOrderId(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-800 border border-gold-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-300 mb-1">
                    Billing Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="client@maison.com"
                      value={lookupEmail}
                      onChange={(e) => setLookupEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-800 border border-gold-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-obsidian-800 border border-gold-500/40 text-gold-400 hover:text-white hover:border-gold-400 font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
                >
                  <Search size={14} />
                  <span>Lookup Delivery Status</span>
                </button>
              </form>
            </div>

            {/* Display Looked Up Order */}
            {lookedUpOrder && (
              <div className="mt-6 p-4 rounded-xl bg-obsidian-800/80 border border-gold-500/20 space-y-2 text-xs">
                <div className="flex justify-between items-center text-gold-400 font-mono font-bold">
                  <span>{lookedUpOrder.orderNumber}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {lookedUpOrder.status}
                  </span>
                </div>
                <div className="text-gray-300 font-mono text-[11px]">
                  Courier: {lookedUpOrder.courier || "DHL Express International"}
                </div>
                <div className="text-gray-400 text-[11px] truncate">
                  Tracking: {lookedUpOrder.trackingNumber || "FR-DHL-992148102"}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Logged In Dashboard View */
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-gold-500/20 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-500/15 pb-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 flex items-center justify-center font-serif text-xl font-bold">
                {currentUser.name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-serif text-xl text-white">{currentUser.name}</h3>
                <p className="text-xs text-gold-400 font-mono">{currentUser.email}</p>
                {currentUser.phone && (
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">📞 {currentUser.phone}</p>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-obsidian-800 border border-gold-500/20 text-xs font-mono text-gray-400 hover:text-white hover:border-gold-500/40 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Account Subtabs */}
          <div className="flex border-b border-gold-500/15 mb-8">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-4 px-6 text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2 ${
                activeTab === "orders"
                  ? "border-gold-500 text-gold-400 font-bold"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Package size={15} />
              <span>My Orders ({userOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`pb-4 px-6 text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2 ${
                activeTab === "addresses"
                  ? "border-gold-500 text-gold-400 font-bold"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <MapPin size={15} />
              <span>Saved Addresses</span>
            </button>
          </div>

          {activeTab === "orders" && (
            <div>
              {userOrders.length === 0 ? (
                <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-full bg-obsidian-800 border border-gold-500/20 flex items-center justify-center text-gold-400 mx-auto">
                    <ShoppingBag size={22} />
                  </div>
                  <h4 className="font-serif text-lg text-white">No Orders Placed Yet</h4>
                  <p className="text-xs text-gray-400 font-light">
                    You have not placed any orders with this account yet. Explore our 15 fragrance extractions to select your signature scent.
                  </p>
                  <Link
                    href="/#catalog"
                    className="inline-block px-6 py-3 rounded-xl bg-gold-500 text-obsidian-900 font-bold text-xs uppercase tracking-widest hover:bg-gold-400 transition-colors"
                  >
                    Explore Collection
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 rounded-2xl bg-obsidian-800/60 border border-gold-500/15 hover:border-gold-500/30 transition-all space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-500/10 pb-4">
                        <div>
                          <div className="text-xs font-mono text-gold-400 font-bold">{order.orderNumber}</div>
                          <div className="text-[11px] text-gray-400 font-mono">Placed on {order.date}</div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                              order.status === "Delivered"
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {order.status === "Delivered" ? "✓ Delivered" : "🚚 In Transit"}
                          </span>
                          <span className="text-lg font-serif font-bold text-white">₹{order.totalAmount} INR</span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-14 h-16 object-contain rounded-lg bg-obsidian-900 p-1 border border-gold-500/10"
                            />
                            <div className="flex-1">
                              <h4 className="font-serif text-sm text-white">{item.title}</h4>
                              <p className="text-xs text-gray-400 font-mono">Volume: {item.size} • Qty: {item.quantity}</p>
                            </div>
                            <div className="text-xs font-mono text-gold-400 font-bold">₹{item.price} INR</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-obsidian-800/60 border border-gold-500/15 space-y-2">
                <div className="flex items-center justify-between text-gold-400 font-mono text-xs font-bold">
                  <span>Primary Atelier Residence</span>
                  <span className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-300 text-[10px]">Default</span>
                </div>
                <div className="text-white font-serif text-base">{currentUser.name}</div>
                <div className="text-xs text-gray-300 font-light space-y-0.5">
                  <p>Email: {currentUser.email}</p>
                  <p>Phone: {currentUser.phone || "Not provided"}</p>
                  <p>Address: {currentUser.address || "Place Vendôme, Paris"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
