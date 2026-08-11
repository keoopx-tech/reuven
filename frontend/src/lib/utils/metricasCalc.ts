import type { SerieTemporalItem } from '@/types/api'

/** Compara la tasa de acierto de los últimos 7 días contra los 7 anteriores (puntos porcentuales). */
export function calcularVariacion(serie: SerieTemporalItem[]): number | undefined {
  if (serie.length < 14) return undefined
  const tasaDe = (dias: SerieTemporalItem[]) => {
    const aciertos = dias.reduce((s, d) => s + d.aciertos, 0)
    const fallidos = dias.reduce((s, d) => s + d.fallidos, 0)
    const total = aciertos + fallidos
    return total > 0 ? (aciertos / total) * 100 : null
  }
  const anterior = tasaDe(serie.slice(0, 7))
  const actual = tasaDe(serie.slice(7, 14))
  if (anterior === null || actual === null) return undefined
  return Math.round(actual - anterior)
}
