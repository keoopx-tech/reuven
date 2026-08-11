import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/authStore'
import type { Rol } from '@/types/api'

interface Props {
  allowed: Rol[]
}

export function RoleRoute({ allowed }: Props) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allowed.includes(user.rol)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
