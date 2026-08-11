import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/hooks/useAuth'

export function SkillineLogo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="relative inline-flex items-center">
      <svg className="w-11 h-11 absolute -top-2 -left-3 z-0" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35.9645 2.94975C37.9171 0.997129 41.0829 0.997127 43.0355 2.94975L76.0502 35.9645C78.0029 37.9171 78.0029 41.0829 76.0503 43.0355L43.0355 76.0502C41.0829 78.0029 37.9171 78.0029 35.9645 76.0503L2.94975 43.0355C0.997129 41.0829 0.997127 37.9171 2.94975 35.9645L35.9645 2.94975Z"
          fill={dark ? 'none' : '#65DAFF'} stroke={dark ? '#26C1F2' : 'none'} strokeWidth={dark ? 2 : 0} />
      </svg>
      <span className={`relative z-10 pl-5 font-bold tracking-wide ${dark ? 'text-white' : 'text-gray-900'}`}>
        Reuven
      </span>
    </span>
  )
}

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/precios', label: 'Precios' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/recursos', label: 'Recursos' },
  { to: '/contacto', label: 'Contacto' },
]

export function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <div className="w-full text-gray-700 bg-cream">
      <div className="flex flex-col max-w-screen-xl px-6 sm:px-8 mx-auto md:items-center md:justify-between md:flex-row">
        <div className="flex flex-row items-center justify-between py-6">
          <Link to="/" className="no-underline"><SkillineLogo /></Link>
          <button className="rounded-lg md:hidden focus:outline-none" onClick={() => setOpen(!open)} aria-label="Abrir menú">
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
              {open ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              ) : (
                <path fillRule="evenodd" clipRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" />
              )}
            </svg>
          </button>
        </div>
        <nav className={`${open ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center pb-4 md:pb-0 gap-1 md:gap-0`}>
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to}
              className="px-4 py-2 md:mt-0 text-sm bg-transparent rounded-lg hover:text-gray-900 no-underline">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to={user.rol === 'profesional' ? '/dashboard' : '/perfiles'}
                className="px-8 py-3 mt-2 md:mt-0 md:ml-2 text-sm text-center bg-skyellow text-white rounded-full no-underline font-medium">
                Continuar →
              </Link>
              <button onClick={() => logout()}
                className="px-4 py-2 mt-2 md:mt-0 text-sm text-gray-400 hover:text-gray-700 transition-colors">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-8 py-3 mt-2 md:mt-0 md:ml-2 text-sm text-center bg-white text-gray-800 rounded-full no-underline shadow-sm">
                Iniciar sesión
              </Link>
              <Link to="/registro/familia" className="px-8 py-3 mt-2 md:mt-0 md:ml-2 text-sm text-center bg-skyellow text-white rounded-full no-underline font-medium">
                Empezar gratis
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}
