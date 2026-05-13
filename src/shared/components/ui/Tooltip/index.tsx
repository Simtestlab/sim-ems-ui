import React from 'react'

type TooltipProps = {
  content: string
  children: React.ReactNode
  className?: string
}

export default function Tooltip({ content, children, className = '' }: TooltipProps) {
  const [show, setShow] = React.useState(false)

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && content && (
        <div className="absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  )
}
