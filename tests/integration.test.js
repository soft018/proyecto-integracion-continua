const { test } = require("node:test");
const assert = require("node:assert/strict");

const baseUrl = process.env.APP_URL || "http://127.0.0.1:3000";
const nombreUnico = `Producto CI ${Date.now()}`;

async function waitForApp(attempts = 30) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const respuesta = await fetch(`${baseUrl}/api/salud`);
      if (respuesta.ok) {
        return;
      }
      lastError = new Error(`Estado ${respuesta.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(
    `La aplicación no respondió en ${baseUrl}: ${lastError && lastError.message}`
  );
}

test("la aplicación guarda y consulta un producto en PostgreSQL", async () => {
  await waitForApp();

  const creacion = await fetch(`${baseUrl}/api/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: nombreUnico,
      descripcion: "Producto creado por la prueba de integración",
      precio: 19990,
      cantidad: 3,
    }),
  });

  const creado = await creacion.json();
  assert.equal(creacion.status, 201, creado.mensaje);
  assert.equal(creado.ok, true);
  assert.equal(creado.producto.nombre, nombreUnico);

  const consulta = await fetch(`${baseUrl}/api/productos`);
  const listado = await consulta.json();

  assert.equal(consulta.ok, true);
  assert.equal(listado.ok, true);
  assert.ok(
    listado.productos.some((producto) => producto.nombre === nombreUnico),
    "El producto guardado no apareció en la consulta"
  );
});
