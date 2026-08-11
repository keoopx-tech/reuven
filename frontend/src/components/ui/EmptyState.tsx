import type { ReactNode } from 'react'

interface Props {
  icon: string
  title: string
  body: string
  actions?: ReactNode
}

export function EmptyState({ icon, title, body, actions }: Props) {
  return (
    <div className="text-center p-16 bg-surface border-2 border-dashed border-gray-200 rounded-3xl">
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="font-poppins text-xl font-extrabold text-navy mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{body}</p>
      {actions && <div className="flex flex-wrap gap-3 justify-center">{actions}</div>}
    </div>
  )
}
