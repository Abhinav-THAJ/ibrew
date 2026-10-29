"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Check,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  MessageCircle,
  Plus,
  Minus,
  Clock,
  Award,
  ChevronDown,
  Edit3,
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import {
  formatPrice,
  ProductItem,
} from "@/data/products";

const CATEGORY_NAMES: Record<string, string> = {
  coffee: "Artisanal Coffee",
  spices: "Malabar Spices",
  perfumeoil: "Rare Fragrance Oils",
  importedbed: "Mattresses",
};

function SingleProductContent() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [activeImage, setActiveImage] = useState<string>("");
  const [dbProduct, setDbProduct] = useState<ProductItem | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromApi() {
      try {
        const res = await fetch(`/api/products/${productId}`, { cache: "no-store" });
        if (res.ok) {
          const item = await res.json();
          if (item) {
            const imgList: string[] = Array.isArray(item.images)
              ? item.images
                  .map((img: any) => (typeof img === "string" ? img : img?.url))
                  .filter(Boolean)
              : [];
            const primary = imgList[0] || item.images?.[0]?.url || "/images/coffebags.png";

            setDbProduct({
              id: item._id,
              name: item.name,
              tagline: item.description?.slice(0, 90) || "",
              description: item.description || "",
              category: item.category || "coffee",
              subCategory: item.subCategory || "Estate Selection",
              price: item.price,
              mrp: item.mrp || item.price,
              rating: 5.0,
              reviewsCount: 14,
              image: primary,
              images: imgList,
              badge: item.badge || undefined,
              stock: item.stock || 25,
              weightOrSize: item.subCategory || "Standard",
              origin: "Estate Direct",
            });
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load product by ID from API:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFromApi();
  }, [productId]);

  const product = dbProduct;

  const allGalleryImages: string[] = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [product]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.images?.[0] || product.image);
    }
  }, [product]);

  // Load related items live from backend database
  useEffect(() => {
    if (!product?.category) return;
    const currentCategory = product.category;
    const currentId = product.id;
    async function loadRelated() {
      try {
        const res = await fetch(`/api/products?category=${encodeURIComponent(currentCategory)}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped = data
              .filter((item: any) => item._id !== currentId)
              .slice(0, 4)
              .map((item: any) => ({
                id: item._id,
                name: item.name,
                tagline: item.description?.slice(0, 90) || "",
                description: item.description || "",
                category: item.category,
                subCategory: item.subCategory || "Estate Selection",
                price: item.price,
                mrp: item.mrp || item.price,
                rating: 5.0,
                reviewsCount: 14,
                image: item.images?.[0]?.url || "/images/coffebags.png",
                badge: item.badge || undefined,
                stock: item.stock || 25,
                weightOrSize: item.subCategory || "Standard",
                origin: "Estate Direct",
              }));
            setRelatedProducts(mapped);
          }
        }
      } catch (err) {
        console.warn("Could not load related products from backend:", err);
      }
    }
    loadRelated();
  }, [product?.category, product?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-[#120F0D] text-[#FAF7F2]">
        <div className="h-12 w-12 rounded-full border-2 border-[#D6B27C] border-t-transparent animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#D6B27C] font-semibold">
          Curating Offering Details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#120F0D] text-[#FAF7F2] space-y-5">
        <div className="h-20 w-20 rounded-full bg-[#1E1916] border border-white/10 flex items-center justify-center text-[#D6B27C] text-3xl shadow-inner">
          🌿
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-white">
          Offering Not Found
        </h1>
        <p className="text-sm text-[#C4B7A7] max-w-md">
          The artisanal item you are looking for may have been archived or retired from this seasonal harvest.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-[#D6B27C] text-[#120F0D] px-7 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#C29B38] transition-all shadow-lg"
        >
          <ArrowLeft size={15} /> Return to Shop
        </Link>
      </div>
    );
  }

  const categoryLabel = CATEGORY_NAMES[product.category] || "Artisanal Collection";
  const discountPercent =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const accordionItems = [
    {
      title: "Estate Provenance & Terroir",
      content: `Cultivated exclusively at ${product.origin || "generational coordinate estates"}. Sourced in direct partnership with independent master cultivators, free from commercial commodity brokers and chemical adulteration.`,
    },
    {
      title: "Artisanal Preparation & Connoisseur Notes",
      content:
        product.category === "coffee"
          ? "Micro-roasted weekly on 5kg cast-iron drums. Recommended extraction: Pour-Over (V60), Aeropress, or South Indian Traditional Brass Filter with 93°C spring water."
          : product.category === "spices"
          ? "Harvested at peak botanical maturity and sun-cured naturally on bamboo mats. Preserve in an airtight dark glass container away from direct sunlight."
          : product.category === "perfumeoil"
          ? "100% alcohol-free traditional copper deg-bhapka hydro-distillate. Apply sparingly onto pulse points—the fragrance gently amplifies with natural body warmth."
          : "Engineered with 100% biological organic materials and high-density pocket ergonomic support. Zero synthetic formaldehyde off-gassing.",
    },
    {
      title: "Pan-India Express Dispatch & Packaging",
      content:
        "Packed in UV-resistant one-way degassing pouches or shockproof luxury sleeves within 12 hours of preparation. Complimentary express air courier delivery on orders above ₹999.",
    },
  ];

  return (
    <div className="pb-28 pt-6 sm:pt-10 bg-[#120F0D] text-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB & BACK NAVIGATION */}
        <nav className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs text-[#C4B7A7] border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-white/30 shrink-0" />
            <Link href="/shop" className="hover:text-white transition-colors">
              Shop
            </Link>
            <ChevronRight size={13} className="text-white/30 shrink-0" />
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-[#D6B27C] transition-colors"
            >
              {categoryLabel}
            </Link>
            <ChevronRight size={13} className="text-white/30 shrink-0" />
            <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/admin/edit/${product.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D6B27C]/50 bg-[#241E1A] hover:bg-[#D6B27C] text-[#D6B27C] hover:text-[#120F0D] px-3.5 py-1.5 text-xs font-semibold tracking-wider transition-all duration-200 shadow-md"
              title="Edit product details, photos, price, and stock in Admin Panel"
            >
              <Edit3 size={12} />
              <span>Edit Offering (Admin)</span>
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Back to Catalog
            </Link>
          </div>
        </nav>

        {/* MAIN PRODUCT SHOWCASE (2 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          
          {/* LEFT: IMMERSIVE GALLERY & PROVENANCE PILLARS */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative h-[420px] sm:h-[520px] w-full rounded-3xl overflow-hidden bg-[#1E1916] border border-white/10 shadow-2xl group">
              <Image
                src={activeImage || product.image}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Badge Overlays */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.badge && (
                  <span className="bg-[#120F0D]/90 backdrop-blur-md text-[#D6B27C] border border-[#D6B27C]/40 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-[#A85A34] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {product.origin && (
                <div className="absolute bottom-4 left-4 z-10 bg-[#120F0D]/90 backdrop-blur-md text-white text-xs font-medium px-3.5 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5 shadow-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D6B27C]" />
                  <span>{product.origin}</span>
                </div>
              )}
            </div>

            {/* PHOTO GALLERY THUMBNAILS (SPACE 2 IMAGES) */}
            {allGalleryImages.length > 1 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[11px] text-[#A89A8C]">
                  <span className="font-bold uppercase tracking-wider text-[#D6B27C]">
                    Photo Gallery ({allGalleryImages.length} Views)
                  </span>
                  <span className="text-[10px]">Click thumbnail to inspect</span>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {allGalleryImages.map((imgUrl, idx) => {
                    const isSelected = (activeImage || product.image) === imgUrl;
                    return (
                      <button
                        key={imgUrl + idx}
                        type="button"
                        onClick={() => setActiveImage(imgUrl)}
                        className={`group relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? "border-[#D6B27C] ring-2 ring-[#D6B27C]/40 scale-105 shadow-xl"
                            : "border-white/15 opacity-70 hover:opacity-100 hover:border-white/40"
                        }`}
                      >
                        <img src={imgUrl} alt={`Angle ${idx + 1}`} className="h-full w-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#120F0D]/90 text-[8px] font-bold uppercase tracking-wider text-[#D6B27C] px-1 rounded">
                            Cover
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Provenance Micro-Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#1E1916] p-3.5 rounded-2xl border border-white/10 text-center space-y-1">
                <Sparkles size={16} className="mx-auto text-[#D6B27C]" />
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">Single-Lot</p>
                <p className="text-[10px] text-[#A89A8C]">Zero blends</p>
              </div>
              <div className="bg-[#1E1916] p-3.5 rounded-2xl border border-white/10 text-center space-y-1">
                <Award size={16} className="mx-auto text-[#D6B27C]" />
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">Artisan Roast</p>
                <p className="text-[10px] text-[#A89A8C]">Small drums</p>
              </div>
              <div className="bg-[#1E1916] p-3.5 rounded-2xl border border-white/10 text-center space-y-1">
                <Truck size={16} className="mx-auto text-[#D6B27C]" />
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">Air Express</p>
                <p className="text-[10px] text-[#A89A8C]">24-hr dispatch</p>
              </div>
              <div className="bg-[#1E1916] p-3.5 rounded-2xl border border-white/10 text-center space-y-1">
                <ShieldCheck size={16} className="mx-auto text-[#D6B27C]" />
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">Estate Direct</p>
                <p className="text-[10px] text-[#A89A8C]">Pure origin</p>
              </div>
            </div>
          </div>

          {/* RIGHT: CONNOISSEUR DOSSIER & PURCHASE ENGINE */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
                  {product.subCategory} • {categoryLabel}
                </span>
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 bg-[#1E1916] px-3 py-1 rounded-full border border-white/10 text-xs">
                  <Star size={13} fill="#D6B27C" className="text-[#D6B27C]" />
                  <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
                  <span className="text-white/40">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white leading-tight">
                {product.name}
              </h1>

              <p className="text-sm sm:text-base text-[#D6B27C] font-medium leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Price Section */}
            <div className="p-5 rounded-2xl bg-[#1E1916] border border-white/10 space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-white">
                  {formatPrice(product.price)}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-base text-white/40 line-through">
                    {formatPrice(product.mrp)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs bg-[#29221D] text-[#D6B27C] px-2.5 py-0.5 rounded-full border border-[#D6B27C]/30 font-semibold">
                    {discountPercent}% Connoisseur Saving
                  </span>
                )}
              </div>
              <p className="text-xs text-[#C4B7A7] flex items-center gap-2">
                <Clock size={13} className="text-[#D6B27C]" />
                <span>Inclusive of all taxes • Hand-packed fresh upon order</span>
              </p>
            </div>

            {/* Sensory Narrative */}
            <div className="text-sm sm:text-base text-[#E8DCCF] leading-relaxed border-t border-b border-white/10 py-5">
              <p>{product.description}</p>
            </div>

            {/* Specifications Snapshot */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-[#181412] p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[#A89A8C] uppercase tracking-wider block">Net Quantity / Size</span>
                <span className="font-bold text-white text-sm">{product.weightOrSize || "250g Artisanal Pack"}</span>
              </div>
              <div className="bg-[#181412] p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[#A89A8C] uppercase tracking-wider block">Harvest Estate Terroir</span>
                <span className="font-bold text-white text-sm">{product.origin || "Western Ghats, India"}</span>
              </div>
            </div>

            {/* Quantity Selector & CTAs */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A89A8C]">
                  Select Quantity:
                </span>
                <div className="inline-flex items-center rounded-full border border-white/20 bg-[#181412]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 sm:p-2.5 text-white/70 hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 sm:p-2.5 text-white/70 hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span className="text-xs text-[#A89A8C]">
                  Total: <strong className="text-white">{formatPrice(product.price * quantity)}</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2 ${
                    added
                      ? "bg-[#2F855A] text-white"
                      : "bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D]"
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={16} strokeWidth={2.5} />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} strokeWidth={2.2} />
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-[#201A17] hover:bg-[#2A231F] text-white border border-white/20 hover:border-[#D6B27C] transition-all flex items-center justify-center gap-2"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Direct Concierge WhatsApp button */}
              <a
                href={`https://wa.me/919995067188?text=${encodeURIComponent(
                  `Greetings ibrew Concierge, I would like to inquire about the ${product.name} (ID: ${product.id}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full text-xs font-semibold tracking-wider uppercase text-[#D6B27C] hover:text-white border border-[#D6B27C]/30 hover:border-[#D6B27C] flex items-center justify-center gap-2 transition-colors bg-[#1E1916]/50"
              >
                <MessageCircle size={15} />
                <span>Inquire Custom Grind / Wholesale via WhatsApp</span>
              </a>
            </div>

            {/* Accordion Tabs */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              {accordionItems.map((item, idx) => {
                const isOpen = activeTab === idx;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-[#1E1916] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveTab(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left text-xs font-bold uppercase tracking-wider text-white hover:text-[#D6B27C] transition-colors"
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 text-[#D6B27C] ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-[#C4B7A7] leading-relaxed border-t border-white/5">
                        {item.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* RELATED HARVEST OFFERINGS SECTION */}
        {relatedProducts.length > 0 && (
          <section className="mt-28 border-t border-white/10 pt-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#D6B27C]">
                  Complementary Savors
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white mt-1">
                  More from the {categoryLabel} Collection
                </h2>
              </div>
              <Link
                href={`/shop?category=${product.category}`}
                className="text-xs font-bold uppercase tracking-wider text-[#D6B27C] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>View All In This Category</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/shop/${rel.id}`}
                  className="group flex flex-col bg-[#1E1916] rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#D6B27C]/40"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-white/5">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    {rel.badge && (
                      <span className="absolute top-3 left-3 bg-[#120F0D] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                        {rel.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6B27C]">
                        {rel.subCategory}
                      </span>
                      <h3 className="text-sm font-serif font-bold text-white mt-1 group-hover:text-[#D6B27C] transition-colors line-clamp-1">
                        {rel.name}
                      </h3>
                      <p className="text-xs text-[#C4B7A7] mt-1 line-clamp-2 leading-relaxed">
                        {rel.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between">
                      <span className="font-serif font-bold text-white text-base">
                        {formatPrice(rel.price)}
                      </span>
                      <span className="text-[11px] font-semibold text-[#D6B27C] group-hover:underline">
                        Explore &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default function SingleProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-[#120F0D] text-[#FAF7F2]">
          <div className="h-12 w-12 rounded-full border-2 border-[#D6B27C] border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#D6B27C] font-semibold">
            Curating Offering Details...
          </p>
        </div>
      }
    >
      <SingleProductContent />
    </Suspense>
  );
}
