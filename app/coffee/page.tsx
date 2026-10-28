"use client";

import Image from "next/image";
import Link from "next/link";
import { Figtree, Instrument_Serif } from "next/font/google";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  BedDouble,
  ChevronDown,
  Coffee,
  Droplets,
  Flower2,
  Gem,
  Heart,
  Leaf,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sofa,
  Sparkles,
  Wheat,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCart } from "@/components/CartContext";

// This page is self-contained: the card, filters and layout are all in this one file.

// ---------------------------------------------------------------------------
// COLOURS
// ---------------------------------------------------------------------------
// Shared palette for the four shop pages (coffee, spices, perfumes, beds).
const INK = "#1F1A17";
const CREAM = "#F5EDE0";
const PASTEL = "#E9DCC6";
const BURGUNDY = "#7A5A3C";
const COPPER_L = "#8A6642";
const MUTED = "rgba(31,26,23,0.65)";
const LINE = "rgba(31,26,23,0.15)";
const BORDER = "rgba(31,26,23,0.3)";

const hideScrollbar = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

// ---------------------------------------------------------------------------
// FONTS
// ---------------------------------------------------------------------------
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const body = Figtree({ subsets: ["latin"], display: "swap" });

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------
type ShopProduct = {
  /** Unique across the whole store (it is the cart / wishlist key). */
  id: number;
  slug: string;
  name: string;
  /** Sub-category shown in the filter (e.g. "Whole Spices", "Queen Beds"). */
  category: string;
  description: string;
  /** Selling price in whole rupees. */
  price: number;
  /** Original price (MRP) in whole rupees, shown struck through. */
  mrp?: number;
  image: string;
  /** Optional second image that fades in on hover. */
  hoverImage?: string;
  badge?: string;
  soldOut?: boolean;
  /** Set once a product detail page exists; the card is not linked until then. */
  href?: string;
};

type FeatureIconName =
  | "coffee"
  | "sparkles"
  | "droplets"
  | "leaf"
  | "wheat"
  | "flower"
  | "gem"
  | "bed"
  | "sofa";

type ShopFeature = { title: string; text: string; icon: FeatureIconName };

// ---------------------------------------------------------------------------
// WISHLIST (saved in this browser only)
// ---------------------------------------------------------------------------
// Browser-local wishlist. It is stored under one key so every shop page
// shares it. It will move to the customer's account once login exists.
const KEY = "imaan-wishlist";
const listeners = new Set<() => void>();

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function parse(raw: string): number[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((n): n is number => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function useWishlist() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const ids = useMemo(() => parse(raw), [raw]);

  const toggle = useCallback((id: number) => {
    const current = parse(read());
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable (private mode): nothing to persist */
    }
    listeners.forEach((l) => l());
  }, []);

  return { ids, toggle };
}

// ---------------------------------------------------------------------------
// SMALL UI CONTROLS
// ---------------------------------------------------------------------------
function Chevron({ open }: { open: boolean }) {
  return (
    <ChevronDown
      aria-hidden
      strokeWidth={1.5}
      className={`h-5 w-5 shrink-0 transition ${open ? "rotate-180" : ""}`}
    />
  );
}

// Round selector used instead of a square checkbox. Works as checkbox or radio.
function CircleOption({
  type,
  name,
  checked,
  onChange,
  label,
  className = "",
  disabled,
}: {
  type: "checkbox" | "radio";
  name?: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-3 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#7A5A3C]/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#F5EDE0]"
        style={{ borderColor: checked ? BURGUNDY : "rgba(31,26,23,0.45)" }}
      >
        <span
          className={`h-2 w-2 rounded-full transition-transform duration-200 ${
            checked ? "scale-100" : "scale-0"
          }`}
          style={{ background: BURGUNDY }}
        />
      </span>
      <span>{label}</span>
    </label>
  );
}

