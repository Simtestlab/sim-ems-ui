import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="BMS" visitedRoute="/monitor/bms">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="BMS" description="BMS monitoring placeholder." />
      </main>
    </DashboardLayout>
  )
}
