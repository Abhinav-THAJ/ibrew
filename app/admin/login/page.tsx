"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
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
        setError("Invalid credentials. Try 123456 or ibrew@admin2026");
      }
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D0A09] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#1A1513] border border-white/10 p-8 shadow-2xl text-[#FAF7F2]">
        
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo-ibrew.png"
              alt="ibrew Luxury Roasters"
              width={160}
              height={50}
              className="h-10 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(214,178,124,0.35)]"
            />
          </div>
          <h1 className="text-xs font-bold uppercase tracking-[0.25em] text-[#D6B27C]">
            Admin Studio Portal
          </h1>
          <p className="text-[11px] text-[#A89A8C]">
            Restricted access for store management &amp; orders
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C4B7A7] mb-2">
              Security Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoFocus
                className="w-full rounded-xl bg-[#241E1A] border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#D6B27C] focus:ring-1 focus:ring-[#D6B27C]"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40">
                <Lock size={15} />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/60 border border-red-500/40 p-3 text-xs text-red-300 font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#D6B27C] hover:bg-[#C29B38] text-[#120F0D] py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? "Verifying..." : "Access Studio"}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-[11px] text-[#8C7E72]">
            Default credentials: <code className="text-[#D6B27C] bg-white/5 px-1.5 py-0.5 rounded">123456</code>
          </p>
        </div>

      </div>
    </div>
  );
}
