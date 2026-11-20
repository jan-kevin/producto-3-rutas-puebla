
const API_URL = "/paradas";

// Inicializar el mapa centrado en Puebla.
const mapa = L.map("mapa").setView([19.0414, -98.2063], 13);

// Agregar el mapa base de OpenStreetMap.
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapa);

// Grupo donde colocaremos los marcadores.
const marcadores = L.layerGroup().addTo(mapa);

// Guardaremos los marcadores para poder localizarlos.
const marcadoresPorId = new Map();

const formulario = document.getElementById("parada-form");
const listaParadas = document.getElementById("lista-paradas");
const mensaje = document.getElementById("mensaje");
const botonGuardar = formulario.querySelector('button[type="submit"]');

// Identifica si estamos creando o editando una parada.
let paradaEnEdicion = null;

// Creamos dinámicamente el botón para cancelar una edición.
const botonCancelar = document.createElement("button");
botonCancelar.type = "button";
botonCancelar.textContent = "Cancelar edición";
botonCancelar.style.display = "none";
botonCancelar.style.marginLeft = "10px";

botonGuardar.insertAdjacentElement("afterend", botonCancelar);

//Mapa:
// Actualizar los marcadores según las paradas de la API.
function actualizarMapa(paradas) {
    marcadores.clearLayers();
    marcadoresPorId.clear();

    paradas.forEach(parada => {
        // Verde para activas y rojo para inactivas.
        const color = parada.activa ? "#16a34a" : "#dc2626";

        const marcador = L.circleMarker(
            [parada.latitud, parada.longitud],
            {
                radius: 9,
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
                weight: 2
            }
        );

        // Construir el contenido del popup de forma segura.
        const contenido = document.createElement("div");

        const titulo = document.createElement("strong");
        titulo.textContent = parada.nombre;

        const colonia = document.createElement("p");
        colonia.textContent = `Colonia: ${parada.colonia}`;

        const rutas = document.createElement("p");
        rutas.textContent = `Rutas: ${parada.rutas.length > 0
                ? parada.rutas.join(", ")
                : "No especificadas"
            }`;

        const estado = document.createElement("p");
        estado.textContent = parada.activa ? "Activa" : "Inactiva";

        contenido.append(titulo, colonia, rutas, estado);

        marcador.bindPopup(contenido);
        marcador.addTo(marcadores);

        marcadoresPorId.set(parada.id, marcador);
    });
}


// Centrar el mapa en una parada específica.
function centrarParada(parada) {
    const marcador = marcadoresPorId.get(parada.id);

    if (marcador) {
        mapa.setView(
            [parada.latitud, parada.longitud],
            17
        );

        marcador.openPopup();
    }
}


// Mostrar mensajes al usuario.
function mostrarMensaje(texto, esError = false) {
    mensaje.textContent = texto;
    mensaje.style.color = esError ? "#d94b4b" : "#23834c";
}


// Obtener los datos de una respuesta HTTP.
async function obtenerRespuesta(respuesta) {
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.detail || "Ocurrió un error en la solicitud.");
    }

    return datos;
}


