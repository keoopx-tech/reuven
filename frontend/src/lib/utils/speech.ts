/** Singleton SpeechSynthesis — fuera del lifecycle de React */
let voice: SpeechSynthesisVoice | null = null

function init() {
  if (typeof speechSynthesis === 'undefined') return
  const pick = () => {
    const voices = speechSynthesis.getVoices()
    if (!voices.length) return
    const prefer = [
      (v: SpeechSynthesisVoice) => v.lang === 'es-ES' && /m[oó]nica|sabina|helena/i.test(v.name),
      (v: SpeechSynthesisVoice) => v.lang === 'es-MX' && /paulina|jorge/i.test(v.name),
      (v: SpeechSynthesisVoice) => v.lang.startsWith('es') && /google/i.test(v.name),
      (v: SpeechSynthesisVoice) => v.lang.startsWith('es'),
    ]
    for (const fn of prefer) { const v = voices.find(fn); if (v) { voice = v; break } }
  }
  pick()
  speechSynthesis.onvoiceschanged = pick
}
init()

function speak(text: string, opts?: { rate?: number; pitch?: number; onend?: () => void }) {
  if (typeof speechSynthesis === 'undefined') return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'es-ES'
  if (voice) u.voice = voice
  u.rate  = opts?.rate  ?? 0.95
  u.pitch = opts?.pitch ?? 1.15
  if (opts?.onend) u.onend = opts.onend
  speechSynthesis.speak(u)
}

export const speech = {
  speak,
  word:      (text: string, onend?: () => void) => speak(text, { rate: 0.9, onend }),
  letter:    (l: string) => speak(l, { rate: 0.7, pitch: 1.25 }),
  syllables: (arr: string[]) => arr.forEach((s, i) => setTimeout(() => speak(s, { rate: 0.55, pitch: 1.2 }), i * 700)),
  praise:    (big = false) => {
    const sm  = ['¡bien!','¡eso!','¡sí!','¡genial!','¡súper!']
    const big_ = ['¡Excelente!','¡Muy bien!','¡Lo lograste!','¡Fantástico!']
    const list = big ? big_ : sm
    speak(list[Math.floor(Math.random() * list.length)], { rate: big ? 0.95 : 1.05, pitch: 1.3 })
  },
  cancel: () => { if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel() },
}
