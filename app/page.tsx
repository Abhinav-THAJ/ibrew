"use client";

import { useState } from "react";
import { Fraunces, Figtree } from "next/font/google";
import { useCart } from "@/components/CartContext";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const body = Figtree({
  subsets: ["latin"],
});

type CategoryKey = "coffee" | "skincare" | "spices" | "perfumes" | "beds";

const categories: Record<
  CategoryKey,
  {
    label: string;
    tagline: string;
    emoji: string;
    dark: string;
    light: string;
  }
> = {
  coffee: {
    label: "Coffee",
    tagline: "Fresh ground powder",
    emoji: "☕",
    dark: "#5A3420",
    light: "#F0E2D6",
  },
  skincare: {
    label: "Coffee Skincare",
    tagline: "Soap & face wash",
    emoji: "🧼",
    dark: "#41633F",
    light: "#E2EDDF",
  },
  spices: {
    label: "Spices",
    tagline: "Export quality",
    emoji: "🌶️",
    dark: "#B36B00",
    light: "#FBEDC8",
  },
  perfumes: {
    label: "Perfumes",
    tagline: "Imported fragrances",
    emoji: "🌹",
    dark: "#7B3F6B",
    light: "#F3E1EE",
  },
  beds: {
    label: "Imported Beds",
    tagline: "Sleep in luxury",
    emoji: "🛏️",
    dark: "#34517A",
    light: "#E0E9F5",
  },
};

const categoryKeys = Object.keys(categories) as CategoryKey[];

type Product = {
  id: number;
  name: string;
  detail: string;
  price: number;
  oldPrice?: number;
  category: CategoryKey;
  image: string;
  badge?: string;
  href: string;
};

const products: Product[] = [
  {
    id: 201,
    name: "Filter Coffee Powder 250g",
    detail: "Medium roast, strong aroma",
    price: 349,
    oldPrice: 399,
    category: "coffee",
    image: "/images/coffee/filter-coffee.webp",
    badge: "Bestseller",
    href: "/coffee",
  },
  {
    id: 202,
    name: "Instant Coffee Jar 100g",
    detail: "Rich flavour for every morning",
    price: 299,
    category: "coffee",
    image: "/images/coffee/instant-coffee.webp",
    href: "/coffee",
  },
  {
    id: 203,
    name: "Coffee Soap Bar",
    detail: "Coffee-inspired cleansing care",
    price: 199,
    category: "skincare",
    image: "/images/coffee/coffee-soap.webp",
    badge: "Top Seller",
    href: "/coffee",
  },
  {
    id: 204,
    name: "Coffee Face Wash 100ml",
    detail: "A refreshing daily skincare routine",
    price: 349,
    oldPrice: 399,
    category: "skincare",
    image: "/images/coffee/coffee-facewash.webp",
    href: "/coffee",
  },
  {
    id: 205,
    name: "Whole Black Pepper 100g",
    detail: "Bold aroma and sharp flavour",
    price: 299,
    category: "spices",
    image: "/images/spices/black-pepper.webp",
    href: "/spices",
  },
  {
    id: 206,
    name: "Green Cardamom 50g",
    detail: "Fragrant pods for premium cooking",
    price: 449,
    oldPrice: 520,
    category: "spices",
    image: "/images/spices/green-cardamom.webp",
    badge: "Export Grade",
    href: "/spices",
  },
  {
    id: 207,
    name: "Oud Noir 50ml",
    detail: "Warm, woody, long-lasting fragrance",
    price: 1999,
    category: "perfumes",
    image: "/images/perfumeoil/oud-noir.webp",
    badge: "Imported",
    href: "/perfumeoil",
  },
  {
    id: 208,
    name: "Rose Mist 50ml",
    detail: "A delicate floral fragrance",
    price: 1799,
    oldPrice: 2199,
    category: "perfumes",
    image: "/images/perfumeoil/rose-mist.webp",
    href: "/perfumeoil",
  },
  {
    id: 209,
    name: "Cotton Bedsheet Set",
    detail: "King size, soft and comfortable",
    price: 2499,
    category: "beds",
    image: "/images/importedbed/cotton-bedsheet.webp",
    href: "/importedbed",
  },
  {
    id: 210,
    name: "Memory Foam Mattress",
    detail: "Queen size, medium firm",
    price: 14999,
    oldPrice: 17999,
    category: "beds",
    image: "/images/importedbed/memory-foam-mattress.webp",
    badge: "Featured",
    href: "/importedbed",
  },
];

