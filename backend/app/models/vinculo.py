import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Vinculo(Base):
    __tablename__ = "vinculos"
    __table_args__ = (UniqueConstraint("profesional_id", "perfil_id"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profesional_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False
    )
    perfil_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("perfiles.id", ondelete="CASCADE"), nullable=False
    )
    via: Mapped[str] = mapped_column(String, nullable=False, default="codigo")  # codigo | directo
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    profesional: Mapped["Usuario"] = relationship(back_populates="vinculos")
    perfil: Mapped["Perfil"] = relationship(back_populates="vinculos")


from app.models.usuario import Usuario  # noqa: E402
from app.models.perfil import Perfil  # noqa: E402
