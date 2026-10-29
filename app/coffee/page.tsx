import { redirect } from "next/navigation";

export default function CoffeeRedirect() {
  redirect("/shop?category=coffee");
}