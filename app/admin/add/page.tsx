import Link from "next/link";
import ProductForm from "../ProductForm";
import { ArrowLeft } from "lucide-react";

export default function AddProduct() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D6B27C] hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Back to Catalog
      </Link>
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Add New Artisanal Offering
        </h1>
        <p className="mt-1 text-xs text-[#A89A8C]">
          Create a new estate harvest, spice reserve, or fragrance blend.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
