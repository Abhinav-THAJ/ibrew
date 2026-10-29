export type Category = "coffee" | "spices" | "importedbed" | "perfumeoil";

export const CATEGORIES: Category[] = ["coffee", "spices", "importedbed", "perfumeoil"];

export const CATEGORY_LABELS: Record<Category, string> = {
  coffee: "Coffee",
  spices: "Spices",
  importedbed: "Imported Beds",
  perfumeoil: "Perfume Oils",
};

// Types shown in the form for each category. Fill in the other three to match your pages.
export const SUBCATEGORIES: Record<Category, string[]> = {
  coffee: ["Coffee Powder", "Coffee Skincare"],
  spices: [],
  importedbed: [],
  perfumeoil: [],
};