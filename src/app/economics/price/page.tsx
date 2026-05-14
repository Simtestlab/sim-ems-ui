import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Price" visitedRoute="/economics/price">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Economics — Price" description="Price analytics placeholder." />
      </main>
    </DashboardLayout>
  )
}
