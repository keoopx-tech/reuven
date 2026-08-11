import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { useAuth } from '@/lib/hooks/useAuth'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SkillineLogo } from '@/components/layout/PublicNavbar'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: Location })?.from?.pathname

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const me = await login(email, password)
      const destino = from ?? (me.rol === 'profesional' ? '/dashboard' : '/perfiles')
      navigate(destino, { replace: true })
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail?: string }>
      setError(axiosErr.response?.data?.detail ?? 'Email o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream font-poppins antialiased flex flex-col">
      <nav className="py-5 px-6 sm:px-8 lg:px-8">
        <div className="max-w-[85rem] mx-auto">
          <Link to="/" className="no-underline"><SkillineLogo /></Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <Reveal className="w-full max-w-sm">
          <div className="text-center mb-7">
            <h1 className="font-bold text-darken text-2xl sm:text-3xl tracking-tight mb-2">
              Inicia sesión
            </h1>
            <p className="text-gray-600 text-sm">
              Accede a tu cuenta de familia o profesional.
            </p>
          </div>

          <Card padding="lg" className="shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
              <Input
                label="Contraseña"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                loading={loading}
                className="w-full mt-1 hover:-translate-y-0.5"
                style={{ background: '#F48C06', boxShadow: '0 4px 14px rgba(244,140,6,0.35)' }}
              >
                Entrar
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-7">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/registro/familia" className="text-skyellow font-semibold hover:underline">
              Crea una cuenta de familia
            </Link>
            {' '}o{' '}
            <Link to="/registro/profesional" className="text-skyellow font-semibold hover:underline">
              cuenta profesional
            </Link>
          </p>
        </Reveal>
      </div>
    </div>
  )
}