// Consultar todas las paradas.
async function cargarParadas() {
    listaParadas.textContent = "Cargando paradas...";

    try {
        const respuesta = await fetch(API_URL);
        const paradas = await obtenerRespuesta(respuesta);
        actualizarMapa(paradas);

        listaParadas.replaceChildren();

        if (paradas.length === 0) {
            const texto = document.createElement("p");
            texto.textContent = "Todavía no hay paradas registradas.";
            listaParadas.appendChild(texto);
            return;
        }

        paradas.forEach(parada => {
            const tarjeta = document.createElement("article");
            tarjeta.className = "parada-card";

            const titulo = document.createElement("h3");
            titulo.textContent = parada.nombre;

            const colonia = document.createElement("p");
            colonia.textContent = `Colonia: ${parada.colonia}`;

            const municipio = document.createElement("p");
            municipio.textContent = `Municipio: ${parada.municipio}`;

            const rutas = document.createElement("p");
            rutas.textContent = `Rutas: ${parada.rutas.length > 0
                    ? parada.rutas.join(", ")
                    : "No especificadas"
                }`;

            const coordenadas = document.createElement("p");
            coordenadas.textContent =
                `Ubicación: ${parada.latitud}, ${parada.longitud}`;

            const estado = document.createElement("p");
            estado.textContent = `Estado: ${parada.activa ? "Activa" : "Inactiva"
                }`;

            const acciones = document.createElement("div");
            acciones.className = "parada-actions";

            const botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.className = "btn-edit";
            botonEditar.textContent = "Editar";

            botonEditar.addEventListener("click", () => {
                prepararEdicion(parada);
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.className = "btn-delete";
            botonEliminar.textContent = "Eliminar";

            botonEliminar.addEventListener("click", () => {
                eliminarParada(parada.id);
            });

            const botonMapa = document.createElement("button");
            botonMapa.type = "button";
            botonMapa.textContent = "Ver en mapa";
            botonMapa.className = "btn-primary";

            botonMapa.addEventListener("click", () => {
                centrarParada(parada);
                document.getElementById("mapa").scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            });

            acciones.append(botonMapa, botonEditar, botonEliminar);

            tarjeta.append(
                titulo,
                colonia,
                municipio,
                rutas,
                coordenadas,
                estado,
                acciones
            );

            listaParadas.appendChild(tarjeta);
        });

    } catch (error) {
        listaParadas.textContent = "No fue posible cargar las paradas.";
        mostrarMensaje(error.message, true);
    }
}


// Registrar o actualizar una parada.
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const datosParada = {
        nombre: document.getElementById("nombre").value.trim(),
        colonia: document.getElementById("colonia").value.trim(),
        municipio:
            document.getElementById("municipio").value.trim() || "Puebla",
        latitud: Number(document.getElementById("latitud").value),
        longitud: Number(document.getElementById("longitud").value),
        rutas: document.getElementById("rutas").value
            .split(",")
            .map(ruta => ruta.trim())
            .filter(ruta => ruta.length > 0),
        activa: document.getElementById("activa").value === "true"

    };

    try {
        let respuesta;

        if (paradaEnEdicion) {
            // Actualizar una parada existente.
            respuesta = await fetch(`${API_URL}/${paradaEnEdicion}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosParada)
            });
        } else {
            // Registrar una nueva parada.
            respuesta = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosParada)
            });
        }

        await obtenerRespuesta(respuesta);

        mostrarMensaje(
            paradaEnEdicion
                ? "¡Parada actualizada correctamente!"
                : "¡Parada registrada correctamente!"
        );

        formulario.reset();
        document.getElementById("municipio").value = "Puebla";

        cancelarEdicion();
        await cargarParadas();

    } catch (error) {
        mostrarMensaje(error.message, true);
    }
});


// Preparar el formulario para editar una parada.
function prepararEdicion(parada) {
    paradaEnEdicion = parada.id;

    document.getElementById("nombre").value = parada.nombre;
    document.getElementById("colonia").value = parada.colonia;
    document.getElementById("municipio").value = parada.municipio;
    document.getElementById("latitud").value = parada.latitud;
    document.getElementById("longitud").value = parada.longitud;
    document.getElementById("rutas").value = parada.rutas.join(", ");
    document.getElementById("activa").value = String(parada.activa);

    botonGuardar.textContent = "Guardar cambios";
    botonCancelar.style.display = "inline-block";

    mostrarMensaje(`Editando la parada: ${parada.nombre}`);

    formulario.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// Cancelar el modo de edición.
function cancelarEdicion() {
    paradaEnEdicion = null;

    botonGuardar.textContent = "Registrar parada";
    botonCancelar.style.display = "none";

    formulario.reset();
    document.getElementById("activa").value = "true";
    document.getElementById("municipio").value = "Puebla";
}

botonCancelar.addEventListener("click", () => {
    cancelarEdicion();
    mostrarMensaje("Edición cancelada.");
});


// Eliminar una parada.
async function eliminarParada(id) {
    const confirmar = confirm(
        "¿Estás seguro de que deseas eliminar esta parada?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        await obtenerRespuesta(respuesta);

        mostrarMensaje("¡Parada eliminada correctamente!");

        if (paradaEnEdicion === id) {
            cancelarEdicion();
        }

        await cargarParadas();

    } catch (error) {
        mostrarMensaje(error.message, true);
    }
}


// Cargar las paradas cuando se abre la página.
cargarParadas();