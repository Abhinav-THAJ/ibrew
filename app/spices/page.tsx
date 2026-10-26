
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
    id: 301,
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
    id: 302,
    slug: "red-chilli",
    name: "Red Chilli Powder",
    category: "Ground Spices",
    price: 140,
    mrp: 175,
    image: "/images/spices/chilli.avif",
    description: "Rich colour and bold flavour for your dishes.",
  },
  {
    id: 303,
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
    id: 304,
    slug: "green-cardamom",
    name: "Green Cardamom",
    category: "Whole Spices",
    price: 320,
    mrp: 390,
    image: "/images/spices/cardamom.avif",
    description: "Fragrant cardamom for tea and desserts.",
  },
  {
    id: 305,
    slug: "cinnamon-sticks",
    name: "Cinnamon Sticks",
    category: "Whole Spices",
    price: 160,
    mrp: 200,
    image: "/images/spices/cinnamon.avif",
    description: "Warm cinnamon for sweet and savoury recipes.",
  },
  {
    id: 306,
    slug: "cumin-powder",
    name: "Cumin Powder",
    category: "Ground Spices",
    price: 130,
    mrp: 160,
    image: "/images/spices/cumin.jpg",
    description: "Earthy flavour for curries and everyday meals.",
  },
  {
    id: 307,
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
    id: 308,
    slug: "biriyani-masala",
    name: "Biriyani Masala",
    category: "Spice Blends",
    price: 170,
    mrp: 210,
    image: "/images/spices/biriyani-masala.avif",
    description: "A fragrant blend for your biriyani recipes.",
  },
];

