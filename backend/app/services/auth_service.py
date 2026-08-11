import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import Conflict, Unauthorized
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    hash_refresh_token,
    refresh_token_expiry,
    verify_password,
)
from app.models.refresh_token import RefreshToken
from app.models.usuario import Usuario
from app.schemas.auth import LoginRequest, RegisterRequest


async def register(req: RegisterRequest, db: AsyncSession) -> Usuario:
    existing = await db.scalar(select(Usuario).where(Usuario.email == req.email.lower()))
    if existing:
        raise Conflict("El email ya está registrado")
    usuario = Usuario(
        email=req.email.lower(),
        nombre=req.nombre,
        password_hash=hash_password(req.password),
        rol=req.rol,
        relacion=req.relacion,
        telefono=req.telefono,
        profesion=req.profesion,
        centro=req.centro,
        colegiado=req.colegiado,
    )
    db.add(usuario)
    await db.commit()
    await db.refresh(usuario)
    return usuario


async def login(req: LoginRequest, db: AsyncSession) -> tuple[str, str]:
    """Retorna (access_token, refresh_token_raw)."""
    usuario = await db.scalar(select(Usuario).where(Usuario.email == req.email.lower()))
    if not usuario or not verify_password(req.password, usuario.password_hash):
        raise Unauthorized("Email o contraseña incorrectos")
    if not usuario.activo:
        raise Unauthorized("Cuenta desactivada")

    access = create_access_token(str(usuario.id), usuario.rol)
    raw, hashed = create_refresh_token()

    token_record = RefreshToken(
        usuario_id=usuario.id,
        token_hash=hashed,
        expira_en=refresh_token_expiry(),
    )
    db.add(token_record)
    await db.commit()
    return access, raw


async def refresh(raw_token: str, db: AsyncSession) -> tuple[str, str]:
    """Rota el refresh token y emite un nuevo par."""
    hashed = hash_refresh_token(raw_token)
    record = await db.scalar(
        select(RefreshToken).where(
            RefreshToken.token_hash == hashed,
            RefreshToken.revocado.is_(False),
            RefreshToken.expira_en > datetime.now(UTC),
        )
    )
    if not record:
        raise Unauthorized("Refresh token inválido o expirado")

    record.revocado = True

    usuario = await db.get(Usuario, record.usuario_id)
    if not usuario or not usuario.activo:
        raise Unauthorized("Usuario no encontrado o inactivo")

    access = create_access_token(str(usuario.id), usuario.rol)
    new_raw, new_hashed = create_refresh_token()
    db.add(RefreshToken(usuario_id=usuario.id, token_hash=new_hashed, expira_en=refresh_token_expiry()))
    await db.commit()
    return access, new_raw


async def get_usuario_by_id(usuario_id: uuid.UUID, db: AsyncSession) -> Usuario | None:
    return await db.get(Usuario, usuario_id)
