import { fetchServerProducts, fetchServerCategories } from "@/lib/medusa-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedCollectionBanner } from "@/components/FeaturedCollectionBanner";
import { ProductGrid } from "@/components/ProductGrid";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";

export default async function Home() {
  const products = await fetchServerProducts();
  const categories = await fetchServerCategories();

  return (
    <main className="min-h-screen bg-obsidian-900 text-white selection:bg-gold-500 selection:text-obsidian-900">
      <Header />
      <Hero />
      <FeaturedCollectionBanner products={products} />
      <ProductGrid products={products} serverCategories={categories} />
      <CartDrawer />
      <CheckoutModal />
      <Footer />
    </main>
  );
}
