import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EconomicsRevenuePage from '@/modules/economics/pages/EconomicsRevenuePage'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Revenue" visitedRoute="/economics/revenue">
      <EconomicsRevenuePage />
    </DashboardLayout>
  )
}
