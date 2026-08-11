import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Paleta Índigo + Coral ──────────────────────────────
        navy: {
          DEFAULT: '#0f172a',   // slate-900  — texto oscuro principal
          soft: '#1e293b',      // slate-800
        },
        brand: {
          DEFAULT: '#4f46e5',   // indigo-600 — primario
          dark: '#4338ca',      // indigo-700
          light: '#e0e7ff',     // indigo-100
        },
        accent: {
          DEFAULT: '#f97316',   // orange-500 — coral/acento energético
          dark: '#ea580c',      // orange-600
          light: '#ffedd5',     // orange-100
        },
        // Semánticos que no cambian
        surface: '#ffffff',
        bg: '#f8fafc',          // slate-50 (ligeramente más fría que el beige anterior)

        // ── Tema Skilline (usado en el Home) ──────────────────
        cream: '#FFF2E1',
        skyellow: {
          DEFAULT: '#F48C06',
          light: '#FFE8A3',
        },
        darken: '#2F327D',
      },
      fontFamily: {
        fredoka: ['Fredoka', 'system-ui', 'sans-serif'],
        nunito: ['Nunito', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card:  '0 2px 14px rgba(15, 23, 42, 0.06)',
        brand: '0 3px 10px rgba(79, 70, 229, 0.18)',
        accent:'0 3px 10px rgba(249, 115, 22, 0.18)',
      },
    },
  },
  plugins: [],
}

export default config
