import { useEffect, useState } from 'react'
import { TASK6_KEYS, WORDS } from '@/data/words'
import { speech } from '@/lib/utils/speech'

interface Props { onCorrect: (item: string) => void; onWrong: (item: string) => void; onComplete: () => void }

export default function Task6Sonido({ onCorrect, onWrong, onComplete }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [checked, setChecked]   = useState(false)
  const [results, setResults]   = useState<Record<string,'ok'|'wrong'|'missed'>>({})

  const correctSet = new Set(TASK6_KEYS.filter(k => WORDS[k].startsRR))

  useEffect(() => { speech.word('Selecciona las palabras que empiezan con el sonido rr fuerte.') }, [])

  const toggle = (key: string) => {
    if (checked) return
    setSelected(prev => {
      const n = new Set(prev)
      n.has(key) ? n.delete(key) : n.add(key)
      return n
    })
    speech.word(WORDS[key].spoken)
  }

  const verify = () => {
    const r: Record<string,'ok'|'wrong'|'missed'> = {}
    let ok = 0, fail = 0
    TASK6_KEYS.forEach(k => {
      const isSelected = selected.has(k)
      const isCorrect  = correctSet.has(k)
      if (isCorrect && isSelected)   { r[k] = 'ok'; ok++ }
      else if (!isCorrect && isSelected) { r[k] = 'wrong'; fail++ }
      else if (isCorrect && !isSelected) { r[k] = 'missed'; fail++ }
    })
    setResults(r)
    setChecked(true)
    if (ok > 0) { const w = TASK6_KEYS.filter(k => selected.has(k) && correctSet.has(k)); onCorrect(w[0]) }
    if (fail > 0) { onWrong(TASK6_KEYS[0]) }
    setTimeout(() => onComplete(), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-poppins font-bold text-[#0f172a] text-2xl text-center">👂 Sonido /rr/ fuerte</h2>
      <p className="text-gray-500 text-center">Selecciona todas las palabras que empiezan con el sonido /rr/ fuerte (como en "ratón" o "rosa").</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg">
        {TASK6_KEYS.map(k => {
          const w  = WORDS[k]
          const st = results[k]
          return (
            <button key={k} onClick={() => toggle(k)}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-200 font-semibold text-sm ${
                st === 'ok'     ? 'border-green-400 bg-green-50 text-green-700' :
                st === 'wrong'  ? 'border-red-400 bg-red-50 text-red-600' :
                st === 'missed' ? 'border-yellow-400 bg-yellow-50 text-yellow-600' :
                selected.has(k) ? 'border-[#4f46e5] bg-red-50 text-[#4f46e5] scale-105' :
                                  'border-gray-100 bg-white text-[#0f172a] hover:border-gray-300'
              }`}>
              {w.img ? <img src={w.img} alt={w.spoken} className="w-16 h-16 object-contain" /> : <span className="text-4xl">{w.emoji}</span>}
              <span>{w.name.toLowerCase()}</span>
              {st === 'ok' && <span className="text-xs">✓ correcto</span>}
              {st === 'wrong' && <span className="text-xs">✗ no empieza con rr</span>}
              {st === 'missed' && <span className="text-xs">⚠ se te olvidó</span>}
            </button>
          )
        })}
      </div>

      {!checked && (
        <button onClick={verify}
          className="px-8 py-3 bg-[#4f46e5] text-white font-bold rounded-2xl shadow-sm hover:bg-[#4338ca] hover:-translate-y-0.5 transition-all">
          Comprobar
        </button>
      )}
    </div>
  )
}
