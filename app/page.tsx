"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Instrument_Serif, Figtree } from "next/font/google";

// ---------- Fonts ----------
const display = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const body = Figtree({ subsets: ["latin"] });

const hideScrollbar = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const INK = "#1F1A17";

// ---------- Data ----------
type CategoryKey = "coffee" | "skincare" | "spices" | "perfumes" | "beds";
type TabKey = CategoryKey | "all";

type Category = {
  label: string;
  tagline: string;
  dark: string;
  light: string;
  image: string;
};

// All images are served from the /public folder.
// "/categories/coffee.jpg" means the file public/categories/coffee.jpg.
// Keep filenames lowercase: Linux servers (Vercel) are case-sensitive.

const categories: Record<CategoryKey, Category> = {
  coffee: {
    label: "Coffee",
    tagline: "Fresh ground powder",
    dark: "#5A3420",
    light: "#F0E2D6",
    image: "images/categories/coffee.jpeg",
  },
  skincare: {
    label: "Coffee skincare",
    tagline: "Soap and face wash",
    dark: "#41633F",
    light: "#E2EDDF",
    image: "images/coffee/coffee-skin.avif",
  },
  spices: {
    label: "Spices",
    tagline: "Export quality",
    dark: "#9A5B00",
    light: "#FBEDC8",
    image: "images/spices/cardamom.avif",
  },
  perfumes: {
    label: "Perfumes",
    tagline: "Imported fragrances",
    dark: "#7B3F6B",
    light: "#F3E1EE",
    image: "images/categories/perfumes.png",
  },
  beds: {
    label: "Imported beds",
    tagline: "Sleep in luxury",
    dark: "#34517A",
    light: "#E0E9F5",
    image: "images/importedbed/double-bed.jpeg",
  },
};

const categoryKeys = Object.keys(categories) as CategoryKey[];

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
  { name: "Filter coffee powder 250g", detail: "Medium roast, strong aroma", price: 349, oldPrice: 399, category: "coffee", badge: "Bestseller", image: "images/brew.jpeg" },
  { name: "Instant coffee jar 100g", detail: "Pure, no chicory", price: 299, category: "coffee", image: "images/brew.jpeg" },
  { name: "Coffee soap bar", detail: "Coffee-inspired skincare", price: 199, category: "skincare", badge: "Top seller", image: "images/skin.jpeg" },
  { name: "Coffee face wash 100ml", detail: "Daily cleansing care", price: 349, oldPrice: 399, category: "skincare", image: "images/skin.jpeg" },
  { name: "Whole black pepper 100g", detail: "Bold and aromatic", price: 299, category: "spices", image: "images/spices/pepper.avif" },
  { name: "Green cardamom 50g", detail: "Fragrant green pods", price: 449, oldPrice: 520, category: "spices", badge: "Export grade", image: "images/spices/cardamom.avif" },
  { name: "Oud Noir 50ml", detail: "Warm, woody fragrance", price: 1999, category: "perfumes", badge: "Imported", image: "images/Elegant Bottle Display.png" },
  { name: "Rose Mist 50ml", detail: "Light and floral", price: 1799, oldPrice: 2199, category: "perfumes", image: "images/rosemist.jpg" },
  { name: "Cotton bedsheet set", detail: "King size, soft cotton", price: 2499, category: "beds", image: "images/sheet.jpg" },
  { name: "Memory foam mattress", detail: "Queen size, medium firm", price: 14999, oldPrice: 17999, category: "beds", badge: "Imported", image: "images/importedbed/double-bed.jpeg" },
];

const promises = [
  { title: "Pure ingredients", text: "Carefully selected products for everyday needs." },
  { title: "Imported and checked", text: "Quality checks on every imported product." },
  { title: "Export quality", text: "Spices chosen for freshness and aroma." },
  { title: "Fast delivery", text: "Free shipping on prepaid orders above ₹999." },
];

const reviews = [
  { name: "Anjali", role: "Kochi", text: "The coffee soap left my skin smooth, and the smell is wonderful." },
  { name: "Rahul", role: "Bengaluru", text: "The freshest cardamom I have bought. One pod fills the kitchen." },
  { name: "Meera", role: "Chennai", text: "The mattress arrived well packed, and I slept better the first night." },
];

