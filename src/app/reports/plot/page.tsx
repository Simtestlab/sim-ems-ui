import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Plot" visitedRoute="/reports/plot">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Reports — Plot" description="Plot report placeholder." />
      </main>
    </DashboardLayout>
  )
}
