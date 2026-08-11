import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePerfilStore } from '@/lib/stores/perfilStore'
import { useAuthStore } from '@/lib/stores/authStore'
import { metricasApi } from '@/lib/api/metricas'
import { eventQueue } from '@/lib/utils/exerciseEvents'
import { sound } from '@/lib/utils/audio'
import { speech } from '@/lib/utils/speech'
import { confetti } from '@/lib/utils/confetti'

import Task1Vocales   from './Task1Vocales'
import Task2Escribir  from './Task2Escribir'
import Task3Huecos    from './Task3Huecos'
import Task4Ordenar   from './Task4Ordenar'
import Task5Silabas   from './Task5Silabas'
import Task6Sonido    from './Task6Sonido'
import Task7Unir      from './Task7Unir'
import Task8Colorear  from './Task8Colorear'

const TASKS = [
  { id:1, label:'Vocales',   icon:'🎨' },
  { id:2, label:'Escribir',  icon:'✏️' },
  { id:3, label:'Huecos',    icon:'🔤' },
  { id:4, label:'Ordenar',   icon:'🔀' },
  { id:5, label:'Sílabas',   icon:'🔢' },
  { id:6, label:'Sonido R',  icon:'👂' },
  { id:7, label:'Unir',      icon:'🧩' },
  { id:8, label:'Colorear',  icon:'🌈' },
]

const API_URL = (import.meta as { env: { VITE_API_URL?: string } }).env.VITE_API_URL ?? '/api'

interface TaskProps {
  onCorrect: (item: string) => void
  onWrong: (item: string) => void
  onComplete: () => void
}

const TASK_COMPONENTS: Record<number, (props: TaskProps) => JSX.Element> = {
  1: Task1Vocales, 2: Task2Escribir, 3: Task3Huecos,  4: Task4Ordenar,
  5: Task5Silabas, 6: Task6Sonido,   7: Task7Unir,     8: Task8Colorear,
}

