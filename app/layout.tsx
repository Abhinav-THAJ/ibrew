import type { Metadata } from "next";
import { Suspense } from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ibrew | Artisanal Coffee, Pure Spices & Luxury Living",
  description:
    "Curators of micro-lot estate coffees, wild-harvested Malabar spices, traditional oud attars, and luxury European bedding.",
  icons: {
    icon: "/images/logo-ibrew.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-full flex-col bg-[#120F0D] text-[#FAF7F2] font-sans selection:bg-[#D6B27C] selection:text-[#120F0D]">
        <CartProvider>
          <Suspense fallback={<div className="h-20 sm:h-22 bg-[#171311] border-b border-[#29221D]" />}>
            <Header />
          </Suspense>
          <main className="flex-1 bg-[#120F0D]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
