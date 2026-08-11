"""Endpoints de administración — solo disponibles en entornos no-producción."""

import uuid
from datetime import UTC, datetime, timedelta
from random import random, randint

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import insert, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import DbDep
from app.config import settings
from app.core.codes import gen_code, strip_dash
from app.models import CodigoVinculacion, Evento, Perfil, TutoresPerfil, Usuario, Vinculo
from app.models.refresh_token import RefreshToken
from app.schemas.evento import EventoIn
from app.services.auth_service import register
from app.schemas.auth import RegisterRequest

router = APIRouter(prefix="/admin", tags=["admin"])


def _guard():
    if settings.is_production:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No disponible en producción")


TASKS_META = [
    {"num": 1, "nombre": "Vocales"},
    {"num": 2, "nombre": "Escribir"},
    {"num": 3, "nombre": "Huecos"},
    {"num": 4, "nombre": "Ordenar"},
    {"num": 5, "nombre": "Sílabas"},
    {"num": 6, "nombre": "Sonido /rr/"},
    {"num": 7, "nombre": "Unir"},
    {"num": 8, "nombre": "Colorear"},
]
ITEMS_POR_TAREA = {
    1: ["SOL", "CASA", "GATO"], 2: ["OVEJA", "PATO", "CASA"],
    3: ["PATO", "MESA", "CASA"], 4: ["SOPA", "PALA", "PITO"],
    5: ["SOL", "PALA", "OVEJA", "ELEFANTE"], 6: ["RATÓN", "ROSA", "REGLA", "RÍO"],
    7: ["TORRE", "PATO", "MESA"], 8: ["PALA", "TORRE", "OVEJA"],
}


def _gen_eventos(perfil_id: uuid.UUID, tasa: float, hasta: int, dias: int) -> list[dict]:
    """Genera eventos sintéticos — porto de seed.js:generarEventos()."""
    from random import choice
    now = datetime.now(UTC)
    day = timedelta(days=1)
    events = []
    for d in range(dias - 1, -1, -1):
        practicar = random() < 0.85
        if not practicar:
            continue
        num_sesiones = max(1, round(1.5 + (random() - 0.5)))
        factor = (1 - d / dias) * 0.15
        acierto_esperado = min(0.97, max(0.3, tasa + factor))
        for _ in range(num_sesiones):
            task_num = randint(1, hasta)
            items = ITEMS_POR_TAREA[task_num]
            hora_inicio = now - timedelta(days=d, hours=randint(2, 10), minutes=randint(0, 59))
            intentos = randint(4, 12)
            events.append({"perfil_id": perfil_id, "task_num": task_num, "tipo": "task_start",
                           "ts": hora_inicio, "payload": None})
            ok_count = 0
            for i in range(intentos):
                correcto = random() < acierto_esperado
                if correcto:
                    ok_count += 1
                events.append({
                    "perfil_id": perfil_id, "task_num": task_num,
                    "tipo": "attempt_ok" if correcto else "attempt_fail",
                    "ts": hora_inicio + timedelta(seconds=(i + 1) * randint(8, 25)),
                    "payload": {"item": choice(items)},
                })
            duracion_ms = (intentos + 1) * randint(8, 25) * 1000
            completada = ok_count >= 3 and ok_count > (intentos - ok_count)
            events.append({
                "perfil_id": perfil_id, "task_num": task_num, "tipo": "task_end",
                "ts": hora_inicio + timedelta(milliseconds=duracion_ms),
                "payload": {"completada": completada, "duracionMs": duracion_ms},
            })
    return events


