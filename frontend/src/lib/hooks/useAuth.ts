import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/stores/authStore'
import type { RegisterTutorDto, RegisterProfesionalDto } from '@/lib/api/auth'

export function useAuth() {
  const { user, accessToken, setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const login = useCallback(
    async (email: string, password: string) => {
      const token = await authApi.login(email, password)
      const me = await authApi.me()
      setAuth(me, token.access_token)
      return me
    },
    [setAuth]
  )

  const register = useCallback(
    async (dto: RegisterTutorDto | RegisterProfesionalDto) => {
      return authApi.register(dto)
    },
    []
  )

  const logout = useCallback(async () => {
    await authApi.logout()
    clearAuth()
    navigate('/')
  }, [clearAuth, navigate])

  return {
    user,
    accessToken,
    isAuthenticated: !!user,
    isTutor: user?.rol === 'tutor',
    isProfesional: user?.rol === 'profesional',
    login,
    register,
    logout,
  }
}
