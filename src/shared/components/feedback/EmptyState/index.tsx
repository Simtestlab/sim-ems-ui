import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

const DefaultEmptyIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="8" y="22" width="48" height="34" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
    <path d="M8 26h48" stroke="#cbd5e1" strokeWidth="1.5" />
    <path d="M8 22l8-10h32l8 10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M32 12v14" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="20" y1="38" x2="44" y2="38" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />
    <line x1="24" y1="46" x2="40" y2="46" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />
  </svg>
)

export default function EmptyState({ title, description, icon, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex h-full min-h-[60vh] w-full flex-col items-center justify-center px-4 pb-[15vh] text-center ${className}`}>
      <div className="mb-5 opacity-80">{icon ?? <DefaultEmptyIcon />}</div>
      <h3 className="mb-1.5 text-[15px] font-semibold text-[#374151]">{title}</h3>
      {description && <p className="max-w-sm text-[13px] text-[#6b7280]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
