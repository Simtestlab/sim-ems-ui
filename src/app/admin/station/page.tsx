import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Station" visitedRoute="/admin/station">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Admin — Station" description="Station administration placeholder." />
      </main>
    </DashboardLayout>
  )
}
