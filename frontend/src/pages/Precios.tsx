import { Link } from 'react-router-dom'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'

interface Plan {
  id: string
  nombre: string
  precio: number
  destacado?: boolean
  resumen: string
  features: string[]
}

const PLANES: Plan[] = [
  {
    id: 'A',
    nombre: 'Básico',
    precio: 180000,
    resumen: '1 profesional · hasta 30 usuarios finales',
    features: [
      'Acceso a los 3 niveles (350 páginas)',
      'Dashboard de métricas',
      '1 profesional incluido',
      'Hasta 30 usuarios finales',
    ],
  },
  {
    id: 'B',
    nombre: 'Estándar',
    precio: 220000,
    resumen: 'Hasta 3 profesionales · 50 usuarios c/u',
    features: [
      'Todo lo del plan Básico',
      'Exportar informes en PDF',
      'Hasta 3 profesionales',
      'Hasta 50 usuarios por profesional',
    ],
  },
  {
    id: 'C',
    nombre: 'Profesional',
    precio: 280000,
    destacado: true,
    resumen: 'Hasta 10 profesionales · 100 usuarios c/u',
    features: [
      'Todo lo del plan Estándar',
      'API personalizada / integración SIE',
      'Soporte prioritario 24h',
      '1 sesión de formación al año',
      'Hasta 10 profesionales',
    ],
  },
  {
    id: 'D',
    nombre: 'Enterprise',
    precio: 340000,
    resumen: 'Profesionales ilimitados · usuarios sin límite',
    features: [
      'Todo lo del plan Profesional',
      'Voice cloning personalizada',
      'Sesiones de formación trimestrales',
      'Profesionales y usuarios ilimitados',
    ],
  },
]

const COMPARATIVA: { label: string; valores: [boolean | string, boolean | string, boolean | string, boolean | string] }[] = [
  { label: 'Profesionales incluidos', valores: ['1', 'Hasta 3', 'Hasta 10', 'Ilimitado'] },
  { label: 'Usuarios finales por profesional', valores: ['30', '50', '100', 'Sin límite'] },
  { label: 'Acceso a las 3 niveles (350 páginas)', valores: [true, true, true, true] },
  { label: 'Dashboard de métricas', valores: [true, true, true, true] },
  { label: 'Exportar informes PDF', valores: [false, true, true, true] },
  { label: 'API personalizada / integración SIE', valores: [false, false, true, true] },
  { label: 'Soporte prioritario 24h', valores: [false, false, true, true] },
  { label: 'Voice cloning personalizada', valores: [false, false, false, true] },
  { label: 'Sesiones de formación', valores: ['—', '—', '1 / año', 'Trimestrales'] },
]

function fmt(n: number) {
  return n.toLocaleString('es-CO')
}

function Check({ value }: { value: boolean | string }) {
  if (typeof value === 'string') return <span className="text-sm text-gray-600">{value}</span>
  return value ? (
    <span className="text-green-500 text-lg">✓</span>
  ) : (
    <span className="text-gray-300 text-lg">—</span>
  )
}

