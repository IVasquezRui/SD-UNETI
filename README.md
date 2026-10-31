# 🇻🇪 Proyecto Soberanía Digital 2026-2030 — UNETI

[![MVP](https://img.shields.io/badge/estado-MVP%20v1.0-0B5FFF)](Documents/PROGRESS.md)
[![Seed portable](https://github.com/IVasquezRui/SD-UNETI/actions/workflows/seed.yml/badge.svg)](https://github.com/IVasquezRui/SD-UNETI/actions/workflows/seed.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-000000)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-26.13.0%20LTS-339933)](https://nodejs.org/)
[![WordPress](https://img.shields.io/badge/WordPress-7.1.4-21759B)](https://wordpress.org/)
[![WPGraphQL](https://img.shields.io/badge/WPGraphQL-2.26.0-E10098)](https://www.wpgraphql.com/)
[![Docker](https://img.shields.io/badge/Docker%20Compose-3%20servicios-2496ED)](docker-compose.yml)
[![Licencia](https://img.shields.io/badge/licencia-por%20definir-lightgrey)](Documents/Soberanía%20Digital%202026.md)

Portal institucional de la **Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI)**, construido como una arquitectura *headless*: Next.js renderiza la experiencia pública y WordPress administra el contenido institucional. El objetivo es una plataforma rápida, accesible, segura y **reproducible desde un clon limpio**, sin depender de un dump SQL ni de archivos locales no versionados.

## Arquitectura

```text
Navegador
   │
   ├── HTML / SSE ─────────────► Next.js :3000
   │                                │
   │                                ├── WPGraphQL ──────► WordPress :8080
   │                                │                        │
   │                                └── REST comentarios ───┤
   │                                                         ▼
   └───────────────────────────────────────────────────► MariaDB :3306
```

- **Frontend:** Next.js 16 con App Router, React 19, TypeScript y el sistema visual del template `demo-elearning`.
- **Backend CMS:** WordPress headless con WPGraphQL; no renderiza el sitio público.
- **Persistencia:** MariaDB para posts, medios, taxonomías y comentarios nativos (`wp_comments`).
- **Contenido reproducible:** `seed/` contiene fixtures JSON, imágenes originales y un manifiesto con checksums.
- **Infraestructura:** Docker Compose con imágenes fijadas por etiqueta.

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | Next.js / React | `16.4.3` / `19.3.1` |
| Runtime frontend | Node.js + npm | `26.13.0` LTS |
| Lenguaje | TypeScript | `5.9.3` |
| Estilos | Template `demo-elearning` + `uneti.css` | — |
| CMS | WordPress | `7.1.4` (PHP 8.5) |
| API de contenido | WPGraphQL | `2.26.0` |
| Base de datos | MariaDB | `11.8.9` |
| Orquestación | Docker Compose | 3 servicios |

## Inicio rápido

### Requisitos

- Git.
- Docker Engine con Docker Compose v2.
- Python 3.10+ (solo biblioteca estándar).
- Opcional: Node.js `26.13.0` LTS y npm si se ejecuta el frontend fuera de Docker.

### Levantar el entorno

```bash
git clone https://github.com/IVasquezRui/SD-UNETI.git
cd SD-UNETI

cp .env.example .env
# Edita .env: contraseñas, correo del administrador y URL pública.

docker compose up -d
python3 scripts/seed/seed.py bootstrap
```

`bootstrap` instala WordPress si la base está vacía, activa WPGraphQL, importa las 6 noticias con sus imágenes y comentarios, y ejecuta `verify`. El proceso es idempotente: puede repetirse sin duplicar contenido.

### Frontend fuera de Docker

Requiere Node.js `26.13.0` LTS y npm.

```bash
cd frontend
npm install
npm run dev
```

El build de producción (`npm run build`) debe ejecutarse con WordPress arriba y el seed importado: `generateStaticParams` necesita las noticias publicadas para prerenderizar los detalles.

### URLs locales

| Servicio | URL |
|---|---|
| Portal Next.js | `http://localhost:3000` |
| WordPress | `http://localhost:8080` |
| Administración | `http://localhost:8080/wp-admin` |
| WPGraphQL | `http://localhost:8080/graphql` |
| API de comentarios | `http://localhost:8080/wp-json/uneti/v1/comentarios/{slug}` |

## Seed portable

`seed/` es la fuente de verdad del contenido demo. No hay `database/init.sql`: la base se crea vacía y el contenido se restaura con las APIs nativas de WordPress.

```bash
# Validar fixtures, referencias y checksums (no requiere Docker)
python3 scripts/seed/seed.py validate

# Importar de forma idempotente
python3 scripts/seed/seed.py import

# Reemplazar originales y regenerar miniaturas
python3 scripts/seed/seed.py import --refresh-media

# Comprobar GraphQL, comentarios e imágenes
python3 scripts/seed/seed.py verify

# Exportar el WordPress actual a seed/
python3 scripts/seed/seed.py export
```

Detalles de esquema, privacidad, placeholders e idempotencia: [`seed/README.md`](seed/README.md).

## Comandos de desarrollo

```bash
# Frontend dentro de Docker (modo desarrollo)
docker compose up -d frontend

# Tipos, lint y build de producción en un contenedor efímero
docker compose stop frontend
docker compose run --rm --no-deps frontend sh -c 'npm ci --no-audit --no-fund && npm run build'
docker compose start frontend
```

> No fijes `NODE_ENV` en el servicio `frontend`. `next dev` y `next build` gestionan ese valor; forzarlo globalmente provoca un fallo de prerender en `/_global-error`.

## Estructura del proyecto

```text
.
├── frontend/                  Next.js: rutas, componentes, hooks y cliente GraphQL
├── scripts/
│   ├── seed/seed.py           Orquestador Python: validate, export, import, bootstrap, verify
│   └── wordpress/             Bootstrap PHP, importador/exportador y mu-plugin de comentarios
├── seed/                      Fixtures JSON, imágenes originales, manifiesto y créditos
├── wp_content/plugins/        WPGraphQL versionado y montado en el contenedor
├── database/                  Documentación; sin dump SQL
├── docker-compose.yml         MariaDB + WordPress + Next.js
├── Documents/                 Arquitectura, ADR, estado y plan doc-as-code
└── lookdown/                  Grafo local para agentes (excluido de Git)
```

## Modelo de contenido

- **Noticias:** posts publicados en WordPress, con excerpt, contenido HTML, imagen destacada, categorías, etiquetas y autor genérico.
- **Medios:** originales en `seed/media/AAAA/MM/`; WordPress genera las variantes y miniaturas.
- **Comentarios:** almacenados en `wp_comments`; el frontend los consume por la API REST propia y los publica con moderación nativa.
- **Carreras:** contenido estático en TypeScript para los PNF en Informática y Telecomunicaciones.
- **Tiempo real:** SSE con respaldo por polling para reflejar noticias nuevas sin WebSockets.

## Reproducibilidad y privacidad

- `seed/manifest.json` registra conteos y SHA-256 de los originales.
- La importación usa marcas `_uneti_seed_*` y adopta objetos existentes por slug, archivo o autor + contenido.
- El seed no incluye usuarios reales, hashes, sesiones, IPs ni correos personales.
- Los secretos viven en `.env` (ignorado por Git). Para producción deben migrarse a Docker secrets o a un gestor externo.
- Si el repositorio se compartió con un `init.sql` histórico, rota la contraseña de WordPress e invalida las sesiones.

## Integración continua

El workflow [`.github/workflows/seed.yml`](.github/workflows/seed.yml) se ejecuta en cada cambio de `seed/`, `scripts/`, `frontend/` o `docker-compose.yml`. Valida los fixtures, levanta MariaDB y WordPress, ejecuta `bootstrap`, comprueba la idempotencia con una segunda importación, corre `verify` y construye el frontend en producción. Si falla, publica los logs de los contenedores como artefacto.

## Documentación

- [`Documents/Soberanía Digital 2026.md`](Documents/Soberanía%20Digital%202026.md): arquitectura, ADR, calidad, seguridad y roadmap.
- [`Documents/PROGRESS.md`](Documents/PROGRESS.md): estado del MVP y validaciones ejecutadas.
- [`Documents/doc-as-code_20102026.md`](Documents/doc-as-code_20102026.md): plan del seed portable y criterios de aceptación.
- [`Documents/nextSteps.md`](Documents/nextSteps.md): siguientes fases.
- [`seed/README.md`](seed/README.md): contrato de los fixtures.
- [`seed/CREDITS.md`](seed/CREDITS.md): procedencia y licencia de las imágenes.

## Contribución

1. Crea una rama desde `main`.
2. Mantén los cambios de contenido en `seed/` y los cambios de presentación en `frontend/`.
3. Ejecuta `python3 scripts/seed/seed.py validate`, `npx tsc --noEmit`, `npm run lint` y `npm run build`.
4. No incluyas secretos, volúmenes (`db_data/`, `wp_data/`) ni artefactos de build.
5. Actualiza la documentación y los créditos de imágenes cuando incorpores activos.

## Licencia

La licencia del código y de los activos institucionales está **pendiente de definición formal**. Antes de publicar el repositorio deben añadirse el archivo `LICENSE`, la auditoría de licencias de la plantilla `demo-elearning` y los créditos de todas las imágenes. El proyecto aspira a un modelo de Gobierno Abierto y Soberanía Tecnológica; esta declaración no sustituye la revisión legal.
