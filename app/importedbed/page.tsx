import { redirect } from "next/navigation";

export default function ImportedBedRedirect() {
  redirect("/shop?category=importedbed");
}