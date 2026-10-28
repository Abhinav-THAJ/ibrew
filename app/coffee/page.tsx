"use client";

import { useCart } from "@/components/CartContext";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ShoppingBag,
  Search,
  Coffee,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Premium Arabica Coffee Powder",
    category: "Coffee Powder",
    description: "Smooth aroma with a rich, balanced flavour.",
    price: 349,
    oldPrice: 425,
    image: "/images/coffee/arabica.jpeg",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Strong Robusta Coffee Powder",
    category: "Coffee Powder",
    description: "Bold taste for a strong morning brew.",
    price: 299,
    oldPrice: 375,
    image: "/images/coffee/arabica.avif",
  },
  {
    id: 3,
    name: "Traditional Filter Coffee",
    category: "Coffee Powder",
    description: "A classic filter coffee blend for everyday enjoyment.",
    price: 249,
    image: "/images/coffee/arabica.avif",
    badge: "Popular",
  },
  {
    id: 4,
    name: "Dark Roast Coffee Powder",
    category: "Coffee Powder",
    description: "Deep roasted flavour with an intense aroma.",
    price: 399,
    image: "/images/coffee/arabica.avif",
  },
  {
    id: 5,
    name: "Organic Coffee Powder",
    category: "Coffee Powder",
    description: "A delightful coffee experience for your daily ritual.",
    price: 449,
    image: "/images/coffee/arabica.avif",
    badge: "Special",
  },
  {
    id: 6,
    name: "Coffee Body Scrub",
    category: "Coffee Skincare",
    description: "A coffee-inspired exfoliating body care essential.",
    price: 299,
    oldPrice: 349,
    image: "/images/coffee/coffee-scrub.avif",
    badge: "Bestseller",
  },
  {
    id: 7,
    name: "Coffee Handmade Soap",
    category: "Coffee Skincare",
    description: "A coffee-inspired cleansing bar for your daily routine.",
    price: 149,
    image: "/images/coffee/coffee-soap.avif",
  },
  {
    id: 8,
    name: "Coffee Face Wash",
    category: "Coffee Skincare",
    description: "A refreshing face cleanser for everyday use.",
    price: 249,
    image: "/images/coffee/coffee-facewash.avif",
    badge: "New",
  },
];

const categories = ["All Products", "Coffee Powder", "Coffee Skincare"];

