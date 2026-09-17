"""Aplicacion inicial del backend de PluriOne."""

from collections.abc import Generator

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

import models
from database import SessionLocal, engine
from schemas import (
    CandidatoCreate,
    CandidatoResponse,
    VacanteCreate,
    VacanteResponse,
)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
models.Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Proporciona una sesion SQLAlchemy y la cierra al terminar la solicitud."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    """Devuelve un mensaje de bienvenida para comprobar que la API funciona."""
    return {"message": "Bienvenido a PluriOne"}


@app.post(
    "/candidatos/",
    response_model=CandidatoResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_candidato(
    candidato_data: CandidatoCreate,
    db: Session = Depends(get_db),
):
    """Crea un candidato y devuelve el registro persistido."""
    candidato = models.Candidato(**candidato_data.model_dump(exclude_unset=True))
    try:
        db.add(candidato)
        db.commit()
        db.refresh(candidato)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo crear el candidato.",
        ) from exc
    return candidato


@app.get("/candidatos/", response_model=list[CandidatoResponse])
def list_candidatos(db: Session = Depends(get_db)):
    """Devuelve todos los candidatos registrados."""
    return db.scalars(select(models.Candidato)).all()


@app.post(
    "/vacantes/",
    response_model=VacanteResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_vacante(
    vacante_data: VacanteCreate,
    db: Session = Depends(get_db),
):
    """Crea una vacante y devuelve el registro persistido."""
    vacante = models.Vacante(**vacante_data.model_dump(exclude_unset=True))
    try:
        db.add(vacante)
        db.commit()
        db.refresh(vacante)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo crear la vacante.",
        ) from exc
    return vacante


@app.get("/vacantes/", response_model=list[VacanteResponse])
def list_vacantes(db: Session = Depends(get_db)):
    """Devuelve todas las vacantes registradas."""
    return db.scalars(select(models.Vacante)).all()


@app.delete("/vacantes/{vacante_id}")
def delete_vacante(vacante_id: int, db: Session = Depends(get_db)):
    """Elimina una vacante existente por su identificador."""
    vacante = db.get(models.Vacante, vacante_id)
    if vacante is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacante no encontrada.",
        )

    db.delete(vacante)
    db.commit()
    return {"mensaje": "Eliminado correctamente"}


@app.delete("/candidatos/{candidato_id}")
def delete_candidato(candidato_id: int, db: Session = Depends(get_db)):
    """Elimina un candidato existente por su identificador."""
    candidato = db.get(models.Candidato, candidato_id)
    if candidato is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidato no encontrado.",
        )

    db.delete(candidato)
    db.commit()
    return {"mensaje": "Eliminado correctamente"}


@app.put("/vacantes/{vacante_id}", response_model=VacanteResponse)
def update_vacante(
    vacante_id: int,
    vacante_data: VacanteCreate,
    db: Session = Depends(get_db),
):
    """Actualiza una vacante existente y devuelve el registro actualizado."""
    vacante = db.get(models.Vacante, vacante_id)
    if vacante is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacante no encontrada.",
        )

    for field, value in vacante_data.model_dump(exclude_unset=True).items():
        setattr(vacante, field, value)

    try:
        db.commit()
        db.refresh(vacante)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo actualizar la vacante.",
        ) from exc
    return vacante


@app.put("/candidatos/{candidato_id}", response_model=CandidatoResponse)
def update_candidato(
    candidato_id: int,
    candidato_data: CandidatoCreate,
    db: Session = Depends(get_db),
):
    """Actualiza un candidato existente y devuelve el registro actualizado."""
    candidato = db.get(models.Candidato, candidato_id)
    if candidato is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidato no encontrado.",
        )

    for field, value in candidato_data.model_dump(exclude_unset=True).items():
        setattr(candidato, field, value)

    try:
        db.commit()
        db.refresh(candidato)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo actualizar el candidato.",
        ) from exc
    return candidato