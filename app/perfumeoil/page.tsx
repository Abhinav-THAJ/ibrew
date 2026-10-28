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
  type CSSProperties,
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

/* ==========================================================================
   HOW THIS FILE IS ORGANISED (top to bottom)

   1. THEME ............. every colour of the page, change them here
   2. FONTS
   3. TYPES
   4. WISHLIST .......... saves hearts in the browser (no need to edit)
   5. SMALL CONTROLS .... round checkbox, sort dropdown
   6. PRODUCT CARD
   7. PAGE SECTIONS ..... Hero, Toolbar, Filters, Product grid, Features,
                          Mobile filter drawer (each one is its own function)
   8. SHOP PAGE ......... puts the sections together
   9. THIS PAGE'S DATA .. products and text
   ========================================================================== */

/* ==========================================================================
   1. THEME: change colours here, the whole page updates
   ========================================================================== */
const THEME = {
  // backgrounds
  pageBackground: "#F5EDE0", // the whole page (light beige)
  imageBackground: "#E9DCC6", // behind product photos, dropdown hover
  cardBackground: "#FFFFFF", // search box, dropdown, feature cards
  iconBubble: "#EFE3D0", // circle behind the feature icons

  // text and lines
  text: "#1F1A17",
  mutedText: "rgba(31,26,23,0.65)",
  line: "rgba(31,26,23,0.15)", // thin divider lines
  inputBorder: "rgba(31,26,23,0.3)", // borders of inputs and dropdown

  // buttons, prices, selected filters
  accent: "#7A5A3C",
  accentHover: "#5E4329", // button colour while the mouse is over it
  onAccent: "#FFFFFF", // text colour on top of the accent colour
  badge: "#8A6642", // "Bestseller" label on product photos

  // hero (top banner)
  heroOverlay: "rgba(0,0,0,0.6)", // dark layer over the banner photo
  heroText: "#FFFFFF",
};

// Turns the THEME above into CSS variables, so Tailwind classes can use them.
// Example: bg-[color:var(--accent)] always matches THEME.accent.
const themeVariables = {
  "--page-bg": THEME.pageBackground,
  "--image-bg": THEME.imageBackground,
  "--card-bg": THEME.cardBackground,
  "--icon-bubble": THEME.iconBubble,
  "--text": THEME.text,
  "--muted": THEME.mutedText,
  "--line": THEME.line,
  "--input-border": THEME.inputBorder,
  "--accent": THEME.accent,
  "--accent-hover": THEME.accentHover,
  "--on-accent": THEME.onAccent,
  "--badge": THEME.badge,
} as CSSProperties;

// Outlined button used for "Add to cart", "Load more", "Clear filters".
// Hover colour = THEME.accentHover.
const outlineButton =
  "border border-[color:var(--accent)] text-[color:var(--accent)] transition-colors " +
  "hover:border-[color:var(--accent-hover)] hover:bg-[color:var(--accent-hover)] hover:text-[color:var(--on-accent)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]";

const hideScrollbar = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/* ==========================================================================
   2. FONTS
   ========================================================================== */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const body = Figtree({ subsets: ["latin"], display: "swap" });

/* ==========================================================================
   3. TYPES
   ========================================================================== */
type ShopProduct = {
  /** Unique across the whole store (it is the cart / wishlist key). */
  id: number;
  slug: string;
  name: string;
  /** Sub-category shown in the filter (e.g. "Coffee Powder"). */
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

/* ==========================================================================
   4. WISHLIST (saved in this browser only, no need to edit)
   ========================================================================== */
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
      /* storage unavailable (private mode): nothing to save */
    }
    listeners.forEach((l) => l());
  }, []);

  return { ids, toggle };
}

/* ==========================================================================
   5. SMALL CONTROLS
   ========================================================================== */
function Chevron({ open }: { open: boolean }) {
  return (
    <ChevronDown
      aria-hidden
      strokeWidth={1.5}
      className={`h-5 w-5 shrink-0 transition ${open ? "rotate-180" : ""}`}
    />
  );
}

