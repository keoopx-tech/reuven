# Propuesta Reuven · Plataforma de Lectoescritura

**Modelo B2B con reventa B2C** · Para colegios, IPS, consultas profesionales

---

## 1. Resumen ejecutivo

Reuven es una plataforma SaaS de lectoescritura en español dirigida a **instituciones educativas e IPS de desarrollo neurolingüístico**. Se vende por **suscripción mensual por profesional** (docentes, psicólogos, neuropsicólogos, logopedas, neurolingüistas) y el cliente B2B puede revender el acceso a familias/pacientes con su propio margen.

| Indicador | Valor |
|---|---|
| Inversión inicial proyecto | **34.755.000 COP** (~$8.689 USD) |
| Tiempo a producción | **3 meses** (4 sprints + 1 mes piloto) |
| Coste operativo mensual | **~3.450.000 COP** |
| Ticket B2B por profesional | **180k – 340k COP/mes** |
| Mínimo licencias empresa | **5 licencias** |
| Break-even estimado | **~23-30 profesionales activos** |

---

## 2. Estado técnico actual

| Capa | Stack | Estado |
|---|---|---|
| Backend | FastAPI + PostgreSQL + JWT auth + alembic | ✅ Completo |
| Frontend | React 18 + Vite + Tailwind + TanStack Query + Recharts | ✅ Completo |
| Diseño | Paleta Índigo + Coral, layout ScrewFast-style | ✅ Aplicado |
| Métricas | Eventos en tiempo real + cola sessionStorage + sendBeacon | ✅ Funcionando |
| Multi-rol | Tutor / Profesional / Admin con vinculación XXXX-XXXX | ✅ Funcionando |
| Contenido demo | 17 palabras, 8 actividades, voz español, confetti | ✅ Portado |
| Infraestructura | Azure App Service + Postgres Flexible + Static Web Apps | ⏳ Por desplegar |

---

## 3. Plan de desarrollo (3 meses)

### Equipo

| Mes | Composición | Coste |
|---|---|---|
| **Mes 1** | Dev Senior (4.2M) + Dev (3.5M) + Analista (2.8M) | **10.500.000 COP** |
| **Mes 2** | Dev Senior (4.2M) + Dev (3.5M) + Analista (2.8M) | **10.500.000 COP** |
| **Mes 3** | Dev Senior (4.2M) + Dev (3.5M) + Analista (2.8M) — equipo completo en piloto y go-live | **10.500.000 COP** |
| | **Subtotal personal** | **31.500.000 COP** |

### Costes fijos del proyecto

| Concepto | Coste |
|---|---|
| ElevenLabs Pro (pago único cubre 500k chars) | 400.000 COP |
| Azure Tier 1 (3 meses × $100/mes) | 1.200.000 COP |
| **Subtotal fijos** | **1.600.000 COP** |
| Buffer contingencia 5% | 1.655.000 COP |
| **TOTAL INVERSIÓN INICIAL** | **34.755.000 COP** |

### Cronograma por sprints

| Sprint | Semanas | Entregable |
|---|---|---|
| Sprint 1 | 1-2 | Setup infra · Backend auth + endpoints base · Frontend scaffold + Landing |
| Sprint 2 | 3-4 | Dashboard profesional + Métricas con Recharts + flujo registro completo |
| Sprint 3 | 5-6 | Motor de contenido dinámico · **Nivel 1 (110 páginas)** |
| Sprint 4 | 7-8 | Tests E2E + PWA + **Niveles 2 y 3 (240 páginas)** |
| Piloto | 9-10 | Piloto cerrado con colegio RF · Equipo completo iterando contenido y ajustes UX según feedback real del aula |
| Go-Live | 11-12 | Hardening final · Documentación de uso · Training al equipo RF · **Producción** |

---

## 4. Modelo de venta B2B

### Reglas de venta

| Regla | Detalle |
|---|---|
| **Venta a empresas (colegio, IPS, red)** | Mínimo **5 licencias** |
| **Venta a profesional individual** | 1 licencia individual (consulta privada, freelance) |
| **Descuento por compromiso 3 meses** | **3% descuento** |
| **Descuento por compromiso 5 meses** | **5% descuento** |
| **Compromiso anual** | Negociable (típicamente 10-15%) |

### Tarifas mensuales por profesional (COP)

| Plan | Precio/mes | Por trimestre (–3%) | Por 5 meses (–5%) |
|---|---|---|---|
| **A — Básico** | 180.000 | 174.600 × 3 = **523.800** | 171.000 × 5 = **855.000** |
| **B — Estándar** | 220.000 | 213.400 × 3 = **640.200** | 209.000 × 5 = **1.045.000** |
| **C — Profesional** | 280.000 | 271.600 × 3 = **814.800** | 266.000 × 5 = **1.330.000** |
| **D — Enterprise** | 340.000 | 329.800 × 3 = **989.400** | 323.000 × 5 = **1.615.000** |

### Diferenciación por plan

