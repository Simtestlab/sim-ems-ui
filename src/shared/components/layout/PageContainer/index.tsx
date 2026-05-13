import React from 'react'

type PageContainerProps = {
  children: React.ReactNode
  className?: string
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`min-h-screen w-full ${className}`}>
      {children}
    </div>
  )
}
