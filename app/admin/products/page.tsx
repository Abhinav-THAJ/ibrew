import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import connectDB from "@/lib/mongodb";
import Product, { ProductType } from "@/models/product";
import ProductsTable from "./ProductsTable";
import { Plus } from "lucide-react";

async function ProductsData() {
  await connection();
  await connectDB();
  const products: ProductType[] = JSON.parse(
    JSON.stringify(await Product.find().sort({ createdAt: -1 }).lean())
  );
  return <ProductsTable products={products} />;
}

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Offerings Catalog
          </h1>
          <p className="mt-1 text-xs text-[#A89A8C]">
            Manage artisanal roasts, spices, oils, and bedroom suites.
          </p>
        </div>
        <Link
          href="/admin/add"
          className="bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Add New Offering</span>
        </Link>
      </div>

      <Suspense fallback={<div className="h-64 rounded-2xl animate-pulse bg-white/5" />}>
        <ProductsData />
      </Suspense>
    </div>
  );
}