| Característica | A 180k | B 220k | C 280k | D 340k |
|---|---|---|---|---|
| Profesionales | 1 | hasta 3 | hasta 10 | ilimitado |
| Usuarios finales por profesional | 30 | 50 | 100 | sin límite |
| Acceso a las 3 niveles (350 pages) | ✓ | ✓ | ✓ | ✓ |
| Dashboard de métricas | ✓ | ✓ | ✓ | ✓ |
| Exportar informes PDF | — | ✓ | ✓ | ✓ |
| API personalizada / integración SIE | — | — | ✓ | ✓ |
| Soporte prioritario 24h | — | — | ✓ | ✓ |
| Voice cloning personalizada | — | — | — | ✓ |
| Sesiones de formación al equipo | — | — | 1/año | trimestrales |

---

## 5. Reventa B2C (lo que cobra el cliente B2B)

El cliente B2B define su propio precio al usuario final. Recomendaciones de pricing:

| Plan B2C | Precio/mes | Incluye | Margen al B2B (asumiendo plan C 280k) |
|---|---|---|---|
| **Básico Familiar** | 30.000 | 1 perfil de niño, acceso libre | Si profesional atiende 30 niños = 900k ingresos vs 280k coste = **620k margen** |
| **Familiar Plus** | 50.000 | 2 perfiles + dashboard familiar | 30 × 50k = 1.5M vs 280k = **1.22M margen** |
| **Estándar** | 70.000 | 2 perfiles + 1 reporte mensual del profesional | 30 × 70k = 2.1M vs 280k = **1.82M margen** |
| **Profesional 1:1** | 90.000 | + 1 sesión mensual con el profesional | 30 × 90k = 2.7M = **2.42M margen** |
| **Premium** | 120.000 | + sesiones quincenales + plan personalizado | 30 × 120k = 3.6M = **3.32M margen** |

> **El B2B se queda con todo el margen** entre lo que paga a Reuven y lo que cobra al usuario final. Esto es lo que hace el modelo atractivo para colegios e IPS.

---

## 6. Matriz de ingresos por escenario

### Ingresos mensuales según número de profesionales suscritos y plan

| Profesionales activos | @180k/mes | @220k/mes | @280k/mes | @340k/mes |
|---|---|---|---|---|
| **5** (mínimo empresa) | 900.000 | 1.100.000 | 1.400.000 | 1.700.000 |
| **10** | 1.800.000 | 2.200.000 | 2.800.000 | 3.400.000 |
| **15** | 2.700.000 | 3.300.000 | 4.200.000 | 5.100.000 |
| **20** | 3.600.000 | 4.400.000 | 5.600.000 | 6.800.000 |
| **25** ⚠️ break-even | 4.500.000 | 5.500.000 | **7.000.000 ✓** | **8.500.000 ✓** |
| **30** ✓ rentable | 5.400.000 | 6.600.000 | 8.400.000 | 10.200.000 |
| **50** | 9.000.000 | 11.000.000 | 14.000.000 | 17.000.000 |
| **75** | 13.500.000 | 16.500.000 | 21.000.000 | 25.500.000 |
| **100** | 18.000.000 | 22.000.000 | 28.000.000 | 34.000.000 |

> Línea de break-even completo (cubre OPEX + amortización en 12 meses): **~25-30 profesionales activos** dependiendo del plan promedio.

### Ingresos anuales proyectados

| Profesionales activos | @180k | @220k | @280k | @340k |
|---|---|---|---|---|
| 10 | 21.6M | 26.4M | 33.6M | 40.8M |
| 25 | 54.0M | 66.0M | 84.0M | 102.0M |
| 50 | 108.0M | 132.0M | 168.0M | 204.0M |
| 100 | 216.0M | 264.0M | 336.0M | 408.0M |

---

## 7. Mínimos viables y break-even

### Análisis de viabilidad

**Costes operativos mensuales (OPEX)**: 3.450.000 COP
- Azure Tier 1: 400k
- Dev mantenimiento medio tiempo: 2.100k
- Soporte ¼ tiempo: 700k
- ElevenLabs ampliación + dominio + tooling: 250k

**Para cubrir solo OPEX** (sin amortizar inversión inicial):

| Plan promedio | Profesionales mínimos |
|---|---|
| @ 180k | **20 profesionales** |
| @ 220k | **16 profesionales** |
| @ 280k | **13 profesionales** ✓ realista |
| @ 340k | **11 profesionales** |

**Para break-even total** (cubrir OPEX + amortizar 34.76M iniciales en 12 meses):

Necesitas cubrir: 3.450k + (34.76M/12) = **6.347k/mes**

| Plan promedio | Profesionales mínimos |
|---|---|
| @ 180k | 36 profesionales |
| @ 220k | 29 profesionales |
| @ 280k | **23 profesionales** ✓ objetivo |
| @ 340k | 19 profesionales |

### 🎯 Objetivos comerciales mínimos

