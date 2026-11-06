# Gestión de productos

Aplicación académica para la materia **Énfasis Profesional I (Integración Continua)** del Politécnico Grancolombiano.

Permite registrar y consultar productos mediante una interfaz web sencilla. Los datos se guardan realmente en PostgreSQL. El sistema se ejecuta con **exactamente dos contenedores Docker**: `app` (Node.js + Express) y `db` (PostgreSQL), comunicados por una red interna.

## Tecnologías utilizadas

- Node.js 22.11.0 y Express 4.22.3
- PostgreSQL 16.4
- Docker y Docker Compose
- GitHub Actions

## Estructura de carpetas

```text
.
├── .github/workflows/ci.yml   Flujo de integración continua
├── db/init.sql                Creación inicial de la tabla productos
├── public/                    Interfaz web en español
├── src/                       Backend Express
├── tests/                     Pruebas de validación e integración
├── Dockerfile                 Imagen de la aplicación
├── compose.yaml               Orquestación de app y db
├── .env.example               Variables de entorno de ejemplo
├── package.json
└── package-lock.json
```

## Requisitos de instalación

- Docker Desktop o Docker Engine con Docker Compose
- Git
- Node.js 20 o superior, solo si desea ejecutar pruebas fuera de Docker

## Configuración del archivo `.env`

1. Copie el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
   En Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Cambie `POSTGRES_PASSWORD` por una contraseña propia.
3. No suba el archivo `.env` al repositorio. Ya está incluido en `.gitignore`.
4. En Docker Compose, `POSTGRES_HOST` se fuerza a `db`. La aplicación **nunca** debe conectarse a PostgreSQL usando `localhost` ni una IP fija.

## Construir y levantar los contenedores

```bash
docker compose build
docker compose up -d
```

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000).

Para detener los servicios:

```bash
docker compose down
```

El volumen `postgres_data` conserva los productos aunque se detengan los contenedores. Si necesita borrar también los datos:

```bash
docker compose down -v
```

## Comandos para ejecutar pruebas

Validaciones locales (no requieren Docker):

```bash
npm ci
npm test
```

Prueba de integración (requiere los contenedores en ejecución):

```bash
docker compose up -d --wait
npm run test:integration
```

GitHub Actions ejecuta ambos tipos de verificación, construye la imagen y falla el workflow si alguna no se cumple.

## Cómo se comunican los servicios

1. Docker Compose crea la red `productos_net`.
2. El servicio `db` se publica dentro de esa red con el hostname `db`.
3. El servicio `app` espera a que PostgreSQL esté sano (`depends_on` + `healthcheck`).
4. Node.js abre un pool de conexiones hacia `POSTGRES_HOST=db` y el puerto interno `5432`.
5. El navegador solo habla con `app` en el puerto `3000`. `app` es quien consulta y guarda en `db`.

```text
Navegador --> localhost:3000 --> contenedor app --red productos_net--> hostname db:5432
```

## Comandos para evidencias académicas

```bash
docker build -t gestion-productos:evidencia .
docker compose up -d
docker ps
docker network inspect productos_net
```

Consulte `EVIDENCIAS.md` para la lista de capturas sugeridas del PDF.

## API

- `GET /api/salud` — verifica aplicación y base de datos.
- `GET /api/productos` — lista los productos.
- `POST /api/productos` — registra un producto con `nombre`, `descripcion`, `precio` y `cantidad`.
