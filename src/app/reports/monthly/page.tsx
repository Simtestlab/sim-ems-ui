import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Monthly" visitedRoute="/reports/monthly">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Reports — Monthly" description="Monthly report placeholder." />
      </main>
    </DashboardLayout>
  )
}
