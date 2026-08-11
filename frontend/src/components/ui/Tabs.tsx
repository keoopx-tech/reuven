import { useState, type ReactNode } from 'react'
import { clsx } from 'clsx'

interface TabDef {
  key: string
  label: string
  icon?: string
  content: ReactNode
}

interface Props {
  tabs: TabDef[]
  defaultTab?: string
}

/** Panel con pestañas — inspirado en el patrón "Billing / Activity" de Ecme. */
export function Tabs({ tabs, defaultTab }: Props) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key)
  const current = tabs.find((t) => t.key === active) ?? tabs[0]

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-gray-100 mb-5 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={clsx(
              'relative px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors',
              t.key === active ? 'text-brand' : 'text-gray-500 hover:text-navy'
            )}
          >
            {t.icon && <span className="mr-1.5">{t.icon}</span>}
            {t.label}
            {t.key === active && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand rounded-full" />
            )}
          </button>
        ))}
      </div>
      {current?.content}
    </div>
  )
}
