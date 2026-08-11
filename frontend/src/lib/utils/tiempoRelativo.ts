/** Formatea una fecha ISO como tiempo relativo en español ("hace 5 min", "hace 2 h", "ayer"). */
export function tiempoRelativo(iso: string): string {
  const ts = new Date(iso).getTime()
  const diffMs = Date.now() - ts
  const minutos = Math.floor(diffMs / 60000)

  if (minutos < 1) return 'ahora mismo'
  if (minutos < 60) return `hace ${minutos} min`

  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `hace ${horas} h`

  const dias = Math.floor(horas / 24)
  if (dias === 1) return 'ayer'
  if (dias < 7) return `hace ${dias} días`

  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}
