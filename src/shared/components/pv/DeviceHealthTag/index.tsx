import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

type DeviceHealthTagProps = {
  health: 'healthy' | 'warning' | 'error'
  label?: string
  className?: string
}

const HEALTH_CONFIG = {
  healthy: {
    bg: '#effcf5',
    border: '#bcefcf',
    text: '#29c77c',
    dot: '#26c281',
    icon: CheckCircle2,
  },
  warning: {
    bg: '#fff7ed',
    border: '#fed7aa',
    text: '#f59e0b',
    dot: '#f59e0b',
    icon: AlertTriangle,
  },
  error: {
    bg: '#fef2f2',
    border: '#fecaca',
    text: '#ef4444',
    dot: '#ef4444',
    icon: XCircle,
  },
}

export default function DeviceHealthTag({ health, label, className = '' }: DeviceHealthTagProps) {
  const config = HEALTH_CONFIG[health]
  const Icon = config.icon
  const displayLabel = label || health.toUpperCase()

  return (
    <div 
      style={{ 
        height: 24,
        background: config.bg,
        borderColor: config.border,
        color: config.text,
      }} 
      className={`flex items-center gap-1.5 border px-2.5 rounded-full text-[11px] font-semibold tracking-[0.02em] ${className}`}
    >
      <Icon className="w-3 h-3" />
      {displayLabel}
    </div>
  )
}
