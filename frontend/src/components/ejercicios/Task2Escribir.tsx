import { useEffect, useState } from 'react'
import { TASK2_KEYS, WORDS, vowelsInWord } from '@/data/words'
import { speech } from '@/lib/utils/speech'

interface Props { onCorrect: (item: string) => void; onWrong: (item: string) => void; onComplete: () => void }

export default function Task2Escribir({ onCorrect, onWrong, onComplete }: Props) {
  const [idx, setIdx]     = useState(0)
  const [filled, setFilled] = useState<Record<number,string>>({})
  const [wrongs, setWrongs] = useState<Set<number>>(new Set())

  const key  = TASK2_KEYS[idx]
  const word = WORDS[key]
  const vows = vowelsInWord(word.name)

  useEffect(() => { setFilled({}); setWrongs(new Set()); speech.word(word.spoken) }, [idx])

  const letters = [...word.name].map((c, i) => ({ c, i, isVowel: /[AEIOUÁÉÍÓÚ]/i.test(c) }))

  const handleVowelClick = (slotIdx: number, vowel: string) => {
    const expected = vows[slotIdx]
    if (vowel.toLowerCase() === expected.toLowerCase()) {
      const next = { ...filled, [slotIdx]: vowel }
      setFilled(next)
      onCorrect(word.name)
      speech.letter(vowel)
      if (Object.keys(next).length === vows.length) {
        setTimeout(() => {
          if (idx + 1 < TASK2_KEYS.length) setIdx(i => i + 1)
          else onComplete()
        }, 700)
      }
    } else {
      setWrongs(prev => new Set([...prev, slotIdx]))
      onWrong(word.name)
      speech.letter(vowel)
      setTimeout(() => setWrongs(prev => { const n = new Set(prev); n.delete(slotIdx); return n }), 600)
    }
  }

  const VOWELS = ['a','e','i','o','u']
  let vowelSlotIdx = -1

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-poppins font-bold text-[#0f172a] text-2xl text-center">✏️ Escribe las vocales</h2>
      <p className="text-gray-500 text-center">Pulsa la vocal correcta para cada hueco.</p>

      <div className="flex gap-2 mb-2">
        {TASK2_KEYS.map((_,i) => <span key={i} className={`w-2.5 h-2.5 rounded-full ${i===idx?'bg-[#0f172a]':i<idx?'bg-green-400':'bg-gray-200'}`}/>)}
      </div>

      <button onClick={() => speech.word(word.spoken)} className="w-36 h-36 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-center shadow-card">
        {word.img ? <img src={word.img} alt={word.spoken} className="w-28 h-28 object-contain" /> : <span className="text-6xl">{word.emoji}</span>}
      </button>

      <div className="flex gap-2 flex-wrap justify-center">
        {letters.map(({ c, i, isVowel }) => {
          if (isVowel) {
            vowelSlotIdx++
            const vi = vowelSlotIdx
            const isFilled = vi in filled
            const isWrong  = wrongs.has(vi)
            return (
              <div key={i} className={`w-10 h-10 border-b-2 flex items-center justify-center font-poppins font-bold text-xl transition-all ${
                isFilled ? 'border-green-400 text-green-600' : isWrong ? 'border-red-400' : 'border-gray-400'
              }`}>
                {isFilled ? filled[vi] : ''}
              </div>
            )
          }
          return (
            <div key={i} className="w-10 h-10 flex items-center justify-center font-poppins font-bold text-xl text-[#0f172a]">{c}</div>
          )
        })}
      </div>

      {/* Vowel buttons — active slot */}
      {(() => {
        const activeSlot = Object.keys(filled).length
        if (activeSlot >= vows.length) return null
        return (
          <div className="flex gap-3 mt-2">
            {VOWELS.map(v => (
              <button key={v} onClick={() => handleVowelClick(activeSlot, v)}
                className="w-11 h-11 rounded-full bg-gray-100 font-poppins font-bold text-lg text-gray-600 hover:bg-[#0f172a] hover:text-white transition-all">
                {v}
              </button>
            ))}
          </div>
        )
      })()}
    </div>
  )
}
