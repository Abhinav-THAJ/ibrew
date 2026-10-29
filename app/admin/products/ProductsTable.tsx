"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ProductType } from "@/models/product";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/constants";
import DeleteButton from "../DeleteButton";

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Status({ p }: { p: ProductType }) {
  if (p.soldOut)
    return <span className="bg-black px-2 py-1 text-[11px] uppercase tracking-wider text-white">Sold out</span>;
  if (p.stock <= 5)
    return <span className="border border-black px-2 py-1 text-[11px] uppercase tracking-wider">Low stock</span>;
  return <span className="border border-neutral-300 px-2 py-1 text-[11px] uppercase tracking-wider text-neutral-500">In stock</span>;
}

export default function ProductsTable({ products }: { products: ProductType[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (q && !`${p.name} ${p.subCategory} ${p.badge}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, query, category]);

  return (
    <div className="border border-neutral-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 border border-neutral-300 px-3 focus-within:border-black">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent py-2.5 text-sm outline-none"
          />
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-widest text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filtered.map((p) => (
              <tr key={p._id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden bg-neutral-200">
                      {p.images[0] && <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="max-w-[240px] truncate font-medium">{p.name}</p>
                      {p.badge && <p className="text-xs text-neutral-500">{p.badge}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p>{CATEGORY_LABELS[p.category]}</p>
                  {p.subCategory && <p className="text-xs text-neutral-500">{p.subCategory}</p>}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{money(p.price)}</p>
                  {p.mrp > p.price && <p className="text-xs text-neutral-400 line-through">{money(p.mrp)}</p>}
                </td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <Status p={p} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/edit/${p._id}`}
                      className="border border-black px-3 py-1.5 text-xs uppercase tracking-wider transition hover:bg-black hover:text-white"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={p._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-12 text-center text-sm text-neutral-500">No products found.</p>
        )}
      </div>

      <p className="border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500">
        Showing {filtered.length} of {products.length} products
      </p>
    </div>
  );
}