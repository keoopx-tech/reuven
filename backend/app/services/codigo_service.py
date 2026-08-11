import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.codes import gen_code, normalize_code, strip_dash
from app.core.exceptions import BadRequest, Conflict
from app.models.codigo import CodigoVinculacion
from app.models.vinculo import Vinculo


async def generar_codigo(tutor_id: uuid.UUID, perfil_id: uuid.UUID, db: AsyncSession) -> str:
    """Genera un código único XXXX-XXXX y lo persiste. Retorna el código formateado."""
    for _ in range(10):  # máximo 10 intentos antes de fallar
        raw = gen_code()
        stripped = strip_dash(raw)
        existing = await db.get(CodigoVinculacion, stripped)
        if not existing:
            expiry = datetime.now(UTC) + timedelta(days=30)
            codigo = CodigoVinculacion(
                code=stripped,
                tutor_id=tutor_id,
                perfil_id=perfil_id,
                expira_en=expiry,
            )
            db.add(codigo)
            await db.commit()
            return raw  # con guión para mostrar al usuario
    raise BadRequest("No se pudo generar un código único. Inténtalo de nuevo.")


async def get_codigos_de_tutor(tutor_id: uuid.UUID, db: AsyncSession) -> list[CodigoVinculacion]:
    result = await db.execute(
        select(CodigoVinculacion)
        .where(CodigoVinculacion.tutor_id == tutor_id)
        .order_by(CodigoVinculacion.creado_en.desc())
    )
    return list(result.scalars())


async def activar_codigo(
    profesional_id: uuid.UUID, raw_code: str, db: AsyncSession
) -> uuid.UUID:
    """Valida el código, crea el vínculo y marca el código como usado. Retorna perfil_id."""
    try:
        formatted = normalize_code(raw_code)
        stripped = strip_dash(formatted)
    except ValueError:
        raise BadRequest("Formato de código inválido. Debe ser XXXX-XXXX con el charset permitido.")

    codigo = await db.get(CodigoVinculacion, stripped)
    if not codigo:
        raise BadRequest("Código no válido.")
    if codigo.usado:
        raise BadRequest("Este código ya fue utilizado.")
    if codigo.expira_en < datetime.now(UTC):
        raise BadRequest("Este código ha expirado.")

    existing = await db.scalar(
        select(Vinculo).where(
            Vinculo.profesional_id == profesional_id,
            Vinculo.perfil_id == codigo.perfil_id,
        )
    )
    if existing:
        raise Conflict("Ya estás vinculado a este menor.")

    vinculo = Vinculo(profesional_id=profesional_id, perfil_id=codigo.perfil_id, via="codigo")
    db.add(vinculo)
    codigo.usado = True
    await db.commit()
    return codigo.perfil_id
