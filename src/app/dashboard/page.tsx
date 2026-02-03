import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const accessToken = (await cookies()).get('access_token')?.value;
  if (!accessToken) redirect('/login');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to the dashboard.</p>
    </div>
  );
}
