
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
    image: "/images/coffee/arabica.avif",
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

const categories = [
  "All Products",
  "Coffee Powder",
  "Coffee Skincare",
];

export default function CoffeePage() {
  const [activeCategory, setActiveCategory] =
    useState("All Products");
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
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [activeCategory, searchTerm, sortBy]);

  return (
    <main className="min-h-screen bg-[#faf7f0] text-[#38271d]">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-[#493324] text-[#fff8ed]">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#aa8056]/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#c29b6c]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12 lg:py-24">
          <div>
            <h1 className="max-w-xl text-4xl font-medium leading-tight sm:text-5xl lg:text-7xl">
              A Little Coffee,
              <span className="mt-1 block font-serif italic text-[#d9b78b]">
                A Lot of Love.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-[#f5e8d8]/85 sm:text-base">
              Explore aromatic coffee powders and coffee-inspired
              skincare essentials. Find your favourite blend and
              make every day a little more special.
            </p>

            <a
              href="#coffee-products"
              className="mt-8 inline-flex items-center gap-3 bg-[#d9b78b] px-6 py-4 text-sm font-semibold text-[#38271d] transition hover:bg-[#f0d5b0]"
            >
              EXPLORE COLLECTION
              <ArrowRight size={18} />
            </a>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-[#f5e8d8]/75 sm:text-sm">
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

            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#75543b] to-[#302117]">
              <Image
                src="/images/coffee/coffee-collection.avif"
                alt="The Coffee Collection"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                <p className="font-serif text-3xl italic text-[#f6e2c5] sm:text-4xl">
                  The Coffee Collection
                </p>

                <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#f6e2c5]">
                  Brew • Enjoy • Repeat
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category introduction */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#97714c]">
            Discover Your Favourites
          </p>

          <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl">
            Made for Coffee Lovers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#76675b] sm:text-base">
            From your daily coffee ritual to your coffee-inspired
            self-care routine, discover something you will love.
          </p>
        </div>

        {/* Category filters */}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-5 py-3 text-xs font-semibold transition sm:text-sm ${
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
        className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-16 sm:px-8 lg:px-12"
      >
        <div className="mb-7 flex flex-col gap-4 border-b border-[#e5dbce] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Our Coffee Collection
            </h2>

            <p className="mt-2 text-sm text-[#76675b]">
              {filteredProducts.length} products to explore
            </p>
          </div>

          {/* Search and sorting */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 border border-[#dfd2c1] bg-white px-3">
              <Search size={17} className="text-[#806044]" />

              <span className="sr-only">Search products</span>

              <input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                className="w-full min-w-0 bg-transparent py-3 text-sm outline-none sm:w-44"
              />
            </label>

            <label className="flex items-center gap-2 border border-[#dfd2c1] bg-white px-3">
              <SlidersHorizontal size={16} />

              <span className="sr-only">Sort products</span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="min-w-0 bg-transparent py-3 text-sm outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className="group min-w-0">
              <div className="relative overflow-hidden rounded-sm bg-[#eee6da]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {product.badge && (
                  <span className="absolute left-3 top-3 bg-[#493324] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {product.badge}
                  </span>
                )}

                {/* Add to shared cart */}
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
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 bg-white/95 py-3 text-xs font-semibold uppercase tracking-wider text-[#493324] transition hover:bg-[#493324] hover:text-white"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
              </div>

              {/* Product details */}
              <div className="pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#98724c]">
                  {product.category}
                </p>

                <h3 className="mt-2 text-base font-semibold leading-snug sm:text-lg">
                  {product.name}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-[#76675b]">
                  {product.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-lg font-semibold">
                    ₹{product.price}
                  </span>

                  {product.oldPrice && (
                    <span className="text-sm text-[#9b8d80] line-through">
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
          <div className="py-16 text-center">
            <Coffee
              size={36}
              className="mx-auto text-[#98724c]"
            />

            <h3 className="mt-4 text-xl font-semibold">
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
        <div className="mx-auto grid max-w-7xl items-center gap-7 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-2 lg:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#97714c]">
              Beyond Your Cup
            </p>

            <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
              Coffee-Inspired
              <span className="block italic">Self-Care</span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#76675b] sm:text-base">
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
              className="mt-6 inline-flex items-center gap-2 bg-[#493324] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#654832]"
            >
              SHOP COFFEE SKINCARE
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="relative flex items-center justify-center overflow-hidden rounded-sm bg-[#dfd0bd] p-10 sm:p-14">
            <Image
              src="/images/coffee/coffee-skin.avif"
              alt="Coffee-inspired skincare collection"
              width={400}
              height={400}
              sizes="(max-width: 767px) 100vw, 50vw"
              className="h-auto w-full max-w-sm object-contain"
            />
          </div>
        </div>
      </section>

      {/* Closing banner */}
      <section className="bg-[#493324] px-5 py-12 text-center text-[#fff8ed] sm:px-8 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d9b78b]">
          Imaan&apos;s Store
        </p>

        <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
          Find Your Perfect Brew
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#f5e8d8]/80 sm:text-base">
          Good coffee, thoughtful self-care, and everyday moments
          worth enjoying.
        </p>

        <a
          href="#coffee-products"
          className="mt-7 inline-flex items-center gap-2 border border-[#d9b78b] px-6 py-3.5 text-sm font-semibold transition hover:bg-[#d9b78b] hover:text-[#38271d]"
        >
          SHOP NOW
          <ArrowRight size={17} />
        </a>
      </section>
    </main>
  );
}
