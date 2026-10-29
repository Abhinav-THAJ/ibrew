"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { useCart } from "./CartContext";
import { useModalBehavior } from "./useModalBehavior";

const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { cartItems, cartCount, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setCartOpen(false);
  }, [pathname]);

  useModalBehavior(cartOpen, () => setCartOpen(false));
  useModalBehavior(mobileMenuOpen, () => setMobileMenuOpen(false));

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* 1. ANNOUNCEMENT BAR */}
      <div className="bg-[#0D0A09] text-[#E8DCCF] text-[11px] sm:text-xs font-medium tracking-widest uppercase py-2.5 px-4 text-center border-b border-[#241E1A]">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-2 sm:gap-4">
          <span className="hidden sm:inline">☕</span>
          <span>Complimentary Pan-India Delivery on Orders Above ₹999</span>
          <span className="opacity-40">•</span>
          <span className="text-[#D6B27C] font-semibold">Small-Batch Roasted Weekly</span>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#171311]/95 backdrop-blur-md shadow-lg border-b border-[#2C2420]"
            : "bg-[#171311] border-b border-[#241E1A]"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 sm:h-22 items-center justify-between gap-6">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-white hover:text-[#D6B27C] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu size={24} strokeWidth={2} />
              </button>
            </div>

            {/* Brand Logo - Radiant Artisanal Gold */}
            <div className="flex items-center">
              <Link href="/" className="group flex items-center py-1">
                <Image
                  src="/images/logo-ibrew.png"
                  alt="ibrew Luxury Roasters"
                  width={240}
                  height={78}
                  priority
                  className="h-10 sm:h-12 lg:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_12px_rgba(214,178,124,0.35)]"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative text-[14px] tracking-[0.18em] uppercase transition-all duration-200 py-1.5 ${
                      isActive
                        ? "text-[#D6B27C] font-bold"
                        : "text-white font-semibold hover:text-[#D6B27C]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#D6B27C] rounded-full shadow-[0_0_10px_rgba(214,178,124,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Quick Search */}
              <Link
                href="/shop"
                className="p-2 text-white hover:text-[#D6B27C] hover:bg-white/10 rounded-full transition-colors"
                title="Search offerings"
                aria-label="Search catalog"
              >
                <Search size={20} strokeWidth={2} />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] px-4 py-2 rounded-full transition-all active:scale-95 shadow-md font-bold"
                aria-label={`Open Cart (${cartCount} items)`}
              >
                <ShoppingBag size={17} strokeWidth={2.4} />
                <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline">
                  Bag
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#120F0D] text-[#D6B27C] text-[11px] font-bold">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#171311] text-[#FAF7F2] p-6 shadow-2xl flex flex-col justify-between border-r border-[#2C2420]">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Image
                  src="/images/logo-ibrew.png"
                  alt="ibrew Luxury Roasters"
                  width={180}
                  height={58}
                  className="h-10 sm:h-11 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(214,178,124,0.35)]"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white/70 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xl font-medium tracking-tight transition-colors ${
                      pathname === link.href
                        ? "text-[#D6B27C] font-semibold"
                        : "text-[#FAF7F2] hover:text-[#D6B27C]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  className="text-xl font-medium text-[#FAF7F2] hover:text-[#D6B27C] flex items-center justify-between pt-2 border-t border-white/10"
                >
                  <span>Shopping Bag</span>
                  <span className="text-sm bg-[#D6B27C] text-[#120F0D] px-2 py-0.5 rounded-full font-bold">
                    {cartCount}
                  </span>
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-[#C4B7A7] space-y-2">
              <p>Direct Inquiries: +91 7907 217 317</p>
              <p>Email: concierge@ibrew.luxury</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. SLIDE-OVER CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setCartOpen(false)}
          />
          <aside className="fixed inset-y-0 right-0 w-full max-w-md bg-[#181412] text-[#FAF7F2] shadow-2xl flex flex-col border-l border-[#2C2420]">
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag size={19} className="text-[#D6B27C]" />
                <h2 className="text-base font-bold uppercase tracking-wider text-[#FAF7F2]">
                  Your Bag ({cartCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#241E1A] px-6 py-3 border-b border-white/8 text-xs text-[#E8DCCF]">
              {subtotal >= 999 ? (
                <p className="flex items-center gap-1.5 text-[#52B788] font-semibold">
                  <Sparkles size={14} /> You unlocked complimentary standard delivery!
                </p>
              ) : (
                <p>
                  Add <span className="font-bold text-[#D6B27C]">{formatPrice(999 - subtotal)}</span> more
                  to unlock complimentary pan-India shipping.
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-white/8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#C4B7A7]">
                  <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[#D6B27C]">
                    <ShoppingBag size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#C4B7A7] max-w-xs mt-1.5 mb-6">
                    Discover our freshly roasted single-origins, emerald spices, and fine oud oils.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D6B27C] text-[#120F0D] text-xs font-bold tracking-wider uppercase transition hover:bg-[#C29B38]"
                  >
                    Browse Collection <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <article key={item.id} className="py-4 flex gap-4 items-center">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5 border border-white/10">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#D6B27C] font-bold mt-0.5">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-[#241E1A]">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeFromCart(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            className="p-1.5 text-white/70 hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-white/70 hover:text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/40 hover:text-red-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 bg-[#1F1916] border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#C4B7A7]">Subtotal</span>
                  <span className="font-bold text-base text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-[#8A7D71]">
                  Applicable taxes and express delivery calculated during checkout.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    className="col-span-2 flex items-center justify-center gap-2 rounded-full bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] py-3.5 text-xs font-bold tracking-widest uppercase transition-colors shadow-lg"
                  >
                    View Bag &amp; Checkout <ArrowRight size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="col-span-2 text-center text-xs font-semibold text-[#C4B7A7] hover:text-white py-1"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
