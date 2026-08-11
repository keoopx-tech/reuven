import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Topbar } from '@/components/layout/Topbar'
import { KpiCard } from '@/components/ui/KpiCard'
import { Avatar } from '@/components/ui/Avatar'
import { Tabs } from '@/components/ui/Tabs'
import { SesionesTable } from '@/components/ui/SesionesTable'
import { metricasApi } from '@/lib/api/metricas'
import { perfilesApi } from '@/lib/api/perfiles'
import { formatDuracion } from '@/lib/utils/formatDuracion'
import { calcularVariacion } from '@/lib/utils/metricasCalc'
import { Button } from '@/components/ui/Button'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const AVATAR_BG = 'linear-gradient(135deg,#fef3c7,#fbbf24)'

export default function Metricas() {
  const { perfilId } = useParams<{ perfilId: string }>()

  const { data: perfiles = [] } = useQuery({ queryKey: ['profesional-perfiles'], queryFn: perfilesApi.profesionalPerfiles })
  const perfil = perfiles.find((p) => p.id === perfilId)

  const { data: resumen } = useQuery({ queryKey: ['resumen', perfilId], queryFn: () => metricasApi.resumen(perfilId!), enabled: !!perfilId })
  const { data: porActividad = [] } = useQuery({ queryKey: ['por-actividad', perfilId], queryFn: () => metricasApi.porActividad(perfilId!), enabled: !!perfilId })
  const { data: serie = [] } = useQuery({ queryKey: ['serie', perfilId], queryFn: () => metricasApi.serieTemporal(perfilId!, 14), enabled: !!perfilId })
  const { data: sesiones = [] } = useQuery({ queryKey: ['sesiones', perfilId], queryFn: () => metricasApi.sesiones(perfilId!), enabled: !!perfilId })

  const aciertoData = serie.map((s) => {
    const total = s.aciertos + s.fallidos
    return { fecha: s.fecha.slice(5), tasa: total > 0 ? Math.round((s.aciertos / total) * 100) : null }
  })

  const barData = porActividad.map((a) => ({ nombre: a.nombre.split(' ')[0], aciertos: a.aciertos, fallidos: a.fallidos }))
  const variacion = calcularVariacion(serie)

  const kpis = resumen && (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KpiCard iconBg="#f0fdf4" iconColor="#16a34a" icon="✓" label="Tareas con avance" value={`${resumen.completadas} / 8`} />
      <KpiCard iconBg="#fef3c7" iconColor="#b45309" icon="⭐" label="Aciertos" value={resumen.aciertos} />
      <KpiCard iconBg="#dbeafe" iconColor="#1d4ed8" icon="📈" label="Tasa de acierto" value={`${resumen.tasa_acierto}%`} delta={variacion} />
      <KpiCard iconBg="#fce7f3" iconColor="#be185d" icon="⏱" label="Tiempo total" value={formatDuracion(resumen.tiempo_ms)} />
    </div>
  )

  return (
    <div className="min-h-screen bg-bg font-poppins flex flex-col">
      <Topbar />
      <div className="max-w-6xl mx-auto px-5 py-8 w-full">
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <Link to="/dashboard"><Button variant="secondary" size="sm">← Dashboard</Button></Link>
          {perfil && <Avatar emoji={perfil.emoji} bg={AVATAR_BG} ring />}
          <div>
            <h1 className="font-poppins font-bold text-navy text-2xl leading-tight">
              Métricas de {perfil?.nombre ?? '…'}
            </h1>
            {perfil && <p className="text-gray-500 text-sm">{perfil.es_nino ? 'Niño' : 'Niña'} · últimos 14 días</p>}
          </div>
        </div>

        <Tabs
          defaultTab="resumen"
          tabs={[
            {
              key: 'resumen',
              label: 'Resumen',
              icon: '📈',
              content: (
                <>
                  {kpis}
                  <div className="bg-surface border border-gray-100 rounded-3xl shadow-card p-6">
                    <h2 className="font-poppins font-bold text-navy text-lg mb-4">Tasa de acierto · 14 días</h2>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={aciertoData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="fecha" tick={{ fontFamily: 'Poppins', fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontFamily: 'Poppins', fontSize: 11 }} unit="%" />
                        <Tooltip formatter={(v) => `${v}%`} />
                        <Line type="monotone" dataKey="tasa" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', stroke: 'white', strokeWidth: 2 }} connectNulls />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ),
            },
            {
              key: 'progreso',
              label: 'Progreso',
              icon: '📊',
              content: (
                <div className="bg-surface border border-gray-100 rounded-3xl shadow-card p-6">
                  <h2 className="font-poppins font-bold text-navy text-lg mb-4">Aciertos vs fallos por actividad</h2>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="nombre" tick={{ fontFamily: 'Poppins', fontSize: 11 }} />
                      <YAxis tick={{ fontFamily: 'Poppins', fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="aciertos" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="fallidos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ),
            },
            {
              key: 'sesiones',
              label: 'Sesiones',
              icon: '📋',
              content: (
                <div className="bg-surface border border-gray-100 rounded-3xl shadow-card overflow-hidden">
                  <SesionesTable sesiones={sesiones} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
