import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import connectDB from "@/lib/mongodb";
import Product, { ProductType } from "@/models/product";
import ProductForm from "../../ProductForm";
import { ArrowLeft } from "lucide-react";

async function EditForm({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  await connectDB();
  const found = await Product.findById(id).lean();
  if (!found) return <p className="text-xs text-[#A89A8C]">Offering not found in the catalog.</p>;
  const product: ProductType = JSON.parse(JSON.stringify(found));
  return <ProductForm product={product} />;
}

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
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
          Modify Offering Specifications
        </h1>
        <p className="mt-1 text-xs text-[#A89A8C]">
          Update pricing, reserve stock, descriptions, and visual assets.
        </p>
      </div>
      <Suspense fallback={<div className="h-64 rounded-2xl animate-pulse bg-white/5" />}>
        <EditForm params={params} />
      </Suspense>
    </div>
  );
}
