# Mockups Reuven · Tablet (SVG)

Mockups estáticos del flujo end-to-end de Reuven optimizados para tablet (iPad estándar). Pensados para importar a Figma manteniendo grupos editables, colores del sistema y textos como `<text>` (no convertidos a paths).

## Dimensiones

- **Landscape**: 1024 × 768
- **Portrait**: 768 × 1024

## Pantallas

| # | Pantalla | Landscape | Portrait | Descripción |
|---|---|---|---|---|
| 01 | Landing | [01-landing-landscape.svg](01-landing-landscape.svg) | [01-landing-portrait.svg](01-landing-portrait.svg) | Página de bienvenida: hero, "Cómo funciona", grid de 8 actividades, CTA |
| 02 | Login niños | [02-login-ninos-landscape.svg](02-login-ninos-landscape.svg) | [02-login-ninos-portrait.svg](02-login-ninos-portrait.svg) | Selección de perfil con 3 niños + añadir |
| 03 | Hub actividades | [03-hub-actividades-landscape.svg](03-hub-actividades-landscape.svg) | [03-hub-actividades-portrait.svg](03-hub-actividades-portrait.svg) | Grid 4×2 / 2×4 con 8 actividades · estados completada / en curso / bloqueada |
| 04 | Actividad Vocales | [04-actividad-vocales-landscape.svg](04-actividad-vocales-landscape.svg) | [04-actividad-vocales-portrait.svg](04-actividad-vocales-portrait.svg) | Pregunta 3/5 con elefante 🐘 y selector de vocales A E I O U |
| 05 | Éxito | [05-exito-landscape.svg](05-exito-landscape.svg) | [05-exito-portrait.svg](05-exito-portrait.svg) | Celebración: 🎉 + 3 estrellas + stats + CTAs |
| 06 | Dashboard adulto | [06-dashboard-adulto-landscape.svg](06-dashboard-adulto-landscape.svg) | [06-dashboard-adulto-portrait.svg](06-dashboard-adulto-portrait.svg) | Vista padres/profesionales: KPIs, gráfico semanal, progreso por actividad, RGPD |

## Flujo del usuario

```
01 Landing  →  02 Login niños  →  03 Hub  →  04 Actividad  →  05 Éxito  →  (vuelve a 03)
                     │
                     └──→  06 Dashboard adulto (rama adulto/profesional)
```

## Sistema de diseño aplicado

Alineado con la marca oficial del **colegio RF · Enseñamos a pensar**:

- **Marca primaria**: navy `#1e3a5f` + rojo `#c8102e` (acento, CTAs, eyebrows, progreso activo) · rojo-dark `#9f1d35`
- **Logo**: mini-escudo "RF" inline (cuadrado rojo + navy con monograma blanco) reproducible vía SVG en cada pantalla
- **Tagline**: "ENSEÑAMOS A PENSAR" en headers principales (landing + dashboard adulto)
- **Colores didácticos secundarios** (UI infantil, no se tocan): green `#22c55e` (completado) · yellow `#fbbf24` · pink `#ec4899` · blue `#3b82f6` · orange `#f97316` (vocales, avatares, estrellas)
- **Tipografía**: Nunito 800-900 (display) · Fredoka 400-700 (UI)
- **Radius**: 18-28px en cards, 50% en avatars, 8px en logo
- **Sombras**: `feGaussianBlur stdDeviation="6-10"` con offset `dy="4-6"` y `flood-color="#1e3a5f"` opacity `0.10-0.16`

## Cómo importar a Figma

1. Abrir Figma · crear nuevo Frame
2. Drag & drop el archivo `.svg` al canvas (uno cada vez funciona mejor)
3. Cada `<g id="...">` aparece como grupo nombrado en el panel Layers
4. Los textos siguen siendo editables · los gradientes se conservan en `<defs>`
5. Si Nunito/Fredoka no están instaladas, Figma pedirá fuentes — instálalas desde Google Fonts o sustituye

## Assets referenciados

Los SVGs apuntan a las imágenes existentes con rutas relativas (`../assets/elefante.png`, etc.). Al importar a Figma se incrustarán automáticamente. Lista usada en estos mockups:

- `assets/avion.png`, `assets/gato.png`, `assets/oveja.png`, `assets/sol.png` (landing hero)
- `assets/elefante.png` (pantalla de actividad)

## Out of scope

- Animaciones (los SVG son estáticos)
- Estados error / loading / vacíos
- Las otras 7 actividades (solo Vocales como ejemplo)
- Modificación de los HTML originales
