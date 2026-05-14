import EVDetailsPage from '@/modules/ev/pages/EVDetailsPage'

export default function RoutePage({ params }: { params?: { id?: string } }) {
  return <EVDetailsPage params={params} />
}
