
"use client";

import { useState } from "react";
import { Fraunces, Figtree } from "next/font/google";

// ---------- Fonts ----------
const display = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const body = Figtree({ subsets: ["latin"] });

// ---------- Categories ----------
type CategoryKey =
  | "coffee"
  | "skincare"
  | "spices"
  | "perfumes"
  | "beds";

type Category = {
  label: string;
  tagline: string;
  dark: string;
  light: string;
  image: string;
};

const categories: Record<CategoryKey, Category> = {
  coffee: {
    label: "Coffee",
    tagline: "Fresh ground powder",
    dark: "#5A3420",
    light: "#F0E2D6",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=85",
  },
  skincare: {
    label: "Coffee Skincare",
    tagline: "Soap & face wash",
    dark: "#41633F",
    light: "#E2EDDF",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85",
  },
  spices: {
    label: "Spices",
    tagline: "Export quality",
    dark: "#B36B00",
    light: "#FBEDC8",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=85",
  },
  perfumes: {
    label: "Perfumes",
    tagline: "Imported fragrances",
    dark: "#7B3F6B",
    light: "#F3E1EE",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=85",
  },
  beds: {
    label: "Imported Beds",
    tagline: "Sleep in luxury",
    dark: "#34517A",
    light: "#E0E9F5",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=85",
  },
};

const categoryKeys = Object.keys(categories) as CategoryKey[];

// ---------- Products ----------
type Product = {
  name: string;
  detail: string;
  price: number;
  oldPrice?: number;
  category: CategoryKey;
  image: string;
  badge?: string;
};

const products: Product[] = [
  {
    name: "Filter Coffee Powder 250g",
    detail: "Medium roast, strong aroma",
    price: 349,
    oldPrice: 399,
    category: "coffee",
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Instant Coffee Jar 100g",
    detail: "Pure, no chicory",
    price: 299,
    category: "coffee",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Coffee Soap Bar",
    detail: "Coffee-inspired skincare",
    price: 199,
    category: "skincare",
    badge: "Top seller",
    image:
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Coffee Face Wash 100ml",
    detail: "Daily cleansing care",
    price: 349,
    oldPrice: 399,
    category: "skincare",
    image:
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Whole Black Pepper 100g",
    detail: "Bold and aromatic",
    price: 299,
    category: "spices",
    image:
      "https://images.unsplash.com/photo-1599909533609-3c7f2b6e6f4a?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Green Cardamom 50g",
    detail: "Fragrant green pods",
    price: 449,
    oldPrice: 520,
    category: "spices",
    badge: "Export grade",
    image:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f3?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Oud Noir 50ml",
    detail: "Warm, woody fragrance",
    price: 1999,
    category: "perfumes",
    badge: "Imported",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Rose Mist 50ml",
    detail: "Light and floral",
    price: 1799,
    oldPrice: 2199,
    category: "perfumes",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Cotton Bedsheet Set",
    detail: "King size, soft cotton",
    price: 2499,
    category: "beds",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Memory Foam Mattress",
    detail: "Queen size, medium firm",
    price: 14999,
    oldPrice: 17999,
    category: "beds",
    badge: "Imported",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=85",
  },
];

const needs = [
  {
    title: "Need a morning boost?",
    link: "Shop coffee",
    category: "coffee" as CategoryKey,
  },
  {
    title: "Want clearer skin?",
    link: "Shop skincare",
    category: "skincare" as CategoryKey,
  },
  {
    title: "Cooking something big?",
    link: "Shop spices",
    category: "spices" as CategoryKey,
  },
  {
    title: "Looking for a signature scent?",
    link: "Shop perfumes",
    category: "perfumes" as CategoryKey,
  },
  {
    title: "Sleeping badly?",
    link: "Shop beds",
    category: "beds" as CategoryKey,
  },
];

const promises = [
  {
    title: "Pure ingredients",
    text: "Carefully selected products for your everyday needs.",
  },
  {
    title: "Imported and checked",
    text: "Quality checks for our imported products.",
  },
  {
    title: "Export quality",
    text: "Aromatic spices selected for quality and freshness.",
  },
  {
    title: "Fast delivery",
    text: "Free shipping on prepaid orders above ₹999.",
  },
];

