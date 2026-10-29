import { Suspense } from "react";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product, { ProductType } from "@/models/product";
import Order from "@/models/order";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/constants";


const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

async function DashboardData() {
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
    { label: "Total products", value: total },
    { label: "Patron Orders", value: orderCount },
    { label: "Featured", value: featured },
    { label: "Low stock (≤5)", value: lowStock },
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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`border p-5 ${
              i === 0 ? "border-black bg-black text-white" : "border-neutral-200 bg-white"
            }`}
          >
            <p className={`text-xs uppercase tracking-widest ${i === 0 ? "text-white/60" : "text-neutral-500"}`}>
              {s.label}
            </p>
            <p className="mt-3 text-4xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* category breakdown */}
        <section className="border border-neutral-200 bg-white p-6 lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-widest">By category</h2>
          <div className="mt-6 space-y-5">
            {byCategory.map((c) => (
              <div key={c.key}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{c.label}</span>
                  <span className="font-medium">{c.count}</span>
                </div>
                <div className="h-2 bg-neutral-200">
                  <div className="h-2 bg-black" style={{ width: `${(c.count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-neutral-200 pt-5">
            <p className="text-xs uppercase tracking-widest text-neutral-500">Inventory value</p>
            <p className="mt-2 text-2xl font-semibold">{money(inventoryValue)}</p>
          </div>
        </section>

        {/* recent products */}
        <section className="border border-neutral-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest">Recently added</h2>
            <Link href="/admin/products" className="text-sm underline underline-offset-4">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="p-10 text-center text-sm text-neutral-500">No products yet. Add your first one.</p>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {recent.map((p) => (
                <li key={p._id} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden bg-neutral-200">
                    {p.images[0] && <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-neutral-500">{CATEGORY_LABELS[p.category]}</p>
                  </div>
                  <p className="text-sm font-medium">{money(p.price)}</p>
                  <Link href={`/admin/edit/${p._id}`} className="text-sm underline underline-offset-4">
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
        <div key={i} className="h-28 animate-pulse bg-neutral-200" />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">Overview of your store.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="border border-neutral-300 bg-white px-5 py-3 text-sm font-medium transition hover:bg-neutral-50"
          >
            View Orders
          </Link>
          <Link
            href="/admin/add"
            className="bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            + Add product
          </Link>
        </div>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
}
