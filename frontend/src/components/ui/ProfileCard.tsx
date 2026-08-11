import { Link } from 'react-router-dom'
import { Avatar } from './Avatar'
import { Tag } from './Tag'
import type { Perfil } from '@/types/api'

interface InfoFieldProps {
  label: string
  value: string
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-navy text-sm mt-0.5">{value}</p>
    </div>
  )
}

function calcularEdad(fechaISO?: string): string {
  if (!fechaISO) return '—'
  const nacimiento = new Date(fechaISO)
  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const m = hoy.getMonth() - nacimiento.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--
  return `${edad} años`
}

function nivelTag(tasaAcierto: number) {
  if (tasaAcierto >= 80) return { label: 'Dominando el ritmo', variant: 'success' as const }
  if (tasaAcierto >= 55) return { label: 'En progreso', variant: 'warning' as const }
  return { label: 'Necesita apoyo', variant: 'danger' as const }
}

const IDIOMAS: Record<string, string> = { es: 'Español', en: 'Inglés' }

interface Props {
  perfil: Perfil
  avatarBg: string
  tasaAcierto?: number
  completadas?: number
}

/** Tarjeta de perfil — inspirada en ProfileSection de Ecme, adaptada a datos reales del menor. */
export function ProfileCard({ perfil, avatarBg, tasaAcierto, completadas }: Props) {
  const nivel = tasaAcierto !== undefined ? nivelTag(tasaAcierto) : null

  return (
    <div className="bg-surface border border-gray-100 rounded-3xl shadow-card p-6 flex flex-col gap-6">
      <div className="flex flex-col items-center text-center gap-3">
        <Avatar emoji={perfil.emoji} size="xl" bg={avatarBg} ring />
        <div>
          <h2 className="font-poppins font-bold text-navy text-xl">{perfil.nombre}</h2>
          <p className="text-gray-500 text-sm">{perfil.es_nino ? 'Niño' : 'Niña'}</p>
        </div>
        {nivel && <Tag variant={nivel.variant} dot>{nivel.label}</Tag>}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {perfil.fecha_nacimiento && <InfoField label="Edad" value={calcularEdad(perfil.fecha_nacimiento)} />}
        <InfoField label="Idioma materno" value={IDIOMAS[perfil.idioma_materno] ?? perfil.idioma_materno} />
        <InfoField
          label="Vinculado desde"
          value={new Date(perfil.creado_en).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
        />
        <InfoField label="Actividades dominadas" value={completadas !== undefined ? `${completadas} / 8` : '—'} />
      </div>

      <Link to={`/metricas/${perfil.id}`}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand text-white text-sm font-semibold px-5 py-3 shadow-sm hover:bg-brand-dark hover:-translate-y-0.5 transition-all duration-200 no-underline">
        Ver métricas completas →
      </Link>
    </div>
  )
}
