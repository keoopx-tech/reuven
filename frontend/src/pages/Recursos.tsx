import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'

interface Recurso {
  categoria: string
  color: string
  titulo: string
  resumen: string
  publico: string
}

const RECURSOS: Recurso[] = [
  {
    categoria: 'Familias',
    color: 'bg-green-50 text-green-700 border-green-200',
    titulo: 'Cómo acompañar la primera sesión de lectoescritura en casa',
    resumen: 'Pautas simples para sentarte junto al niño sin convertir la práctica en un examen: cuándo intervenir, cuándo dejar que se equivoque, y cómo celebrar el acierto.',
    publico: '5 min de lectura',
  },
  {
    categoria: 'Docentes',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    titulo: 'Leer el dashboard de métricas: qué mirar primero',
    resumen: 'Tasa de acierto, tiempo por actividad y sesiones completadas cuentan historias distintas. Guía rápida para priorizar qué estudiante necesita apoyo esta semana.',
    publico: '4 min de lectura',
  },
  {
    categoria: 'Profesionales',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    titulo: 'Vincular pacientes sin compartir contraseñas: el código XXXX-XXXX',
    resumen: 'Cómo funciona el sistema de vinculación entre tutor y profesional, sus límites de expiración y qué hacer si el código no funciona.',
    publico: '3 min de lectura',
  },
  {
    categoria: 'Método',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    titulo: 'Aprendizaje mediado: la diferencia entre exponer y enseñar',
    resumen: 'Una introducción práctica a los criterios de mediación de Feuerstein y cómo se traducen en el diseño de cada una de las 8 actividades de Reuven.',
    publico: '6 min de lectura',
  },
  {
    categoria: 'Familias',
    color: 'bg-green-50 text-green-700 border-green-200',
    titulo: 'Señales de alerta en lectoescritura entre los 4 y 8 años',
    resumen: 'Qué es parte del proceso normal de aprendizaje y cuándo conviene consultar a un logopeda o psicopedagogo.',
    publico: '5 min de lectura',
  },
  {
    categoria: 'Docentes',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    titulo: 'Usar Reuven en el aula: de 1 a 30 estudiantes',
    resumen: 'Cómo organizar sesiones grupales, qué actividades funcionan mejor en pareja y cómo revisar el progreso de todo el curso de un vistazo.',
    publico: '4 min de lectura',
  },
]

export default function Recursos() {
  return (
    <div className="min-h-screen bg-cream font-poppins antialiased">
      <PublicNavbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <Reveal className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8 pt-16 lg:pt-24 pb-6 text-center">
        <Eyebrow center>Recursos</Eyebrow>
        <h1 className="font-bold text-darken text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-5 max-w-3xl mx-auto"
          style={{ textWrap: 'balance' } as React.CSSProperties}>
          Guías para familias, docentes y profesionales
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Contenido escrito por el equipo de Reuven para sacarle más partido a la
          plataforma y entender mejor el proceso de lectoescritura.
        </p>
      </Reveal>

      {/* ── GRID DE RECURSOS ─────────────────────────────────────── */}
      <section className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8 pb-20 lg:pb-28 pt-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECURSOS.map((r, i) => (
            <Reveal key={r.titulo} delay={(i % 3) * 100}>
              <article
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card flex flex-col gap-3 h-full hover:border-skyellow/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <span className={`inline-flex self-start items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${r.color}`}>
                  {r.categoria}
                </span>
                <h3 className="font-extrabold text-darken text-base leading-snug">
                  {r.titulo}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{r.resumen}</p>
                <p className="text-xs text-gray-400 pt-3 border-t border-gray-50">{r.publico} · Equipo Reuven</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center bg-white rounded-2xl border border-gray-100 p-10">
          <p className="font-extrabold text-darken text-lg mb-2">Estamos ampliando esta sección</p>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            Nuevas guías cada mes, priorizadas según las preguntas que más recibimos de colegios e IPS.
          </p>
        </Reveal>
      </section>

      <PublicFooter />
    </div>
  )
}
