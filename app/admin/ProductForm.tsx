"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CATEGORY_LABELS, SUBCATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/constants";
import type { ProductType, IImage } from "@/models/product";
import { ArrowLeft, Check, Plus, Upload, X } from "lucide-react";
import Link from "next/link";

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
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-[#241E1A] px-4 py-3 text-xs font-semibold text-white transition hover:border-[#D6B27C]/40">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#D6B27C] rounded cursor-pointer"
      />
    </label>
  );
}

export default function ProductForm({ product }: { product?: ProductType }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: String(product?.price ?? ""),
    mrp: product?.mrp ? String(product.mrp) : "",
    stock: String(product?.stock ?? 0),
    category: (product?.category ?? "coffee") as Category,
    subCategory: product?.subCategory ?? "",
    badge: product?.badge ?? "",
    soldOut: product?.soldOut ?? false,
    featured: product?.featured ?? false,
  });
  const [images, setImages] = useState<IImage[]>(product?.images ?? []);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const addImageUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setImages((prev) => [...prev, { url: trimmed, public_id: "" }]);
    setUrlInput("");
  };

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data: { images: IImage[] } = await res.json();
      setImages((prev) => [...prev, ...data.images]);
    } catch {
      alert("Image upload failed. You can also paste an image URL directly.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(product ? `/api/products/${product._id}` : "/api/products", {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          mrp: Number(form.mrp) || 0,
          stock: Number(form.stock) || 0,
          images,
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

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      {/* left: details */}
      <div className="space-y-6 rounded-2xl border border-white/10 bg-[#181311] p-6 lg:col-span-2 text-[#FAF7F2]">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
            Artisanal Offering Details
          </h2>
          <p className="mt-1 text-xs text-[#A89A8C]">
            Title, provenance notes, harvest details, and pricing.
          </p>
        </div>

        <Field label="Offering Title">
          <input
            name="name"
            value={form.name}
            onChange={change}
            required
            className={field}
            placeholder="e.g. Malabar Monsoon Estate Arabica"
          />
        </Field>

        <Field label="Sensory Description & Provenance">
          <textarea
            name="description"
            value={form.description}
            onChange={change}
            rows={4}
            className={field}
            placeholder="Detailed notes on terroir, roast profile, harvest elevation, or botanical distillation..."
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Store Price (₹)">
            <input name="price" type="number" min={0} value={form.price} onChange={change} required className={field} />
          </Field>
          <Field label="MRP / Valued At (₹)" hint="Shown struck through">
            <input name="mrp" type="number" min={0} value={form.mrp} onChange={change} className={field} />
          </Field>
          <Field label="Reserve Stock Units">
            <input name="stock" type="number" min={0} value={form.stock} onChange={change} className={field} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Primary Collection">
            <select
              name="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category, subCategory: "" })}
              className={field}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#181311] text-white">
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Subcategory / Preparation">
            <select name="subCategory" value={form.subCategory} onChange={change} className={field}>
              <option value="" className="bg-[#181311] text-white">Select subcategory</option>
              {SUBCATEGORIES[form.category].map((s) => (
                <option key={s} value={s} className="bg-[#181311] text-white">
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Promotional Badge" hint="e.g. Signature Roast, TGSEB Grade, Limited Reserve, Bestseller">
          <input name="badge" value={form.badge} onChange={change} className={field} />
        </Field>
      </div>

      {/* right: images and visibility */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#181311] p-6 text-[#FAF7F2]">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
            Visual Imagery
          </h2>
          <p className="mt-1 text-xs text-[#A89A8C]">
            First image is the primary cover. Upload or link URL.
          </p>

          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-[#241E1A] px-4 py-8 text-center transition hover:border-[#D6B27C] hover:bg-white/5">
            <Upload size={20} className="text-[#D6B27C] mb-2" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {uploading ? "Uploading Image..." : "Click to Upload Files"}
            </span>
            <span className="mt-1 text-[10px] text-[#A89A8C]">PNG, JPG, WEBP, AVIF</span>
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" disabled={uploading} />
          </label>

          {/* Direct URL input fallback */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Or enter image URL (/images/...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImageUrl();
                }
              }}
              className="flex-1 rounded-xl border border-white/15 bg-[#241E1A] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#D6B27C]"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="rounded-xl bg-[#D6B27C] text-[#120F0D] px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#C29B38] transition shadow-md"
            >
              + Add
            </button>
          </div>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {images.map((img, i) => (
                <div key={img.public_id || img.url || i} className="group relative aspect-square rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-[#120F0D]/90 text-[#D6B27C] border border-[#D6B27C]/40 px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    aria-label="Remove image"
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 transition group-hover:opacity-100 shadow-md"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3.5 rounded-2xl border border-white/10 bg-[#181311] p-6 text-[#FAF7F2]">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
            Visibility &amp; Curation
          </h2>
          <Toggle checked={form.soldOut} onChange={(v) => setForm({ ...form, soldOut: v })} label="Mark Reserve as Sold Out" />
          <Toggle checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} label="Curate on Home Page (Featured)" />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
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
            className="rounded-full border border-white/20 hover:border-[#D6B27C] text-white px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
