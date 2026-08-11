from fastapi import APIRouter

from app.api.deps import DbDep, ProfesionalUser
from app.schemas.perfil import PerfilOut
from app.services import vinculo_service

router = APIRouter(prefix="/profesional", tags=["profesional"])


@router.get("/perfiles", response_model=list[PerfilOut])
async def mis_perfiles(current_user: ProfesionalUser, db: DbDep):
    """Lista todos los menores vinculados al profesional autenticado."""
    perfiles = await vinculo_service.get_perfiles_de_profesional(current_user.id, db)
    return [PerfilOut.model_validate(p) for p in perfiles]
