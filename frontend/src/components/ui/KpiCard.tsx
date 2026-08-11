interface Props {
  icon: string
  label: string
  value: string | number
  iconBg?: string
  iconColor?: string
  /** Variación porcentual vs. periodo anterior — positiva en verde, negativa en rojo. */
  delta?: number
  deltaLabel?: string
}

export function KpiCard({ icon, label, value, iconBg = '#f0fdf4', iconColor = '#16a34a', delta, deltaLabel }: Props) {
  return (
    <div className="bg-surface border border-gray-100 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-sm font-semibold text-gray-500">{label}</span>
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </span>
      </div>
      <div className="font-poppins text-3xl font-bold text-navy tracking-tight">{value}</div>
      {delta !== undefined && (
        <p className={`text-xs font-semibold mt-1.5 ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}% <span className="text-gray-400 font-normal">{deltaLabel ?? 'vs. semana anterior'}</span>
        </p>
      )}
    </div>
  )
}
