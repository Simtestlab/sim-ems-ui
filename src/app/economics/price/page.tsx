import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EconomicsPricePage from '@/modules/economics/pages/EconomicsPricePage'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Price" visitedRoute="/economics/price">
      <EconomicsPricePage />
    </DashboardLayout>
  )
}
