export default function PlantOverview() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <svg className="w-56 h-56 drop-shadow-2xl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M70 165 Q100 175 130 165" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          <path d="M85 175 Q100 182 115 175" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
          <path d="M100 150L160 120V70L100 100V150Z" fill="#f0f9ff" />
          <path d="M40 120L100 150V100L40 70V120Z" fill="#e0f2fe" />
          <path d="M40 70L100 40L160 70L100 100L40 70Z" fill="#bae6fd" />
          <path d="M40 70L15 45L75 15L100 40L40 70Z" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
          <path d="M160 70L185 45L125 15L100 40L160 70Z" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
          <path d="M98 100V150H102V100L160 71V67L100 97L40 67V71L98 100Z" fill="#f59e0b" opacity="0.8" />
        </svg>
        <span className="mt-6 text-slate-400 text-base font-bold tracking-widest uppercase">No Active Systems Found</span>
      </div>
    </div>
  )
}
