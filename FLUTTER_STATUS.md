# 📱 Estado del proyecto Flutter - Reuven

**Fecha**: Agosto 2026 | **Estado**: Prototipo funcional, no listo para producción  
**Prioridad**: Post-MVP web (recomendado Q2-Q3 2026)

---

## 🎯 ¿QUÉ TENEMOS?

### Estructura base completa ✅

```
reuven_flutter/
├── lib/
│   ├── main.dart                    ✅ App principal + HomeScreen
│   ├── theme.dart                   ✅ Tema Material 3 (Fredoka + Nunito)
│   ├── widgets/
│   │   └── reuven_widgets.dart      ✅ 7 componentes reutilizables
│   └── screens/
│       ├── registro_adulto_screen.dart      ✅ Registro tutor + menor
│       └── registro_profesional_screen.dart ✅ Registro profesional (sketch)
├── pubspec.yaml                     ✅ Dependencies configuradas
└── pubspec.lock                     ✅ Locked versions
```

### Funcionalidades implementadas ✅

| Feature | Estado | Detalles |
|---------|--------|----------|
| **Tema Material 3** | ✅ Completo | Fredoka + Nunito fonts. Colors navy/red/green bien definidos |
| **Componentes UI** | ✅ Completo | ReuvenLogo, FormSection, ReuvenField, ReuvenDropdown, ConsentItem, SuccessBanner |
| **HomeScreen** | ✅ Funcional | Selector Tutor/Profesional con tarjetas bonitas |
| **Registro tutor** | 🟡 60% | Formulario 2 secciones (datos adulto + menor). Generador de código XXXX-XXXX |
| **Registro profesional** | ⏳ 10% | Solo estructura. Falta implementar |
| **Routing** | ✅ Básico | Named routes `/registro-familia` y `/registro-profesional` |
| **Validación** | ✅ Básico | Form validation framework. Validadores listos |
| **Backend integration** | ❌ NO EXISTE | Sin conexión a API. Sin http package |
| **State management** | ❌ NO EXISTE | Sin Provider/Riverpod. State es local solo |
| **Persistencia** | ❌ NO EXISTE | Sin shared_preferences o similar |
| **Autenticación** | ❌ NO EXISTE | Sin JWT tokens, sin login móvil |

---

## 📊 ANÁLISIS DETALLADO

### Tema & Design System ✅ Excelente

```dart
ReuvenColors:
- navy: #1e3a5f
- red: #c8102e  
- green: #22c55e
- bg: #f5f3ee (beige)
- Tipografía: Fredoka + Nunito + Google Fonts

ThemeData:
- Material 3 completo
- Input decoration customizada (navy focus → red)
- Buttons con estilos diferenciados
- Checkbox/Radio con ReuvenColors
```

**Conclusión**: El sistema de diseño es **profesional y consistente**. Pueden reutilizarse estos componentes en toda la app.

### Componentes reutilizables ✅ Bien estructurados

```
ReuvenLogo          → Logo + marca en AppBar
FormSection         → Fieldset con número + título
ReuvenField         → Input con label + helper
ReuvenDropdown      → Dropdown con label
ConsentItem         → Checkbox animado con subtitle
SuccessBanner       → Banner verde de éxito
```

**Conclusión**: Biblioteca de componentes es **modular y extensible**. Faltan:
- Loading spinner customizado
- Error dialog
- Bottom sheet
- TabBar / BottomNavigation

### Registro tutor (RegistroAdultoScreen) 🟡 ~60% completo

**Implementado:**
- Formulario con 2 secciones (datos adulto + datos menor)
- Validación de emails/teléfonos
- Selector de relación (padre/madre/tutor)
- Selector de idioma materno
- 4 checkboxes de consentimiento
- Generador de código XXXX-XXXX (lógica local)
- SuccessBanner al completar

**Falta:**
- Conexión a backend API (POST /auth/register)
- Guardar código en preferencias
- Navegar a dashboard después del registro
- Manejo de errores de API
- Loading state mientras se envía

**Estimación**: 2-3 días completar con backend

### Registro profesional (RegistroProfesionalScreen) ⏳ ~10% solo esqueleto

**Falta todo:**
- Formulario diseño (campos específicos docente/psicólogo/etc)
- Validación
- Conexión API
- Lógica de rol

**Estimación**: 5-7 días implementar

---

## ❌ LO QUE FALTA PARA MVP MÓVIL

### Crítico (bloquea funcionalidad)

1. **HTTP Client + API integration** 🔴
   - Package: `http` o `dio`
   - Conectar a `/auth/register`, `/auth/login`
   - Manejo de errores HTTP
   - Timeout handling
   - ~1 día de trabajo

2. **Autenticación** 🔴
   - Login screen (email + password)
   - JWT token storage (shared_preferences)
   - Token refresh logic
   - Logout
   - ~2 días de trabajo

