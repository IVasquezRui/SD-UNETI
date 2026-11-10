# PROGRESS — Soberanía Digital 2026 (UNETI)

> Documento de estado del MVP de la plataforma headless de la Universidad Nacional Experimental de las Telecomunicaciones e Informática.
>
> **Última actualización:** 8 de noviembre de 2026
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
| Frontend | Next.js / React | `16.4.3` / `19.3.1` |
| Runtime frontend | Node.js + npm | `26.13.0` LTS |
| Lenguaje | TypeScript | `5.9.3` |
| Estilos | Template `demo-elearning` + CSS propio | `uneti.css` |
| CMS | WordPress | `7.1.4` |
| API de contenido | WPGraphQL | `2.26.0` |
| Base de datos | MariaDB | `11.8.9` |
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
- Se retiró `ScriptsPlantilla` y todo el runtime jQuery/Crafto (`jquery.js`, `vendors.min.js`, `main.js`); el DOM ya no se muta después de la hidratación.
- Cabecera, carrusel de testimonios/galería, acordeón FAQ, contadores, partículas y modal de YouTube se reimplementaron como componentes React accesibles.
- Navegación interna con etiquetas `<a>` y recarga completa de documento; ya no es una dependencia del template, sino una decisión de simplicidad del MVP.
- La cabecera usa un único logotipo, navegación activa, menú móvil controlado por estado y CTA al Campus Virtual.
- Se corrigió el selector de iconos del template (`[class*=ti-]` coincidía con clases `uneti-*`) para evitar `display:inline-block` accidentales.
- El hero usa `hero-uneti.webp` como capa separada con `object-fit: cover`, degradado y `object-position` que preserva a las personas.
- CSS institucional propio `uneti.css` con paleta UNETI, hero, cabecera, banda de aliados, testimonios con retratos, pre-footer de Instagram, tarjetas, noticias, comentarios, carreras, trayectos, laboratorios, FAQ y responsive.

### 3.2 Rutas y nomenclatura en español

| Ruta actual | Función |
|---|---|
| `/` | Inicio institucional |
| `/nosotros` | Información institucional, misión, visión, valores e hitos |
| `/admisiones` | Proceso de admisión, requisitos y formulario animado |
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

### 3.8 Renovación UI/UX 2026 (en curso)

La Fase 5 del proyecto (`Documents/fase-5-ui-ux-2026.md`) renueva la capa pública del portal:

- Se retiró el runtime jQuery de la plantilla y sus interacciones se reimplementaron como componentes React (`EncabezadoSitio`, `CarruselSimple`, `ContadorAnimado`, `SeccionPreguntas`, `BotonVideo`, `Reveal`, `ParticulasDecorativas`).
- Se corrigió el selector `[class*=ti-]` de `style.css`, que afectaba a todas las clases `uneti-*` e invalidaba rejillas completas.
- Portada y collage institucional renovados con fotografía de la comunidad UNETI; derivados WebP en `uneti/` y originales fuera de Git (`uneti_new/`).
- `TituloPagina` admite `imagePosition`; `/noticias` y `/contacto` usan encuadres propios. Los pasos de admisión se renumeraron a `1–4`.
- Nueva ruta `/cursos` con cuatro rutas de formación corta, datos en `lib/cursos.ts` y tarjeta `TarjetaCurso.tsx`.
- Pendiente: nueva fotografía del hero, organigrama institucional animado en `/nosotros` y verificación Playwright en escritorio y móvil.

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

- WordPress: `7.1.4`.
- WPGraphQL: `2.26.0`, activo.
- MariaDB: `11.8.9`, contenedor saludable.
- Noticias publicadas: **6**.
- Comentarios demo visibles: **3**, todos en la noticia de convocatoria 2026.
- Posts de ejemplo `hola-mundo` y `noticia-de-prueba-institucional`: en borrador.
- Imágenes destacadas de las noticias: alojadas en `wp_data/wp-content/uploads/2026/10/`.
- El seed es idempotente: busca por `_uneti_seed_key`, adopta por slug/archivo/autor+contenido y evita duplicados.

