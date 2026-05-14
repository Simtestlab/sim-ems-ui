import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="TMS" visitedRoute="/monitor/tms">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="TMS" description="TMS placeholder page." />
      </main>
    </DashboardLayout>
  )
}
