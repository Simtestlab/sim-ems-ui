export default function SolarPanelIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-10 h-10 ${className}`} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" fill="#1890FF" fillOpacity="0.15" stroke="#1890FF" strokeWidth="2" />
      <path d="M14 9L34 19M10 16L38 30M14 29L34 39" stroke="#1890FF" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M24 14V34M14 19V39M34 9V29" stroke="#1890FF" strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  )
}