// Round checkbox used in the filters.
function CircleOption({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />

      {/* the round box */}
      <span
        aria-hidden
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--accent)] ${
          checked ? "border-[color:var(--accent)]" : "border-[color:var(--input-border)]"
        }`}
      >
        {/* the filled dot when ticked */}
        <span
          className={`h-2 w-2 rounded-full bg-[color:var(--accent)] transition-transform duration-200 ${
            checked ? "scale-100" : "scale-0"
          }`}
        />
      </span>

      <span>{label}</span>
    </label>
  );
}

// Sort dropdown (custom, so the highlight colour matches the theme).
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

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const closeOnEscape = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const currentLabel = options.find((o) => o.value === value)?.label ?? "";

  return (
    <div ref={ref} className="relative w-full sm:w-52">
      {/* the closed button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Sort products. Current: ${currentLabel}`}
        className="flex w-full items-center justify-between border border-[color:var(--input-border)] bg-[color:var(--card-bg)] px-4 py-2.5 text-left text-sm outline-none focus-visible:border-[color:var(--accent)]"
      >
        <span>{currentLabel}</span>
        <Chevron open={open} />
      </button>

      {/* the open list */}
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-30 mt-1 w-full overflow-hidden border border-[color:var(--input-border)] bg-[color:var(--card-bg)] shadow-lg"
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-[color:var(--accent)] text-[color:var(--on-accent)]"
                      : "hover:bg-[color:var(--image-bg)]"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ==========================================================================
   6. PRODUCT CARD
   ========================================================================== */
const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Tells the browser how wide the photo is, so it downloads a sensible size.
const IMAGE_SIZES = "(max-width: 639px) 50vw, (max-width: 1279px) 33vw, 25vw";

// Shown when a product photo file is missing.
function MissingImage({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[color:var(--image-bg)] p-4 text-center">
      <span className={`${display.className} text-lg leading-tight`}>{name}</span>
      <span className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted)]">
        Photo coming soon
      </span>
    </div>
  );
}

