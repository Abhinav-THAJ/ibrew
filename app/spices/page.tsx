"use client";

import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
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

const categories = ["All", "Ground Spices", "Whole Spices", "Spice Blends"];

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// Square product image with badge and an add-to-cart button on top.
// Mobile: small round cart icon in the corner.
// sm and up: full-width "Add to Cart" bar.
function ProductImage({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-[#F8E7A1] sm:rounded-2xl">
      {/* Image links to the product detail page */}
      <a
        href={`/product/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="block h-full w-full"
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
            <span className="text-sm text-[#8F2525]">Image unavailable</span>
          </div>
        )}
      </a>

      {product.badge && (
        <span className="pointer-events-none absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-full bg-[#FFF9E8] px-2.5 py-1 text-[9px] font-semibold text-[#8F2525] shadow-sm sm:left-3 sm:top-3 sm:text-xs">
          {product.badge}
        </span>
      )}

      <button
        type="button"
        onClick={onAddToCart}
        aria-label={`Add ${product.name} to cart`}
        className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-[#FFF9E8]/95 text-[#805000] shadow-sm transition hover:bg-[#D4A017] hover:text-[#40240B] focus:outline-none focus:ring-2 focus:ring-[#D4A017] sm:bottom-3 sm:left-3 sm:right-3 sm:h-11 sm:w-auto sm:text-sm sm:font-semibold"
      >
        <ShoppingBag size={16} />
        <span className="hidden sm:inline">Add to Cart</span>
      </button>
    </div>
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

      const matchesSearch = searchText.includes(search.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [category, search, sort]);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#FFF9E8] text-[#40240B]">
      {/* Full-width hero banner */}
      <section className="w-full">
        <div className="relative flex min-h-[420px] w-full items-center overflow-hidden sm:min-h-[520px] lg:min-h-[650px]">
          <img
            src="/images/spices/banner.avif"
            alt="Collection of aromatic spices"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-[#40240B]/55" />

          {/* Text is centered on mobile and left-aligned from lg up */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-24 lg:text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFD54A] min-[400px]:text-xs sm:text-sm sm:tracking-[0.28em]">
              Imaan&apos;s Store · Authentic Flavours
            </p>

            <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-medium leading-tight text-white min-[400px]:text-4xl sm:mt-5 sm:text-6xl lg:mx-0 lg:text-8xl">
              A World of
              <span className="mt-1 block font-serif italic text-[#FFD54A] sm:mt-2">
                Spices
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/90 sm:mt-6 sm:text-base sm:leading-8 lg:mx-0">
              Discover aromatic spices and flavourful blends to bring
              your favourite recipes to life.
            </p>

            {/* Full width on mobile, normal width from sm up */}
            <a
              href="#products"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#D4A017] px-6 py-3 text-sm font-semibold text-[#40240B] transition duration-300 hover:bg-[#B8860B] sm:mt-8 sm:w-auto sm:px-8 sm:py-4"
            >
              Explore Spices <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Products section */}
      <section
        id="products"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-12 pt-9 sm:px-8 sm:pb-20 sm:pt-12 lg:px-12"
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

        {/* Search and sorting: stacked and full width on mobile */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search spices..."
            aria-label="Search spices"
            className="min-h-11 w-full min-w-0 rounded-lg border border-[#E8D8A8] bg-white px-4 py-3 text-sm text-[#40240B] outline-none transition placeholder:text-[#96876C] focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20"
          />

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort spices"
            className="min-h-11 w-full min-w-0 rounded-lg border border-[#E8D8A8] bg-white px-4 py-3 text-sm text-[#40240B] outline-none transition focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 sm:w-auto"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {/* Category filters: wrap and center on mobile */}
        <div className="mb-7 flex flex-wrap justify-center gap-2 sm:mb-8 sm:justify-start">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`min-h-10 rounded-full border px-4 py-2.5 text-xs font-medium transition sm:px-5 sm:text-sm ${
                category === item
                  ? "border-[#D4A017] bg-[#D4A017] text-[#40240B]"
                  : "border-[#E8D8A8] bg-white text-[#40240B] hover:border-[#D4A017] hover:bg-[#FFF0BC]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Product grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <article key={product.id} className="group flex min-w-0 flex-col">
                <ProductImage
                  product={product}
                  onAddToCart={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                />

                <div className="pt-3 sm:pt-4">
                  <p className="text-[9px] uppercase tracking-wider text-[#8F2525] sm:text-xs sm:tracking-widest">
                    {product.category}
                  </p>

                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-[#40240B] sm:text-base">
                    {product.name}
                  </h3>

                  {/* Description is hidden on small phones to keep cards compact */}
                  <p className="mt-1 line-clamp-2 hidden min-h-10 text-sm leading-5 text-[#786C59] sm:block">
                    {product.description}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-3">
                    <span className="text-sm font-bold text-[#8F2525] sm:text-base">
                      {formatPrice(product.price)}
                    </span>

                    <span className="text-xs text-[#96876C] line-through">
                      {formatPrice(product.mrp)}
                    </span>
                  </div>
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
        <div className="mt-12 rounded-2xl border border-[#F0D88A] bg-[#F8E7A1] px-4 py-8 text-center sm:mt-16 sm:px-6 sm:py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8F2525] sm:text-xs sm:tracking-[0.25em]">
            Imaan&apos;s Store
          </p>

          <h2 className="mt-3 text-xl font-medium leading-snug text-[#40240B] sm:text-3xl">
            Bring home the taste of tradition.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#604D31]">
            Explore spices for everyday cooking and special occasions.
          </p>

          <a
            href="#products"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#8F2525] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#701A1A] sm:mt-6 sm:w-auto sm:px-7"
          >
            Shop Spices
          </a>
        </div>
      </section>
    </main>
  );
}