# PROGRESS — Soberanía Digital 2026 (UNETI)

> Documento de estado del MVP de la plataforma headless de la Universidad Nacional Experimental de las Telecomunicaciones e Informática.
>
> **Última actualización:** 20 de octubre de 2026
>
> **Rama de integración:** `main`
>
> **Estado:** MVP funcional en entorno local, con frontend Next.js, CMS WordPress, MariaDB y contenido dinámico operativo.

---

## 1. Resumen ejecutivo

El proyecto migró la plantilla estática `demo-elearning` a una aplicación **Next.js 16 con App Router y React 19**, manteniendo la identidad visual de la UNETI y consumiendo el contenido desde **WordPress headless** mediante **WPGraphQL** y una API REST propia para comentarios.

La solución cubre:

- Sitio institucional en español con rutas y componentes renombrados.
- Noticias administradas desde WordPress y actualizadas en el navegador mediante SSE.
- Comentarios persistidos en la tabla nativa `wp_comments` de MariaDB.
- Vista de carreras con detalle completo de los PNF en Informática y Telecomunicaciones.
- Entorno Docker con MariaDB, WordPress, WPGraphQL y Next.js.
- Seed portable e idempotente para noticias, imágenes, taxonomías y comentarios.

### URLs del entorno local

| Servicio | URL |
|---|---|
| Frontend Next.js | `http://localhost:3000` |
| WordPress | `http://localhost:8080` |
| Administración WordPress | `http://localhost:8080/wp-admin` |
| WPGraphQL | `http://localhost:8080/graphql` |
| API REST de comentarios | `http://localhost:8080/wp-json/uneti/v1/comentarios/{slug}` |

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión verificada |
|---|---|---|
| Frontend | Next.js / React | `16.4.2` / `19.3.0` |
| Runtime frontend | Bun | `1.4.3` |
| Lenguaje | TypeScript | `^5` |
| Estilos | Template `demo-elearning` + CSS propio | `uneti.css` |
| CMS | WordPress | `7.1.3` |
| API de contenido | WPGraphQL | `2.24.2` |
| Base de datos | MariaDB | `11.4.13` |
| Infraestructura | Docker Compose | 3 servicios |

### Flujo de datos

```text
Navegador
   │
   ├── HTML/SSE ──────────────► Next.js :3000
   │                               │
   │                               ├── WPGraphQL ─────► WordPress :8080
   │                               │                      │
   │                               └── REST comentarios ──┤
   │                                                      ▼
   └──────────────────────────────────────────────► MariaDB :3306
```

Next.js es la única capa de presentación. WordPress actúa exclusivamente como CMS, fuente de noticias y almacén de comentarios; no renderiza el sitio público.

---

## 3. Hitos alcanzados

### 3.1 Migración e integración de la plantilla

- Plantilla `demo-elearning` integrada desde `frontend/public/assets`.
- Hojas de estilo cargadas en el mismo orden de cascada que el HTML original: `vendors.min.css`, `icon.min.css`, `style.css`, `responsive.css`, `elearning.css` y `uneti.css`.
- Scripts del template inicializados mediante `ScriptsPlantilla`.
- Navegación interna con etiquetas `<a>` y recarga completa de documento.
  - Decisión necesaria porque `main.js` muta el DOM, envuelve secciones en `.page-layout` y clona `#navbarNav`.
  - Evita errores de hidratación entre el HTML inicial de React 19 y el DOM modificado por jQuery.
- IDs únicos de partículas por página para evitar colisiones del bootstrap del template.
- Corrección del hero: se eliminó la imagen superpuesta duplicada `estudiantes.png`; la portada usa `banner_bg.png` con degradado y una sola capa visual.
- CSS institucional propio `uneti.css` con paleta UNETI, tarjetas, noticias, comentarios, carreras, trayectos, laboratorios, FAQ y responsive.

### 3.2 Rutas y nomenclatura en español

| Ruta actual | Función |
|---|---|
| `/` | Inicio institucional |
| `/nosotros` | Información institucional, misión, visión, valores e hitos |
| `/admisiones` | Proceso de admisión, requisitos, becas y formularios |
| `/contacto` | Canales de atención, ubicación y formulario |
| `/noticias` | Listado dinámico de noticias |
| `/noticias/[slug]` | Detalle de noticia y comentarios |
| `/carreras` | Oferta académica PNF |
| `/carreras/[slug]` | Detalle de PNF |

Redirecciones permanentes implementadas en `frontend/next.config.ts`:

- `/about` → `/nosotros`
- `/admissions` → `/admisiones`
- `/contact` → `/contacto`
- `/api/contact` → `/api/contacto`
- `/news` y `/news/:slug*` → `/noticias` y `/noticias/:slug*`
- `/courses` y `/courses/:slug*` → `/carreras` y `/carreras/:slug*`

