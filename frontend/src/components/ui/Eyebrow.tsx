import type { ReactNode } from 'react'

/** Etiqueta pequeña que antecede a un título de sección (patrón consistente en todo el sitio). */
export function Eyebrow({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
      <span className="h-px w-8 bg-gray-300" />
      <span className="text-gray-400 tracking-widest text-xs font-semibold uppercase">{children}</span>
    </div>
  )
}
