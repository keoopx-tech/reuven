import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/lib/api/auth'
import { perfilesApi } from '@/lib/api/perfiles'
import { useAuth } from '@/lib/hooks/useAuth'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  telefono: z.string().optional(),
  relacion: z.enum(['madre', 'padre', 'tutor', 'otro'], { required_error: 'Elige una opción' }),
  kidNombre: z.string().min(1, 'El nombre del menor es obligatorio'),
  kidEsNino: z.boolean(),
  c1: z.literal(true, { errorMap: () => ({ message: 'Obligatorio' }) }),
  c2: z.literal(true, { errorMap: () => ({ message: 'Obligatorio' }) }),
  c3: z.literal(true, { errorMap: () => ({ message: 'Obligatorio' }) }),
})
type FormData = z.infer<typeof schema>

export default function RegistroAdulto() {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [code, setCode] = useState('')
  const [kidNombre, setKidNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { kidEsNino: true },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      await authApi.register({ email: data.email, password: data.password, nombre: data.nombre, rol: 'tutor', relacion: data.relacion, telefono: data.telefono })
      await login(data.email, data.password)
      const perfil = await perfilesApi.create({ nombre: data.kidNombre, es_nino: data.kidEsNino, emoji: '🐻' })
      const { code: generatedCode } = await perfilesApi.generarCodigo(perfil.id)
      setCode(generatedCode)
      setKidNombre(data.kidNombre)
      setStep('success')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Error al crear la cuenta'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-cream font-poppins flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center px-5 py-12">
        <Card className="max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">✓</div>
            <h1 className="font-poppins font-bold text-darken text-2xl">Cuenta creada con éxito</h1>
            <p className="text-gray-500 mt-1">Comparte este código con el profesional que vaya a seguir el progreso de <strong>{kidNombre}</strong>:</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center mb-5">
            <p className="font-mono text-3xl font-bold text-darken tracking-widest">{code}</p>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="mt-3 text-sm font-bold text-green-700 hover:underline"
            >
              📋 Copiar código
            </button>
          </div>
          <Link to="/perfiles">
            <Button className="w-full justify-center">Ir a los perfiles del menor →</Button>
          </Link>
        </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream font-poppins">
      <PublicNavbar />
      <div className="max-w-2xl mx-auto py-12 px-5">
        <div className="text-center mb-8">
          <span className="bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full inline-block mb-3">👨‍👩‍👧 Cuenta de familia</span>
          <h1 className="font-poppins font-bold text-darken text-3xl">Crea la cuenta de la familia</h1>
          <p className="text-gray-500 mt-2">Solo lo imprescindible para empezar.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* ADULTO */}
          <Card>
            <h2 className="font-poppins font-extrabold text-darken text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-darken text-white rounded-full text-sm font-bold flex items-center justify-center">1</span>
              Datos del adulto responsable
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nombre completo" required error={errors.nombre?.message} {...register('nombre')} />
              <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
              <Input label="Teléfono" type="tel" hint="Opcional" {...register('telefono')} />
              <div>
                <label className="text-sm font-semibold text-darken block mb-1.5">
                  Relación <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[['madre','👩 Madre'],['padre','👨 Padre'],['tutor','🧑 Tutor/a'],['otro','Otro']].map(([v,l]) => (
                    <label key={v} className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 cursor-pointer hover:border-skyellow has-[:checked]:bg-green-50 has-[:checked]:border-green-300 transition-all">
                      <input type="radio" value={v} {...register('relacion')} className="accent-skyellow" />
                      <span className="text-sm font-semibold">{l}</span>
                    </label>
                  ))}
                </div>
                {errors.relacion && <p className="text-xs text-red-500 mt-1">{errors.relacion.message}</p>}
              </div>
              <Input label="Contraseña" type="password" required hint="Mínimo 8 caracteres" error={errors.password?.message} {...register('password')} />
            </div>
          </Card>

          {/* MENOR */}
          <Card>
            <h2 className="font-poppins font-extrabold text-darken text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-darken text-white rounded-full text-sm font-bold flex items-center justify-center">2</span>
              Datos del menor
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nombre del niño/a" required hint="Puede ser un apodo" error={errors.kidNombre?.message} {...register('kidNombre')} />
              <div className="flex items-center gap-4 border border-gray-200 rounded-xl px-4 py-3">
                <span className="text-sm font-semibold text-darken">Género</span>
                <label className="flex items-center gap-2 ml-auto cursor-pointer">
                  <span className="text-sm font-semibold text-pink-500">👧 Niña</span>
                  <input type="checkbox" className="hidden peer" {...register('kidEsNino')} />
                  <div className="relative w-12 h-6 bg-pink-400 peer-checked:bg-blue-400 rounded-full transition-colors">
                    <div className="absolute top-0.5 left-0.5 peer-checked:translate-x-6 w-5 h-5 bg-white rounded-full shadow transition-transform" />
                  </div>
                  <span className="text-sm font-semibold text-blue-500">👦 Niño</span>
                </label>
              </div>
            </div>
          </Card>

          {/* CONSENTIMIENTOS */}
          <Card>
            <h2 className="font-poppins font-extrabold text-darken text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-darken text-white rounded-full text-sm font-bold flex items-center justify-center">3</span>
              Consentimientos
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { name: 'c1' as const, text: 'Soy mayor de edad y ostento la representación legal del menor.', err: errors.c1 },
                { name: 'c2' as const, text: 'Autorizo el tratamiento de los datos personales del menor.', err: errors.c2 },
                { name: 'c3' as const, text: 'He leído y acepto los términos de uso.', err: errors.c3 },
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
            <Button type="submit" loading={loading}>Crear cuenta →</Button>
          </div>
        </form>
      </div>
      <PublicFooter />
    </div>
  )
}
