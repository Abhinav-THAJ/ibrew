"use client";

import { useState } from "react";
import { formatPrice } from "@/data/products";
import type { OrderType } from "@/models/order";

const STATUS_BADGES: Record<string, string> = {
  confirmed: "bg-emerald-950/70 text-emerald-300 border-emerald-500/40",
  processing: "bg-amber-950/70 text-amber-300 border-amber-500/40",
  shipped: "bg-blue-950/70 text-blue-300 border-blue-500/40",
  delivered: "bg-purple-950/70 text-purple-300 border-purple-500/40",
  cancelled: "bg-rose-950/70 text-rose-300 border-rose-500/40",
  pending: "bg-neutral-800 text-neutral-300 border-neutral-600",
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
      <div className="rounded-2xl border border-white/10 bg-[#181311] p-16 text-center text-xs text-[#A89A8C]">
        No patron orders have been placed yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#181311] overflow-hidden shadow-xl text-[#FAF7F2]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-[#201A17] text-[11px] uppercase tracking-wider text-[#D6B27C] border-b border-white/10">
            <tr>
              <th className="py-4 px-6 font-bold">Order Reference</th>
              <th className="py-4 px-6 font-bold">Patron Information</th>
              <th className="py-4 px-6 font-bold">Items</th>
              <th className="py-4 px-6 font-bold">Total Amount</th>
              <th className="py-4 px-6 font-bold">Payment Method</th>
              <th className="py-4 px-6 font-bold">Fulfillment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {orders.map((o) => {
              const dateStr = o.createdAt
                ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Recent";

              return (
                <tr key={o._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 align-top">
                    <span className="font-mono font-bold text-white text-sm block">{o.orderNumber}</span>
                    <span className="text-[11px] text-[#A89A8C] mt-1 block">{dateStr}</span>
                  </td>

                  <td className="py-4 px-6 align-top max-w-[220px]">
                    <span className="font-semibold text-white block text-sm">{o.customerName}</span>
                    <span className="text-xs text-[#C4B7A7] block truncate mt-0.5">{o.customerEmail}</span>
                    {o.customerPhone && (
                      <span className="text-xs text-[#A89A8C] block mt-0.5">{o.customerPhone}</span>
                    )}
                    <span className="text-[11px] text-[#8C7E72] block mt-1.5 truncate">
                      {o.city} • {o.postalCode}
                    </span>
                  </td>

                  <td className="py-4 px-6 align-top">
                    <div className="space-y-2">
                      {o.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs">
                          {item.image && (
                            <div className="relative h-8 w-8 shrink-0 rounded-lg bg-white/5 overflow-hidden border border-white/10">
                              <img src={item.image} alt="" className="h-full w-full object-cover" />
                            </div>
                          )}
                          <span className="font-medium text-white truncate max-w-[160px]">
                            {item.name}
                          </span>
                          <span className="text-[#D6B27C] font-mono">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-4 px-6 align-top">
                    <span className="font-bold text-[#D6B27C] font-serif text-base block">
                      {formatPrice(o.totalAmount)}
                    </span>
                    {o.discount > 0 && (
                      <span className="text-[10px] text-[#68D391] font-semibold mt-0.5 block">
                        Privilege: -{formatPrice(o.discount)}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 align-top">
                    <span className="inline-block text-[11px] uppercase tracking-wider font-semibold text-white/90 bg-[#241E1A] border border-white/10 px-3 py-1 rounded-full">
                      {o.paymentMethod === "cod" ? "Pay on Delivery" : "Online Verified"}
                    </span>
                  </td>

                  <td className="py-4 px-6 align-top">
                    <select
                      value={o.status}
                      disabled={updatingId === o._id}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border capitalize cursor-pointer outline-none transition-colors ${
                        STATUS_BADGES[o.status] || STATUS_BADGES.confirmed
                      }`}
                    >
                      <option value="confirmed" className="bg-[#181311] text-emerald-300">Confirmed</option>
                      <option value="processing" className="bg-[#181311] text-amber-300">Processing</option>
                      <option value="shipped" className="bg-[#181311] text-blue-300">Shipped</option>
                      <option value="delivered" className="bg-[#181311] text-purple-300">Delivered</option>
                      <option value="cancelled" className="bg-[#181311] text-rose-300">Cancelled</option>
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
