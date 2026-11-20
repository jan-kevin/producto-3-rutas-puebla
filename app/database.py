
import os
import redis
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

# Obtener la URL de conexión
REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL:
    raise ValueError("No se encontró la variable REDIS_URL en el archivo .env")

# Crear conexión con Redis Cloud
redis_client = redis.from_url(
    REDIS_URL,
    decode_responses=True,
    socket_connect_timeout=5,
    socket_timeout=5
)

# Comprobar conexión
def probar_conexion():
    return redis_client.ping()
