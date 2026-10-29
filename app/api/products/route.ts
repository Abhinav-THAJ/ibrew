import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product, { CATEGORIES, Category } from "@/models/product";

export async function GET(req: NextRequest) {
  await connectDB();

  const category = req.nextUrl.searchParams.get("category");

  // only allow the four real categories
  const filter =
    category && CATEGORIES.includes(category as Category)
      ? { category: category as Category }
      : {};

  const products = await Product.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
