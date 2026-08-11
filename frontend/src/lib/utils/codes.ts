/** Puerto de auth.js:normalizeCode() — misma lógica que backend/app/core/codes.py */
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function normalizeCode(raw: string): string {
  const clean = raw
    .toUpperCase()
    .split('')
    .filter((c) => CODE_CHARS.includes(c))
    .join('')
  if (clean.length !== 8) throw new Error('Código inválido')
  return `${clean.slice(0, 4)}-${clean.slice(4)}`
}

/** Formatea mientras el usuario escribe en el input */
export function formatCodeInput(raw: string): string {
  const clean = raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8)
  return clean.length > 4 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : clean
}
