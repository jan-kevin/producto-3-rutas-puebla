# Rutas Puebla

**Sistema web para la administración y visualización de paradas de transporte público en Puebla.**

## 1. Descripción del proyecto

Rutas Puebla es una aplicación web desarrollada durante el Sprint 1 de la asignatura **Bases de Datos en la Nube**. Su propósito es facilitar el registro, consulta, actualización y eliminación de paradas de transporte público dentro del municipio de Puebla.

El sistema permite administrar la información de cada parada mediante una interfaz web intuitiva y visualizar su ubicación geográfica a través de un mapa interactivo basado en Leaflet y OpenStreetMap.

La aplicación utiliza **Python y FastAPI** para desarrollar el backend, mientras que **Redis Cloud** funciona como sistema de almacenamiento de información. El frontend está construido con HTML, CSS y JavaScript, comunicándose con la API mediante solicitudes HTTP utilizando `fetch()`.

El proyecto busca demostrar la integración de una aplicación web con una base de datos alojada en la nube, implementando operaciones CRUD y funcionalidades de visualización geográfica.

## 2. Objetivos

### Objetivo general

Desarrollar una aplicación web que permita administrar y visualizar paradas de transporte público en Puebla, utilizando una base de datos en la nube mediante Redis Cloud y una API REST desarrollada con FastAPI.

### Objetivos específicos

- Implementar una conexión funcional entre Python y Redis Cloud.
- Diseñar un modelo de datos para representar las paradas de transporte público.
- Desarrollar operaciones CRUD para administrar los registros.
- Crear endpoints REST utilizando FastAPI.
- Construir una interfaz web que permita interactuar con la API.
- Implementar un mapa interactivo para visualizar la ubicación de las paradas.
- Validar el funcionamiento del sistema mediante pruebas manuales.
- Comprobar que la información permanezca almacenada en Redis Cloud.

## 3. Tecnologías utilizadas

| Tecnología | Uso dentro del proyecto |
|---|---|
| Python 3.11 | Lenguaje principal del backend. |
| FastAPI | Desarrollo de la API REST. |
| Redis Cloud | Almacenamiento de información en la nube. |
| redis-py | Comunicación entre Python y Redis. |
| python-dotenv | Lectura de variables de entorno. |
| Uvicorn | Servidor para ejecutar la aplicación FastAPI. |
| HTML5 | Estructura de la interfaz web. |
| CSS3 | Diseño y estilos de la aplicación. |
| JavaScript | Lógica del frontend y comunicación con la API. |
| Leaflet | Biblioteca para implementar el mapa interactivo. |
| OpenStreetMap | Proveedor de mapas y cartografía. |
| Git y GitHub | Control de versiones y alojamiento del repositorio. |

## 4. Historias de usuario del Sprint 1

En esta sección se describen las historias de usuario implementadas durante el Sprint. Cada una representa una funcionalidad del sistema y documenta su propósito, criterios de aceptación y solución técnica.

### HU-01. Conexión con Redis Cloud

**Historia de usuario:**

Como desarrollador del sistema, quiero conectar la aplicación con una base de datos Redis Cloud, para almacenar y administrar la información de las paradas de transporte público en la nube.

**Descripción:**

Se configuró una conexión entre Python y Redis Cloud mediante la biblioteca `redis-py`. La dirección de conexión se administra mediante una variable de entorno para evitar escribir credenciales directamente en el código fuente.

**Criterios de aceptación:**

- La aplicación debe establecer conexión con Redis Cloud.
- La conexión debe utilizar la variable de entorno `REDIS_URL`.
- La aplicación debe poder ejecutar una operación PING.
- La conexión debe permitir guardar y recuperar información.

**Implementación:**

La conexión se encuentra centralizada en `app/database.py`. Se utiliza `python-dotenv` para cargar las variables de entorno y un cliente de Redis para comunicarse con la base de datos.

La conexión se verificó mediante el método `ping()`, obteniendo una respuesta satisfactoria.

### HU-02. Registrar nuevas paradas

**Historia de usuario:**

