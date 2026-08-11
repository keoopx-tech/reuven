/**
 * Cola local de eventos de ejercicio.
 * Acumula en sessionStorage y hace flush al API en task_end.
 * Replica el comportamiento de metrics.js para la transición a backend real.
 */
import type { EventoIn } from '@/types/api'

const KEY_QUEUE   = 'reuven_event_queue'
const KEY_STARTS  = 'reuven_task_starts'

function readQueue(): EventoIn[] {
  try { return JSON.parse(sessionStorage.getItem(KEY_QUEUE) ?? '[]') } catch { return [] }
}
function writeQueue(q: EventoIn[]) {
  try { sessionStorage.setItem(KEY_QUEUE, JSON.stringify(q)) } catch {}
}
function readStarts(): Record<number, number> {
  try { return JSON.parse(sessionStorage.getItem(KEY_STARTS) ?? '{}') } catch { return {} }
}
function writeStarts(s: Record<number, number>) {
  try { sessionStorage.setItem(KEY_STARTS, JSON.stringify(s)) } catch {}
}

export const eventQueue = {
  startTask(perfilId: string, taskNum: number) {
    const starts = readStarts()
    starts[taskNum] = Date.now()
    writeStarts(starts)
    const q = readQueue()
    q.push({ perfil_id: perfilId, task_num: taskNum, tipo: 'task_start', ts: new Date().toISOString() })
    writeQueue(q)
  },

  recordAttempt(perfilId: string, taskNum: number, correcto: boolean, item?: string) {
    const q = readQueue()
    q.push({
      perfil_id: perfilId,
      task_num: taskNum,
      tipo: correcto ? 'attempt_ok' : 'attempt_fail',
      ts: new Date().toISOString(),
      payload: item ? { item } : undefined,
    })
    writeQueue(q)
  },

  endTask(perfilId: string, taskNum: number, completada: boolean, flush: (events: EventoIn[]) => Promise<void>) {
    const starts = readStarts()
    const startTs = starts[taskNum] ?? Date.now()
    const duracionMs = Date.now() - startTs
    delete starts[taskNum]
    writeStarts(starts)

    const q = readQueue()
    q.push({
      perfil_id: perfilId,
      task_num: taskNum,
      tipo: 'task_end',
      ts: new Date().toISOString(),
      payload: { completada, duracionMs },
    })
    writeQueue([])  // vaciamos la cola

    // Flush asíncrono con retry exponencial
    const MAX_RETRIES = 3
    const tryFlush = async (attempt: number) => {
      try {
        await flush(q)
      } catch {
        if (attempt < MAX_RETRIES) {
          setTimeout(() => tryFlush(attempt + 1), Math.pow(2, attempt) * 1000)
        }
      }
    }
    tryFlush(1)
  },

  /** Flush de emergencia en unload (usa sendBeacon si disponible) */
  flushOnUnload(perfilId: string, apiUrl: string, token: string | null) {
    const q = readQueue()
    if (!q.length) return
    const body = JSON.stringify({ eventos: q })
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon(`${apiUrl}/metricas/eventos/${perfilId}`, blob)
    } else {
      fetch(`${apiUrl}/metricas/eventos/${perfilId}`, {
        method: 'POST', body, headers, keepalive: true,
      }).catch(() => {})
    }
    writeQueue([])
  },
}
