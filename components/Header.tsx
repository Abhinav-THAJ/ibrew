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
  Lock,
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
      <div className="bg-[#1D1815] text-[#E8DCCF] text-[11px] sm:text-xs font-medium tracking-widest uppercase py-2 px-4 text-center border-b border-[#2C2420]">
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
            ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#1D1815]/10"
            : "bg-[#FAF7F2] border-b border-[#1D1815]/8"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between gap-6">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-[#1D1815] hover:opacity-70 transition-opacity"
                aria-label="Open navigation menu"
              >
                <Menu size={22} strokeWidth={1.75} />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="group flex items-center gap-3">
                <Image
                  src="/images/logo-ibrew.png"
                  alt="ibrew"
                  width={140}
                  height={42}
                  priority
                  className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-9">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative text-[13.5px] tracking-wide uppercase font-medium transition-colors duration-200 py-1 ${
                      isActive
                        ? "text-[#1D1815] font-semibold"
                        : "text-[#1D1815]/75 hover:text-[#1D1815]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#6E442B] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Quick Search */}
              <Link
                href="/shop"
                className="p-2 text-[#1D1815]/80 hover:text-[#1D1815] hover:bg-[#1D1815]/5 rounded-full transition-colors"
                title="Search offerings"
              >
                <Search size={19} strokeWidth={1.8} />
              </Link>

              {/* Admin Dashboard shortcut */}
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#1D1815]/70 hover:text-[#1D1815] px-2.5 py-1 rounded-full border border-[#1D1815]/15 hover:border-[#1D1815]/40 transition-colors"
                title="Admin Studio"
              >
                <Lock size={12} />
                <span>Admin</span>
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 bg-[#1D1815] hover:bg-[#322923] text-[#FAF7F2] px-3.5 py-2 sm:px-4 sm:py-2.2 rounded-full transition-all active:scale-95 shadow-sm"
                aria-label={`Open Cart (${cartCount} items)`}
              >
                <ShoppingBag size={17} strokeWidth={2} />
                <span className="text-xs font-semibold tracking-wider uppercase hidden sm:inline">
                  Bag
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8DCCF] text-[#1D1815] text-[11px] font-bold">
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
            className="fixed inset-0 bg-[#1D1815]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FAF7F2] p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#1D1815]/10">
                <Image
                  src="/images/logo-ibrew.png"
                  alt="ibrew"
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#1D1815]/70 hover:text-[#1D1815]"
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
                        ? "text-[#6E442B] font-semibold"
                        : "text-[#1D1815] hover:text-[#6E442B]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  className="text-xl font-medium text-[#1D1815] hover:text-[#6E442B] flex items-center justify-between pt-2 border-t border-[#1D1815]/10"
                >
                  <span>Shopping Bag</span>
                  <span className="text-sm bg-[#1D1815] text-white px-2 py-0.5 rounded-full font-bold">
                    {cartCount}
                  </span>
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#1D1815]/10 text-xs text-[#1D1815]/60 space-y-2">
              <p>Direct Inquiries: +91 99950 67188</p>
              <p>Email: concierge@ibrew.luxury</p>
              <Link
                href="/admin"
                className="inline-block mt-2 text-[#6E442B] font-semibold underline underline-offset-2"
              >
                Go to Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. SLIDE-OVER CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-[#1D1815]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setCartOpen(false)}
          />
          <aside className="fixed inset-y-0 right-0 w-full max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col">
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1D1815]/10">
              <div className="flex items-center gap-2">
                <ShoppingBag size={19} className="text-[#6E442B]" />
                <h2 className="text-base font-bold uppercase tracking-wider text-[#1D1815]">
                  Your Bag ({cartCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="p-1.5 text-[#1D1815]/60 hover:text-[#1D1815] hover:bg-[#1D1815]/5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#EFE8DF] px-6 py-3 border-b border-[#1D1815]/8 text-xs text-[#1D1815]">
              {subtotal >= 999 ? (
                <p className="flex items-center gap-1.5 text-[#355E3B] font-semibold">
                  <Sparkles size={14} /> You unlocked complimentary standard delivery!
                </p>
              ) : (
                <p>
                  Add <span className="font-bold">{formatPrice(999 - subtotal)}</span> more
                  to unlock complimentary pan-India shipping.
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#1D1815]/8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#1D1815]/60">
                  <div className="h-16 w-16 rounded-full bg-[#E8DCCF]/50 flex items-center justify-center mb-4 text-[#6E442B]">
                    <ShoppingBag size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-[#1D1815] font-serif">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#1D1815]/70 max-w-xs mt-1.5 mb-6">
                    Discover our freshly roasted single-origins, emerald spices, and fine oud oils.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D1815] text-[#FAF7F2] text-xs font-semibold tracking-wider uppercase transition hover:bg-[#322923]"
                  >
                    Browse Collection <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <article key={item.id} className="py-4 flex gap-4 items-center">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#E8DCCF]/40 border border-[#1D1815]/8">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#1D1815] truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#6E442B] font-bold mt-0.5">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center rounded-full border border-[#1D1815]/20 bg-white">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeFromCart(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            className="p-1.5 text-[#1D1815]/70 hover:text-[#1D1815]"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-[#1D1815]/70 hover:text-[#1D1815]"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#1D1815]/40 hover:text-red-700 transition-colors p-1"
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
              <div className="p-6 bg-[#FFFFFF] border-t border-[#1D1815]/10 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#1D1815]/70">Subtotal</span>
                  <span className="font-bold text-base text-[#1D1815]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-[#1D1815]/50">
                  Applicable taxes and express delivery calculated during checkout.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    className="col-span-2 flex items-center justify-center gap-2 rounded-full bg-[#1D1815] text-[#FAF7F2] py-3.5 text-xs font-bold tracking-widest uppercase transition hover:bg-[#322923] shadow-md"
                  >
                    View Bag &amp; Checkout <ArrowRight size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="col-span-2 text-center text-xs font-semibold text-[#1D1815]/70 hover:text-[#1D1815] py-1"
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
