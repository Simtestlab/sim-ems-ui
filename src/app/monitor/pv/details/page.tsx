import PVDetailsPage from '@/modules/pv-details/pages/PVDetailsPage'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams

  return <PVDetailsPage params={{ id }} />
}
