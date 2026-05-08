import React from 'react'
import './globals.css'

export const metadata = {
  title: 'SIM EMS UI',
  description: 'Demo UI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}