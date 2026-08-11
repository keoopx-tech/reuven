import { Link } from 'react-router-dom'
import { SkillineLogo } from './PublicNavbar'

export function PublicFooter() {
  return (
    <footer className="mt-32" style={{ backgroundColor: '#252641' }}>
      <div className="max-w-lg mx-auto">
        <div className="flex py-12 justify-center text-white items-center px-10 sm:px-20">
          <SkillineLogo dark />
          <span className="border-l border-gray-500 text-sm pl-5 py-2 font-semibold ml-5">Enseñamos a Pensar</span>
        </div>
        <div className="text-center pb-14 px-6">
          <p className="text-gray-300 font-semibold mb-3">¿Tu colegio o IPS necesita más de 5 licencias?</p>
          <Link to="/contacto"
            className="inline-block text-white font-semibold px-6 py-3 rounded-full no-underline"
            style={{ background: 'linear-gradient(105.5deg, #545AE7 19.57%, #393FCF 78.85%)' }}>
            Habla con el equipo
          </Link>
        </div>
        <div className="flex flex-wrap items-center text-gray-400 text-sm justify-center gap-y-2">
          <Link to="/nosotros" className="pr-3 no-underline hover:text-white">Nosotros</Link>
          <Link to="/precios" className="border-l border-gray-600 px-3 no-underline hover:text-white">Precios</Link>
          <Link to="/recursos" className="border-l border-gray-600 px-3 no-underline hover:text-white">Recursos</Link>
          <Link to="/contacto" className="border-l border-gray-600 pl-3 no-underline hover:text-white">Contacto</Link>
        </div>
        <div className="text-center text-white pb-10">
          <p className="my-3 text-gray-400 text-sm">© 2026 Reuven Feuerstein · Todos los derechos reservados</p>
          <p className="text-gray-500 text-xs">
            Diseño inspirado en la plantilla{' '}
            <a href="https://themewagon.github.io/skilline/" target="_blank" rel="noreferrer" className="underline hover:text-gray-300">
              Skilline
            </a>{' '}(ThemeWagon, MIT License)
          </p>
        </div>
      </div>
    </footer>
  )
}
