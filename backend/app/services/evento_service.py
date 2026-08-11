import uuid

from sqlalchemy import func, insert, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.evento import Evento
from app.schemas.evento import BatchInsertResult, EventoIn

CAP = 5_000  # máximo de eventos por perfil (igual que en metrics.js)


async def batch_insert(
    perfil_id: uuid.UUID, eventos: list[EventoIn], db: AsyncSession
) -> BatchInsertResult:
    """Inserta eventos en batch respetando el cap de 5000 por perfil."""
    # Verificar que todos los eventos pertenezcan al perfil_id del path
    filtered = [e for e in eventos if e.perfil_id == perfil_id]

    count_result = await db.execute(
        select(func.count()).select_from(Evento).where(Evento.perfil_id == perfil_id)
    )
    current = count_result.scalar() or 0
    available = max(0, CAP - current)
    to_insert = filtered[:available]
    descartados = len(eventos) - len(to_insert)

    if to_insert:
        await db.execute(
            insert(Evento),
            [
                {
                    "perfil_id": e.perfil_id,
                    "task_num": e.task_num,
                    "tipo": e.tipo,
                    "ts": e.ts,
                    "payload": e.payload,
                }
                for e in to_insert
            ],
        )
        await db.commit()

    return BatchInsertResult(insertados=len(to_insert), descartados=descartados)
