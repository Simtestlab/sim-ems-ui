import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EmptyState from '@/shared/components/feedback/EmptyState'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="FPS" visitedRoute="/monitor/fps">
      <main className="flex-1 overflow-auto p-6">
        <EmptyState title="FPS" description="FPS placeholder page." />
      </main>
    </DashboardLayout>
  )
}
