"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="bg-[#171311] text-[#FAF7F2] border-t border-[#29221D] mt-20">
      
      {/* Upper Brand Highlights */}
      <div className="border-b border-[#29221D] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3">
              <span className="text-xl">☕</span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">Estate Sourced</h4>
                <p className="text-[11px] text-[#C4B7A7] mt-0.5">High-altitude shade grown Arabica</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🌿</span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">Pure &amp; Unadulterated</h4>
                <p className="text-[11px] text-[#C4B7A7] mt-0.5">Sun-dried 8mm+ emerald spices</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">✨</span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">Artisanal Distillation</h4>
                <p className="text-[11px] text-[#C4B7A7] mt-0.5">Aged wild oud &amp; traditional attars</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">📦</span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">Direct Concierge</h4>
                <p className="text-[11px] text-[#C4B7A7] mt-0.5">Complimentary shipping over ₹999</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-block py-1">
              <Image
                src="/images/logo-ibrew.png"
                alt="ibrew Luxury Roasters"
                width={220}
                height={70}
                className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(214,178,124,0.35)] transition-transform duration-300 hover:scale-105"
              />
            </Link>
            <p className="text-xs leading-relaxed text-[#C4B7A7] max-w-sm">
              Dedicated to the honest pursuit of slow living. We curate micro-lot estate coffees, export-grade Malabar spices, artisanal perfumery oils, and European sleep systems for discerning homes.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-[#FAF7F2] mb-2.5">
                The ibrew Journal &amp; Private Reserve
              </h4>
              <p className="text-[11px] text-[#C4B7A7] mb-3">
                Receive private release alerts for seasonal roasts, wild harvests, and member tastings.
              </p>
              {subscribed ? (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#29221D] text-[#D6B27C] text-xs font-medium">
                  <Sparkles size={14} /> You are on the private reserve list.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 rounded-full bg-[#241E1A] border border-[#3A3029] px-4 py-2.5 text-xs text-[#FAF7F2] placeholder-[#8A7D71] focus:outline-none focus:border-[#D6B27C]"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-[#D6B27C] hover:bg-[#C29B38] text-[#171311] px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 md:col-start-7 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">
              The 5 Pages
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C4B7A7]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  1. Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  2. Shop All Offerings
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  3. Brand Story &amp; Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  4. Concierge &amp; Inquiries
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  5. Bag &amp; Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Offerings Categories */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">
              Offerings
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C4B7A7]">
              <li>
                <Link href="/shop?category=coffee" className="hover:text-white transition-colors">
                  Estate Coffee
                </Link>
              </li>
              <li>
                <Link href="/shop?category=spices" className="hover:text-white transition-colors">
                  Whole &amp; Ground Spices
                </Link>
              </li>
              <li>
                <Link href="/shop?category=perfumeoil" className="hover:text-white transition-colors">
                  Dehn Al Oud &amp; Attars
                </Link>
              </li>
              <li>
                <Link href="/shop?category=importedbed" className="hover:text-white transition-colors">
                  Luxury Bedding Systems
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Bulk &amp; Cafe Wholesale
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge & Admin */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">
              Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C4B7A7]">
              <li>Mon – Sat: 9:00 AM – 7:00 PM</li>
              <li className="text-[#FAF7F2] font-semibold">+91 99950 67188</li>
              <li>concierge@ibrew.luxury</li>
              <li>Coordinate Estates, Western Ghats</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#29221D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8A7D71]">
          <p>© 2026 ibrew Luxury Goods Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Crafted with patience &amp; provenance</span>
            <span>•</span>
            <Link href="/about" className="hover:text-[#FAF7F2] transition-colors">
              Our Ethos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
