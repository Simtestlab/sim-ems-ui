import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="System" visitedRoute="/system">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="System" description="System configuration placeholder." />
      </main>
    </DashboardLayout>
  )
}
