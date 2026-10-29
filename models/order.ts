import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: "cod" | "online";
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
}

export interface IOrderDoc extends IOrder, Document {}

const OrderSchema = new Schema<IOrderDoc>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true },
    customerPhone: { type: String, default: "" },
    shippingAddress: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Order: Model<IOrderDoc> =
  mongoose.models.Order || mongoose.model<IOrderDoc>("Order", OrderSchema);

export default Order;

export interface OrderType extends IOrder {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
