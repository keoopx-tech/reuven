import type { ReactNode } from 'react'
import { useInView } from '@/lib/hooks/useInView'

interface Props {
  children: ReactNode
  className?: string
  id?: string
  /** Retraso en ms — útil para escalonar tarjetas dentro de una grilla. */
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
}

const HIDDEN_TRANSFORM: Record<NonNullable<Props['direction']>, string> = {
  up: 'translate-y-6',
  left: 'translate-x-6',
  right: '-translate-x-6',
  none: '',
}

/**
 * Envuelve una sección o tarjeta y la revela con una transición suave
 * (fade + slide) la primera vez que entra en el viewport al hacer scroll.
 * Respeta `prefers-reduced-motion`: si el usuario lo pide, se muestra sin animar.
 */
export function Reveal({ children, className = '', id, delay = 0, direction = 'up' }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    return <div id={id} className={className}>{children}</div>
  }

  return (
    <div
      ref={ref}
      id={id}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${HIDDEN_TRANSFORM[direction]}`
      } ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  )
}
