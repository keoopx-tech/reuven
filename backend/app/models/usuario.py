import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    nombre: Mapped[str] = mapped_column(String, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    rol: Mapped[str] = mapped_column(String, nullable=False)  # tutor | profesional | admin

    # Solo profesionales
    profesion: Mapped[str | None] = mapped_column(String, nullable=True)
    centro: Mapped[str | None] = mapped_column(String, nullable=True)
    colegiado: Mapped[str | None] = mapped_column(String, nullable=True)

    # Solo tutores
    relacion: Mapped[str | None] = mapped_column(String, nullable=True)
    telefono: Mapped[str | None] = mapped_column(String, nullable=True)

    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    tutores_perfil: Mapped[list["TutoresPerfil"]] = relationship(back_populates="tutor", cascade="all, delete-orphan")
    vinculos: Mapped[list["Vinculo"]] = relationship(back_populates="profesional", cascade="all, delete-orphan")
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(back_populates="usuario", cascade="all, delete-orphan")
    codigos: Mapped[list["CodigoVinculacion"]] = relationship(back_populates="tutor", cascade="all, delete-orphan")


# Importaciones tardías para evitar circularidad
from app.models.vinculo import Vinculo  # noqa: E402
from app.models.codigo import CodigoVinculacion  # noqa: E402
from app.models.perfil import TutoresPerfil  # noqa: E402
from app.models.refresh_token import RefreshToken  # noqa: E402
