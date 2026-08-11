import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, field_validator


TipoEvento = Literal["task_start", "task_end", "attempt_ok", "attempt_fail"]


class EventoIn(BaseModel):
    perfil_id: uuid.UUID
    task_num: int
    tipo: TipoEvento
    ts: datetime
    payload: dict[str, Any] | None = None

    @field_validator("task_num")
    @classmethod
    def valid_task(cls, v: int) -> int:
        if not 1 <= v <= 8:
            raise ValueError("task_num debe estar entre 1 y 8")
        return v


class EventoBatch(BaseModel):
    eventos: list[EventoIn]


class EventoOut(BaseModel):
    id: int
    perfil_id: uuid.UUID
    task_num: int
    tipo: str
    ts: datetime
    payload: dict[str, Any] | None = None

    model_config = {"from_attributes": True}


class BatchInsertResult(BaseModel):
    insertados: int
    descartados: int
