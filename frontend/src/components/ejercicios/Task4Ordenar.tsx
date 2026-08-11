import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TASK4_KEYS, WORDS } from '@/data/words'
import { speech } from '@/lib/utils/speech'

interface Props { onCorrect: (item: string) => void; onWrong: (item: string) => void; onComplete: () => void }

const DRAG_THRESHOLD = 8 // px de movimiento antes de considerarlo un arrastre real (vs. un toque)

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Task4Ordenar({ onCorrect, onWrong, onComplete }: Props) {
  const [idx, setIdx]     = useState(0)
  const [letters, setLetters] = useState<{id:number,c:string}[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone]   = useState(false)

  // Estado de arrastre
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const dragStart = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const rowRef = useRef<HTMLDivElement>(null)

  // Animación FLIP: recuerda la posición de cada letra antes del intercambio
  // para poder animar el movimiento hasta su nuevo lugar.
  const tileRefs = useRef<Map<number, HTMLButtonElement>>(new Map())
  const flipSnapshot = useRef<Map<number, DOMRect> | null>(null)

  const captureRects = (): Map<number, DOMRect> => {
    const map = new Map<number, DOMRect>()
    tileRefs.current.forEach((el, id) => map.set(id, el.getBoundingClientRect()))
    return map
  }

  useLayoutEffect(() => {
    const prev = flipSnapshot.current
    if (!prev) return
    flipSnapshot.current = null
    tileRefs.current.forEach((el, id) => {
      const before = prev.get(id)
      if (!before) return
      const after = el.getBoundingClientRect()
      const dx = before.left - after.left
      const dy = before.top - after.top
      if (dx === 0 && dy === 0) return
      el.style.transition = 'none'
      el.style.transform = `translate(${dx}px, ${dy}px)`
      el.getBoundingClientRect() // fuerza el reflow antes de animar
      requestAnimationFrame(() => {
        el.style.transition = 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)'
        el.style.transform = ''
      })
    })
  }, [letters])

  const key  = TASK4_KEYS[idx]
  const word = WORDS[key]

  useEffect(() => {
    const arr = [...word.name].map((c,i) => ({ id:i, c }))
    setLetters(shuffle(arr))
    setSelected(null)
    setDone(false)
    speech.word(word.spoken)
  }, [idx])

  const swap = (aIdx: number, bIdx: number) => {
    flipSnapshot.current = captureRects()
    const next = [...letters]
    ;[next[aIdx], next[bIdx]] = [next[bIdx], next[aIdx]]
    setLetters(next)
    const current = next.map(l=>l.c).join('')
    if (current === word.name) {
      setDone(true)
      onCorrect(word.name)
      speech.word(word.spoken)
      setTimeout(() => {
        if (idx + 1 < TASK4_KEYS.length) setIdx(i => i + 1)
        else onComplete()
      }, 800)
    } else {
      onWrong(word.name)
    }
  }

  const handleClick = (i: number) => {
    if (done) return
    if (selected === null) {
      setSelected(i)
    } else {
      if (selected !== i) swap(selected, i)
      setSelected(null)
    }
  }

  // ── Arrastre con Pointer Events (mouse, touch y stylus en un solo modelo) ──
  const findSlotUnder = (clientX: number, clientY: number): number | null => {
    const el = document.elementFromPoint(clientX, clientY)
    const slot = el?.closest<HTMLElement>('[data-letter-index]')
    if (!slot) return null
    return Number(slot.dataset.letterIndex)
  }

  const handlePointerDown = (e: React.PointerEvent, i: number) => {
    if (done) return
    dragStart.current = { x: e.clientX, y: e.clientY }
    isDragging.current = false
    setDragIdx(i)
    setDragPos({ x: 0, y: 0 })
  }

  useEffect(() => {
    if (dragIdx === null) return

    const handleMove = (e: PointerEvent) => {
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      if (!isDragging.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        isDragging.current = true
      }
      if (isDragging.current) {
        setDragPos({ x: dx, y: dy })
        setOverIdx(findSlotUnder(e.clientX, e.clientY))
      }
    }

    const handleUp = (e: PointerEvent) => {
      if (isDragging.current) {
        const target = findSlotUnder(e.clientX, e.clientY)
        if (target !== null && target !== dragIdx) swap(dragIdx, target)
      } else {
        // Sin movimiento significativo → se comporta como un toque de selección
        handleClick(dragIdx)
      }
      setDragIdx(null)
      setOverIdx(null)
      setDragPos({ x: 0, y: 0 })
      isDragging.current = false
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragIdx, letters])

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="text-center">
        <h2 className="font-poppins font-bold text-[#0f172a] text-2xl sm:text-3xl">🔀 Ordena las letras</h2>
        <p className="text-gray-500 mt-2">Arrastra las letras — o tócalas de a dos — hasta formar la palabra.</p>
      </div>

      <button onClick={() => speech.word(word.spoken)}
        className="w-48 h-48 sm:w-56 sm:h-56 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-center shadow-lg hover:-translate-y-1 transition-all">
        {word.img ? <img src={word.img} alt={word.spoken} className="w-36 h-36 sm:w-44 sm:h-44 object-contain" /> : <span className="text-7xl sm:text-8xl">{word.emoji}</span>}
      </button>

      <div ref={rowRef} className="flex gap-3 flex-wrap justify-center touch-none">
        {letters.map((l, i) => {
          const isDragged = dragIdx === i && isDragging.current
          const isOver = overIdx === i && dragIdx !== null && dragIdx !== i
          return (
            <button
              key={l.id}
              ref={(el) => { if (el) tileRefs.current.set(l.id, el); else tileRefs.current.delete(l.id) }}
              data-letter-index={i}
              onPointerDown={(e) => handlePointerDown(e, i)}
              style={
                isDragged
                  ? { transform: `translate(${dragPos.x}px, ${dragPos.y}px) scale(1.15)`, zIndex: 50, touchAction: 'none' }
                  : { touchAction: 'none' }
              }
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-poppins font-bold text-2xl transition-shadow duration-150 select-none cursor-grab active:cursor-grabbing ${
                done          ? 'bg-green-100 text-green-700 scale-105' :
                isDragged     ? 'bg-white text-[#0f172a] shadow-2xl border-2 border-[#4f46e5]' :
                isOver        ? 'bg-indigo-50 text-[#4f46e5] border-2 border-[#4f46e5] border-dashed scale-105' :
                selected === i ? 'bg-[#4f46e5] text-white shadow-lg scale-110' :
                                'bg-white border-2 border-gray-100 text-[#0f172a] hover:border-[#4f46e5] hover:-translate-y-0.5 shadow-card'
              }`}>
              {l.c}
            </button>
          )
        })}
      </div>

      {done && <p className="text-green-600 font-bold text-lg animate-bounce">¡Correcto! 🎉</p>}
    </div>
  )
}
