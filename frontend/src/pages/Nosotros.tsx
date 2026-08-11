import { Link } from 'react-router-dom'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'

const PRINCIPIOS = [
  {
    icon: '🎯',
    title: 'Intencionalidad y reciprocidad',
    desc: 'El adulto media la experiencia con un propósito claro: no basta con exponer al niño al estímulo, hay que acompañarlo a interpretarlo.',
  },
  {
    icon: '🌉',
    title: 'Trascendencia',
    desc: 'Cada actividad busca ir más allá del ejercicio puntual: que la palabra aprendida hoy sirva para leer otra distinta mañana.',
  },
  {
    icon: '💡',
    title: 'Significado',
    desc: 'Ninguna tarea es neutra. El sonido, el color y la celebración dan sentido emocional a cada acierto.',
  },
]

const PILARES = [
  {
    icon: '🧑‍🏫',
    title: 'El adulto media, la app celebra',
    desc: 'Reuven no reemplaza al docente, tutor o especialista: le da datos para decidir dónde enfocar la próxima sesión.',
  },
  {
    icon: '🧩',
    title: 'Dificultad progresiva',
    desc: 'Ocho tipos de actividad, tres niveles, 350 páginas de contenido — el niño avanza sin sentirse desbordado.',
  },
  {
    icon: '🔊',
    title: 'Voz y sonido en español',
    desc: 'Cada palabra se pronuncia. La retroalimentación auditiva refuerza lo visual, clave en procesos de lectoescritura.',
  },
  {
    icon: '📊',
    title: 'Datos para el especialista',
    desc: 'Logopedas, psicólogos y docentes ven tasas de acierto, tiempos y progreso real — no solo una nota final.',
  },
]

const PARA_QUIEN = [
  { icon: '🏫', label: 'Colegios', sub: 'Docentes que necesitan datos por alumno, no solo por aula.' },
  { icon: '🧑‍⚕️', label: 'IPS y consultas', sub: 'Logopedas, psicólogos y neurolingüistas que miden avance clínico.' },
  { icon: '👨‍👩‍👧', label: 'Familias', sub: 'Padres, madres o tutores que acompañan desde casa.' },
]

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-cream font-poppins antialiased">
      <PublicNavbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <Reveal className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8 pt-16 lg:pt-24 pb-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            🌱 Diseñado con el Método Feuerstein
          </span>
          <h1 className="font-bold text-darken text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-5"
            style={{ textWrap: 'balance' } as React.CSSProperties}>
            Enseñamos a pensar, no solo a memorizar
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Reuven nace de una idea del psicólogo Reuven Feuerstein: la inteligencia no
            es fija, se construye a través de la <strong className="text-darken font-semibold">experiencia de aprendizaje mediado</strong> —
            un adulto que interpreta el mundo junto al niño, en lugar de solo exponerlo a él.
            Nuestra plataforma traduce esa idea en actividades de lectoescritura que un
            docente, tutor o profesional puede acompañar de cerca.
          </p>
        </div>
      </Reveal>

      {/* ── PRINCIPIOS ───────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-16 lg:py-24 mt-10">
        <div className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8">
          <Reveal className="text-center max-w-xl mx-auto mb-12">
            <Eyebrow center>El método</Eyebrow>
            <h2 className="font-bold text-darken text-2xl sm:text-3xl tracking-tight mb-3"
              style={{ textWrap: 'balance' } as React.CSSProperties}>
              Tres criterios de la mediación
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Feuerstein identificó criterios universales de mediación. Reuven diseña
              cada actividad alrededor de tres de ellos.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-10">
            {PRINCIPIOS.map(({ icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 100} className="flex flex-col gap-3">
                <span className="w-12 h-12 rounded-2xl bg-skyellow/10 flex items-center justify-center text-2xl">
                  {icon}
                </span>
                <h3 className="font-extrabold text-darken text-lg">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILARES DEL PRODUCTO ─────────────────────────────────── */}
      <section className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8 py-16 lg:py-24">
        <Reveal className="text-center max-w-xl mx-auto mb-12">
          <Eyebrow center>Cómo lo aplicamos</Eyebrow>
          <h2 className="font-bold text-darken text-2xl sm:text-3xl tracking-tight"
            style={{ textWrap: 'balance' } as React.CSSProperties}>
            De la teoría a cada sesión de práctica
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {PILARES.map(({ icon, title, desc }, i) => (
            <Reveal key={title} delay={(i % 2) * 100}>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-lg transition-shadow duration-300 flex gap-4 h-full">
                <span className="w-12 h-12 rounded-2xl bg-skyellow/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {icon}
                </span>
                <div>
                  <h3 className="font-extrabold text-darken text-base mb-1.5">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PARA QUIÉN ───────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-16 lg:py-24">
        <div className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8">
          <Reveal className="text-center max-w-xl mx-auto mb-12">
            <Eyebrow center>Para quién trabajamos</Eyebrow>
            <h2 className="font-bold text-darken text-2xl sm:text-3xl tracking-tight" style={{ textWrap: 'balance' } as React.CSSProperties}>
              Colegios, IPS y consultas que quieren ver el progreso real
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5">
            {PARA_QUIEN.map(({ icon, label, sub }, i) => (
              <Reveal key={label} delay={i * 100}>
                <div className="bg-cream rounded-2xl p-6 border border-gray-100 flex flex-col gap-2.5 h-full">
                  <span className="text-3xl">{icon}</span>
                  <p className="font-extrabold text-darken text-base">{label}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────── */}
      <Reveal className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8 py-20 lg:py-28 text-center">
        <h2 className="font-bold text-darken text-2xl sm:text-3xl tracking-tight mb-6"
          style={{ textWrap: 'balance' } as React.CSSProperties}>
          ¿Quieres ver el método en acción?
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/registro/familia"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-skyellow to-darken text-white text-sm font-bold px-6 py-3.5 shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            🎮 Empezar como familia
          </Link>
          <Link to="/precios"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold px-6 py-3.5 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
            Ver planes para profesionales
          </Link>
        </div>
      </Reveal>

      <PublicFooter />
    </div>
  )
}
