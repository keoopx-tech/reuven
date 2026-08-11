import uuid

from fastapi import APIRouter

from app.api.deps import DbDep, ProfesionalUser
from app.schemas.perfil import ActivarCodigoRequest
from app.services import codigo_service, vinculo_service

router = APIRouter(prefix="/vinculos", tags=["vinculos"])


@router.post("/activar", status_code=200)
async def activar_vinculo(body: ActivarCodigoRequest, current_user: ProfesionalUser, db: DbDep):
    perfil_id = await codigo_service.activar_codigo(current_user.id, body.code, db)
    return {"perfil_id": str(perfil_id), "mensaje": "Menor vinculado correctamente"}


@router.delete("/{perfil_id}", status_code=204)
async def desvincular(perfil_id: uuid.UUID, current_user: ProfesionalUser, db: DbDep):
    await vinculo_service.desvincular(current_user.id, perfil_id, db)
