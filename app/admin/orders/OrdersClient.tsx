"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/data/products";
import type { OrderType } from "@/models/order";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  processing: "bg-amber-100 text-amber-800 border-amber-300",
  shipped: "bg-blue-100 text-blue-800 border-blue-300",
  delivered: "bg-purple-100 text-purple-800 border-purple-300",
  cancelled: "bg-rose-100 text-rose-800 border-rose-300",
  pending: "bg-neutral-100 text-neutral-800 border-neutral-300",
};

export default function OrdersClient({ initialOrders }: { initialOrders: OrderType[] }) {
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus as any } : o))
        );
      } else {
        alert("Failed to update status");
      }
    } catch {
      alert("Network error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
        <p className="text-neutral-500 text-sm">No patron orders have been placed yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="py-4 px-6">Order</th>
              <th className="py-4 px-6">Patron Details</th>
              <th className="py-4 px-6">Items</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Payment</th>
              <th className="py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {orders.map((o) => {
              const dateStr = o.createdAt
                ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Recent";

              return (
                <tr key={o._id} className="hover:bg-neutral-50/50 transition">
                  <td className="py-4 px-6 align-top">
                    <span className="font-mono font-bold text-black">{o.orderNumber}</span>
                    <span className="block text-xs text-neutral-400 mt-0.5">{dateStr}</span>
                  </td>

                  <td className="py-4 px-6 align-top max-w-[220px]">
                    <span className="font-semibold text-neutral-900 block">{o.customerName}</span>
                    <span className="text-xs text-neutral-500 block truncate">{o.customerEmail}</span>
                    {o.customerPhone && (
                      <span className="text-xs text-neutral-500 block">{o.customerPhone}</span>
                    )}
                    <span className="text-xs text-neutral-400 block mt-1 truncate">
                      {o.city} • {o.postalCode}
                    </span>
                  </td>

                  <td className="py-4 px-6 align-top">
                    <div className="space-y-2">
                      {o.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs">
                          {item.image && (
                            <div className="relative h-8 w-8 shrink-0 rounded bg-neutral-100 overflow-hidden border border-neutral-200">
                              <img src={item.image} alt="" className="h-full w-full object-cover" />
                            </div>
                          )}
                          <span className="font-medium text-neutral-800 truncate max-w-[150px]">
                            {item.name}
                          </span>
                          <span className="text-neutral-500">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-4 px-6 align-top">
                    <span className="font-bold text-neutral-900 font-serif text-base">
                      {formatPrice(o.totalAmount)}
                    </span>
                    {o.discount > 0 && (
                      <span className="block text-[11px] text-emerald-600 font-medium">
                        Privilege: -{formatPrice(o.discount)}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 align-top">
                    <span className="inline-block text-xs uppercase font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded">
                      {o.paymentMethod === "cod" ? "Pay on Delivery" : "Online Verified"}
                    </span>
                  </td>

                  <td className="py-4 px-6 align-top">
                    <select
                      value={o.status}
                      disabled={updatingId === o._id}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded border capitalize cursor-pointer outline-none ${
                        STATUS_COLORS[o.status] || STATUS_COLORS.confirmed
                      }`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
