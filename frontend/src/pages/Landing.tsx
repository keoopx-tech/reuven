import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'

/* ──────────── DATA ──────────── */
const TESTIMONIALS = [
  { name: 'Ana Rodríguez', role: 'Docente de primaria', avatar: '👩‍🏫',
    text: 'Mis alumnos llevan las sesiones como si fueran un juego. La retroalimentación sonora les encanta y los aciertos han mejorado notablemente.' },
  { name: 'Carlos Pérez', role: 'Padre de gemelos', avatar: '👨',
    text: 'Lo probamos un sábado por la tarde y no pudieron parar. El panel de familia me permite ver exactamente en qué tarea necesitan más apoyo.' },
  { name: 'Dra. Lucía Mora', role: 'Logopeda', avatar: '🧑‍⚕️',
    text: 'El código de vinculación es sencillísimo. Puedo seguir el progreso de mis pacientes en tiempo real sin pedir contraseñas a los tutores.' },
]

const RECURSOS_DESTACADOS = [
  { categoria: 'Método', titulo: 'Aprendizaje mediado: la diferencia entre exponer y enseñar', resumen: 'Los criterios de mediación de Feuerstein aplicados a cada una de las 8 actividades de Reuven.' },
  { categoria: 'Familias', titulo: 'Cómo acompañar la primera sesión en casa', resumen: 'Cuándo intervenir, cuándo dejar que se equivoque, y cómo celebrar el acierto.' },
  { categoria: 'Docentes', titulo: 'Leer el dashboard de métricas: qué mirar primero', resumen: 'Tasa de acierto, tiempo por actividad y sesiones — guía rápida para priorizar.' },
]

const FAQ = [
  { q: '¿Es de pago?', a: 'La versión actual es completamente gratuita para familias. Colegios, IPS y consultas se suscriben por profesional — mira los planes en Precios.' },
  { q: '¿Mi hijo necesita saber leer para usarla?', a: 'No. La app está diseñada para acompañar el proceso lector desde el inicio. Todas las instrucciones se reproducen en voz española.' },
  { q: '¿Cómo comparto el progreso con el logopeda o el docente?', a: 'Al crear el perfil del menor se genera un código de 8 caracteres (formato XXXX-XXXX). El profesional lo introduce en su cuenta y queda vinculado.' },
  { q: '¿Funciona en tablet o móvil?', a: 'Sí. La interfaz es responsive y funciona en Chrome, Firefox y Safari tanto en escritorio como en dispositivos táctiles.' },
]