3. **State Management** 🔴
   - Package: `Provider` (recomendado) o `Riverpod`
   - Auth provider (user, isLoggedIn, login/logout)
   - User profile provider
   - ~2 días de trabajo

4. **Navigation después del registro** 🔴
   - HomeScreen → Login/Register → Dashboard
   - Deep linking (códigos de vinculación)
   - Back button behavior
   - ~1 día

### Importante (impacta UX)

5. **Dashboard móvil** 🟡
   - Listado de menores (perfiles)
   - Selector de ejercicios
   - Progress tracking visual
   - Métricas básicas
   - ~5-7 días

6. **Ejercicios interactivos móvil** 🟡
   - Adaptar 8 ejercicios web a Flutter
   - Touch gestures (swipe, tap, drag)
   - Validación respuestas
   - Audio integration (ElevenLabs)
   - ~10-15 días (depende complejidad)

7. **Persistencia de datos** 🟡
   - shared_preferences para tokens
   - sqflite para cache local
   - Sincronización con backend
   - ~2-3 días

8. **Testing** 🟡
   - Unit tests para servicios
   - Widget tests para UI
   - Integration tests
   - ~3 días

### Nice-to-have

9. **Push notifications** 🟢
   - Firebase Cloud Messaging
   - Notificaciones de progreso/tareas
   - ~2 días

10. **Analytics & Logging** 🟢
    - Segment o Firebase Analytics
    - Crash reporting (Sentry)
    - ~1 día

11. **PWA <> App sincronización** 🟢
    - Offline support
    - Datos consistentes web/app
    - ~2 días

---

## 📋 DEPENDENCIAS ACTUALES vs NECESARIAS

### En pubspec.yaml (actual)

```yaml
dependencies:
  flutter:
    sdk: flutter
  google_fonts: ^6.2.1      ✅ Para tipografía
  intl: ^0.19.0             ✅ Para fechas/locales

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0     ✅ Para lint
```

### Necesarias para MVP

```yaml
# HTTP & API
  http: ^1.1.0              # O usar dio
  
# State Management
  provider: ^6.1.0          # O riverpod
  
# Persistencia
  shared_preferences: ^2.2.0 # Tokens
  
# Local Database (opcional pero recomendado)
  sqflite: ^2.3.0           # Para caché local
  
# Formularios avanzados
  flutter_form_builder: ^9.1.0  # Opcional
  
# UI utilities
  flutter_animated_dialog: ^2.1.0  # Para dialogs
  
# Logging
  logger: ^2.0.0            # Para debugging

# JSON serialization
  freezed_annotation: ^2.4.0     # DTOs
  
dev_dependencies:
  freezed: ^2.4.0           # Generador
  json_serializable: ^6.7.0 # JSON
  build_runner: ^2.4.0
```

---

## 🚀 ESTRATEGIA DE DESARROLLO FLUTTER

### Opción A: En paralelo con MVP web (RECOMENDADO)

```
Semana 1-4: MVP Web en producción
             └─ Frontend dev hace setup Flutter (1 día)
               - Actualizar pubspec.yaml con dependencies
               - Setup HTTP client
               - Setup Provider
               - Crear API service layer

Semana 5-8: MVP Flutter (post-web launch)
             └─ Frontend dev dedicado 100%
               - Terminar registro (2 días)
               - Login screen (2 días)
               - Dashboard básico (3 días)
               - Ejercicio demo (2 días)
               - Testing E2E Flutter (2 días)

Semana 9-12: Flutter en staging
              └─ Piloto con usuarios iOS + Android
                - Bug fixes
                - UX refinement
                - Go-live paralelo o post-web
```

**Ventaja**: No bloquea MVP web. Flutter puede madurar mientras web está en producción.

### Opción B: Secuencial (MVP web primero)

1. Lanzar web (4-6 semanas)
2. Estabilizar en producción (2 semanas)
3. Comenzar Flutter desde cero (4-6 semanas)

**Ventaja**: Equipo más enfocado. APIs estables antes de móvil.
**Desventaja**: Delay en lanzamiento móvil (+2 meses).

### Opción C: Código compartido (Advanced)

Usar `package:flutter_web` + arquitectura compartida entre web y móvil:

```
reuven_core/           ← Lógica compartida (Dart puro)
├── models/
├── services/
└── providers/

reuven_web/            ← React (frontend actual)
reuven_mobile/         ← Flutter
```

**Ventaja**: DRY principle. APIs centralizadas.
**Desventaja**: Complejidad inicial (+1 semana setup).

---

## 📈 ESTIMACIÓN COMPLETA: WEB + MÓVIL

### Timeline realista (3 meses post-MVP web)

