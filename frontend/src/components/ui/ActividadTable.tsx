import { Tag } from './Tag'
import type { ActividadMetrica } from '@/types/api'

const TASK_ICONS = ['🎨', '✏️', '🔤', '🔀', '🔢', '👂', '🧩', '🌈']

function nivelActividad(pct: number | null): { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' } {
  if (pct === null) return { label: 'Sin datos', variant: 'neutral' }
  if (pct >= 70) return { label: 'Dominada', variant: 'success' }
  if (pct >= 50) return { label: 'En progreso', variant: 'warning' }
  return { label: 'Necesita apoyo', variant: 'danger' }
}

interface Props {
  porActividad: ActividadMetrica[]
}

/** Tabla de progreso por actividad — usada en Dashboard y en el perfil de cada menor. */
export function ActividadTable({ porActividad }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="px-6 py-2.5 font-semibold text-gray-400 text-xs uppercase tracking-wide">Actividad</th>
            <th className="px-4 py-2.5 font-semibold text-gray-400 text-xs uppercase tracking-wide w-1/3">Progreso</th>
            <th className="px-4 py-2.5 font-semibold text-gray-400 text-xs uppercase tracking-wide text-right">Aciertos</th>
            <th className="px-6 py-2.5 font-semibold text-gray-400 text-xs uppercase tracking-wide text-right">Estado</th>
          </tr>
        </thead>
        <tbody>
          {porActividad.map((a) => {
            const total = a.aciertos + a.fallidos
            const pct = total > 0 ? Math.round((a.aciertos / total) * 100) : null
            const nivel = nivelActividad(pct)
            return (
              <tr key={a.task_num} className="border-b border-gray-50 last:border-none hover:bg-bg/60 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: `${a.color}1a` }}>
                      {TASK_ICONS[a.task_num - 1]}
                    </span>
                    <span className="font-semibold text-navy">{a.task_num}. {a.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct ?? 0}%`, background: a.color }} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-9 text-right">{pct === null ? '—' : `${pct}%`}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right text-gray-500 font-medium">
                  {a.aciertos}/{total || 0}
                </td>
                <td className="px-6 py-3.5 text-right">
                  <Tag variant={nivel.variant} dot>{nivel.label}</Tag>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
