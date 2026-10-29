import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CategoryModel from "@/models/category";

const DEFAULT_CATEGORIES = [
  {
    name: "Estate Coffee",
    slug: "coffee",
    description: "Single-origin shade grown micro-lot roasts from Coorg & Wayanad.",
    image: "/images/coffee/arabica.jpeg",
    subCategories: ["Whole Bean & Grounds", "Filter Roast", "Dark Roast", "Cold Brew Blend", "Estate Reserve"],
  },
  {
    name: "Malabar Spices",
    slug: "spices",
    description: "Export-grade 8mm+ green cardamom, Tellicherry bold pepper, and turmeric.",
    image: "/images/spices/cardamom.avif",
    subCategories: ["Whole Spices", "Single-Origin Pods", "Estate Harvest", "Organic Powders"],
  },
  {
    name: "Rare Fragrance Oils",
    slug: "perfumeoil",
    description: "Traditional deg-bhapka hydro-distillates and rare Cambodian oud oils.",
    image: "/images/Elegant Bottle Display.png",
    subCategories: ["Pure Attar Distillate", "Aged Oud Oil", "Artisanal Floral"],
  },
  {
    name: "Mattresses",
    slug: "importedbed",
    description: "7-zone ergonomic mattresses engineered for zero-pressure spinal alignment and deep restorative sleep.",
    image: "/images/importedbed/double-bed.jpeg",
    subCategories: ["Organic Latex Mattresses", "Ergonomic Mattresses", "Orthopedic Mattresses", "Mattress Toppers & Covers"],
  },
];

export async function GET() {
  await connectDB();

  let categories = await CategoryModel.find().sort({ createdAt: 1 });

  // Auto-seed default categories if database has no categories yet
  if (categories.length === 0) {
    await CategoryModel.insertMany(DEFAULT_CATEGORIES);
    categories = await CategoryModel.find().sort({ createdAt: 1 });
  }

  return NextResponse.json(categories, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const name = body.name.trim();
    let slug = body.slug ? body.slug.trim().toLowerCase() : "";
    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    // Check if slug already exists
    const existing = await CategoryModel.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: `Category with slug '${slug}' already exists` },
        { status: 400 }
      );
    }

    const newCategory = await CategoryModel.create({
      name,
      slug,
      description: body.description || "",
      image: body.image || "",
      subCategories: Array.isArray(body.subCategories) ? body.subCategories : [],
      featured: body.featured ?? true,
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to create category";
    return NextResponse.json({ error }, { status: 500 });
  }
}
