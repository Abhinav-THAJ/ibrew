import { Suspense } from "react";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product, { ProductType } from "@/models/product";
import ProductsTable from "./ProductsTable";

async function ProductsData() {
  await connectDB();
  const products: ProductType[] = JSON.parse(
    JSON.stringify(await Product.find().sort({ createdAt: -1 }).lean())
  );
  return <ProductsTable products={products} />;
}

export default function ProductsPage() {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-neutral-500">Add, edit and remove what you sell.</p>
        </div>
        <Link
          href="/admin/add"
          className="bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          + Add product
        </Link>
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse bg-neutral-200" />}>
        <ProductsData />
      </Suspense>
    </div>
  );
}