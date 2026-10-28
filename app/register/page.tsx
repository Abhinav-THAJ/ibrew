"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fraunces, Figtree } from "next/font/google";
import { Eye, EyeOff } from "lucide-react";

// ---------- Fonts (same as the home and login pages) ----------
const display = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const body = Figtree({ subsets: ["latin"] });

// ---------- Shared input style ----------
// text-base (16px) stops iPhones from zooming in when a field is tapped.
const inputClass =
  "mt-1.5 h-12 w-full rounded-xl border border-neutral-300 px-4 text-base outline-none focus:border-[#5A3420] focus:ring-2 focus:ring-[#5A3420]/20";

const MIN_PASSWORD_LENGTH = 8;

// ---------- Register request ----------
type RegisterData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

// Calls the register route in app/api/auth/register/route.ts
async function registerUser(data: RegisterData) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Sign up failed.");
  }
}

// ---------- Page ----------
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // One handler for every field: the input's "name" decides which value changes.
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  // Returns an error message, or an empty string if everything is fine.
  function validate() {
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      // The register route also logs the new user in, so go to the home page.
      router.push("/");
      router.refresh();
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
          src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=85"
          alt="Fresh spices"
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
          Join us for everyday essentials and little luxuries.
        </p>
      </div>

      {/* Form panel: on mobile it overlaps the banner like a bottom sheet */}
      <div className="relative -mt-5 flex flex-1 justify-center rounded-t-3xl bg-white px-5 pt-7 sm:px-6 md:mt-0 md:items-center md:rounded-none md:py-12">
        <div className="w-full max-w-sm">
          <h1
            className={`${display.className} text-[26px] leading-tight text-[#2B1810] sm:text-4xl`}
          >
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-neutral-600 sm:text-[15px]">
            Save your cart, track orders and keep a wishlist.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="text-sm font-medium text-[#2B1810]">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                enterKeyHint="next"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-[#2B1810]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="next"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="text-sm font-medium text-[#2B1810]">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                enterKeyHint="next"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-[#2B1810]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  enterKeyHint="next"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
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

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-[#2B1810]"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                enterKeyHint="go"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Type your password again"
                className={inputClass}
              />
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
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <p className="mt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="inline-block py-2 font-semibold text-[#5A3420]"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}