> `seed/` es la fuente de verdad del contenido. `wp_data/` y `db_data/` son estados locales desechables. Para reconstruir el sitio: `python3 scripts/seed/seed.py bootstrap`.

---

## 7. Validación técnica ejecutada

> La tabla siguiente conserva el registro histórico de la validación inicial (ejecutada con Bun 1.4.x). La validación vigente con Node.js 26.13.0 LTS está en §7.1.

| Verificación | Resultado |
|---|---|
| `npx tsc --noEmit` | Sin errores |
| `npm run lint` | 0 errores; 6 advertencias por hojas de estilo manuales del template |
| `npm run build` | Exitoso: 22 rutas prerenderizadas. El fallo de `/_global-error` era causado por `NODE_ENV=development` fijado en el servicio `frontend`; eliminado del compose |
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

### 7.1 Validación de la migración a Node.js 26.13.0 LTS (2026-10-31)

| Verificación | Resultado |
|---|---|
| `npm ci` | 358 paquetes instalados |
| `npm run lint` | Sin errores |
| `npx tsc --noEmit` | Sin errores |
| `npm run build` | 23 páginas generadas; 6 noticias prerenderizadas |
| `docker compose config -q` | Válido |
| `seed.py bootstrap` / `verify` | 6 posts, 3 comentarios, 6 medios, GraphQL activo |
| Rutas públicas | 200; ruta inexistente con 404 institucional |
| Playwright (11 rutas × 2 viewports) | 0 errores de hidratación, 0 overflow, 0 IDs duplicados, 0 imágenes sin alt |
| Parallax del hero | Activo en escritorio; desactivado en móvil y con movimiento reducido |

El detalle completo está en `Documents/qa-20261031.md`.

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
- Las imágenes están fijadas por tag (`mariadb:11.8.9`, `wordpress:7.1.4`, `node:26.13.0-slim`); falta fijarlas por digest.
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
8. Cerrar la Fase 5 (`Documents/fase-5-ui-ux-2026.md`): nueva fotografía del hero, organigrama institucional en `/nosotros` y verificación Playwright en escritorio y móvil.
9. Ejecutar la Fase 6 con reverse proxy, TLS, backups y monitoreo en un entorno productivo.

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
docker exec next_frontend npx tsc --noEmit
docker exec next_frontend npm run lint

# Regenerar el grafo de memoria
docker run --rm -v "$PWD:/app" -w /app --entrypoint node node:26.13.0-slim build_graph.js
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
- [x] `npm run build` de producción sin errores.
- [x] Prueba E2E del formulario de admisiones en CI, con verificación en MariaDB.
- [x] Workflows separados de despliegue, WordPress, frontend, QA y pentesting.
- [x] Endurecimiento básico de Next.js, WordPress y MariaDB; despliegue productivo con TLS y backups pendiente.
- [x] Sin enlaces a SISU/SIS-UNETI ni contenido de becas en las páginas públicas.

---

## 13. Actualización 2026-10-31

### Interfaz y contenido

- Se intercambiaron los heroes de `/` y `/contacto`.
- El CTA de la cabecera pasó a **“Ir al Campus Virtual”**.
- `/nosotros` incorpora:
  - Flashcards de color con volteo accesible para los cuatro valores.
  - Storytelling con pasos sticky, progreso y parallax.
  - Ruta Aspirante / Estudiante / Empresa.
  - Modalidad híbrida, requisitos técnicos y CTA al Campus Virtual.
  - Sedes Altagracia y Núcleo CANTV San Martín.
- Se retiraron los enlaces y menciones a SISU/SIS-UNETI del frontend y las variables `SISU_URL`/`SIS_URL`.
- Se retiró toda la información y los formularios de becas.
- Se alineó la oferta de carreras con el mini proyecto: TSU en 2 años e Ingeniería en 4 años, sin “Técnico Medio”.

