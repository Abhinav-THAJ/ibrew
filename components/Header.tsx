"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  // Heart,
  Menu,
  ShoppingBag,
  User,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "./CartContext";

const NAV_ITEMS = [
  { label: "Coffee", href: "/coffee" },
  { label: "Spices", href: "/spices" },
  { label: "Perfumes", href: "/perfumeoil" },
  { label: "Imported Beds", href: "/importedbed" },
];

const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN")}`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const {
    cartItems,
    cartCount,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!cartOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cartOpen]);

  const changeQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    updateQuantity(id, quantity);
  };

  const actions = [
    { label: "Login", href: "/login", Icon: User },
    // { label: "Wishlist", href: "/wishlist", Icon: Heart },
  ];

  return (
    <>
      {/* Main header */}
      <header className="sticky top-0 z-50 border-0 bg-white text-black shadow-none">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:h-[72px] sm:px-6 lg:px-8">
         
          
{/* Logo */}
<Link
  href="/"
  onClick={() => setMenuOpen(false)}
  className="shrink-0 pt-4 transition-opacity hover:opacity-80"
>
  <Image
    src="/images/logo.png?v=2"
    alt="Imaan's Store"
    width={300}
    height={150}
    
    priority
    unoptimized
    className="h-auto w-40 object-contain sm:w-48 md:w-56 lg:w-84"
  />
</Link>


          {/* Desktop navigation */}
          <ul className="hidden items-center gap-5 md:flex lg:gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="whitespace-nowrap text-sm font-medium text-black transition-colors hover:text-neutral-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Header actions */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            {actions.map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="hidden text-black transition-colors hover:text-neutral-500 sm:flex"
              >
                <Icon size={21} strokeWidth={1.7} />
              </Link>
            ))}

            {/* Cart button */}
            <button
              type="button"
              onClick={() => {
                setCartOpen(true);
                setMenuOpen(false);
              }}
              aria-label={`Open cart, ${cartCount} items`}
              className="relative flex items-center justify-center text-black transition-colors hover:text-neutral-500"
            >
              <ShoppingBag size={22} strokeWidth={1.7} />

              {cartCount > 0 && (
                <span className="absolute -right-2.5 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="ml-1 text-black transition-colors hover:text-neutral-500 md:hidden"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </nav>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="border-t border-neutral-200 bg-white px-4 py-3 shadow-md md:hidden">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
                >
                  <User size={18} />
                  Login
                </Link>
              </li>

              
            </ul>
          </div>
        )}
      </header>

      {/* Cart drawer overlay */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60"
          />

          {/* Cart drawer */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="absolute right-0 top-0 flex h-[100dvh] w-full max-w-md flex-col bg-white text-black shadow-2xl sm:w-[440px]"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-black">
                  Your Cart
                </h2>

                <p className="mt-0.5 text-xs text-neutral-500">
                  {cartCount} {cartCount === 1 ? "item" : "items"} in your bag
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="rounded-full p-2 text-black transition hover:bg-neutral-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                    <ShoppingCart
                      size={34}
                      strokeWidth={1.3}
                      className="text-neutral-600"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-black">
                    Your cart is empty
                  </h3>

                  <p className="mt-2 max-w-[250px] text-sm leading-6 text-neutral-500">
                    Looks like you haven&apos;t added any products yet.
                  </p>

                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-4 border-b border-neutral-200 pb-5"
                    >
                      {/* Product image */}
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-28 sm:w-28">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="text-neutral-400" />
                          </div>
                        )}
                      </div>

                      {/* Product details */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="line-clamp-2 text-sm font-medium leading-5 text-black">
                            {item.name}
                          </h3>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="shrink-0 rounded p-1 text-neutral-500 transition hover:text-black"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-black">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity and line total */}
                        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                          <div className="flex items-center rounded-full border border-neutral-300 text-black">
                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(item.id, item.quantity - 1)
                              }
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="rounded-l-full p-2 transition hover:bg-neutral-100"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="min-w-8 text-center text-sm tabular-nums">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(item.id, item.quantity + 1)
                              }
                              aria-label={`Increase quantity of ${item.name}`}
                              className="rounded-r-full p-2 transition hover:bg-neutral-100"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <p className="text-sm font-semibold text-black">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Subtotal and checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-neutral-200 bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-6">
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>Subtotal</span>

                  <span className="text-base font-semibold text-black">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  Shipping and any applicable taxes are calculated at checkout.
                </p>

                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  View Cart & Checkout <ArrowRight size={17} />
                </Link>

                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="mt-3 w-full rounded-full border border-black px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}