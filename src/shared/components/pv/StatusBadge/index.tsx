type StatusBadgeProps = {
  status: string
  className?: string
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusLabel = status.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
  
  return (
    <div 
      style={{ height: 24 }} 
      className={`flex items-center gap-1 bg-[#effcf5] border border-[#bcefcf] text-[#29c77c] px-2.5 rounded-full text-[11px] font-semibold tracking-[0.02em] ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#26c281]" />
      {statusLabel}
    </div>
  )
}
