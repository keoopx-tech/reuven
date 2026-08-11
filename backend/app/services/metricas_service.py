"""Puerto de las 4 funciones de cómputo de metrics.js.

Agrega en Python en vez de SQL crudo específico de un dialecto: las consultas
originales usaban sintaxis exclusiva de PostgreSQL (casts `::tipo`, operador
JSONB `->>`, `AT TIME ZONE`, `INTERVAL`) que no existe en SQLite. Con el
volumen de eventos de esta app (cientos por perfil, no millones), traer los
eventos con una consulta simple y agregar en Python es igual de rápido y
funciona igual en SQLite (desarrollo) y PostgreSQL (producción).
"""

import uuid
from datetime import UTC, date, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.evento import Evento
from app.schemas.metricas import ActividadOut, ResumenOut, SerieTemporalOut, SesionOut

TASKS = [
    {"num": 1, "nombre": "Vocales",     "color": "#ef4444"},
    {"num": 2, "nombre": "Escribir",    "color": "#eab308"},
    {"num": 3, "nombre": "Huecos",      "color": "#3b82f6"},
    {"num": 4, "nombre": "Ordenar",     "color": "#22c55e"},
    {"num": 5, "nombre": "Sílabas",     "color": "#f97316"},
    {"num": 6, "nombre": "Sonido /rr/", "color": "#ec4899"},
    {"num": 7, "nombre": "Unir",        "color": "#0d9488"},
    {"num": 8, "nombre": "Colorear",    "color": "#8b5cf6"},
]


def _to_utc(ts: datetime) -> datetime:
    """Normaliza a datetime consciente de zona horaria en UTC.

    SQLite no preserva tzinfo al ir y volver de la base de datos; PostgreSQL sí.
    """
    if ts.tzinfo is None:
        return ts.replace(tzinfo=UTC)
    return ts.astimezone(UTC)


async def _eventos_perfil(perfil_id: uuid.UUID, db: AsyncSession) -> list[Evento]:
    result = await db.execute(select(Evento).where(Evento.perfil_id == perfil_id))
    return list(result.scalars().all())


async def get_resumen(perfil_id: uuid.UUID, db: AsyncSession) -> ResumenOut:
    """Puerto de metrics.js:getResumen()."""
    eventos = await _eventos_perfil(perfil_id, db)

    aciertos = sum(1 for e in eventos if e.tipo == "attempt_ok")
    fallidos = sum(1 for e in eventos if e.tipo == "attempt_fail")
    completadas = sum(
        1 for e in eventos
        if e.tipo == "task_end" and e.payload and e.payload.get("completada")
    )
    tiempo_ms = sum(
        e.payload.get("duracionMs", 0) or 0
        for e in eventos
        if e.tipo == "task_end" and e.payload and e.payload.get("duracionMs") is not None
    )

    total = aciertos + fallidos
    tasa = round((aciertos / total) * 100) if total else 0
    return ResumenOut(
        perfil_id=perfil_id,
        aciertos=aciertos,
        fallidos=fallidos,
        completadas=completadas,
        tiempo_ms=tiempo_ms,
        tasa_acierto=tasa,
    )


async def get_por_actividad(perfil_id: uuid.UUID, db: AsyncSession) -> list[ActividadOut]:
    """Puerto de metrics.js:getPorActividad() — agrupado por task_num."""
    eventos = await _eventos_perfil(perfil_id, db)

    stats: dict[int, dict[str, int]] = {
        t["num"]: {"aciertos": 0, "fallidos": 0, "tiempo_ms": 0, "sesiones": 0, "completadas": 0}
        for t in TASKS
    }
    for e in eventos:
        row = stats.get(e.task_num)
        if row is None:
            continue
        if e.tipo == "attempt_ok":
            row["aciertos"] += 1
        elif e.tipo == "attempt_fail":
            row["fallidos"] += 1
        elif e.tipo == "task_end":
            row["sesiones"] += 1
            if e.payload:
                if e.payload.get("completada"):
                    row["completadas"] += 1
                dur = e.payload.get("duracionMs")
                if dur is not None:
                    row["tiempo_ms"] += dur

    return [
        ActividadOut(
            task_num=t["num"],
            nombre=t["nombre"],
            color=t["color"],
            **stats[t["num"]],
        )
        for t in TASKS
    ]


async def get_serie_temporal(
    perfil_id: uuid.UUID, dias: int, db: AsyncSession
) -> list[SerieTemporalOut]:
    """Puerto de metrics.js:getSerieTemporal() — aciertos/fallos por día."""
    today = datetime.now(UTC).date()
    start = today - timedelta(days=dias - 1)

    eventos = await _eventos_perfil(perfil_id, db)

    por_dia: dict[date, dict[str, int]] = {}
    for e in eventos:
        if e.tipo not in ("attempt_ok", "attempt_fail"):
            continue
        d = _to_utc(e.ts).date()
        if d < start:
            continue
        row = por_dia.setdefault(d, {"aciertos": 0, "fallidos": 0})
        row["aciertos" if e.tipo == "attempt_ok" else "fallidos"] += 1

    serie = []
    for i in range(dias):
        d = start + timedelta(days=i)
        row = por_dia.get(d, {"aciertos": 0, "fallidos": 0})
        serie.append(SerieTemporalOut(fecha=str(d), aciertos=row["aciertos"], fallidos=row["fallidos"]))
    return serie


async def get_sesiones(
    perfil_id: uuid.UUID, limite: int, db: AsyncSession
) -> list[SesionOut]:
    """Puerto de metrics.js:getSesiones() — task_end con aciertos/fallos de su ventana."""
    eventos = await _eventos_perfil(perfil_id, db)
    task_map = {t["num"]: t["nombre"] for t in TASKS}

    task_ends = sorted(
        (e for e in eventos if e.tipo == "task_end"),
        key=lambda e: e.ts,
        reverse=True,
    )[:limite]

    attempts = [e for e in eventos if e.tipo in ("attempt_ok", "attempt_fail")]

    sesiones = []
    for te in task_ends:
        duracion_ms = (te.payload or {}).get("duracionMs") or 60000
        completada = bool((te.payload or {}).get("completada"))
        te_ts = _to_utc(te.ts)
        ventana_inicio = te_ts - timedelta(milliseconds=duracion_ms)

        aciertos = fallidos = 0
        for a in attempts:
            if a.task_num != te.task_num:
                continue
            a_ts = _to_utc(a.ts)
            if ventana_inicio <= a_ts <= te_ts:
                if a.tipo == "attempt_ok":
                    aciertos += 1
                else:
                    fallidos += 1

        sesiones.append(
            SesionOut(
                ts=te.ts,
                task_num=te.task_num,
                nombre=task_map.get(te.task_num, f"Tarea {te.task_num}"),
                duracion_ms=duracion_ms,
                aciertos=aciertos,
                fallidos=fallidos,
                completada=completada,
            )
        )
    return sesiones
