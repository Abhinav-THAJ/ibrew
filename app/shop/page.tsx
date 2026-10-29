"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
  Layers,
  ArrowUpDown,
  Truck,
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { formatPrice, ProductItem } from "@/data/products";

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  coffee: "/images/coffee/arabica.jpeg",
  spices: "/images/spices/cardamom.avif",
  perfumeoil: "/images/Elegant Bottle Display.png",
  importedbed: "/images/importedbed/double-bed.jpeg",
};

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [dbProducts, setDbProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        const res = await fetch("/api/products", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
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
              image: item.images?.[0]?.url || DEFAULT_CATEGORY_IMAGES[item.category] || "/images/coffebags.png",
              images: Array.isArray(item.images)
                ? item.images.map((i: any) => (typeof i === "string" ? i : i?.url)).filter(Boolean)
                : [],
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
      } finally {
        setLoading(false);
      }
    }
    loadDbProducts();
  }, []);

  // ONLY products present in backend database are shown on the storefront
  const allProducts = dbProducts;

  const [categoriesList, setCategoriesList] = useState<{ id: string; label: string; icon?: any }[]>([
    { id: "all", label: "All Offerings", icon: Sparkles },
    { id: "coffee", label: "Estate Coffee", icon: Coffee },
    { id: "spices", label: "Estate Spices", icon: Leaf },
    { id: "perfumeoil", label: "Rare Fragrance Oils", icon: Flower2 },
    { id: "importedbed", label: "Mattresses", icon: Layers },
    { id: "grocery", label: "Grocery", icon: ShoppingBag },
    { id: "dates", label: "Dates", icon: Sparkles },
    { id: "bulk-order", label: "Bulk Order", icon: Truck },
  ]);

  useEffect(() => {
    async function loadDynamicCategories() {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const iconMap: Record<string, any> = {
              coffee: Coffee,
              spices: Leaf,
              perfumeoil: Flower2,
              importedbed: Layers,
              grocery: ShoppingBag,
              dates: Sparkles,
              "bulk-order": Truck,
              bulkorder: Truck,
            };
            const mapped = [
              { id: "all", label: "All Offerings", icon: Sparkles },
              ...data.map((c: any) => ({
                id: c.slug,
                label: c.name,
                icon: iconMap[c.slug] || Sparkles,
              })),
            ];
            setCategoriesList(mapped);
          }
        }
      } catch (e) {
        console.warn("Could not load categories:", e);
      }
    }
    loadDynamicCategories();
  }, []);

  const categories = useMemo(() => {
    const list = [...categoriesList];
    const seen = new Set(list.map((c) => c.id));
    allProducts.forEach((p) => {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        list.push({
          id: p.category,
          label: p.category.charAt(0).toUpperCase() + p.category.slice(1),
          icon: Sparkles,
        });
      }
    });
    return list;
  }, [categoriesList, allProducts]);

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
    <div className="pb-24 bg-[#120F0D] text-[#FAF7F2]">
      
      {/* 1. EDITORIAL HEADER */}
      <section className="bg-[#171311] text-[#FAF7F2] py-14 sm:py-20 border-b border-[#2C2420]">
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
      <div className="sticky top-18 z-30 bg-[#171311]/95 backdrop-blur-md border-b border-white/10 py-4 shadow-lg">
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
                      ? "bg-[#D6B27C] text-[#120F0D] shadow-md font-bold"
                      : "bg-[#201A17] text-[#FAF7F2] hover:bg-[#2A231F] border border-white/10"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-[#120F0D]" : "text-[#D6B27C]"} />
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-[#120F0D] text-[#D6B27C]" : "bg-white/10 text-white/70"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/8">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, origin, or notes..."
                className="w-full pl-9 pr-9 py-2 rounded-full bg-[#1E1916] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D6B27C]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
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
                      ? "bg-[#D6B27C] text-[#120F0D] font-bold"
                      : "bg-[#201A17] text-white/80 hover:bg-[#2A231F]"
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
                        ? "bg-[#D6B27C] text-[#120F0D] font-bold"
                        : "bg-[#201A17] text-white/80 hover:bg-[#2A231F]"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label htmlFor="shop-sort" className="text-xs text-[#C4B7A7] flex items-center gap-1">
                <ArrowUpDown size={12} />
                <span>Sort:</span>
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-full bg-[#1E1916] border border-white/15 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-[#D6B27C]"
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
        <div className="flex items-center justify-between mb-6 text-xs text-[#C4B7A7]">
          <span>
            Showing <strong className="text-white">{filteredProducts.length}</strong> offerings
          </span>
          {activeCategory !== "all" && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setActiveSubCategory("all");
              }}
              className="text-[#D6B27C] hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-[#1E1916] p-4 space-y-4 animate-pulse">
                <div className="h-60 rounded-xl bg-white/5" />
                <div className="h-4 w-2/3 rounded bg-white/5" />
                <div className="h-3 w-1/2 rounded bg-white/5" />
                <div className="h-8 rounded-full bg-white/5" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 p-16 text-center space-y-4 max-w-md mx-auto my-12">
            <p className="text-3xl">🌿</p>
            <h3 className="text-xl font-serif font-bold text-white">
              No offerings matched your filter
            </h3>
            <p className="text-xs text-[#C4B7A7]">
              Try clearing your search query or selecting another category from above.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setActiveSubCategory("all");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#D6B27C] text-[#120F0D] px-5 py-2.5 text-xs font-bold tracking-wider uppercase"
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
                  className="group flex flex-col bg-[#1E1916] rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#D6B27C]/40"
                >
                  <Link
                    href={`/shop/${product.id}`}
                    className="relative h-64 w-full overflow-hidden bg-white/5 block cursor-pointer"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#120F0D] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                        {product.badge}
                      </span>
                    )}
                    {product.origin && (
                      <span className="absolute bottom-3 left-3 bg-[#120F0D]/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
                        {product.origin}
                      </span>
                    )}
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#C4B7A7] mb-1">
                        <span className="uppercase tracking-wider font-semibold text-[#D6B27C]">
                          {product.subCategory}
                        </span>
                        <div className="flex items-center gap-1 text-[#D6B27C]">
                          <Star size={11} fill="#D6B27C" />
                          <span className="font-bold text-white text-[11px]">
                            {product.rating}
                          </span>
                        </div>
                      </div>

                      <Link href={`/shop/${product.id}`} className="block">
                        <h3 className="text-base font-serif font-bold text-white leading-snug group-hover:text-[#D6B27C] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#C4B7A7] mt-1 line-clamp-2 leading-relaxed">
                        {product.tagline || product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-2">
                      <Link href={`/shop/${product.id}`}>
                        <div className="text-sm sm:text-base font-bold text-white">
                          {formatPrice(product.price)}
                        </div>
                        {product.mrp > product.price && (
                          <div className="text-[10px] text-white/40 line-through">
                            MRP {formatPrice(product.mrp)}
                          </div>
                        )}
                      </Link>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/shop/${product.id}`}
                          className="text-[11px] font-semibold text-[#D6B27C] hover:text-white px-2.5 py-1.5 rounded-full border border-[#D6B27C]/30 hover:border-[#D6B27C] transition-colors"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAdd(product)}
                          className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-bold tracking-wider uppercase transition-all active:scale-95 shadow-sm ${
                            isAdded
                              ? "bg-[#52B788] text-white"
                              : "bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D]"
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
    <Suspense fallback={<div className="py-24 text-center text-sm font-serif text-[#FAF7F2]">Loading ibrew catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
