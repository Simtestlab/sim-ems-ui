import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="History" visitedRoute="/reports/history">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="Reports — History" description="Report history placeholder." />
      </main>
    </DashboardLayout>
  )
}
