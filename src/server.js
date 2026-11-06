const { loadConfig } = require("./config");
const { createPool, initializeDatabase } = require("./db");
const { createApp } = require("./app");

async function start() {
  const config = loadConfig();
  const pool = createPool(config);

  await initializeDatabase(pool);

  const app = createApp(pool);
  const server = app.listen(config.port, "0.0.0.0", () => {
    console.log(`Aplicación disponible en el puerto ${config.port}`);
    console.log(`Conectada a PostgreSQL en el host ${config.db.host}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start().catch((error) => {
  console.error("No fue posible iniciar la aplicación:", error.message);
  process.exit(1);
});