### Formularios

- Nuevo `FormularioAdmision` de tres pasos con animaciones, validación, honeypot y folio.
- Nuevo `FormularioContacto` conectado a WordPress.
- CPT `solicitud_uneti` con taxonomía `estado_solicitud`, metadatos, panel de administración y exportación CSV.
- Endpoint `POST /wp-json/uneti/v1/solicitudes` protegido por token.

### Infraestructura y CI

- Endurecimiento de Next.js, WordPress (mu-plugin, Apache y PHP) y MariaDB.
- Sitemap de usuarios y acceso directo a `mu-plugins` bloqueados; WPScan sin usuarios enumerados.
- Workflows `01`–`08` con QA y pentests, optimizados para el plan gratuito.
- Documentos [`solicitudes-wordpress-2026.md`](solicitudes-wordpress-2026.md) y [`ci-cd-2026.md`](ci-cd-2026.md).

## 14. Actualización 2026-11-05

> Detalle completo y checklist por punto: [`2026-11-05/doc-as-code_2026-11-05.md`](2026-11-05/doc-as-code_2026-11-05.md).
> Evidencias de pruebas: [`2026-11-05/qa-2026-11-05.md`](2026-11-05/qa-2026-11-05.md).

### ISR y caché

- ISR implementado con el modelo de Next 16 + Cache Components: `'use cache'`, `cacheLife('noticias')`,
  `cacheTag('noticias', 'noticia-<slug>')` y perfiles en `next.config.ts`.
- Nuevo webhook `POST /api/revalidar` (`revalidateTag` + `revalidatePath`) protegido por token.
- Lectura sin caché separada para SSE y polling (`obtenerNoticiasEnVivo`).

### Contenido y diseño

- Hero principal con carrusel de 4 imágenes cada 5 s, imagen más luminosa y puntos de navegación.
- Parallax del storytelling corregido: el alcance se mide sobre la sección, no sobre el bloque sticky.
- Nuevas fotografías del storytelling, de «Cómo se estudia» y carruseles por PNF en `/carreras`.
- Logo del footer a color y nítido sobre placa blanca (`logo@2x.png`).
- Corrección del destello/cruz de las flashcards (hover fuera del plano 3D y caras separadas 1 px).
- Justificación tipográfica de párrafos con excepciones para bloques centrados e interfaz.
- `/contacto` muestra las dos sedes con Google Maps y fichas independientes.
- Hamburguesa global de navegación rápida (`NavegacionRapida`) en todas las rutas.

### Posgrados (PNFA)

- Nueva vista `/posgrados` con los 7 programas, malla por ejes, requisitos y formulario.
- Resumen de posgrados en `/carreras` y enlaces «Solicitar Cupo» con preselección.
- Nuevo `tipo: posgrado` en el mu-plugin de WordPress, whitelist de programas y etiqueta dedicada.

### Formularios

- `FormularioContacto` rediseñado en tres pasos, con motivos de contacto y confirmación TFSA.
- Nuevo `FormularioPosgrado` (`/api/posgrados`) con tarjetas por color y confirmación TFSA.
- TFSA (checklist verde/rojo a pantalla completa) aplicado a Admisiones PNF, Posgrados y Contacto.
- WordPress devuelve `ticket` (folio) e `id` en la respuesta de todas las solicitudes.

### Otros

- Cursos: «Obtener información» abre WhatsApp (`wa.me/584241427051`) con el nombre del curso.
- `qa-frontend.sh` y `probar-formulario.mjs` ampliados con posgrados, contacto y WhatsApp.

---

## 15. Actualización 2026-11-08

Ejecución completa del plan `Documents/2026-11-08/doc-as-code_2026-11-08.md` (22 puntos) en seis PRs
temáticos. El informe detallado está en `Documents/2026-11-08/implementacion_2026-11-08.md` y la
evidencia de pruebas en `Documents/2026-11-08/qa-2026-11-08.md`.

