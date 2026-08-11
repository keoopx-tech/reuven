import uuid

from fastapi import APIRouter, Query

from app.api.deps import CurrentUser, DbDep, TutorUser
from app.core.exceptions import Forbidden
from app.schemas.evento import BatchInsertResult, EventoBatch
from app.schemas.metricas import ActividadOut, ResumenOut, SerieTemporalOut, SesionOut
from app.services import evento_service, metricas_service, perfil_service, vinculo_service

router = APIRouter(prefix="/metricas", tags=["metricas"])


async def _assert_access(current_user, perfil_id: uuid.UUID, db) -> None:
    """Tutor propio o profesional vinculado pueden ver las métricas."""
    if current_user.rol in ("tutor", "admin"):
        await perfil_service.assert_tutor_owns(current_user.id, perfil_id, db)
    elif current_user.rol == "profesional":
        await vinculo_service.assert_profesional_linked(current_user.id, perfil_id, db)
    else:
        raise Forbidden()


@router.post("/eventos/{perfil_id}", response_model=BatchInsertResult, status_code=201)
async def batch_eventos(perfil_id: uuid.UUID, body: EventoBatch, current_user: TutorUser, db: DbDep):
    """Solo el tutor propietario puede insertar eventos (los niños actúan bajo la sesión del tutor)."""
    await perfil_service.assert_tutor_owns(current_user.id, perfil_id, db)
    return await evento_service.batch_insert(perfil_id, body.eventos, db)


@router.get("/{perfil_id}/resumen", response_model=ResumenOut)
async def resumen(perfil_id: uuid.UUID, current_user: CurrentUser, db: DbDep):
    await _assert_access(current_user, perfil_id, db)
    return await metricas_service.get_resumen(perfil_id, db)


@router.get("/{perfil_id}/por-actividad", response_model=list[ActividadOut])
async def por_actividad(perfil_id: uuid.UUID, current_user: CurrentUser, db: DbDep):
    await _assert_access(current_user, perfil_id, db)
    return await metricas_service.get_por_actividad(perfil_id, db)


@router.get("/{perfil_id}/serie-temporal", response_model=list[SerieTemporalOut])
async def serie_temporal(
    perfil_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbDep,
    dias: int = Query(default=14, ge=1, le=90),
):
    await _assert_access(current_user, perfil_id, db)
    return await metricas_service.get_serie_temporal(perfil_id, dias, db)


@router.get("/{perfil_id}/sesiones", response_model=list[SesionOut])
async def sesiones(
    perfil_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbDep,
    limite: int = Query(default=20, ge=1, le=100),
):
    await _assert_access(current_user, perfil_id, db)
    return await metricas_service.get_sesiones(perfil_id, limite, db)
