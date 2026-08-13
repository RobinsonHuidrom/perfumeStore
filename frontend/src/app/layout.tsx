import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Maison de Parfum | Luxury Extrait de Parfum Collection",
  description:
    "Explore 15 rare handcrafted extractions from Maison de Parfum. Featuring 50ml and 100ml bottle sizes, formulated in Paris & Grasse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-obsidian-900 text-white min-h-screen">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
