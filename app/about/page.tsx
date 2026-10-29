import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Coffee, Leaf, Flower2, BedDouble } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      title: "Generational Provenance",
      desc: "We do not buy from anonymous commodity exchanges. Every single harvest is tied to specific coordinate plots in Coorg, Wayanad, and Idukki cultivated by families we know by name.",
      icon: Leaf,
    },
    {
      title: "Patience Over Yield",
      desc: "Our arabica cherries ripen beneath shaded tree canopies for 9 months—nearly double commercial timelines—allowing sugars and delicate aromatic esters to fully develop.",
      icon: Coffee,
    },
    {
      title: "Traditional Deg-Bhapka Stills",
      desc: "Our attars and ouds bypass petroleum distillation. They are slowly coaxed in copper cauldrons over wood embers, capturing the living essence of Taif roses and Cambodi heartwood.",
      icon: Flower2,
    },
    {
      title: "Honest Materiality",
      desc: "Whether it is long-staple Egyptian Giza cotton or certified Pinocore organic latex, we never compromise on biological purity, skin safety, or environmental stewardship.",
      icon: BedDouble,
    },
  ];

  return (
    <div className="pb-24 space-y-24 sm:space-y-32">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#1D1815] text-[#FAF7F2] py-24 sm:py-32 overflow-hidden border-b border-[#2C2420]">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="/images/brew.jpeg"
            alt="Estate coffee beans roasting"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1815] via-[#1D1815]/70 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B27C]/30 bg-[#29221D]/70 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[#D6B27C]">
            <Sparkles size={13} />
            <span>Our Heritage &amp; Ethos</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-white leading-tight">
            The Pursuit of Quiet Luxury &amp; Honest Extraction.
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-[#C4B7A7] leading-relaxed">
            ibrew was founded on a simple observation: modern commerce has accelerated production at the expense of aroma, soil health, and craft integrity. We exist to restore that balance.
          </p>
        </div>
      </section>

      {/* 2. THE FOUNDING STORY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-[#1D1815]/10">
            <Image
              src="/images/coffee/coffee-collection.jpeg"
              alt="ibrew coffee curation"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-[#A85A34]">
              How it Began
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1D1815] leading-snug">
              From High-Altitude Shaded Slopes to the Discerning Cup.
            </h2>
            <p className="text-sm text-[#1D1815]/75 leading-relaxed">
              Our journey started on a small family coffee estate nestled at 4,200 feet along the misty ridges of Coorg. Disillusioned with hyper-commercialized instant powders and mass-market blends cut with burnt filler, we started roasting micro-lots in 5-kilogram cast-iron drums.
            </p>
            <p className="text-sm text-[#1D1815]/75 leading-relaxed">
              As coffee lovers began reaching out across India, our curiosity naturally widened to other ancient artisanal crafts of the subcontinent: the emerald green cardamom pods of Idukki, the forgotten deg-bhapka hydro-distillation of pure attar oils in Kannauj, and restorative European organic sleep ergonomics.
            </p>
            <p className="text-sm text-[#1D1815]/75 leading-relaxed">
              Today, <strong className="text-[#1D1815]">ibrew</strong> brings together these four timeless domains under one roof, guided by a steadfast refusal to dilute quality.
            </p>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#A85A34] hover:text-[#1D1815] pb-1 border-b border-[#A85A34] transition-colors"
              >
                <span>Experience Our Catalog</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FOUR CRAFT PRINCIPLES */}
      <section className="bg-[#FAF7F2] py-20 border-y border-[#1D1815]/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold tracking-widest uppercase text-[#A85A34]">
              Our Sourcing Pledge
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1D1815]">
              Principles That Cannot Be Compromised
            </h2>
            <p className="text-xs sm:text-sm text-[#1D1815]/70">
              The ethical and artisanal code that governs every item bearing the ibrew hallmark.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-7 border border-[#1D1815]/8 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#F5EFEB] flex items-center justify-center text-[#6E442B]">
                    <Icon size={24} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#1D1815]">
                    {v.title}
                  </h3>
                  <p className="text-xs text-[#1D1815]/70 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. VISUAL PHOTO COLLAGE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/images/coffebags.png"
              alt="ibrew coffee packing"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/images/spices/cardamom.avif"
              alt="Harvested green cardamom"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/images/Elegant Bottle Display.png"
              alt="Rare Cambodian Oud display"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/images/importedbed/double-bed.jpeg"
              alt="Luxury bedroom setup"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-serif text-[#1D1815]">
          Ready to experience the difference?
        </h2>
        <p className="text-xs sm:text-sm text-[#1D1815]/70 max-w-md mx-auto leading-relaxed">
          Order directly from our weekly micro-lots or speak with our concierge for custom roasting and wholesale inquiries.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/shop"
            className="rounded-full bg-[#1D1815] hover:bg-[#322923] text-white px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors"
          >
            Explore The Shop
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-[#1D1815]/20 hover:border-[#1D1815] text-[#1D1815] px-8 py-3.5 text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            Contact Concierge
          </Link>
        </div>
      </section>

    </div>
  );
}
