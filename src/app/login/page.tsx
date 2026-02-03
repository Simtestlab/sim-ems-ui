import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  const accessToken = (await cookies()).get("access_token")?.value;
  if (accessToken) redirect("/dashboard");

  return <LoginClient />;
}