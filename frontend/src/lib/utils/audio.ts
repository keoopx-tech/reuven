/** Singleton AudioContext — fuera del lifecycle de React para evitar doble-invocación de StrictMode */
let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  return ctx
}

function tone(freq: number, duration = 0.2, type: OscillatorType = 'sine') {
  const c = getCtx()
  if (!c) return
  try {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.3, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + duration)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start()
    osc.stop(c.currentTime + duration)
  } catch { /* ignore */ }
}

export const sound = {
  correct() {
    tone(523, 0.15); setTimeout(() => tone(659, 0.15), 100); setTimeout(() => tone(784, 0.2), 200)
  },
  wrong()  { tone(200, 0.3, 'sawtooth') },
  win()    { [523, 659, 784, 1047].forEach((n, i) => setTimeout(() => tone(n, 0.3), i * 150)) },
  click()  { tone(440, 0.05, 'square') },
}
