# 🚀 Guía de despliegue: Reuven a producción

**Arquitectura:** Frontend en Vercel · Backend en Render · Base de datos en Neon (todo con capa gratuita)

```
┌─────────────────────┐        ┌──────────────────────┐        ┌─────────────────┐
│   Vercel             │  HTTP  │   Render                │  SQL   │   Neon           │
│   (Frontend React)   │───────▶│   (Backend FastAPI)    │───────▶│   (PostgreSQL)   │
└─────────────────────┘        └──────────────────────┘        └─────────────────┘
```

**Por qué no todo en Vercel:** el backend usa un pool de conexiones persistente (SQLAlchemy) y migraciones (Alembic) — necesita un proceso Python corriendo 24/7, no funciones serverless que se apagan entre requests.

---

## Paso 0: Subir el proyecto a GitHub (prerequisito)

Vercel y Render despliegan **desde un repositorio git**. Este proyecto todavía no es uno. Ya preparé un `.gitignore` en la raíz (excluye `venv/`, `node_modules/`, `.env`, la base de datos local, etc.).

```powershell
cd c:\Users\Usuario\Documents\pydocs\Reuven
git init
git add .
git commit -m "Initial commit"
```

Luego crea un repo vacío en https://github.com/new (sin README, sin .gitignore — ya los tienes) y:

```powershell
git remote add origin https://github.com/TU_USUARIO/reuven.git
git branch -M main
git push -u origin main
```

> ⚠️ **Antes de esto**, decide qué hacer con dos cosas pesadas en la carpeta:
> - `template-demo/` (2156 archivos, la plantilla Ecme que usamos de referencia visual) — probablemente no quieres versionarla junto con Reuven
> - `refero.design ....jpg` (22MB, en la raíz) — un mockup suelto
>
> Puedes agregarlos al `.gitignore` si no los necesitas en el repo, o moverlos fuera de esta carpeta antes del `git init`.

---

## Paso 1: Base de datos — Neon

1. Crea cuenta en https://neon.tech (gratis, no pide tarjeta)
2. **New Project** → nombre `reuven` → región cercana a tus usuarios
3. Neon te da un connection string tipo:
   ```
   postgresql://usuario:password@ep-xxx.us-east-2.aws.neon.tech/reuven?sslmode=require
   ```
4. **Cámbialo** al formato que usa nuestro driver async (`asyncpg`, no `psycopg2`):
   ```
   postgresql+asyncpg://usuario:password@ep-xxx.us-east-2.aws.neon.tech/reuven?ssl=require
   ```
   Dos cambios: `postgresql://` → `postgresql+asyncpg://`, y `sslmode=require` → `ssl=require` (asyncpg usa un nombre de parámetro distinto).
5. Guarda este valor — lo necesitas en el paso 2.

---

## Paso 2: Backend — Render

1. Crea cuenta en https://render.com (gratis) y conecta tu GitHub
2. **New +** → **Blueprint** → selecciona el repo `reuven`
3. Render detecta automáticamente `backend/render.yaml` (ya está listo en el repo) y propone crear el servicio `reuven-api`
4. Antes de confirmar, Render te pide rellenar las variables marcadas `sync: false`:

   | Variable | Valor |
   |---|---|
   | `DATABASE_URL` | El connection string de Neon del paso 1 (con `+asyncpg` y `ssl=require`) |
   | `JWT_SECRET` | `w-dJm8wF_4VHLDwIhGqFxPF0vQ6Qe4CeLUeDOUY9lrtxwrqLeW_BqBuCbMEOdJuF` (generado para ti — o genera el tuyo: `python -c "import secrets; print(secrets.token_urlsafe(48))"`) |
   | `CORS_ORIGINS` | Déjalo vacío por ahora — lo rellenas en el Paso 4, después de tener la URL de Vercel |

5. **Apply** → Render instala dependencias, corre `alembic upgrade head` contra Neon, y levanta `uvicorn`
6. Cuando termine, prueba: `https://reuven-api.onrender.com/health` → debe responder `{"status":"ok"}`

> 💡 El plan gratis de Render "duerme" el servicio tras 15 min sin tráfico — el primer request después de dormir tarda ~30-50s en despertar. Normal para un MVP/demo; para producción real conviene el plan pago (~$7/mes) que no duerme.

---

## Paso 3: Frontend — Vercel

1. Crea cuenta en https://vercel.com y conecta tu GitHub
2. **Add New** → **Project** → selecciona el repo `reuven`
3. **Root Directory**: cámbialo a `frontend` (importante — el repo tiene backend y frontend juntos)
4. Vercel detecta Vite automáticamente (build command `npm run build`, output `dist`)
5. Antes de desplegar, agrega la variable de entorno:

   | Variable | Valor |
   |---|---|
   | `VITE_API_URL` | `https://reuven-api.onrender.com` (la URL de tu backend en Render, del paso 2) |

6. **Deploy** — en ~1 minuto tienes tu URL: `https://reuven-xxxx.vercel.app`

El `vercel.json` que ya está en `frontend/` le dice a Vercel que redirija todas las rutas a `index.html`, necesario para que React Router funcione en rutas como `/dashboard` o `/perfil/:id` al recargar la página.

---

## Paso 4: Conectar CORS (el último cable)

Ahora que tienes la URL real de Vercel, vuelve a Render:

1. `reuven-api` → **Environment** → edita `CORS_ORIGINS`:
   ```
   ["https://reuven-xxxx.vercel.app"]
   ```
2. Guarda — Render redespliega automáticamente (~1 min)

---

## Paso 5: Sembrar datos de prueba en producción

Con el backend ya desplegado y conectado a Neon (base de datos vacía), llama una vez al endpoint de seed:

```bash
curl -X POST https://reuven-api.onrender.com/admin/seed
```

> ⚠️ Este endpoint solo funciona si `ENVIRONMENT != production` — pero lo pusimos en `production` en el render.yaml. Si quieres datos demo en el entorno productivo, cambia temporalmente `ENVIRONMENT` a `development` en Render, corre el seed, y vuelve a `production`. Para un cliente real, no querrás este endpoint accesible en absoluto — considera eliminarlo o protegerlo antes de un lanzamiento real (ahora mismo `admin.py` solo lo bloquea por el flag de entorno, no por autenticación).

---

## ✅ Checklist final

- [ ] Repo en GitHub (sin `template-demo/`, sin el JPG de 22MB, sin secretos)
- [ ] Neon: base de datos creada, connection string con `+asyncpg` y `ssl=require`
- [ ] Render: `reuven-api` desplegado, `/health` responde OK
- [ ] Vercel: frontend desplegado, `VITE_API_URL` apunta a Render
- [ ] Render: `CORS_ORIGINS` apunta a la URL de Vercel
- [ ] Probar login real desde la URL de Vercel (no localhost)

---

## Referencia rápida de variables

**Backend (Render)**
```
DATABASE_URL=postgresql+asyncpg://...@....neon.tech/reuven?ssl=require
JWT_SECRET=<generado con secrets.token_urlsafe(48)>
CORS_ORIGINS=["https://tu-app.vercel.app"]
ENVIRONMENT=production
```

**Frontend (Vercel)**
```
VITE_API_URL=https://reuven-api.onrender.com
```
