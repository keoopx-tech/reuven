import uuid
from datetime import date, datetime

from pydantic import BaseModel


class PerfilCreate(BaseModel):
    nombre: str
    emoji: str = "🐻"
    es_nino: bool = True
    fecha_nacimiento: date | None = None
    idioma_materno: str = "es"


class PerfilUpdate(BaseModel):
    nombre: str | None = None
    emoji: str | None = None
    es_nino: bool | None = None
    fecha_nacimiento: date | None = None
    idioma_materno: str | None = None


class PerfilOut(BaseModel):
    id: uuid.UUID
    nombre: str
    emoji: str
    es_nino: bool
    fecha_nacimiento: date | None = None
    idioma_materno: str
    creado_en: datetime

    model_config = {"from_attributes": True}


class CodigoOut(BaseModel):
    code: str          # Formato XXXX-XXXX al serializar
    perfil_id: uuid.UUID
    usado: bool
    expira_en: datetime
    creado_en: datetime

    model_config = {"from_attributes": True}


class ActivarCodigoRequest(BaseModel):
    code: str


class VincularDirectoRequest(BaseModel):
    profesional_id: uuid.UUID
    perfil_id: uuid.UUID
