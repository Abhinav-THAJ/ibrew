"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/components/CartContext";

const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Karnataka",
    pincode: "",
    notes: "",
    paymentMethod: "cod",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    const code = promoCode.trim().toUpperCase();
    if (code === "IBREW10" || code === "WELCOME10") {
      setDiscountPercent(10);
      setPromoSuccess("10% Artisanal reserve discount applied!");
    } else if (code === "LUXURY15") {
      setDiscountPercent(15);
      setPromoSuccess("15% Connoisseur discount applied!");
    } else {
      setPromoError("Invalid promotional code. Try 'IBREW10'.");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `IBR-${randomNum}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);

    cartItems.forEach((item) => removeFromCart(item.id));
  };

  if (orderPlaced) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-[#E8F0EA] text-[#355E3B] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={44} />
        </div>

        <span className="text-xs font-bold tracking-widest uppercase text-[#A85A34]">
          Order Confirmed • {orderId}
        </span>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#1D1815]">
          Thank You, {shippingDetails.name || "Patron"}.
        </h1>

        <p className="text-sm text-[#1D1815]/75 leading-relaxed max-w-md mx-auto">
          Your order has been received and scheduled for fresh roasting &amp; packaging. We will send tracking updates to <strong>{shippingDetails.email || "your email"}</strong> and WhatsApp.
        </p>

        <div className="bg-white p-6 rounded-2xl border border-[#1D1815]/10 text-left text-xs space-y-3 max-w-md mx-auto shadow-sm">
          <div className="flex justify-between border-b border-[#1D1815]/8 pb-2">
            <span className="text-[#1D1815]/60">Order Reference:</span>
            <span className="font-bold text-[#1D1815]">{orderId}</span>
          </div>
          <div className="flex justify-between border-b border-[#1D1815]/8 pb-2">
            <span className="text-[#1D1815]/60">Payment Method:</span>
            <span className="font-semibold text-[#1D1815] uppercase">
              {shippingDetails.paymentMethod === "cod" ? "Pay on Delivery (COD)" : "Online Verified"}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#1D1815]/8 pb-2">
            <span className="text-[#1D1815]/60">Estimated Dispatch:</span>
            <span className="font-semibold text-[#1D1815]">Within 24 Hours</span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-bold">
            <span>Total Value:</span>
            <span className="text-[#A85A34]">{formatPrice(grandTotal)}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto rounded-full bg-[#1D1815] hover:bg-[#322923] text-white px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors"
          >
            Continue Exploring Shop
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto rounded-full border border-[#1D1815]/20 hover:border-[#1D1815] text-[#1D1815] px-8 py-3.5 text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            Contact Concierge
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto text-center space-y-5">
        <div className="h-20 w-20 rounded-full bg-[#F5EFEB] text-[#6E442B] flex items-center justify-center mx-auto mb-2">
          <ShoppingBag size={34} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1D1815]">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#1D1815]/70 max-w-md mx-auto leading-relaxed">
          Looks like you haven&apos;t added any single-origin roasts, emerald spices, or fragrance oils yet.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-[#1D1815] hover:bg-[#A85A34] text-white px-7 py-3.5 text-xs font-bold tracking-widest uppercase transition-all shadow-md"
          >
            Explore the Collection <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="border-b border-[#1D1815]/10 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1815]/60 hover:text-[#1D1815] mb-2"
            >
              <ArrowLeft size={14} /> Back to Shop
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1D1815]">
              Shopping Bag &amp; Checkout
            </h1>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A85A34]">
            {cartItems.length} Distinct Curation{cartItems.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Cart Items + Delivery Form */}
          <div className="lg:col-span-7 space-y-10">
            
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1D1815]/10 shadow-sm space-y-6">
              <h2 className="text-lg font-serif font-bold text-[#1D1815] border-b border-[#1D1815]/8 pb-3">
                1. Review Offerings in Bag
              </h2>

              <div className="divide-y divide-[#1D1815]/8">
                {cartItems.map((item) => (
                  <article key={item.id} className="py-4 flex gap-4 sm:gap-6 items-center">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden bg-[#F5EFEB] border border-[#1D1815]/8">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-serif font-bold text-[#1D1815] truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs font-bold text-[#6E442B] mt-0.5">
                        {formatPrice(item.price)} each
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center rounded-full border border-[#1D1815]/20 bg-[#FAF7F2]">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeFromCart(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            className="p-1.5 sm:p-2 text-[#1D1815]/70 hover:text-[#1D1815]"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 sm:p-2 text-[#1D1815]/70 hover:text-[#1D1815]"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-[#1D1815]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#1D1815]/30 hover:text-red-700 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1D1815]/10 shadow-sm space-y-6">
              <h2 className="text-lg font-serif font-bold text-[#1D1815] border-b border-[#1D1815]/8 pb-3">
                2. Delivery &amp; Contact Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1D1815]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.name}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                    placeholder="Enter recipient name"
                    className="w-full rounded-xl bg-[#FAF7F2] border border-[#1D1815]/15 px-3.5 py-2.5 text-xs text-[#1D1815] placeholder-[#1D1815]/40 focus:outline-none focus:border-[#6E442B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1D1815]">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={shippingDetails.phone}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                    placeholder="Mobile for delivery OTP"
                    className="w-full rounded-xl bg-[#FAF7F2] border border-[#1D1815]/15 px-3.5 py-2.5 text-xs text-[#1D1815] placeholder-[#1D1815]/40 focus:outline-none focus:border-[#6E442B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1D1815]">Email Address (for invoice &amp; tracking) *</label>
                <input
                  type="email"
                  required
                  value={shippingDetails.email}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                  placeholder="recipient@domain.com"
                  className="w-full rounded-xl bg-[#FAF7F2] border border-[#1D1815]/15 px-3.5 py-2.5 text-xs text-[#1D1815] placeholder-[#1D1815]/40 focus:outline-none focus:border-[#6E442B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1D1815]">Street Address &amp; Apartment *</label>
                <input
                  type="text"
                  required
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                  placeholder="House / Flat No, Building, Street"
                  className="w-full rounded-xl bg-[#FAF7F2] border border-[#1D1815]/15 px-3.5 py-2.5 text-xs text-[#1D1815] placeholder-[#1D1815]/40 focus:outline-none focus:border-[#6E442B]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1D1815]">City *</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                    placeholder="City"
                    className="w-full rounded-xl bg-[#FAF7F2] border border-[#1D1815]/15 px-3 py-2 text-xs text-[#1D1815] placeholder-[#1D1815]/40 focus:outline-none focus:border-[#6E442B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1D1815]">State *</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.state}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                    placeholder="State"
                    className="w-full rounded-xl bg-[#FAF7F2] border border-[#1D1815]/15 px-3 py-2 text-xs text-[#1D1815] placeholder-[#1D1815]/40 focus:outline-none focus:border-[#6E442B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1D1815]">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.pincode}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, pincode: e.target.value })}
                    placeholder="6-digit PIN"
                    className="w-full rounded-xl bg-[#FAF7F2] border border-[#1D1815]/15 px-3 py-2 text-xs text-[#1D1815] placeholder-[#1D1815]/40 focus:outline-none focus:border-[#6E442B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1D1815]">Special Roast or Delivery Notes (Optional)</label>
                <input
                  type="text"
                  value={shippingDetails.notes}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, notes: e.target.value })}
                  placeholder="e.g. Please grind for French Press / Leave with security"
                  className="w-full rounded-xl bg-[#FAF7F2] border border-[#1D1815]/15 px-3.5 py-2 text-xs text-[#1D1815] placeholder-[#1D1815]/40 focus:outline-none focus:border-[#6E442B]"
                />
              </div>

              <div className="pt-2 space-y-2">
                <label className="text-xs font-bold text-[#1D1815] uppercase tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                    shippingDetails.paymentMethod === "cod"
                      ? "border-[#6E442B] bg-[#F5EFEB]/50"
                      : "border-[#1D1815]/15 bg-white"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={shippingDetails.paymentMethod === "cod"}
                      onChange={() => setShippingDetails({ ...shippingDetails, paymentMethod: "cod" })}
                      className="text-[#6E442B] focus:ring-[#6E442B]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#1D1815]">Pay on Delivery (COD)</p>
                      <p className="text-[11px] text-[#1D1815]/60">Cash or UPI upon delivery</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                    shippingDetails.paymentMethod === "online"
                      ? "border-[#6E442B] bg-[#F5EFEB]/50"
                      : "border-[#1D1815]/15 bg-white"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={shippingDetails.paymentMethod === "online"}
                      onChange={() => setShippingDetails({ ...shippingDetails, paymentMethod: "online" })}
                      className="text-[#6E442B] focus:ring-[#6E442B]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#1D1815]">Online Payment / UPI</p>
                      <p className="text-[11px] text-[#1D1815]/60">GPay, Cards &amp; NetBanking</p>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Sticky Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-[#1D1815]/10 shadow-lg space-y-6">
              <h2 className="text-lg font-serif font-bold text-[#1D1815] border-b border-[#1D1815]/8 pb-3">
                Order Summary
              </h2>

              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code (try IBREW10)"
                    className="flex-1 rounded-xl bg-[#FAF7F2] border border-[#1D1815]/15 px-3.5 py-2 text-xs uppercase tracking-wider text-[#1D1815] placeholder-normal placeholder-[#1D1815]/40 focus:outline-none focus:border-[#6E442B]"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[#1D1815] hover:bg-[#322923] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-red-600">{promoError}</p>}
                {promoSuccess && <p className="text-[11px] text-green-700 font-semibold">{promoSuccess}</p>}
              </form>

              <div className="space-y-3 text-xs border-y border-[#1D1815]/8 py-4">
                <div className="flex justify-between text-[#1D1815]/70">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#1D1815]">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#355E3B] font-semibold">
                    <span>Artisanal Privilege ({discountPercent}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#1D1815]/70">
                  <div className="flex items-center gap-1">
                    <Truck size={13} />
                    <span>Pan-India Express Courier</span>
                  </div>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-[#355E3B] uppercase tracking-wider text-[11px]">Free</strong>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-base">
                <span className="font-serif font-bold text-[#1D1815]">Total Payable</span>
                <span className="font-serif font-bold text-xl text-[#A85A34]">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full rounded-full bg-[#1D1815] hover:bg-[#A85A34] text-white py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} /> Place Order ({formatPrice(grandTotal)})
              </button>

              <div className="pt-2 text-center text-[11px] text-[#1D1815]/50 flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} className="text-[#355E3B]" />
                <span>Direct Estate Guarantee • 100% Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
