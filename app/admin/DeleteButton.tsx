"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
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
      className="border border-neutral-300 px-3 py-1.5 text-xs uppercase tracking-wider text-neutral-600 transition hover:border-black hover:bg-black hover:text-white disabled:opacity-50"
    >
      {busy ? "..." : "Delete"}
    </button>
  );
}