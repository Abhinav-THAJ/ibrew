"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  Check,
  Coffee,
  Leaf,
  Flower2,
  BedDouble,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { INITIAL_PRODUCTS, formatPrice, ProductItem } from "@/data/products";

export default function HomePage() {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const featuredProducts = INITIAL_PRODUCTS.filter((p) => p.featured).slice(0, 6);

  const handleAdd = (item: ProductItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const pillars = [
    {
      title: "Estate Coffee",
      tagline: "Single-origin shade grown roasts",
      desc: "Cultivated at 4,200ft in Coorg & Wayanad. Hand-picked, monsoon-cured, and slow-roasted for profound notes of dark chocolate & caramel.",
      image: "/images/coffee/arabica.jpeg",
      href: "/shop?category=coffee",
      icon: Coffee,
      badge: "Micro-Lot Roasts",
    },
    {
      title: "Malabar Spices",
      tagline: "Export-grade 8mm+ green pods & black pearls",
      desc: "Harvested at peak ripeness from the rain-soaked hills of Idukki. Sun-dried without sulfur, delivering unmatched essential oil concentration.",
      image: "/images/spices/cardamom.avif",
      href: "/shop?category=spices",
      icon: Leaf,
      badge: "Pure & Unadulterated",
    },
    {
      title: "Rare Fragrance Oils",
      tagline: "Wild agarwood oud & Taif rose attars",
      desc: "Concentrated botanical extractions distilled via traditional copper deg-bhapka techniques. Free from alcohol, evolving with natural body heat.",
      image: "/images/Elegant Bottle Display.png",
      href: "/shop?category=perfumeoil",
      icon: Flower2,
      badge: "Artisanal Distillation",
    },
    {
      title: "Luxury Sleep Systems",
      tagline: "Organic Belgian latex & Nordic oak frames",
      desc: "7-zone ergonomic mattresses engineered for zero-pressure spinal alignment, complemented by 800TC long-staple Egyptian Giza sheets.",
      image: "/images/importedbed/double-bed.jpeg",
      href: "/shop?category=importedbed",
      icon: BedDouble,
      badge: "European Craft",
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-16 bg-[#120F0D] text-[#FAF7F2]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[82vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#171311] text-[#FAF7F2]">
        
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Barista Pouring Coffee.png"
            alt="Artisanal pour-over brewing"
            fill
            priority
            className="object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-[#120F0D]/60 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B27C]/30 bg-[#29221D]/70 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[#D6B27C]">
            <Sparkles size={13} />
            <span>Artisanal Provenance &amp; Rare Sourcing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-white leading-[1.08]">
            Crafted with Patience. <br />
            <span className="italic font-light text-[#E8DCCF]">Brewed for Living.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base lg:text-lg text-[#D5C9BC] leading-relaxed">
            From the mist-cloaked canopy of Western Ghats coffee estates to time-aged agarwood stills and European artisan bedrooms. Welcome to the quiet luxury of authentic craft.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] px-8 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              Explore Collection <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/25 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white px-8 py-4 text-xs sm:text-sm font-medium tracking-widest uppercase transition-all duration-300 active:scale-95"
            >
              Our Heritage &amp; Ethos
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE 4 PILLARS OF PROVENANCE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="text-xs font-bold tracking-widest uppercase text-[#D6B27C]">
            Curated Domains
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white">
            Four Pillars of Craft
          </h2>
          <p className="text-sm text-[#C4B7A7] leading-relaxed">
            Every offering is sourced through generational estate relationships, free from industrial shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1E1916] border border-white/10 p-5 transition-all duration-300 hover:shadow-2xl hover:border-[#D6B27C]/40"
              >
                <div className="relative h-64 w-full overflow-hidden rounded-xl bg-white/5">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute top-3 left-3 bg-[#120F0D]/90 backdrop-blur-sm text-[#FAF7F2] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                    {pillar.badge}
                  </div>
                </div>

                <div className="pt-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#D6B27C] mb-1.5">
                      <Icon size={16} strokeWidth={2} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {pillar.tagline}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#D6B27C] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#C4B7A7] leading-relaxed line-clamp-3">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/8 flex items-center justify-between text-xs font-semibold text-white group-hover:text-[#D6B27C]">
                    <span>View Offerings</span>
                    <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. CURATED PRIVATE RESERVE (FEATURED PRODUCTS) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-[#D6B27C]">
              Private Reserve
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white mt-1.5">
              The Artisan Selection
            </h2>
            <p className="text-xs sm:text-sm text-[#C4B7A7] mt-2 max-w-lg">
              Freshly roasted micro-lot coffees, extra-bold green cardamoms, and rare attars available in strictly limited seasonal batches.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#D6B27C] hover:text-white pb-1 border-b border-[#D6B27C] transition-colors"
          >
            <span>View Full Catalog (15 Items)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {featuredProducts.map((product) => {
            const isAdded = addedId === product.id;
            return (
              <article
                key={product.id}
                className="group flex flex-col bg-[#1E1916] rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#D6B27C]/40"
              >
                <div className="relative h-72 w-full overflow-hidden bg-white/5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#120F0D] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
                      {product.badge}
                    </span>
                  )}
                  {product.weightOrSize && (
                    <span className="absolute bottom-3 right-3 bg-[#120F0D]/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
                      {product.weightOrSize}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#C4B7A7] mb-1.5">
                      <span className="uppercase tracking-wider font-semibold text-[#D6B27C]">
                        {product.subCategory}
                      </span>
                      <div className="flex items-center gap-1 text-[#D6B27C]">
                        <Star size={12} fill="#D6B27C" />
                        <span className="font-bold text-white text-[11px]">
                          {product.rating}
                        </span>
                        <span className="text-white/40">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-white leading-snug group-hover:text-[#D6B27C] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#C4B7A7] mt-1.5 line-clamp-2 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-base font-bold text-white">
                        {formatPrice(product.price)}
                      </div>
                      {product.mrp > product.price && (
                        <div className="text-[11px] text-white/40 line-through">
                          MRP {formatPrice(product.mrp)}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all active:scale-95 shadow-md ${
                        isAdded
                          ? "bg-[#52B788] text-white"
                          : "bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D]"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} /> Add to Bag
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. EDITORIAL PHILOSOPHY & STORY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden bg-[#1E1916] text-[#FAF7F2] shadow-xl border border-white/10">
          
          <div className="lg:col-span-6 relative min-h-[360px] lg:min-h-full">
            <Image
              src="/images/brew.jpeg"
              alt="ibrew estate roasting"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-transparent to-[#1E1916]" />
          </div>

          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-[#D6B27C]">
              The ibrew Manifesto
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white leading-tight">
              An Obsession with Purity and Slower Extraction.
            </h2>
            <p className="text-xs sm:text-sm text-[#D5C9BC] leading-relaxed">
              In a commercial world obsessed with volume, we step back. Our coffee beans are shade-grown beneath century-old silver oaks to slow their cherry maturation. Our cardamoms are sun-dried on bamboo mats in the mist of Idukki. Our Cambodian Oud is macerated across a decade in brass vessel distillers.
            </p>
            <p className="text-xs sm:text-sm text-[#D5C9BC] leading-relaxed">
              We believe luxury is not an emblem, but the quiet satisfaction of knowing who grew your crop and where it came from.
            </p>

            <div className="pt-4 flex items-center gap-6">
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-white">100%</p>
                <p className="text-[11px] text-[#A69989] uppercase tracking-wider">Direct Origin</p>
              </div>
              <div className="h-10 w-[1px] bg-white/15" />
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-white">4,200ft</p>
                <p className="text-[11px] text-[#A69989] uppercase tracking-wider">Estate Altitude</p>
              </div>
              <div className="h-10 w-[1px] bg-white/15" />
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-white">Zero</p>
                <p className="text-[11px] text-[#A69989] uppercase tracking-wider">Artificial Fillers</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] px-6 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
              >
                Read Full Story <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONCIERGE CALLOUT & WHOLESALE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#1E1916] border border-white/10 p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest uppercase text-[#D6B27C]">
            Bespoke Concierge &amp; Wholesale
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white">
            Supplying Cafes, Boutique Hotels &amp; Corporate Gifts
          </h2>
          <p className="text-xs sm:text-sm text-[#C4B7A7] max-w-xl mx-auto leading-relaxed">
            Need custom coffee roast profiles, bulk export spices, or branded corporate luxury gifting? Our concierge team curates bespoke packages tailored to your exact taste.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] px-7 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Request a Bespoke Quote <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
