import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "../../modules/auth/pages/LoginPage";

export default async function LoginPage() {
  const accessToken = (await cookies()).get("access_token")?.value;
  console.log("Access Token in Login Page:", accessToken);
  if (accessToken) redirect("/live");

  return <LoginClient />;
}