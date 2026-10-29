"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Sparkles,
  ShoppingBag,
  Star,
  Check,
  X,
  Coffee,
  Leaf,
  Flower2,
  BedDouble,
  ArrowUpDown,
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { INITIAL_PRODUCTS, formatPrice, ProductItem } from "@/data/products";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [dbProducts, setDbProducts] = useState<ProductItem[]>([]);

  const { addToCart } = useCart();

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
      setActiveSubCategory("all");
    }
  }, [categoryParam]);

  useEffect(() => {
    async function loadDbProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: ProductItem[] = data.map((item: any) => ({
              id: item._id,
              name: item.name,
              tagline: item.description?.slice(0, 80) || "",
              description: item.description || "",
              category: item.category,
              subCategory: item.subCategory || "General",
              price: item.price,
              mrp: item.mrp || item.price,
              rating: 5.0,
              reviewsCount: 12,
              image: item.images?.[0]?.url || "/images/coffebags.png",
              badge: item.badge || undefined,
              featured: item.featured || false,
              stock: item.stock || 20,
              weightOrSize: item.subCategory,
              origin: "Artisanal Reserve",
            }));
            setDbProducts(mapped);
          }
        }
      } catch (e) {
        console.error("Failed to fetch MongoDB products:", e);
      }
    }
    loadDbProducts();
  }, []);

  const allProducts = useMemo(() => {
    const combined = [...dbProducts, ...INITIAL_PRODUCTS];
    const unique = new Map<string, ProductItem>();
    combined.forEach((item) => {
      if (!unique.has(item.id)) unique.set(item.id, item);
    });
    return Array.from(unique.values());
  }, [dbProducts]);

  const categories = [
    { id: "all", label: "All Offerings", icon: Sparkles },
    { id: "coffee", label: "Estate Coffee", icon: Coffee },
    { id: "spices", label: "Estate Spices", icon: Leaf },
    { id: "perfumeoil", label: "Rare Fragrance Oils", icon: Flower2 },
    { id: "importedbed", label: "Luxury Living & Beds", icon: BedDouble },
  ];

  const availableSubCategories = useMemo(() => {
    if (activeCategory === "all") return [];
    const subs = new Set<string>();
    allProducts
      .filter((p) => p.category === activeCategory)
      .forEach((p) => {
        if (p.subCategory) subs.add(p.subCategory);
      });
    return Array.from(subs);
  }, [activeCategory, allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((item) => {
        if (activeCategory !== "all" && item.category !== activeCategory) {
          return false;
        }
        if (activeSubCategory !== "all" && item.subCategory !== activeSubCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchTag = item.tagline.toLowerCase().includes(q);
          const matchSub = item.subCategory.toLowerCase().includes(q);
          return matchName || matchDesc || matchTag || matchSub;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [allProducts, activeCategory, activeSubCategory, searchQuery, sortBy]);

  const handleAdd = (item: ProductItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="pb-24">
      
      {/* 1. EDITORIAL HEADER */}
      <section className="bg-[#1D1815] text-[#FAF7F2] py-14 sm:py-20 border-b border-[#2C2420]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-bold tracking-widest uppercase text-[#D6B27C]">
            ibrew Catalog &amp; Private Reserve
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-white">
            The Complete Collection
          </h1>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-[#C4B7A7] leading-relaxed">
            Directly traded whole beans, sun-dried extra-bold spices, traditional attar distillations, and European ergonomic sleep systems.
          </p>
        </div>
      </section>

      {/* 2. CATEGORY PILLS & TOOLBAR */}
      <div className="sticky top-18 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#1D1815]/10 py-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const count =
                cat.id === "all"
                  ? allProducts.length
                  : allProducts.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveSubCategory("all");
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shrink-0 transition-all active:scale-95 ${
                    isActive
                      ? "bg-[#1D1815] text-white shadow-md"
                      : "bg-white text-[#1D1815]/70 hover:text-[#1D1815] border border-[#1D1815]/10 hover:border-[#1D1815]/30"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-[#D6B27C]" : "text-[#A85A34]"} />
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-[#3A3029] text-[#D6B27C]" : "bg-[#F5EFEB] text-[#1D1815]/50"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#1D1815]/8">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1D1815]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, origin, or notes..."
                className="w-full pl-9 pr-9 py-2 rounded-full bg-white border border-[#1D1815]/15 text-xs text-[#1D1815] placeholder-[#1D1815]/40 focus:outline-none focus:border-[#6E442B]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1D1815]/40 hover:text-[#1D1815]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {availableSubCategories.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveSubCategory("all")}
                  className={`px-3 py-1 rounded-full font-medium transition-colors ${
                    activeSubCategory === "all"
                      ? "bg-[#6E442B] text-white"
                      : "bg-[#F5EFEB] text-[#1D1815]/70 hover:bg-[#E8DCCF]"
                  }`}
                >
                  All Types
                </button>
                {availableSubCategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setActiveSubCategory(sub)}
                    className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                      activeSubCategory === sub
                        ? "bg-[#6E442B] text-white"
                        : "bg-[#F5EFEB] text-[#1D1815]/70 hover:bg-[#E8DCCF]"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label htmlFor="shop-sort" className="text-xs text-[#1D1815]/60 flex items-center gap-1">
                <ArrowUpDown size={12} />
                <span>Sort:</span>
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-full bg-white border border-[#1D1815]/15 px-3 py-1.5 text-xs font-semibold text-[#1D1815] focus:outline-none focus:border-[#6E442B]"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT CATALOG GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6 text-xs text-[#1D1815]/60">
          <span>
            Showing <strong className="text-[#1D1815]">{filteredProducts.length}</strong> offerings
          </span>
          {activeCategory !== "all" && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setActiveSubCategory("all");
              }}
              className="text-[#A85A34] hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#1D1815]/20 p-16 text-center space-y-4 max-w-md mx-auto my-12">
            <p className="text-3xl">🌿</p>
            <h3 className="text-xl font-serif font-bold text-[#1D1815]">
              No offerings matched your filter
            </h3>
            <p className="text-xs text-[#1D1815]/70">
              Try clearing your search query or selecting another category from above.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setActiveSubCategory("all");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#1D1815] text-white px-5 py-2.5 text-xs font-semibold tracking-wider uppercase"
            >
              Show All Offerings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = addedId === product.id;
              return (
                <article
                  key={product.id}
                  className="group flex flex-col bg-white rounded-2xl border border-[#1D1815]/8 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#6E442B]/30"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-[#F5EFEB]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#1D1815] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        {product.badge}
                      </span>
                    )}
                    {product.origin && (
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#1D1815] text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#1D1815]/10">
                        {product.origin}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#1D1815]/60 mb-1">
                        <span className="uppercase tracking-wider font-semibold text-[#A85A34]">
                          {product.subCategory}
                        </span>
                        <div className="flex items-center gap-1 text-[#D6B27C]">
                          <Star size={11} fill="#D6B27C" />
                          <span className="font-bold text-[#1D1815] text-[11px]">
                            {product.rating}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base font-serif font-bold text-[#1D1815] leading-snug group-hover:text-[#A85A34] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#1D1815]/65 mt-1 line-clamp-2 leading-relaxed">
                        {product.tagline || product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1D1815]/8 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm sm:text-base font-bold text-[#1D1815]">
                          {formatPrice(product.price)}
                        </div>
                        {product.mrp > product.price && (
                          <div className="text-[10px] text-[#1D1815]/40 line-through">
                            MRP {formatPrice(product.mrp)}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdd(product)}
                        className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-bold tracking-wider uppercase transition-all active:scale-95 shadow-sm ${
                          isAdded
                            ? "bg-[#355E3B] text-white"
                            : "bg-[#1D1815] hover:bg-[#A85A34] text-white"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={13} /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={13} /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm font-serif">Loading ibrew catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
