const { Pool } = require("pg");

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    precio NUMERIC(12, 2) NOT NULL CHECK (precio >= 0),
    cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

function createPool(config) {
  return new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    max: 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  });
}

async function waitForDatabase(pool, attempts = 20, delayMs = 1500) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (error) {
      lastError = error;
      console.log(
        `Esperando PostgreSQL (intento ${attempt}/${attempts}): ${error.message}`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(
    `No fue posible conectar con PostgreSQL: ${lastError && lastError.message}`
  );
}

async function initializeDatabase(pool) {
  await waitForDatabase(pool);
  await pool.query(CREATE_TABLE_SQL);
}

module.exports = {
  createPool,
  initializeDatabase,
};
