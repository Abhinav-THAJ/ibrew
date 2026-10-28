export type SpiceProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  mrp: number;
  weight: string;
  image: string;
  badge?: string;
};

export const spiceCategories = ["All", "Whole Spices", "Ground Spices", "Blends"];

export const products: SpiceProduct[] = [
  {
    id: "sp-001",
    slug: "kashmiri-chilli",
    name: "Kashmiri Chilli Powder",
    description: "Vibrant red colour with mild heat. Ground fresh.",
    category: "Ground Spices",
    price: 249,
    mrp: 299,
    weight: "200g",
    image: "/images/spices/kashmiri-chilli.jpg",
    badge: "Popular",
  },
  {
    id: "sp-002",
    slug: "green-cardamom",
    name: "Green Cardamom",
    description: "Aromatic whole pods, hand-picked and sun dried.",
    category: "Whole Spices",
    price: 399,
    mrp: 499,
    weight: "100g",
    image: "/images/spices/green-cardamom.jpg",
  },
];

export function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}