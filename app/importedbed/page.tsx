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
    id: 101,
    slug: "modern-single-bed",
    name: "Harmony Mattress",
    category: "Single Beds",
    price: 8999,
    mrp: 11999,
    image: "/images/importedbed/single-bed.jpeg",
    description: "A clean, space-saving design for compact bedrooms.",
    badge: "Popular",
  },
  {
    id: 102,
    slug: "premium-double-bed",
    name: "Glory Mattress",
    category: "Double Beds",
    price: 14999,
    mrp: 18999,
    image: "/images/importedbed/double-bed.jpeg",
    description: "A comfortable design for everyday living.",
  },
  {
    id: 103,
    slug: "luxury-queen-bed",
    name: "Luxury Queen Bed",
    category: "Queen Beds",
    price: 21999,
    mrp: 27999,
    image: "/images/importedbed/queen-bed.jpg",
    description: "A spacious bed design for a refined bedroom.",
    badge: "Bestseller",
  },
  {
    id: 104,
    slug: "king-size-bed",
    name: "King Size Bed",
    category: "King Beds",
    price: 28999,
    mrp: 35999,
    image: "/images/importedbed/king-bed.jpg",
    description: "A generously sized bed for larger bedrooms.",
  },
  {
    id: 105,
    slug: "upholstered-queen-bed",
    name: "Upholstered Queen Bed",
    category: "Queen Beds",
    price: 24999,
    mrp: 31999,
    image: "/images/importedbed/upholstered-bed.jpg",
    description: "An upholstered style with a soft, elegant appearance.",
  },
  {
    id: 106,
    slug: "classic-wooden-bed",
    name: "Classic Wooden Bed",
    category: "Double Beds",
    price: 17999,
    mrp: 22999,
    image: "/images/importedbed/wooden-bed.jpg",
    description: "A timeless wooden look for a warm bedroom interior.",
  },
  {
    id: 107,
    slug: "storage-king-bed",
    name: "Storage King Bed",
    category: "King Beds",
    price: 32999,
    mrp: 39999,
    image: "/images/importedbed/storage-bed.jpg",
    description: "A spacious bed design with convenient storage options.",
    badge: "Featured",
  },
  {
    id: 108,
    slug: "minimal-single-bed",
    name: "Minimal Single Bed",
    category: "Single Beds",
    price: 9999,
    mrp: 12999,
    image: "/images/importedbed/minimal-bed.jpg",
    description: "A versatile design for guest rooms and bedrooms.",
  },
];

const categories = [
  "All",
  "Single Beds",
  "Double Beds",
  "Queen Beds",
  "King Beds",
];

