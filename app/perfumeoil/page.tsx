"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";

type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  description: string;
  badge?: string;
};

const products: Product[] = [
  {
    id: 1,
    slug: "oud-noir",
    name: "Oud Noir Eau de Parfum",
    category: "Men",
    price: 1499,
    mrp: 1999,
    image: "/images/perfumeoil/oud.jpg",
    description: "A rich, woody fragrance for a confident impression.",
    badge: "Bestseller",
  },
  {
    id: 2,
    slug: "royal-amber",
    name: "Royal Amber",
    category: "Unisex",
    price: 1799,
    mrp: 2299,
    image: "/images/perfumeoil/amber.jpg",
    description: "A warm amber-inspired fragrance for day and evening.",
  },
  {
    id: 3,
    slug: "floral-blush",
    name: "Floral Blush",
    category: "Women",
    price: 1299,
    mrp: 1699,
    image: "/images/perfumeoil/floral.jpg",
    description: "A delicate floral scent with an elegant character.",
    badge: "Popular",
  },
  {
    id: 4,
    slug: "midnight-musk",
    name: "Midnight Musk",
    category: "Men",
    price: 2199,
    mrp: 2799,
    image: "/images/perfumeoil/musk.jpg",
    description: "A deep, evening-inspired fragrance profile.",
  },
  {
    id: 5,
    slug: "rose-velvet",
    name: "Rose Velvet",
    category: "Women",
    price: 1399,
    mrp: 1799,
    image: "/images/perfumeoil/rose.jpg",
    description: "A rose-inspired fragrance for an elegant everyday touch.",
  },
  {
    id: 6,
    slug: "citrus-fresh",
    name: "Citrus Fresh",
    category: "Men",
    price: 1199,
    mrp: 1599,
    image: "/images/perfumeoil/citrus.jpg",
    description: "A fresh, bright fragrance for everyday wear.",
  },
  {
    id: 7,
    slug: "vanilla-musk",
    name: "Vanilla Musk",
    category: "Unisex",
    price: 1599,
    mrp: 1999,
    image: "/images/perfumeoil/vanilla.jpg",
    description: "A smooth, warm fragrance with a comforting character.",
  },
  {
    id: 8,
    slug: "signature-perfume-oil",
    name: "Signature Perfume Oil",
    category: "Perfume Oils",
    price: 899,
    mrp: 1199,
    image: "/images/perfumeoil/perfume-oil.jpg",
    description: "A concentrated perfume oil for your fragrance collection.",
    badge: "Featured",
  },
];

const categories = ["All", "Men", "Women", "Unisex", "Perfume Oils"];