export default function CoffeePage() {
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All Products" ||
        product.category === activeCategory;

      const matchesSearch = `${product.name} ${product.description}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [activeCategory, searchTerm, sortBy]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#faf7f0] text-[#38271d]">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-[#493324] text-[#fff8ed]">
        <div className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-[#aa8056]/20 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-32 left-1/3 h-60 w-60 rounded-full bg-[#c29b6c]/10 blur-3xl sm:h-72 sm:w-72" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:gap-10 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12 lg:py-24">
          <div className="text-center lg:text-left">
            <h1 className="mx-auto max-w-xl text-3xl font-medium leading-tight sm:text-5xl lg:mx-0 lg:text-7xl">
              A Little Coffee,
              <span className="mt-1 block font-serif italic text-[#d9b78b]">
                A Lot of Love.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[#f5e8d8]/85 sm:mt-6 sm:text-base sm:leading-7 lg:mx-0">
              Explore aromatic coffee powders and coffee-inspired
              skincare essentials. Find your favourite blend and
              make every day a little more special.
            </p>

            {/* Full width on mobile, normal width from sm up */}
            <a
              href="#coffee-products"
              className="mt-7 inline-flex w-full items-center justify-center gap-3 bg-[#d9b78b] px-6 py-4 text-sm font-semibold text-[#38271d] transition hover:bg-[#f0d5b0] sm:mt-8 sm:w-auto"
            >
              EXPLORE COLLECTION
              <ArrowRight size={18} />
            </a>

            <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#f5e8d8]/75 sm:mt-10 sm:gap-x-7 sm:text-sm lg:justify-start">
              <span>Rich Aroma</span>
              <span>•</span>
              <span>Quality Selection</span>
              <span>•</span>
              <span>Everyday Essentials</span>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-4 rounded-full bg-[#b88b5d]/20 blur-2xl" />

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#75543b] to-[#302117] sm:aspect-[5/4]">
              <Image
                src="/images/coffee/coffee-collection.jpeg"
                alt="The Coffee Collection"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                <p className="font-serif text-2xl italic text-[#f6e2c5] sm:text-4xl">
                  The Coffee Collection
                </p>

                <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-[#f6e2c5] sm:text-xs sm:tracking-[0.3em]">
                  Brew • Enjoy • Repeat
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category introduction */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-16 lg:px-12">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#97714c] sm:tracking-[0.25em]">
            Discover Your Favourites
          </p>

          <h2 className="mt-3 font-serif text-2xl sm:text-4xl lg:text-5xl">
            Made for Coffee Lovers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#76675b] sm:text-base sm:leading-7">
            From your daily coffee ritual to your coffee-inspired
            self-care routine, discover something you will love.
          </p>
        </div>

        {/* Category filters */}
        <div className="mt-7 flex flex-wrap justify-center gap-2 sm:mt-9 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition sm:px-5 sm:py-3 sm:text-sm ${
                activeCategory === category
                  ? "border-[#493324] bg-[#493324] text-white"
                  : "border-[#d9cbb9] bg-transparent text-[#493324] hover:border-[#493324]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Product listing */}
      <section
        id="coffee-products"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-14 sm:px-8 sm:pb-16 lg:px-12"
      >
        <div className="mb-6 flex flex-col gap-4 border-b border-[#e5dbce] pb-5 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold sm:text-3xl">
              Our Coffee Collection
            </h2>

            <p className="mt-1 text-sm text-[#76675b] sm:mt-2">
              {filteredProducts.length} products to explore
            </p>
          </div>

          {/* Search and sorting: stacked and full width on mobile */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex w-full items-center gap-2 border border-[#dfd2c1] bg-white px-3 sm:w-auto">
              <Search size={17} className="shrink-0 text-[#806044]" />

              <span className="sr-only">Search products</span>

              <input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full min-w-0 bg-transparent py-3 text-sm outline-none sm:w-44"
              />
            </label>

            <label className="flex w-full items-center gap-2 border border-[#dfd2c1] bg-white px-3 sm:w-auto">
              <SlidersHorizontal size={16} className="shrink-0" />

              <span className="sr-only">Sort products</span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full min-w-0 bg-transparent py-3 text-sm outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>
        </div>

        {/* Products grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-6 sm:gap-y-9 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className="group min-w-0">
              <div className="relative overflow-hidden rounded-sm bg-[#eee6da]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {product.badge && (
                  <span className="absolute left-2 top-2 bg-[#493324] px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px]">
                    {product.badge}
                  </span>
                )}

                {/* Add to cart: small round icon on mobile, full-width bar from sm up */}
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
                  aria-label={`Add ${product.name} to cart`}
                  className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-white/95 text-[#493324] transition hover:bg-[#493324] hover:text-white sm:bottom-3 sm:left-3 sm:right-3 sm:h-auto sm:w-auto sm:rounded-none sm:py-3 sm:text-xs sm:font-semibold sm:uppercase sm:tracking-wider"
                >
                  <ShoppingBag size={16} />
                  <span className="hidden sm:inline">Add to Cart</span>
                </button>
              </div>

              {/* Product details */}
              <div className="pt-3 sm:pt-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#98724c] sm:text-[10px] sm:tracking-[0.18em]">
                  {product.category}
                </p>

                <h3 className="mt-1.5 text-sm font-semibold leading-snug sm:mt-2 sm:text-lg">
                  {product.name}
                </h3>

                {/* Description is hidden on small phones to keep cards compact */}
                <p className="mt-2 hidden min-h-10 text-sm leading-5 text-[#76675b] sm:block">
                  {product.description}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 sm:mt-3">
                  <span className="text-base font-semibold sm:text-lg">
                    ₹{product.price}
                  </span>

                  {product.oldPrice && (
                    <span className="text-xs text-[#9b8d80] line-through sm:text-sm">
                      ₹{product.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty search results */}
        {filteredProducts.length === 0 && (
          <div className="py-14 text-center sm:py-16">
            <Coffee size={36} className="mx-auto text-[#98724c]" />

            <h3 className="mt-4 text-lg font-semibold sm:text-xl">
              No products found
            </h3>

            <p className="mt-2 text-sm text-[#76675b]">
              Try a different search or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All Products");
              }}
              className="mt-5 underline underline-offset-4"
            >
              View all products
            </button>
          </div>
        )}
      </section>

      {/* Skincare feature */}
      <section className="bg-[#eee5d8]">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-10 sm:gap-7 sm:px-8 sm:py-16 md:grid-cols-2 lg:px-12">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#97714c] sm:tracking-[0.25em]">
              Beyond Your Cup
            </p>

            <h2 className="mt-3 font-serif text-2xl leading-tight sm:text-4xl">
              Coffee-Inspired
              <span className="block italic">Self-Care</span>
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#76675b] sm:text-base sm:leading-7 md:mx-0">
              Discover coffee scrub, coffee soap, and coffee face
              wash to complement your everyday personal care routine.
            </p>

            <button
              type="button"
              onClick={() => {
                setActiveCategory("Coffee Skincare");
                document
                  .getElementById("coffee-products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#493324] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#654832] sm:w-auto"
            >
              SHOP COFFEE SKINCARE
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="relative flex items-center justify-center overflow-hidden rounded-sm bg-[#dfd0bd] p-6 sm:p-14">
            <Image
              src="/images/coffee/coffee-skin.avif"
              alt="Coffee-inspired skincare collection"
              width={400}
              height={400}
              sizes="(max-width: 767px) 100vw, 50vw"
              className="h-auto w-full max-w-xs object-contain sm:max-w-sm"
            />
          </div>
        </div>
      </section>

      {/* Closing banner */}
      <section className="bg-[#493324] px-4 py-10 text-center text-[#fff8ed] sm:px-8 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d9b78b] sm:tracking-[0.3em]">
          Imaan&apos;s Store
        </p>

        <h2 className="mt-4 font-serif text-2xl sm:text-4xl">
          Find Your Perfect Brew
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#f5e8d8]/80 sm:text-base">
          Good coffee, thoughtful self-care, and everyday moments
          worth enjoying.
        </p>

        <a
          href="#coffee-products"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 border border-[#d9b78b] px-6 py-3.5 text-sm font-semibold transition hover:bg-[#d9b78b] hover:text-[#38271d] sm:w-auto"
        >
          SHOP NOW
          <ArrowRight size={17} />
        </a>
      </section>
    </main>
  );
}