
import json
import uuid

from datetime import datetime, timezone

from app.database import redis_client
from app.models import ParadaCreate, ParadaUpdate


# Crear una nueva parada
def crear_parada(parada: ParadaCreate) -> dict:
    datos = parada.model_dump(mode="json")

    # Generar identificador único
    parada_id = str(uuid.uuid4())

    datos["id"] = parada_id
    datos["creado_en"] = datetime.now(timezone.utc).isoformat()

    # Guardar en Redis como JSON
    clave = f"parada:{parada_id}"

    redis_client.set(
        clave,
        json.dumps(datos, ensure_ascii=False)
    )

    return datos


# Consultar una parada por ID
def obtener_parada(parada_id: str) -> dict | None:
    clave = f"parada:{parada_id}"

    datos = redis_client.get(clave)

    if datos is None:
        return None

    return json.loads(datos)


# Consultar todas las paradas
def listar_paradas() -> list[dict]:
    paradas = []

    # Buscar todas las claves que comiencen con parada:
    for clave in redis_client.scan_iter(match="parada:*"):
        datos = redis_client.get(clave)

        if datos is not None:
            paradas.append(json.loads(datos))

    return paradas


# Actualizar una parada existente
def actualizar_parada(
    parada_id: str,
    cambios: ParadaUpdate
) -> dict | None:

    parada = obtener_parada(parada_id)

    if parada is None:
        return None

    # Obtener únicamente los campos enviados
    datos_actualizados = cambios.model_dump(
        exclude_unset=True,
        exclude_none=True,
        mode="json"
    )

    parada.update(datos_actualizados)

    clave = f"parada:{parada_id}"

    redis_client.set(
        clave,
        json.dumps(parada, ensure_ascii=False)
    )

    return parada


# Eliminar una parada
def eliminar_parada(parada_id: str) -> bool:
    clave = f"parada:{parada_id}"

    resultado = redis_client.delete(clave)

    return resultado > 0
