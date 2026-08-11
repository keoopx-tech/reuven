# 🚀 EJECUTAR REUVEN LOCAL: Backend + Frontend

**Objetivo:** Tener Reuven funcionando en tu máquina (localhost)

**Tiempo:** 5-10 minutos

---

## 📋 Requisitos (que ya tienes)

- ✅ Python 3.12+ (tienes 3.14.0)
- ✅ Node.js (tienes v24.11.1)
- ✅ npm (tienes 11.6.2)

---

## 🏃 Opción Rápida: Dos terminales

### Terminal 1: BACKEND (FastAPI)

```bash
cd c:\Users\Usuario\Documents\pydocs\Reuven\backend
python -m venv venv
venv\Scripts\activate
pip install -e .
uvicorn app.main:app --reload --port 8000
```

**Qué ves:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

Luego puedes visitar:
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### Terminal 2: FRONTEND (React)

```bash
cd c:\Users\Usuario\Documents\pydocs\Reuven\frontend
npm install
npm run dev
```

**Qué ves:**
```
  VITE v5.3.3  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h + enter to show help
```

Luego abre en navegador:
- App: http://localhost:5173/

---

## 📊 Verificación: ¿Todo funciona?

### ✅ Backend está listo si ves:

```
GET    /health          {"status": "ok", "version": "0.1.0"}
```

En http://localhost:8000/health deberías ver:
```json
{
  "status": "ok",
  "version": "0.1.0"
}
```

### ✅ Frontend está listo si ves:

```
✓ built in 1.23s
```

Y en http://localhost:5173/ ves:
- Logo Reuven (RF en gradiente)
- Landing page
- Botón Login / Registro

---

## 🎯 Flujo completo (5 minutos)

### Paso 1: Abre 2 terminales (PowerShell)

**Terminal 1 (para Backend):**
```bash
cd c:\Users\Usuario\Documents\pydocs\Reuven\backend
```

**Terminal 2 (para Frontend):**
```bash
cd c:\Users\Usuario\Documents\pydocs\Reuven\frontend
```

---

### Paso 2: BACKEND - Instala dependencias

**En Terminal 1:**

```bash
python -m venv venv
```

Espera 10 segundos.

```bash
venv\Scripts\activate
```

Deberías ver `(venv)` al inicio de la línea. Luego:

```bash
pip install -e .
```

Esto instala FastAPI, SQLAlchemy, etc. Espera 1-2 minutos.

Finalmente:

```bash
uvicorn app.main:app --reload --port 8000
```

**Espera a ver:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

✅ **Backend listo. Deja esta terminal corriendo.**

---

### Paso 3: FRONTEND - Instala dependencias

**En Terminal 2:**

```bash
npm install
```

Espera 1-2 minutos. Esto descarga React, Vite, Tailwind, etc.

Luego:

```bash
npm run dev
```

**Espera a ver:**
```
➜  Local:   http://localhost:5173/
```

✅ **Frontend listo. Deja esta terminal corriendo.**

---

### Paso 4: Abre el navegador

Ve a: **http://localhost:5173/**

🎉 **¡Ves Reuven Frontend funcionando!**

---

## 🧪 Pruebas rápidas

### En el Frontend (http://localhost:5173/):

1. **Haz click en "Login"** o **"Registrarse"**
   - ¿Ves el formulario de login?
   - ¿Se validan los campos?

2. **Intenta registrar un usuario:**
   - Email: `test@example.com`
   - Password: `Password123!`
   - ¿Ves respuesta del backend?

3. **Ve a http://localhost:8000/docs**
   - ¡Ves la documentación interactiva de FastAPI!
   - Puedes probar endpoints desde ahí

---

## 🔗 URLs útiles

| URL | Qué es |
|-----|--------|
| http://localhost:5173/ | **Frontend React** (app) |
| http://localhost:8000/ | Backend raíz (redirige a /docs) |
| http://localhost:8000/docs | **Swagger UI** (documentación API interactiva) |
| http://localhost:8000/redoc | ReDoc (documentación alternativa) |
| http://localhost:8000/health | Health check del backend |

