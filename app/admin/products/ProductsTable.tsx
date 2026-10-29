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
    return (
      <span className="bg-rose-950/60 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
        Sold out
      </span>
    );
  if (p.stock <= 5)
    return (
      <span className="bg-amber-950/60 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
        Low stock ({p.stock})
      </span>
    );
  return (
    <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
      In stock
    </span>
  );
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
    <div className="rounded-2xl border border-white/10 bg-[#181311] overflow-hidden shadow-xl text-[#FAF7F2]">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center bg-[#1E1916]">
        <label className="flex flex-1 items-center gap-2.5 rounded-xl border border-white/15 bg-[#241E1A] px-3.5 focus-within:border-[#D6B27C] transition-colors">
          <Search className="h-4 w-4 text-[#D6B27C]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search offerings by title or craft..."
            className="w-full bg-transparent py-2.5 text-xs text-white placeholder-white/30 outline-none"
          />
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-white/15 bg-[#241E1A] px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-[#D6B27C] transition-colors"
        >
          <option value="all">All Collections</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-[#181311] text-white">
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="bg-[#201A17] text-[11px] uppercase tracking-wider text-[#D6B27C] border-b border-white/10">
            <tr>
              <th className="px-5 py-4 font-bold">Offering</th>
              <th className="px-5 py-4 font-bold">Category</th>
              <th className="px-5 py-4 font-bold">Price</th>
              <th className="px-5 py-4 font-bold">Units</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {filtered.map((p) => (
              <tr key={p._id} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                      {p.images[0] && (
                        <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="max-w-[260px] truncate font-semibold text-sm text-white">{p.name}</p>
                      {p.badge && (
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#D6B27C] mt-0.5">
                          {p.badge}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-white">{CATEGORY_LABELS[p.category]}</p>
                  {p.subCategory && <p className="text-[11px] text-[#A89A8C] mt-0.5">{p.subCategory}</p>}
                </td>
                <td className="px-5 py-4">
                  <p className="font-serif font-bold text-sm text-[#D6B27C]">{money(p.price)}</p>
                  {p.mrp > p.price && (
                    <p className="text-[10px] text-white/40 line-through">{money(p.mrp)}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="font-mono font-bold text-white text-sm">{p.stock}</span>
                </td>
                <td className="px-5 py-4">
                  <Status p={p} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2.5">
                    <Link
                      href={`/admin/edit/${p._id}`}
                      className="rounded-full border border-white/20 hover:border-[#D6B27C] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white hover:text-[#D6B27C] transition-colors"
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
          <div className="p-16 text-center text-xs text-[#A89A8C]">
            No matching offerings found.
          </div>
        )}
      </div>

      <div className="border-t border-white/10 px-5 py-3.5 text-xs text-[#8C7E72] flex items-center justify-between bg-[#14100E]">
        <span>Showing {filtered.length} of {products.length} offerings</span>
        <span className="text-[#D6B27C] font-semibold">Live Cloud Catalog</span>
      </div>
    </div>
  );
}