| Hito | Profesionales activos | Clientes B2B (avg 5 prof.) | Meta temporal |
|---|---|---|---|
| **Cobertura OPEX** | 13-15 | 3 clientes | Mes 5 post-lanzamiento |
| **Break-even completo** | 23-29 | 5-6 clientes | Mes 9 post-lanzamiento |
| **Crecimiento sostenido** | 50+ | 10+ clientes | Mes 12 post-lanzamiento |

---

## 8. Ejemplos de clientes tipo

### Colegio mediano (cliente ancla RF)
- **15 docentes** plan C @ 280k/mes
- Compromiso 5 meses (–5%) → 266k/profesional
- Ingreso Reuven: **15 × 266k = 3.990.000 COP/mes** = **47.9M COP anual**
- El colegio cobra a 300 estudiantes plan Estándar 70k = 21M/mes
- **Margen del colegio: 17M COP/mes**

### IPS especializada
- **6 profesionales** (psicólogos, neuropsicólogos, logopedas) plan B @ 220k/mes
- Compromiso trimestral (–3%) → 213.4k/profesional
- Ingreso Reuven: **6 × 213.4k = 1.280.400 COP/mes** = **15.4M COP anual**
- La IPS atiende 100 pacientes, 30 usan plataforma con plan Profesional 90k
- IPS factura: 30 × 90k = 2.7M/mes ⇒ **Margen IPS: ~1.4M COP/mes**

### Consulta privada (profesional individual)
- **1 logopeda** plan A @ 180k/mes (sin descuento por mes a mes)
- Atiende 15 pacientes pediátricos, 10 usan plataforma con plan Familiar Plus 50k
- Ingreso Reuven: **180.000 COP/mes** = **2.16M anual**
- Profesional factura: 10 × 50k = 500k/mes ⇒ **Margen: 320k/mes**

### Red de colegios (Enterprise)
- **30 docentes** distribuidos en 3 sedes, plan D @ 340k/mes
- Compromiso 5 meses (–5%) → 323k/profesional
- Ingreso Reuven: **30 × 323k = 9.690.000 COP/mes** = **116.3M COP anual**

---

## 9. Proyección de ingresos año 1 (conservadora)

| Mes | Eventos | Clientes acumulados | Profesionales activos | Ingreso mensual | Acumulado |
|---|---|---|---|---|---|
| 1-3 | **Desarrollo** | 0 | 0 | 0 | 0 |
| 4 | Lanzamiento RF + 1 cliente | 2 | 18 | 4.530.000 | 4.530.000 |
| 5 | +1 IPS | 3 | 24 | 6.110.000 | 10.640.000 |
| 6 | +1 consulta privada | 4 | 25 | 6.290.000 | 16.930.000 |
| 7 | +1 colegio mediano | 5 | 38 | 9.730.000 | 26.660.000 |
| 8 | +1 IPS pediátrica | 6 | 44 | 11.040.000 | 37.700.000 |
| 9-12 | Ramp-up gradual | 7-9 | 50-65 | 12M-16M | ~93M total |

**Ingresos año 1 (post-lanzamiento meses 4-12)**: **~93-110 millones COP**

### Resultado neto año 1

| Concepto | Valor |
|---|---|
| Ingresos año 1 | +95.000.000 COP |
| OPEX 9 meses post-lanzamiento | −31.050.000 COP |
| Inversión inicial proyecto | −34.755.000 COP |
| **Resultado neto año 1** | **+29.195.000 COP** |
| **Margen sobre inversión** | **+22%** |

---

## 10. Próximos pasos

| Fase | Acción | Responsable | Fecha |
|---|---|---|---|
| 1 | ✅ Plataforma técnica lista | Devs | Hecho |
| 2 | Producción de 350 páginas de contenido (sprints 3-4) | Analista + Dev frontend | Meses 1-2 |
| 3 | Piloto con colegio RF | Dev solo + 1 analista freelance | Mes 3 |
| 4 | Cierre comercial 3 clientes adicionales | Comercial (a definir) | Meses 4-6 |
| 5 | Iteración producto según feedback IPS vs colegio | Equipo | Meses 7-9 |
| 6 | Escalado a 10+ clientes y revisión OPEX | Equipo | Meses 10-12 |

---

## 11. Anexo: comparativa de descuentos por compromiso

### Plan B (220k) — ejemplo de impacto del descuento

| Forma de pago | Precio efectivo/mes | Total al cierre | Ahorro vs mensual |
|---|---|---|---|
| Mensual | 220.000 | — | 0 |
| 3 meses (–3%) | 213.400 | 640.200 | −19.800 COP en 3 meses |
| 5 meses (–5%) | 209.000 | 1.045.000 | −55.000 COP en 5 meses |
| Anual (–10% negociable) | 198.000 | 2.376.000 | −264.000 COP/año |

> Los descuentos por compromiso son **menores al riesgo de churn** que cubren. Un cliente que paga 5 meses por adelantado tiene 80% menos probabilidad de cancelar mes a mes.

---

**Documento generado**: estado del proyecto al cierre de Fase 2 (frontend + backend completos).
**Pendiente para producción**: contenido (350 páginas), despliegue Azure, piloto en cliente ancla RF.
