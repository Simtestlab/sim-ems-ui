import { redirect } from 'next/navigation'

export default function RoutePage({ params }: { params?: { id?: string } }) {
  const query = params?.id ? `?id=${params.id}` : ''
  redirect(`/monitor/ev/details${query}`)
}
