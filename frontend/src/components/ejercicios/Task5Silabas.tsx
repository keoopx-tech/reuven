import { useEffect, useState } from 'react'
import { TASK5_KEYS, WORDS } from '@/data/words'
import { speech } from '@/lib/utils/speech'
import { confetti } from '@/lib/utils/confetti'

interface Props { onCorrect: (item: string) => void; onWrong: (item: string) => void; onComplete: () => void }

export default function Task5Silabas({ onCorrect, onWrong, onComplete }: Props) {
  const [idx, setIdx]      = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)

  const key    = TASK5_KEYS[idx]
  const word   = WORDS[key]
  const correct = word.syllables.length

  useEffect(() => { setChosen(null); speech.word(word.spoken) }, [idx])

  const handle = (n: number, el: HTMLButtonElement) => {
    if (chosen !== null) return
    setChosen(n)
    if (n === correct) {
      onCorrect(word.name)
      confetti.burst(el, 10)
      speech.praise(false)
      setTimeout(() => {
        if (idx + 1 < TASK5_KEYS.length) setIdx(i => i + 1)
        else onComplete()
      }, 900)
    } else {
      onWrong(word.name)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-poppins font-bold text-[#0f172a] text-2xl text-center">🔢 ¿Cuántas sílabas?</h2>
      <p className="text-gray-500 text-center">Pulsa el número correcto de sílabas.</p>

      <button onClick={() => speech.word(word.spoken)} className="w-40 h-40 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-center shadow-card">
        {word.img ? <img src={word.img} alt={word.spoken} className="w-32 h-32 object-contain" /> : <span className="text-7xl">{word.emoji}</span>}
      </button>

      <p className="font-poppins font-extrabold text-[#0f172a] text-xl tracking-widest">{word.name.toLowerCase()}</p>
      <button onClick={() => speech.syllables(word.syllables)} className="text-sm font-semibold text-[#4f46e5] border border-[#4f46e5] px-4 py-1.5 rounded-full hover:bg-red-50 transition-colors">
        🐢 Silabear
      </button>

      <div className="flex gap-4">
        {[1,2,3,4].map(n => {
          const isCorrect = chosen !== null && n === correct
          const isWrong   = chosen === n && n !== correct
          return (
            <button key={n}
              ref={(el) => { if (!el) return }}
              onClick={(e) => handle(n, e.currentTarget)}
              disabled={chosen !== null}
              className={`w-16 h-16 rounded-2xl font-poppins font-bold text-2xl transition-all duration-200 ${
                isCorrect ? 'bg-green-500 text-white scale-110 shadow-lg' :
                isWrong   ? 'bg-red-100 text-red-500' :
                chosen !== null ? 'bg-gray-100 text-gray-400' :
                'bg-white border-2 border-gray-100 text-[#0f172a] hover:-translate-y-0.5 shadow-card hover:border-[#4f46e5]'
              }`}>
              {n}
            </button>
          )
        })}
      </div>
    </div>
  )
}