export default function Precios() {
  return (
    <div className="min-h-screen bg-cream font-poppins antialiased">
      <PublicNavbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <Reveal className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8 pt-16 lg:pt-24 pb-6 text-center">
        <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
          💼 Modelo B2B con reventa B2C
        </span>
        <h1 className="font-bold text-darken text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-5 max-w-3xl mx-auto"
          style={{ textWrap: 'balance' } as React.CSSProperties}>
          Un plan por profesional, para todo tu equipo
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Colegios, IPS y consultas privadas pagan por profesional activo y pueden
          revender el acceso a familias o pacientes con su propio margen.
        </p>
      </Reveal>

      {/* ── PRICING CARDS ────────────────────────────────────────── */}
      <section className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8 pb-16 pt-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
          {PLANES.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 100}>
              <div
                className={`relative rounded-3xl p-7 flex flex-col gap-5 border transition-all duration-300 h-full ${
                  plan.destacado
                    ? 'bg-white border-skyellow shadow-[0_8px_30px_rgba(244,140,6,0.25)] md:-translate-y-2'
                    : 'bg-white border-gray-100 shadow-card hover:border-skyellow/40 hover:-translate-y-1'
                }`}>
                {plan.destacado && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-skyellow to-darken text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                    Más elegido
                  </span>
                )}
                <div>
                  <p className="text-skyellow font-bold text-xs tracking-wider uppercase mb-1.5">Plan {plan.id}</p>
                  <h3 className="font-extrabold text-darken text-xl">{plan.nombre}</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{plan.resumen}</p>
                </div>

                <div>
                  <span className="font-bold text-darken text-3xl tracking-tight">${fmt(plan.precio)}</span>
                  <span className="text-gray-500 text-sm"> COP/mes</span>
                  <p className="text-xs text-gray-400 mt-1">por profesional</p>
                </div>

                <ul className="flex flex-col gap-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600 leading-snug">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/registro/profesional"
                  className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold px-5 py-3 transition-all duration-300 ${
                    plan.destacado
                      ? 'bg-gradient-to-br from-skyellow to-darken text-white shadow-lg hover:-translate-y-0.5'
                      : 'border border-gray-200 text-darken hover:border-darken hover:-translate-y-0.5'
                  }`}>
                  Elegir {plan.nombre}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-10 leading-relaxed max-w-2xl mx-auto">
          Mínimo <strong className="text-darken font-semibold">5 licencias</strong> para colegios, IPS y redes ·
          {' '}1 licencia individual para profesionales independientes ·{' '}
          <strong className="text-darken font-semibold">3%</strong> de descuento con compromiso trimestral,{' '}
          <strong className="text-darken font-semibold">5%</strong> con compromiso de 5 meses.
        </p>
      </section>

      {/* ── COMPARATIVA ──────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-16 lg:py-24">
        <Reveal className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow center>Comparativa</Eyebrow>
            <h2 className="font-bold text-darken text-2xl sm:text-3xl tracking-tight" style={{ textWrap: 'balance' } as React.CSSProperties}>
              Qué incluye cada plan
            </h2>
          </div>

          <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 pr-4 text-sm font-semibold text-gray-500">Característica</th>
                  {PLANES.map((p) => (
                    <th key={p.id} className="py-4 px-4 text-center">
                      <span className="font-extrabold text-darken text-sm block">{p.nombre}</span>
                      <span className="text-xs text-gray-400">${fmt(p.precio)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARATIVA.map((row) => (
                  <tr key={row.label} className="border-b border-gray-50">
                    <td className="py-3.5 pr-4 text-sm text-gray-600">{row.label}</td>
                    {row.valores.map((v, i) => (
                      <td key={i} className="py-3.5 px-4 text-center">
                        <Check value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ── REVENTA B2C ──────────────────────────────────────────── */}
      <Reveal direction="left" className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8 py-16 lg:py-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Eyebrow>Modelo de reventa</Eyebrow>
            <h2 className="font-bold text-darken text-2xl sm:text-3xl tracking-tight mb-4"
              style={{ textWrap: 'balance' } as React.CSSProperties}>
              Tu institución define su propio precio
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
              El colegio, IPS o consulta privada revende el acceso a familias y pacientes
              con el precio que prefiera. Reuven no toca ese margen: tú te quedas con
              toda la diferencia entre lo que pagas a Reuven y lo que cobras.
            </p>
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-card max-w-md">
              <p className="text-sm text-gray-500 mb-1.5">Ejemplo con Plan Profesional (280k/mes)</p>
              <p className="font-extrabold text-darken">
                30 usuarios × 70.000 COP = 2.100.000 COP
              </p>
              <p className="text-sm text-green-600 font-semibold mt-1.5">
                Margen institucional: ~1.820.000 COP/mes
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl"
              style={{ background: 'radial-gradient(circle at 30% 30%, #fce7f3, transparent 55%), radial-gradient(circle at 75% 60%, #dbeafe, transparent 55%)' }} />
            <div className="relative bg-white rounded-3xl border border-gray-100 shadow-card p-6 flex flex-col gap-4">
              {[
                { plan: 'Básico Familiar', precio: '30.000', desc: '1 perfil, acceso libre' },
                { plan: 'Estándar', precio: '70.000', desc: '2 perfiles + reporte mensual' },
                { plan: 'Premium', precio: '120.000', desc: 'Sesiones quincenales + plan personalizado' },
              ].map((p) => (
                <div key={p.plan} className="flex items-center justify-between gap-3 border-b border-gray-50 pb-3.5 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-darken text-sm">{p.plan}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                  </div>
                  <span className="font-bold text-darken text-sm whitespace-nowrap">${p.precio}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── CTA FINAL ────────────────────────────────────────────── */}
      <Reveal className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8 pb-20 lg:pb-28">
        <div className="relative overflow-hidden rounded-3xl text-white px-8 py-16 text-center"
          style={{ background: 'linear-gradient(105.5deg, #545AE7 19.57%, #2F327D 78.85%)' }}>
          <h2 className="font-bold text-3xl lg:text-5xl mb-4 tracking-tight"
            style={{ textWrap: 'balance' } as React.CSSProperties}>
            ¿Tu institución necesita más de 5 licencias?
          </h2>
          <p className="text-white/80 text-lg mb-9 max-w-lg mx-auto leading-relaxed">
            Hablemos de un plan a medida para tu colegio, IPS o red educativa.
          </p>
          <Link to="/contacto"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-darken text-sm font-bold px-6 py-3.5 hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
            Hablar con el equipo →
          </Link>
        </div>
      </Reveal>

      <PublicFooter />
    </div>
  )
}