// A card only becomes a link once the product has an `href`.
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
  return href ? (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

function ProductCard({
  product,
  wished,
  onToggleWish,
  onAddToCart,
}: {
  product: ShopProduct;
  wished: boolean;
  onToggleWish: (id: number) => void;
  onAddToCart: (product: ShopProduct) => void;
}) {
  const [imageBroken, setImageBroken] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // "Added ✓" goes back to "Add to cart" after 1.8 seconds.
  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const handleAddToCart = () => {
    if (product.soldOut) return;
    onAddToCart(product);
    setJustAdded(true);
  };

  const showHoverImage = !!product.hoverImage && !imageBroken;

  return (
    <article className="flex min-w-0 flex-col text-center">
      {/* ----- photo, badge, heart ----- */}
      <div className="group relative overflow-hidden bg-[color:var(--image-bg)]">
        <MaybeLink href={product.href} label={product.name} className="relative block aspect-square w-full">
          {imageBroken ? (
            <MissingImage name={product.name} />
          ) : (
            <>
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes={IMAGE_SIZES}
                onError={() => setImageBroken(true)}
                className={`object-cover transition duration-700 ${
                  showHoverImage ? "group-hover:opacity-0" : "group-hover:scale-105"
                } ${product.soldOut ? "opacity-60" : ""}`}
              />
              {showHoverImage && (
                <Image
                  src={product.hoverImage!}
                  alt={`${product.name} alternate view`}
                  fill
                  sizes={IMAGE_SIZES}
                  className="object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
              )}
            </>
          )}
        </MaybeLink>

        {product.badge && (
          <span className="pointer-events-none absolute left-0 top-3 bg-[color:var(--badge)] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-white sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.2em]">
            {product.badge}
          </span>
        )}

        {product.soldOut && (
          <span className="pointer-events-none absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[9px] uppercase tracking-[0.25em] text-[color:var(--accent)] sm:text-[10px]">
            Sold out
          </span>
        )}

        <button
          type="button"
          onClick={() => onToggleWish(product.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]"
          style={{ color: wished ? THEME.accent : THEME.text }}
        >
          <Heart
            aria-hidden
            className="h-[18px] w-[18px]"
            strokeWidth={1.5}
            fill={wished ? THEME.accent : "none"}
          />
        </button>
      </div>

      {/* ----- category, name, price ----- */}
      <MaybeLink href={product.href} label={product.name} className="block">
        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted)] sm:mt-5">
          {product.category}
        </p>
        <h3
          className={`${display.className} mx-auto mt-1.5 line-clamp-2 min-h-[2.6em] max-w-[22ch] text-[17px] leading-[1.3] sm:text-xl`}
        >
          {product.name}
        </h3>
        <p className="mt-1.5 flex flex-wrap items-baseline justify-center gap-x-2 text-sm">
          <span className="font-medium text-[color:var(--accent)]">{formatPrice(product.price)}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-xs text-[color:var(--muted)] line-through">{formatPrice(product.mrp)}</span>
          )}
        </p>
      </MaybeLink>

      {/* ----- add to cart button ----- */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={product.soldOut}
        aria-live="polite"
        className={`${outlineButton} mt-3 flex w-full items-center justify-center gap-2 px-2 py-2.5 text-[10px] uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[color:var(--accent)] sm:text-xs sm:tracking-[0.2em]`}
      >
        {product.soldOut ? (
          "Sold out"
        ) : justAdded ? (
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

/* ==========================================================================
   7. PAGE SECTIONS
   Each section is one function. Edit one without touching the others.
   ========================================================================== */

/* ---------- Section A: HERO (banner photo + title) ---------- */
function HeroSection({
  banner,
  crumb,
  title,
  tagline,
  intro,
}: {
  banner: string;
  crumb: string;
  title: string;
  tagline: string;
  intro: string;
}) {
  return (
    <section className="relative overflow-hidden bg-black" style={{ color: THEME.heroText }}>
      {/* background photo + dark layer on top of it */}
      <Image src={banner} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ background: THEME.heroOverlay }} />

      {/* text */}
      <div className="relative z-10 px-4 py-16 text-center sm:px-6 sm:py-20 md:py-28">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 text-[11px] uppercase tracking-[0.25em] sm:mb-5 sm:text-xs sm:tracking-[0.3em]"
        >
          <Link href="/" className="transition-opacity hover:opacity-70">
            Home
          </Link>
          <span className="mx-2 sm:mx-3" aria-hidden>
            /
          </span>
          <span aria-current="page">{crumb}</span>
        </nav>

        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">{title}</h1>
        <p className="mt-3 text-lg sm:text-xl md:text-2xl">{tagline}</p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 sm:mt-5 md:text-base">{intro}</p>
        <div className="mx-auto mt-6 h-px w-24 sm:mt-7" style={{ background: THEME.heroText }} />
      </div>
    </section>
  );
}

/* ---------- Section B: TOOLBAR (filters button, count, search, sort) ---------- */
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "az", label: "Alphabetically, A-Z" },
  { value: "za", label: "Alphabetically, Z-A" },
  { value: "low", label: "Price, low to high" },
  { value: "high", label: "Price, high to low" },
];

function Toolbar({
  shownCount,
  totalCount,
  activeFilterCount,
  onOpenFilters,
  query,
  onQueryChange,
  searchPlaceholder,
  sort,
  onSortChange,
}: {
  shownCount: number;
  totalCount: number;
  activeFilterCount: number;
  onOpenFilters: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  searchPlaceholder: string;
  sort: string;
  onSortChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--line)] pb-5">
      {/* left: filters button (phones) + product count */}
      <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start sm:gap-5">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] sm:gap-3 sm:text-sm sm:tracking-[0.3em] lg:hidden"
        >
          <SlidersHorizontal aria-hidden className="h-5 w-5" strokeWidth={1.5} />
          Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
        </button>

        <p
          aria-live="polite"
          className="text-[11px] uppercase tracking-[0.15em] text-[color:var(--muted)] sm:text-xs sm:tracking-[0.2em]"
        >
          Showing {shownCount} of {totalCount} products
        </p>
      </div>

      {/* right: search + sort */}
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <label className="flex w-full items-center gap-2 border border-[color:var(--input-border)] bg-[color:var(--card-bg)] px-3 focus-within:border-[color:var(--accent)] sm:w-56">
          <Search aria-hidden className="h-4 w-4 shrink-0 text-[color:var(--muted)]" strokeWidth={1.5} />
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full min-w-0 bg-transparent py-2.5 text-sm outline-none placeholder:text-[color:var(--muted)]"
          />
        </label>

        <SortDropdown value={sort} onChange={onSortChange} options={SORT_OPTIONS} />
      </div>
    </div>
  );
}

