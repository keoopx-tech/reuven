import uuid

from fastapi import APIRouter

from app.api.deps import CurrentUser, DbDep, TutorUser
from app.core.exceptions import Forbidden
from app.schemas.perfil import PerfilCreate, PerfilOut, PerfilUpdate
from app.services import perfil_service

router = APIRouter(prefix="/perfiles", tags=["perfiles"])


@router.get("/", response_model=list[PerfilOut])
async def list_perfiles(current_user: TutorUser, db: DbDep):
    return await perfil_service.get_perfiles_de_tutor(current_user.id, db)


@router.post("/", response_model=PerfilOut, status_code=201)
async def create_perfil(data: PerfilCreate, current_user: TutorUser, db: DbDep):
    return await perfil_service.create_perfil(current_user.id, data, db)


@router.get("/{perfil_id}", response_model=PerfilOut)
async def get_perfil(perfil_id: uuid.UUID, current_user: TutorUser, db: DbDep):
    await perfil_service.assert_tutor_owns(current_user.id, perfil_id, db)
    return await perfil_service.get_perfil(perfil_id, db)


@router.patch("/{perfil_id}", response_model=PerfilOut)
async def update_perfil(perfil_id: uuid.UUID, data: PerfilUpdate, current_user: TutorUser, db: DbDep):
    await perfil_service.assert_tutor_owns(current_user.id, perfil_id, db)
    perfil = await perfil_service.get_perfil(perfil_id, db)
    return await perfil_service.update_perfil(perfil, data, db)


@router.delete("/{perfil_id}", status_code=204)
async def delete_perfil(perfil_id: uuid.UUID, current_user: TutorUser, db: DbDep):
    await perfil_service.assert_tutor_owns(current_user.id, perfil_id, db)
    perfil = await perfil_service.get_perfil(perfil_id, db)
    await perfil_service.delete_perfil(perfil, db)
