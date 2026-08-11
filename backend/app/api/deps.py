import uuid
from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import Forbidden, Unauthorized
from app.core.security import decode_access_token
from app.database import get_db
from app.models.usuario import Usuario
from app.services.auth_service import get_usuario_by_id
from app.services.perfil_service import assert_tutor_owns
from app.services.vinculo_service import assert_profesional_linked

bearer = HTTPBearer(auto_error=False)

DbDep = Annotated[AsyncSession, Depends(get_db)]
CredDep = Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]


async def get_current_user(credentials: CredDep, db: DbDep) -> Usuario:
    if not credentials:
        raise Unauthorized()
    try:
        payload = decode_access_token(credentials.credentials)
    except JWTError:
        raise Unauthorized("Token inválido o expirado")
    usuario_id = payload.get("sub")
    if not usuario_id:
        raise Unauthorized()
    usuario = await get_usuario_by_id(uuid.UUID(usuario_id), db)
    if not usuario or not usuario.activo:
        raise Unauthorized("Usuario no encontrado")
    return usuario


CurrentUser = Annotated[Usuario, Depends(get_current_user)]


async def require_tutor(current_user: CurrentUser) -> Usuario:
    if current_user.rol not in ("tutor", "admin"):
        raise Forbidden("Solo tutores pueden realizar esta acción")
    return current_user


async def require_profesional(current_user: CurrentUser) -> Usuario:
    if current_user.rol not in ("profesional", "admin"):
        raise Forbidden("Solo profesionales pueden realizar esta acción")
    return current_user


TutorUser = Annotated[Usuario, Depends(require_tutor)]
ProfesionalUser = Annotated[Usuario, Depends(require_profesional)]
