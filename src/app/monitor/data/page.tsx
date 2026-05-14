import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Data" visitedRoute="/monitor/data">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Data" description="Data placeholder page." />
      </main>
    </DashboardLayout>
  )
}
