"""Modelos relacionales principales del proceso de reclutamiento."""

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Candidato(Base):
    """Representa a una persona postulada a una vacante."""

    __tablename__ = "candidatos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    telefono: Mapped[str | None] = mapped_column(String(30), nullable=True)
    canal_origen: Mapped[str] = mapped_column(String(100), nullable=False)
    fecha_postulacion: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )


class Vacante(Base):
    """Representa una posicion disponible dentro del proceso de reclutamiento."""

    __tablename__ = "vacantes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    titulo: Mapped[str] = mapped_column(String(150), nullable=False)
    descripcion: Mapped[str | None] = mapped_column(Text, nullable=True)
    estado: Mapped[str] = mapped_column(String(50), nullable=False)