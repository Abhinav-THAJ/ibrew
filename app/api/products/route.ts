import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/product";



export async function GET(req: NextRequest) {
  await connectDB();

  const category = req.nextUrl.searchParams.get("category");

  // Allow filtering by ANY category (dynamic)
  const filter =
    category && category !== "all"
      ? { category: category.trim().toLowerCase() }
      : {};

  const products = await Product.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(products, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    if (body.category) {
      body.category = String(body.category).trim().toLowerCase();
    }
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
