"use client";

import { useState } from "react";
import { Fraunces, Figtree } from "next/font/google";

// ---------- Fonts ----------
const display = Fraunces({ subsets: ["latin"], weight: ["600", "700"] });
const body = Figtree({ subsets: ["latin"] });

// ---------- Data ----------
// Each category owns one color. That color is reused on the arches,
// product tiles, filter tabs and "shop by need" cards so the page
// feels organised without any extra decoration.
type CategoryKey = "coffee" | "skincare" | "spices" | "perfumes" | "beds";

const categories: Record<
  CategoryKey,
  { label: string; tagline: string; emoji: string; dark: string; light: string }
> = {
  coffee:   { label: "Coffee",           tagline: "Fresh ground powder",  emoji: "☕", dark: "#5A3420", light: "#F0E2D6" },
  skincare: { label: "Coffee Skincare",  tagline: "Soap & face wash",     emoji: "🧼", dark: "#41633F", light: "#E2EDDF" },
  spices:   { label: "Spices",           tagline: "Export quality",       emoji: "🌶️", dark: "#B36B00", light: "#FBEDC8" },
  perfumes: { label: "Perfumes",         tagline: "Imported fragrances",  emoji: "🌹", dark: "#7B3F6B", light: "#F3E1EE" },
  beds:     { label: "Imported Beds",    tagline: "Sleep in luxury",      emoji: "🛏️", dark: "#34517A", light: "#E0E9F5" },
};

const categoryKeys = Object.keys(categories) as CategoryKey[];

type Product = {
  name: string;
  detail: string;
  price: number;
  oldPrice?: number;
  category: CategoryKey;
  badge?: string;
};

const products: Product[] = [
  { name: "Filter Coffee Powder 250g", detail: "Medium roast, strong aroma",  price: 349,   oldPrice: 399,   category: "coffee",   badge: "Bestseller" },
  { name: "Instant Coffee Jar 100g",   detail: "Pure, no chicory",            price: 299,                    category: "coffee" },
  { name: "Coffee Soap Bar",           detail: "Scrubs and brightens",        price: 199,                    category: "skincare", badge: "Top seller" },
  { name: "Coffee Face Wash 100ml",    detail: "Deep clean, less oil",        price: 349,   oldPrice: 399,   category: "skincare" },
  { name: "Whole Black Pepper 100g",   detail: "Bold and sharp",              price: 299,                    category: "spices" },
  { name: "Green Cardamom 50g",        detail: "Large, fragrant pods",        price: 449,   oldPrice: 520,   category: "spices",   badge: "Export grade" },
  { name: "Oud Noir 50ml",             detail: "Warm, woody, long lasting",   price: 1999,                   category: "perfumes", badge: "Imported" },
  { name: "Rose Mist 50ml",            detail: "Light and floral",            price: 1799,  oldPrice: 2199,  category: "perfumes" },
  { name: "Cotton Bedsheet Set",       detail: "King size, 400 thread count", price: 2499,                   category: "beds" },
  { name: "Memory Foam Mattress",      detail: "Queen size, medium firm",     price: 14999, oldPrice: 17999, category: "beds",     badge: "Imported" },
];

const needs = [
  { title: "Need a morning boost?",  link: "Shop coffee",     category: "coffee" as CategoryKey },
  { title: "Want clearer skin?",     link: "Shop skincare",   category: "skincare" as CategoryKey },
  { title: "Cooking something big?", link: "Shop spices",     category: "spices" as CategoryKey },
  { title: "Looking for a signature scent?", link: "Shop perfumes", category: "perfumes" as CategoryKey },
  { title: "Sleeping badly?",        link: "Shop beds",       category: "beds" as CategoryKey },
];

const promises = [
  { title: "Pure ingredients",   text: "No fillers, no added chicory, no artificial colour." },
  { title: "Imported and checked", text: "Every perfume and bed is inspected before it ships." },
  { title: "Export quality",     text: "Our spices meet the standard we ship overseas." },
  { title: "Fast delivery",      text: "Free shipping on prepaid orders above ₹999." },
];

const reviews = [
  { name: "Anjali", role: "Kochi",     text: "The coffee soap left my skin smooth, and the smell is wonderful." },
  { name: "Rahul",  role: "Bengaluru", text: "The cardamom is the freshest I have bought. One pod fills the kitchen." },
  { name: "Meera",  role: "Chennai",   text: "The mattress arrived well packed, and I slept better the first night." },
];

const strip = ["Free shipping above ₹999", "Pure and fresh", "Export quality spices", "Imported perfumes", "Easy returns"];

