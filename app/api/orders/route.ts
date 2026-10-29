import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/order";

export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Generate unique order number if not provided
    if (!body.orderNumber) {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      body.orderNumber = `IBR-${randomNum}`;
    }

    const order = await Order.create(body);
    return NextResponse.json(order, { status: 201 });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to place order";
    return NextResponse.json({ error }, { status: 400 });
  }
}
