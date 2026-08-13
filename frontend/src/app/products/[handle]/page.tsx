import React from "react";
import { fetchServerProductByHandle, fetchServerProducts } from "@/lib/medusa-server";


export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Header } from "@/components/Header";
import { ProductDetailView } from "@/components/ProductDetailView";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";
import Link from "next/link";

interface ProductPageProps {
  params: {
    handle: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchServerProductByHandle(params.handle);
  const allProducts = await fetchServerProducts();


  if (!product) {
    return (
      <main className="min-h-screen bg-obsidian-900 text-white flex flex-col justify-between">
        <Header />
        <div className="text-center py-32 px-4 max-w-lg mx-auto glass-panel rounded-2xl border border-gold-500/20 my-12">
          <h1 className="text-3xl font-serif text-white mb-4">Fragrance Not Found</h1>
          <p className="text-xs text-gray-400 font-light mb-8">
            The scent extraction you are looking for may have been archived or renamed.
          </p>
          <Link
            href="/"
            className="px-8 py-3 bg-gold-500 text-obsidian-900 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold-400 transition-colors"
          >
            Explore 15 Fragrances
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-obsidian-900 text-white selection:bg-gold-500 selection:text-obsidian-900">
      <Header />
      <ProductDetailView product={product} allProducts={allProducts} />
      <CartDrawer />
      <CheckoutModal />
      <Footer />
    </main>
  );
}
