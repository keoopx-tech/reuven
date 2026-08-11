import { Tag } from './Tag'
import { formatDuracion } from '@/lib/utils/formatDuracion'
import type { SesionItem } from '@/types/api'

interface Props {
  sesiones: SesionItem[]
}

/** Tabla de últimas sesiones — usada en Métricas y en el perfil de cada menor. */
export function SesionesTable({ sesiones }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="px-6 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide">Actividad</th>
            <th className="px-4 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide text-right">Aciertos</th>
            <th className="px-4 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide text-right">Fallos</th>
            <th className="px-4 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide text-right">Duración</th>
            <th className="px-6 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide text-right">Estado</th>
          </tr>
        </thead>
        <tbody>
          {sesiones.map((s, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-none hover:bg-bg/60 transition-colors">
              <td className="px-6 py-3.5 font-semibold text-navy">{s.nombre}</td>
              <td className="px-4 py-3.5 text-right text-green-600 font-bold">{s.aciertos}</td>
              <td className="px-4 py-3.5 text-right text-red-500 font-bold">{s.fallidos}</td>
              <td className="px-4 py-3.5 text-right text-gray-500">{formatDuracion(s.duracion_ms)}</td>
              <td className="px-6 py-3.5 text-right">
                <Tag variant={s.completada ? 'success' : 'neutral'} dot>
                  {s.completada ? 'Completa' : 'Parcial'}
                </Tag>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
