export type Rol = 'tutor' | 'profesional' | 'admin'

export interface Usuario {
  id: string
  email: string
  nombre: string
  rol: Rol
  profesion?: string
  centro?: string
  colegiado?: string
  relacion?: string
  creado_en: string
}

export interface Perfil {
  id: string
  nombre: string
  emoji: string
  es_nino: boolean
  fecha_nacimiento?: string
  idioma_materno: string
  creado_en: string
}

export interface Codigo {
  code: string          // XXXX-XXXX
  perfil_id: string
  usado: boolean
  expira_en: string
  creado_en: string
}

export interface ResumenMetricas {
  perfil_id: string
  aciertos: number
  fallidos: number
  completadas: number
  tiempo_ms: number
  tasa_acierto: number
}

export interface ActividadMetrica {
  task_num: number
  nombre: string
  color: string
  aciertos: number
  fallidos: number
  tiempo_ms: number
  sesiones: number
  completadas: number
}

export interface SerieTemporalItem {
  fecha: string
  aciertos: number
  fallidos: number
}

export interface SesionItem {
  ts: string
  task_num: number
  nombre: string
  duracion_ms: number
  aciertos: number
  fallidos: number
  completada: boolean
}

export interface EventoIn {
  perfil_id: string
  task_num: number
  tipo: 'task_start' | 'task_end' | 'attempt_ok' | 'attempt_fail'
  ts: string
  payload?: Record<string, unknown>
}

export interface TokenResponse {
  access_token: string
  token_type: string
}
