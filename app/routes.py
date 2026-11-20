
from fastapi import APIRouter, HTTPException, status

from app.models import ParadaCreate, ParadaUpdate, ParadaResponse

from app.repository import (
    crear_parada,
    obtener_parada,
    listar_paradas,
    actualizar_parada,
    eliminar_parada
)


router = APIRouter(
    prefix="/paradas",
    tags=["Paradas"]
)


# 1. Crear una parada
@router.post(
    "",
    response_model=ParadaResponse,
    status_code=status.HTTP_201_CREATED
)
def crear(parada: ParadaCreate):
    return crear_parada(parada)


# 2. Consultar todas las paradas
@router.get("", response_model=list[ParadaResponse])
def listar():
    return listar_paradas()


# 3. Consultar una parada por ID
@router.get("/{parada_id}", response_model=ParadaResponse)
def consultar(parada_id: str):
    parada = obtener_parada(parada_id)

    if parada is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La parada solicitada no existe"
        )

    return parada


# 4. Actualizar una parada
@router.put("/{parada_id}", response_model=ParadaResponse)
def actualizar(parada_id: str, cambios: ParadaUpdate):
    parada = actualizar_parada(parada_id, cambios)

    if parada is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La parada que intentas actualizar no existe"
        )

    return parada


# 5. Eliminar una parada
@router.delete("/{parada_id}")
def eliminar(parada_id: str):
    resultado = eliminar_parada(parada_id)

    if not resultado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La parada que intentas eliminar no existe"
        )

    return {
        "mensaje": "Parada eliminada correctamente",
        "id": parada_id
    }
