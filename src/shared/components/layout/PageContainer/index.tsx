import React from 'react'

type PageContainerProps = {
  children: React.ReactNode
  className?: string
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`h-full w-full ${className}`}>
      {children}
    </div>
  )
}
