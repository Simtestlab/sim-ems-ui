import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Daily" visitedRoute="/reports/daily">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Reports — Daily" description="Daily report placeholder." />
      </main>
    </DashboardLayout>
  )
}
