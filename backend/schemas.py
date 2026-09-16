"""Esquemas Pydantic para validar entradas y respuestas de la API."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CandidatoCreate(BaseModel):
    """Datos necesarios para crear un candidato."""

    nombre: str
    email: str
    telefono: str | None = None
    canal_origen: str
    fecha_postulacion: datetime | None = None


class CandidatoResponse(CandidatoCreate):
    """Representacion de un candidato devuelta por la API."""

    id: int
    model_config = ConfigDict(from_attributes=True)


class VacanteCreate(BaseModel):
    """Datos necesarios para crear una vacante."""

    titulo: str
    descripcion: str | None = None
    estado: str


class VacanteResponse(VacanteCreate):
    """Representacion de una vacante devuelta por la API."""

    id: int
    model_config = ConfigDict(from_attributes=True)
