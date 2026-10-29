import { redirect } from "next/navigation";

export default function SpicesRedirect() {
  redirect("/shop?category=spices");
}
