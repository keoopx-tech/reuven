import uuid
from datetime import datetime

from pydantic import BaseModel


class ResumenOut(BaseModel):
    perfil_id: uuid.UUID
    aciertos: int
    fallidos: int
    completadas: int
    tiempo_ms: int
    tasa_acierto: int  # 0-100 redondeado


class ActividadOut(BaseModel):
    task_num: int
    nombre: str
    color: str
    aciertos: int
    fallidos: int
    tiempo_ms: int
    sesiones: int
    completadas: int


class SerieTemporalOut(BaseModel):
    fecha: str  # YYYY-MM-DD
    aciertos: int
    fallidos: int


class SesionOut(BaseModel):
    ts: datetime
    task_num: int
    nombre: str
    duracion_ms: int
    aciertos: int
    fallidos: int
    completada: bool
