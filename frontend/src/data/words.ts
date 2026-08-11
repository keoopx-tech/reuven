export interface Word {
  name: string
  spoken: string
  syllables: string[]
  emoji: string
  img: string
  startsRR?: boolean
}

export const WORDS: Record<string, Word> = {
  anillo:   { name:'ANILLO',   spoken:'anillo',   syllables:['a','ni','llo'],      emoji:'💍', img:'/assets/anillo.png' },
  oveja:    { name:'OVEJA',    spoken:'oveja',    syllables:['o','ve','ja'],       emoji:'🐑', img:'/assets/oveja.png' },
  avion:    { name:'AVIÓN',    spoken:'avión',    syllables:['a','vión'],          emoji:'✈️', img:'/assets/avion.png' },
  pato:     { name:'PATO',     spoken:'pato',     syllables:['pa','to'],           emoji:'🦆', img:'/assets/pato.png' },
  sopa:     { name:'SOPA',     spoken:'sopa',     syllables:['so','pa'],           emoji:'🍲', img:'/assets/sopa.png' },
  gato:     { name:'GATO',     spoken:'gato',     syllables:['ga','to'],           emoji:'🐱', img:'/assets/gato.png' },
  pala:     { name:'PALA',     spoken:'pala',     syllables:['pa','la'],           emoji:'🪣', img:'/assets/pala.png' },
  pito:     { name:'PITO',     spoken:'pito',     syllables:['pi','to'],           emoji:'🪈', img:'/assets/pito.png' },
  mesa:     { name:'MESA',     spoken:'mesa',     syllables:['me','sa'],           emoji:'🪑', img:'/assets/mesa.png' },
  casa:     { name:'CASA',     spoken:'casa',     syllables:['ca','sa'],           emoji:'🏠', img:'/assets/casa.png' },
  sol:      { name:'SOL',      spoken:'sol',      syllables:['sol'],               emoji:'☀️', img:'/assets/sol.png' },
  raton:    { name:'RATÓN',    spoken:'ratón',    syllables:['ra','tón'],          emoji:'🐭', img:'/assets/raton.png',  startsRR:true },
  rosa:     { name:'ROSA',     spoken:'rosa',     syllables:['ro','sa'],           emoji:'🌹', img:'',                   startsRR:true },
  regla:    { name:'REGLA',    spoken:'regla',    syllables:['re','gla'],          emoji:'📏', img:'/assets/regla.png',  startsRR:true },
  rio:      { name:'RÍO',      spoken:'río',      syllables:['rí','o'],            emoji:'🏞️', img:'/assets/rio.png',   startsRR:true },
  torre:    { name:'TORRE',    spoken:'torre',    syllables:['to','rre'],          emoji:'🗼', img:'/assets/torre.png' },
  elefante: { name:'ELEFANTE', spoken:'elefante', syllables:['e','le','fan','te'], emoji:'🐘', img:'/assets/elefante.png' },
}

const VOWELS = new Set(['A','E','I','O','U','Á','É','Í','Ó','Ú'])

export function vowelsInWord(name: string): string[] {
  return [...name]
    .filter(c => VOWELS.has(c))
    .map(c => c.toLowerCase().normalize('NFD')[0])
}

// ── TASK 1: Colorea las vocales ──────────────────────────────────────────────
export const TASK1_WORDS = [
  { key:'anillo', vowels:['a','e','i','o','u'], correct:['a','i','o'] },
  { key:'oveja',  vowels:['o','e','i','u','a'], correct:['o','e','a'] },
  { key:'avion',  vowels:['a','e','i','o','u'], correct:['a','i','o'] },
]

// ── TASK 2: Escribe las vocales ─────────────────────────────────────────────
export const TASK2_KEYS = ['oveja','pato','casa']

// ── TASK 3: Huecos ─────────────────────────────────────────────────────────
export const TASK3_KEYS = ['pato','mesa','casa']

// ── TASK 4: Ordena las letras ───────────────────────────────────────────────
export const TASK4_KEYS = ['pito','sopa','pala']

// ── TASK 5: Número de sílabas ───────────────────────────────────────────────
export const TASK5_KEYS = ['sol','pala','oveja','elefante']

// ── TASK 6: Sonido /rr/ ──────────────────────────────────────────────────────
export const TASK6_KEYS = ['raton','rosa','regla','rio','pato','sol','mesa','casa']

// ── TASK 7: Unir sílabas ─────────────────────────────────────────────────────
export const TASK7_PAIRS = [
  { key:'pato',     s1:'pa', s2:'to'  },
  { key:'mesa',     s1:'me', s2:'sa'  },
  { key:'sol',      s1:'sol',s2:''    },
  { key:'oveja',    s1:'o',  s2:'ve'  },
]

// ── TASK 8: Colorea las sílabas ──────────────────────────────────────────────
export const TASK8_TARGETS = [
  { key:'pala',     correct:['pa','la'] },
  { key:'torre',    correct:['to','rre'] },
  { key:'oveja',    correct:['o','ve','ja'] },
]