// Custom sort dropdown so the highlight colour matches the theme.
function SortDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const current = options.find((o) => o.value === value)?.label ?? "";

  return (
    <div ref={ref} className="relative w-full sm:w-52">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Sort products. Current: ${current}`}
        className="flex w-full items-center justify-between border bg-white px-4 py-2.5 text-left text-sm normal-case tracking-[0.03em] outline-none focus-visible:border-[#7A5A3C]"
        style={{ borderColor: open ? BURGUNDY : BORDER, color: INK }}
      >
        <span>{current}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-30 mt-1 w-full overflow-hidden border bg-white shadow-[0_10px_30px_rgba(31,26,23,0.15)]"
          style={{ borderColor: BORDER }}
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm normal-case tracking-[0.03em] transition-colors ${
                    active ? "bg-[#7A5A3C] text-[#F5EDE0]" : "text-[#1F1A17] hover:bg-[#E9DCC6]"
                  }`}
                >
                  {o.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PRODUCT CARD
// ---------------------------------------------------------------------------
const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const SIZES = "(max-width: 639px) 50vw, (max-width: 1279px) 33vw, 25vw";

// Shown when a product image file is missing or fails to load.
function MissingImage({ name }: { name: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center"
      style={{ background: PASTEL }}
    >
      <span className={`${display.className} text-lg leading-tight`} style={{ color: INK }}>
        {name}
      </span>
      <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: MUTED }}>
        Photo coming soon
      </span>
    </div>
  );
}

