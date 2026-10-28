export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  badge?: string;
};

export const categories = ["All", "Perfume Oil", "Eau de Parfum", "Attar"];

export const products: Product[] = [
  {
    id: "po-001",
    slug: "royal-oud",
    name: "Royal Oud",
    description: "Warm, woody oud with a soft amber finish. Long lasting and alcohol free.",
    category: "Perfume Oil",
    price: 1499,
    mrp: 1999,
    image: "/images/perfumeoil/royal-oud.jpg",
    badge: "Bestseller",
  },
  {
    id: "po-002",
    slug: "white-musk",
    name: "White Musk",
    description: "Clean, soft musk with powdery notes for everyday wear.",
    category: "Attar",
    price: 899,
    mrp: 1199,
    image: "/images/perfumeoil/white-musk.jpg",
  },
  {
    id: "po-003",
    slug: "midnight-amber",
    name: "Midnight Amber",
    description: "Deep amber and vanilla, made for evenings and special occasions.",
    category: "Eau de Parfum",
    price: 2199,
    mrp: 2799,
    image: "/images/perfumeoil/midnight-amber.jpg",
    badge: "New",
  },
];

export function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}