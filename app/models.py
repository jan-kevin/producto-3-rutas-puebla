
from datetime import datetime, timezone

from pydantic import BaseModel, Field


class ParadaBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    colonia: str = Field(..., min_length=1, max_length=100)
    municipio: str = Field(default="Puebla", max_length=100)

    latitud: float = Field(..., ge=-90, le=90)
    longitud: float = Field(..., ge=-180, le=180)

    rutas: list[str] = Field(default_factory=list)
    activa: bool = True


class ParadaCreate(ParadaBase):
    pass


class ParadaUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=1, max_length=100)
    colonia: str | None = Field(default=None, min_length=1, max_length=100)
    municipio: str | None = Field(default=None, max_length=100)

    latitud: float | None = Field(default=None, ge=-90, le=90)
    longitud: float | None = Field(default=None, ge=-180, le=180)

    rutas: list[str] | None = None
    activa: bool | None = None


class ParadaResponse(ParadaBase):
    id: str
    creado_en: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
