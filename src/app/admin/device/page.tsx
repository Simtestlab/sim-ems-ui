import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Device" visitedRoute="/admin/device">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Admin — Device" description="Device administration placeholder." />
      </main>
    </DashboardLayout>
  )
}