export default function ImportedBedPage() {
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
    <main className="min-h-screen overflow-x-hidden bg-[#FAF9F6] text-[#302C26]">
      {/* Light, elegant hero banner */}
      <section className="px-4 pb-10 pt-5 sm:px-8 sm:pt-8 lg:px-12">
        <div className="relative mx-auto min-h-[400px] max-w-7xl overflow-hidden rounded-2xl bg-[#F1ECE4] sm:min-h-[480px] lg:min-h-[540px]">
          <img
            src="/images/importedbed/banner.avif"
            alt="Elegant bedroom and bed collection"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Soft ivory overlay instead of a dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F1ECE4]/95 via-[#F1ECE4]/80 to-[#F1ECE4]/20" />

          {/* Hero content */}
          <div className="relative z-10 flex min-h-[400px] items-center px-6 py-12 sm:min-h-[480px] sm:px-12 lg:min-h-[540px] lg:px-20">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-[#D9CCBA] bg-white/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#62594F] sm:text-xs">
                Imaans Store · Bedroom Collection
              </span>

              <h1 className="mt-6 text-4xl font-medium leading-tight text-[#302C26] sm:text-5xl lg:text-7xl">
                Your Space.
                <span className="block font-serif italic text-[#8B7355]">
                  Your Comfort.
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-[#62594F] sm:text-base sm:leading-8">
                Discover beautifully designed beds that bring together
                everyday comfort, timeless style and a touch of luxury.
                Find the perfect fit for your bedroom.
              </p>

              <a
                href="#products"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#302C26] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#51483D]"
              >
                Explore Collection
                <span aria-hidden="true">→</span>
              </a>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#62594F] sm:text-sm">
                <span>Timeless Designs</span>
                <span>Comfort-Focused</span>
                <span>Made for Your Space</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product collection */}
      <section
        id="products"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-8 lg:px-12"
      >
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8B7355]">
              Comfort meets timeless design
            </p>

            <h2 className="mt-2 text-3xl font-medium text-[#302C26] sm:text-4xl">
              Explore Our Beds
            </h2>
          </div>

          <p className="text-sm text-[#81786C]">
            {visibleProducts.length} products
          </p>
        </div>

        {/* Search and sorting */}
        <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search beds..."
            aria-label="Search beds"
            className="min-w-0 rounded-lg border border-[#EDE8E0] bg-white px-4 py-3 text-sm text-[#302C26] outline-none placeholder:text-[#999187] transition focus:border-[#C9B59B] focus:ring-1 focus:ring-[#C9B59B]"
          />

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort beds"
            className="rounded-lg border border-[#EDE8E0] bg-white px-4 py-3 text-sm text-[#302C26] outline-none focus:border-[#C9B59B]"
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
                  ? "border-[#D6C5AE] bg-[#E8DFD2] text-[#302C26]"
                  : "border-[#EDE8E0] bg-white text-[#62594F] hover:border-[#D6C5AE] hover:bg-[#F5F0E8]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 items-stretch gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <article
                key={product.slug}
                className="group flex h-full min-w-0 flex-col rounded-xl border border-[#EDE8E0] bg-white p-2.5 transition duration-300 hover:border-[#D9CCBA] hover:shadow-md sm:p-4"
              >
                {/* Product image */}
                <a
                  href={`/product/${product.slug}`}
                  aria-label={`View ${product.name}`}
                  className="relative block aspect-[4/5] shrink-0 overflow-hidden rounded-lg bg-[#F1ECE4]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {product.badge && (
                    <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#62594F] shadow-sm sm:text-xs">
                      {product.badge}
                    </span>
                  )}
                </a>

                {/* Product details */}
                <div className="flex flex-1 flex-col">
                  <p className="mt-3 text-[10px] uppercase tracking-widest text-[#8B8175] sm:mt-4 sm:text-xs">
                    {product.category}
                  </p>

                  <h3 className="mt-1 min-h-10 text-sm font-semibold leading-5 text-[#302C26] sm:min-h-12 sm:text-base sm:leading-6">
                    {product.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-[#777168] sm:text-sm">
                    {product.description}
                  </p>

                  {/* Product pricing */}
                  <div className="mt-3 flex min-h-6 flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-[#302C26] sm:text-base">
                      {formatPrice(product.price)}
                    </span>

                    <span className="text-xs text-[#999187] line-through">
                      {formatPrice(product.mrp)}
                    </span>
                  </div>

                  {/* Add to shared header cart */}
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
                    className="mt-auto w-full rounded-full border border-[#E8DFD2] bg-[#E8DFD2] px-2 py-2.5 text-xs font-medium text-[#302C26] transition hover:border-[#D6C5AE] hover:bg-[#D6C5AE] focus:outline-none focus:ring-2 focus:ring-[#C9B59B] focus:ring-offset-2 sm:px-3 sm:text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#EDE8E0] bg-white px-4 py-16 text-center">
            <p className="text-sm text-[#777168]">
              No beds found. Try another search.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-4 rounded-full bg-[#E8DFD2] px-5 py-2.5 text-sm font-medium text-[#302C26] transition hover:bg-[#D6C5AE]"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Bottom promotional section */}
        <div className="mt-16 rounded-2xl border border-[#EDE8E0] bg-[#F1ECE4] px-6 py-10 text-center sm:py-14">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8B7355]">
            Imaans Store
          </p>

          <h2 className="mt-3 text-2xl font-medium text-[#302C26] sm:text-3xl">
            Create Your Perfect Bedroom
          </h2>

          <p className="mt-3 text-sm text-[#71695E]">
            Find a bed that suits your space, style and comfort.
          </p>

          <a
            href="#products"
            className="mt-6 inline-block rounded-full bg-[#E8DFD2] px-7 py-3 text-sm font-medium text-[#302C26] transition hover:bg-[#D6C5AE]"
          >
            Shop Beds
          </a>
        </div>
      </section>
    </main>
  );
}