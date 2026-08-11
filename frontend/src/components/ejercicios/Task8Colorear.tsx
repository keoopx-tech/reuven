import { useEffect, useState } from 'react'
import { TASK8_TARGETS, WORDS } from '@/data/words'
import { speech } from '@/lib/utils/speech'
import { confetti } from '@/lib/utils/confetti'

interface Props { onCorrect: (item: string) => void; onWrong: (item: string) => void; onComplete: () => void }

const COLORS = ['#ef4444','#eab308','#3b82f6','#22c55e','#f97316','#ec4899','#a855f7','#0d9488']

export default function Task8Colorear({ onCorrect, onWrong, onComplete }: Props) {
  const [idx, setIdx]      = useState(0)
  const [colored, setColored] = useState<Set<string>>(new Set())
  const [wrongs, setWrongs]   = useState<Set<string>>(new Set())

  const target = TASK8_TARGETS[idx]
  const word   = WORDS[target.key]

  useEffect(() => { setColored(new Set()); setWrongs(new Set()); speech.word(word.spoken) }, [idx])

  const handleSyll = (el: HTMLButtonElement, syll: string, colorIdx: number): void => {
    void colorIdx
    if (colored.has(syll)) return
    if (target.correct.includes(syll)) {
      const n = new Set(colored); n.add(syll); setColored(n)
      onCorrect(word.name)
      confetti.burst(el, 8)
      speech.syllables([syll])
      if (n.size === target.correct.length) {
        speech.word(word.spoken)
        setTimeout(() => {
          if (idx + 1 < TASK8_TARGETS.length) setIdx(i => i + 1)
          else onComplete()
        }, 800)
      }
    } else {
      setWrongs(prev => new Set([...prev, syll]))
      onWrong(word.name)
      setTimeout(() => setWrongs(prev => { const n = new Set(prev); n.delete(syll); return n }), 600)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-poppins font-bold text-[#0f172a] text-2xl text-center">🌈 Colorea las sílabas</h2>
      <p className="text-gray-500 text-center">Pulsa las sílabas correctas para colorearlas.</p>

      <button onClick={() => speech.word(word.spoken)} className="w-36 h-36 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-center shadow-card">
        {word.img ? <img src={word.img} alt={word.spoken} className="w-28 h-28 object-contain" /> : <span className="text-6xl">{word.emoji}</span>}
      </button>

      <p className="font-poppins font-extrabold text-[#0f172a] text-xl tracking-widest">{word.name.toLowerCase()}</p>

      <div className="flex flex-wrap justify-center gap-4">
        {word.syllables.map((s, i) => {
          const isColored = colored.has(s)
          const isWrong   = wrongs.has(s)
          return (
            <button key={s + i}
              ref={(el) => { if (!el) return }}
              onClick={(e) => handleSyll(e.currentTarget, s, i)}
              disabled={isColored}
              className={`px-6 py-3 rounded-2xl font-poppins font-bold text-xl border-2 transition-all duration-200 ${
                isColored ? 'text-white border-transparent shadow-lg scale-105' :
                isWrong   ? 'bg-red-50 border-red-300 text-red-500 scale-95' :
                            'bg-white border-gray-100 text-[#0f172a] hover:-translate-y-0.5 shadow-card'
              }`}
              style={isColored ? { background: COLORS[i % COLORS.length] } : {}}>
              {s}
            </button>
          )
        })}
      </div>
    </div>
  )
}