/* ──────────── FEATURE ICON CARD ──────────── */
function FeatureCard({ bg, icon, title, desc }: { bg: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white shadow-xl p-7 pt-6 text-center rounded-2xl h-full">
      <div style={{ background: bg }} className="rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg -translate-y-12">
        {icon}
      </div>
      <h3 className="font-semibold text-lg sm:text-xl mb-3 text-darken -mt-4">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

/* ──────────── SPLIT SECTION (imagen + texto) ──────────── */
function SplitSection({
  reverse, eyebrow, title, highlight, desc, img, alt, cta,
}: {
  reverse?: boolean
  eyebrow?: string
  title: string
  highlight: string
  desc: string
  img: string
  alt: string
  cta?: { label: string; to: string }
}) {
  return (
    <Reveal direction={reverse ? 'left' : 'right'}
      className={`mt-28 lg:mt-36 flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-14`}>
      <div className="md:w-1/2">
        <img className="w-full rounded-2xl shadow-lg" src={img} alt={alt} loading="lazy" />
      </div>
      <div className="md:w-1/2">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="font-semibold text-darken text-2xl sm:text-3xl leading-snug" style={{ textWrap: 'balance' } as React.CSSProperties}>
          {title} <span className="text-skyellow">{highlight}</span>
        </h2>
        <p className="text-gray-500 my-4 leading-relaxed max-w-md">{desc}</p>
        {cta && (
          <Link to={cta.to} className="inline-block px-6 py-3 border border-skyellow text-skyellow font-medium rounded-full hover:scale-105 hover:bg-skyellow hover:text-white transition-all duration-300 no-underline">
            {cta.label}
          </Link>
        )}
      </div>
    </Reveal>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left font-semibold text-darken hover:text-skyellow transition-colors">
        <span className="pr-4">{q}</span>
        <span className="text-2xl text-gray-400 font-light leading-none flex-shrink-0"
          style={{ transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s' }}>
          +
        </span>
      </button>
      <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <p className="pb-5 text-gray-500 text-sm leading-relaxed max-w-2xl">{a}</p>
        </div>
      </div>
    </div>
  )
}

/* ──────────── PAGE ──────────── */
export default function Landing() {
  return (
    <div className="min-h-screen bg-cream font-poppins antialiased text-gray-700">
      <PublicNavbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div className="bg-cream">
        <div className="max-w-screen-xl px-6 sm:px-8 mx-auto flex flex-col lg:flex-row items-start">
          <div className="flex flex-col w-full lg:w-6/12 justify-center lg:pt-20 items-start text-center lg:text-left mb-10 lg:mb-0">
            <span className="inline-flex items-center gap-2 bg-white/70 border border-skyellow/30 text-darken text-xs font-semibold px-4 py-1.5 rounded-full mb-6 mx-auto lg:mx-0">
              🌱 Diseñado con el Método Feuerstein
            </span>
            <h1 className="mb-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] text-darken"
              style={{ textWrap: 'balance' } as React.CSSProperties}>
              Aprender a <span className="text-skyellow">leer</span> ahora es mucho más fácil
            </h1>
            <p className="leading-relaxed text-lg sm:text-xl mb-9 max-w-md mx-auto lg:mx-0 text-gray-600">
              Reuven es una plataforma de lectoescritura en español que enseña jugando —
              ocho actividades guiadas con voz, sonido y celebraciones.
            </p>
            <div className="w-full flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <Link to="/registro/familia"
                className="bg-skyellow text-white text-lg font-bold rounded-full py-4 px-9 no-underline transform transition hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
                Empezar gratis
              </Link>
              <a href="#como-funciona" className="flex items-center justify-center gap-3 no-underline text-darken transform transition hover:scale-105 duration-300 ease-in-out">
                <span className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow">
                  <svg className="w-5 h-5 ml-1" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.5751 12.8097C23.2212 13.1983 23.2212 14.135 22.5751 14.5236L1.51538 27.1891C0.848878 27.5899 5.91205e-07 27.1099 6.25202e-07 26.3321L1.73245e-06 1.00123C1.76645e-06 0.223477 0.848877 -0.256572 1.51538 0.14427L22.5751 12.8097Z" fill="#23BDEE" />
                  </svg>
                </span>
                <span className="font-medium">Cómo funciona</span>
              </a>
            </div>
          </div>

          <div className="w-full lg:w-6/12 lg:-mt-4 relative">
            <img className="w-9/12 sm:w-8/12 lg:w-10/12 mx-auto" src="/img/skilline/girl.png" alt="Niño aprendiendo con Reuven" loading="eager" />

            {/* Insignia: progreso real de un perfil demo */}
            <div className="absolute top-6 -left-2 sm:top-10 sm:left-4 md:top-12 md:left-8 lg:-left-2 lg:top-16 animate-floating-slow">
              <div className="bg-white rounded-xl shadow-lg px-3.5 py-2.5 flex items-center gap-2.5 w-40 sm:w-48">
                <span className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center text-lg flex-shrink-0">🦊</span>
                <div className="min-w-0">
                  <p className="text-darken font-semibold text-xs sm:text-sm truncate">Liam · Sílabas</p>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-skyellow rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Ícono decorativo (abstracto, sin texto) */}
            <div className="absolute top-16 right-8 sm:right-20 sm:top-20 md:top-24 md:right-24 lg:top-24 lg:right-12 animate-floating">
              <svg className="h-14 sm:h-20" viewBox="0 0 149 149" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="40" y="32" width="69" height="69" rx="14" fill="#F3627C" />
                <rect x="51.35" y="44.075" width="47.3" height="44.85" rx="8" fill="white" />
                <path d="M74.5 54.425V78.575" stroke="#F25471" strokeWidth="4" strokeLinecap="round" />
                <path d="M65.875 58.7375L65.875 78.575" stroke="#F25471" strokeWidth="4" strokeLinecap="round" />
                <path d="M83.125 63.9125V78.575" stroke="#F25471" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            {/* Insignia: las 8 actividades */}
            <div className="absolute bottom-10 -left-2 sm:left-2 sm:bottom-16 lg:bottom-20 lg:-left-2 animate-floating">
              <div className="bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 w-44 sm:w-52">
                <span className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">🎯</span>
                <div>
                  <p className="text-darken font-bold text-base sm:text-lg leading-none">8</p>
                  <p className="text-gray-500 text-xs mt-0.5">actividades interactivas</p>
                </div>
              </div>
            </div>

            {/* Insignia: celebración de acierto */}
            <div className="absolute bottom-16 md:bottom-36 lg:bottom-40 -right-4 lg:right-6 animate-floating-slow">
              <div className="bg-white rounded-xl shadow-lg px-3.5 py-2.5 flex items-center gap-2.5 w-44 sm:w-52">
                <span className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-lg flex-shrink-0">🏆</span>
                <div>
                  <p className="text-darken font-semibold text-xs sm:text-sm leading-none">¡Acierto correcto!</p>
                  <p className="text-gray-500 text-xs mt-1">Mateo · Vocales</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="text-white -mt-10 sm:-mt-20 lg:-mt-28 relative">
          <svg className="w-full h-20 lg:h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" fill="currentColor" />
          </svg>
          <div className="bg-white w-full h-16 -mt-px" />
        </div>
      </div>

      {/* ── CONTENIDO ────────────────────────────────────────────── */}
      <div className="max-w-screen-xl px-6 lg:px-8 mx-auto overflow-x-hidden">

        {/* Intro */}
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="font-bold text-darken mb-4 text-2xl sm:text-3xl" style={{ textWrap: 'balance' } as React.CSSProperties}>
            Todo lo que necesitas <span className="text-skyellow">en un solo lugar.</span>
          </h2>
          <p className="leading-relaxed text-gray-500 text-base sm:text-lg">
            Reuven combina ejercicios interactivos, métricas en tiempo real y vinculación
            segura entre familias y profesionales — sin instalar nada.
          </p>
        </Reveal>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-14 md:gap-6 mt-20">
          <Reveal delay={0}>
            <FeatureCard bg="#5B72EE" title="Dashboard de métricas"
              desc="Tasa de acierto, tiempo por actividad y sesiones completadas — datos claros para decidir dónde enfocar la próxima sesión."
              icon={<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"><path d="M4 19V10M10 19V5M16 19v-7M22 19H2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            />
          </Reveal>
          <Reveal delay={120}>
            <FeatureCard bg="#F48C06" title="Progreso por actividad"
              desc="Ocho tipos de ejercicio y tres niveles de dificultad. El niño avanza a su ritmo y el adulto ve el recorrido completo."
              icon={<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            />
          </Reveal>
          <Reveal delay={240}>
            <FeatureCard bg="#29B9E7" title="Vinculación segura"
              desc="Un código de 8 caracteres conecta al tutor con el profesional — sin compartir contraseñas ni datos sensibles."
              icon={<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            />
          </Reveal>
        </div>

        {/* ¿Qué es Reuven? */}
        <Reveal className="mt-28 lg:mt-36" id="como-funciona">
          <div className="text-center max-w-2xl mx-auto">
            <Eyebrow center>Cómo funciona</Eyebrow>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-darken" style={{ textWrap: 'balance' } as React.CSSProperties}>
              ¿Qué es <span className="text-skyellow">Reuven?</span>
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Reuven es una plataforma que aplica el Método Feuerstein de aprendizaje mediado:
              el adulto guía, el niño descubre y la app celebra cada acierto — con voz, sonido
              y datos reales para docentes y especialistas.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-6 lg:gap-10 mt-10">
            <Link to="/registro/profesional" className="relative md:w-5/12 block no-underline group overflow-hidden rounded-2xl">
              <img className="rounded-2xl w-full transition-transform duration-500 group-hover:scale-105" src="/img/skilline/rectangle-19.png" alt="Profesional acompañando a un estudiante" loading="lazy" />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl flex items-center justify-center">
                <div className="text-center px-4">
                  <p className="uppercase text-white font-bold text-sm lg:text-lg mb-3 tracking-wide">Para profesionales</p>
                  <span className="inline-block rounded-full text-white border text-xs lg:text-sm px-6 py-3 font-medium group-hover:bg-white/10 transition-colors">
                    Crear cuenta profesional
                  </span>
                </div>
              </div>
            </Link>
            <Link to="/registro/familia" className="relative md:w-5/12 block no-underline group overflow-hidden rounded-2xl">
              <img className="rounded-2xl w-full transition-transform duration-500 group-hover:scale-105" src="/img/skilline/rectangle-21.png" alt="Familia usando Reuven en casa" loading="lazy" />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl flex items-center justify-center">
                <div className="text-center px-4">
                  <p className="uppercase text-white font-bold text-sm lg:text-lg mb-3 tracking-wide">Para familias</p>
                  <span className="inline-block rounded-full text-white text-xs lg:text-sm px-6 py-3 font-medium group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(35, 189, 238, 0.9)' }}>
                    Crear cuenta de familia
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </Reveal>

        {/* Sesiones 1 a 1 */}
        <Reveal direction="left" className="sm:flex items-center sm:gap-12 mt-28 lg:mt-36">
          <div className="sm:w-1/2 relative">
            <div className="bg-skyellow rounded-full absolute w-12 h-12 z-0 -left-4 -top-3 animate-pulse opacity-80" />
            <Eyebrow>Plan Premium</Eyebrow>
            <h2 className="font-semibold text-2xl sm:text-3xl relative text-darken leading-snug" style={{ textWrap: 'balance' } as React.CSSProperties}>
              Todo lo que haces en consulta, <span className="text-skyellow">también lo puedes hacer con Reuven</span>
            </h2>
            <p className="py-5 text-gray-500 leading-relaxed max-w-md">
              El plan Premium para familias incluye sesiones quincenales con el profesional
              directamente desde la plataforma — sin perder el hilo entre una cita y otra.
            </p>
            <Link to="/precios" className="inline-flex items-center gap-1.5 font-semibold text-darken hover:text-skyellow transition-colors">
              Ver planes <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="sm:w-1/2 relative mt-10 sm:mt-0">
            <div style={{ background: '#23BDEE' }} className="animate-floating w-24 h-24 absolute rounded-lg -top-3 -left-3" />
            <img className="rounded-xl relative z-10 w-full shadow-lg" src="/img/skilline/vcall.png" alt="Videollamada de seguimiento" loading="lazy" />
            <div style={{ background: '#F48C06' }} className="w-32 h-32 sm:w-40 sm:h-40 animate-floating absolute rounded-lg -bottom-3 -right-3 -z-0" />
          </div>
        </Reveal>

        {/* UI para el aula */}
        <Reveal direction="right" className="md:flex mt-28 lg:mt-36 md:gap-12 items-center">
          <div className="md:w-6/12 relative flex justify-center">
            <img className="relative z-10 rounded-2xl" src="/img/skilline/teacher-explaining.png" alt="Docente acompañando la sesión" loading="lazy" />
            <div style={{ background: '#33EFA0' }} className="w-24 h-24 rounded-full absolute z-0 left-4 top-8 animate-pulse opacity-60" />
          </div>
          <div className="md:w-5/12 mt-10 md:mt-0 text-gray-500">
            <Eyebrow>Diseño</Eyebrow>
            <h2 className="text-2xl sm:text-3xl font-semibold text-darken leading-snug" style={{ textWrap: 'balance' } as React.CSSProperties}>
              Una interfaz pensada <span className="text-skyellow">para la sesión de práctica</span>
            </h2>
            <div className="flex items-start gap-4 mt-6">
              <span className="flex-shrink-0 bg-white shadow-lg rounded-full p-3 w-11 h-11 flex items-center justify-center">🎙️</span>
              <p className="pt-2 leading-relaxed">Cada palabra se pronuncia en voz española — refuerzo auditivo desde el primer ejercicio.</p>
            </div>
            <div className="flex items-start gap-4 mt-5">
              <span className="flex-shrink-0 bg-white shadow-lg rounded-full p-3 w-11 h-11 flex items-center justify-center">🏆</span>
              <p className="pt-2 leading-relaxed">Confeti y puntos tras cada acierto — el niño siente el logro de inmediato.</p>
            </div>
            <div className="flex items-start gap-4 mt-5">
              <span className="flex-shrink-0 bg-white shadow-lg rounded-full p-3 w-11 h-11 flex items-center justify-center">📊</span>
              <p className="pt-2 leading-relaxed">El profesional ve todos sus estudiantes vinculados y el progreso de cada uno en un vistazo.</p>
            </div>
          </div>
        </Reveal>

        <SplitSection
          title="Ocho actividades para" highlight="docentes y familias"
          desc="Vocales, sílabas, palabras y sonidos combinados con audio, dibujo e interacción táctil. El adulto asigna, el niño juega, y ambos ven el resultado."
          img="/img/skilline/girl-with-books.png" alt="Niña con libros"
          cta={{ label: 'Empezar como familia', to: '/registro/familia' }}
        />

        <SplitSection reverse eyebrow="Evaluación"
          title="Ejercicios," highlight="evaluados al instante"
          desc="Cada respuesta se registra automáticamente: aciertos, fallos y tiempo por actividad quedan disponibles en el dashboard sin que nadie tenga que anotarlo a mano."
          img="/img/skilline/true-false.png" alt="Actividad de verdadero o falso"
        />

        <SplitSection eyebrow="Panel profesional"
          title="Panel de gestión" highlight="para profesionales"
          desc="Lista de estudiantes vinculados, progreso por actividad y sesiones recientes — todo lo que un docente o logopeda necesita para decidir el siguiente paso."
          img="/img/skilline/gradebook.png" alt="Panel de progreso"
          cta={{ label: 'Ver planes para profesionales', to: '/precios' }}
        />

        {/* Integraciones */}
        <Reveal direction="left" className="mt-28 lg:mt-36 flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <div className="md:w-6/12">
            <img className="md:w-9/12 mx-auto" src="/img/skilline/integrations.png" alt="Integración con sistemas escolares" loading="lazy" />
          </div>
          <div className="md:w-6/12">
            <Eyebrow>Integración</Eyebrow>
            <h2 className="font-semibold text-darken text-2xl sm:text-3xl leading-snug" style={{ textWrap: 'balance' } as React.CSSProperties}>
              Conecta Reuven con tu <span className="text-skyellow">Sistema de Información Escolar</span>
            </h2>
            <p className="text-gray-500 my-5 leading-relaxed max-w-md">
              Los planes Profesional y Enterprise incluyen API personalizada para integrar
              Reuven con el SIE de tu colegio o IPS.
            </p>
            <Link to="/precios" className="inline-block px-6 py-3 border border-skyellow text-skyellow font-medium rounded-full hover:scale-105 hover:bg-skyellow hover:text-white transition-all duration-300 no-underline">
              Ver planes con integración
            </Link>
          </div>
        </Reveal>

        {/* Testimonial */}
        <Reveal direction="right" className="mt-28 lg:mt-36 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-14">
          <div className="md:w-5/12">
            <Eyebrow>Testimonios</Eyebrow>
            <h2 className="font-semibold text-darken text-2xl sm:text-3xl mb-6" style={{ textWrap: 'balance' } as React.CSSProperties}>
              ¿Qué dicen quienes ya lo usan?
            </h2>
            <div className="flex flex-col gap-5">
              {TESTIMONIALS.slice(0, 2).map(({ name, role, avatar, text }) => (
                <div key={name}>
                  <p className="text-gray-500 text-sm leading-relaxed">"{text}"</p>
                  <p className="text-darken font-semibold text-sm mt-2">{avatar} {name} · <span className="text-gray-400 font-normal">{role}</span></p>
                </div>
              ))}
            </div>
            <Link to="/contacto"
              className="inline-flex items-center gap-3 pl-4 border-b border-l border-t border-skyellow text-skyellow font-medium mt-6 rounded-full no-underline hover:scale-105 transition-transform duration-300">
              <span>Cuéntanos tu experiencia</span>
              <span className="border border-skyellow h-12 w-12 rounded-full flex items-center justify-center">→</span>
            </Link>
          </div>
          <div className="md:w-7/12">
            <img className="md:w-10/12 mx-auto rounded-2xl shadow-lg" src="/img/skilline/testimonials.png" alt="Familias y profesionales usando Reuven" loading="lazy" />
          </div>
        </Reveal>

        {/* Recursos */}
        <Reveal className="mt-28 lg:mt-36 text-center">
          <Eyebrow center>Recursos</Eyebrow>
          <h2 className="text-darken text-2xl sm:text-3xl font-semibold" style={{ textWrap: 'balance' } as React.CSSProperties}>
            Guías para familias y profesionales
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Contenido escrito por el equipo de Reuven para sacarle más partido a la plataforma.
          </p>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          {RECURSOS_DESTACADOS.map((r, i) => (
            <Reveal key={r.titulo} delay={i * 100}>
              <Link to="/recursos" className="block bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline h-full">
                <span className="bg-skyellow/20 text-skyellow font-semibold px-3 py-1 text-xs rounded-full">{r.categoria}</span>
                <h3 className="text-gray-800 font-semibold my-3 leading-snug">{r.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{r.resumen}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* FAQ */}
        <Reveal className="mt-28 lg:mt-36 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Eyebrow center>Preguntas frecuentes</Eyebrow>
            <h2 className="text-darken text-2xl sm:text-3xl font-semibold">Todo lo que necesitas saber</h2>
          </div>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
        </Reveal>

      </div>

      <div className="mt-28 lg:mt-36">
        <PublicFooter />
      </div>
    </div>
  )
}
