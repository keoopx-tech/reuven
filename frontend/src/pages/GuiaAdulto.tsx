import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'

const FAQ = [
  { q: '¿Es de pago?', a: 'La versión actual es gratuita. Si en el futuro lanzamos un plan premium, los perfiles ya creados seguirán teniendo acceso al núcleo gratuito.' },
  { q: '¿Mi hijo necesita saber leer para usarla?', a: 'No. La app está pensada precisamente para acompañar el aprendizaje de la lectura. Todo lleva instrucciones por voz.' },
  { q: '¿Cómo doy acceso a la logopeda de mi hijo?', a: 'Desde tu cuenta puedes ver los códigos de vinculación generados al crear el perfil del menor. Se los das al profesional y este lo introduce en su registro.' },
  { q: '¿Qué pasa si quiero borrar la cuenta?', a: 'Desde tu panel puedes solicitar la eliminación completa. Se borran tu cuenta y la del menor, con todos sus datos asociados, conforme al RGPD.' },
]

export default function GuiaAdulto() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-cream font-poppins">
      <PublicNavbar />

      <div className="max-w-5xl mx-auto px-5 py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        {/* TOC */}
        <aside className="lg:sticky lg:top-24 self-start">
          <Card padding="sm">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">En esta página</p>
            {['Qué hace Reuven','Cómo acompañar','Qué datos recogemos','Control parental','Preguntas frecuentes'].map((s) => (
              <a key={s} href={`#${s.toLowerCase().replace(/\s+/g,'-')}`}
                className="block text-sm font-semibold text-gray-500 hover:text-skyellow hover:bg-green-50 px-3 py-2 rounded-xl transition-all no-underline">
                {s}
              </a>
            ))}
          </Card>
        </aside>

        {/* CONTENT */}
        <div className="flex flex-col gap-5">
          <Card id="qué-hace-reuven">
            <h2 className="font-poppins font-extrabold text-darken text-2xl mb-3">🌱 Qué hace Reuven</h2>
            <p className="text-gray-500 mb-3">Reuven es una plataforma de lectoescritura para niños y niñas en español. A través de 8 actividades guiadas, los menores trabajan vocales, sílabas, palabras, sonidos y escritura.</p>
            <ul className="flex flex-col gap-2">
              {['Pensado para 4-8 años','Funciona desde el navegador, sin instalación','Cada acierto se refuerza con voz y celebración','Los padres tienen su propio espacio separado'].map((t) => (
                <li key={t} className="flex items-start gap-3 pl-0">
                  <span className="w-5 h-5 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card id="cómo-acompañar">
            <h2 className="font-poppins font-extrabold text-darken text-2xl mb-3">🤝 Cómo acompañar a tu hijo/a</h2>
            <ul className="flex flex-col gap-2">
              {[
                ['Sesiones cortas y frecuentes.','10-15 minutos al día rinden más que una hora a la semana.'],
                ['Celebra el intento, no solo el acierto.','Equivocarse forma parte del proceso.'],
                ['Lee en voz alta con él/ella','antes o después de la sesión.'],
                ['Sin pantalla justo antes de dormir.','Mejor por la tarde, después de jugar al aire libre.'],
              ].map(([t, b]) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-sm"><strong>{t}</strong> {b}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card id="qué-datos-recogemos">
            <h2 className="font-poppins font-extrabold text-darken text-2xl mb-3">🔒 Qué datos recogemos y por qué</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { ico: '👤', t: 'Nombre del menor', d: 'Para personalizar el perfil. Puede ser un apodo.' },
                { ico: '📅', t: 'Fecha de nacimiento', d: 'Para adaptar la dificultad de las actividades.' },
                { ico: '📊', t: 'Progreso', d: 'Aciertos, errores y tiempo por actividad. Solo tú lo ves.' },
                { ico: '📧', t: 'Tu email', d: 'Para recuperar el acceso a tu cuenta.' },
              ].map(({ ico, t, d }) => (
                <div key={t} className="bg-cream rounded-xl p-4 border border-gray-100">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-lg mb-2">{ico}</div>
                  <p className="font-poppins font-bold text-darken text-sm mb-1">{t}</p>
                  <p className="text-xs text-gray-500">{d}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card id="control-parental">
            <h2 className="font-poppins font-extrabold text-darken text-2xl mb-3">🛡️ Control parental</h2>
            <ul className="flex flex-col gap-2">
              {['Pausar o eliminar el perfil en cualquier momento.','Autorizar (o revocar) el acceso a un profesional.','Descargar y borrar todos los datos del menor (RGPD).'].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card id="preguntas-frecuentes">
            <h2 className="font-poppins font-extrabold text-darken text-2xl mb-4">❓ Preguntas frecuentes</h2>
            <div className="flex flex-col divide-y divide-gray-100">
              {FAQ.map(({ q, a }, i) => (
                <div key={q} className="py-3.5">
                  <button
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    className="w-full flex items-center justify-between text-left font-bold text-darken text-sm"
                  >
                    {q}
                    <span className="text-xl text-gray-400 transition-transform" style={{ transform: openIdx === i ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {openIdx === i && <p className="text-sm text-gray-500 mt-2">{a}</p>}
                </div>
              ))}
            </div>
          </Card>

          <div className="rounded-3xl text-white text-center p-10" style={{ background: 'linear-gradient(105.5deg, #545AE7 19.57%, #2F327D 78.85%)' }}>
            <h3 className="font-poppins font-extrabold text-2xl mb-2">¿Listos para crear la cuenta?</h3>
            <p className="opacity-85 mb-6">Tarda menos de un minuto.</p>
            <Link to="/registro/familia">
              <Button size="lg" className="!bg-white !text-darken hover:!bg-yellow-300">Crear cuenta de familia →</Button>
            </Link>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
