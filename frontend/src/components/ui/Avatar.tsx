import { clsx } from 'clsx'

interface Props {
  emoji?: string
  src?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  bg?: string
  ring?: boolean
  className?: string
}

const SIZES: Record<NonNullable<Props['size']>, string> = {
  sm: 'w-8 h-8 text-base',
  md: 'w-10 h-10 text-xl',
  lg: 'w-14 h-14 text-2xl',
  xl: 'w-20 h-20 text-4xl',
}

/** Avatar circular — imagen o emoji, con degradado de fondo opcional. Inspirado en el Avatar de Ecme. */
export function Avatar({ emoji, src, size = 'md', bg, ring = false, className }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden',
        SIZES[size],
        ring && 'ring-2 ring-white shadow-sm',
        className
      )}
      style={{ background: bg ?? '#f1f5f9' }}
    >
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <span aria-hidden>{emoji}</span>
      )}
    </span>
  )
}
