function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

function loadConfig() {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 3000),
    db: {
      host: required("POSTGRES_HOST"),
      port: Number(process.env.POSTGRES_PORT || 5432),
      user: required("POSTGRES_USER"),
      password: required("POSTGRES_PASSWORD"),
      database: required("POSTGRES_DB"),
    },
  };
}

module.exports = { loadConfig };
