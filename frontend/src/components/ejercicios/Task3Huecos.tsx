import { useEffect, useState } from 'react'
import { TASK3_KEYS, WORDS, vowelsInWord } from '@/data/words'
import { speech } from '@/lib/utils/speech'

interface Props { onCorrect: (item: string) => void; onWrong: (item: string) => void; onComplete: () => void }

export default function Task3Huecos({ onCorrect, onWrong, onComplete }: Props) {
  const [idx, setIdx]   = useState(0)
  const [vals, setVals] = useState<string[]>([])
  const [states, setStates] = useState<('idle'|'ok'|'wrong')[]>([])

  const key  = TASK3_KEYS[idx]
  const word = WORDS[key]
  const vows = vowelsInWord(word.name)

  useEffect(() => {
    setVals(vows.map(() => ''))
    setStates(vows.map(() => 'idle'))
    speech.word(word.spoken)
  }, [idx])

  const check = (slotIdx: number, val: string) => {
    const expected = vows[slotIdx]
    if (val.toLowerCase() === expected.toLowerCase()) {
      const ns = [...states]; ns[slotIdx] = 'ok'; setStates(ns)
      onCorrect(word.name)
      if (ns.every(s => s === 'ok')) {
        setTimeout(() => {
          if (idx + 1 < TASK3_KEYS.length) setIdx(i => i + 1)
          else onComplete()
        }, 600)
      }
    } else {
      const ns = [...states]; ns[slotIdx] = 'wrong'; setStates(ns)
      onWrong(word.name)
      setTimeout(() => { const nn = [...ns]; nn[slotIdx] = 'idle'; setStates(nn) }, 700)
    }
  }

  let vowelIdx = -1
  const letters = [...word.name].map((c,i) => ({ c, i, isVowel: /[AEIOUÁÉÍÓÚ]/i.test(c) }))

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-poppins font-bold text-[#0f172a] text-2xl text-center">🔤 Rellena los huecos</h2>
      <p className="text-gray-500 text-center">Escribe la vocal que falta en cada hueco.</p>

      <button onClick={() => speech.word(word.spoken)} className="w-36 h-36 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-center shadow-card">
        {word.img ? <img src={word.img} alt={word.spoken} className="w-28 h-28 object-contain" /> : <span className="text-6xl">{word.emoji}</span>}
      </button>

      <div className="flex gap-2 flex-wrap justify-center items-end">
        {letters.map(({ c, i, isVowel }) => {
          if (isVowel) {
            vowelIdx++
            const vi = vowelIdx
            const st = states[vi]
            return (
              <input key={i} maxLength={1}
                value={vals[vi] || ''}
                onChange={(e) => {
                  const v = [...vals]; v[vi] = e.target.value; setVals(v)
                  if (e.target.value.length === 1) check(vi, e.target.value)
                }}
                className={`w-10 h-10 text-center border-b-2 bg-transparent font-poppins font-bold text-xl outline-none transition-all ${
                  st === 'ok' ? 'border-green-400 text-green-600' :
                  st === 'wrong' ? 'border-red-400 text-red-500' : 'border-gray-400 text-[#0f172a]'
                }`}
              />
            )
          }
          return <span key={i} className="font-poppins font-bold text-xl text-[#0f172a] w-7 text-center">{c}</span>
        })}
      </div>
    </div>
  )
}
