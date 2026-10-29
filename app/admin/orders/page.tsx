import { Suspense } from "react";
import connectDB from "@/lib/mongodb";
import Order, { OrderType } from "@/models/order";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

async function OrdersData() {
  await connectDB();
  const orders: OrderType[] = JSON.parse(
    JSON.stringify(await Order.find().sort({ createdAt: -1 }).lean())
  );

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrders = orders.filter((o) => o.status === "confirmed" || o.status === "processing").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-black bg-black p-5 text-white">
          <p className="text-xs uppercase tracking-widest text-white/60">Total Orders</p>
          <p className="mt-2 text-3xl font-semibold">{totalOrders}</p>
        </div>
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-xs uppercase tracking-widest text-neutral-500">Gross Patron Revenue</p>
          <p className="mt-2 text-3xl font-semibold">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-xs uppercase tracking-widest text-neutral-500">In Fulfillment</p>
          <p className="mt-2 text-3xl font-semibold">{activeOrders}</p>
        </div>
      </div>

      <OrdersClient initialOrders={orders} />
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Patron Orders</h1>
        <p className="mt-1 text-sm text-neutral-500">Track and fulfill orders placed across India.</p>
      </div>

      <Suspense fallback={<div className="h-64 animate-pulse bg-neutral-200 rounded-xl" />}>
        <OrdersData />
      </Suspense>
    </div>
  );
}
