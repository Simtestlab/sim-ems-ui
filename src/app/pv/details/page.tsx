import { redirect } from 'next/navigation'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  const query = id ? `?id=${id}` : ''
  redirect(`/monitor/pv/details${query}`)
}