const needs = [
  {
    title: "Need a morning boost?",
    link: "Shop coffee",
    category: "coffee" as CategoryKey,
    href: "/coffee",
  },
  {
    title: "Want clearer skin?",
    link: "Shop skincare",
    category: "skincare" as CategoryKey,
    href: "/coffee",
  },
  {
    title: "Cooking something big?",
    link: "Shop spices",
    category: "spices" as CategoryKey,
    href: "/spices",
  },
  {
    title: "Looking for a signature scent?",
    link: "Shop perfumes",
    category: "perfumes" as CategoryKey,
    href: "/perfumeoil",
  },
  {
    title: "Ready for better sleep?",
    link: "Shop beds",
    category: "beds" as CategoryKey,
    href: "/importedbed",
  },
];

const promises = [
  {
    title: "Quality you can trust",
    text: "Thoughtfully selected products for everyday living.",
  },
  {
    title: "Imported and checked",
    text: "Our imported collections are selected with care.",
  },
  {
    title: "Quality spices",
    text: "Bring rich aromas and flavours into your kitchen.",
  },
  {
    title: "Convenient shopping",
    text: "Browse our collections and shop from home.",
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
    text: "The cardamom is wonderfully fragrant and adds great flavour.",
  },
  {
    name: "Meera",
    role: "Chennai",
    text: "The mattress arrived well packed and feels comfortable.",
  },
];

