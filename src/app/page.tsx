import { redirect } from "next/navigation";

export default function Home() {
  // Since AuthWrapper handles authentication,
  // just redirect to the main app route
  redirect("/live");
}
