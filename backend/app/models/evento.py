import uuid
from datetime import datetime

from sqlalchemy import JSON, BigInteger, DateTime, Integer, SmallInteger, String, Uuid, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

# JSONB en PostgreSQL (producción), JSON genérico en otros motores (SQLite en desarrollo)
JsonType = JSON().with_variant(JSONB, "postgresql")

# BIGINT en PostgreSQL; en SQLite debe ser exactamente INTEGER para que el
# autoincremento vía rowid funcione (BIGINT pierde el alias de rowid).
IdType = BigInteger().with_variant(Integer, "sqlite")


class Evento(Base):
    """Tabla particionada por perfil_id (HASH, 8 particiones).
    La FK a perfiles se gestiona via trigger en PostgreSQL porque PG15
    no soporta FK en tablas particionadas.
    """

    __tablename__ = "eventos"

    id: Mapped[int] = mapped_column(IdType, primary_key=True, autoincrement=True)
    perfil_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), nullable=False, index=True)
    task_num: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    tipo: Mapped[str] = mapped_column(String, nullable=False)
    # task_start | task_end | attempt_ok | attempt_fail
    ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    payload: Mapped[dict | None] = mapped_column(JsonType, nullable=True)
