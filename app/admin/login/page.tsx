"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong password");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8">
        <p className="text-center text-2xl font-semibold tracking-[0.3em]">IBREW</p>
        <p className="mt-2 text-center text-xs uppercase tracking-widest text-neutral-500">Admin panel</p>

        <label className="mt-8 block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-neutral-600">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="w-full border border-neutral-300 px-3 py-3 text-sm outline-none transition focus:border-black"
          />
        </label>

        {error && <p className="mt-3 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-black py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}