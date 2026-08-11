import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'

import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import LoginNinos from '@/pages/LoginNinos'
import RegistroAdulto from '@/pages/RegistroAdulto'
import RegistroProfesional from '@/pages/RegistroProfesional'
import GuiaAdulto from '@/pages/GuiaAdulto'
import Dashboard from '@/pages/Dashboard'
import PerfilDetalle from '@/pages/PerfilDetalle'
import Metricas from '@/pages/Metricas'
import Ejercicios from '@/pages/Ejercicios'
import Precios from '@/pages/Precios'
import Nosotros from '@/pages/Nosotros'
import Recursos from '@/pages/Recursos'
import Contacto from '@/pages/Contacto'

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/precios', element: <Precios /> },
  { path: '/nosotros', element: <Nosotros /> },
  { path: '/recursos', element: <Recursos /> },
  { path: '/contacto', element: <Contacto /> },
  { path: '/guia-familia', element: <GuiaAdulto /> },
  { path: '/registro/familia', element: <RegistroAdulto /> },
  { path: '/registro/profesional', element: <RegistroProfesional /> },

  // Rutas del tutor (login de niños)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowed={['tutor', 'admin']} />,
        children: [
            { path: '/perfiles', element: <LoginNinos /> },
            { path: '/ejercicios', element: <Ejercicios /> },
          ],
      },
    ],
  },

  // Rutas del profesional
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowed={['profesional', 'admin']} />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/perfil/:perfilId', element: <PerfilDetalle /> },
          { path: '/metricas/:perfilId', element: <Metricas /> },
        ],
      },
    ],
  },
])