Como administrador del sistema, quiero registrar nuevas paradas de transporte público, para mantener actualizado el directorio de ubicaciones disponibles.

**Descripción:**

El sistema permite crear registros mediante un formulario web. Cada parada contiene información general, ubicación geográfica, rutas asociadas y su estado de disponibilidad.

**Criterios de aceptación:**

- El formulario debe permitir ingresar los datos de una parada.
- Los campos obligatorios deben validarse.
- Cada registro debe recibir un identificador único.
- La información debe almacenarse en Redis Cloud.
- La nueva parada debe aparecer en el listado después de registrarse.

**Implementación:**

Se desarrolló el endpoint `POST /paradas`, encargado de recibir la información, generar un identificador único y almacenar el registro en Redis.

Desde el frontend, JavaScript utiliza `fetch()` para enviar los datos a la API.

### HU-03. Consultar y listar paradas

**Historia de usuario:**

Como usuario del sistema, quiero consultar las paradas registradas, para conocer cuáles están disponibles y obtener información sobre sus ubicaciones.

**Descripción:**

La aplicación permite visualizar todas las paradas almacenadas y consultar individualmente una parada mediante su identificador.

**Criterios de aceptación:**

- El sistema debe mostrar las paradas registradas.
- Cada parada debe mostrar sus datos principales.
- Debe ser posible consultar un registro específico.
- Si una parada no existe, la API debe responder con un error HTTP 404.

**Implementación:**

Se desarrollaron dos endpoints:

- `GET /paradas`: obtiene el listado de paradas.
- `GET /paradas/{id}`: obtiene una parada específica.

El repositorio utiliza operaciones de Redis para recuperar los registros y convertir su contenido JSON en información que puede procesar la aplicación.

### HU-04. Actualizar información de las paradas

**Historia de usuario:**

Como administrador del sistema, quiero editar la información de una parada existente, para corregir o actualizar sus datos cuando sea necesario.

**Descripción:**

La aplicación permite modificar los datos de una parada desde la interfaz web, incluyendo su nombre, colonia, municipio, coordenadas, rutas asociadas y estado.

**Criterios de aceptación:**

- Debe ser posible seleccionar una parada para editarla.
- El formulario debe mostrar los datos actuales.
- Los cambios deben guardarse en Redis Cloud.
- La información actualizada debe reflejarse en el listado.
- Si el identificador no existe, debe responderse con un error HTTP 404.

**Implementación:**

Se desarrolló el endpoint `PUT /paradas/{id}`. Este recupera el registro existente, aplica los cambios recibidos y guarda nuevamente la información en Redis.

El frontend permite seleccionar una parada, cargar sus datos en el formulario y guardar las modificaciones.

### HU-05. Eliminar paradas

**Historia de usuario:**

Como administrador del sistema, quiero eliminar una parada registrada, para retirar del directorio información que ya no sea necesaria.

**Descripción:**

El sistema permite eliminar registros de manera individual mediante un botón disponible en cada parada del listado.

**Criterios de aceptación:**

- Debe ser posible seleccionar una parada para eliminarla.
- El registro debe eliminarse de Redis Cloud.
- El listado debe actualizarse después de la operación.
- Si el identificador no existe, la API debe responder con un error HTTP 404.

**Implementación:**

Se desarrolló el endpoint `DELETE /paradas/{id}`, que elimina la clave correspondiente en Redis.

Desde el frontend se envía una solicitud HTTP y posteriormente se actualiza el listado y el mapa.

### HU-06. Visualizar las paradas en un mapa interactivo

**Historia de usuario:**

Como usuario del sistema, quiero visualizar las paradas de transporte público en un mapa, para identificar fácilmente su ubicación geográfica.

**Descripción:**

Se integró un mapa interactivo utilizando Leaflet y OpenStreetMap. El mapa se encuentra centrado inicialmente en Puebla y muestra marcadores correspondientes a las paradas registradas.

**Criterios de aceptación:**

