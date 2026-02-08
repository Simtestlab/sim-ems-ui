import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "../../modules/auth/pages/LoginPage";

export default async function LoginPage() {
  const accessToken = (await cookies()).get("access_token")?.value;
  if (accessToken) redirect("/live");

  return <LoginClient />;
}