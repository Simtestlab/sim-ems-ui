import PCSDetailsPage from '@/modules/pcs/pages/PCSDetailsPage'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  return <PCSDetailsPage params={{ id }} />
}
