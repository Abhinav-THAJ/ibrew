import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CategoryModel from "@/models/category";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await connectDB();
  const category = await CategoryModel.findById(id);
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json(category);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await connectDB();
  try {
    const body = await req.json();
    const updateData: Record<string, any> = {
      name: body.name,
      description: body.description,
      image: body.image,
    };
    if (body.slug) {
      updateData.slug = body.slug.trim().toLowerCase();
    }
    if (Array.isArray(body.subCategories)) {
      updateData.subCategories = body.subCategories;
    }

    const updated = await CategoryModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to update category";
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await connectDB();
  const deleted = await CategoryModel.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
