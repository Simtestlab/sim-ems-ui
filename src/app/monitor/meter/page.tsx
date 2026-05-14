import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Meter" visitedRoute="/monitor/meter">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Meter" description="Meter monitoring placeholder." />
      </main>
    </DashboardLayout>
  )
}
