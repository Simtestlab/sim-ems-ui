import OverviewPage from '@/modules/dashboard/pages/OverviewPage'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Overview" visitedRoute="/monitor/overview">
      <OverviewPage />
    </DashboardLayout>
  )
}
