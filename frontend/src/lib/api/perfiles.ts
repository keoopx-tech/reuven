import api from './client'
import type { Codigo, Perfil } from '@/types/api'

export interface CreatePerfilDto {
  nombre: string
  emoji?: string
  es_nino?: boolean
  fecha_nacimiento?: string
  idioma_materno?: string
}

export const perfilesApi = {
  list: () => api.get<Perfil[]>('/perfiles').then((r) => r.data),

  create: (dto: CreatePerfilDto) =>
    api.post<Perfil>('/perfiles', dto).then((r) => r.data),

  update: (id: string, dto: Partial<CreatePerfilDto>) =>
    api.patch<Perfil>(`/perfiles/${id}`, dto).then((r) => r.data),

  delete: (id: string) => api.delete(`/perfiles/${id}`),

  generarCodigo: (perfil_id: string) =>
    api.post<{ code: string }>('/codigos', { perfil_id }).then((r) => r.data),

  listarCodigos: () => api.get<Codigo[]>('/codigos').then((r) => r.data),

  activarCodigo: (code: string) =>
    api.post<{ perfil_id: string; mensaje: string }>('/vinculos/activar', { code }).then((r) => r.data),

  desvincular: (perfil_id: string) => api.delete(`/vinculos/${perfil_id}`),

  profesionalPerfiles: () =>
    api.get<Perfil[]>('/profesional/perfiles').then((r) => r.data),
}
