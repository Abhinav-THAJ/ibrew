import Link from "next/link";
import ProductForm from "../ProductForm";

export default function AddProduct() {
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-neutral-500 underline underline-offset-4 hover:text-black">
        ← Back to products
      </Link>
      <h1 className="mb-8 mt-3 text-2xl font-semibold">Add product</h1>
      <ProductForm />
    </div>
  );
}