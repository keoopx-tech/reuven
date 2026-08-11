import { useQueries, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Topbar } from '@/components/layout/Topbar'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Tag } from '@/components/ui/Tag'
import { ProfileCard } from '@/components/ui/ProfileCard'
import { ActividadTable } from '@/components/ui/ActividadTable'
import { perfilesApi } from '@/lib/api/perfiles'
import { KpiCard } from '@/components/ui/KpiCard'
import { metricasApi } from '@/lib/api/metricas'
import { formatDuracion } from '@/lib/utils/formatDuracion'
import { tiempoRelativo } from '@/lib/utils/tiempoRelativo'
import { AVATAR_BG } from '@/lib/constants'
import { useEffect, useState } from 'react'
import type { Perfil, SesionItem } from '@/types/api'

export default function Dashboard() {
  const [selected, setSelected] = useState<Perfil | null>(null)
  const { data: perfiles = [], isLoading } = useQuery({
    queryKey: ['profesional-perfiles'],
    queryFn: perfilesApi.profesionalPerfiles,
  })

  useEffect(() => {
    if (perfiles.length && !selected) setSelected(perfiles[0])
  }, [perfiles]) // eslint-disable-line

  const { data: resumen } = useQuery({
    queryKey: ['resumen', selected?.id],
    queryFn: () => metricasApi.resumen(selected!.id),
    enabled: !!selected,
  })

  const { data: porActividad = [] } = useQuery({
    queryKey: ['por-actividad', selected?.id],
    queryFn: () => metricasApi.porActividad(selected!.id),
    enabled: !!selected,
  })

  // Feed de actividad: últimas sesiones de TODOS los menores vinculados
  const sesionesQueries = useQueries({
    queries: perfiles.map((p) => ({
      queryKey: ['sesiones-feed', p.id],
      queryFn: () => metricasApi.sesiones(p.id, 5),
      enabled: perfiles.length > 0,
    })),
  })
  const feed = sesionesQueries
    .flatMap((q, i): (SesionItem & { perfil: Perfil })[] =>
      (q.data ?? []).map((s) => ({ ...s, perfil: perfiles[i] }))
    )
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, 6)

  const selectedIdx = selected ? perfiles.indexOf(selected) : 0

  return (
    <div className="min-h-screen bg-bg font-poppins flex flex-col">
      <Topbar />
      <div className="flex flex-1 min-h-0">
        {/* SIDEBAR */}
        <aside className="w-72 bg-surface border-r border-gray-100 p-4 flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 px-2">
            Menores vinculados <span className="text-green-600">({perfiles.length})</span>
          </p>
          {isLoading && <p className="text-sm text-gray-400 px-2">Cargando…</p>}
          {perfiles.map((p, i) => (
            <button key={p.id}
              onClick={() => setSelected(p)}
              className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all ${selected?.id === p.id ? 'bg-green-50 border border-green-200' : 'hover:bg-bg border border-transparent'}`}
            >
              <Avatar emoji={p.emoji} bg={AVATAR_BG[i % 4]} />
              <div className="min-w-0">
                <p className="font-bold text-navy text-sm truncate">{p.nombre}</p>
                <p className="text-xs text-gray-500">{p.es_nino ? 'Niño' : 'Niña'}</p>
              </div>
            </button>
          ))}
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-8 overflow-auto">
          {!selected || perfiles.length === 0 ? (
            <EmptyState
              icon="👥"
              title="Sin menores vinculados"
              body="Pídele al tutor el código de vinculación del menor."
              actions={<Link to="/registro/profesional"><Button size="sm">Vincular menor</Button></Link>}
            />
          ) : (
            <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
              {/* Columna izquierda: perfil */}
              <ProfileCard
                perfil={selected}
                avatarBg={AVATAR_BG[selectedIdx % 4]}
                tasaAcierto={resumen?.tasa_acierto}
                completadas={resumen?.completadas}
              />

              {/* Columna derecha: KPIs + tabla */}
              <div className="flex flex-col gap-6 min-w-0">
                {resumen && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard iconBg="#f0fdf4" iconColor="#16a34a" icon="✓" label="Tareas con avance" value={`${resumen.completadas} / 8`} />
                    <KpiCard iconBg="#fef3c7" iconColor="#b45309" icon="⭐" label="Aciertos / Fallos" value={`${resumen.aciertos} / ${resumen.fallidos}`} />
                    <KpiCard iconBg="#dbeafe" iconColor="#1d4ed8" icon="📈" label="Tasa de acierto" value={`${resumen.tasa_acierto}%`} />
                    <KpiCard iconBg="#fce7f3" iconColor="#be185d" icon="⏱" label="Tiempo total" value={formatDuracion(resumen.tiempo_ms)} />
                  </div>
                )}

                {/* Tabla de actividades */}
                <div className="bg-surface border border-gray-100 rounded-3xl shadow-card overflow-hidden">
                  <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <h2 className="font-poppins font-bold text-navy text-lg">Progreso por actividad</h2>
                    <Link to={`/perfil/${selected.id}`} className="text-sm font-semibold text-brand hover:underline">
                      Ver perfil completo →
                    </Link>
                  </div>
                  <ActividadTable porActividad={porActividad} />
                </div>

                {/* Feed de actividad reciente — todos los menores vinculados */}
                {feed.length > 0 && (
                  <div className="bg-surface border border-gray-100 rounded-3xl shadow-card p-6">
                    <h2 className="font-poppins font-bold text-navy text-lg mb-4">Actividad reciente</h2>
                    <div className="flex flex-col gap-1">
                      {feed.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-none">
                          <Avatar emoji={s.perfil.emoji} size="sm" bg={AVATAR_BG[perfiles.indexOf(s.perfil) % 4]} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-navy">
                              <span className="font-semibold">{s.perfil.nombre}</span>{' '}
                              {s.completada ? 'completó' : 'practicó'} <span className="font-semibold">{s.nombre}</span>
                            </p>
                            <p className="text-xs text-gray-400">{tiempoRelativo(s.ts)} · {s.aciertos} aciertos</p>
                          </div>
                          <Tag variant={s.completada ? 'success' : 'neutral'} dot>
                            {s.completada ? 'Completa' : 'Parcial'}
                          </Tag>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