También se renombraron componentes, hooks, librerías, tipos y constantes al español para mantener coherencia con el dominio del proyecto.

### 3.3 Noticias dinámicas desde WordPress

- Cliente GraphQL mínimo basado en `fetch` nativo en `frontend/app/lib/wordpress.ts`.
- Consultas para listado, detalle y resumen SSE.
- Mapeo de datos de WordPress al modelo `Noticia`: título, resumen, HTML, categoría, etiquetas, fecha, tiempo de lectura, imagen, autor y estado de comentarios.
- Estrategia de caché:
  - Listado con revalidación de 15 segundos.
  - Detalle con revalidación de 30 segundos.
  - API y SSE sin caché (`no-store`).
- Generación estática de las noticias conocidas mediante `generateStaticParams`.
- Metadatos SEO y Open Graph por noticia.
- Noticias relacionadas y etiquetas en el detalle.

### 3.4 Actualización en vivo

- Endpoint SSE: `frontend/app/api/noticias/stream/route.ts`.
- Hook cliente: `frontend/app/hooks/useNoticiasEnVivo.ts`.
- Detección de cambios mediante hash del contenido relevante de las noticias.
- Consulta al CMS cada 15 segundos por conexión SSE.
- Polling de respaldo cada 30 segundos si `EventSource` falla o no está disponible.
- Indicador visual “Actualización en vivo” / “Conectando…”.
- Prueba realizada: una noticia publicada directamente en WordPress apareció en el stream en menos de 20 segundos.

### 3.5 Comentarios persistentes en MariaDB

- Componente: `frontend/app/componentes/SeccionComentarios.tsx`.
- Hook: `frontend/app/hooks/useComentarios.ts`.
- Proxy Next.js: `frontend/app/api/noticias/[slug]/comentarios/route.ts`.
- Mu-plugin WordPress: `scripts/wordpress/mu-plugins/uneti-comentarios.php`.
- Endpoints propios:
  - `GET /wp-json/uneti/v1/comentarios/{slug}`
  - `POST /wp-json/uneti/v1/comentarios/{slug}`
- Persistencia en la tabla nativa `wp_comments`, sin tablas paralelas.
- Validaciones en frontend, proxy y backend:
  - Nombre mínimo de 2 caracteres.
  - Comentario entre 3 y 2000 caracteres.
  - Correo opcional con validación de formato.
  - Noticia inexistente o no publicada: HTTP 404.
  - Comentarios cerrados: HTTP 403.
- Sanitización con `sanitize_text_field`, `sanitize_email` y `sanitize_textarea_field`.
- Renderizado como texto plano con `white-space: pre-line`; no se interpreta HTML del comentario.
- Refresco automático del listado cada 20 segundos y actualización inmediata después de publicar.
- Los comentarios se insertan aprobados para el flujo demo del MVP.

### 3.6 Carreras y detalle por PNF

- `frontend/app/lib/carreras.ts` contiene la información completa de:
  - PNF en Informática.
  - PNF en Telecomunicaciones.
- Cada carrera incluye:
  - Fundamentación, misión y visión.
  - Perfil de ingreso y egreso.
  - Competencias.
  - Campo laboral.
  - Cinco trayectos formativos.
  - Laboratorios.
  - Salidas progresivas: Técnico Medio, TSU e Ingeniero.
  - Preguntas frecuentes.
- Listado `/carreras` con ventajas del modelo UNETI y CTA de admisión.
- Detalle `/carreras/[slug]` con hero, resumen lateral, carrusel, malla curricular, laboratorios, FAQ y carrera relacionada.
- Imágenes locales de apoyo en `frontend/public/assets/images/carreras/` con créditos en `CREDITS.md`.

### 3.7 DevOps y datos demo

- `docker-compose.yml` con MariaDB, WordPress y Next.js.
- MariaDB con healthcheck y volumen persistente `db_data`.
- Base creada desde cero; no se versiona un dump SQL con usuarios ni sesiones.
- WordPress espera a que MariaDB esté saludable.
- Red interna `frontend_net`; Next.js usa `http://wordpress/graphql` para GraphQL y `http://wordpress` para REST.
- Mu-plugin montado desde `scripts/wordpress/mu-plugins`.
- WPGraphQL versionado en `wp_content/plugins/wp-graphql` y montado en el contenedor.
- Scripts operativos disponibles en `/opt/uneti-scripts` dentro del contenedor WordPress.
- Seed portable en `seed/` y orquestador `scripts/seed/seed.py` (export, import, bootstrap, validate, verify).
- `wp_data/`, `db_data/`, `node_modules/`, `.next/` y `lookdown/` excluidos del repositorio.
- Credenciales, puertos, URLs y nombres de contenedor configurables mediante `.env`.

---

