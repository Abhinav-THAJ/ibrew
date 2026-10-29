import mongoose, { Schema, Document, Model } from "mongoose";
import { CATEGORIES, SUBCATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/constants";

export { CATEGORIES, SUBCATEGORIES };
export type { Category };

export interface IImage {
  url: string;
  public_id: string;
}

export interface IProduct {
  name: string;
  description: string;
  price: number;
  mrp: number;
  category: Category;
  subCategory: string;
  badge: string;
  images: IImage[];
  stock: number;
  soldOut: boolean;
  featured: boolean;
}

export interface IProductDoc extends IProduct, Document {}

const ProductSchema = new Schema<IProductDoc>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    mrp: { type: Number, default: 0 },
    category: { type: String, required: true, enum: CATEGORIES },
    subCategory: { type: String, default: "" },
    badge: { type: String, default: "" },
    images: [{ url: String, public_id: String }],
    stock: { type: Number, default: 0 },
    soldOut: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product: Model<IProductDoc> =
  mongoose.models.Product || mongoose.model<IProductDoc>("Product", ProductSchema);

export default Product;

// Plain shape your components receive after JSON serialization
export interface ProductType extends IProduct {
  _id: string;
  createdAt: string;
  updatedAt: string;
}