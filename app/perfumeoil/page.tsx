import { redirect } from "next/navigation";

export default function PerfumeOilRedirect() {
  redirect("/shop?category=perfumeoil");
}
