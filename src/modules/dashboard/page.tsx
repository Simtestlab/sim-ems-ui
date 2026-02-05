import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardClient } from "@/modules/dashboard";

export default async function DashboardPage() {
  const accessToken = (await cookies()).get('access_token')?.value;
  if (!accessToken) redirect('/login');

  return <DashboardClient />;
}
