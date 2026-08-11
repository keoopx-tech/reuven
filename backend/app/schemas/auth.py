import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, field_validator


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    nombre: str
    rol: Literal["tutor", "profesional"]
    # Tutor fields
    relacion: str | None = None
    telefono: str | None = None
    # Profesional fields
    profesion: str | None = None
    centro: str | None = None
    colegiado: str | None = None

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MeResponse(BaseModel):
    id: uuid.UUID
    email: str
    nombre: str
    rol: str
    profesion: str | None = None
    centro: str | None = None
    colegiado: str | None = None
    relacion: str | None = None
    creado_en: datetime

    model_config = {"from_attributes": True}
