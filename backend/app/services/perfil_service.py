import uuid

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import Forbidden, NotFound
from app.models.perfil import Perfil, TutoresPerfil
from app.models.usuario import Usuario
from app.schemas.perfil import PerfilCreate, PerfilUpdate


async def get_perfiles_de_tutor(tutor_id: uuid.UUID, db: AsyncSession) -> list[Perfil]:
    result = await db.execute(
        select(Perfil)
        .join(TutoresPerfil, TutoresPerfil.perfil_id == Perfil.id)
        .where(TutoresPerfil.tutor_id == tutor_id, Perfil.activo.is_(True))
        .order_by(Perfil.creado_en)
    )
    return list(result.scalars())


async def create_perfil(tutor_id: uuid.UUID, data: PerfilCreate, db: AsyncSession) -> Perfil:
    perfil = Perfil(**data.model_dump())
    db.add(perfil)
    await db.flush()
    link = TutoresPerfil(tutor_id=tutor_id, perfil_id=perfil.id)
    db.add(link)
    await db.commit()
    await db.refresh(perfil)
    return perfil


async def get_perfil(perfil_id: uuid.UUID, db: AsyncSession) -> Perfil:
    perfil = await db.get(Perfil, perfil_id)
    if not perfil or not perfil.activo:
        raise NotFound("Perfil no encontrado")
    return perfil


async def assert_tutor_owns(tutor_id: uuid.UUID, perfil_id: uuid.UUID, db: AsyncSession) -> None:
    link = await db.scalar(
        select(TutoresPerfil).where(
            TutoresPerfil.tutor_id == tutor_id,
            TutoresPerfil.perfil_id == perfil_id,
        )
    )
    if not link:
        raise Forbidden("No tienes acceso a este perfil")


async def update_perfil(perfil: Perfil, data: PerfilUpdate, db: AsyncSession) -> Perfil:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(perfil, field, value)
    await db.commit()
    await db.refresh(perfil)
    return perfil


async def delete_perfil(perfil: Perfil, db: AsyncSession) -> None:
    # Los eventos se borran via trigger en PostgreSQL
    perfil.activo = False
    await db.commit()