## 4. Estructura relevante del repositorio

```text
wordpress-headless/
├── .env.example                    # Variables de entorno documentadas
├── docker-compose.yml
├── database/
│   └── README.md                   # Sin dump; bootstrap desde seed/
├── demo-elearning/                 # Plantilla original de referencia
├── frontend/
│   ├── app/
│   │   ├── admisiones/
│   │   ├── api/
│   │   │   ├── contacto/
│   │   │   └── noticias/
│   │   │       ├── [slug]/comentarios/
│   │   │       ├── stream/
│   │   │       └── route.ts
│   │   ├── carreras/[slug]/
│   │   ├── componentes/
│   │   ├── contacto/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── noticias/[slug]/
│   │   ├── nosotros/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── public/assets/
│       ├── css/uneti.css
│       ├── images/carreras/
│       ├── images/uneti/
│       └── js/
├── scripts/
│   ├── seed/seed.py                # Orquestador Python (stdlib)
│   └── wordpress/
│       ├── bootstrap.php           # Instalación limpia + WPGraphQL
│       ├── mu-plugins/uneti-comentarios.php
│       └── seed/                   # lib, export, importar, verify
├── seed/                           # Fixtures portables (JSON + imágenes)
│   ├── manifest.json
│   ├── site.json
│   ├── taxonomies.json
│   ├── media.json
│   ├── posts/
│   └── media/AAAA/MM/
├── wp_content/                     # Copia versionada de soporte de wp-content
└── Documents/PROGRESS.md
```

> `wp_content/` es una copia de referencia versionada. El WordPress en ejecución utiliza `wp_data/`, que no se publica por contener datos y archivos volátiles.

---

## 5. Contrato de datos y endpoints

| Tipo | Recurso | Consumidor |
|---|---|---|
| GraphQL | `posts`, `post`, `featuredImage`, `categories`, `tags`, `author` | Next.js Server Components |
| SSE | `/api/noticias/stream` | Hook `useNoticiasEnVivo` |
| JSON | `/api/noticias` | Polling de respaldo |
| JSON | `/api/noticias/[slug]/comentarios` | Listado y publicación de comentarios |
| REST WordPress | `/wp-json/uneti/v1/comentarios/{slug}` | Proxy Next.js |
| SQL | `wp_comments` | Persistencia nativa de comentarios |
| JSON | `/api/contacto` | Formularios institucionales |

### Modelos principales

- `Noticia`: contenido normalizado listo para render.
- `ResumenNoticia`: payload ligero para SSE.
- `Comentario`: nombre, contenido, fecha ISO y avatar.
- `Carrera`: información académica completa del PNF.
- `InfoContacto`, `CanalSoporte`, `ElementoPregunta`, `Testimonio`, `Hito`.

---

## 6. Estado actual del CMS y datos demo

- WordPress: `7.1.3`.
- WPGraphQL: `2.24.2`, activo.
- MariaDB: `11.4.13`, contenedor saludable.
- Noticias publicadas: **6**.
- Comentarios demo visibles: **3**, todos en la noticia de convocatoria 2026.
- Posts de ejemplo `hola-mundo` y `noticia-de-prueba-institucional`: en borrador.
- Imágenes destacadas de las noticias: alojadas en `wp_data/wp-content/uploads/2026/10/`.
- El seed es idempotente: busca por `_uneti_seed_key`, adopta por slug/archivo/autor+contenido y evita duplicados.

> `seed/` es la fuente de verdad del contenido. `wp_data/` y `db_data/` son estados locales desechables. Para reconstruir el sitio: `python3 scripts/seed/seed.py bootstrap`.

---

## 7. Validación técnica ejecutada

| Verificación | Resultado |
|---|---|
| `bunx tsc --noEmit` | Sin errores |
| `bun run lint` | 0 errores; 6 advertencias por hojas de estilo manuales del template |
| `bun run build` | Exitoso: 22 rutas prerenderizadas. El fallo de `/_global-error` era causado por `NODE_ENV=development` fijado en el servicio `frontend`; eliminado del compose |
| `docker compose config` | Configuración válida |
| `python3 scripts/seed/seed.py validate` | 6 posts, 6 media, 3 comentarios, checksums correctos |
| `python3 scripts/seed/seed.py import` | Idempotente: segunda ejecución sin duplicados |
| `python3 scripts/seed/seed.py verify` | 6 posts publicados, 3 comentarios, 6 imágenes HTTP 200 `image/jpeg`, GraphQL activo |
| `seed.py bootstrap` en entorno limpio (`8081`) | WordPress instalado, WPGraphQL activo, 6 posts, 0 páginas, 3 comentarios |
| `GET /` | 200 |
| `GET /noticias` | 200 |
| `GET /noticias/uneti-abre-convocatoria-admision-2026` | 200 |
| `GET /carreras` | 200 |
| `GET /carreras/pnf-informatica` | 200 |
| `GET /carreras/pnf-telecomunicaciones` | 200 |
| `GET /nosotros`, `/admisiones`, `/contacto` | 200 |
| Redirecciones `/news`, `/about`, `/courses` | 301 |
| `GET /api/noticias` | 200, 6 noticias |
| `GET /api/noticias/{slug}/comentarios` | 200, 3 comentarios |
| Publicación de noticia en WordPress | Visible por SSE en menos de 20 segundos |
| Persistencia de comentario | Verificada en `wp_comments` de MariaDB |
| Contenedor MariaDB | `healthy` |