| Fase | Duración | Paralelo | Output |
|------|----------|----------|--------|
| **Setup infra móvil** | 1 semana | Con MVP web | Dependencies, API service, Provider setup |
| **Login + Auth** | 1 semana | Post-MVP web | Autenticación móvil funcional |
| **Registro completo** | 1 semana | | Ambas pantallas de registro |
| **Dashboard básico** | 1 semana | | Listado menores + progreso |
| **Ejercicio demo** | 1 semana | | 1 ejercicio funcional (Vocales) |
| **Pulir + Testing** | 1 semana | | E2E tests, performance |
| **Staging + Piloto** | 1 semana | | TestFlight + Play Store closed testing |
| **Go-live** | 0.5 semana | | App Store + Google Play |

**Total**: ~7-8 semanas desde MVP web (coincide septiembre-octubre 2026)

### Recursos Flutter MVP

```
1 Flutter Dev (100%):     5-6 semanas = 2.1M COP
Backend Dev support (20%): 2-3 semanas = 0.4M COP
QA/Testing (50%):         2 semanas = 0.7M COP

Tools:
- Firebase (auth + analytics): Free tier + $20/mes
- Sentry (crash reporting): $29/mes
- TestFlight + Play Console: Free

Total: ~3.2M COP (~$800 USD)
```

---

## 💡 RECOMENDACIÓN FINAL

### Para MVP (versión 1.0 web + móvil):

**NO construir la app móvil como MVP inicial.**

**Razón**:
1. Web MVP (4-6 sem) es más rápido desplegar
2. Piloto con cliente ancla en web
3. Validar mercado primero (B2B en escuelas)
4. Las escuelas tienen computadoras. Móvil es nice-to-have inicial

**Mejor timing para Flutter**: 
- Mes 5-6 post-lanzamiento web
- Después de estabilizar clientes iniciales
- Cuando tengamos datos de uso web

### Si alguien insiste en MVP web + móvil paralelo:

Entonces necesita:
- 2 devs (1 web React, 1 móvil Flutter)
- 6-8 semanas
- +3-4M COP adicionales
- Riesgo: Ambos proyectos sufren por falta de focus

---

## 📊 COMPARATIVA: Web vs Móvil para MVP

| Aspecto | Web | Móvil |
|--------|-----|-------|
| **Tiempo despliegue** | 4-6 sem | 10-12 sem |
| **Usuarios B2B** | ✅ Ideal (computadoras escuela) | 🟡 Secundario |
| **Usuarios B2C** | ✅ Tablet/laptop en casa | ✅ Smartphone naturaleza |
| **Monetización** | ✅ App web = modelo actual | 🟡 Requiere app store (30% fee) |
| **Mantenimiento** | ✅ Una plataforma | ⚠️ iOS + Android |
| **Testing** | ✅ Fácil (browser) | 🟡 Complejo (devices reales) |
| **Análitica** | ✅ Recharts integrado | 🟡 Requiere Firebase |

**Conclusión**: Priorizar web. Móvil como follow-up.

---

## 🎯 ACTIONABLE NEXT STEPS

### Si lanzas MVP web primero (RECOMENDADO):

```
Ahora (MVP web en prod):
- No tocar Flutter, enfocarse en Azure + contenido

Mes 3 post-MVP (August-Sept):
- 1 dev Flutter comienza setup (http + provider)
- Reutiliza componentes tema + widgets
- Paralelo con stable web

Mes 4-5 (Sept-Oct):
- Implementa login + registro
- Dashboard básico
- 1-2 ejercicios

Mes 6 (Oct-Nov):
- TestFlight + Play Store closed beta
- Piloto pequeño (10-20 usuarios)
- Bug fixes + refinamiento

Mes 7 (Nov-Dec):
- Go-live ambas plataformas
```

### Si insistes en web + móvil MVP paralelo:

```
Contrata: 2 devs + 1 QA
Duración: 8-10 semanas
Costo: +3-4M COP
Riesgo: Alto (ambos proyectos bajo presión)

Prioridades:
1. Infraestructura (Azure)
2. Contenido (palabras)
3. Login/Registro (CRÍTICO para ambos)
4. Dashboard web
5. Dashboard móvil
6. Ejercicios web
7. Ejercicios móvil (simplificados)
8. Testing
```

---

## 📚 RECURSOS FLUTTER RECOMENDADOS

### Librerías esenciales
- `provider` — State management (probado, escalable)
- `http` o `dio` — HTTP client
- `shared_preferences` — Persistencia simple
- `flutter_test` + `mocktail` — Testing

### Tutorials
- https://codewithandrea.com/articles/flutter-state-management-riverpod/
- https://flutter.dev/docs/development/data-and-backend/state-mgmt/intro
- Ejemplos de MVVM + Provider en Flutter

### Plugins específicos Reuven
- `just_audio` — Para reproducir audio ElevenLabs
- `uni_links` — Para deep linking (códigos XXXX-XXXX)
- `firebase_messaging` — Push notifications

---

*Documento generado: Agosto 2026*
*Análisis: Estado prototipo. Recomendación: Postergar a post-MVP web.*
