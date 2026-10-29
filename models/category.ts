import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subCategories?: string[];
  featured?: boolean;
}

export interface ICategoryDoc extends ICategory, Document {}

const CategorySchema = new Schema<ICategoryDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    subCategories: [{ type: String, trim: true }],
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CategoryModel: Model<ICategoryDoc> =
  mongoose.models.Category || mongoose.model<ICategoryDoc>("Category", CategorySchema);

export default CategoryModel;

export interface CategoryType extends ICategory {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
