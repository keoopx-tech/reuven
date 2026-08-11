import { useEffect, useState } from 'react'
import { TASK1_WORDS, WORDS } from '@/data/words'
import { speech } from '@/lib/utils/speech'
import { confetti } from '@/lib/utils/confetti'

interface Props { onCorrect: (item: string) => void; onWrong: (item: string) => void; onComplete: () => void }

const VOWEL_COLORS: Record<string,string> = { a:'#ef4444',e:'#eab308',i:'#3b82f6',o:'#22c55e',u:'#f97316' }

export default function Task1Vocales({ onCorrect, onWrong, onComplete }: Props) {
  const [idx, setIdx]        = useState(0)
  const [hit, setHit]        = useState<Set<string>>(new Set())
  const [wrong, setWrong]    = useState<string | null>(null)
  const [speaking, setSpeaking] = useState(false)

  const wordCfg = TASK1_WORDS[idx]
  const word    = WORDS[wordCfg.key]

  useEffect(() => { setHit(new Set()); speech.word(word.spoken) }, [idx])

  const speak = () => {
    setSpeaking(true)
    speech.word(word.spoken, () => setSpeaking(false))
  }

  const handleVowel = (btnRef: HTMLButtonElement, vowel: string) => {
    if (hit.has(vowel)) return
    if (wordCfg.correct.includes(vowel)) {
      const next = new Set(hit); next.add(vowel); setHit(next)
      onCorrect(word.name)
      speech.letter(vowel)
      confetti.burst(btnRef, 8)
      if (next.size === wordCfg.correct.length) {
        speech.word(word.spoken)
        setTimeout(() => {
          if (idx + 1 < TASK1_WORDS.length) setIdx(i => i + 1)
          else onComplete()
        }, 800)
      }
    } else {
      setWrong(vowel)
      onWrong(word.name)
      speech.letter(vowel)
      setTimeout(() => setWrong(null), 600)
    }
  }

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="text-center">
        <h2 className="font-poppins font-bold text-[#0f172a] text-2xl sm:text-3xl">🎨 Colorea las vocales</h2>
        <p className="text-gray-500 mt-2">Pulsa las vocales de la palabra que aparece en la imagen.</p>
      </div>

      <div className="flex gap-2.5">
        {TASK1_WORDS.map((_, i) => (
          <span key={i} className={`h-2.5 rounded-full transition-all ${
            i === idx ? 'w-8 bg-[#0f172a]' : i < idx ? 'w-2.5 bg-green-400' : 'w-2.5 bg-gray-200'
          }`} />
        ))}
      </div>

      <button onClick={speak}
        className={`w-64 h-64 sm:w-72 sm:h-72 bg-white border-2 rounded-3xl flex flex-col items-center justify-center shadow-lg transition-all hover:-translate-y-1 ${speaking ? 'border-yellow-400' : 'border-gray-100'}`}>
        {word.img
          ? <img src={word.img} alt={word.spoken} className="w-48 h-48 sm:w-56 sm:h-56 object-contain" />
          : <span className="text-8xl sm:text-9xl">{word.emoji}</span>}
        {speaking && <span className="text-xs text-yellow-600 font-bold mt-2 animate-pulse">🔊 Escuchando…</span>}
      </button>

      <p className="font-poppins font-extrabold text-[#0f172a] text-2xl sm:text-3xl tracking-[0.15em] lowercase">
        {word.name.toLowerCase()}
      </p>

      <button onClick={() => speech.syllables(word.syllables)}
        className="text-sm font-semibold text-[#4f46e5] border border-[#4f46e5] px-5 py-2 rounded-full hover:bg-indigo-50 transition-colors">
        🐢 Silabear
      </button>

      <div className="flex flex-wrap justify-center gap-4 pt-2">
        {wordCfg.vowels.map((v) => {
          const isHit   = hit.has(v)
          const isWrong = wrong === v
          return (
            <button
              key={v}
              ref={(el) => { if (!el) return }}
              onClick={(e) => handleVowel(e.currentTarget, v)}
              disabled={isHit}
              className={`w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full font-poppins font-bold text-2xl transition-all duration-200 ${
                isHit    ? 'text-white shadow-lg scale-110' :
                isWrong  ? 'bg-red-100 text-red-500 scale-95' :
                           'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:-translate-y-0.5'
              }`}
              style={isHit ? { background: VOWEL_COLORS[v] } : {}}
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}
