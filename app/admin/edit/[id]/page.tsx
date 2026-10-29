import { Suspense } from "react";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product, { ProductType } from "@/models/product";
import ProductForm from "../../ProductForm";

async function EditForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const found = await Product.findById(id).lean();
  if (!found) return <p className="text-sm text-neutral-500">Product not found.</p>;
  const product: ProductType = JSON.parse(JSON.stringify(found));
  return <ProductForm product={product} />;
}

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-neutral-500 underline underline-offset-4 hover:text-black">
        ← Back to products
      </Link>
      <h1 className="mb-8 mt-3 text-2xl font-semibold">Edit product</h1>
      <Suspense fallback={<div className="h-64 animate-pulse bg-neutral-200" />}>
        <EditForm params={params} />
      </Suspense>
    </div>
  );
}