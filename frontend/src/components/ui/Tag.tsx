import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface Props {
  children: ReactNode
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  dot?: boolean
  className?: string
}

const VARIANTS: Record<NonNullable<Props['variant']>, string> = {
  neutral: 'bg-gray-100 text-gray-600',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-600',
  info: 'bg-blue-50 text-blue-700',
}

const DOTS: Record<NonNullable<Props['variant']>, string> = {
  neutral: 'bg-gray-400',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
}

/** Pastilla de estado — inspirada en el Tag de Ecme, con color semántico separado del acento de marca. */
export function Tag({ children, variant = 'neutral', dot = false, className }: Props) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold',
      VARIANTS[variant],
      className
    )}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', DOTS[variant])} />}
      {children}
    </span>
  )
}
