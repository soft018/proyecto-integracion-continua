const { test } = require("node:test");
const assert = require("node:assert/strict");
const { validateProducto } = require("../src/validators");

test("acepta un producto válido", () => {
  const result = validateProducto({
    nombre: "Cuaderno",
    descripcion: "Cuaderno universitario de 100 hojas",
    precio: 8500.5,
    cantidad: 12,
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.nombre, "Cuaderno");
  assert.equal(result.value.cantidad, 12);
});

test("rechaza campos vacíos o inválidos", () => {
  const result = validateProducto({
    nombre: "  ",
    descripcion: "",
    precio: -10,
    cantidad: 1.5,
  });

  assert.equal(result.ok, false);
  assert.ok(result.errors.length >= 3);
});

test("rechaza cantidades negativas", () => {
  const result = validateProducto({
    nombre: "Lápiz",
    descripcion: "Lápiz de grafito",
    precio: 1200,
    cantidad: -1,
  });

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes("cantidad")));
});
