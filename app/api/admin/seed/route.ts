import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/product";
import { INITIAL_PRODUCTS } from "@/data/products";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const count = await Product.countDocuments();
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "true";

    if (count > 0 && !force) {
      return NextResponse.json({
        message: `Database already contains ${count} products. Pass ?force=true to re-seed.`,
        count,
      });
    }

    if (force) {
      await Product.deleteMany({});
    }

    const docs = INITIAL_PRODUCTS.map((item) => ({
      name: item.name,
      description: item.description,
      price: item.price,
      mrp: item.mrp || item.price,
      category: item.category,
      subCategory: item.subCategory || "",
      badge: item.badge || "",
      images: [{ url: item.image, public_id: "" }],
      stock: item.stock || 20,
      soldOut: false,
      featured: item.featured || false,
    }));

    const inserted = await Product.insertMany(docs);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted.length} artisanal products to MongoDB Atlas.`,
      count: inserted.length,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to seed products";
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const count = await Product.countDocuments();
    return NextResponse.json({ count });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "DB error";
    return NextResponse.json({ error }, { status: 500 });
  }
}