const reviews = [
  {
    name: "Anjali",
    role: "Kochi",
    text: "The coffee soap left my skin smooth, and the smell is wonderful.",
  },
  {
    name: "Rahul",
    role: "Bengaluru",
    text: "The cardamom is the freshest I have bought. One pod fills the kitchen.",
  },
  {
    name: "Meera",
    role: "Chennai",
    text: "The mattress arrived well packed, and I slept better the first night.",
  },
];

const strip = [
  "Free shipping above ₹999",
  "Pure and fresh",
  "Export quality spices",
  "Imported perfumes",
  "Easy returns",
];

// ---------- Helpers ----------
function formatPrice(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

// ---------- Announcement ----------
function AnnouncementBar() {
  return (
    <div className="bg-[#2B1810] px-4 py-2 text-center text-sm text-white">
      Free shipping on prepaid orders above ₹999
    </div>
  );
}

// ---------- Hero with Image Arches ----------
function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-12 text-center sm:px-6 md:pt-14">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#8A6045]">
        Welcome to Imaan&apos;s Store
      </p>

      <h1
        className={`${display.className} mx-auto max-w-3xl text-4xl leading-tight text-[#2B1810] sm:text-5xl md:text-6xl`}
      >
        Coffee, spices, scents and sleep, brought home from around the world.
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-base text-neutral-600 sm:text-lg">
        Explore everyday essentials and little luxuries for your home.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:gap-5 md:grid-cols-5">
        {categoryKeys.map((key, index) => {
          const category = categories[key];

          return (
            <a
              key={key}
              href="#best-sellers"
              className={`group overflow-hidden rounded-t-full pb-5 transition-transform duration-300 hover:-translate-y-2 ${
                index === 4 ? "col-span-2 mx-auto w-1/2 md:col-span-1 md:w-full" : ""
              }`}
              style={{ backgroundColor: category.light }}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-t-full">
                <img
                  src={category.image}
                  alt={category.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="px-2 pt-4">
                <h2
                  className="font-semibold"
                  style={{ color: category.dark }}
                >
                  {category.label}
                </h2>
                <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                  {category.tagline}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Value Strip ----------
function ValueStrip() {
  return (
    <div className="bg-[#2B1810] py-4">
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-3 px-5 text-center text-xs text-white/90 sm:px-6 sm:text-sm md:gap-x-10">
        {strip.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Product Image ----------
function ProductImage({ product }: { product: Product }) {
  const { light } = categories[product.category];

  return (
    <div
      className="aspect-[4/5] overflow-hidden rounded-2xl"
      style={{ backgroundColor: light }}
    >
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}

// ---------- Product Card ----------
function ProductCard({ product }: { product: Product }) {
  const { dark } = categories[product.category];

  return (
    <article className="flex min-w-0 flex-col">
      <div className="relative">
        <ProductImage product={product} />

        {product.badge && (
          <span
            className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white sm:left-3 sm:top-3 sm:px-3 sm:text-xs"
            style={{ backgroundColor: dark }}
          >
            {product.badge}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-sm font-semibold text-[#2B1810] sm:text-base">
        {product.name}
      </h3>

      <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
        {product.detail}
      </p>

      <p className="mt-2">
        <span className="font-semibold">
          {formatPrice(product.price)}
        </span>

        {product.oldPrice && (
          <span className="ml-2 text-xs text-neutral-400 line-through sm:text-sm">
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </p>

      <button
        type="button"
        className="mt-3 rounded-full border-2 px-2 py-2 text-xs font-semibold transition-colors hover:text-white sm:text-sm"
        style={{ borderColor: dark, color: dark }}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = dark;
          event.currentTarget.style.color = "#FFFFFF";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = "transparent";
          event.currentTarget.style.color = dark;
        }}
        onFocus={(event) => {
          event.currentTarget.style.backgroundColor = dark;
          event.currentTarget.style.color = "#FFFFFF";
        }}
        onBlur={(event) => {
          event.currentTarget.style.backgroundColor = "transparent";
          event.currentTarget.style.color = dark;
        }}
      >
        Add to cart
      </button>
    </article>
  );
}

// ---------- Best Sellers ----------
function BestSellers() {
  const [activeTab, setActiveTab] = useState<CategoryKey | "all">("all");

  const visibleProducts =
    activeTab === "all"
      ? products
      : products.filter((product) => product.category === activeTab);

  return (
    <section
      id="best-sellers"
      className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A6045]">
            Customer favourites
          </p>
          <h2
            className={`${display.className} mt-2 text-3xl text-[#2B1810] sm:text-4xl`}
          >
            Best sellers
          </h2>
        </div>

        <p className="text-sm text-neutral-500">
          Find something you will love.
        </p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
            activeTab === "all"
              ? "bg-[#2B1810] text-white"
              : "bg-neutral-100 text-neutral-700"
          }`}
        >
          All
        </button>

        {categoryKeys.map((key) => {
          const isActive = activeTab === key;

          return (
            <button
              type="button"
              key={key}
              onClick={() => setActiveTab(key)}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: isActive
                  ? categories[key].dark
                  : categories[key].light,
                color: isActive ? "#FFFFFF" : categories[key].dark,
              }}
            >
              {categories[key].label}
            </button>
          );
        })}
      </div>

      <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

// ---------- Shop by Need ----------
function ShopByNeed() {
  return (
    <section className="bg-neutral-50 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <h2
          className={`${display.className} text-3xl text-[#2B1810] sm:text-4xl`}
        >
          What do you need today?
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {needs.map((need) => {
            const { dark, light } = categories[need.category];

            return (
              <a
                key={need.title}
                href="#best-sellers"
                onClick={() => {
                  // The matching category can also be selected
                  // directly in BestSellers if shared state is added.
                }}
                className="flex min-h-36 flex-col justify-between rounded-2xl p-4 transition-transform hover:-translate-y-1 sm:min-h-40 sm:p-5"
                style={{ backgroundColor: light }}
              >
                <span
                  className={`${display.className} text-lg sm:text-xl`}
                  style={{ color: dark }}
                >
                  {need.title}
                </span>

                <span
                  className="mt-5 text-sm font-semibold"
                  style={{ color: dark }}
                >
                  {need.link} →
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- Our Story ----------
function Story() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 sm:px-6 sm:py-20 md:grid-cols-2 md:gap-12">
      <div className="h-64 overflow-hidden rounded-3xl sm:h-80">
        <img
          src="https://img.magnific.com/free-photo/people-coffee-shop_53876-47028.jpg?semt=ais_hybrid&w=740&q=80"
          alt="A thoughtfully arranged retail store"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A6045]">
          Our story
        </p>

        <h2
          className={`${display.className} mt-3 text-2xl leading-snug text-[#2B1810] sm:text-3xl`}
        >
          Good things from around the world, brought closer to home.
        </h2>

        <p className="mt-4 leading-7 text-neutral-600">
          Everything we sell is selected with everyday living in mind,
          from your morning coffee and favourite spices to fragrances
          and comfortable bedroom essentials.
        </p>
      </div>
    </section>
  );
}

// ---------- Promises ----------
function Promises() {
  return (
    <section className="bg-[#2B1810] py-14 text-white sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <h2 className={`${display.className} text-3xl sm:text-4xl`}>
          Why shop with us
        </h2>

        <div className="mt-8 grid gap-7 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {promises.map((promise) => (
            <div key={promise.title}>
              <h3 className="font-semibold">{promise.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {promise.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Customer Reviews ----------
function Reviews() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
      <h2
        className={`${display.className} text-3xl text-[#2B1810] sm:text-4xl`}
      >
        Loved by our customers
      </h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {reviews.map((review) => (
          <blockquote
            key={review.name}
            className="rounded-2xl bg-neutral-50 p-5 sm:p-6"
          >
            <p className="leading-7 text-neutral-700">
              &ldquo;{review.text}&rdquo;
            </p>

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

// ---------- Homepage ----------
export default function HomePage() {
  return (
    <main className={`${body.className} bg-white text-neutral-900`}>
      <AnnouncementBar />
      {/* Add your Navbar component here */}
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
