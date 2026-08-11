import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { perfilesApi } from '@/lib/api/perfiles'
import { usePerfilStore } from '@/lib/stores/perfilStore'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { AVATAR_BG } from '@/lib/constants'
import type { Perfil } from '@/types/api'

const EMOJIS = ['🦊','🐱','🐘','🐻','🐼','🦁','🐸','🦄']

export default function LoginNinos() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const setPerfilActivo = usePerfilStore((s) => s.setPerfilActivo)
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [emoji, setEmoji] = useState('🦊')
  const [esNino, setEsNino] = useState(true)
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [idiomaMaterno, setIdiomaMaterno] = useState('es')

  const { data: perfiles = [], isLoading } = useQuery({
    queryKey: ['perfiles'],
    queryFn: perfilesApi.list,
  })

  const resetForm = () => {
    setNombre('')
    setEmoji('🦊')
    setEsNino(true)
    setFechaNacimiento('')
    setIdiomaMaterno('es')
  }

  const createMut = useMutation({
    mutationFn: () => perfilesApi.create({
      nombre,
      emoji,
      es_nino: esNino,
      fecha_nacimiento: fechaNacimiento || undefined,
      idioma_materno: idiomaMaterno,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['perfiles'] }); setOpen(false); resetForm() },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => perfilesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['perfiles'] }),
  })

  const handleSelect = (perfil: Perfil) => {
    setPerfilActivo(perfil.id)
    navigate('/ejercicios')
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col font-poppins">
      <header className="bg-surface border-b border-gray-100 px-7 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span className="w-10 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#0f172a)', letterSpacing: '-0.02em' }}>RF</span>
          <span className="font-poppins font-bold text-navy text-lg">Reuven</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/guia-familia" className="text-sm font-semibold text-gray-500 hover:text-navy transition-colors">Ayuda</Link>
          <Button variant="ghost" size="sm" onClick={logout}>Salir</Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-4xl text-center">
          <h1 className="font-poppins font-bold text-navy text-4xl lg:text-5xl tracking-tight mb-3">
            ¿Quién va a jugar hoy?
          </h1>
          <p className="text-gray-500 mb-12 text-lg">Elige tu perfil para empezar.</p>

          {isLoading ? (
            <div className="text-gray-400">Cargando perfiles…</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
              {perfiles.map((p, i) => (
                <div key={p.id} className="group relative">
                  <button
                    onClick={() => handleSelect(p)}
                    className="w-full flex flex-col items-center gap-3.5 p-4 rounded-2xl hover:bg-surface hover:-translate-y-1 hover:shadow-card transition-all duration-200"
                  >
                    <div
                      className="w-32 h-32 rounded-3xl flex items-center justify-center text-6xl relative border-4 border-transparent group-hover:border-brand transition-colors"
                      style={{ background: AVATAR_BG[i % 4] }}
                    >
                      {p.emoji}
                      <span className="absolute bottom-2 right-2 bg-white text-navy text-xs font-bold px-2 py-0.5 rounded-full border border-gray-100">
                        {p.es_nino ? 'Niño' : 'Niña'}
                      </span>
                    </div>
                    <span className="font-poppins font-extrabold text-navy text-lg">{p.nombre}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar el perfil de ${p.nombre}?`)) deleteMut.mutate(p.id)
                    }}
                    className="absolute top-3 right-3 w-7 h-7 bg-white/90 text-red-400 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:scale-110 shadow"
                    title="Eliminar perfil"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* ADD */}
              <button
                onClick={() => setOpen(true)}
                className="flex flex-col items-center gap-3.5 p-4 rounded-2xl hover:bg-surface hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="w-32 h-32 rounded-3xl border-[2.5px] border-dashed border-gray-300 flex items-center justify-center text-5xl text-gray-400 group-hover:border-brand group-hover:text-brand group-hover:bg-green-50 transition-all">
                  +
                </div>
                <span className="font-poppins font-bold text-gray-500 group-hover:text-navy text-lg">Añadir perfil</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="px-5 py-6 text-center">
        <p className="text-sm text-gray-500 bg-surface border border-gray-100 rounded-xl px-5 py-2.5 inline-block">
          Solo personas que conviven con el menor pueden usar su perfil.
        </p>
      </footer>

      <Modal open={open} onClose={() => setOpen(false)} title="Añadir un nuevo perfil">
        <p className="text-gray-500 text-sm mb-5">Crea un perfil para otro niño o niña.</p>

        <div className="flex flex-col gap-4">
          <Input
            label="Nombre"
            placeholder="Ej. Sofía"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
          />

          <div>
            <label className="text-sm font-semibold text-navy block mb-2">Avatar</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-11 h-11 rounded-xl border-2 text-2xl transition-all ${
                    emoji === e
                      ? 'border-brand bg-green-50 scale-110'
                      : 'border-gray-200 bg-surface hover:border-brand'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-bg rounded-xl border border-gray-100 px-4 py-3">
            <span className="text-sm font-semibold text-navy">Género</span>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-sm font-semibold text-pink-500">👧 Niña</span>
              <div
                className="relative w-12 h-6 rounded-full transition-colors cursor-pointer"
                style={{ background: esNino ? '#3b82f6' : '#ec4899' }}
                onClick={() => setEsNino(!esNino)}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${esNino ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm font-semibold text-blue-500">👦 Niño</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Fecha de nacimiento"
              type="date"
              hint="Opcional"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
            <div>
              <label className="text-sm font-semibold text-navy block mb-1.5">Idioma materno</label>
              <select
                value={idiomaMaterno}
                onChange={(e) => setIdiomaMaterno(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-bg text-base focus:outline-none focus:border-brand"
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => createMut.mutate()}
              loading={createMut.isPending}
              disabled={!nombre.trim()}
            >
              Crear perfil
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
