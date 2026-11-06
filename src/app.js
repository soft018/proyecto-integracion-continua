const path = require("path");
const express = require("express");
const { validateProducto } = require("./validators");
const { crearProducto, listarProductos } = require("./productos");

function createApp(pool) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.get("/api/salud", async (_req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ ok: true, servicio: "app", baseDatos: "db" });
    } catch (error) {
      res.status(503).json({
        ok: false,
        mensaje: "La aplicación no pudo verificar PostgreSQL.",
      });
    }
  });

  app.get("/api/productos", async (_req, res) => {
    try {
      const productos = await listarProductos(pool);
      res.json({ ok: true, productos });
    } catch (error) {
      console.error("Error al consultar productos:", error);
      res.status(500).json({
        ok: false,
        mensaje: "No fue posible consultar los productos.",
      });
    }
  });

  app.post("/api/productos", async (req, res) => {
    const validation = validateProducto(req.body);

    if (!validation.ok) {
      return res.status(400).json({
        ok: false,
        mensaje: "Revise los datos del producto.",
        errores: validation.errors,
      });
    }

    try {
      const producto = await crearProducto(pool, validation.value);
      res.status(201).json({
        ok: true,
        mensaje: `El producto "${producto.nombre}" se registró correctamente.`,
        producto,
      });
    } catch (error) {
      console.error("Error al registrar producto:", error);
      res.status(500).json({
        ok: false,
        mensaje: "No fue posible guardar el producto en PostgreSQL.",
      });
    }
  });

  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({
        ok: false,
        mensaje: "Recurso no encontrado.",
      });
    }
    return next();
  });

  return app;
}

module.exports = { createApp };
