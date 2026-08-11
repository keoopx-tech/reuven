import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/lib/api/auth'
import { perfilesApi } from '@/lib/api/perfiles'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatCodeInput } from '@/lib/utils/codes'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'

const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email('Email inválido'),
  password: z.string().min(8),
  telefono: z.string().optional(),
  profesion: z.enum(['docente', 'psicologo', 'neurolinguista', 'logopeda', 'otro'], { required_error: 'Elige una profesión' }),
  centro: z.string().min(2, 'Obligatorio'),
  colegiado: z.string().optional(),
  code: z.string().optional(),
  c1: z.literal(true, { errorMap: () => ({ message: 'Obligatorio' }) }),
  c2: z.literal(true, { errorMap: () => ({ message: 'Obligatorio' }) }),
  c3: z.literal(true, { errorMap: () => ({ message: 'Obligatorio' }) }),
})
type FormData = z.infer<typeof schema>

export default function RegistroProfesional() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [codeDisplay, setCodeDisplay] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      await authApi.register({
        email: data.email, password: data.password, nombre: data.nombre,
        rol: 'profesional', profesion: data.profesion, centro: data.centro,
        colegiado: data.colegiado, telefono: data.telefono,
      })
      await login(data.email, data.password)
      if (data.code) {
        try { await perfilesApi.activarCodigo(data.code) } catch { /* código inválido — ignorar */ }
      }
      navigate('/dashboard')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Error al crear la cuenta'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream font-poppins">
      <PublicNavbar />
      <div className="max-w-2xl mx-auto py-12 px-5">

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex gap-3 items-start">
          <span className="text-xl flex-shrink-0">ℹ️</span>
          <p className="text-blue-800 text-sm">
            <strong>Importante:</strong> el acceso a los datos del menor requiere siempre la autorización del tutor/a legal.
          </p>
        </div>

        <div className="text-center mb-8">
          <span className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full inline-block mb-3">🎓 Cuenta profesional</span>
          <h1 className="font-poppins font-bold text-darken text-3xl">Cuenta para profesionales</h1>
          <p className="text-gray-500 mt-2">Para docentes, psicólogos/as, neurolingüistas y logopedas.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Card>
            <h2 className="font-poppins font-extrabold text-darken text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-darken text-white rounded-full text-sm font-bold flex items-center justify-center">1</span>
              Datos profesionales
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nombre completo" required error={errors.nombre?.message} {...register('nombre')} />
              <Input label="Email profesional" type="email" required error={errors.email?.message} {...register('email')} />
              <Input label="Contraseña" type="password" required hint="Mínimo 8 caracteres" error={errors.password?.message} {...register('password')} />
              <Input label="Teléfono" type="tel" {...register('telefono')} />
              <div>
                <label className="text-sm font-semibold text-darken block mb-1.5">Profesión <span className="text-red-500">*</span></label>
                <select {...register('profesion')} className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-cream text-base focus:outline-none focus:border-skyellow">
                  <option value="">— Selecciona —</option>
                  <option value="docente">👩‍🏫 Docente</option>
                  <option value="psicologo">🧠 Psicólogo/a</option>
                  <option value="neurolinguista">🗣️ Neurolingüista</option>
                  <option value="logopeda">👂 Logopeda</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.profesion && <p className="text-xs text-red-500 mt-1">{errors.profesion.message}</p>}
              </div>
              <Input label="Centro o institución" required error={errors.centro?.message} placeholder="Ej. CEIP Cervantes, consulta privada…" {...register('centro')} />
              <Input label="Nº de colegiado/a" hint="Si tu profesión lo requiere" {...register('colegiado')} />
            </div>
          </Card>

          <Card>
            <h2 className="font-poppins font-extrabold text-darken text-lg mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-darken text-white rounded-full text-sm font-bold flex items-center justify-center">2</span>
              Vincular a un menor
            </h2>
            <p className="text-sm text-gray-500 mb-4">Pídele al tutor/a del menor el código. Puedes hacerlo después desde tu panel.</p>
            <Input
              label="Código de vinculación"
              placeholder="XXXX-XXXX"
              maxLength={9}
              value={codeDisplay}
              onChange={(e) => {
                const f = formatCodeInput(e.target.value)
                setCodeDisplay(f)
                setValue('code', f)
              }}
              className="font-mono tracking-widest text-center text-lg uppercase"
            />
          </Card>

          <Card>
            <h2 className="font-poppins font-extrabold text-darken text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-darken text-white rounded-full text-sm font-bold flex items-center justify-center">3</span>
              Consentimientos
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { name: 'c1' as const, text: 'Confirmo que el/la tutor/a legal del menor me ha autorizado a acceder a sus resultados.', err: errors.c1 },
                { name: 'c2' as const, text: 'Me comprometo a tratar los datos del menor con confidencialidad y solo para fines clínicos o educativos.', err: errors.c2 },
                { name: 'c3' as const, text: 'Autorizo el tratamiento de mis datos personales y acepto los términos de uso profesional.', err: errors.c3 },
              ].map(({ name, text, err }) => (
                <label key={name} className="flex gap-3 items-start border border-gray-100 rounded-xl p-3.5 cursor-pointer has-[:checked]:bg-green-50 has-[:checked]:border-green-200 transition-all">
                  <input type="checkbox" {...register(name)} className="mt-0.5 w-4 h-4 accent-green-600 flex-shrink-0" />
                  <span className="text-sm">{text} <span className="text-red-500">*</span>
                    {err && <span className="text-xs text-red-500 block">{err.message}</span>}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex gap-3 justify-end">
            <Link to="/"><Button variant="secondary">Cancelar</Button></Link>
            <Button type="submit" loading={loading}>Crear cuenta profesional →</Button>
          </div>
        </form>
      </div>
      <PublicFooter />
    </div>
  )
}