@router.post("/seed", status_code=201)
async def seed_demo(db: DbDep):
    """Crea 3 familias, 3 profesionales, 4 menores con 14 días de eventos sintéticos."""
    _guard()

    ninos_cfg = [
        {"nombre": "Liam",  "emoji": "🦊", "es_nino": True,  "tasa": 0.78, "hasta": 6},
        {"nombre": "Ellie", "emoji": "🐱", "es_nino": False, "tasa": 0.45, "hasta": 3},
        {"nombre": "Mateo", "emoji": "🐘", "es_nino": True,  "tasa": 0.92, "hasta": 8},
    ]
    familias_cfg = [
        {"nombre": "Marta García", "email": "marta@familia.com", "relacion": "madre", "p_nombre": "Liam"},
        {"nombre": "Pablo Martín", "email": "pablo@familia.com", "relacion": "padre", "p_nombre": "Ellie"},
        {"nombre": "Lucía López",  "email": "lucia@familia.com", "relacion": "madre", "p_nombre": "Mateo"},
    ]
    profes_cfg = [
        {"nombre": "Dra. Carmen Ruiz", "email": "carmen@reuven.edu", "profesion": "logopeda",
         "centro": "Reuven Feuerstein", "colegiado": "28/4521", "vincula": ["Liam","Ellie","Mateo"]},
        {"nombre": "María Sanz", "email": "maria@reuven.edu", "profesion": "docente",
         "centro": "Reuven Feuerstein", "colegiado": "", "vincula": ["Liam","Ellie"]},
        {"nombre": "Javier Pérez", "email": "javier@reuven.edu", "profesion": "psicologo",
         "centro": "Consulta privada", "colegiado": "11/2024", "vincula": ["Mateo"]},
    ]

    # 1) Perfiles
    perfiles: dict[str, Perfil] = {}
    for cfg in ninos_cfg:
        p = Perfil(nombre=cfg["nombre"], emoji=cfg["emoji"], es_nino=cfg["es_nino"])  # type: ignore[arg-type]
        db.add(p)
        await db.flush()
        perfiles[cfg["nombre"]] = p

    # 2) Tutores
    tutores: dict[str, Usuario] = {}
    for fc in familias_cfg:
        try:
            u = await register(RegisterRequest(
                email=fc["email"], password="demo12345",
                nombre=fc["nombre"], rol="tutor", relacion=fc["relacion"],
            ), db)
        except Exception:
            from sqlalchemy import select
            u = await db.scalar(select(Usuario).where(Usuario.email == fc["email"]))  # type: ignore[assignment]
        tutores[fc["p_nombre"]] = u  # type: ignore[assignment]
        link = TutoresPerfil(tutor_id=u.id, perfil_id=perfiles[fc["p_nombre"]].id)
        db.add(link)
        # Generar código
        code = gen_code().replace("-", "")
        db.add(CodigoVinculacion(
            code=code, tutor_id=u.id, perfil_id=perfiles[fc["p_nombre"]].id,
            expira_en=datetime.now(UTC) + timedelta(days=30),
        ))

    # 3) Profesionales
    for pc in profes_cfg:
        try:
            pro = await register(RegisterRequest(
                email=pc["email"], password="demo12345", nombre=pc["nombre"],
                rol="profesional", profesion=pc["profesion"], centro=pc["centro"],
                colegiado=pc["colegiado"] or None,
            ), db)
        except Exception:
            from sqlalchemy import select
            pro = await db.scalar(select(Usuario).where(Usuario.email == pc["email"]))  # type: ignore[assignment]
        for nombre in pc["vincula"]:
            if nombre in perfiles:
                db.add(Vinculo(profesional_id=pro.id, perfil_id=perfiles[nombre].id, via="directo"))

    await db.commit()

    # 4) Eventos
    all_events: list[dict] = []
    for cfg in ninos_cfg:
        p = perfiles[cfg["nombre"]]
        all_events.extend(_gen_eventos(p.id, cfg["tasa"], cfg["hasta"], 14))

    all_events.sort(key=lambda e: e["ts"])
    if all_events:
        await db.execute(insert(Evento), all_events)
        await db.commit()

    return {"mensaje": "Demo sembrada", "perfiles": len(perfiles), "eventos": len(all_events)}


# ──────────────────────────────────────────────────────────────────────────────
# MIGRACIÓN: importar datos de localStorage
# ──────────────────────────────────────────────────────────────────────────────

from pydantic import BaseModel
from typing import Any


class LocalStorageImport(BaseModel):
    perfiles: list[dict[str, Any]] = []
    eventos: list[dict[str, Any]]  = []
    adultos: list[dict[str, Any]]  = []
    vinculos: list[dict[str, Any]] = []
    dry_run: bool = False
    tutor_email: str  # email del tutor que importa (ya autenticado)


@router.post("/migration/import")
async def import_from_localstorage(body: LocalStorageImport, db: DbDep):
    """
    Importa datos exportados desde el localStorage de la versión HTML.
    Requiere que el tutor ya esté registrado (tutor_email).
    Time-limited: deshabilitar este endpoint tras el período de migración.
    """
    _guard()
    from sqlalchemy import select

    tutor = await db.scalar(select(Usuario).where(Usuario.email == body.tutor_email.lower()))
    if not tutor:
        raise HTTPException(400, "Tutor no encontrado. Regístrate primero.")

    if body.dry_run:
        return {
            "dry_run": True,
            "perfiles_a_importar": len(body.perfiles),
            "eventos_a_importar": len(body.eventos),
        }

    # Crear perfiles e ID mapping (localStorage id → nuevo UUID)
    id_map: dict[str, uuid.UUID] = {}
    for p in body.perfiles:
        perfil = Perfil(
            nombre=p.get("nombre", "Sin nombre"),
            emoji=p.get("emoji", "🐻"),
            es_nino=bool(p.get("esNino", True)),
        )
        db.add(perfil)
        await db.flush()
        link = TutoresPerfil(tutor_id=tutor.id, perfil_id=perfil.id)
        db.add(link)
        id_map[p["id"]] = perfil.id

    # Importar eventos mapeando perfilId
    events_to_insert = []
    for e in body.eventos:
        mapped_id = id_map.get(e.get("perfilId", ""))
        if not mapped_id:
            continue
        task_num = e.get("taskNum") or e.get("task_num")
        tipo = e.get("tipo", "")
        if not task_num or tipo not in ("task_start","task_end","attempt_ok","attempt_fail"):
            continue
        ts_raw = e.get("ts")
        if isinstance(ts_raw, (int, float)):
            ts = datetime.fromtimestamp(ts_raw / 1000, tz=UTC)
        else:
            ts = datetime.now(UTC)
        events_to_insert.append({
            "perfil_id": mapped_id,
            "task_num": int(task_num),
            "tipo": tipo,
            "ts": ts,
            "payload": e.get("payload"),
        })

    if events_to_insert:
        await db.execute(insert(Evento), events_to_insert[:5000])

    await db.commit()
    return {
        "perfiles_importados": len(id_map),
        "eventos_importados": len(events_to_insert),
    }
