"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CATEGORY_LABELS, SUBCATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/constants";
import type { ProductType, IImage } from "@/models/product";

const field =
  "w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-neutral-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-neutral-400">{hint}</span>}
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
    <label className="flex cursor-pointer items-center justify-between border border-neutral-200 px-4 py-3 text-sm">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-black"
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
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      {/* left: details */}
      <div className="space-y-5 border border-neutral-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-sm font-semibold uppercase tracking-widest">Product details</h2>

        <Field label="Name">
          <input name="name" value={form.name} onChange={change} required className={field} placeholder="e.g. Premium Arabica Coffee Powder" />
        </Field>

        <Field label="Description">
          <textarea name="description" value={form.description} onChange={change} rows={4} className={field} placeholder="Short description shown on the product card" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Price (₹)">
            <input name="price" type="number" min={0} value={form.price} onChange={change} required className={field} />
          </Field>
          <Field label="MRP (₹)" hint="Optional, shown struck through">
            <input name="mrp" type="number" min={0} value={form.mrp} onChange={change} className={field} />
          </Field>
          <Field label="Stock">
            <input name="stock" type="number" min={0} value={form.stock} onChange={change} className={field} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category">
            <select
              name="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category, subCategory: "" })}
              className={field}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Type / Subcategory">
            <select name="subCategory" value={form.subCategory} onChange={change} className={field}>
              <option value="">Select type</option>
              {SUBCATEGORIES[form.category].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Badge" hint="Optional, e.g. Bestseller, New, Popular, Signature Roast">
          <input name="badge" value={form.badge} onChange={change} className={field} />
        </Field>
      </div>

      {/* right: images and visibility */}
      <div className="space-y-6">
        <div className="border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest">Images</h2>
          <p className="mt-1 text-xs text-neutral-400">First image is the main photo. Drag or add image URL.</p>

          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center border border-dashed border-neutral-400 px-4 py-8 text-center text-sm transition hover:border-black hover:bg-neutral-50">
            <span className="font-medium">{uploading ? "Uploading..." : "Click to upload files"}</span>
            <span className="mt-1 text-xs text-neutral-400">PNG, JPG, WEBP or AVIF</span>
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" disabled={uploading} />
          </label>

          {/* Direct URL input fallback */}
          <div className="mt-3 flex gap-2">
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
              className="flex-1 border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="bg-black text-white px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition"
            >
              + Add
            </button>
          </div>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <div key={img.public_id || img.url || i} className="group relative aspect-square bg-neutral-200 rounded overflow-hidden">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute left-0 top-0 bg-black px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-black/80 rounded text-xs text-white opacity-0 transition group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 border border-neutral-200 bg-white p-6">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest">Visibility</h2>
          <Toggle checked={form.soldOut} onChange={(v) => setForm({ ...form, soldOut: v })} label="Mark as sold out" />
          <Toggle checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} label="Show on home page" />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : product ? "Update product" : "Add product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="border border-black px-5 py-3 text-sm transition hover:bg-black hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