- El mapa debe mostrarse dentro de la aplicación.
- Debe estar centrado inicialmente en Puebla.
- Cada parada debe representarse mediante un marcador.
- Los marcadores deben mostrar información al seleccionarse.
- Debe existir una opción para centrar el mapa en una parada específica.
- El mapa debe actualizarse después de registrar, editar o eliminar una parada.

**Implementación:**

Se integró Leaflet en el frontend mediante sus archivos CSS y JavaScript.

Las coordenadas de cada parada se utilizan para posicionar los marcadores. Además, se implementaron ventanas informativas (*popups*) y un botón denominado **Ver en mapa**, que permite centrar la vista en una parada seleccionada.

También se diferencian visualmente las paradas activas e inactivas mediante marcadores de distintos colores.

### HU-07. Administrar las paradas desde una interfaz web

**Historia de usuario:**

Como usuario del sistema, quiero administrar las paradas mediante una interfaz web sencilla y adaptable, para realizar las operaciones sin tener que interactuar directamente con la API.

**Descripción:**

Se desarrolló una interfaz web que integra el formulario de registro, el listado de paradas, las opciones de edición y eliminación, y el mapa interactivo.

**Criterios de aceptación:**

- La aplicación debe mostrar una interfaz clara y organizada.
- Debe permitir registrar, consultar, editar y eliminar paradas.
- Debe comunicarse con el backend mediante solicitudes HTTP.
- Debe actualizar la información mostrada después de las operaciones.
- Debe contar con una presentación adaptable a diferentes tamaños de pantalla.

**Implementación:**

La interfaz se construyó utilizando HTML, CSS y JavaScript.

Las solicitudes al backend se realizan mediante `fetch()`. FastAPI sirve los archivos estáticos y la página principal de la aplicación.

## 5. Arquitectura del sistema

El proyecto utiliza una arquitectura cliente-servidor.

**Frontend:**

La interfaz web permite al usuario interactuar con las funcionalidades del sistema. Está desarrollada con HTML, CSS y JavaScript.

**Backend:**

FastAPI recibe las solicitudes HTTP, valida la información y ejecuta las operaciones correspondientes mediante el repositorio.

**Base de datos:**

Redis Cloud almacena los registros de las paradas utilizando claves únicas y valores serializados en formato JSON.

**Flujo general de funcionamiento:**

1. El usuario realiza una acción desde la interfaz web.
2. JavaScript envía una solicitud HTTP mediante `fetch()`.
3. FastAPI recibe la solicitud y ejecuta el endpoint correspondiente.
4. El repositorio interactúa con Redis Cloud.
5. Redis devuelve el resultado de la operación.
6. FastAPI responde al frontend.
7. La interfaz actualiza el listado y, cuando corresponde, los marcadores del mapa.

## 6. Estructura del proyecto

La organización de los archivos es la siguiente:

