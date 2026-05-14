import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Revenue" visitedRoute="/economics/revenue">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Economics — Revenue" description="Revenue analytics placeholder." />
      </main>
    </DashboardLayout>
  )
}
