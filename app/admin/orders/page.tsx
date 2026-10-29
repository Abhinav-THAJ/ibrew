import { Suspense } from "react";
import { connection } from "next/server";
import connectDB from "@/lib/mongodb";
import Order, { OrderType } from "@/models/order";
import OrdersClient from "./OrdersClient";

async function OrdersData() {
  await connection();
  await connectDB();
  const orders: OrderType[] = JSON.parse(
    JSON.stringify(await Order.find().sort({ createdAt: -1 }).lean())
  );

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrders = orders.filter((o) => o.status === "confirmed" || o.status === "processing").length;

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#D6B27C]/40 bg-[#241E1A] p-6 text-white shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#D6B27C]">Total Orders Placed</p>
          <p className="mt-3 text-3xl sm:text-4xl font-serif font-bold">{totalOrders}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#181311] p-6 text-white">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#D6B27C]">Gross Patron Revenue</p>
          <p className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-[#D6B27C]">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#181311] p-6 text-white">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#D6B27C]">In Active Fulfillment</p>
          <p className="mt-3 text-3xl sm:text-4xl font-serif font-bold">{activeOrders}</p>
        </div>
      </div>

      <OrdersClient initialOrders={orders} />
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Patron Orders
        </h1>
        <p className="mt-1 text-xs text-[#A89A8C]">
          Track, dispatch, and fulfill artisanal orders across India.
        </p>
      </div>

      <Suspense fallback={<div className="h-64 rounded-2xl animate-pulse bg-white/5" />}>
        <OrdersData />
      </Suspense>
    </div>
  );
}
