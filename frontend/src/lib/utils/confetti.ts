const COLORS = ['#fbbf24','#84cc16','#3b82f6','#ec4899','#a855f7','#ef4444']

function particle(x: number, y: number) {
  const el = document.createElement('div')
  el.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    width:8px;height:8px;border-radius:50%;
    pointer-events:none;z-index:9999;
    background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
    animation:confetti-fall 2s ease forwards;
  `
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 2500)
}

// CSS animation si no existe
if (typeof document !== 'undefined' && !document.getElementById('confetti-style')) {
  const s = document.createElement('style')
  s.id = 'confetti-style'
  s.textContent = `@keyframes confetti-fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(${120 + Math.random() * 80}px) rotate(${360 + Math.random() * 360}deg);opacity:0}}`
  document.head.appendChild(s)
}

export const confetti = {
  burst: (el: HTMLElement, count = 8) => {
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    for (let i = 0; i < count; i++) {
      setTimeout(() => particle(cx + (Math.random() - 0.5) * 60, cy + (Math.random() - 0.5) * 60), i * 30)
    }
  },
  rain: (count = 40) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => particle(Math.random() * window.innerWidth, -20), i * 40)
    }
  },
}
