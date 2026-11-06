async function crearProducto(pool, producto) {
  const result = await pool.query(
    `INSERT INTO productos (nombre, descripcion, precio, cantidad)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, descripcion, precio, cantidad, creado_en`,
    [producto.nombre, producto.descripcion, producto.precio, producto.cantidad]
  );

  return mapProducto(result.rows[0]);
}

async function listarProductos(pool) {
  const result = await pool.query(
    `SELECT id, nombre, descripcion, precio, cantidad, creado_en
     FROM productos
     ORDER BY id DESC`
  );

  return result.rows.map(mapProducto);
}

function mapProducto(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: Number(row.precio),
    cantidad: row.cantidad,
    creado_en: row.creado_en,
  };
}

module.exports = { crearProducto, listarProductos };