export function ExerciseShell() {
  const perfilId   = usePerfilStore((s) => s.perfilActivoId)
  const token      = useAuthStore((s) => s.accessToken)
  const [current, setCurrent]   = useState(1)
  const [score, setScore]       = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [navOpen, setNavOpen]   = useState(false)
  const [celebration, setCelebration] = useState<string | null>(null)

  const flush = useCallback(async (events: Parameters<typeof metricasApi.batchEventos>[1]) => {
    if (!perfilId) return
    await metricasApi.batchEventos(perfilId, events)
  }, [perfilId])

  useEffect(() => {
    if (!perfilId) return
    eventQueue.startTask(perfilId, current)
    sound.click()
    return () => { speech.cancel() }
  }, [current, perfilId])

  // sendBeacon en unload
  useEffect(() => {
    if (!perfilId) return
    const handler = () => eventQueue.flushOnUnload(perfilId, API_URL, token)
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [perfilId, token])

  const handleCorrect = useCallback((item: string) => {
    if (!perfilId) return
    setScore((s) => s + 10)
    eventQueue.recordAttempt(perfilId, current, true, item)
    sound.correct()
  }, [perfilId, current])

  const handleWrong = useCallback((item: string) => {
    if (!perfilId) return
    setScore((s) => Math.max(0, s - 2))
    eventQueue.recordAttempt(perfilId, current, false, item)
    sound.wrong()
  }, [perfilId, current])

  const handleComplete = useCallback(() => {
    if (!perfilId) return
    setCompleted((prev) => {
      const next = new Set(prev); next.add(current); return next
    })
    eventQueue.endTask(perfilId, current, true, flush)
    sound.correct()
    speech.praise(true)
    const msg = completed.size + 1 >= 8
      ? `¡Felicitaciones! 🎉 Completaste las 8 actividades · ⭐ ${score + 10} puntos`
      : `¡Actividad ${current} completada! 🎯`
    setCelebration(msg)
    if (completed.size + 1 >= 8) confetti.rain(60)
    setTimeout(() => {
      setCelebration(null)
      if (current < 8) setCurrent((c) => c + 1)
    }, 2500)
  }, [perfilId, current, completed, score, flush])

  const goTo = (id: number) => {
    if (!perfilId) return
    eventQueue.endTask(perfilId, current, false, flush)
    setCurrent(id)
    setNavOpen(false)
  }

  const TaskComp = TASK_COMPONENTS[current]

  return (
    <div className="min-h-screen bg-bg font-poppins flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
        <Link to="/perfiles" className="flex items-center gap-2 no-underline mr-2">
          <span className="w-9 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-xs"
            style={{ background:'linear-gradient(135deg,#4f46e5,#0f172a)', letterSpacing:'-0.02em' }}>RF</span>
          <span className="font-poppins font-bold text-[#0f172a] text-base hidden sm:block">Reuven</span>
        </Link>

        {/* NAV toggle — solo móvil, en escritorio la lista vive en el sidebar */}
        <button onClick={() => setNavOpen(!navOpen)}
          className="lg:hidden flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-1.5 text-sm font-semibold text-[#0f172a] flex-1 max-w-xs">
          <span className="flex flex-col gap-0.5 w-4">
            {[0,1,2].map(i => <span key={i} className="block h-0.5 bg-current rounded" />)}
          </span>
          <span>{current}. {TASKS[current-1].label}</span>
          <span className="ml-auto text-gray-400 text-xs">{completed.size}/{8}</span>
        </button>

        <span className="hidden lg:block font-poppins font-extrabold text-[#0f172a] text-lg">
          {TASKS[current-1].icon} {current}. {TASKS[current-1].label}
        </span>

        <div className="flex items-center gap-2 ml-auto">
          <span className="bg-green-50 border border-green-200 text-green-700 font-bold text-sm px-3 py-1 rounded-full">
            ⭐ {score}
          </span>
          <span className="bg-green-50 border border-green-200 text-green-700 font-bold text-sm px-3 py-1 rounded-full">
            🎯 {completed.size}/8
          </span>
        </div>
      </header>

      {/* TASK NAV — dropdown móvil */}
      {navOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-w-4xl mx-auto">
            {TASKS.map((t) => (
              <button key={t.id} onClick={() => goTo(t.id)}
                className={`relative flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all ${
                  t.id === current ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}>
                {completed.has(t.id) && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">✓</span>
                )}
                <span className="text-base">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* SIDEBAR — lista de actividades, persistente en escritorio */}
        <aside className="hidden lg:flex w-72 flex-shrink-0 bg-surface border-r border-gray-100 p-4 flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 px-2">
            Actividades <span className="text-green-600">({completed.size}/8)</span>
          </p>
          {TASKS.map((t) => (
            <button key={t.id} onClick={() => goTo(t.id)}
              className={`relative flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all ${
                t.id === current ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-bg border border-transparent'
              }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                t.id === current ? 'bg-white shadow-sm' : 'bg-bg'
              }`}>
                {t.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#0f172a] text-sm truncate">{t.id}. {t.label}</p>
              </div>
              {completed.has(t.id) && (
                <span className="w-5 h-5 bg-green-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0">✓</span>
              )}
            </button>
          ))}
        </aside>

        {/* TASK CONTENT */}
        <main className="flex-1 overflow-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto">
            {perfilId ? (
              <div className="relative bg-white border border-gray-100 rounded-3xl shadow-card p-6 sm:p-10 overflow-hidden">
                {/* Decoración de fondo, misma familia visual del resto del sitio */}
                <div className="absolute inset-0 -z-0 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 15% 10%, rgba(79,70,229,0.06), transparent 45%), radial-gradient(circle at 90% 90%, rgba(249,115,22,0.06), transparent 45%)' }} />
                <div className="relative">
                  <TaskComp onCorrect={handleCorrect} onWrong={handleWrong} onComplete={handleComplete} />
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p>Sin perfil activo. <Link to="/perfiles" className="text-[#4f46e5] font-bold">Vuelve a elegir perfil.</Link></p>
              </div>
            )}

            {/* Navegación anterior/siguiente, bajo la tarjeta */}
            <div className="flex justify-between items-center mt-6">
              <button onClick={() => current > 1 && goTo(current - 1)}
                disabled={current <= 1}
                className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm text-gray-500 disabled:opacity-30 hover:border-gray-300 transition-all">
                ← Anterior
              </button>
              <span className="text-sm text-gray-400 font-semibold">{current} / 8</span>
              <button onClick={() => current < 8 && goTo(current + 1)}
                disabled={current >= 8}
                className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm text-gray-500 disabled:opacity-30 hover:border-gray-300 transition-all">
                Siguiente →
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* CELEBRATION */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl px-8 py-6 text-center max-w-sm mx-4 animate-bounce">
            <p className="font-poppins font-bold text-[#0f172a] text-xl" dangerouslySetInnerHTML={{ __html: celebration }} />
          </div>
        </div>
      )}
    </div>
  )
}