// ---------- Small helpers ----------
function formatPrice(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Swap the emoji for <Image src="/images/..." /> when you have real photos.
function ProductImage({ category, size = "h-48" }: { category: CategoryKey; size?: string }) {
  const { light, emoji } = categories[category];
  return (
    <div
      className={`${size} flex items-center justify-center rounded-2xl text-6xl`}
      style={{ backgroundColor: light }}
    >
      {emoji}
    </div>
  );
}

// ---------- Sections ----------
function AnnouncementBar() {
  return (
    <div className="bg-[#2B1810] py-2 text-center text-sm text-white">
      Free shipping on prepaid orders above ₹999
    </div>
  );
}

// Hero: headline plus five tall arches. The arches are the category menu.
function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 text-center">
      <h1 className={`${display.className} mx-auto max-w-3xl text-4xl leading-tight text-[#2B1810] md:text-6xl`}>
        Coffee, spices, scents and sleep, brought home from around the world.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-600">
        Pick a door to start shopping.
      </p>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
        {categoryKeys.map((key, index) => {
          const category = categories[key];
          return (
            <a
              key={key}
              href="#best-sellers"
              className={`group flex flex-col items-center justify-end rounded-t-full px-4 pb-6 pt-16 transition-transform hover:-translate-y-2 ${
                index % 2 === 1 ? "md:mt-8" : ""
              }`}
              style={{ backgroundColor: category.light }}
            >
              <span className="text-5xl">{category.emoji}</span>
              <span className="mt-4 font-semibold" style={{ color: category.dark }}>
                {category.label}
              </span>
              <span className="text-sm text-neutral-600">{category.tagline}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ValueStrip() {
  return (
    <div className="bg-[#2B1810] py-4">
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-2 px-6 text-sm text-white/90">
        {strip.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { dark } = categories[product.category];
  return (
    <article className="flex flex-col">
      <div className="relative">
        <ProductImage category={product.category} />
        {product.badge && (
          <span
            className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: dark }}
          >
            {product.badge}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-semibold text-[#2B1810]">{product.name}</h3>
      <p className="text-sm text-neutral-500">{product.detail}</p>
      <p className="mt-1">
        <span className="font-semibold">{formatPrice(product.price)}</span>
        {product.oldPrice && (
          <span className="ml-2 text-sm text-neutral-400 line-through">{formatPrice(product.oldPrice)}</span>
        )}
      </p>
      <button
        className="mt-3 rounded-full border-2 py-2 text-sm font-semibold transition-colors hover:text-white"
        style={{ borderColor: dark, color: dark }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = dark)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        Add to cart
      </button>
    </article>
  );
}

function BestSellers() {
  const [activeTab, setActiveTab] = useState<CategoryKey | "all">("all");

  const visibleProducts =
    activeTab === "all" ? products : products.filter((product) => product.category === activeTab);

  return (
    <section id="best-sellers" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className={`${display.className} text-3xl text-[#2B1810]`}>Best sellers</h2>

      {/* Filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            activeTab === "all" ? "bg-[#2B1810] text-white" : "bg-neutral-100 text-neutral-700"
          }`}
        >
          All
        </button>
        {categoryKeys.map((key) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="rounded-full px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: isActive ? categories[key].dark : categories[key].light,
                color: isActive ? "white" : categories[key].dark,
              }}
            >
              {categories[key].label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

// "Shop by need" replaces deyga's "Shop by concern".
function ShopByNeed() {
  return (
    <section className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className={`${display.className} text-3xl text-[#2B1810]`}>What do you need today?</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {needs.map((need) => {
            const { dark, light } = categories[need.category];
            return (
              <a
                key={need.title}
                href="#best-sellers"
                className="flex min-h-40 flex-col justify-between rounded-2xl p-5"
                style={{ backgroundColor: light }}
              >
                <span className={`${display.className} text-xl`} style={{ color: dark }}>
                  {need.title}
                </span>
                <span className="text-sm font-semibold" style={{ color: dark }}>
                  {need.link}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
      <div className="flex h-72 items-center justify-center rounded-3xl bg-[#F0E2D6] text-8xl">
        🌍
      </div>
      <div>
        <p className={`${display.className} text-2xl leading-snug text-[#2B1810] md:text-3xl`}>
          We started by importing good things we could not find at home. Now we share them with you.
        </p>
        <p className="mt-4 text-neutral-600">
          Everything we sell is something we would use in our own home, from the morning coffee to the bed you
          sleep in.
        </p>
      </div>
    </section>
  );
}

function Promises() {
  return (
    <section className="bg-[#2B1810] py-16 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className={`${display.className} text-3xl`}>Why shop with us</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-4">
          {promises.map((promise) => (
            <div key={promise.title}>
              <h3 className="font-semibold">{promise.title}</h3>
              <p className="mt-2 text-sm text-white/70">{promise.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className={`${display.className} text-3xl text-[#2B1810]`}>Loved by our customers</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {reviews.map((review) => (
          <blockquote key={review.name} className="rounded-2xl bg-neutral-50 p-6">
            <p className="text-neutral-700">{review.text}</p>
            <footer className="mt-4 text-sm">
              <span className="font-semibold">{review.name}</span>
              <span className="text-neutral-500">, {review.role}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}



// ---------- Page ----------
export default function HomePage() {
  return (
    <main className={`${body.className} bg-white text-neutral-900`}>
      <AnnouncementBar />
      {/* Put your Navbar component here */}
      <Hero />
      <ValueStrip />
      <BestSellers />
      <ShopByNeed />
      <Story />
      <Promises />
      <Reviews />
      
    </main>
  );
}