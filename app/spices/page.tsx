"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";

type Product = {
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
    slug: "premium-turmeric",
    name: "Premium Turmeric Powder",
    category: "Ground Spices",
    price: 120,
    mrp: 150,
    image: "/images/spices/turmeric.avif",
    description: "Golden turmeric for everyday cooking.",
    badge: "Bestseller",
  },
  {
    slug: "red-chilli",
    name: "Red Chilli Powder",
    category: "Ground Spices",
    price: 140,
    mrp: 175,
    image: "/images/spices/chilli.avif",
    description: "Rich colour and bold flavour for your dishes.",
  },
  {
    slug: "black-pepper",
    name: "Black Pepper",
    category: "Whole Spices",
    price: 180,
    mrp: 220,
    image: "/images/spices/pepper.avif",
    description: "Aromatic peppercorns with a distinctive taste.",
    badge: "Popular",
  },
  {
    slug: "green-cardamom",
    name: "Green Cardamom",
    category: "Whole Spices",
    price: 320,
    mrp: 390,
    image: "/images/spices/cardamom.avif",
    description: "Fragrant cardamom for tea and desserts.",
  },
  {
    slug: "cinnamon-sticks",
    name: "Cinnamon Sticks",
    category: "Whole Spices",
    price: 160,
    mrp: 200,
    image: "/images/spices/cinnamon.avif",
    description: "Warm cinnamon for sweet and savoury recipes.",
  },
  {
    slug: "cumin-powder",
    name: "Cumin Powder",
    category: "Ground Spices",
    price: 130,
    mrp: 160,
    image: "/images/spices/cumin.jpg",
    description: "Earthy flavour for curries and everyday meals.",
  },
  {
    slug: "garam-masala",
    name: "Garam Masala",
    category: "Spice Blends",
    price: 150,
    mrp: 180,
    image: "/images/spices/masala.jpg",
    description: "A versatile spice blend for rich, flavourful dishes.",
    badge: "Customer Favourite",
  },
  {
    slug: "biriyani-masala",
    name: "Biriyani Masala",
    category: "Spice Blends",
    price: 170,
    mrp: 210,
    image: "/images/spices/biriyani-masala.avif",
    description: "A fragrant blend for your biriyani recipes.",
  },
];

export default function SpicesPage() {
  const { addToCart } = useCart();

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const categories = [
    "All",
    "Ground Spices",
    "Whole Spices",
    "Spice Blends",
  ];

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch =
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(search.toLowerCase());

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

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#29271f]">
      {/* Full-width hero banner */}
      <section className="w-full">
        <div className="relative flex min-h-[480px] w-full items-center overflow-hidden sm:min-h-[560px] lg:min-h-[650px]">
          <img
            src="/images/spices/banner.avif"
            alt="Collection of aromatic spices"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e5c99e] sm:text-sm">
              Imaans Store · Authentic Flavours
            </p>

            <h1 className="mt-5 max-w-2xl text-5xl font-medium leading-tight text-white sm:text-6xl lg:text-8xl">
              A World of
              <span className="mt-2 block font-serif italic text-[#e5c99e]">
                Spices
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
              Discover aromatic spices and flavourful blends to bring
              your favourite recipes to life.
            </p>

            <a
              href="#products"
              className="mt-8 inline-flex items-center rounded-full bg-[#806044] px-8 py-4 text-sm font-medium text-white transition duration-300 hover:bg-[#624832]"
            >
              Explore Spices <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Products section */}
      <section
        id="products"
        className="mx-auto max-w-7xl scroll-mt-6 px-4 pb-20 pt-12 sm:px-8 lg:px-12"
      >
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#806044]">
              Fresh flavour, every day
            </p>

            <h2 className="mt-2 text-3xl font-medium sm:text-4xl">
              Shop Our Spices
            </h2>
          </div>

          <p className="text-sm text-[#81786c]">
            {visibleProducts.length} products
          </p>
        </div>

        {/* Search and sorting */}
        <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search spices..."
            aria-label="Search spices"
            className="min-w-0 rounded-lg border border-[#e3dbcf] bg-white px-4 py-3 text-sm outline-none focus:border-[#806044]"
          />

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort spices"
            className="rounded-lg border border-[#e3dbcf] bg-white px-4 py-3 text-sm outline-none focus:border-[#806044]"
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
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm transition ${
                category === item
                  ? "border-[#806044] bg-[#806044] text-white"
                  : "border-[#e3dbcf] bg-white hover:border-[#806044]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 items-stretch gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <article
                key={product.slug}
                className="group flex min-w-0 flex-col"
              >
                {/* Product image */}
                <a
                  href={`/product/${product.slug}`}
                  className="relative block aspect-[4/5] shrink-0 overflow-hidden rounded-xl bg-[#eee8df]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {product.badge && (
                    <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#806044] sm:text-xs">
                      {product.badge}
                    </span>
                  )}
                </a>

                {/* Product details */}
                <div className="flex flex-1 flex-col">
                  <p className="mt-4 text-[10px] uppercase tracking-widest text-[#8b8175] sm:text-xs">
                    {product.category}
                  </p>

                  <h3 className="mt-1 text-sm font-medium sm:text-base">
                    {product.name}
                  </h3>

                  {/* Fixed description height keeps prices aligned */}
                  <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-[#777168] sm:text-sm">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold sm:text-base">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    <span className="text-xs text-[#999187] line-through">
                      ₹{product.mrp.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Button stays at the bottom of every card */}
                  <button
                    type="button"
                    onClick={() =>
                      addToCart({
                        id: product.slug,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      })
                    }
                    className="mt-auto w-full rounded-full border border-[#806044] px-3 py-2.5 text-xs transition hover:bg-[#806044] hover:text-white sm:mt-4 sm:text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-[#777168]">
            No spices found. Try another search.
          </p>
        )}

        {/* Bottom promotional section */}
        <div className="mt-16 rounded-2xl bg-[#eee6d8] px-6 py-10 text-center sm:py-14">
          <p className="text-xs uppercase tracking-[0.25em] text-[#806044]">
            Imaans Store
          </p>

          <h2 className="mt-3 text-2xl font-medium sm:text-3xl">
            Bring home the taste of tradition.
          </h2>

          <p className="mt-3 text-sm text-[#71695e]">
            Explore spices for everyday cooking and special occasions.
          </p>

          <a
            href="#products"
            className="mt-6 inline-block rounded-full bg-[#806044] px-7 py-3 text-sm text-white transition hover:bg-[#624832]"
          >
            Shop Spices
          </a>
        </div>
      </section>
    </main>
  );
}