/* ---------- Section C: FILTERS (sidebar on desktop, drawer on phones) ---------- */
function FiltersPanel({
  facetTitle,
  facetOptions,
  selected,
  onToggleOption,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  showInStock,
  inStockOnly,
  onToggleInStock,
  activeFilterCount,
  onClearAll,
}: {
  facetTitle: string;
  facetOptions: string[];
  selected: string[];
  onToggleOption: (value: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  showInStock: boolean;
  inStockOnly: boolean;
  onToggleInStock: () => void;
  activeFilterCount: number;
  onClearAll: () => void;
}) {
  // which groups are open (type / price)
  const [typeOpen, setTypeOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  const groupButton = "flex w-full items-center justify-between text-left text-sm uppercase tracking-[0.25em]";
  const priceInput =
    "w-full min-w-0 border border-[color:var(--input-border)] bg-[color:var(--card-bg)] px-3 py-2 text-sm outline-none placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]";

  return (
    <div>
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="mb-6 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] underline underline-offset-4"
        >
          Clear all ({activeFilterCount})
        </button>
      )}

      {/* group 1: type */}
      <div className="border-b border-[color:var(--line)] py-5">
        <button type="button" onClick={() => setTypeOpen((o) => !o)} aria-expanded={typeOpen} className={groupButton}>
          <span>{facetTitle}</span>
          <Chevron open={typeOpen} />
        </button>

        {typeOpen && (
          <ul className="mt-4 space-y-3">
            {facetOptions.map((option) => (
              <li key={option}>
                <CircleOption
                  checked={selected.includes(option)}
                  onChange={() => onToggleOption(option)}
                  label={option}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* group 2: price */}
      <div className="border-b border-[color:var(--line)] py-5">
        <button type="button" onClick={() => setPriceOpen((o) => !o)} aria-expanded={priceOpen} className={groupButton}>
          <span>Price</span>
          <Chevron open={priceOpen} />
        </button>

        {priceOpen && (
          <div className="mt-4 flex items-center gap-3">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              aria-label="Minimum price"
              placeholder="₹ Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className={priceInput}
            />
            <span aria-hidden className="text-[color:var(--muted)]">
              -
            </span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              aria-label="Maximum price"
              placeholder="₹ Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className={priceInput}
            />
          </div>
        )}
      </div>

      {/* group 3: in stock (only shown if some product can be sold out) */}
      {showInStock && (
        <div className="py-5">
          <CircleOption checked={inStockOnly} onChange={onToggleInStock} label="In stock only" />
        </div>
      )}
    </div>
  );
}

/* ---------- Section D: PRODUCT GRID ---------- */
function ProductGrid({
  products,
  wishlistIds,
  onToggleWish,
  onAddToCart,
  onClearFilters,
  hasMore,
  onLoadMore,
}: {
  products: ShopProduct[];
  wishlistIds: number[];
  onToggleWish: (id: number) => void;
  onAddToCart: (product: ShopProduct) => void;
  onClearFilters: () => void;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  // nothing matches the search / filters
  if (products.length === 0) {
    return (
      <div className="py-16 text-center sm:py-20">
        <p className={`${display.className} text-2xl text-[color:var(--accent)]`}>No products found</p>
        <p className="mt-2 text-sm text-[color:var(--muted)]">Try a different search or clear your filters.</p>
        <button
          type="button"
          onClick={onClearFilters}
          className={`${outlineButton} mt-6 px-6 py-2 text-xs uppercase tracking-[0.3em]`}
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 2 columns on phones, 3 from tablets up */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            wished={wishlistIds.includes(product.id)}
            onToggleWish={onToggleWish}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center sm:mt-12">
          <button
            type="button"
            onClick={onLoadMore}
            className={`${outlineButton} px-10 py-3 text-xs uppercase tracking-[0.3em]`}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}

/* ---------- Section E: FEATURES (last banner, the original simple style) ---------- */
const FEATURE_ICONS: Record<FeatureIconName, LucideIcon> = {
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

function FeaturesSection({ features }: { features: ShopFeature[] }) {
  return (
    // full-width beige band with a thin line on top and bottom
    <section className="border-y border-[color:var(--line)] bg-[color:var(--image-bg)] py-12 sm:py-16">
      <div className="mx-auto grid max-w-4xl gap-8 px-6 sm:grid-cols-3 sm:gap-10">
        {features.map((feature) => {
          const Icon = FEATURE_ICONS[feature.icon];
          return (
            <div key={feature.title} className="text-center">
              <Icon aria-hidden className="mx-auto h-9 w-9 text-[color:var(--accent)]" strokeWidth={1.2} />
              <h2 className={`${display.className} mt-4 text-2xl`}>{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{feature.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Section F: MOBILE FILTER DRAWER ---------- */
function MobileFilterDrawer({
  open,
  onClose,
  resultCount,
  children,
}: {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  children: ReactNode; // the filters panel
}) {
  // Lock page scrolling and close with Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
      {/* dark area behind the drawer, tap to close */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* the drawer itself */}
      <div
        className={`${hideScrollbar} absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto border-r border-[color:var(--line)] bg-[color:var(--page-bg)] p-6`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`${display.className} text-2xl`}>Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close filters">
            <X aria-hidden className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>

        {children}

        <button
          type="button"
          onClick={onClose}
          className={`${outlineButton} mt-6 w-full py-3 text-xs uppercase tracking-[0.3em]`}
        >
          Show {resultCount} products
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   8. SHOP PAGE: keeps the filter state and puts the sections together
   ========================================================================== */
const PAGE_SIZE = 9; // how many products show before "Load more"

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

  // ----- what the visitor has chosen -----
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const showInStock = products.some((p) => p.soldOut);
  const activeFilterCount = selected.length + (inStockOnly ? 1 : 0) + (minPrice || maxPrice ? 1 : 0);

  // Every filter change starts again from the first page of products.
  const resetPaging = () => setVisibleCount(PAGE_SIZE);

  const toggleOption = (value: string) => {
    setSelected((list) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]));
    resetPaging();
  };

  const clearAll = () => {
    setSelected([]);
    setInStockOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setQuery("");
    setSort("featured");
    resetPaging();
  };

  // ----- apply search, filters and sorting -----
  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    const search = query.trim().toLowerCase();

    const list = products.filter((p) => {
      if (inStockOnly && p.soldOut) return false;
      if (p.price < min || p.price > max) return false;
      if (selected.length && !selected.includes(p.category)) return false;
      if (search && !`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(search)) return false;
      return true;
    });

    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") list.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, sort, selected, inStockOnly, minPrice, maxPrice, query]);

  const shown = filtered.slice(0, visibleCount);

  // The same filters panel is used in the sidebar and in the phone drawer.
  const filtersPanel = (
    <FiltersPanel
      facetTitle={facetTitle}
      facetOptions={facetOptions}
      selected={selected}
      onToggleOption={toggleOption}
      minPrice={minPrice}
      maxPrice={maxPrice}
      onMinPriceChange={(v) => {
        setMinPrice(v);
        resetPaging();
      }}
      onMaxPriceChange={(v) => {
        setMaxPrice(v);
        resetPaging();
      }}
      showInStock={showInStock}
      inStockOnly={inStockOnly}
      onToggleInStock={() => {
        setInStockOnly((v) => !v);
        resetPaging();
      }}
      activeFilterCount={activeFilterCount}
      onClearAll={clearAll}
    />
  );

  return (
    <div
      className={`${body.className} min-h-screen overflow-x-hidden bg-[color:var(--page-bg)] text-[color:var(--text)]`}
      style={themeVariables}
    >
      {/* A. hero */}
      <HeroSection banner={banner} crumb={crumb} title={title} tagline={tagline} intro={intro} />

      {/* B + C + D. toolbar, filters, products */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
        <Toolbar
          shownCount={shown.length}
          totalCount={filtered.length}
          activeFilterCount={activeFilterCount}
          onOpenFilters={() => setDrawerOpen(true)}
          query={query}
          onQueryChange={(v) => {
            setQuery(v);
            resetPaging();
          }}
          searchPlaceholder={searchPlaceholder}
          sort={sort}
          onSortChange={setSort}
        />

        {/* quick category chips (phones and tablets only) */}
        <div className={`${hideScrollbar} -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 lg:hidden`}>
          {facetOptions.map((option) => {
            const on = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                aria-pressed={on}
                className={`shrink-0 border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                  on
                    ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--on-accent)]"
                    : "border-[color:var(--accent)] text-[color:var(--accent)] hover:bg-[color:var(--image-bg)]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex gap-10">
          {/* sidebar filters (desktop only) */}
          <aside className="sticky top-6 hidden max-h-[calc(100vh-3rem)] w-64 shrink-0 self-start overflow-y-auto pr-2 [scrollbar-width:thin] lg:block">
            {filtersPanel}
          </aside>

          <div className="min-w-0 flex-1">
            <ProductGrid
              products={shown}
              wishlistIds={wishlist.ids}
              onToggleWish={wishlist.toggle}
              onAddToCart={(p) => addToCart({ id: p.id, name: p.name, price: p.price, image: p.image })}
              onClearFilters={clearAll}
              hasMore={visibleCount < filtered.length}
              onLoadMore={() => setVisibleCount((n) => n + PAGE_SIZE)}
            />
          </div>
        </div>
      </section>

      {/* E. features (last section) */}
      <FeaturesSection features={features} />

      {/* F. filter drawer for phones */}
      <MobileFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} resultCount={filtered.length}>
        {filtersPanel}
      </MobileFilterDrawer>
    </div>
  );
}

/* ==========================================================================
   9. THIS PAGE: products and text
   ========================================================================== */

// Perfume photos are files inside public/images/perfumeoil/.
// To add or change a photo: put your file in that folder, then write its
// file name in the product below, for example image: img("oud.jpg").
// Optional: add  hoverImage: img("oud-2.jpg")  to a product and a second
// photo fades in when the mouse is over the card.
// If a file is missing, the card shows a "Photo coming soon" box instead.
const img = (fileName: string) => `/images/perfumeoil/${fileName}`;

// Ids start at 201 so they never collide with coffee (1-8) in the shared cart.
const products: ShopProduct[] = [
  { id: 201, slug: "oud-noir", name: "Oud Noir Eau de Parfum", category: "Men", description: "A rich, woody fragrance for a confident impression.", price: 1499, mrp: 1999, image: img("perfume.png"), badge: "Bestseller" },
  { id: 202, slug: "royal-amber", name: "Royal Amber", category: "Unisex", description: "A warm amber-inspired fragrance for day and evening.", price: 1799, mrp: 2299, image: img("perfume.png") },
  { id: 203, slug: "floral-blush", name: "Floral Blush", category: "Women", description: "A delicate floral scent with an elegant character.", price: 1299, mrp: 1699, image: img("perfume.png"), badge: "Popular" },
  { id: 204, slug: "midnight-musk", name: "Midnight Musk", category: "Men", description: "A deep, evening-inspired fragrance profile.", price: 2199, mrp: 2799, image: img("perfume.png") },
  { id: 205, slug: "rose-velvet", name: "Rose Velvet", category: "Women", description: "A rose-inspired fragrance for an elegant everyday touch.", price: 1399, mrp: 1799, image: img("perfume.png") },
  { id: 206, slug: "citrus-fresh", name: "Citrus Fresh", category: "Men", description: "A fresh, bright fragrance for everyday wear.", price: 1199, mrp: 1599, image: img("perfume.png") },
  { id: 207, slug: "vanilla-musk", name: "Vanilla Musk", category: "Unisex", description: "A smooth, warm fragrance with a comforting character.", price: 1599, mrp: 1999, image: img("perfume.png") },
  { id: 208, slug: "signature-perfume-oil", name: "Signature Perfume Oil", category: "Perfume Oils", description: "A concentrated perfume oil for your fragrance collection.", price: 899, mrp: 1199, image: img("perfume.png"), badge: "Featured" },
];

export default function PerfumeOilPage() {
  return (
    <ShopPage
      title="Shop All Perfumes"
      crumb="Perfumes"
      tagline="Discover your signature scent."
      intro="Explore imported fragrances, perfume oils and memorable scents for everyday wear and special occasions."
      banner={img("banner.avif")}
      facetTitle="Collection"
      facetOptions={["Men", "Women", "Unisex", "Perfume Oils"]}
      searchPlaceholder="Search perfumes..."
      products={products}
      features={[
        { icon: "flower", title: "Imported Fragrances", text: "Imported scents for everyday wear and special occasions." },
        { icon: "droplets", title: "Perfume Oils", text: "Concentrated oils for your fragrance collection." },
        { icon: "sparkles", title: "For Every Moment", text: "Find a scent that complements your style." },
      ]}
    />
  );
}