### Portada

- Hero reducido a las dos últimas imágenes: `EquipoDeDesarrolloDeSoftware.jpg` y `DiLorenzoEnseña.jpg`.
- «Tu ruta» reemplaza al bloque «Ecosistema UNETI» (`SeccionSoporte`).
- Cuatro tarjetas de cursos reales con iconos, viñeta de color y enlace a `/cursos#curso-<slug>`.
  Se retira el curso inexistente **Modelado 3D** y la sección de áreas de innovación.
- Resumen de las cuatro redes sociales en lugar del bloque de YouTube.
- Cuatro flashcards de la modalidad híbrida territorial a mitad de página.

### Carreras y posgrados

- Ficha sin el ítem «Título»; «Salidas profesionales» pasa a **Títulos obtenidos**, centrados y con
  degradado azul-morado.
- Etapas TSU/Ingeniería centradas y «Otra ruta» incorpora los siete PNFA.
- `/carreras` y `/posgrados` dejan de mostrar el prefooter de comunidad.
- Corregida la narrativa de territorio: solo dos sedes propias y cobertura mediante CANTV/Movilnet,
  Infocentros y convenios con el MPPEU y universidades politécnicas.

### Nosotros

- Storytelling sin `sticky`: el bloque baja con el scroll y cambia de imagen por punto, con barra de progreso.
- Flashcards con transición 2D: desaparecen los artefactos de píxeles.
- `RedesSocialesDetalle` sustituye la banda «Comunidad UNETI».
- «Conoce nuestra casa de estudios» se coloca tras el parallax y se añade el detalle del modelo
  híbrido territorial.

### Responsive y móvil

- `origenValido` acepta el host real de la petición: los formularios funcionan desde la IP de la LAN
  (antes devolvían 403 por `Origin`).
- Ajuste compacto en móvil (hero, cabeceras, secciones, tarjetas, campos de 16 px y TFSA).
- CTA de `/cursos` convertido en «Solicitar información» por WhatsApp.
- Animación TFSA alineada y navegación rápida actualizada.

### Seguridad y privacidad (punto 21)

- `app/lib/security.ts`: comparación de tokens en tiempo constante y lectura de JSON con límite.
- Rate limit y límites de cuerpo en todas las rutas; revalidación con token seguro.
- Cabeceras COOP/CORP, CSP con `script-src-attr 'none'` y `proxy.ts` para TRACE/TRACK.
- `/privacidad`, `security.txt`, `robots.txt` y `sitemap.xml`.
- WordPress, Apache, PHP y Docker endurecidos; retención de solicitudes a 12 meses.
- CI de seguridad (npm audit, gitleaks, compose) y mapa de controles SOC 2 / ISO 27001 / ISO 27701 en
  `Documents/seguridad/2026-11-08-hardening.md`.

## 16. Actualización 2026-11-08 (imágenes de los PNF y parallax de Nosotros)

Ronda de ajustes sobre material visual y sobre el storytelling de `/nosotros`.

### PNF (Informática y Telecomunicaciones)

- Portadas y galerías salen ahora de `public/assets/images/uneti/NEW_IMAGES` (`lib/carreras.ts`),
  con **ocho fotos por PNF** en lugar de tres o cuatro. Se elimina
  `NEW_IMAGES/PNF-T/photo_5143169628853964104_y.jpg` y su lugar lo ocupa
  `5154555681644940483.jpg`.
- Los archivos `portada.jpg`, `carrusel-*.jpg` y `galeria-*.jpg` de
  `public/assets/images/carreras/` quedan como material histórico (ver `CREDITS.md`).
- El hero del detalle de cada PNF usa `imagePosition="center 45%"` para el nuevo encuadre 16:9.

### Equipo de desarrollo

