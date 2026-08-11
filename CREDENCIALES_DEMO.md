# 🔑 Credenciales de acceso — Datos de demostración

**Base de datos:** `backend/reuven.db` (SQLite local)
**Última carga de datos:** Agosto 2026 via `POST /admin/seed`

---

## 📊 Estado de la base de datos

| Tabla | Registros |
|---|---|
| Usuarios | 6 (3 tutores + 3 profesionales) |
| Perfiles (niños) | 3 |
| Eventos (14 días históricos) | 550 |
| Vínculos profesional↔niño | 6 |
| Vínculos tutor↔niño | 3 |

---

## 👨‍👩‍👧 Tutores (familias)

| Email | Password | Niño vinculado |
|---|---|---|
| `marta@familia.com` | `demo12345` | Liam 🦊 |
| `pablo@familia.com` | `demo12345` | Ellie 🐱 |
| `lucia@familia.com` | `demo12345` | Mateo 🐘 |

## 🎓 Profesionales

| Email | Password | Profesión | Estudiantes vinculados |
|---|---|---|---|
| `carmen@reuven.edu` | `demo12345` | Logopeda | Liam, Ellie, Mateo |
| `maria@reuven.edu` | `demo12345` | Docente | Liam, Ellie |
| `javier@reuven.edu` | `demo12345` | Psicólogo | Mateo |

---

## 🚀 Cómo levantar el proyecto local

### Backend (FastAPI)
```powershell
cd c:\Users\Usuario\Documents\pydocs\Reuven\backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
- Health check: http://localhost:8000/health
- Swagger docs: http://localhost:8000/docs

### Frontend (React)
```powershell
cd c:\Users\Usuario\Documents\pydocs\Reuven\frontend
npm run dev
```
- App: http://localhost:5173/

### Re-sembrar datos de prueba (si se borra la BD)
```powershell
# 1. Aplicar migraciones
cd backend
alembic upgrade head

# 2. Con el servidor corriendo, ejecutar seed
curl -X POST http://localhost:8000/admin/seed -H "Content-Type: application/json" -d '{}'
```

---

## 🛠️ Fixes aplicados para compatibilidad SQLite

Estos cambios permiten usar **SQLite en desarrollo** y **PostgreSQL en producción** con el mismo código:

1. **`app/models/usuario.py`, `perfil.py`, `codigo.py`, `refresh_token.py`, `vinculo.py`**
   Reemplazado `postgresql.UUID(as_uuid=True)` → `sa.Uuid(as_uuid=True)` (tipo genérico SQLAlchemy 2.0).

2. **`app/models/evento.py`**
   - `payload`: `postgresql.JSONB` → `JSON().with_variant(JSONB, "postgresql")` (JSON genérico en SQLite, JSONB en Postgres)
   - `id`: `BigInteger` → `BigInteger().with_variant(Integer, "sqlite")` (SQLite solo autoincrementa `rowid` si el tipo es exactamente `INTEGER`)

3. **`pyproject.toml`**
   Agregado: `bcrypt==4.0.1` (fijado — `passlib` está abandonado y rompe con `bcrypt>=4.1`), `email-validator`, `aiosqlite`.

4. **`backend/.env`**
   `DATABASE_URL=sqlite+aiosqlite:///./reuven.db`

---

*Nota: estas credenciales son solo para desarrollo local. Nunca usar `demo12345` en producción.*
