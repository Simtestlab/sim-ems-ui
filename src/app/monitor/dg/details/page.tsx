import DGDetailsPage from '@/modules/dg/pages/DGDetailsPage'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  return <DGDetailsPage params={{ id }} />
}
