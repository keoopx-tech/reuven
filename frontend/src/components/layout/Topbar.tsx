import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/Button'

interface Props {
  rightContent?: React.ReactNode
}

export function Topbar({ rightContent }: Props) {
  const { user, logout } = useAuth()

  return (
    <header className="bg-surface border-b border-gray-100 px-7 py-3.5 flex items-center justify-between gap-4 flex-wrap">
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <span
          className="flex items-center justify-center rounded-xl text-white font-extrabold text-sm"
          style={{
            width: 40, height: 36,
            background: 'linear-gradient(135deg, #4f46e5, #0f172a)',
            fontSize: '0.88rem', letterSpacing: '-0.02em',
          }}
        >
          RF
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-poppins font-bold text-navy text-lg">Reuven</span>
          <span className="text-brand font-bold uppercase tracking-widest"
            style={{ fontSize: '0.6rem' }}>
            Enseñamos a Pensar
          </span>
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {rightContent}
        {user && (
          <>
            <span className="text-sm text-gray-500 hidden sm:block">{user.nombre}</span>
            <Button variant="secondary" size="sm" onClick={logout}>
              Salir
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
