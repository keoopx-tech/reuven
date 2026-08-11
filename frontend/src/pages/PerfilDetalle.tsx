import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Topbar } from '@/components/layout/Topbar'
import { Button } from '@/components/ui/Button'
import { KpiCard } from '@/components/ui/KpiCard'
import { ProfileCard } from '@/components/ui/ProfileCard'
import { Tabs } from '@/components/ui/Tabs'
import { ActividadTable } from '@/components/ui/ActividadTable'
import { SesionesTable } from '@/components/ui/SesionesTable'
import { perfilesApi } from '@/lib/api/perfiles'
import { metricasApi } from '@/lib/api/metricas'
import { formatDuracion } from '@/lib/utils/formatDuracion'
import { calcularVariacion } from '@/lib/utils/metricasCalc'
import { AVATAR_BG } from '@/lib/constants'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

/** Página de perfil dedicada de un menor — inspirada en Customer Details de Ecme:
 *  ProfileCard a la izquierda, contenido con pestañas a la derecha. */
export default function PerfilDetalle() {
  const { perfilId } = useParams<{ perfilId: string }>()

  const { data: perfiles = [] } = useQuery({ queryKey: ['profesional-perfiles'], queryFn: perfilesApi.profesionalPerfiles })
  const perfil = perfiles.find((p) => p.id === perfilId)
  const perfilIdx = perfil ? perfiles.indexOf(perfil) : 0

  const { data: resumen } = useQuery({ queryKey: ['resumen', perfilId], queryFn: () => metricasApi.resumen(perfilId!), enabled: !!perfilId })
  const { data: porActividad = [] } = useQuery({ queryKey: ['por-actividad', perfilId], queryFn: () => metricasApi.porActividad(perfilId!), enabled: !!perfilId })
  const { data: serie = [] } = useQuery({ queryKey: ['serie', perfilId], queryFn: () => metricasApi.serieTemporal(perfilId!, 14), enabled: !!perfilId })
  const { data: sesiones = [] } = useQuery({ queryKey: ['sesiones', perfilId], queryFn: () => metricasApi.sesiones(perfilId!, 10), enabled: !!perfilId })

  const aciertoData = serie.map((s) => {
    const total = s.aciertos + s.fallidos
    return { fecha: s.fecha.slice(5), tasa: total > 0 ? Math.round((s.aciertos / total) * 100) : null }
  })
  const variacion = calcularVariacion(serie)

  return (
    <div className="min-h-screen bg-bg font-poppins flex flex-col">
      <Topbar />
      <div className="max-w-6xl mx-auto px-5 py-8 w-full">
        <div className="mb-6">
          <Link to="/dashboard"><Button variant="secondary" size="sm">← Dashboard</Button></Link>
        </div>

        {!perfil ? (
          <p className="text-gray-400">Cargando perfil…</p>
        ) : (
          <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
            <ProfileCard
              perfil={perfil}
              avatarBg={AVATAR_BG[perfilIdx % 4]}
              tasaAcierto={resumen?.tasa_acierto}
              completadas={resumen?.completadas}
            />

            <div className="min-w-0">
              <Tabs
                defaultTab="resumen"
                tabs={[
                  {
                    key: 'resumen',
                    label: 'Resumen',
                    icon: '📈',
                    content: (
                      <div className="flex flex-col gap-6">
                        {resumen && (
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <KpiCard iconBg="#f0fdf4" iconColor="#16a34a" icon="✓" label="Tareas con avance" value={`${resumen.completadas} / 8`} />
                            <KpiCard iconBg="#fef3c7" iconColor="#b45309" icon="⭐" label="Aciertos / Fallos" value={`${resumen.aciertos} / ${resumen.fallidos}`} />
                            <KpiCard iconBg="#dbeafe" iconColor="#1d4ed8" icon="📈" label="Tasa de acierto" value={`${resumen.tasa_acierto}%`} delta={variacion} />
                            <KpiCard iconBg="#fce7f3" iconColor="#be185d" icon="⏱" label="Tiempo total" value={formatDuracion(resumen.tiempo_ms)} />
                          </div>
                        )}
                        <div className="bg-surface border border-gray-100 rounded-3xl shadow-card p-6">
                          <h2 className="font-poppins font-bold text-navy text-lg mb-4">Tasa de acierto · 14 días</h2>
                          <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={aciertoData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="fecha" tick={{ fontFamily: 'Poppins', fontSize: 11 }} />
                              <YAxis domain={[0, 100]} tick={{ fontFamily: 'Poppins', fontSize: 11 }} unit="%" />
                              <Tooltip formatter={(v) => `${v}%`} />
                              <Line type="monotone" dataKey="tasa" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', stroke: 'white', strokeWidth: 2 }} connectNulls />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: 'progreso',
                    label: 'Progreso por actividad',
                    icon: '📊',
                    content: (
                      <div className="bg-surface border border-gray-100 rounded-3xl shadow-card overflow-hidden">
                        <ActividadTable porActividad={porActividad} />
                      </div>
                    ),
                  },
                  {
                    key: 'sesiones',
                    label: 'Sesiones recientes',
                    icon: '📋',
                    content: (
                      <div className="bg-surface border border-gray-100 rounded-3xl shadow-card overflow-hidden">
                        <SesionesTable sesiones={sesiones} />
                      </div>
                    ),
                  },
                ]}
              />

              <div className="mt-6 text-center">
                <Link to={`/metricas/${perfil.id}`} className="text-sm font-semibold text-brand hover:underline">
                  Ver gráficas completas en Métricas →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
