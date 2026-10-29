"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { ProductType, IImage } from "@/models/product";
import {
  ArrowLeft,
  Check,
  Plus,
  Upload,
  X,
  Trash2,
  Star,
  Sparkles,
  ImageIcon,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  coffee: "/images/coffee/arabica.jpeg",
  spices: "/images/spices/cardamom.avif",
  perfumeoil: "/images/Elegant Bottle Display.png",
  importedbed: "/images/importedbed/double-bed.jpeg",
};

const SUGGESTED_BADGES = [
  "Signature Roast",
  "Bestseller",
  "Limited Reserve",
  "Fresh Release",
  "Rare Lot",
  "Estate Direct",
];

const field =
  "w-full rounded-xl border border-white/15 bg-[#241E1A] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#D6B27C] focus:ring-1 focus:ring-[#D6B27C]";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#D6B27C]">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[11px] text-[#A89A8C]">{hint}</span>}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between rounded-xl border border-white/10 bg-[#241E1A] p-4 text-xs font-semibold text-white transition hover:border-[#D6B27C]/40">
      <div className="space-y-0.5 pr-4">
        <span className="block text-white text-xs font-bold">{label}</span>
        {description && <span className="block text-[11px] text-[#A89A8C] font-normal">{description}</span>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#D6B27C] rounded cursor-pointer mt-0.5"
      />
    </label>
  );
}

interface CategoryOption {
  _id?: string;
  name: string;
  slug: string;
  subCategories?: string[];
  image?: string;
}

