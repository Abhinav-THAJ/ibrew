import { Suspense } from "react";
import { connection } from "next/server";
import connectDB from "@/lib/mongodb";
import CategoryModel, { CategoryType } from "@/models/category";
import Product from "@/models/product";
import CategoriesClient from "./CategoriesClient";

async function CategoriesData() {
  await connection();
  await connectDB();

  const categories: CategoryType[] = JSON.parse(
    JSON.stringify(await CategoryModel.find().sort({ createdAt: 1 }).lean())
  );

  // Group products by category to get live count
  const products = await Product.find({}, "category").lean();
  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    const cat = p.category;
    if (cat) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
  });

  return (
    <CategoriesClient
      initialCategories={categories}
      categoryCounts={categoryCounts}
    />
  );
}

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Collections &amp; Categories
        </h1>
        <p className="mt-1 text-xs text-[#A89A8C]">
          Manage boutique product departments shown across the storefront navigation.
        </p>
      </div>

      <Suspense fallback={<div className="h-64 rounded-2xl animate-pulse bg-white/5" />}>
        <CategoriesData />
      </Suspense>
    </div>
  );
}
