"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Retail Order & General Inquiry",
    volume: "Personal (1-5 units)",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  const faqs = [
    {
      q: "How fresh is the coffee when it arrives at my doorstep?",
      a: "We roast in small 5kg micro-batches every Monday and Thursday. All orders are packed in one-way degassing valve pouches within 12 hours of roasting and dispatched via express air courier.",
    },
    {
      q: "Can I request specific grind sizes for my brew method?",
      a: "Absolutely. When placing your order or speaking with our concierge, you can specify Whole Bean, AeroPress, South Indian Filter, Espresso, or Cold Brew coarse grind at no additional charge.",
    },
    {
      q: "Are the attars and perfume oils genuinely alcohol-free?",
      a: "Yes, 100%. Our formulations rely exclusively on pure steam-distilled and deg-bhapka botanical concentrates macerated in sandalwood or organic cold-pressed jojoba oil bases. Zero denatured alcohol or synthetic extenders.",
    },
    {
      q: "How do wholesale orders and corporate gifting work?",
      a: "We provide bespoke corporate gift boxes, personalized roast profiles for cafes, and bulk export-grade spice packs. Select 'Corporate & Festive Luxury Gifting' in the form above or message our concierge on WhatsApp for wholesale tiered rate-cards.",
    },
    {
      q: "What is your shipping and return policy?",
      a: "We provide complimentary insured pan-India delivery on all orders above ₹999. Consumable items (coffee & spices) are roasted/packed fresh and guaranteed for biological purity. If your package arrives damaged in transit, we issue a hassle-free instant replacement.",
    },
  ];

  return (
    <div className="pb-24 space-y-20 sm:space-y-28 bg-[#120F0D] text-[#FAF7F2]">
      
      {/* 1. EDITORIAL HEADER */}
      <section className="bg-[#171311] text-[#FAF7F2] py-16 sm:py-24 border-b border-[#2C2420]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-bold tracking-widest uppercase text-[#D6B27C]">
            ibrew Concierge &amp; Private Inquiries
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-white">
            We Are at Your Service
          </h1>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-[#C4B7A7] leading-relaxed">
            Whether inquiring about rare seasonal roasts, tailored wholesale programs for cafes, or bespoke corporate gifting, our concierge team is on hand.
          </p>
        </div>
      </section>

      {/* 2. CONTACT GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#D6B27C]">
                Reach Out Directly
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white mt-1">
                Concierge Desks
              </h2>
              <p className="text-xs sm:text-sm text-[#C4B7A7] mt-2 leading-relaxed">
                Connect directly with our master roaster or olfactory curators.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="https://wa.me/917907217317?text=Hello%20Concierge,%20I%20would%20like%20to%20inquire%20about%20your%20offerings."
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4 p-5 rounded-2xl bg-[#1E1916] border border-white/10 shadow-lg hover:border-[#52B788]/50 transition-all"
              >
                <div className="h-11 w-11 rounded-xl bg-[#52B788]/15 flex items-center justify-center text-[#52B788] shrink-0">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#52B788] transition-colors flex items-center gap-1.5">
                    <span>Direct WhatsApp Concierge</span>
                    <span className="text-[10px] bg-[#52B788]/20 text-[#52B788] px-2 py-0.5 rounded-full font-bold">Fastest</span>
                  </h3>
                  <p className="text-xs text-[#C4B7A7] mt-0.5">+91 7907 217 317</p>
                  <p className="text-[11px] text-[#D6B27C] mt-2 font-semibold">Tap to chat with our team on WhatsApp →</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#1E1916] border border-white/10 shadow-lg">
                <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center text-[#D6B27C] shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Telephone Concierge</h3>
                  <p className="text-xs text-[#C4B7A7] mt-0.5">+91 7907 217 317</p>
                  <p className="text-[11px] text-white/40 mt-1">Available Mon – Sat, 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#1E1916] border border-white/10 shadow-lg">
                <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center text-[#D6B27C] shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Private Reserve Inquiries</h3>
                  <p className="text-xs text-[#C4B7A7] mt-0.5">concierge@ibrew.luxury</p>
                  <p className="text-xs text-[#C4B7A7]">wholesale@ibrew.luxury</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#1E1916] border border-white/10 shadow-lg">
                <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center text-[#D6B27C] shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Imaan’s Trading</h3>
                  <p className="text-xs text-[#C4B7A7] leading-relaxed">
                    NH 66 - Arikady, Kumbla,<br />
                    Post Code: 671321.<br />
                    Kasaragod, Kerala, India
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Arikady+Kumbla+Kasaragod+Kerala+671321"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D6B27C] hover:text-white transition-colors"
                    >
                      <span>Open in Google Maps →</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-[#1E1916] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-[#52B788]/20 text-[#52B788] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">
                  Thank You, {formData.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#C4B7A7] max-w-md mx-auto leading-relaxed">
                  Your inquiry regarding <strong>{formData.inquiryType}</strong> has been assigned to our concierge desk. We will respond within 4 business hours.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        inquiryType: "Retail Order & General Inquiry",
                        volume: "Personal (1-5 units)",
                        message: "",
                      });
                    }}
                    className="rounded-full bg-[#D6B27C] text-[#120F0D] px-6 py-2.5 text-xs font-bold tracking-wider uppercase"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Submit an Inquiry or Request a Bulk Quote
                  </h3>
                  <p className="text-xs text-[#C4B7A7] mt-1">
                    Fill in your details below. For wholesale inquiries, please indicate your estimated volume.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#FAF7F2]">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Radhika Menon"
                      className="w-full rounded-xl bg-[#14110E] border border-white/15 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D6B27C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#FAF7F2]">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. radhika@studio.com"
                      className="w-full rounded-xl bg-[#14110E] border border-white/15 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D6B27C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#FAF7F2]">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl bg-[#14110E] border border-white/15 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D6B27C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#FAF7F2]">Inquiry Purpose *</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full rounded-xl bg-[#14110E] border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B27C]"
                    >
                      <option className="bg-[#14110E] text-white">Retail Order &amp; General Inquiry</option>
                      <option className="bg-[#14110E] text-white">Cafe / HoReCa Coffee Wholesale</option>
                      <option className="bg-[#14110E] text-white">Corporate &amp; Festive Luxury Gifting</option>
                      <option className="bg-[#14110E] text-white">Bulk Export Spices (Cardamom/Pepper)</option>
                      <option className="bg-[#14110E] text-white">Bespoke Oud / Fragrance Formulation</option>
                      <option className="bg-[#14110E] text-white">Hospitality &amp; Ergonomic Mattresses</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#FAF7F2]">Estimated Quantity / Volume</label>
                  <select
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full rounded-xl bg-[#14110E] border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B27C]"
                  >
                    <option className="bg-[#14110E] text-white">Personal (1-5 units)</option>
                    <option className="bg-[#14110E] text-white">Small Business / Trial Batch (10-25 kg / units)</option>
                    <option className="bg-[#14110E] text-white">Medium Commercial (25-100 kg / units)</option>
                    <option className="bg-[#14110E] text-white">Large Enterprise / Recurring Monthly Supply (100kg+)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#FAF7F2]">Your Message or Special Request *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your requirements, specific roast preferences, or delivery timelines..."
                    className="w-full rounded-xl bg-[#14110E] border border-white/15 p-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D6B27C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <Send size={15} /> Submit Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* 3. FAQ ACCORDION */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold tracking-widest uppercase text-[#D6B27C]">
            Answers &amp; Guidance
          </span>
          <h2 className="text-3xl font-serif text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-[#1E1916] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-base font-bold text-white hover:text-[#D6B27C]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-200 text-white/50 ${
                      isOpen ? "rotate-180 text-[#D6B27C]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#C4B7A7] leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
