import { products as perfumes } from "@/data/perfumeoil";
import { products as spices } from "@/data/spices";

// TODO (backend phase): replace these with fetch() calls to your API.
// Keep the function names and return types so pages don't change.

export function getPerfumes() {
  return perfumes;
}

export function getPerfumeBySlug(slug: string) {
  return perfumes.find((p) => p.slug === slug) ?? null;
}

export function getSpices() {
  return spices;
}

export function getSpiceBySlug(slug: string) {
  return spices.find((p) => p.slug === slug) ?? null;
}