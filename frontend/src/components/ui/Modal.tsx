import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md'
}

export function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative bg-surface rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200',
          size === 'sm' ? 'max-w-sm w-full' : 'max-w-md w-full'
        )}
      >
        <h2 id="modal-title" className="font-poppins text-xl font-extrabold text-navy mb-1">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body
  )
}
