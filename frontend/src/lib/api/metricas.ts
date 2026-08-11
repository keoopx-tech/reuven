import api from './client'
import type {
  ActividadMetrica,
  EventoIn,
  ResumenMetricas,
  SerieTemporalItem,
  SesionItem,
} from '@/types/api'

export const metricasApi = {
  batchEventos: (perfil_id: string, eventos: EventoIn[]) =>
    api
      .post<{ insertados: number; descartados: number }>(`/metricas/eventos/${perfil_id}`, { eventos })
      .then((r) => r.data),

  resumen: (perfil_id: string) =>
    api.get<ResumenMetricas>(`/metricas/${perfil_id}/resumen`).then((r) => r.data),

  porActividad: (perfil_id: string) =>
    api.get<ActividadMetrica[]>(`/metricas/${perfil_id}/por-actividad`).then((r) => r.data),

  serieTemporal: (perfil_id: string, dias = 14) =>
    api
      .get<SerieTemporalItem[]>(`/metricas/${perfil_id}/serie-temporal`, { params: { dias } })
      .then((r) => r.data),

  sesiones: (perfil_id: string, limite = 20) =>
    api
      .get<SesionItem[]>(`/metricas/${perfil_id}/sesiones`, { params: { limite } })
      .then((r) => r.data),
}