const strip = [
  "Quality products",
  "Fresh coffee",
  "Quality spices",
  "Imported perfumes",
  "Shop with ease",
];

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function AnnouncementBar() {
  return (
    <div className="bg-[#2B1810] px-3 py-2.5 text-center text-[11px] leading-4 text-white sm:text-sm">
      Discover something special at Imaan&apos;s Store
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-9 pt-10 text-center sm:px-6 sm:pb-14 sm:pt-14 lg:px-8 lg:pb-16 lg:pt-16">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B654B] sm:mb-4 sm:text-sm sm:tracking-[0.25em]">
        Welcome to Imaan&apos;s Store
      </p>

      <h1
        className={`${display.className} mx-auto max-w-4xl text-[2rem] leading-[1.16] tracking-tight text-[#2B1810] min-[400px]:text-4xl sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl`}
      >
        Coffee, spices, scents and sleep, brought home from around the world.
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-600 sm:mt-5 sm:text-lg sm:leading-7">
        Discover everyday essentials and thoughtful finds for your home,
        your routine and your lifestyle.
      </p>

      <a
        href="#best-sellers"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#2B1810] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#62402E] sm:mt-7 sm:px-7"
      >
        Explore our collection
      </a>

      <div className="mt-9 grid grid-cols-2 gap-3 min-[400px]:gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
        {categoryKeys.map((key, index) => {
          const category = categories[key];
          const href =
            key === "coffee" || key === "skincare"
              ? "/coffee"
              : key === "spices"
                ? "/spices"
                : key === "perfumes"
                  ? "/perfumeoil"
                  : "/importedbed";

          return (
            <a
              key={key}
              href={href}
              className={`group flex min-w-0 min-h-[190px] flex-col items-center justify-end overflow-hidden rounded-t-[75px] rounded-b-2xl px-2 pb-4 pt-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg min-[400px]:min-h-[210px] sm:min-h-[250px] sm:rounded-t-[100px] sm:px-3 sm:pb-6 sm:pt-10 lg:min-h-[290px] ${
                index === 1 || index === 3 ? "lg:mt-8" : ""
              }`}
              style={{ backgroundColor: category.light }}
            >
              <span className="text-3xl transition-transform duration-300 group-hover:scale-110 min-[400px]:text-4xl sm:text-5xl">
                {category.emoji}
              </span>

              <span
                className="mt-3 text-center text-xs font-bold leading-5 min-[400px]:text-sm sm:mt-4 sm:text-base"
                style={{ color: category.dark }}
              >
                {category.label}
              </span>

              <span className="mt-1 text-center text-[10px] leading-4 text-neutral-600 min-[400px]:text-xs sm:text-sm">
                {category.tagline}
              </span>

              <span
                className="mt-3 text-[10px] font-semibold sm:mt-4 sm:text-xs"
                style={{ color: category.dark }}
              >
                Explore →
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ValueStrip() {
  return (
    <div className="bg-[#2B1810] px-3 py-3 sm:py-4">
      <ul className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-4 gap-y-2 text-center text-[10px] text-white/90 min-[400px]:gap-x-5 sm:gap-x-10 sm:gap-y-3 sm:px-6 sm:text-sm lg:px-8">
        {strip.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const category = categories[product.category];
  const { dark, light, label } = category;

  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group flex min-w-0 flex-col">
      <a
        href={product.href}
        aria-label={`View ${product.name}`}
        className="relative block overflow-hidden rounded-t-[65px] rounded-b-xl bg-[#F5F0E8] min-[400px]:rounded-t-[75px] sm:rounded-t-[100px] sm:rounded-b-2xl"
      >
        <div className="aspect-[3/4] w-full sm:aspect-[4/5]">
          {!imageError ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-2"
              style={{ backgroundColor: light }}
            >
              <span className="text-4xl sm:text-5xl">
                {category.emoji}
              </span>
              <span
                className="px-2 text-center text-[10px] font-medium sm:text-xs"
                style={{ color: dark }}
              >
                Add product image
              </span>
            </div>
          )}
        </div>

        {product.badge && (
          <span
            className="absolute left-2 top-3 max-w-[calc(100%-1rem)] rounded-full px-2 py-1 text-[9px] font-semibold text-white min-[400px]:left-3 sm:top-4 sm:px-3 sm:text-xs"
            style={{ backgroundColor: dark }}
          >
            {product.badge}
          </span>
        )}
      </a>

      <p
        className="mt-2 text-[9px] font-semibold uppercase tracking-wider sm:mt-3 sm:text-xs"
        style={{ color: dark }}
      >
        {label}
      </p>

      <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-[1.4] text-[#2B1810] min-[400px]:text-sm sm:text-base sm:leading-6">
        {product.name}
      </h3>

      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-neutral-500 min-[400px]:text-xs sm:text-sm sm:leading-5">
        {product.detail}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <span className="text-xs font-bold text-[#2B1810] min-[400px]:text-sm sm:text-base">
          {formatPrice(product.price)}
        </span>

        {product.oldPrice && (
          <span className="text-[10px] text-neutral-400 line-through min-[400px]:text-xs sm:text-sm">
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          })
        }
        className="mt-3 flex min-h-10 w-full items-center justify-center rounded-full border px-2 py-2 text-[10px] font-semibold transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-[#8B654B] focus:ring-offset-2 min-[400px]:text-xs sm:mt-4 sm:min-h-11 sm:border-2 sm:text-sm"
        style={{
          borderColor: dark,
          color: dark,
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = dark;
          event.currentTarget.style.color = "#FFFFFF";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = "transparent";
          event.currentTarget.style.color = dark;
        }}
      >
        Add to Cart
      </button>
    </article>
  );
}

function BestSellers() {
  const [activeTab, setActiveTab] = useState<CategoryKey | "all">("all");

  const visibleProducts =
    activeTab === "all"
      ? products
      : products.filter((product) => product.category === activeTab);

  return (
    <section
      id="best-sellers"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-10 sm:scroll-mt-24 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B654B] sm:text-xs sm:tracking-[0.2em]">
            Customer favourites
          </p>

          <h2
            className={`${display.className} mt-2 text-3xl tracking-tight text-[#2B1810] sm:text-4xl`}
          >
            Best Sellers
          </h2>
        </div>

        <p className="text-xs text-neutral-500 sm:text-sm">
          Discover something you&apos;ll love
        </p>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2 sm:mt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          aria-pressed={activeTab === "all"}
          className={`min-h-9 shrink-0 rounded-full px-3.5 py-2 text-[11px] font-medium transition sm:min-h-10 sm:px-4 sm:text-sm ${
            activeTab === "all"
              ? "bg-[#2B1810] text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          All Products
        </button>

        {categoryKeys.map((key) => {
          const isActive = activeTab === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              aria-pressed={isActive}
              className="min-h-9 shrink-0 rounded-full px-3.5 py-2 text-[11px] font-medium transition sm:min-h-10 sm:px-4 sm:text-sm"
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

      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7 min-[400px]:gap-x-4 min-[400px]:gap-y-8 sm:mt-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-7">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ShopByNeed() {
  return (
    <section className="bg-[#FAF8F4] py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B654B] sm:text-xs">
          Find your favourites
        </p>

        <h2
          className={`${display.className} mt-2 text-3xl leading-tight text-[#2B1810] sm:text-4xl`}
        >
          What do you need today?
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {needs.map((need, index) => {
            const { dark, light } = categories[need.category];

            return (
              <a
                key={need.title}
                href={need.href}
                className={`flex min-h-[125px] min-w-0 flex-col justify-between rounded-xl p-3.5 transition duration-300 hover:-translate-y-1 hover:shadow-md min-[400px]:p-4 sm:min-h-40 sm:rounded-2xl sm:p-5 ${
                  index === 4 ? "col-span-2 sm:col-span-1" : ""
                }`}
                style={{ backgroundColor: light }}
              >
                <span
                  className={`${display.className} text-base leading-snug min-[400px]:text-lg sm:text-xl`}
                  style={{ color: dark }}
                >
                  {need.title}
                </span>

                <span
                  className="mt-4 text-[11px] font-semibold sm:text-sm"
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

function Story() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-7 px-4 py-10 sm:gap-8 sm:px-6 sm:py-16 md:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
      <div className="overflow-hidden rounded-t-[100px] rounded-b-2xl bg-[#F0E2D6] sm:rounded-t-[150px] sm:rounded-b-3xl">
        <div className="flex aspect-[5/3] items-center justify-center text-6xl sm:aspect-[4/3] sm:text-8xl">
          🌍
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B654B] sm:text-xs sm:tracking-[0.2em]">
          A little about us
        </p>

        <h2
          className={`${display.className} mt-3 text-3xl leading-tight text-[#2B1810] sm:text-4xl`}
        >
          Good things for the little moments that make a home.
        </h2>

        <p className="mt-4 text-sm leading-6 text-neutral-600 sm:mt-5 sm:text-base sm:leading-7">
          From the coffee that starts your morning to the spices that bring
          meals to life, the fragrance you love and the comfort you deserve,
          we bring together a collection for your everyday living.
        </p>

        <a
          href="#best-sellers"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#2B1810] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#62402E] sm:mt-6"
        >
          Discover our products →
        </a>
      </div>
    </section>
  );
}

function Promises() {
  return (
    <section className="bg-[#2B1810] py-10 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E0C4A8] sm:text-xs sm:tracking-[0.2em]">
          The Imaan&apos;s Store difference
        </p>

        <h2 className={`${display.className} mt-2 text-3xl sm:text-4xl`}>
          Why shop with us?
        </h2>

        <div className="mt-7 grid grid-cols-1 gap-6 min-[500px]:grid-cols-2 sm:mt-8 sm:gap-8 lg:grid-cols-4">
          {promises.map((promise, index) => (
            <div
              key={promise.title}
              className="border-l border-white/20 pl-4 sm:pl-5"
            >
              <span className="text-xs text-[#E0C4A8] sm:text-sm">
                0{index + 1}
              </span>

              <h3 className="mt-2 text-sm font-semibold sm:text-base">
                {promise.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/70 sm:text-sm sm:leading-6">
                {promise.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B654B] sm:text-xs sm:tracking-[0.2em]">
        Customer stories
      </p>

      <h2
        className={`${display.className} mt-2 text-3xl text-[#2B1810] sm:text-4xl`}
      >
        Loved by our customers
      </h2>

      <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {reviews.map((review) => (
          <blockquote
            key={review.name}
            className="rounded-xl border border-[#EFE8DF] bg-[#FAF8F4] p-4 sm:rounded-2xl sm:p-6"
          >
            <div
              aria-label="5 out of 5 stars"
              className="text-base tracking-widest text-[#B36B00] sm:text-lg"
            >
              ★★★★★
            </div>

            <p className="mt-3 text-sm leading-6 text-neutral-700">
              &ldquo;{review.text}&rdquo;
            </p>

            <footer className="mt-4 text-xs sm:mt-5 sm:text-sm">
              <span className="font-semibold text-[#2B1810]">
                {review.name}
              </span>

              <span className="text-neutral-500">, {review.role}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main
      className={`${body.className} min-h-screen overflow-x-clip bg-white text-neutral-900`}
    >
      <AnnouncementBar />
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