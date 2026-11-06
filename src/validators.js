function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateProducto(payload) {
  const errors = [];
  const nombre = asString(payload && payload.nombre);
  const descripcion = asString(payload && payload.descripcion);
  const precio = Number(payload && payload.precio);
  const cantidad = Number(payload && payload.cantidad);

  if (!nombre) {
    errors.push("El nombre es obligatorio.");
  } else if (nombre.length > 120) {
    errors.push("El nombre no puede superar 120 caracteres.");
  }

  if (!descripcion) {
    errors.push("La descripción es obligatoria.");
  } else if (descripcion.length > 500) {
    errors.push("La descripción no puede superar 500 caracteres.");
  }

  if (!Number.isFinite(precio) || precio < 0) {
    errors.push("El precio debe ser un número mayor o igual a 0.");
  }

  if (!Number.isInteger(cantidad) || cantidad < 0) {
    errors.push("La cantidad debe ser un número entero mayor o igual a 0.");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: {
      nombre,
      descripcion,
      precio,
      cantidad,
    },
  };
}

module.exports = { validateProducto };
