import { type HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface Props extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

export function Card({ padding = 'md', className, children, ...rest }: Props) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
  return (
    <div
      className={clsx(
        'bg-surface border border-gray-100 rounded-3xl shadow-card',
        paddings[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
