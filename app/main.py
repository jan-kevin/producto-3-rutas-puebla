
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.routes import router


# Obtener la ruta de la carpeta principal
BASE_DIR = Path(__file__).resolve().parent.parent

# Crear aplicación FastAPI
app = FastAPI(
    title="Rutas Puebla API",
    description="API para administrar paradas de transporte público en Puebla",
    version="1.0.0"
)

# Servir archivos estáticos
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static"
)

# Registrar las rutas de la API
app.include_router(router)


# Página principal
@app.get("/", include_in_schema=False)
def inicio():
    return FileResponse(BASE_DIR / "static" / "index.html")


# Health Check
@app.get("/health")
def health():
    return {
        "status": "ok"
    }
