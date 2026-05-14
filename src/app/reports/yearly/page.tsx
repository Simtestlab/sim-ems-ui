import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Yearly" visitedRoute="/reports/yearly">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Reports — Yearly" description="Yearly report placeholder." />
      </main>
    </DashboardLayout>
  )
}
