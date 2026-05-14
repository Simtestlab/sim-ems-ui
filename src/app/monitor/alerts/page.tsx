import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Alerts" visitedRoute="/monitor/alerts">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Alerts" description="Alerts placeholder page." />
      </main>
    </DashboardLayout>
  )
}