---

## 📱 Interacciones que puedes probar

### En http://localhost:5173/

- [ ] Click en "Login" → Abre modal de login
- [ ] Click en "Registrarse" → Abre modal de registro
- [ ] Rellenar email y password → Validación en vivo
- [ ] Submit → Solicitud HTTP al backend
- [ ] Ver respuesta → ¿Error o success?
- [ ] Cambiar tema (botón arriba a la derecha) → Dark mode

### En http://localhost:8000/docs (Swagger UI)

- [ ] Click en un endpoint (ej: `POST /auth/register`)
- [ ] Haz click en "Try it out"
- [ ] Ingresa datos en el formulario
- [ ] Click en "Execute"
- [ ] ¡Ves la respuesta del backend en vivo!

---

## 🆘 Troubleshooting

### Puerto 8000 ya está en uso

```bash
# Usa otro puerto
uvicorn app.main:app --reload --port 8001
```

Luego actualiza la URL del frontend en `frontend/.env.local`:
```
VITE_API_URL=http://localhost:8001
```

### Puerto 5173 ya está en uso

```bash
# Especifica otro puerto
npm run dev -- --port 3000
```

### "ModuleNotFoundError: No module named 'fastapi'"

Asegúrate de:
1. Estar en la carpeta `backend/`
2. Virtual env activado: `(venv)` en la terminal
3. Dependencias instaladas: `pip install -e .`

### "Cannot find module 'react'"

Asegúrate de:
1. Estar en la carpeta `frontend/`
2. `npm install` completado
3. Ver carpeta `node_modules/`

### "Connection refused" en frontend

El backend no está corriendo. Verifica:
1. Terminal 1 tiene `(venv)` activado
2. `uvicorn app.main:app --reload --port 8000` está ejecutándose
3. Ves: "Uvicorn running on http://127.0.0.1:8000"

---

## 🎮 Comandos útiles

### Backend

```bash
# Activar virtual env (Windows)
venv\Scripts\activate

# Activar virtual env (Mac/Linux)
source venv/bin/activate

# Desactivar virtual env
deactivate

# Instalar dependencias de desarrollo (con tests)
pip install -e ".[dev]"

# Ejecutar tests
pytest

# Ver logs detallados
uvicorn app.main:app --reload --log-level debug
```

### Frontend

```bash
# Instalar dependencias
npm install

# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Linter
npm run lint
```

---

## 📊 Estado del proyecto

### Backend ✅
- ✅ FastAPI app funcional
- ✅ Modelos SQLAlchemy definidos
- ✅ Auth JWT implementado
- ✅ 7 routers (auth, perfiles, códigos, vinculos, métricas, profesional, admin)
- ✅ Documentación Swagger automática

### Frontend ✅
- ✅ React 18 + TypeScript
- ✅ Vite (build tool ultra rápido)
- ✅ Tailwind CSS
- ✅ TanStack Query (data fetching)
- ✅ React Router (navegación)
- ✅ Formularios funcionales

### Falta para MVP web 🔴
- Database PostgreSQL (local o Azure)
- Deploy a Azure
- Content (50-100 palabras)
- Testing E2E
- Documentación deployment

---

## 🚀 Próximo paso

Una vez que veas ambos funcionando:

1. **Prueba un login/registro real** en http://localhost:5173/
2. **Mira qué endpoint se llama** en DevTools (F12 → Network)
3. **Ve a http://localhost:8000/docs** y prueba ese endpoint manualmente
4. **Entiende el flujo:** Frontend → HTTP → Backend → Database (cuando esté lista)

---

## 📝 Notas

- **Hot reload:** Ambas apps se actualizan si cambias código (sin reabrir navegador)
- **Logs en tiempo real:** Verás requests HTTP en las terminales
- **DevTools:** Abre F12 en el navegador para ver requests/responses

---

**¡Disfruta viendo Reuven funcionando en tu máquina! 🎉**
