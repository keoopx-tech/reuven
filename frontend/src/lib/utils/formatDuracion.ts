/** Puerto exacto de metrics.js:formatDuracion() */
export function formatDuracion(ms: number): string {
  if (!ms || ms < 1000) return '0s'
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const rs = s % 60
  if (m < 60) return `${m}min ${rs ? rs + 's' : ''}`.trim()
  const h = Math.floor(m / 60)
  const rm = m % 60
  return `${h}h ${rm ? rm + 'min' : ''}`.trim()
}