function formatPrice(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

// ---------- Image with a safe fallback ----------
// If a photo fails to load, the coloured box behind it shows instead of a broken icon.
function Img({
  src,
  alt,
  className,
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) return <>{fallback ?? null}</>;
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

// ---------- Announcement ----------
function AnnouncementBar() {
  return (
    <div
      className="px-4 py-2 text-center text-xs text-white sm:text-sm"
      style={{ backgroundColor: INK }}
    >
      Free shipping on prepaid orders above ₹999
    </div>
  );
}

// ---------- Hero ----------
// Full-width background carousel. Photos crossfade behind the text.
// Each slide has two images: a wide one for laptops (about 2400x1000)
// and a tall one for phones (about 900x1200).
// Files live in public/hero/, for example public/hero/coffee-desktop.jpg.
const heroSlides: {
  key: CategoryKey;
  alt: string;
  desktop: string;
  mobile: string;
}[] = [
  {
    key: "coffee",
    alt: "Fresh coffee",
    desktop: "images/coffebags.png",
    mobile: "images/coffebags.png",
  },
  {
    key: "spices",
    alt: "Spices",
    desktop: "images/spices/banner.avif",
    mobile: "images/spices/banner.avif",
  },
  {
    key: "perfumes",
    alt: "Perfume bottles",
    desktop: "images/Elegant Bottle Display.png",
    mobile: "images/Elegant Bottle Display.png",
  },
  {
    key: "beds",
    alt: "A made bed",
    desktop: "images/importedbed/banner.avif",
    mobile: "images/importedbed/banner.avif",
  },
  {
    key: "skincare",
    alt: "Coffee soap",
    desktop: "images/coffee/coffee-soap.avif",
    mobile: "images/coffee/coffee-soap.avif",
  },
];

function HeroPhoto({
  slide,
  priority,
}: {
  slide: (typeof heroSlides)[number];
  priority: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={slide.desktop} />
      <img
        src={slide.mobile}
        alt={slide.alt}
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-center"
      />
    </picture>
  );
}

function Hero({ onPick }: { onPick: (tab: TabKey) => void }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % heroSlides.length),
      3000
    );
    return () => clearInterval(id);
  }, [paused]);

  const current = categories[heroSlides[index].key];

  return (
    <section className="relative w-full">
      <div
        className="relative h-[520px] w-full overflow-hidden sm:h-[440px] lg:h-[560px]"
        style={{ backgroundColor: INK }}
        // onMouseEnter={() => setPaused(true)}
        // onMouseLeave={() => setPaused(false)}
        // onTouchStart={() => setPaused(true)}
        // onTouchEnd={() => setPaused(false)}
      >
        {/* Background slides */}
        {heroSlides.map((slide, i) => (
          <div
            key={slide.key}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundColor: categories[slide.key].dark }}
          >
            <HeroPhoto slide={slide} priority={i === 0} />
          </div>
        ))}

        {/* Dark gradient so the text stays readable on any photo */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(31,26,23,0.85) 0%, rgba(31,26,23,0.45) 45%, rgba(31,26,23,0.1) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(31,26,23,0.75) 0%, rgba(31,26,23,0.45) 35%, rgba(31,26,23,0.05) 65%, rgba(31,26,23,0) 100%), linear-gradient(to top, rgba(31,26,23,0.45) 0%, rgba(31,26,23,0) 30%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-8 sm:px-6 sm:pb-12">
          <p className="text-sm font-medium text-white/80">
            Welcome to Imaan&apos;s Store
          </p>

          <h1
            className={`${display.className} mt-2 max-w-2xl text-[34px] leading-[1.05] text-white sm:text-5xl lg:text-6xl`}
          >
            Everyday luxuries, brought home from around the world.
          </h1>

          <p className="mt-3 max-w-md text-[15px] leading-6 text-white/85 sm:text-base">
            Coffee, spices, imported perfumes and mattresses, chosen with care
            for your home.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
            <a
              href="#shop"
              className="inline-flex h-11 items-center rounded-full bg-white px-7 text-sm font-semibold active:scale-95"
              style={{ color: INK }}
            >
              Shop best sellers
            </a>
            <a
              href="#categories"
              className="inline-flex h-11 items-center rounded-full border border-white/70 px-6 text-sm font-semibold text-white active:scale-95"
            >
              Browse categories
            </a>
          </div>

          {/* Slide controls: dots on the left, current category on the right */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {heroSlides.map((slide, i) => (
                <button
                  key={slide.key}
                  type="button"
                  aria-label={`Show ${categories[slide.key].label}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className="flex h-6 items-center"
                >
                  <span
                    className={`block h-1.5 rounded-full bg-white transition-all duration-300 ${
                      i === index ? "w-8 opacity-100" : "w-1.5 opacity-50"
                    }`}
                  />
                </button>
              ))}
            </div>

            <a
              href="#shop"
              onClick={() => onPick(heroSlides[index].key)}
              className="rounded-full bg-white/15 px-4 py-2 text-xs font-medium text-white backdrop-blur hover:bg-white/25 sm:text-sm"
            >
              {current.label}: {current.tagline}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Category rail ----------
// Small round photos. Swipe on phones, spread evenly on larger screens.
function CategoryRail({ onPick }: { onPick: (tab: TabKey) => void }) {
  return (
    <section id="categories" className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
      <ul
        className={`-mx-4 flex gap-5 overflow-x-auto px-4 sm:mx-0 sm:px-0 md:justify-between ${hideScrollbar}`}
      >
        {categoryKeys.map((key) => {
          const c = categories[key];
          return (
            <li key={key} className="shrink-0">
              <a
                href="#shop"
                onClick={() => onPick(key)}
                className="group flex w-24 flex-col items-center text-center sm:w-32"
              >
                <span
                  className="block h-20 w-20 overflow-hidden rounded-full ring-2 ring-offset-2 transition group-active:scale-95 sm:h-24 sm:w-24"
                  style={{ backgroundColor: c.light, ["--tw-ring-color" as string]: c.light } as CSSProperties}
                >
                  <Img src={c.image} alt={c.label} className="h-full w-full object-cover" />
                </span>
                <span className="mt-2 text-[13px] font-semibold leading-tight sm:text-sm" style={{ color: c.dark }}>
                  {c.label}
                </span>
                <span className="mt-0.5 hidden text-xs text-neutral-500 sm:block">
                  {c.tagline}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ---------- Product card ----------
function ProductCard({ product }: { product: Product }) {
  const { dark, light } = categories[product.category];
  const colorVar = { "--brand": dark } as CSSProperties;

  return (
    <article className="flex min-w-0 flex-col" style={colorVar}>
      <div className="relative">
        <div
          className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl"
          style={{ backgroundColor: light }}
        >
          <Img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            fallback={
              <div
                className="flex h-full w-full items-center justify-center p-3 text-center text-sm font-semibold"
                style={{ color: dark }}
              >
                {product.name}
              </div>
            }
          />
        </div>

        {product.badge && (
          <span
            className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white sm:text-xs"
            style={{ backgroundColor: dark }}
          >
            {product.badge}
          </span>
        )}
      </div>

      <h3
        className="mt-2.5 line-clamp-2 text-sm font-semibold leading-snug sm:text-[15px]"
        style={{ color: INK }}
      >
        {product.name}
      </h3>
      <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">{product.detail}</p>

      <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
        <span className="text-[15px] font-semibold">{formatPrice(product.price)}</span>
        {product.oldPrice && (
          <span className="text-xs text-neutral-400 line-through">
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </p>

      <button
        type="button"
        className="mt-2.5 h-10 w-full rounded-full border-[1.5px] border-[var(--brand)] text-sm font-semibold text-[var(--brand)] transition-colors hover:bg-[var(--brand)] hover:text-white focus-visible:bg-[var(--brand)] focus-visible:text-white active:bg-[var(--brand)] active:text-white"
      >
        Add to cart
      </button>
    </article>
  );
}

// ---------- Best sellers ----------
function BestSellers({
  activeTab,
  onTabChange,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}) {
  const visible =
    activeTab === "all" ? products : products.filter((p) => p.category === activeTab);

  return (
    <section id="shop" className="mx-auto max-w-6xl scroll-mt-2 px-4 py-8 sm:px-6 sm:py-12">
      <h2
        className={`${display.className} text-3xl sm:text-4xl`}
        style={{ color: INK }}
      >
        Best sellers
      </h2>

      {/* Tabs stay at the top while scrolling products on phones */}
      <div className="sticky top-0 z-10 -mx-4 mt-3 bg-white/95 px-4 py-2 backdrop-blur sm:static sm:mx-0 sm:px-0 sm:py-0">
        <div className={`flex gap-2 overflow-x-auto ${hideScrollbar}`}>
          <button
            type="button"
            onClick={() => onTabChange("all")}
            className={`h-9 shrink-0 rounded-full px-4 text-sm font-medium ${
              activeTab === "all" ? "text-white" : "bg-neutral-100 text-neutral-700"
            }`}
            style={activeTab === "all" ? { backgroundColor: INK } : undefined}
          >
            All
          </button>

          {categoryKeys.map((key) => {
            const active = activeTab === key;
            return (
              <button
                type="button"
                key={key}
                onClick={() => onTabChange(key)}
                className="h-9 shrink-0 rounded-full px-4 text-sm font-medium"
                style={{
                  backgroundColor: active ? categories[key].dark : categories[key].light,
                  color: active ? "#FFFFFF" : categories[key].dark,
                }}
              >
                {categories[key].label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:mt-6 sm:gap-x-5 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

// ---------- Story ----------
function Story() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-12">
      <div
        className="grid items-center gap-5 overflow-hidden rounded-3xl p-4 sm:gap-8 sm:p-6 md:grid-cols-[320px_1fr] md:p-8"
        style={{ backgroundColor: categories.coffee.light }}
      >
        <div className="h-44 overflow-hidden rounded-2xl sm:h-56 md:h-64">
          <Img
            src="images/Barista Pouring Coffee.png"
            alt="A cup of coffee on a table"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h2
            className={`${display.className} text-[28px] leading-tight sm:text-4xl`}
            style={{ color: categories.coffee.dark }}
          >
            Good things from around the world, closer to home.
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-7 text-neutral-700">
            Everything we sell is chosen with everyday living in mind, from your
            morning coffee and favourite spices to fragrances and comfortable
            bedroom essentials.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------- Promises ----------
function Promises() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 border-y border-neutral-200 py-6 md:grid-cols-4 md:gap-8 md:py-8">
        {promises.map((p) => (
          <div key={p.title}>
            <h3 className="text-sm font-semibold sm:text-base" style={{ color: INK }}>
              {p.title}
            </h3>
            <p className="mt-1 text-[13px] leading-5 text-neutral-600 sm:text-sm">
              {p.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Reviews ----------
function Reviews() {
  return (
    <section className="py-10 sm:py-14" style={{ backgroundColor: "#F6EDE2" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className={`${display.className} text-3xl sm:text-4xl`} style={{ color: INK }}>
          Loved by our customers
        </h2>

        <div
          className={`-mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 md:grid-cols-3 ${hideScrollbar}`}
        >
          {reviews.map((r) => (
            <blockquote
              key={r.name}
              className="w-[80%] max-w-sm shrink-0 snap-start rounded-2xl bg-white p-5 sm:w-auto sm:max-w-none"
            >
              <p className="leading-7 text-neutral-700">&ldquo;{r.text}&rdquo;</p>
              <footer className="mt-3 text-sm">
                <span className="font-semibold">{r.name}</span>
                <span className="text-neutral-500">, {r.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Homepage ----------
export default function HomePage() {
  // Shared so tapping a category in the rail opens it in the product list.
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  return (
    <main className={`${body.className} overflow-x-hidden bg-white text-neutral-900`}>
      <AnnouncementBar />
      {/* Add your Navbar component here */}
      <Hero onPick={setActiveTab} />
      <CategoryRail onPick={setActiveTab} />
      <BestSellers activeTab={activeTab} onTabChange={setActiveTab} />
      <Story />
      <Promises />
      <Reviews />
    </main>
  );
}