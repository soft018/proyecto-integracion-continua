const formulario = document.getElementById("formulario-producto");
const alerta = document.getElementById("alerta");
const tabla = document.getElementById("tabla-productos");
const botonActualizar = document.getElementById("boton-actualizar");

function mostrarAlerta(tipo, mensaje) {
  alerta.hidden = false;
  alerta.className = `alerta ${tipo}`;
  alerta.textContent = mensaje;
}

async function cargarProductos() {
  try {
    const respuesta = await fetch("/api/productos");
    const datos = await respuesta.json();

    if (!respuesta.ok || !datos.ok) {
      throw new Error(datos.mensaje || "No fue posible consultar los productos.");
    }

    if (!datos.productos.length) {
      tabla.innerHTML =
        '<tr><td colspan="5">Todavía no hay productos registrados.</td></tr>';
      return;
    }

    tabla.innerHTML = datos.productos
      .map(
        (producto) => `
          <tr>
            <td>${producto.id}</td>
            <td>${escapeHtml(producto.nombre)}</td>
            <td>${escapeHtml(producto.descripcion)}</td>
            <td>$${Number(producto.precio).toFixed(2)}</td>
            <td>${producto.cantidad}</td>
          </tr>
        `
      )
      .join("");
  } catch (error) {
    tabla.innerHTML =
      '<tr><td colspan="5">Error al cargar los productos.</td></tr>';
    mostrarAlerta("error", error.message);
  }
}

function escapeHtml(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const payload = {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    precio: document.getElementById("precio").value,
    cantidad: document.getElementById("cantidad").value,
  };

  try {
    const respuesta = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const datos = await respuesta.json();

    if (!respuesta.ok || !datos.ok) {
      const detalle = (datos.errores || []).join(" ");
      throw new Error(`${datos.mensaje || "No se pudo registrar."} ${detalle}`.trim());
    }

    mostrarAlerta("ok", datos.mensaje);
    formulario.reset();
    await cargarProductos();
  } catch (error) {
    mostrarAlerta("error", error.message);
  }
});

botonActualizar.addEventListener("click", cargarProductos);
cargarProductos();
