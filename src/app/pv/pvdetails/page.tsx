import dynamic from 'next/dynamic'

const PVDetailsPage = dynamic(
  () => import('../../../modules/Photo-voltic/components/PVDetailsPage').then((mod) => mod?.default ?? mod),
)

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams

  return <PVDetailsPage params={{ id }} />
}
