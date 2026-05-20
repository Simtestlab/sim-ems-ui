"use client"

import { useState } from 'react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import SettingsPage from '@/modules/settings/pages/SettingsPage'
import SettingsPageHeader from '@/modules/settings/components/SettingsPageHeader'
import ModeTabs from '@/modules/settings/components/ModeTabs'

export default function Page() {
  const [activeMode, setActiveMode] = useState<'manual' | 'auto'>('auto')

  const handleStop = () => {
    console.log('Stop button clicked')
  }

  return (
    <DashboardLayout
      initialActiveTab="Settings"
      visitedRoute="/settings"
      statusBar={
        <>
          <SettingsPageHeader
            siteName="Demo"
            operatingMode="Auto"
            remoteControl="Enable"
            currentModeRuntime="3 Days 9 Hours 8 Minutes"
            totalRuntime="14 Days 5 Hours 6 Minutes"
            onStop={handleStop}
          />
          <ModeTabs activeMode={activeMode} onModeChange={setActiveMode} />
        </>
      }
    >
      <SettingsPage activeMode={activeMode} onModeChange={setActiveMode} />
    </DashboardLayout>
  )
}
