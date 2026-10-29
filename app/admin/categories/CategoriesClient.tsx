"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Edit2,
  FolderPlus,
  ImageIcon,
  Layers,
  Plus,
  RefreshCw,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { CategoryType } from "@/models/category";

export default function CategoriesClient({
  initialCategories,
  categoryCounts,
}: {
  initialCategories: CategoryType[];
  categoryCounts: Record<string, number>;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryType[]>(initialCategories);

  // Edit vs Create mode
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [newSubCatInput, setNewSubCatInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const startEdit = (cat: CategoryType) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setSubCategories(Array.isArray(cat.subCategories) ? cat.subCategories : []);
    setNewSubCatInput("");
    setSuccessMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setSubCategories([]);
    setNewSubCatInput("");
  };

  const handleAddSubCategory = () => {
    const trimmed = newSubCatInput.trim();
    if (!trimmed) return;
    if (subCategories.includes(trimmed)) {
      alert("This subcategory already exists");
      return;
    }
    setSubCategories((prev) => [...prev, trimmed]);
    setNewSubCatInput("");
  };

  const handleRemoveSubCategory = (sub: string) => {
    setSubCategories((prev) => prev.filter((s) => s !== sub));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const file = files[0];

    const fd = new FormData();
    fd.append("files", file);

    setUploadingImage(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        if (data.images?.[0]?.url) {
          setImage(data.images[0].url);
        }
      } else {
        alert("Upload failed. Please choose an image file (PNG, JPG, WEBP).");
      }
    } catch {
      alert("Network error uploading photo.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setSuccessMsg("");

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      image: image.trim(),
      subCategories,
    };

    try {
      if (editingCategory) {
        // UPDATE existing category
        const res = await fetch(`/api/categories/${editingCategory._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const updated: CategoryType = await res.json();
          setCategories((prev) =>
            prev.map((c) => (c._id === updated._id ? updated : c))
          );
          setSuccessMsg(`Category "${updated.name}" updated successfully!`);
          cancelEdit();
          router.refresh();
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.error || "Failed to update category");
        }
      } else {
        // CREATE new category
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const created: CategoryType = await res.json();
          setCategories((prev) => [...prev, created]);
          setSuccessMsg(`New category "${created.name}" created successfully!`);
          cancelEdit();
          router.refresh();
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.error || "Failed to add category");
        }
      }
    } catch {
      alert("Network error submitting category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catSlug: string) => {
    const count = categoryCounts[catSlug] || 0;
    if (
      !confirm(
        `Delete this category? ${
          count > 0
            ? `Warning: ${count} product(s) are currently assigned to this category.`
            : ""
        }`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
        if (editingCategory?._id === id) cancelEdit();
        router.refresh();
      } else {
        alert("Could not delete category");
      }
    } catch {
      alert("Network error deleting category");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-[#FAF7F2]">
      
      {/* LEFT: Existing Categories List */}
      <div className="lg:col-span-7 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-[#181311] overflow-hidden shadow-xl">
          <div className="border-b border-white/10 bg-[#201A17] p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={17} className="text-[#D6B27C]" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
                Active Categories ({categories.length})
              </h2>
            </div>
            <span className="text-[10px] text-[#A89A8C] uppercase font-semibold">
              Live on Frontend
            </span>
          </div>

          <div className="divide-y divide-white/8">
            {categories.map((cat) => {
              const count = categoryCounts[cat.slug] || 0;
              const isBase = ["coffee", "spices", "perfumeoil", "importedbed"].includes(cat.slug);
              const isCurrentEdit = editingCategory?._id === cat._id;
              const subList = Array.isArray(cat.subCategories) ? cat.subCategories : [];

              return (
                <div
                  key={cat._id}
                  className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                    isCurrentEdit ? "bg-[#241E1A] border-l-4 border-l-[#D6B27C]" : "hover:bg-white/5"
                  }`}
                >
                  {/* Category Thumbnail */}
                  <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 relative">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white/30 text-xs">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
                      <span className="font-mono text-[10px] text-[#D6B27C] bg-[#241E1A] border border-[#D6B27C]/30 px-2 py-0.5 rounded-full">
                        /{cat.slug}
                      </span>
                    </div>

                    {cat.description && (
                      <p className="text-xs text-[#A89A8C] line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}

                    {/* Subcategories tags preview */}
                    {subList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {subList.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] bg-white/5 border border-white/10 text-[#C4B7A7] px-2 py-0.5 rounded-md"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-[#8C7E72] pt-1">
                      <span>Assigned Offerings: <strong className="text-white">{count}</strong></span>
                      {cat.image ? (
                        <span className="text-emerald-400 font-medium">✓ Photo configured</span>
                      ) : (
                        <span className="text-amber-400/80">No photo uploaded</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 hover:border-[#D6B27C] text-white hover:text-[#D6B27C] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>

                    {!isBase && (
                      <button
                        type="button"
                        onClick={() => handleDelete(cat._id, cat.slug)}
                        className="rounded-full border border-red-500/30 text-red-400 hover:bg-red-950/40 p-2 text-xs transition"
                        title="Delete category"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Add / Edit Category Form */}
      <div className="lg:col-span-5">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#181311] p-6 shadow-xl space-y-5"
        >
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#D6B27C] mb-1">
                {editingCategory ? <Edit2 size={18} /> : <FolderPlus size={18} />}
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
                  {editingCategory ? `Edit: ${editingCategory.name}` : "Add New Category"}
                </h2>
              </div>
              <p className="text-xs text-[#A89A8C]">
                {editingCategory
                  ? "Upload a new photo, add subcategories, or update details."
                  : "Upload a photo and create a new storefront category with subcategories."}
              </p>
            </div>

            {editingCategory && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs font-semibold text-white/50 hover:text-white px-2.5 py-1 rounded-lg border border-white/10"
              >
                Cancel
              </button>
            )}
          </div>

          {successMsg && (
            <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-300 font-semibold flex items-center gap-2">
              <Check size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D6B27C] mb-2">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingCategory && !slug) {
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "")
                  );
                }
              }}
              placeholder="e.g. Artisanal Tea, Handcrafted Ceramics"
              className="w-full rounded-xl border border-white/15 bg-[#241E1A] px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#D6B27C] transition-colors"
            />
          </div>

          {/* DEDICATED PHOTO UPLOADER (DIRECT FILE UPLOAD - NO LINK INPUT) */}
          <div className="rounded-2xl bg-[#201A17] border border-white/10 p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D6B27C]">
                Category Cover Photo
              </label>
              {image && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check size={12} /> Photo Uploaded
                </span>
              )}
            </div>

            {/* Current Photo Preview Card */}
            {image ? (
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-black/40 border border-[#D6B27C]/30 shadow-inner group">
                <img src={image} alt="Category Preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="cursor-pointer bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    <RefreshCw size={12} /> Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute right-2.5 top-2.5 h-7 w-7 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow-lg"
                  title="Remove photo"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-[#241E1A] hover:bg-[#2C2420] hover:border-[#D6B27C] px-4 py-8 text-center transition-all group">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-[#D6B27C] group-hover:scale-110 transition-transform mb-2">
                  <Upload size={22} />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {uploadingImage ? "Uploading Photo File..." : "Click to Upload Category Photo"}
                </span>
                <span className="mt-1 text-[11px] text-[#A89A8C]">
                  Choose JPG, PNG, WEBP, or AVIF from your device
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            )}

            {image && (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#241E1A] hover:border-[#D6B27C] py-2 text-xs text-white/80 hover:text-white transition">
                <Upload size={13} className="text-[#D6B27C]" />
                <span>Upload a different photo from device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* SUBCATEGORIES MANAGER */}
          <div className="rounded-2xl bg-[#201A17] border border-white/10 p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-[#D6B27C]">
              <Tag size={14} />
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D6B27C]">
                Subcategories ({subCategories.length})
              </label>
            </div>
            <p className="text-[11px] text-[#A89A8C]">
              Patrons can filter offerings by these subcategories on the storefront.
            </p>

            {/* Subcategories tags list */}
            {subCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1 pb-2">
                {subCategories.map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center gap-1.5 bg-[#241E1A] border border-[#D6B27C]/30 text-white px-3 py-1 rounded-full text-xs font-medium"
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubCategory(sub)}
                      className="text-white/40 hover:text-red-400 p-0.5"
                      title="Remove subcategory"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add subcategory input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Whole Bean, Pour-Over Roast..."
                value={newSubCatInput}
                onChange={(e) => setNewSubCatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubCategory();
                  }
                }}
                className="flex-1 rounded-xl border border-white/15 bg-[#241E1A] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#D6B27C]"
              />
              <button
                type="button"
                onClick={handleAddSubCategory}
                className="rounded-xl bg-[#241E1A] border border-white/20 hover:border-[#D6B27C] hover:text-[#D6B27C] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition"
              >
                + Add Sub
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D6B27C] mb-2">
              URL Identifier / Slug (Auto-generated)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-xs font-mono">
                /shop?category=
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                placeholder="tea"
                className="w-full rounded-xl border border-white/15 bg-[#241E1A] pl-32 pr-4 py-3 text-xs font-mono text-white placeholder-white/30 outline-none focus:border-[#D6B27C] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D6B27C] mb-2">
              Sensory Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief connoisseur overview shown on category filter headers on the frontend..."
              className="w-full rounded-xl border border-white/15 bg-[#241E1A] px-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-[#D6B27C] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || uploadingImage || !name.trim()}
            className="w-full rounded-full bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {editingCategory ? (
              <>
                <Check size={15} strokeWidth={2.5} />
                <span>{submitting ? "Saving Photo & Changes..." : "Save Category Photo & Changes"}</span>
              </>
            ) : (
              <>
                <Plus size={15} strokeWidth={2.5} />
                <span>{submitting ? "Publishing..." : "Publish Category to Website"}</span>
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
