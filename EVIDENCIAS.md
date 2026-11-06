# Evidencias para el PDF académico

Tome capturas de pantalla nítidas, con fecha visible cuando sea posible, y agréguelas al informe en PDF. Use esta lista como guía de entrega.

## 1. Código y repositorio

1. Estructura de carpetas del proyecto en el explorador o en el editor.
2. Archivo `Dockerfile` abierto.
3. Archivo `compose.yaml` abierto, mostrando los servicios `app` y `db`, la red, el volumen, `depends_on` y el hostname `db`.
4. Archivo `.env.example` abierto (sin contraseñas reales).
5. Archivo `.gitignore` donde se vea que `.env` está excluido.
6. Archivo `.dockerignore`.
7. Historial de Git con commits descriptivos (`git log --oneline`).
8. Repositorio en GitHub con el código publicado (cuando el docente lo autorice).

## 2. Docker

9. Construcción de la imagen: `docker build -t gestion-productos:evidencia .`
10. Levantamiento de servicios: `docker compose up -d`
11. Contenedores en ejecución: `docker ps` (deben verse `app` y `db`).
12. Inspección de la red: `docker network inspect productos_net`
13. Inspección del volumen: `docker volume ls` y, si es posible, `docker volume inspect gestion-productos_postgres_data` o el nombre que muestre Compose.
14. Logs de ambos servicios: `docker compose logs app` y `docker compose logs db`.

## 3. Aplicación funcional

15. Interfaz web en el navegador (`http://localhost:3000`) en vista de escritorio.
16. La misma interfaz en vista móvil o ventana reducida (diseño responsive).
17. Formulario diligenciado antes de guardar.
18. Mensaje de confirmación al registrar un producto válido.
19. Tabla con el producto recién guardado.
20. Mensaje de error al enviar datos inválidos (por ejemplo, precio negativo o nombre vacío).
21. Recarga del navegador demostrando que los datos persisten en PostgreSQL.

## 4. Integración continua

22. Archivo `.github/workflows/ci.yml` abierto.
23. Ejecución del workflow en GitHub Actions.
24. Paso de instalación de dependencias en verde.
25. Paso de pruebas automatizadas en verde.
26. Paso de construcción de la imagen Docker en verde.
27. Paso de prueba de integración (guardar y consultar un producto) en verde.
28. Si se provoca un fallo a propósito (por ejemplo, una prueba rota en una rama), captura del workflow en rojo para demostrar que CI sí falla.

## 5. Seguridad y buenas prácticas

29. Búsqueda en el repositorio confirmando que no hay un archivo `.env` versionado.
30. Consulta parametrizada en `src/productos.js` (`$1`, `$2`, `$3`, `$4`).
31. Imágenes con versión fija, sin etiquetas `latest`.
