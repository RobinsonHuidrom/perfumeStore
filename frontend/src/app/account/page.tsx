import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { AccountPortal } from "@/components/AccountPortal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-obsidian-900 text-white selection:bg-gold-500 selection:text-obsidian-900">
      <Header />
      <AccountPortal />
      <CartDrawer />
      <Footer />
    </main>
  );
}
