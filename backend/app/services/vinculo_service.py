import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFound
from app.models.perfil import Perfil
from app.models.vinculo import Vinculo


async def get_perfiles_de_profesional(profesional_id: uuid.UUID, db: AsyncSession) -> list[Perfil]:
    result = await db.execute(
        select(Perfil)
        .join(Vinculo, Vinculo.perfil_id == Perfil.id)
        .where(Vinculo.profesional_id == profesional_id, Perfil.activo.is_(True))
        .order_by(Perfil.nombre)
    )
    return list(result.scalars())


async def vincular_directo(profesional_id: uuid.UUID, perfil_id: uuid.UUID, db: AsyncSession) -> Vinculo:
    from app.core.exceptions import Conflict
    from sqlalchemy import select

    existing = await db.scalar(
        select(Vinculo).where(
            Vinculo.profesional_id == profesional_id,
            Vinculo.perfil_id == perfil_id,
        )
    )
    if existing:
        raise Conflict("Ya existe ese vínculo.")
    vinculo = Vinculo(profesional_id=profesional_id, perfil_id=perfil_id, via="directo")
    db.add(vinculo)
    await db.commit()
    return vinculo


async def desvincular(profesional_id: uuid.UUID, perfil_id: uuid.UUID, db: AsyncSession) -> None:
    vinculo = await db.scalar(
        select(Vinculo).where(
            Vinculo.profesional_id == profesional_id,
            Vinculo.perfil_id == perfil_id,
        )
    )
    if not vinculo:
        raise NotFound("Vínculo no encontrado.")
    await db.delete(vinculo)
    await db.commit()


async def assert_profesional_linked(
    profesional_id: uuid.UUID, perfil_id: uuid.UUID, db: AsyncSession
) -> None:
    from app.core.exceptions import Forbidden

    vinculo = await db.scalar(
        select(Vinculo).where(
            Vinculo.profesional_id == profesional_id,
            Vinculo.perfil_id == perfil_id,
        )
    )
    if not vinculo:
        raise Forbidden("No tienes acceso a este perfil.")
