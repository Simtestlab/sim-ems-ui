import type { ReactNode } from 'react'

type TooltipProps = {
  content: ReactNode
  children: ReactNode
  className?: string
  bubbleClassName?: string
}

export default function Tooltip({ content, children, className = '', bubbleClassName = '' }: TooltipProps) {
  return (
    <span className={`relative inline-flex group/tooltip ${className}`}>
      {children}
      <span className={`pointer-events-none absolute left-1/2 top-0 z-20 hidden -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-md bg-[#2f3338] px-3 py-2 text-[11px] font-medium text-white shadow-[0_8px_20px_rgba(15,23,42,0.22)] group-hover/tooltip:block ${bubbleClassName}`}>
        {content}
        <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-[7px] border-r-[7px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#2f3338]" />
      </span>
    </span>
  )
}