- `EquipoDeDesarrolloDeSoftware.jpg` se sustituye por `NEW_IMAGES/EquipoDesarrollandoLaptops.jpg`
  (896 × 1195, mismo recorte) en el hero de la portada, en «Cómo se estudia» y en la comprobación
  de `scripts/ci/qa-frontend.sh`.

### Noticias de la portada (insight de Next.js 16)

- `SeccionArticulos` deja de ser un componente `async`: la lectura se mueve a
  `componentes/NoticiasRecientes.tsx`, envuelta en `<Suspense fallback={<EsqueletoArticulos />}>`.
  El shell estático de `/` publica la cabecera de la sección y un esqueleto con la retícula real
  (`.uneti-esqueleto-*`); las tarjetas se transmiten en cuanto WordPress responde. `/` pasa a
  prerenderizado parcial y desaparece el insight `instant-shell-url-data`.

### Parallax de `/nosotros`

- `HistoriaParallax` se rediseña: la tarjeta de imágenes **viaja** hasta el paso que se está
  leyendo (`--story-y`, medido en cada cambio de paso y en `resize`), las capas internas derivan
  con el scroll (`--story-drift`) y la imagen activa hace un zoom lento. Se retira la barra de
  progreso (`.uneti-story__barra`) y la fila pasa a `align-items-stretch` para tener recorrido.
- Se conservan el `IntersectionObserver` de pasos, el contador `01 / 04`, las imágenes por paso en
  móvil y `prefers-reduced-motion`.

## 17. Actualización 2026-11-08 (imágenes, iconos y enlaces de contacto)

### PNF en Telecomunicaciones

- La galería cambia `5154555681644940480.jpg` por `5154555681644940486.jpg`, de modo que no queda
  ninguna fotografía repetida entre los dos PNF.

### PNFA-OPSAT

- `lib/posgrados.ts` declaraba `bi bi-satellite`, un glifo **ausente** en
  `public/assets/css/icon.min.css`: la auditoría de los 92 iconos Bootstrap del portal confirmó que
  era el único sin definir, y por eso el logo no se dibujaba. Se sustituye por `bi bi-broadcast`,
  que sí existe y conserva el lenguaje minimalista del resto de programas.

### Insights de Next.js

- `/noticias` deja de esperar las publicaciones en la raíz: la lectura pasa a
  `componentes/ListadoNoticias.tsx`, envuelta en `<Suspense fallback={<EsqueletoArticulos />}>`.
  Desaparecen `instant-shell-url-data` y `blocking-prerender-dynamic`, y la ruta se prerenderiza
  parcialmente.
- El tercer aviso del overlay era un *hydration mismatch* provocado por el atributo
  `bis_skin_checked` que inyecta una extensión del navegador: no existe en el repositorio y no se
  reproduce con un perfil limpio, así que no afecta a producción.

### Heroes

- `TituloPagina` acepta `imageFit` (`cover` | `completo`) e `imageHeight` (`normal` | `alto`). Con
  `completo` la fotografía se muestra entera (`object-fit: contain`) sobre una copia desenfocada que
  rellena el encuadre: sin recortes y sin huecos.
- Se aplica en `/posgrados` (para que se vea qué hace el estudiante), `/contacto` y `/cursos`; este
  último estrena `RectorConferencia1.jpg` en lugar de `cursos-hero.webp`. La altura del hero sube a
  540 px (400 px en móvil).

### Preguntas frecuentes

- `faq-estudiantes.webp` se sustituye por `DocentesDebatiendo.jpg` en la portada, en `/nosotros` y
  en el prefooter. `cursos-hero.webp` queda sin uso.

### Enlaces de contacto

- Cabecera, pie, navegación rápida, rutas de «Tu ruta», tarjetas y CTAs apuntan a
  `/contacto#formulario-contacto`, y los `redirects` de `next.config.ts` conservan el ancla.
  `main section[id]` ya definía `scroll-margin-top`, así que el formulario queda visible bajo la
  cabecera fija.