function MaybeLink({
  href,
  label,
  className,
  children,
}: {
  href?: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  // Cards only become links once a detail page exists, so there are no dead links.
  return href ? (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

function ProductCard({
  product: p,
  wished,
  onToggleWish,
  onAddToCart,
}: {
  product: ShopProduct;
  wished: boolean;
  onToggleWish: (id: number) => void;
  onAddToCart: (p: ShopProduct) => void;
}) {
  const [broken, setBroken] = useState(false);
  const [added, setAdded] = useState(false);

  // The "Added" confirmation resets after 1.8 seconds.
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const handleAdd = () => {
    if (p.soldOut) return;
    onAddToCart(p);
    setAdded(true);
  };

  const hasHover = !!p.hoverImage && !broken;

  return (
    <article className="flex min-w-0 flex-col text-center">
      {/* image, badge and wishlist heart */}
      <div className="group relative overflow-hidden" style={{ background: PASTEL }}>
        <MaybeLink href={p.href} label={p.name} className="relative block aspect-square w-full">
          {broken ? (
            <MissingImage name={p.name} />
          ) : (
            <>
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes={SIZES}
                onError={() => setBroken(true)}
                className={`object-cover transition duration-700 ${
                  hasHover ? "group-hover:opacity-0" : "group-hover:scale-105"
                } ${p.soldOut ? "opacity-60" : ""}`}
              />
              {hasHover && (
                <Image
                  src={p.hoverImage!}
                  alt={`${p.name} alternate view`}
                  fill
                  sizes={SIZES}
                  className="object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
              )}
            </>
          )}
        </MaybeLink>

        {p.badge && (
          <span
            className="pointer-events-none absolute left-0 top-3 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-white sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.2em]"
            style={{ background: COPPER_L }}
          >
            {p.badge}
          </span>
        )}

        {p.soldOut && (
          <span
            className="pointer-events-none absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[9px] uppercase tracking-[0.25em] sm:text-[10px]"
            style={{ color: BURGUNDY }}
          >
            Sold out
          </span>
        )}

        <button
          type="button"
          onClick={() => onToggleWish(p.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7A5A3C]"
          style={{ color: wished ? BURGUNDY : INK }}
        >
          <Heart
            aria-hidden
            className="h-[18px] w-[18px]"
            strokeWidth={1.5}
            fill={wished ? BURGUNDY : "none"}
          />
        </button>
      </div>

      {/* category, name and price */}
      <MaybeLink href={p.href} label={p.name} className="block">
        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] sm:mt-5" style={{ color: MUTED }}>
          {p.category}
        </p>
        <h3
          className={`${display.className} mx-auto mt-1.5 line-clamp-2 min-h-[2.6em] max-w-[22ch] text-[17px] leading-[1.3] sm:text-xl`}
          style={{ color: INK }}
        >
          {p.name}
        </h3>
        <p className="mt-1.5 flex flex-wrap items-baseline justify-center gap-x-2 text-sm">
          <span className="font-medium" style={{ color: BURGUNDY }}>
            {formatPrice(p.price)}
          </span>
          {p.mrp && p.mrp > p.price && (
            <span className="text-xs line-through" style={{ color: MUTED }}>
              {formatPrice(p.mrp)}
            </span>
          )}
        </p>
      </MaybeLink>

      <button
  type="button"
  onClick={handleAdd}
  disabled={p.soldOut}
  aria-live="polite"
  // 1. Set the default text color here via className using text-[#754747]
  // 2. Added hover:!text-[#FFF9F3] to cleanly override the text color on hover
  className="mt-3 flex w-full items-center justify-center gap-2 border px-2 py-2.5 text-[10px] uppercase tracking-[0.15em] text-[#754747] transition-colors hover:bg-[#754747] hover:!text-[#FFF9F3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#754747] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#754747] sm:text-xs sm:tracking-[0.2em]"
  // FIXED: Removed "color: BURGUNDY" from this style block so Tailwind can control it on hover
  style={{ borderColor: BURGUNDY }}
>
  {p.soldOut ? (
    "Sold out"
  ) : added ? (
    "Added ✓"
  ) : (
    <>
      Add to cart <ShoppingBag aria-hidden className="h-4 w-4" strokeWidth={1.5} />
    </>
  )}
</button>

    </article>
  );
}

// ---------------------------------------------------------------------------
// SHOP PAGE LAYOUT
// ---------------------------------------------------------------------------
const ICONS: Record<FeatureIconName, LucideIcon> = {
  coffee: Coffee,
  sparkles: Sparkles,
  droplets: Droplets,
  leaf: Leaf,
  wheat: Wheat,
  flower: Flower2,
  gem: Gem,
  bed: BedDouble,
  sofa: Sofa,
};

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "az", label: "Alphabetically, A-Z" },
  { value: "za", label: "Alphabetically, Z-A" },
  { value: "low", label: "Price, low to high" },
  { value: "high", label: "Price, high to low" },
];

const PAGE_SIZE = 9;

type ShopPageProps = {
  title: string;
  crumb: string;
  tagline: string;
  intro: string;
  banner: string;
  facetTitle: string;
  facetOptions: string[];
  searchPlaceholder: string;
  products: ShopProduct[];
  features: ShopFeature[];
};

function ShopPage({
  title,
  crumb,
  tagline,
  intro,
  banner,
  facetTitle,
  facetOptions,
  searchPlaceholder,
  products,
  features,
}: ShopPageProps) {
  const { addToCart } = useCart();
  const wishlist = useWishlist();

  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openGroups, setOpenGroups] = useState({ facet: true, price: true });
  const [mobileFilters, setMobileFilters] = useState(false);

  // The in-stock toggle only appears when at least one product can be sold out.
  const hasStockInfo = products.some((p) => p.soldOut);

  const toggleOption = (value: string) => {
    setSelected((s) => (s.includes(value) ? s.filter((v) => v !== value) : [...s, value]));
    setVisible(PAGE_SIZE);
  };

  const activeCount = selected.length + (inStockOnly ? 1 : 0) + (minPrice || maxPrice ? 1 : 0);

  const clearAll = () => {
    setSelected([]);
    setInStockOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setQuery("");
    setSort("featured");
    setVisible(PAGE_SIZE);
  };

  // Lock page scroll and close on Escape while the mobile drawer is open.
  useEffect(() => {
    if (!mobileFilters) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMobileFilters(false);
    document.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", esc);
    };
  }, [mobileFilters]);

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    const q = query.trim().toLowerCase();

    const list = products.filter((p) => {
      if (inStockOnly && p.soldOut) return false;
      if (p.price < min || p.price > max) return false;
      if (selected.length && !selected.includes(p.category)) return false;
      if (q && !`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });

    switch (sort) {
      case "az":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "high":
        list.sort((a, b) => b.price - a.price);
        break;
    }
    return list;
  }, [products, sort, selected, inStockOnly, minPrice, maxPrice, query]);

  const shown = filtered.slice(0, visible);

  const priceInput =
    "w-full min-w-0 border bg-white px-3 py-2 text-sm text-[#1F1A17] outline-none placeholder:text-[#1F1A17]/40 focus:border-[#7A5A3C]";
  const groupButton = "flex w-full items-center justify-between text-left text-sm uppercase tracking-[0.25em]";
  const outlineButton =
    "border text-xs uppercase tracking-[0.3em] transition-colors hover:bg-[#7A5A3C] hover:text-[#F5EDE0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A5A3C]";

  const filtersPanel = (
    <div>
      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="mb-6 text-xs uppercase tracking-[0.3em] underline underline-offset-4"
          style={{ color: BURGUNDY }}
        >
          Clear all ({activeCount})
        </button>
      )}

      <div className="border-b py-5" style={{ borderColor: LINE }}>
        <button
          type="button"
          onClick={() => setOpenGroups((o) => ({ ...o, facet: !o.facet }))}
          aria-expanded={openGroups.facet}
          className={groupButton}
        >
          <span>{facetTitle}</span>
          <Chevron open={openGroups.facet} />
        </button>
        {openGroups.facet && (
          <ul className="mt-4 space-y-3">
            {facetOptions.map((opt) => (
              <li key={opt}>
                <CircleOption
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggleOption(opt)}
                  label={opt}
                  className="text-sm"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-b py-5" style={{ borderColor: LINE }}>
        <button
          type="button"
          onClick={() => setOpenGroups((o) => ({ ...o, price: !o.price }))}
          aria-expanded={openGroups.price}
          className={groupButton}
        >
          <span>Price</span>
          <Chevron open={openGroups.price} />
        </button>
        {openGroups.price && (
          <div className="mt-4 flex items-center gap-3">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              aria-label="Minimum price"
              placeholder="₹ Min"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              className={priceInput}
              style={{ borderColor: BORDER }}
            />
            <span aria-hidden style={{ color: MUTED }}>
              -
            </span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              aria-label="Maximum price"
              placeholder="₹ Max"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              className={priceInput}
              style={{ borderColor: BORDER }}
            />
          </div>
        )}
      </div>

      {hasStockInfo && (
        <div className="py-5 text-sm uppercase tracking-[0.25em]">
          <CircleOption
            type="checkbox"
            checked={inStockOnly}
            onChange={() => {
              setInStockOnly((v) => !v);
              setVisible(PAGE_SIZE);
            }}
            label="In stock only"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className={`${body.className} min-h-screen overflow-x-hidden`} style={{ background: CREAM, color: INK }}>
      {/* ---------- HERO (full background image + dark overlay) ---------- */}
      <section className="relative overflow-hidden bg-black text-white">
        <Image src={banner} alt="" fill priority sizes="100vw" className="object-cover" />
        {/* Dark overlay so the white text stays readable. Change /60 to make it lighter or darker. */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 px-4 py-16 text-center sm:px-6 sm:py-20 md:py-28">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 text-[11px] uppercase tracking-[0.25em] sm:mb-5 sm:text-xs sm:tracking-[0.3em]"
          >
            <Link href="/" className="transition-colors hover:text-white/70">
              Home
            </Link>
            <span className="mx-2 sm:mx-3" aria-hidden>
              /
            </span>
            <span aria-current="page">{crumb}</span>
          </nav>

          {/* Normal font (Figtree) is used here, so there is no display.className */}
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">{title}</h1>
          <p className="mt-3 text-lg sm:text-xl md:text-2xl">{tagline}</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 sm:mt-5 md:text-base">{intro}</p>
          <div className="mx-auto mt-6 h-px w-24 bg-white sm:mt-7" />
        </div>
      </section>

      {/* ---------- SHOP AREA ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
        {/* top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5" style={{ borderColor: LINE }}>
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start sm:gap-5">
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] sm:gap-3 sm:text-sm sm:tracking-[0.3em] lg:hidden"
            >
              <SlidersHorizontal aria-hidden className="h-5 w-5" strokeWidth={1.5} />
              Filters{activeCount > 0 && ` (${activeCount})`}
            </button>
            <p aria-live="polite" className="text-[11px] uppercase tracking-[0.15em] sm:text-xs sm:tracking-[0.2em]" style={{ color: MUTED }}>
              Showing {shown.length} of {filtered.length} products
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <label
              className="flex w-full items-center gap-2 border bg-white px-3 focus-within:border-[#7A5A3C] sm:w-56"
              style={{ borderColor: BORDER }}
            >
              <Search aria-hidden className="h-4 w-4 shrink-0" strokeWidth={1.5} style={{ color: MUTED }} />
              <span className="sr-only">Search products</span>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisible(PAGE_SIZE);
                }}
                placeholder={searchPlaceholder}
                className="w-full min-w-0 bg-transparent py-2.5 text-sm outline-none placeholder:text-[#1F1A17]/40"
              />
            </label>
            <SortDropdown value={sort} onChange={setSort} options={SORTS} />
          </div>
        </div>

        {/* quick sub-category chips (phones and tablets) */}
        <div className={`${hideScrollbar} -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 lg:hidden`}>
          {facetOptions.map((opt) => {
            const on = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleOption(opt)}
                aria-pressed={on}
                className="shrink-0 border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors"
                style={{
                  borderColor: BURGUNDY,
                  background: on ? BURGUNDY : "transparent",
                  color: on ? CREAM : BURGUNDY,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex gap-10">
          {/* sidebar (desktop) */}
          <aside className="sticky top-6 hidden max-h-[calc(100vh-3rem)] w-64 shrink-0 self-start overflow-y-auto pr-2 [scrollbar-color:#c9b8a3_transparent] [scrollbar-width:thin] lg:block">
            {filtersPanel}
          </aside>

          {/* grid */}
          <div className="min-w-0 flex-1">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10">
                {shown.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    wished={wishlist.ids.includes(p.id)}
                    onToggleWish={wishlist.toggle}
                    onAddToCart={(item) =>
                      addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center sm:py-20">
                <p className={`${display.className} text-2xl`} style={{ color: BURGUNDY }}>
                  No products found
                </p>
                <p className="mt-2 text-sm" style={{ color: MUTED }}>
                  Try a different search or clear your filters.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className={`${outlineButton} mt-6 px-6 py-2`}
                  style={{ borderColor: BURGUNDY, color: BURGUNDY }}
                >
                  Clear filters
                </button>
              </div>
            )}

            {visible < filtered.length && (
              <div className="mt-10 text-center sm:mt-12">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className={`${outlineButton} px-10 py-3`}
                  style={{ borderColor: BURGUNDY, color: BURGUNDY }}
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="border-y py-12 sm:py-16" style={{ borderColor: LINE, background: PASTEL }}>
        <div className="mx-auto grid max-w-4xl gap-8 px-6 sm:grid-cols-3 sm:gap-10">
          {features.map((f) => {
            const Icon = ICONS[f.icon];
            return (
              <div key={f.title} className="text-center">
                <Icon aria-hidden className="mx-auto h-9 w-9" strokeWidth={1.2} style={{ color: BURGUNDY }} />
                <h2 className={`${display.className} mt-4 text-2xl`} style={{ color: INK }}>
                  {f.title}
                </h2>
                <p className="mt-2 text-sm leading-6" style={{ color: MUTED }}>
                  {f.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- MOBILE FILTER DRAWER ---------- */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
          <div
            className={`${hideScrollbar} absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto border-r p-6`}
            style={{ borderColor: LINE, background: CREAM, color: INK }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className={`${display.className} text-2xl`}>Filters</h2>
              <button type="button" onClick={() => setMobileFilters(false)} aria-label="Close filters">
                <X aria-hidden className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
            {filtersPanel}
            <button
              type="button"
              onClick={() => setMobileFilters(false)}
              className={`${outlineButton} mt-6 w-full py-3`}
              style={{ borderColor: BURGUNDY, color: BURGUNDY }}
            >
              Show {filtered.length} products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// THIS PAGE: PRODUCTS AND TEXT
// ---------------------------------------------------------------------------
// Product images are files inside public/images/coffee/.
// To change a photo, put your file in that folder and change the file name here.
// If a file is missing, the card shows a "Photo coming soon" box instead.
const img = (fileName: string) => `/images/coffee/${fileName}`;

const products: ShopProduct[] = [
  { id: 1, slug: "premium-arabica-coffee-powder", name: "Premium Arabica Coffee Powder", category: "Coffee Powder", description: "Smooth aroma with a rich, balanced flavour.", price: 349, mrp: 425, image: img("arabica.jpeg"), badge: "Bestseller" },
  { id: 2, slug: "strong-robusta-coffee-powder", name: "Strong Robusta Coffee Powder", category: "Coffee Powder", description: "Bold taste for a strong morning brew.", price: 299, mrp: 375, image: img("arabica.jpeg") },
  { id: 3, slug: "traditional-filter-coffee", name: "Traditional Filter Coffee", category: "Coffee Powder", description: "A classic filter coffee blend for everyday enjoyment.", price: 249, image: img("arabica.jpeg"), badge: "Popular" },
  { id: 4, slug: "dark-roast-coffee-powder", name: "Dark Roast Coffee Powder", category: "Coffee Powder", description: "Deep roasted flavour with an intense aroma.", price: 399, image: img("arabica.jpeg") },
  { id: 5, slug: "organic-coffee-powder", name: "Organic Coffee Powder", category: "Coffee Powder", description: "A delightful coffee experience for your daily ritual.", price: 449, image: img("arabica.jpeg"), badge: "Special" },
  { id: 6, slug: "coffee-body-scrub", name: "Coffee Body Scrub", category: "Coffee Skincare", description: "A coffee-inspired exfoliating body care essential.", price: 299, mrp: 349, image: img("coffee-scrub.avif"), badge: "Bestseller" },
  { id: 7, slug: "coffee-handmade-soap", name: "Coffee Handmade Soap", category: "Coffee Skincare", description: "A coffee-inspired cleansing bar for your daily routine.", price: 149, image: img("coffee-soap.avif") },
  { id: 8, slug: "coffee-face-wash", name: "Coffee Face Wash", category: "Coffee Skincare", description: "A refreshing face cleanser for everyday use.", price: 249, image: img("coffee-facewash.avif"), badge: "New" },
];

export default function CoffeePage() {
  return (
    <ShopPage
      title="Shop All Coffee"
      crumb="Coffee"
      tagline="A little coffee, a lot of love."
      intro="Explore aromatic coffee powders and coffee-inspired skincare essentials. Find your favourite blend and make every day a little more special."
      banner="/images/coffee/coffee-collection.jpeg"
      facetTitle="Type"
      facetOptions={["Coffee Powder", "Coffee Skincare"]}
      searchPlaceholder="Search coffee..."
      products={products}
      features={[
        { icon: "coffee", title: "Rich Aroma", text: "Aromatic coffee powders for your daily ritual." },
        { icon: "sparkles", title: "Quality Selection", text: "Find your favourite blend." },
        { icon: "droplets", title: "Everyday Essentials", text: "Coffee-inspired skincare for your routine." },
      ]}
    />
  );
}