```text
rutas-puebla/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── repository.py
│   └── routes.py
│
├── static/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

### Descripción de los archivos principales

| Archivo | Responsabilidad |
|---|---|
| `app/main.py` | Configura FastAPI, registra las rutas y sirve la interfaz web. |
| `app/database.py` | Configura y administra la conexión con Redis Cloud. |
| `app/models.py` | Define los modelos de datos y las validaciones mediante Pydantic. |
| `app/repository.py` | Contiene las operaciones para almacenar, consultar, actualizar y eliminar registros en Redis. |
| `app/routes.py` | Define los endpoints de la API REST. |
| `static/index.html` | Contiene la estructura de la interfaz web. |
| `static/styles.css` | Define los estilos y el diseño responsivo. |
| `static/app.js` | Implementa la comunicación con la API, las operaciones CRUD y el mapa. |
| `.env` | Almacena las variables de entorno locales. |
| `.env.example` | Muestra las variables necesarias para configurar el proyecto. |
| `.gitignore` | Evita incluir archivos y configuraciones privadas en Git. |
| `requirements.txt` | Contiene las dependencias de Python. |

## 7. Modelo de datos

Cada parada se almacena en Redis mediante una clave con el siguiente formato:

```text
parada:{id}
```

Ejemplo:

```text
parada:pue-001
```

El valor asociado a cada clave contiene la información de la parada en formato JSON.

### Campos de una parada

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | String | Identificador único de la parada. |
| `nombre` | String | Nombre de la parada. |
| `colonia` | String | Colonia donde se encuentra. |
| `municipio` | String | Municipio correspondiente. |
| `latitud` | Float | Coordenada geográfica de latitud. |
| `longitud` | Float | Coordenada geográfica de longitud. |
| `rutas` | List[String] | Rutas de transporte asociadas. |
| `activa` | Boolean | Indica si la parada se encuentra activa. |
| `creado_en` | DateTime | Fecha y hora de creación del registro. |

### Ejemplo de registro

```json
{
  "id": "pue-001",
  "nombre": "Parada de ejemplo",
  "colonia": "Centro",
  "municipio": "Puebla",
  "latitud": 19.0414,
  "longitud": -98.2063,
  "rutas": [
    "Ruta de ejemplo",
    "Ruta universitaria"
  ],
  "activa": true,
  "creado_en": "2026-11-12T18:30:00+00:00"
}
```

**Nota:** El registro anterior es un ejemplo ilustrativo de la estructura de datos, no una ruta oficial de transporte público.

## 8. API REST y endpoints

La API fue desarrollada con FastAPI y permite realizar las operaciones CRUD sobre las paradas.

| Método HTTP | Endpoint | Descripción |
|---|---|---|
| POST | `/paradas` | Registra una nueva parada. |
| GET | `/paradas` | Obtiene todas las paradas. |
| GET | `/paradas/{id}` | Consulta una parada específica. |
| PUT | `/paradas/{id}` | Actualiza una parada existente. |
| DELETE | `/paradas/{id}` | Elimina una parada. |
| GET | `/health` | Verifica que la aplicación esté funcionando. |

### Documentación interactiva

FastAPI genera automáticamente documentación interactiva mediante Swagger UI.

Una vez iniciada la aplicación, se puede acceder desde:

```text
http://127.0.0.1:8000/docs
```

También se encuentra disponible la documentación alternativa de la API en:

```text
http://127.0.0.1:8000/redoc
```

## 9. Interfaz web y mapa interactivo

La aplicación cuenta con una interfaz web que permite administrar las paradas sin necesidad de utilizar directamente los endpoints.

### Funcionalidades principales

- Registro de nuevas paradas.
- Visualización del listado de registros.
- Edición de información existente.
- Eliminación de paradas.
- Administración del estado activo o inactivo.
- Visualización de rutas asociadas.
- Localización de paradas mediante coordenadas geográficas.

### Mapa interactivo

El mapa utiliza Leaflet y OpenStreetMap para representar geográficamente las paradas.

Entre sus características se encuentran:

- Vista inicial centrada en Puebla.
- Marcadores para cada parada registrada.
- Diferenciación visual entre paradas activas e inactivas.
- Ventanas informativas al seleccionar un marcador.
- Botón **Ver en mapa** para localizar una parada.
- Actualización automática de los marcadores después de las operaciones CRUD.

## 10. Instalación y ejecución

Para ejecutar el proyecto localmente es necesario contar con:

- Python 3.11 o superior.
- Una cuenta y base de datos configurada en Redis Cloud.
- Git.
- Un editor de código, como Visual Studio Code.

### Paso 1. Clonar el repositorio

```bash
git clone https://github.com/USUARIO/rutas-puebla.git
```

Entrar al directorio:

```bash
cd rutas-puebla
```

### Paso 2. Crear el entorno virtual

```bash
python -m venv .venv
```

Activarlo en Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

### Paso 3. Instalar dependencias

```bash
python -m pip install -r requirements.txt
```

### Paso 4. Configurar las variables de entorno

Crear un archivo llamado `.env` en la raíz del proyecto y configurar la variable:

```env
REDIS_URL=TU_CADENA_DE_CONEXION_DE_REDIS_CLOUD
```

La cadena debe obtenerse desde la configuración de la base de datos en Redis Cloud.

**Importante:** No se deben compartir ni subir al repositorio las credenciales de Redis Cloud. El archivo `.env` debe permanecer excluido del control de versiones mediante `.gitignore`.

### Paso 5. Ejecutar la aplicación

Desde la raíz del proyecto, ejecutar:

```bash
uvicorn app.main:app --reload
```

Si la configuración es correcta, la aplicación estará disponible en:

```text
http://127.0.0.1:8000
```

La documentación interactiva de la API estará disponible en:

```text
http://127.0.0.1:8000/docs
```

## 11. Pruebas realizadas

Se realizaron pruebas manuales para comprobar el funcionamiento de las funcionalidades principales del sistema.

| Prueba | Resultado esperado | Estado |
|---|---|---|
| Conexión con Redis Cloud | La conexión responde correctamente al ejecutar PING. | Aprobada |
| Crear una parada | El registro se guarda en Redis Cloud. | Aprobada |
| Listar paradas | Se muestran los registros almacenados. | Aprobada |
| Consultar una parada | Se obtiene la información del identificador solicitado. | Aprobada |
| Consultar un ID inexistente | La API responde con HTTP 404. | Aprobada |
| Actualizar una parada | Los cambios se guardan correctamente. | Aprobada |
| Actualizar un ID inexistente | La API responde con HTTP 404. | Aprobada |
| Eliminar una parada | El registro se elimina correctamente. | Aprobada |
| Eliminar un ID inexistente | La API responde con HTTP 404. | Aprobada |
| Operaciones desde el frontend | Se pueden realizar las operaciones CRUD desde la interfaz. | Aprobada |
| Visualización en el mapa | Las paradas aparecen en sus coordenadas correspondientes. | Aprobada |
| Actualización de marcadores | Los marcadores reflejan los cambios realizados. | Aprobada |
| Persistencia de información | Los registros permanecen después de reiniciar el servidor. | Aprobada |

Las pruebas de persistencia permitieron comprobar que la información no depende únicamente de la ejecución local del servidor, sino que permanece almacenada en Redis Cloud.

## 12. Seguridad y configuración

Para proteger la información de conexión con Redis Cloud se utilizaron variables de entorno.

El archivo `.env` contiene la cadena de conexión privada y no debe publicarse en GitHub.

El archivo `.env.example` sirve como referencia para que otros desarrolladores conozcan las variables necesarias para ejecutar el proyecto sin exponer credenciales reales.

Además, el archivo `.gitignore` excluye archivos locales y configuraciones que no deben formar parte del repositorio.

## 13. Resultados del Sprint

Al finalizar el Sprint 1 se obtuvo una aplicación web funcional que integra una API REST desarrollada con FastAPI, una base de datos Redis Cloud y una interfaz web con visualización geográfica.

Se implementaron las operaciones CRUD, la validación de datos, la generación de identificadores únicos, el manejo de registros inexistentes y la persistencia de información en la nube.

También se integró un mapa interactivo que permite localizar las paradas registradas y visualizar información relacionada con cada una.

Las pruebas manuales confirmaron el funcionamiento de las operaciones desde Swagger y desde la interfaz web, así como la persistencia de los registros después de reiniciar el servidor.

## 14. Conclusiones

El desarrollo de Rutas Puebla permitió aplicar conocimientos relacionados con bases de datos en la nube, desarrollo de APIs REST, programación backend y frontend, y visualización de información geográfica.

La integración de Redis Cloud permitió comprender cómo una aplicación puede almacenar y recuperar información desde un servicio externo, mientras que FastAPI facilitó la construcción de endpoints para administrar los registros.

Asimismo, el uso de Leaflet y OpenStreetMap permitió complementar las operaciones CRUD con una representación visual de las ubicaciones geográficas.

En conclusión, se cumplieron las funcionalidades principales planteadas para el Sprint 1, obteniendo una aplicación funcional que demuestra la integración entre un backend en Python, una base de datos en la nube y una interfaz web interactiva.

---

**Proyecto académico:** Rutas Puebla  
**Asignatura:** Bases de Datos en la Nube  
**Sprint:** 1  
**Tecnologías principales:** Python, FastAPI, Redis Cloud, HTML, CSS, JavaScript y Leaflet.