export default function PerfumeOilPage() {
  const { addToCart } = useCart();

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const searchText =
        `${product.name} ${product.description} ${product.category}`.toLowerCase();

      const matchesSearch = searchText.includes(
        search.trim().toLowerCase()
      );

      return matchesCategory && matchesSearch;
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [category, search, sort]);

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString("en-IN")}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#081426] text-[#F5F7FF]">
      {/* Hero section */}
      <section className="px-4 pb-10 pt-6 sm:px-8 lg:px-12 lg:pt-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl border border-[#293B57] bg-[#0B1B33] md:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8FAAFF] sm:tracking-[0.28em]">
              Imaans Store · Fragrance Collection
            </p>

            <h1 className="mt-5 text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl">
              Discover Your
              <span className="block font-serif italic text-[#8FAAFF]">
                Signature Scent
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#B8C4D9] sm:text-base">
              Explore imported fragrances, perfume oils and memorable
              scents for everyday wear and special occasions.
            </p>

            <a
              href="#products"
              className="mt-8 w-fit rounded-full bg-[#4169E1] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#5B7CFA]"
            >
              Explore Perfumes →
            </a>
          </div>

          <div className="relative h-[300px] overflow-hidden bg-[#10213A] sm:h-[400px] md:h-full md:min-h-[460px]">
            <img
              src="/images/perfumeoil/banner.avif"
              alt="Perfume collection"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Product section */}
      <section
        id="products"
        className="mx-auto max-w-7xl scroll-mt-6 px-4 pb-20 sm:px-8 lg:px-12"
      >
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8FAAFF]">
              Fragrance for every occasion
            </p>

            <h2 className="mt-2 text-3xl font-medium text-white sm:text-4xl">
              Shop Perfumes
            </h2>
          </div>

          <p className="text-sm text-[#B8C4D9]">
            {visibleProducts.length} products
          </p>
        </div>

        {/* Search and sorting */}
        <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search perfumes..."
            aria-label="Search perfumes"
            className="min-w-0 rounded-lg border border-[#293B57] bg-[#10213A] px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8C4D9] focus:border-[#4169E1] focus:ring-1 focus:ring-[#4169E1]"
          />

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort perfumes"
            className="rounded-lg border border-[#293B57] bg-[#10213A] px-4 py-3 text-sm text-white outline-none focus:border-[#4169E1]"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {/* Category filters */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm transition ${
                category === item
                  ? "border-[#4169E1] bg-[#4169E1] text-white"
                  : "border-[#293B57] bg-[#10213A] text-[#F5F7FF] hover:border-[#4169E1] hover:text-[#8FAAFF]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 items-stretch gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {visibleProducts.map((product) => (
              <article
                key={product.slug}
                className="group flex h-full min-w-0 flex-col rounded-xl border border-[#293B57] bg-[#10213A] p-2.5 transition duration-300 hover:border-[#4169E1] sm:p-4"
              >
                {/* Product image */}
                <a
                  href={`/product/${product.slug}`}
                  aria-label={`View ${product.name}`}
                  className="relative block aspect-[4/5] shrink-0 overflow-hidden rounded-lg bg-[#0B1B33]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {product.badge && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#081426]/95 px-2.5 py-1 text-[10px] font-semibold text-[#AFC2FF] sm:text-xs">
                      {product.badge}
                    </span>
                  )}
                </a>

                {/* Product information */}
                <div className="flex flex-1 flex-col">
                  <p className="mt-3 text-[10px] uppercase tracking-widest text-[#8FAAFF] sm:mt-4 sm:text-xs">
                    {product.category}
                  </p>

                  <h3 className="mt-1 min-h-10 text-sm font-semibold leading-5 text-white sm:min-h-12 sm:text-base sm:leading-6">
                    {product.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-[#B8C4D9] sm:text-sm">
                    {product.description}
                  </p>

                  {/* Prices */}
                  <div className="mt-3 flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-bold text-white sm:text-base">
                      {formatPrice(product.price)}
                    </span>

                    <span className="text-xs text-[#91A0B8] line-through">
                      {formatPrice(product.mrp)}
                    </span>
                  </div>

                  {/* Shared cart integration */}
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
                    className="mt-auto mt-4 w-full rounded-full border border-[#4169E1] bg-[#4169E1] px-2 py-2.5 text-xs font-medium text-white transition hover:border-[#5B7CFA] hover:bg-[#5B7CFA] focus:outline-none focus:ring-2 focus:ring-[#8FAAFF] focus:ring-offset-2 focus:ring-offset-[#10213A] sm:px-3 sm:text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#293B57] bg-[#10213A] px-4 py-16 text-center">
            <p className="text-sm text-[#B8C4D9]">
              No perfumes found. Try another search.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-4 rounded-full bg-[#4169E1] px-5 py-2.5 text-sm text-white transition hover:bg-[#5B7CFA]"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Promotional section */}
        <div className="mt-16 rounded-2xl border border-[#293B57] bg-[#10213A] px-6 py-10 text-center sm:py-14">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8FAAFF]">
            Imaans Store
          </p>

          <h2 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
            A fragrance that feels like you.
          </h2>

          <p className="mt-3 text-sm text-[#B8C4D9]">
            Find a scent that complements your style and your moments.
          </p>

          <a
            href="#products"
            className="mt-6 inline-block rounded-full bg-[#4169E1] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#5B7CFA]"
          >
            Shop Perfumes
          </a>
        </div>
      </section>
    </main>
  );
}