import { useEffect, useState } from 'react'
import { TASK7_PAIRS, WORDS } from '@/data/words'
import { speech } from '@/lib/utils/speech'

interface Props { onCorrect: (item: string) => void; onWrong: (item: string) => void; onComplete: () => void }

export default function Task7Unir({ onCorrect, onWrong, onComplete }: Props) {
  const [idx, setIdx]     = useState(0)
  const [slots, setSlots] = useState<[string,string]>(['',''])
  const [state, setState] = useState<'idle'|'ok'|'wrong'>('idle')

  const pair = TASK7_PAIRS[idx]
  const word = WORDS[pair.key]
  const hasTwoSylls = !!pair.s2

  const syllables = hasTwoSylls
    ? [...new Set([...word.syllables, pair.s1, pair.s2].slice(0,6))]
    : [...new Set([...word.syllables, pair.s1].slice(0,4))]

  useEffect(() => {
    setSlots(['','']); setState('idle'); speech.word(word.spoken)
  }, [idx])

  const place = (syll: string, slot: 0|1) => {
    if (state !== 'idle') return
    const ns: [string,string] = [...slots] as [string,string]
    ns[slot] = syll
    setSlots(ns)
    const check = hasTwoSylls
      ? ns[0] === pair.s1 && ns[1] === pair.s2
      : ns[0] === pair.s1
    if (ns[0] && (!hasTwoSylls || ns[1])) {
      if (check) {
        setState('ok')
        onCorrect(word.name)
        speech.word(word.spoken)
        setTimeout(() => {
          if (idx + 1 < TASK7_PAIRS.length) setIdx(i => i + 1)
          else onComplete()
        }, 800)
      } else {
        setState('wrong')
        onWrong(word.name)
        setTimeout(() => { setSlots(['','']); setState('idle') }, 800)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-poppins font-bold text-[#0f172a] text-2xl text-center">🧩 Forma la palabra</h2>
      <p className="text-gray-500 text-center">Arrastra o pulsa las sílabas en el orden correcto.</p>

      <button onClick={() => speech.word(word.spoken)} className="w-36 h-36 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-center shadow-card">
        {word.img ? <img src={word.img} alt={word.spoken} className="w-28 h-28 object-contain" /> : <span className="text-6xl">{word.emoji}</span>}
      </button>

      {/* Slots */}
      <div className="flex gap-3">
        {[0, ...(hasTwoSylls ? [1] : [])].map(si => (
          <button key={si} onClick={() => setSlots(s => { const n: [string,string]=[...s] as [string,string]; n[si]=''; return n })}
            className={`min-w-[60px] px-4 py-3 rounded-xl border-2 font-poppins font-bold text-xl transition-all ${
              state === 'ok'    ? 'border-green-400 bg-green-50 text-green-600' :
              state === 'wrong' ? 'border-red-400 bg-red-50 text-red-500' :
              slots[si]         ? 'border-[#4f46e5] bg-red-50 text-[#4f46e5]' :
                                  'border-dashed border-gray-300 text-gray-300'
            }`}>
            {slots[si] || (si === 0 ? '1ª' : '2ª')}
          </button>
        ))}
      </div>

      {/* Syllable tiles */}
      <div className="flex flex-wrap justify-center gap-3">
        {syllables.map(s => (
          <button key={s} onClick={() => place(s, !slots[0] ? 0 : 1)}
            disabled={state !== 'idle'}
            className="px-5 py-2.5 bg-white border-2 border-gray-100 rounded-xl font-poppins font-bold text-lg text-[#0f172a] shadow-card hover:border-[#4f46e5] hover:-translate-y-0.5 transition-all disabled:opacity-40">
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