const categories = [
  "All",
  "Ground Spices",
  "Whole Spices",
  "Spice Blends",
];

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// Square product images without emojis or arch styling
function ProductImage({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      href={`/product/${product.slug}`}
      aria-label={`View ${product.name}`}
      className="group relative block aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-[#F8E7A1] sm:rounded-2xl"
    >
      {!imageError ? (
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#F8E7A1]">
          <span className="text-sm text-[#8F2525]">
            Image unavailable
          </span>
        </div>
      )}

      {product.badge && (
        <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-full bg-[#FFF9E8] px-2.5 py-1 text-[9px] font-semibold text-[#8F2525] shadow-sm sm:left-3 sm:top-3 sm:text-xs">
          {product.badge}
        </span>
      )}
    </a>
  );
}

export default function SpicesPage() {
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
    } else if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [category, search, sort]);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#FFF9E8] text-[#40240B]">
      {/* Full-width hero banner */}
      <section className="w-full">
        <div className="relative flex min-h-[390px] w-full items-center overflow-hidden sm:min-h-[520px] lg:min-h-[650px]">
          <img
            src="/images/spices/banner.avif"
            alt="Collection of aromatic spices"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-[#40240B]/55" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-24">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFD54A] min-[400px]:text-xs sm:text-sm sm:tracking-[0.28em]">
              Imaan&apos;s Store · Authentic Flavours
            </p>

            <h1 className="mt-4 max-w-2xl text-4xl font-medium leading-tight text-white min-[400px]:text-5xl sm:mt-5 sm:text-6xl lg:text-8xl">
              A World of
              <span className="mt-1 block font-serif italic text-[#FFD54A] sm:mt-2">
                Spices
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/90 sm:mt-6 sm:text-base sm:leading-8">
              Discover aromatic spices and flavourful blends to bring
              your favourite recipes to life.
            </p>

            <a
              href="#products"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#D4A017] px-6 py-3 text-sm font-semibold text-[#40240B] transition duration-300 hover:bg-[#B8860B] sm:mt-8 sm:px-8 sm:py-4"
            >
              Explore Spices <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Products section */}
      <section
        id="products"
        className="mx-auto max-w-7xl scroll-mt-5 px-4 pb-12 pt-9 sm:scroll-mt-6 sm:px-8 sm:pb-20 sm:pt-12 lg:px-12"
      >
        <div className="mb-6 flex flex-col justify-between gap-2 sm:mb-7 sm:flex-row sm:items-end sm:gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8F2525] sm:text-xs sm:tracking-[0.22em]">
              Fresh flavour, every day
            </p>

            <h2 className="mt-2 text-2xl font-medium text-[#40240B] sm:text-4xl">
              Shop Our Spices
            </h2>
          </div>

          <p className="text-xs text-[#78654B] sm:text-sm">
            {visibleProducts.length}{" "}
            {visibleProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Search and sorting */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search spices..."
            aria-label="Search spices"
            className="min-h-11 min-w-0 rounded-lg border border-[#E8D8A8] bg-white px-4 py-3 text-sm text-[#40240B] outline-none transition placeholder:text-[#96876C] focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20"
          />

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort spices"
            className="min-h-11 min-w-0 rounded-lg border border-[#E8D8A8] bg-white px-4 py-3 text-sm text-[#40240B] outline-none transition focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {/* Category filters */}
        <div className="mb-7 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mb-8">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`min-h-10 shrink-0 rounded-full border px-4 py-2.5 text-xs font-medium transition sm:px-5 sm:text-sm ${
                category === item
                  ? "border-[#D4A017] bg-[#D4A017] text-[#40240B]"
                  : "border-[#E8D8A8] bg-white text-[#40240B] hover:border-[#D4A017] hover:bg-[#FFF0BC]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Responsive square product grid */}
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 items-stretch gap-x-3 gap-y-7 min-[400px]:gap-x-4 min-[400px]:gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <article
                key={product.id}
                className="group flex min-w-0 flex-col"
              >
                <ProductImage product={product} />

                <div className="flex flex-1 flex-col">
                  <p className="mt-3 text-[9px] uppercase tracking-wider text-[#8F2525] min-[400px]:text-[10px] sm:mt-4 sm:text-xs sm:tracking-widest">
                    {product.category}
                  </p>

                  <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[#40240B] min-[400px]:text-sm sm:text-base">
                    {product.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 min-h-9 text-[10px] leading-4 text-[#786C59] min-[400px]:text-xs sm:min-h-10 sm:text-sm sm:leading-5">
                    {product.description}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-3">
                    <span className="text-xs font-bold text-[#8F2525] sm:text-base">
                      {formatPrice(product.price)}
                    </span>

                    <span className="text-[10px] text-[#96876C] line-through sm:text-xs">
                      {formatPrice(product.mrp)}
                    </span>
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
                    className="mt-auto min-h-10 w-full rounded-full border border-[#D4A017] bg-transparent px-2 py-2 text-[10px] font-semibold text-[#805000] transition hover:bg-[#D4A017] hover:text-[#40240B] focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:ring-offset-2 sm:mt-4 sm:min-h-11 sm:border-2 sm:px-3 sm:text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#E8D8A8] bg-white px-4 py-12 text-center sm:py-16">
            <p className="text-base font-medium text-[#40240B]">
              No spices found
            </p>

            <p className="mt-2 text-sm text-[#786C59]">
              Try a different search or select another category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setSort("featured");
              }}
              className="mt-5 rounded-full bg-[#D4A017] px-5 py-2.5 text-sm font-semibold text-[#40240B] transition hover:bg-[#B8860B]"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Bottom promotional section */}
        <div className="mt-12 rounded-2xl border border-[#F0D88A] bg-[#F8E7A1] px-5 py-8 text-center sm:mt-16 sm:px-6 sm:py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8F2525] sm:text-xs sm:tracking-[0.25em]">
            Imaan&apos;s Store
          </p>

          <h2 className="mt-3 text-xl font-medium leading-snug text-[#40240B] sm:text-3xl">
            Bring home the taste of tradition.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-[#604D31] sm:text-sm sm:leading-6">
            Explore spices for everyday cooking and special occasions.
          </p>

          <a
            href="#products"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#8F2525] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#701A1A] sm:mt-6 sm:px-7"
          >
            Shop Spices
          </a>
        </div>
      </section>
    </main>
  );
}
