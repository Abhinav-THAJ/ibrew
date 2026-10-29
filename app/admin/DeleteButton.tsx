"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Remove this offering permanently from the cloud database?")) return;
    setBusy(true);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("Could not delete product");
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      title="Delete offering"
      className="inline-flex items-center gap-1 rounded-full border border-red-500/30 hover:border-red-500 text-red-400 hover:bg-red-950/40 px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
    >
      <Trash2 size={12} />
      <span>{busy ? "..." : "Delete"}</span>
    </button>
  );
}
