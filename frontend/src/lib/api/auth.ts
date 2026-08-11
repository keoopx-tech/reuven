import api from './client'
import type { TokenResponse, Usuario } from '@/types/api'

export interface RegisterTutorDto {
  email: string
  password: string
  nombre: string
  rol: 'tutor'
  relacion?: string
  telefono?: string
}

export interface RegisterProfesionalDto {
  email: string
  password: string
  nombre: string
  rol: 'profesional'
  profesion: string
  centro: string
  colegiado?: string
  telefono?: string
}

export const authApi = {
  register: (dto: RegisterTutorDto | RegisterProfesionalDto) =>
    api.post<Usuario>('/auth/register', dto).then((r) => r.data),

  login: (email: string, password: string) =>
    api.post<TokenResponse>('/auth/login', { email, password }).then((r) => r.data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<Usuario>('/auth/me').then((r) => r.data),
}
