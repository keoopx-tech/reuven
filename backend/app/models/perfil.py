import uuid
from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Perfil(Base):
    __tablename__ = "perfiles"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre: Mapped[str] = mapped_column(String, nullable=False)
    emoji: Mapped[str] = mapped_column(String, nullable=False, default="🐻")
    es_nino: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    fecha_nacimiento: Mapped[date | None] = mapped_column(Date, nullable=True)
    idioma_materno: Mapped[str] = mapped_column(String, nullable=False, default="es")
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    tutores_perfil: Mapped[list["TutoresPerfil"]] = relationship(back_populates="perfil", cascade="all, delete-orphan")
    vinculos: Mapped[list["Vinculo"]] = relationship(back_populates="perfil", cascade="all, delete-orphan")
    codigos: Mapped[list["CodigoVinculacion"]] = relationship(back_populates="perfil", cascade="all, delete-orphan")


class TutoresPerfil(Base):
    __tablename__ = "tutores_perfil"

    tutor_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"), primary_key=True
    )
    perfil_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("perfiles.id", ondelete="CASCADE"), primary_key=True
    )
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    tutor: Mapped["Usuario"] = relationship(back_populates="tutores_perfil")
    perfil: Mapped["Perfil"] = relationship(back_populates="tutores_perfil")


from app.models.usuario import Usuario  # noqa: E402
from app.models.vinculo import Vinculo  # noqa: E402
from app.models.codigo import CodigoVinculacion  # noqa: E402
