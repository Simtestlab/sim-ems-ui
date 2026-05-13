export default function BranchIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-3 h-5 ${className}`} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="2.2" />
      <line x1="6" y1="7" x2="6" y2="13" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="6" cy="15.5" r="2.5" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  )
}
