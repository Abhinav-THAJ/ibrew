import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import connectDB from "@/lib/mongodb";
import Product, { ProductType } from "@/models/product";
import Order from "@/models/order";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/constants";
import { ArrowRight, Package, Plus, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

async function DashboardData() {
  await connection();
  await connectDB();
  const products: ProductType[] = JSON.parse(
    JSON.stringify(await Product.find().sort({ createdAt: -1 }).lean())
  );
  const orderCount = await Order.countDocuments();

  const total = products.length;
  const featured = products.filter((p) => p.featured).length;
  const soldOut = products.filter((p) => p.soldOut).length;
  const lowStock = products.filter((p) => !p.soldOut && p.stock <= 5).length;
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const stats = [
    { label: "Total Catalog", value: total, icon: Package, highlight: false },
    { label: "Patron Orders", value: orderCount, icon: ShoppingBag, highlight: true },
    { label: "Featured Offerings", value: featured, icon: Sparkles, highlight: false },
    { label: "Low Reserve (≤5)", value: lowStock, icon: TrendingUp, highlight: false },
  ];

  const byCategory = CATEGORIES.map((c) => ({
    key: c,
    label: CATEGORY_LABELS[c],
    count: products.filter((p) => p.category === c).length,
  }));
  const maxCount = Math.max(1, ...byCategory.map((c) => c.count));
  const recent = products.slice(0, 6);

  return (
    <>
      {/* 1. METRICS CARDS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`p-6 rounded-2xl border transition-all ${
                s.highlight
                  ? "bg-[#241E1A] border-[#D6B27C]/50 shadow-lg shadow-[#D6B27C]/5"
                  : "bg-[#181311] border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#D6B27C]">
                  {s.label}
                </span>
                <Icon size={16} className="text-[#D6B27C]/70" />
              </div>
              <p className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-white">
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* 2. TWO-COLUMN BREAKDOWN */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3 items-start">
        
        {/* Left: Category Breakdown */}
        <section className="bg-[#181311] border border-white/10 p-6 rounded-2xl lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
              Inventory by Category
            </h2>
            <span className="text-[10px] text-[#A89A8C] uppercase font-semibold">
              Live Stock
            </span>
          </div>

          <div className="space-y-5">
            {byCategory.map((c) => (
              <div key={c.key} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{c.label}</span>
                  <span className="font-mono font-bold text-[#D6B27C]">{c.count} items</span>
                </div>
                <div className="h-2 rounded-full bg-[#241E1A] overflow-hidden">
                  <div
                    className="h-full bg-[#D6B27C] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(214,178,124,0.5)]"
                    style={{ width: `${(c.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-5 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#A89A8C]">
              Total Reserve Valuation
            </p>
            <p className="text-3xl font-serif font-bold text-[#D6B27C]">
              {money(inventoryValue)}
            </p>
            <p className="text-[11px] text-[#8C7E72]">
              Calculated across all listed items &amp; available stock
            </p>
          </div>
        </section>

        {/* Right: Recently Added Products */}
        <section className="bg-[#181311] border border-white/10 rounded-2xl lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D6B27C]">
              Recently Added Offerings
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#D6B27C] hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View Full Catalog</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#A89A8C]">
              No products found in the catalog yet.
            </div>
          ) : (
            <ul className="divide-y divide-white/8">
              {recent.map((p) => (
                <li key={p._id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    {p.images[0] && (
                      <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-[#A89A8C]">{CATEGORY_LABELS[p.category]}</p>
                  </div>
                  <p className="text-sm font-serif font-bold text-[#D6B27C]">{money(p.price)}</p>
                  <Link
                    href={`/admin/edit/${p._id}`}
                    className="text-xs font-semibold text-[#FAF7F2] hover:text-[#D6B27C] border border-white/15 hover:border-[#D6B27C] px-3 py-1.5 rounded-full transition-colors"
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-28 rounded-2xl animate-pulse bg-white/5" />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Studio Dashboard
          </h1>
          <p className="mt-1 text-xs text-[#A89A8C]">
            Real-time catalog oversight and store performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="border border-white/20 bg-[#241E1A] hover:bg-[#2D2622] hover:border-[#D6B27C] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all shadow-sm"
          >
            Fulfill Orders
          </Link>
          <Link
            href="/admin/add"
            className="bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Offering</span>
          </Link>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
}
