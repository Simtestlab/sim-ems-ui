"use client"

type PowerInputFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  unit: string
  measured?: string
  commanded?: string
}

export default function PowerInputField({
  label,
  value,
  onChange,
  unit,
  measured,
  commanded,
}: PowerInputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-[13px] font-medium text-[#0f1724]">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-9 px-3 pr-12 rounded border border-[#dce4ee] text-[13px] text-[#0f1724] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#9aa4b2] pointer-events-none">
            {unit}
          </div>
        </div>
        {(measured || commanded) && (
          <div className="flex flex-col text-[11px] text-[#6b7280] min-w-[100px]">
            {measured && <div>Measured: {measured}</div>}
            {commanded && <div>Commanded: {commanded}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
