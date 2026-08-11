import uuid

from fastapi import APIRouter

from app.api.deps import DbDep, TutorUser
from app.core.codes import strip_dash
from app.schemas.perfil import ActivarCodigoRequest, CodigoOut
from app.services import codigo_service

router = APIRouter(prefix="/codigos", tags=["codigos"])


@router.post("/", response_model=dict, status_code=201)
async def generar_codigo(body: dict, current_user: TutorUser, db: DbDep):
    """Body: {"perfil_id": "uuid"}. Retorna {"code": "XXXX-XXXX"}."""
    perfil_id = uuid.UUID(body["perfil_id"])
    code = await codigo_service.generar_codigo(current_user.id, perfil_id, db)
    return {"code": code}


@router.get("/", response_model=list[CodigoOut])
async def listar_codigos(current_user: TutorUser, db: DbDep):
    codigos = await codigo_service.get_codigos_de_tutor(current_user.id, db)
    # Añadir guión al serializar
    result = []
    for c in codigos:
        out = CodigoOut.model_validate(c)
        # Insertar guión si no lo tiene
        raw = c.code  # 8 chars sin guión
        out.code = f"{raw[:4]}-{raw[4:]}"
        result.append(out)
    return result
