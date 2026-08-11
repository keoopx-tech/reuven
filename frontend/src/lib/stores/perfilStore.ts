import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PerfilState {
  perfilActivoId: string | null
  setPerfilActivo: (id: string) => void
  clearPerfil: () => void
}

export const usePerfilStore = create<PerfilState>()(
  persist(
    (set) => ({
      perfilActivoId: null,
      setPerfilActivo: (id) => set({ perfilActivoId: id }),
      clearPerfil: () => set({ perfilActivoId: null }),
    }),
    { name: 'reuven-perfil' }
  )
)
