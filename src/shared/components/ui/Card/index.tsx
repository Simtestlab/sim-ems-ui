import React from 'react'

type CardProps = {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export default function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${paddings[padding]} ${className}`}>
      {children}
    </div>
  )
}
