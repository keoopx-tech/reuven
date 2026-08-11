import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Usuario } from '@/types/api'

interface AuthState {
  user: Usuario | null
  accessToken: string | null
  setAuth: (user: Usuario, token: string) => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, token) => set({ user, accessToken: token }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearAuth: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'reuven-auth',
      // Solo persistir el user — el token se renueva via refresh cookie httpOnly
      partialize: (state) => ({ user: state.user }),
    }
  )
)
