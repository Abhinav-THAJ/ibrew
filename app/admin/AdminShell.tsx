"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import {
  ExternalLink,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PlusSquare,
  ShoppingBag,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/add", label: "Add product", icon: PlusSquare },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    if (href === "/admin/products")
      return pathname.startsWith("/admin/products") || pathname.startsWith("/admin/edit");
    if (href === "/admin/categories") return pathname.startsWith("/admin/categories");
    if (href === "/admin/orders") return pathname.startsWith("/admin/orders");
    return pathname.startsWith(href);
  };

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#0D0A09] text-[#FAF7F2]">
      {open && (
        <div className="fixed inset-0 z-20 bg-black/80 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#14100E] text-[#FAF7F2] border-r border-white/10 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/images/logo-ibrew.png"
              alt="ibrew Luxury Roasters"
              width={160}
              height={50}
              priority
              className="h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(214,178,124,0.35)]"
            />
          </Link>
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-white/5 bg-[#181311]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D6B27C]">
            Admin Studio Portal
          </span>
        </div>

        <nav className="flex-1 space-y-1.5 p-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                  active
                    ? "bg-[#D6B27C] text-[#120F0D] font-bold shadow-md shadow-[#D6B27C]/20"
                    : "text-[#C4B7A7] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1.5 border-t border-white/10 p-4 bg-[#100D0B]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider text-[#C4B7A7] hover:text-[#D6B27C] transition"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
            View Live Store
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs uppercase tracking-wider text-white/50 hover:text-red-400 transition"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      {/* content area */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#0D0A09]">
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#14100E] px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 text-white">
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-semibold tracking-[0.2em] text-xs text-[#D6B27C]">IBREW STUDIO</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0D0A09]">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
