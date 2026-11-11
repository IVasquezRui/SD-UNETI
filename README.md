# 🇻🇪 Portal Web Soberanía Digital 2026 -- UNETI

[![Estado](https://img.shields.io/badge/estado-Producci%C3%B3n-0B5FFF)](DocumentacionTecnica/informe-tecnico-2026-11-10.md)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-000000)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.1-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-26.13.0%20LTS-339933)](https://nodejs.org/)
[![WordPress](https://img.shields.io/badge/WordPress-7.1.4-21759B)](https://wordpress.org/)
[![WPGraphQL](https://img.shields.io/badge/WPGraphQL-2.26.0-E10098)](https://www.wpgraphql.com/)
[![MariaDB](https://img.shields.io/badge/MariaDB-11.8.9-003545)](https://mariadb.org/)
[![Docker](https://img.shields.io/badge/Docker%20Compose-3%20servicios-2496ED)](docker-compose.yml)
[![GPL v3](https://img.shields.io/badge/GPL%20v3-orange)](LICENSE)

Portal institucional de la **Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI)**, construido como una plataforma *headless*: Next.js renderiza la experiencia pública y WordPress administra el contenido institucional. El sistema está **completo y preparado para despliegue en producción**, con contenido reproducible desde un clon limpio, seguridad endurecida y un procedimiento de salida a producción documentado paso a paso.

## Arquitectura

```text
Navegador
   │
   ├── HTML / SSE ──────────────► Next.js :3000
   │                                 │
   │                                 ├── WPGraphQL ─────────► WordPress :8080
   │                                 │                         │
   │                                 ├── REST comentarios ────┤
   │                                 │                         │
   │                                 └── POST solicitudes ────┤
   │                                      (token de servidor)  ▼
   └─────────────────────────────────────────────────────► MariaDB :3306
                                                               │
                                        wp_posts · wp_postmeta · wp_comments
                                        CPT solicitud_uneti · estado_solicitud
```

- **Frontend:** Next.js 16 con App Router, React 19, TypeScript y el sistema visual del template `demo-elearning`.
- **Backend CMS:** WordPress headless con WPGraphQL; no renderiza el sitio público.
- **Persistencia:** MariaDB para posts, medios, taxonomías, comentarios nativos (`wp_comments`) y solicitudes (`solicitud_uneti`).
- **Formularios:** el frontend valida y envía a un endpoint REST propio de WordPress, que guarda la solicitud como CPT privado con metadatos, folio y estado.
- **Contenido reproducible:** `seed/` contiene fixtures JSON, imágenes originales y un manifiesto con checksums.
- **Infraestructura:** Docker Compose con imágenes fijadas por etiqueta y endurecimiento aplicado en Apache, PHP, WordPress y MariaDB.

## Estado del proyecto

| Área | Estado |
|---|---|
| Sitio público | 11 rutas operativas: inicio, nosotros, carreras, detalle de PNF, postgrados, cursos, admisiones, contacto, noticias, detalle de noticia y privacidad |
| Contenido dinámico | Noticias desde WPGraphQL con ISR (5 min), SEO, relacionadas y actualización en vivo por SSE |
| Comentarios | Persistidos en `wp_comments`, con moderación y rate limiting |
| Solicitudes | Admisión PNF, postgrados y contacto con folio `UNETI-AAAA-NNNNNN`, honeypot y tokens de servicio |
| Oferta académica | 2 PNF, 7 PNFA de postgrado y cursos cortos, con detalle curricular |
| Calidad | TypeScript estricto, ESLint, build reproducible y QA automatizado |
| Seguridad | CSP, HSTS, COOP/CORP, límites de cuerpo, rate limiting, anti-enumeración y retención de datos a 365 días |
| CI | 10 workflows de validación, QA y pentesting |
| Despliegue | Guía universal y presentación operativa en `DespliegueProducción/` |

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | Next.js / React | `16.4.3` / `19.3.1` |
| Runtime frontend | Node.js + npm | `26.13.0` LTS |
| Lenguaje | TypeScript | `5.9.3` |
| Estilos | Template `demo-elearning` + `uneti.css` | — |
| CMS | WordPress | `7.1.4` (PHP 8.5) |
| API de contenido | WPGraphQL | `2.26.0` |
| API propia | REST de WordPress (mu-plugins) | — |
| Base de datos | MariaDB | `11.8.9` |
| Orquestación | Docker Compose | 3 servicios |
| Automatización | Python (solo stdlib) | `scripts/seed/seed.py` |

## Rutas y endpoints

| Ruta | Contenido |
|---|---|
| `/` | Portada institucional |
| `/nosotros` | Historia, modelo híbrido, sedes y esencia |
| `/carreras` | Oferta PNF y resumen de postgrados |
| `/carreras/[slug]` | Detalle de cada PNF |
| `/posgrados` | Postgrados (PNFA) con malla y requisitos |
| `/cursos` | Cursos cortos con CTA a WhatsApp |
| `/admisiones` | Proceso y formulario de admisión |
| `/contacto` | Sedes, mapas y formulario de contacto |
| `/noticias` | Listado con ISR |
| `/noticias/[slug]` | Detalle, relacionadas y comentarios |
| `/privacidad` | Aviso de privacidad |

Endpoints propios del frontend:

| Endpoint | Función |
|---|---|
| `POST /api/admisiones` | Solicitud de admisión PNF |
| `POST /api/posgrados` | Solicitud de postgrado |
| `POST /api/contacto` | Mensaje de contacto |
| `GET /api/noticias` | Listado de noticias |
| `GET /api/noticias/stream` | Cambios en vivo (SSE) |
| `GET/POST /api/noticias/[slug]/comentarios` | Comentarios |
| `POST /api/revalidar` | Revalidación ISR con token |

Endpoints de WordPress: `POST /wp-json/uneti/v1/solicitudes`, `GET|POST /wp-json/uneti/v1/comentarios/{slug}` y `/graphql`.

## Estructura del repositorio

```text
SD-UNETI/
├── frontend/                 Aplicación Next.js (App Router)
├── scripts/
│   ├── seed/seed.py          export · import · bootstrap · verify · validate
│   ├── wordpress/            bootstrap, importador, mu-plugins y endurecimiento
│   ├── ci/                   QA funcional y pentests
│   └── docs/                 generador del informe HTML
├── seed/                     Fixtures JSON, imágenes y manifiesto con checksums
├── wp_content/               WPGraphQL versionado y recursos del CMS
├── demo-elearning/           Template original de referencia
├── DocumentacionTecnica/     Informe técnico (.md y vista HTML/CSS/JS)
├── DespliegueProducción/     Guía de producción y presentación operativa
├── Documents/                Estado del proyecto y documentos históricos
├── .github/                  10 workflows + acción compuesta
├── docker-compose.yml        Entorno de desarrollo
├── docker-compose.prod.yml   Override de build para CI
├── LICENSE                   GNU General Public License v3.0
├── NOTICE                    Declaración institucional de soberanía tecnológica
└── README.md
```

## Inicio rápido

Requisitos: Git, Docker y Docker Compose.

```bash
git clone https://github.com/IVasquezRui/SD-UNETI.git
cd SD-UNETI
cp .env.example .env        # ajusta credenciales y URL
docker compose up -d
python3 scripts/seed/seed.py bootstrap
```

| Servicio | URL |
|---|---|
| Portal Next.js | `http://localhost:3000` |
| WordPress | `http://localhost:8080` |
| Administración | `http://localhost:8080/wp-admin` |
| WPGraphQL | `http://localhost:8080/graphql` |
| REST de comentarios | `http://localhost:8080/wp-json/uneti/v1/comentarios/{slug}` |

## Contenido y seed portable

El contenido vive en `seed/` y se reconstruye con las APIs nativas de WordPress. No se usa ningún dump SQL.

```bash
python3 scripts/seed/seed.py validate    # valida fixtures y checksums sin Docker
python3 scripts/seed/seed.py bootstrap   # instala WordPress, activa WPGraphQL, importa y verifica
python3 scripts/seed/seed.py import      # importación idempotente
python3 scripts/seed/seed.py verify      # GraphQL, comentarios e imágenes
python3 scripts/seed/seed.py export      # exporta el WordPress actual a seed/
python3 scripts/seed/seed.py import --refresh-media
```

La importación usa marcas `_uneti_seed_*` y adopta objetos existentes por slug, archivo o autor + contenido. El seed no incluye usuarios reales, hashes, sesiones, IPs ni correos personales.

## Calidad, CI y seguridad

Workflows de GitHub Actions:

| Workflow | Propósito |
|---|---|
| `seed.yml` | Fixtures, bootstrap, idempotencia y `verify` |
| `01-despliegue.yml` | Levanta los contenedores, siembra y ejecuta QA |
| `02-wordpress.yml` | Lint PHP, CPT, REST, WPGraphQL y endurecimiento |
| `03-frontend.yml` | `npm ci`, TypeScript y ESLint con Node 26 |
| `04-formulario.yml` | Envío real del formulario y verificación en base de datos |
| `05-qa.yml` | QA manual contra una URL pública |
| `06-pentest-nextjs.yml` | Cabeceras, archivos expuestos, API y Nuclei |
| `07-pentest-wordpress.yml` | Enumeración, XML-RPC, WPScan y Nuclei |
| `08-pentest-mariadb.yml` | Puerto, privilegios, acceso remoto y `local_infile` |
| `09-seguridad.yml` | `npm audit`, gitleaks y validación de compose |

Controles destacados: CSP y HSTS, COOP/CORP, límite de cuerpo por ruta, rate limiting, honeypot, tokens comparados en tiempo constante, XML-RPC y enumeración de usuarios bloqueados, y retención automática de solicitudes a los 365 días. El detalle está en `Documents/seguridad/2026-11-08-hardening.md`.

## Documentación

- [`DocumentacionTecnica/informe-tecnico-2026-11-10.md`](DocumentacionTecnica/informe-tecnico-2026-11-10.md): informe técnico integral.
- [`DocumentacionTecnica/informe-tecnico-2026-11-10.html`](DocumentacionTecnica/informe-tecnico-2026-11-10.html): vista navegable con índice, búsqueda, tema y checklist.
- [`DespliegueProducción/Pasos-A-Produccion-UNETI-PROXMOX.md`](DespliegueProducción/Pasos-A-Produccion-UNETI-PROXMOX.md): guía universal de despliegue en Proxmox.
- [`DespliegueProducción/index.html`](DespliegueProducción/index.html): presentación operativa del despliegue.
- [`Documents/PROGRESS.md`](Documents/PROGRESS.md): estado del proyecto y validaciones.
- [`Documents/Soberanía Digital 2026.md`](Documents/Soberanía%20Digital%202026.md): metodología y arquitectura.
- [`Documents/ci-cd-2026.md`](Documents/ci-cd-2026.md): workflows, presupuesto y pentests.
- [`seed/README.md`](seed/README.md): contrato de los fixtures.

## Despliegue a producción

El procedimiento completo está en [`DespliegueProducción/`](DespliegueProducción/): guía en Markdown y presentación HTML5 para el ingeniero de montaje. Cubre Docker Compose, instalación nativa, despliegue híbrido, Proxmox, usuarios y claves, TLS, seed, backups, monitoreo, go-live y rollback.

## Contribución

1. Crea una rama desde `develop`.
2. Mantén los cambios de contenido en `seed/` y los de presentación en `frontend/`.
3. Ejecuta `python3 scripts/seed/seed.py validate`, `npx tsc --noEmit`, `npm run lint` y `npm run build` con WordPress arriba.
4. Valida los scripts con `bash -n scripts/ci/*.sh` y `node --check scripts/ci/*.mjs`.
5. No incluyas secretos, volúmenes (`db_data/`, `wp_data/`), reportes de pentest ni artefactos de build.
6. Actualiza la documentación y los créditos de imágenes cuando incorpores activos.

## 📄 Licencia y Soberanía Tecnológica

Este proyecto se distribuye bajo la **GNU General Public License v3.0 (GPL v3)**, una licencia de software libre con *copyleft* que garantiza que las adaptaciones para el sector educativo universitario permanezcan abiertas y auditables.

- [`LICENSE`](LICENSE): texto íntegro de la GNU General Public License v3.0.
- [`NOTICE`](NOTICE): declaración institucional de alcance, visión y misión de la GPL v3 en SD-UNETI.

La elección responde a los principios de **Soberanía Digital** de la UNETI y a los lineamientos de la Ley de Infogobierno de la República Bolivariana de Venezuela: acceso libre al conocimiento tecnológico y obligación de compartir los desarrollos derivados bajo los mismos términos de libertad.

## Créditos

**Hecho por → Iván Vásquez**


