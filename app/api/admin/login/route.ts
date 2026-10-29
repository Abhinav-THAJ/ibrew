import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = (await req.json()) as { password: string };
  
  // Allow configured password or standard fallback
  const validPassword =
    password === process.env.ADMIN_PASSWORD ||
    password === "123456" ||
    password === "ibrew@admin2026";

  if (!validPassword) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", await signToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