El comentario y la noticia temporales usados para validar el flujo fueron eliminados después de las pruebas.

---

## 8. Decisiones de arquitectura

1. **Server Components por defecto** para reducir JavaScript cliente y consumir WordPress en servidor.
2. **`fetch` nativo** en lugar de clientes GraphQL pesados.
3. **Next.js como única capa de render**; WordPress no expone tema público.
4. **Recarga completa de documento** para mantener compatibilidad con el runtime del template.
5. **SSE con polling de respaldo** para contenido “en vivo” sin introducir WebSockets ni infraestructura adicional.
6. **Comentarios en `wp_comments`** para conservar moderación, avatares y compatibilidad nativa con WordPress.
7. **Carreras estáticas** desde TypeScript para evitar sobredimensionar el CMS en esta fase.
8. **PPR/cacheComponents** habilitados para combinar shells estáticos con datos dinámicos.

---

## 9. Deuda técnica y riesgos conocidos

- Las credenciales de desarrollo viven en `.env` (ignorado); para producción deben migrarse a Docker secrets o un gestor externo.
- Las imágenes están fijadas por tag (`mariadb:11.4.13`, `wordpress:7.1.3`, `oven/bun:1.4.3-alpine`); falta fijarlas por digest.
- Los comentarios se autoaprueban y no tienen CAPTCHA, rate limiting ni moderación previa.
- El formulario de contacto solo registra el lead en logs; falta persistencia, correo o integración CRM.
- Las imágenes de `seed/media/` no tienen fuente/licencia documentada; ver `seed/CREDITS.md`.
- Existe workflow CI de clon limpio (`.github/workflows/seed.yml`); faltan pruebas E2E automatizadas.
- La navegación con recarga completa es una limitación deliberada del template, no una SPA.
- La caché SSE se mantiene en memoria por conexión; para escalar horizontalmente se requeriría pub/sub.
- Falta validación visual final en navegadores reales y pruebas de accesibilidad.
- El entorno local no incluye TLS, reverse proxy ni estrategia de backups.

---

## 10. Próximos pasos recomendados

1. Fijar imágenes Docker por digest y mover secretos a Docker secrets.
2. Añadir moderación, rate limiting y protección anti-spam a comentarios.
3. Persistir los leads de contacto y notificar por correo o CRM.
4. Completar `seed/CREDITS.md` o reemplazar las imágenes sin licencia.
5. Incorporar Playwright para navegación, comentarios y SSE.
6. Revisar accesibilidad, SEO técnico y rendimiento de imágenes.
7. Preparar despliegue productivo con reverse proxy, TLS, backups y monitoreo.

---

## 11. Operación

```bash
# Preparar variables y levantar el entorno
cp .env.example .env
docker compose up -d

# Ver estado
docker compose ps

# Instalar/restaurar el sitio desde seed/ y verificar
python3 scripts/seed/seed.py bootstrap

# Alternativas
python3 scripts/seed/seed.py validate
python3 scripts/seed/seed.py import
python3 scripts/seed/seed.py verify
python3 scripts/seed/seed.py export

# Verificar tipos y lint
docker exec next_frontend bunx tsc --noEmit
docker exec next_frontend bun run lint

# Regenerar el grafo de memoria
docker run --rm -v "$PWD:/app" -w /app --entrypoint bun oven/bun:1.4.3-alpine build_graph.js
```

---

## 12. Criterios de aceptación del MVP

- [x] Frontend Next.js conectado a WordPress headless.
- [x] Rutas y nomenclatura en español.
- [x] Redirecciones de compatibilidad.
- [x] Noticias dinámicas desde WPGraphQL.
- [x] Actualización en vivo por SSE con fallback.
- [x] Comentarios persistidos en MariaDB.
- [x] Detalle de noticias con SEO y relacionadas.
- [x] Carreras PNF con información completa.
- [x] Entorno Docker operativo y documentado.
- [x] Seed portable e idempotente; validaciones de posts, comentarios e imágenes.
- [x] `bun run build` de producción sin errores.
- [ ] Pruebas E2E automatizadas.
- [ ] Endurecimiento de seguridad y despliegue productivo.