export default function ProductForm({ product }: { product?: ProductType }) {
  const router = useRouter();

  // Basic Form State
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: String(product?.price ?? ""),
    mrp: product?.mrp ? String(product.mrp) : "",
    stock: String(product?.stock ?? 25),
    category: product?.category ?? "coffee",
    subCategory: product?.subCategory ?? "",
    badge: product?.badge ?? "",
    soldOut: product?.soldOut ?? false,
    featured: product?.featured ?? false,
  });

  // Dynamic Categories from API
  const [categories, setCategories] = useState<CategoryOption[]>([
    {
      name: "Estate Coffee",
      slug: "coffee",
      subCategories: ["Whole Bean & Grounds", "Filter Roast", "Dark Roast", "Cold Brew Blend", "Estate Reserve"],
    },
    {
      name: "Malabar Spices",
      slug: "spices",
      subCategories: ["Whole Spices", "Single-Origin Pods", "Estate Harvest", "Organic Powders"],
    },
    {
      name: "Rare Fragrance Oils",
      slug: "perfumeoil",
      subCategories: ["Pure Attar Distillate", "Aged Oud Oil", "Artisanal Floral"],
    },
    {
      name: "Mattresses",
      slug: "importedbed",
      subCategories: ["Organic Latex Mattresses", "Ergonomic Mattresses", "Orthopedic Mattresses", "Mattress Toppers & Covers"],
    },
    {
      name: "Grocery",
      slug: "grocery",
      subCategories: ["Cold-Pressed Oils", "Heirloom Rice & Grains", "Organic Pulses", "Raw Forest Honey", "Pantry Provisions"],
    },
    {
      name: "Dates",
      slug: "dates",
      subCategories: ["Royal Medjool Dates", "Ajwa Al-Madinah", "Soft Safawi Dates", "Nut-Stuffed Dates", "Artisanal Date Syrup"],
    },
    {
      name: "Bulk Order",
      slug: "bulk-order",
      subCategories: ["Cafe Wholesale Beans", "Bulk Spices & Seasonings", "Hospitality Supplies", "Corporate Festive Hampers"],
    },
  ]);

  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  // 1. MAIN IMAGE STATE (SPACE 1)
  const [mainImage, setMainImage] = useState<IImage | null>(() => {
    if (product?.images && product.images.length > 0 && product.images[0].url) {
      return product.images[0];
    }
    return null;
  });
  const [uploadingMain, setUploadingMain] = useState(false);
  const [mainUrlInput, setMainUrlInput] = useState("");
  const [showMainUrlInput, setShowMainUrlInput] = useState(false);

  // 2. GALLERY IMAGES STATE (SPACE 2)
  const [galleryImages, setGalleryImages] = useState<IImage[]>(() => {
    if (product?.images && product.images.length > 1) {
      return product.images.slice(1);
    }
    return [];
  });
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [showGalleryUrlInput, setShowGalleryUrlInput] = useState(false);

  const [saving, setSaving] = useState(false);

  // Load live categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
          }
        }
      } catch (e) {
        console.warn("Using fallback categories:", e);
      }
    }
    loadCategories();
  }, []);

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  // Quick inline category creator
  const handleCreateNewCategory = async () => {
    if (!newCatName.trim()) return;
    setAddingCat(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim() }),
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories((prev) => [...prev, newCat]);
        setForm((prev) => ({ ...prev, category: newCat.slug }));
        setNewCatName("");
        setShowNewCatInput(false);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to add category");
      }
    } catch {
      alert("Network error creating category");
    } finally {
      setAddingCat(false);
    }
  };

  // UPLOAD HANDLER: SPACE 1 (Main Product Image)
  async function handleMainImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    fd.append("files", files[0]);

    setUploadingMain(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data.images?.[0]) {
        setMainImage(data.images[0]);
      }
    } catch {
      alert("Main image upload failed. Please try a valid image file.");
    } finally {
      setUploadingMain(false);
      e.target.value = "";
    }
  }

  function handleAddMainUrl() {
    const trimmed = mainUrlInput.trim();
    if (!trimmed) return;
    setMainImage({ url: trimmed, public_id: "" });
    setMainUrlInput("");
    setShowMainUrlInput(false);
  }

  // UPLOAD HANDLER: SPACE 2 (Gallery Images)
  async function handleGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));

    setUploadingGallery(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (Array.isArray(data.images)) {
        setGalleryImages((prev) => [...prev, ...data.images]);
      }
    } catch {
      alert("Gallery upload failed. Please try valid image files.");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  }

  function handleAddGalleryUrl() {
    const trimmed = galleryUrlInput.trim();
    if (!trimmed) return;
    setGalleryImages((prev) => [...prev, { url: trimmed, public_id: "" }]);
    setGalleryUrlInput("");
    setShowGalleryUrlInput(false);
  }

  // Promote a gallery photo to Main Cover Image (and move current main to gallery)
  function makeGalleryImageMain(index: number) {
    const chosen = galleryImages[index];
    if (!chosen) return;
    const newGallery = galleryImages.filter((_, idx) => idx !== index);
    if (mainImage) {
      newGallery.unshift(mainImage);
    }
    setMainImage(chosen);
    setGalleryImages(newGallery);
  }

  function removeGalleryImage(index: number) {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== index));
  }

  // SUBMIT FORM
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      // Assemble final images array: [mainImage, ...galleryImages]
      const finalImages: IImage[] = [];
      if (mainImage && mainImage.url) {
        finalImages.push(mainImage);
      }
      galleryImages.forEach((img) => {
        if (img && img.url) {
          if (!mainImage || img.url !== mainImage.url) {
            finalImages.push(img);
          }
        }
      });

      // Default fallback if no images provided
      if (finalImages.length === 0) {
        finalImages.push({
          url:
            DEFAULT_CATEGORY_IMAGES[form.category] ||
            "/images/coffee/arabica.jpeg",
          public_id: "",
        });
      }

      const res = await fetch(product ? `/api/products/${product._id}` : "/api/products", {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category: form.category.trim().toLowerCase(),
          price: Number(form.price),
          mrp: Number(form.mrp) || 0,
          stock: Number(form.stock) || 0,
          images: finalImages,
        }),
      });

      setSaving(false);
      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Something went wrong. Check the fields and try again.");
      }
    } catch {
      setSaving(false);
      alert("Network error. Could not connect to API.");
    }
  }

  // Selected category object for suggestions
  const activeCategoryObj = categories.find((c) => c.slug === form.category);
  const suggestedSubCats = activeCategoryObj?.subCategories || [];

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12 items-start">
      
      {/* ========================================================
          LEFT COLUMN: SPECIFICATIONS & PARTICULARS (7 COLS)
      ======================================================== */}
      <div className="space-y-6 lg:col-span-7">
        
        {/* Core Offering Details Card */}
        <div className="rounded-2xl border border-white/10 bg-[#181311] p-6 text-[#FAF7F2] space-y-6 shadow-xl">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
              Offering Specifications
            </h2>
            <p className="mt-1 text-xs text-[#A89A8C]">
              Title, sensory notes, terroir, harvest altitude, and pricing.
            </p>
          </div>

          {/* Title */}
          <Field label="Offering Title *">
            <input
              name="name"
              value={form.name}
              onChange={change}
              required
              className={field}
              placeholder="e.g. Malabar Monsoon Estate Arabica"
            />
          </Field>

          {/* Description */}
          <Field
            label="Sensory Description & Provenance"
            hint="Describe the terroir, notes, processing method, and harvest origin."
          >
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              rows={4}
              className={field}
              placeholder="Single-origin whole beans, monsoon cured with low acidity, heavy body, and notes of dark cocoa & toasted caramel..."
            />
          </Field>

          {/* Price, MRP, Stock Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Store Price (₹) *">
              <input
                name="price"
                type="number"
                min={0}
                value={form.price}
                onChange={change}
                required
                className={field}
                placeholder="549"
              />
            </Field>

            <Field label="MRP / Struck-Through (₹)" hint="Shown as strike-through discount">
              <input
                name="mrp"
                type="number"
                min={0}
                value={form.mrp}
                onChange={change}
                className={field}
                placeholder="699"
              />
            </Field>

            <Field label="Reserve Stock Units">
              <input
                name="stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={change}
                className={field}
                placeholder="25"
              />
            </Field>
          </div>

          {/* Category & Subcategory Grid */}
          <div className="grid gap-5 sm:grid-cols-2 pt-2 border-t border-white/10">
            {/* Category */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#D6B27C]">
                Collection / Category *
              </label>
              <select
                name="category"
                value={showNewCatInput ? "__new__" : form.category}
                onChange={(e) => {
                  if (e.target.value === "__new__") {
                    setShowNewCatInput(true);
                  } else {
                    setShowNewCatInput(false);
                    setForm({ ...form, category: e.target.value });
                  }
                }}
                className={field}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug} className="bg-[#181311] text-white">
                    {c.name} ({c.slug})
                  </option>
                ))}
                <option value="__new__" className="bg-[#181311] text-[#D6B27C] font-bold">
                  + Add New Category...
                </option>
              </select>

              {/* Inline Category Creator */}
              {showNewCatInput && (
                <div className="mt-3 p-3 rounded-xl bg-[#201A17] border border-[#D6B27C]/40 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6B27C] block">
                    New Category Name
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Artisanal Tea, Ceramics"
                      className="flex-1 rounded-lg border border-white/20 bg-[#29221D] px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#D6B27C]"
                    />
                    <button
                      type="button"
                      onClick={handleCreateNewCategory}
                      disabled={addingCat || !newCatName.trim()}
                      className="rounded-lg bg-[#D6B27C] text-[#120F0D] px-3 py-2 text-xs font-bold uppercase hover:bg-[#C29B38] transition disabled:opacity-50"
                    >
                      {addingCat ? "..." : "+ Add"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCatInput(false)}
                      className="rounded-lg border border-white/20 text-white/60 hover:text-white px-2 py-2 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Subcategory */}
            <div>
              <Field
                label="Subcategory / Style"
                hint="Type or click any suggested pill below"
              >
                <input
                  name="subCategory"
                  value={form.subCategory}
                  onChange={change}
                  placeholder="e.g. Whole Bean & Grounds"
                  className={field}
                />
              </Field>

              {/* Subcategory Suggestion Chips */}
              {suggestedSubCats.length > 0 && (
                <div className="mt-2.5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A89A8C] tracking-wider block">
                    Suggested for {activeCategoryObj?.name}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedSubCats.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setForm({ ...form, subCategory: sub })}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                          form.subCategory === sub
                            ? "bg-[#D6B27C] text-[#120F0D] border-[#D6B27C] font-bold"
                            : "bg-[#241E1A] text-white/80 border-white/10 hover:border-[#D6B27C]/50 hover:text-white"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Promotional Badge & Quick Chips */}
          <div className="pt-2 border-t border-white/10">
            <Field
              label="Promotional Badge"
              hint="Shown as a golden label over the product photo"
            >
              <input
                name="badge"
                value={form.badge}
                onChange={change}
                placeholder="e.g. Signature Roast, Limited Reserve"
                className={field}
              />
            </Field>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {SUGGESTED_BADGES.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setForm({ ...form, badge: b })}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                    form.badge === b
                      ? "bg-[#D6B27C] text-[#120F0D] border-[#D6B27C] font-bold"
                      : "bg-[#241E1A] text-[#C4B7A7] border-white/10 hover:border-white/30"
                  }`}
                >
                  {b}
                </button>
              ))}
              {form.badge && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, badge: "" })}
                  className="text-[10px] px-2 py-1 rounded-full text-red-400 hover:text-red-300 transition"
                >
                  Clear Badge
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Visibility Card */}
        <div className="rounded-2xl border border-white/10 bg-[#181311] p-6 text-[#FAF7F2] space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
              Visibility &amp; Curation
            </h2>
            <p className="mt-0.5 text-xs text-[#A89A8C]">
              Configure availability status and prominence on the storefront.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              checked={form.soldOut}
              onChange={(v) => setForm({ ...form, soldOut: v })}
              label="Mark Offering as Sold Out"
              description="Displays 'Sold Out' badge and disables checkout."
            />
            <Toggle
              checked={form.featured}
              onChange={(v) => setForm({ ...form, featured: v })}
              label="Feature in Private Reserve"
              description="Curates this offering onto the homepage Private Reserve grid."
            />
          </div>
        </div>

        {/* Submit / Cancel Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving || uploadingMain || uploadingGallery}
            className="flex-1 rounded-full bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <span>Saving Offering...</span>
            ) : product ? (
              <>
                <Check size={16} strokeWidth={2.5} />
                <span>Update Offering</span>
              </>
            ) : (
              <>
                <Plus size={16} strokeWidth={2.5} />
                <span>Publish Offering</span>
              </>
            )}
          </button>
          <Link
            href="/admin/products"
            className="rounded-full border border-white/20 hover:border-[#D6B27C] text-white px-7 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* ========================================================
          RIGHT COLUMN: 2 SEPARATE IMAGE SPACES (5 COLS)
          SPACE 1: MAIN PRODUCT IMAGE
          SPACE 2: PHOTO GALLERY
      ======================================================== */}
      <div className="space-y-6 lg:col-span-5">
        
        {/* ====================================================
            SPACE 1: MAIN PRODUCT IMAGE (COVER PHOTO)
        ==================================================== */}
        <div className="rounded-2xl border border-white/10 bg-[#181311] p-6 text-[#FAF7F2] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Star size={14} className="text-[#D6B27C] fill-[#D6B27C]" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
                  Space 1: Main Product Image
                </h2>
              </div>
              <p className="mt-1 text-xs text-[#A89A8C]">
                Primary cover photo displayed on cards, cart &amp; page hero.
              </p>
            </div>
            {mainImage && (
              <span className="rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase px-2.5 py-0.5">
                Set
              </span>
            )}
          </div>

          {/* Main Image View or Dropzone */}
          {mainImage?.url ? (
            <div className="space-y-3">
              <div className="relative h-60 w-full overflow-hidden rounded-xl border border-white/15 bg-black/40 group shadow-md">
                <img
                  src={mainImage.url}
                  alt="Main Cover"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#120F0D]/90 backdrop-blur-sm text-[#D6B27C] border border-[#D6B27C]/40 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                  <Star size={11} fill="#D6B27C" />
                  <span>Main Cover</span>
                </div>

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                  <label
                    htmlFor="replace-main-file"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-lg transition"
                  >
                    <Upload size={13} />
                    <span>Replace</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setMainImage(null)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-lg transition"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Hidden file input for replacing */}
              <input
                id="replace-main-file"
                type="file"
                accept="image/*"
                onChange={handleMainImageFile}
                disabled={uploadingMain}
                className="hidden"
              />

              <div className="flex items-center justify-between text-[11px] text-[#A89A8C] pt-1">
                <span className="truncate max-w-[200px] font-mono text-[10px]">
                  {mainImage.url}
                </span>
                <label
                  htmlFor="replace-main-file"
                  className="cursor-pointer text-[#D6B27C] hover:underline font-semibold"
                >
                  Upload different file
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Main file upload dropzone */}
              <label
                htmlFor="main-file-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-[#241E1A] p-8 text-center transition hover:border-[#D6B27C] hover:bg-[#2A231F]"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D6B27C]/10 text-[#D6B27C] border border-[#D6B27C]/30">
                  {uploadingMain ? (
                    <RefreshCw size={22} className="animate-spin text-[#D6B27C]" />
                  ) : (
                    <Upload size={22} />
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {uploadingMain ? "Uploading Main Photo..." : "Upload Main Cover Photo"}
                </span>
                <span className="mt-1 text-[11px] text-[#A89A8C]">
                  Direct file upload from your device (PNG, JPG, WEBP, AVIF)
                </span>
                <input
                  id="main-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageFile}
                  disabled={uploadingMain}
                  className="hidden"
                />
              </label>

              {/* Or link fallback */}
              {!showMainUrlInput ? (
                <button
                  type="button"
                  onClick={() => setShowMainUrlInput(true)}
                  className="text-[11px] text-[#A89A8C] hover:text-[#D6B27C] transition-colors block text-center w-full"
                >
                  or paste direct image URL
                </button>
              ) : (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="e.g. /images/coffee/arabica.jpeg or https://..."
                    value={mainUrlInput}
                    onChange={(e) => setMainUrlInput(e.target.value)}
                    className="flex-1 rounded-xl border border-white/15 bg-[#241E1A] px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#D6B27C]"
                  />
                  <button
                    type="button"
                    onClick={handleAddMainUrl}
                    className="rounded-xl bg-[#D6B27C] text-[#120F0D] px-3.5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#C29B38]"
                  >
                    Set
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMainUrlInput(false)}
                    className="rounded-xl border border-white/15 px-2 text-xs text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ====================================================
            SPACE 2: PHOTO GALLERY (ADDITIONAL IMAGES)
        ==================================================== */}
        <div className="rounded-2xl border border-white/10 bg-[#181311] p-6 text-[#FAF7F2] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon size={14} className="text-[#D6B27C]" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
                  Space 2: Photo Gallery
                </h2>
              </div>
              <p className="mt-1 text-xs text-[#A89A8C]">
                Multiple photos for the interactive product page slider.
              </p>
            </div>
            <span className="rounded-full bg-[#241E1A] border border-white/10 text-[#D6B27C] text-[10px] font-bold px-2.5 py-0.5">
              {galleryImages.length} {galleryImages.length === 1 ? "Photo" : "Photos"}
            </span>
          </div>

          {/* Gallery file upload dropzone */}
          <label
            htmlFor="gallery-file-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-[#241E1A] p-6 text-center transition hover:border-[#D6B27C] hover:bg-[#2A231F]"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#D6B27C]/10 text-[#D6B27C] border border-[#D6B27C]/30">
              {uploadingGallery ? (
                <RefreshCw size={18} className="animate-spin text-[#D6B27C]" />
              ) : (
                <Plus size={20} />
              )}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {uploadingGallery ? "Uploading Gallery..." : "Add Photos to Gallery"}
            </span>
            <span className="mt-1 text-[11px] text-[#A89A8C]">
              Select multiple files at once (PNG, JPG, WEBP, AVIF)
            </span>
            <input
              id="gallery-file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryFiles}
              disabled={uploadingGallery}
              className="hidden"
            />
          </label>

          {/* Optional Direct URL for gallery */}
          {!showGalleryUrlInput ? (
            <button
              type="button"
              onClick={() => setShowGalleryUrlInput(true)}
              className="text-[11px] text-[#A89A8C] hover:text-[#D6B27C] transition-colors block text-center w-full"
            >
              + or add gallery photo via URL
            </button>
          ) : (
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Paste image URL (/images/... or https://...)"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                className="flex-1 rounded-xl border border-white/15 bg-[#241E1A] px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#D6B27C]"
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="rounded-xl bg-[#D6B27C] text-[#120F0D] px-3.5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#C29B38]"
              >
                + Add
              </button>
              <button
                type="button"
                onClick={() => setShowGalleryUrlInput(false)}
                className="rounded-xl border border-white/15 px-2 text-xs text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Gallery Thumbnails Grid */}
          {galleryImages.length > 0 ? (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A89A8C] block">
                Gallery Photos (Hover to make main or remove):
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {galleryImages.map((img, i) => (
                  <div
                    key={img.public_id || img.url || i}
                    className="group relative aspect-square rounded-xl bg-white/5 border border-white/10 overflow-hidden shadow-sm"
                  >
                    <img src={img.url} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                    
                    {/* Index tag */}
                    <span className="absolute left-1.5 top-1.5 rounded bg-[#120F0D]/90 text-white/80 px-1.5 py-0.5 text-[9px] font-bold">
                      #{i + 1}
                    </span>

                    {/* Action buttons on hover */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                      <button
                        type="button"
                        onClick={() => makeGalleryImageMain(i)}
                        className="rounded-md bg-[#D6B27C] text-[#120F0D] px-2 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#C29B38] transition w-full justify-center shadow"
                        title="Set as primary main cover image"
                      >
                        <Star size={10} fill="#120F0D" />
                        <span>Make Main</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="rounded-md bg-red-600/90 text-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 hover:bg-red-700 transition w-full justify-center"
                        title="Delete from gallery"
                      >
                        <Trash2 size={10} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-[#8C7E72] text-center pt-1 italic">
              No additional gallery photos added yet. Extra photos uploaded here will appear as interactive thumbnails on the product page.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
