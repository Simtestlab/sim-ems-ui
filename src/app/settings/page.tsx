import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import SettingsPage from '@/modules/settings/pages/SettingsPage'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="Settings" visitedRoute="/settings">
      <SettingsPage />
    </DashboardLayout>
  )
}
