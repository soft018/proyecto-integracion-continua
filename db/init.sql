CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  precio NUMERIC(12, 2) NOT NULL CHECK (precio >= 0),
  cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
