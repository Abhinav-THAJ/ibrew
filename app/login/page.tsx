"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { Fraunces, Figtree } from "next/font/google";
import { Eye, EyeOff } from "lucide-react";

// ---------- Fonts (same as the home and register pages) ----------
const display = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const body = Figtree({ subsets: ["latin"] });

// ---------- Shared input style ----------
// text-base (16px) stops iPhones from zooming in when a field is tapped.
const inputClass =
  "mt-1.5 h-12 w-full rounded-xl border border-neutral-300 px-4 text-base outline-none focus:border-[#5A3420] focus:ring-2 focus:ring-[#5A3420]/20";

// ---------- Login request ----------
// TODO: replace this with a real call to your Next.js backend, for example:
// const res = await fetch("/api/auth/login", { method: "POST", ... })
// It should throw an Error with a friendly message if the login fails.
async function loginUser(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!email || !password) {
    throw new Error("Please enter your email and password.");
  }
}

// ---------- Page ----------
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await loginUser(email, password);
      // TODO: after a successful login, send the user to the home page:
      // router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      className={`${body.className} flex min-h-dvh flex-col bg-white text-neutral-900 md:grid md:grid-cols-2`}
    >
      {/* Image panel: a short banner on mobile, a full side panel on desktop */}
      <div className="relative h-32 shrink-0 md:h-auto">
        <img
          src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=85"
          alt="Fresh coffee beans"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#2B1810]/70 md:to-[#2B1810]/80" />

        {/* "Back" sits on the banner so it does not use space in the form */}
        <Link
          href="/"
          className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-2 text-sm font-semibold text-[#2B1810] md:left-10 md:top-10"
        >
          ← Back to store
        </Link>

        {/* The big tagline only shows on desktop; mobile keeps the screen for the form */}
        <p
          className={`${display.className} absolute bottom-10 left-10 hidden max-w-sm text-3xl leading-snug text-white md:block`}
        >
          Coffee, spices, fragances and sleep, brought home from around the world.
        </p>
      </div>

      {/* Form panel: on mobile it overlaps the banner like a bottom sheet */}
      <div className="relative -mt-5 flex flex-1 justify-center rounded-t-3xl bg-white px-5 pt-7 sm:px-6 md:mt-0 md:items-center md:rounded-none md:py-12">
        <div className="w-full max-w-sm">
          <h1
            className={`${display.className} text-[26px] leading-tight text-[#2B1810] sm:text-4xl`}
          >
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-neutral-600 sm:text-[15px]">
            Log in to see your orders, cart and wishlist.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-[#2B1810]">
                Email
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="next"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#2B1810]"
                >
                  Password
                </label>
                {/* py-2 makes the link taller so it is easy to tap */}
                <Link
                  href="/forgot-password"
                  className="py-2 text-sm text-[#8A6045]"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  enterKeyHint="go"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1 top-2.5 flex h-10 w-11 items-center justify-center text-neutral-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {/* On mobile the button stays pinned to the bottom of the screen.
                The padding keeps it clear of the iPhone home bar. */}
            <div className="sticky bottom-0 -mx-5 border-t border-neutral-100 bg-white/95 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:-mx-6 sm:px-6 md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:pt-1 md:backdrop-blur-none">
              <button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-full bg-[#2B1810] text-sm font-semibold text-white transition-opacity active:scale-[0.98] disabled:opacity-60"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>

          <p className="mt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-sm text-neutral-600">
            New here?{" "}
            <Link
              href="/register"
              className="inline-block py-2 font-semibold text-[#5A3420]"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}