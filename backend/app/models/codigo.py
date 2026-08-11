import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CodigoVinculacion(Base):
    __tablename__ = "codigos_vinculacion"

    # Se guarda sin guión: 'ABCD1234' (8 chars). El guión se añade al presentar al usuario.
    code: Mapped[str] = mapped_column(String(8), primary_key=True)
    tutor_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False
    )
    perfil_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("perfiles.id", ondelete="CASCADE"), nullable=False
    )
    usado: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    expira_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    tutor: Mapped["Usuario"] = relationship(back_populates="codigos")
    perfil: Mapped["Perfil"] = relationship(back_populates="codigos")


from app.models.usuario import Usuario  # noqa: E402
from app.models.perfil import Perfil  # noqa: E402
