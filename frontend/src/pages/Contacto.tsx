import { useState } from 'react'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'

// TODO: reemplazar por el buzón real del equipo comercial antes de producción.
const CONTACT_EMAIL = 'hola@reuven.app'

const RAZONES = [
  { icon: '🏫', title: 'Colegios y redes educativas', desc: 'Planes desde 5 licencias, con descuento por compromiso trimestral o anual.' },
  { icon: '🧑‍⚕️', title: 'IPS y consultas privadas', desc: 'Vinculación de pacientes vía código, sin compartir contraseñas.' },
  { icon: '🤝', title: 'Piloto cerrado', desc: 'Si quieres probar Reuven con un grupo reducido antes de decidir, lo armamos juntos.' },
]

export default function Contacto() {
  const [nombre, setNombre] = useState('')
  const [institucion, setInstitucion] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`Contacto desde reuven.app — ${institucion || nombre}`)
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nInstitución: ${institucion}\nEmail: ${email}\n\nMensaje:\n${mensaje}`
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setEnviado(true)
  }

  return (
    <div className="min-h-screen bg-cream font-poppins antialiased">
      <PublicNavbar />

      <section className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* ── INFO ─────────────────────────────────────────────── */}
          <Reveal direction="right">
            <Eyebrow>Contacto</Eyebrow>
            <h1 className="font-bold text-darken text-3xl sm:text-4xl leading-tight tracking-tight mb-5"
              style={{ textWrap: 'balance' } as React.CSSProperties}>
              Hablemos de tu colegio, IPS o consulta
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
              Cuéntanos cuántos profesionales necesitan acceso y qué te gustaría medir.
              Respondemos en menos de 24h hábiles.
            </p>

            <div className="flex flex-col gap-6">
              {RAZONES.map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <span className="w-11 h-11 rounded-2xl bg-skyellow/10 flex items-center justify-center text-xl flex-shrink-0">
                    {icon}
                  </span>
                  <div>
                    <p className="font-extrabold text-darken text-sm mb-1">{title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* ── FORM ─────────────────────────────────────────────── */}
          <Reveal direction="left">
            <Card padding="lg" className="shadow-lg">
              {enviado ? (
                <div className="text-center py-10">
                  <span className="text-4xl block mb-4">📬</span>
                  <h3 className="font-extrabold text-darken text-lg mb-2">
                    Abrimos tu cliente de correo
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                    Revisa que el mensaje se haya prellenado y dale enviar. Si no se abrió
                    nada, escríbenos directo a{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-skyellow font-semibold hover:underline">
                      {CONTACT_EMAIL}
                    </a>.
                  </p>
                  <button onClick={() => setEnviado(false)}
                    className="mt-6 px-5 py-2.5 rounded-xl border border-gray-200 text-darken text-sm font-semibold hover:border-darken transition-colors">
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <Input
                    label="Tu nombre"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ana Rodríguez"
                  />
                  <Input
                    label="Colegio, IPS o consulta"
                    required
                    value={institucion}
                    onChange={(e) => setInstitucion(e.target.value)}
                    placeholder="Colegio San Martín"
                  />
                  <Input
                    label="Email de contacto"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ana@colegio.edu"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="mensaje" className="text-sm font-semibold text-darken">
                      Cuéntanos qué necesitas
                    </label>
                    <textarea
                      id="mensaje"
                      required
                      rows={4}
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      placeholder="Somos un colegio con 15 docentes interesados en el plan Profesional..."
                      className="w-full px-3.5 py-3 rounded-xl border border-gray-200 font-poppins text-base bg-cream text-gray-900 transition-all duration-150 placeholder:text-gray-400 focus:outline-none focus:border-skyellow focus:bg-white focus:ring-2 focus:ring-skyellow/10"
                    />
                  </div>
                  <button type="submit"
                    className="w-full mt-2 bg-skyellow text-white font-bold rounded-xl py-3.5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                    Enviar mensaje
                  </button>
                </form>
              )}
            </Card>
          </Reveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
