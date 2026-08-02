import { redirect } from "next/navigation";

export default function Home() {
  // Redirect root to default locale (/en)
  redirect("/en");
}
