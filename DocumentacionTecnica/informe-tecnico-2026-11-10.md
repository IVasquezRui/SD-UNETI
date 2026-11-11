# Informe técnico — SD-UNETI

**Proyecto Soberanía Digital 2026-2030 · Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI)**

> Análisis técnico integral del portal institucional: tecnologías, metodología, fases de construcción, estado actual, veredicto de aptitud para producción y procedimiento de salida a producción.
>
> **Vista HTML:** [`informe-tecnico-2026-11-10.html`](./informe-tecnico-2026-11-10.html) — versión navegable con índice, búsqueda, tema claro/oscuro y progreso del go-live.

## Control del documento

| Campo | Valor |
|---|---|
| Documento | Informe técnico integral de SD-UNETI |
| Versión | 1.0 |
| Fecha de corte | 10/11/2026 |
| Repositorio | `https://github.com/IVasquezRui/SD-UNETI` |
| Rama observada | `develop` |
| Commit de referencia | `0658af1` — *docs(progreso): registrar la ronda de imagenes, heroes y anclas* (09/11/2026) |
| Alcance | `SD-UNETI/` — portal Next.js, WordPress headless, MariaDB, scripts y CI |
| Estado declarado | MVP funcional validado en entorno local; **no desplegado públicamente** |
| Veredicto | **No apto todavía para exposición pública**; apto para staging en red controlada (§11) |
| Documento de estado vivo | [`PROGRESS.md`](./PROGRESS.md) |
| Documento de metodología y arquitectura | [`Soberanía Digital 2026.md`](./Soberanía%20Digital%202026.md) |

**Convención de lectura.** Todo el informe usa cuatro estados, igual que la documentación previa del proyecto:

- **Implementado:** existe en el repositorio y fue validado con evidencia.
- **Parcial:** existe una base funcional, pero falta un requisito de producción.
- **Pendiente:** no está implementado o no fue verificado.
- **Propuesta:** recomendación de este informe, **no ejecutada** en el repositorio.

**Método de verificación.** El informe se construyó leyendo el código (`frontend/app`, `scripts/`, `docker-compose.yml`, `.github/workflows/`) y la documentación de `Documents/`, y re-ejecutando las validaciones que no requieren infraestructura levantada. Se indica en cada caso si un dato proviene de una validación propia del 10/11/2026 o de un informe previo del repositorio.

> **Nota sobre trazabilidad.** La copia observada del repositorio presenta **un único commit** en `develop`. La cronología de fases se reconstruye por tanto desde `Documents/` (planes, QA e informes de implementación), no desde el historial de Git. Esto se señala porque es, en sí mismo, un riesgo de trazabilidad (§10).

---

## 1. Resumen ejecutivo

SD-UNETI es el portal institucional de la UNETI construido con una arquitectura **headless**: WordPress administra el contenido y Next.js renderiza toda la experiencia pública. El objetivo institucional es reducir la dependencia de terceros, concentrar la lógica en infraestructura propia y sostener una plataforma mantenible y documentada durante el horizonte 2026-2030.

El proyecto **reemplazó la propuesta original** (tema WordPress con Elementor Pro y widgets React embebidos) por esta separación de responsabilidades, decisión registrada como **ADR-001** en `Documents/Soberanía Digital 2026.md`. El resultado es un MVP completo y funcional: sitio en español con once rutas públicas, noticias dinámicas con actualización en vivo, comentarios persistidos en la base nativa de WordPress, oferta académica de dos PNF y siete posgrados, tres formularios con persistencia y folio, y un entorno reproducible con Docker Compose y contenido sembrado desde fixtures JSON.

| Indicador | Valor observado |
|---|---|
| Contenedores | 3 (`next_frontend`, `wp_site`, `wp_mariadb`) + override de producción |
| Rutas de página | 11 (`/`, `/nosotros`, `/carreras`, `/carreras/[slug]`, `/posgrados`, `/cursos`, `/admisiones`, `/contacto`, `/noticias`, `/noticias/[slug]`, `/privacidad`) |
| Endpoints propios del frontend | 7 (`admisiones`, `contacto`, `posgrados`, `noticias`, `noticias/stream`, `noticias/[slug]/comentarios`, `revalidar`) |
| Endpoints de WordPress | `POST /wp-json/uneti/v1/solicitudes`, `GET|POST /wp-json/uneti/v1/comentarios/{slug}`, `/graphql` |
| Contenido sembrado | 6 noticias, 6 medios, 3 comentarios, 6 categorías, 18 etiquetas |
| Oferta académica | 2 PNF + 7 PNFA de posgrado, contenido estático en TypeScript |
| Workflows de CI | 10 + 1 acción compuesta |
| Código propio | ~18–20 mil líneas (el resto del árbol es *vendor* de WordPress) |

**Lo que está bien resuelto.** La reproducibilidad es el rasgo más maduro del proyecto: no hay dump SQL, el contenido vive en `seed/` con checksums SHA-256 y la importación es idempotente mediante marcas `_uneti_seed_*`. Python solo orquesta y valida; PHP usa las APIs nativas de WordPress, evitando escrituras directas a MariaDB. La capa de seguridad de aplicación también está por encima de la media de un MVP: CSP, HSTS, COOP/CORP, límite de cuerpo por ruta, rate limiting, honeypot, control de tiempo mínimo, tokens comparados en tiempo constante, XML-RPC y enumeración de usuarios bloqueados, y retención automática de datos personales a los 365 días.

**Lo que falta.** Todo lo que convierte un MVP en un servicio público: no hay TLS ni proxy inverso, no hay firewall, no hay backups ni restauración probada, no hay monitoreo ni alertas, el *frontend* se ejecuta con `npm run dev` y código montado por *bind mount*, no existe `Dockerfile` y los secretos viven en un `.env` sin rotación ni gestor. A eso se suman dos pendientes de calidad (pruebas E2E automatizadas y auditoría de accesibilidad) y uno legal (licencia del código y créditos de activos).

**Conclusión adelantada.** El producto está listo en lo funcional y en seguridad de aplicación, pero **no en lo operativo**. Con siete bloqueadores P0 cerrados —estimación de 3 a 5 jornadas técnicas más 1 o 2 de verificación— el portal puede publicarse con un riesgo aceptable. La ruta recomendada es Caddy 2 sobre el host de una VM Debian en Proxmox, con Docker escuchando solo en `127.0.0.1`, firewall restrictivo y administración de WordPress únicamente por Tailscale. El procedimiento completo está en §12.

## 2. Contexto institucional y propósito

### 2.1 El proyecto

El Proyecto Soberanía Digital 2026-2030 articula la modernización de la infraestructura web de la UNETI alrededor de tres principios: **soberanía tecnológica** (el contenido y la lógica permanecen en infraestructura controlada por la universidad), **separación de responsabilidades** y **reproducibilidad del entorno**. La universidad concentra su planta física en dos sedes en Caracas y cubre el territorio mediante un modelo híbrido —instalaciones de CANTV y Movilnet, la red de Infocentros y convenios con universidades territoriales—, lo que hace del portal el canal institucional de mayor alcance y justifica la inversión en una plataforma mantenible.

### 2.2 Qué cambió respecto de la propuesta original

El documento metodológico base planteaba un tema WordPress con **Elementor Pro**, widgets React embebidos y Tailwind JIT. La versión 2.0 sustituyó ese esquema por una arquitectura headless. La comparación está registrada en `Documents/Soberanía Digital 2026.md` §2.3:

| Elemento | Propuesta original | Implementación v2.0 | Tratamiento |
|---|---|---|---|
| CMS | WordPress administrable | WordPress headless | Conservado |
| Constructor visual | Elementor Pro | No forma parte del stack | Sustituido |
| Frontend | Tema WP + widgets React | Next.js 16 App Router + React 19 | Sustituido |
| Estilos | Tailwind JIT | Template `demo-elearning` + `uneti.css` (Tailwind v4 sin preflight) | Adaptado |
| Infraestructura | Proxmox local | Docker Compose local; Proxmox como destino | Transitorio |
| Trabajo remoto | Proxmox + Tailscale + VS Code Remote | Docker local; misma dirección | Pendiente de institucionalizar |

La decisión tiene consecuencias explícitas (ADR-001): menor acoplamiento y control total del HTML, los metadatos y el rendimiento, a cambio de mantener WPGraphQL, CORS interno y contratos de datos propios. También implica que WordPress deja de ser responsable del sitio público: no renderiza tema, no sirve CSS institucional y no expone el frontend.

### 2.3 Alcance del MVP y límites declarados

Dentro del alcance: sitio institucional, noticias, actualización en vivo, comentarios, carreras y posgrados, formularios con persistencia, CMS administrable, datos demo reproducibles, infraestructura Docker y documentación.

Fuera del alcance de esta fase, según el propio proyecto: inscripción en línea con expediente académico, pagos o facturación, gestión de cursos y lecciones, despliegue público y alta del dominio, auditoría WCAG completa, integración con CRM/SMTP/analítica, y estrategia de backups y recuperación ante desastres.

Esta distinción importa para el veredicto de §11: el proyecto **no incumplió su alcance**; lo que ocurre es que el alcance del MVP no equivale al de producción.

---

## 3. Tecnologías

### 3.1 Stack por capa

| Capa | Tecnología | Versión | Función |
|---|---|---|---|
| Frontend | Next.js (App Router) | `16.4.3` | Render, rutas, ISR, route handlers, metadatos |
| UI | React / React DOM | `19.3.1` | Componentes, Server Components, hooks de cliente |
| Lenguaje | TypeScript | `5.9.3` | Tipado estricto del frontend |
| Lint | ESLint + `eslint-config-next` | `9.39.5` / `16.4.3` | Calidad estática |
| Estilos | Template `demo-elearning` + `uneti.css` + Tailwind v4 | `4.3.3` | Identidad visual y utilidades |
| Runtime frontend | Node.js LTS + npm | `26.13.0` / `11.20.0` | Ejecución y build (`engines: >=26.13.0`) |
| CMS | WordPress | `7.1.4` (PHP `8.5`) | Administración de contenido |
| API de contenido | WPGraphQL | `2.26.0` | Consultas GraphQL de noticias y medios |
| API propia | REST de WordPress (mu-plugins) | — | Solicitudes y comentarios |
| Base de datos | MariaDB | `11.8.9` | Persistencia de posts, medios, comentarios y solicitudes |
| Orquestación | Docker Compose | 3 servicios | Entorno reproducible |
| Automatización | Python (solo stdlib) | 3.10+ | `seed.py`: export, import, bootstrap, verify, validate |
| CI/CD | GitHub Actions | 10 workflows + 1 acción compuesta | Calidad, despliegue de prueba, QA y pentesting |
| Memoria técnica | `lookdown` | v1.0.0 | Grafo de navegación para agentes (no versionado) |

### 3.2 Inventario de dependencias

`frontend/package.json` declara **tres dependencias de ejecución** (`next`, `react`, `react-dom`) y siete de desarrollo (`@tailwindcss/turbopack`, `@types/node`, `@types/react`, `@types/react-dom`, `eslint`, `eslint-config-next`, `tailwindcss`, `typescript`). Es un árbol deliberadamente mínimo: `npm ci` instala 358 paquetes.

No se usan clientes GraphQL pesados (Apollo, urql): `frontend/app/lib/wordpress.ts` implementa un cliente mínimo sobre `fetch` nativo. Tampoco hay librería de componentes, gestor de estado ni framework CSS adicional. Esa austeridad reduce superficie de ataque, tamaño de bundle y deuda de actualización.

### 3.3 Decisiones tecnológicas y su justificación

| Decisión | Motivo | Consecuencia |
|---|---|---|
| Server Components por defecto | Menos JavaScript cliente, datos resueltos en servidor | El equipo debe dominar los límites RSC y la caché de Next |
| `fetch` nativo en lugar de cliente GraphQL | Menos dependencias y control explícito de la caché | Consultas escritas a mano; sin normalización de caché |
| WordPress solo como CMS | Separar contenido de presentación | Hay que mantener WPGraphQL y los contratos REST |
| Comentarios en `wp_comments` | Moderación, avatares y compatibilidad nativa | Se hereda el esquema y la moderación de WordPress |
| Carreras estáticas en TypeScript | Evitar sobredimensionar el CMS en el MVP | El cambio de oferta exige despliegue, no edición editorial |
| SSE con polling de respaldo | Tiempo real sin WebSockets ni infraestructura extra | Caché en memoria por conexión; no escala horizontal sin pub/sub |
| Navegación con recarga completa | El template mutaba el DOM y rompía la hidratación | No hay navegación SPA (deuda aceptada) |
| Node 26 LTS + npm | Sustituir Bun y estabilizar el build | `package-lock.json` versionado; el host debe usar la misma versión |

### 3.4 Herramientas de calidad y seguridad

- **GitHub Actions**: `seed.yml`, `01-despliegue.yml`, `02-wordpress.yml`, `03-frontend.yml`, `04-formulario.yml`, `05-qa.yml`, `06-pentest-nextjs.yml`, `07-pentest-wordpress.yml`, `08-pentest-mariadb.yml`, `09-seguridad.yml`.
- **Pentesting**: scripts propios (`scripts/ci/pentest-*.sh`) con salida `[POSITIVO]/[NEGATIVO]`, más WPScan y Nuclei cuando hay token o binario disponible.
- **QA funcional**: `qa-frontend.sh` (rutas, enlaces, imágenes, marcadores de contenido) y `probar-formulario.mjs` (envío real y verificación en base de datos).
- **Auditoría headless**: Playwright se usó en la validación del 31/10/2026 (11 rutas × 2 viewports, consola, overflow, `alt`, `h1`), **no** está integrado en CI ni declarado en `package.json`.
- **Escaneo de secretos**: `gitleaks` en `09-seguridad.yml`; `npm audit --omit=dev --audit-level=high` como puerta.

---

## 4. Arquitectura

### 4.1 Vista de contexto

```text
Navegador
   │
   ├── HTML / SSE ──────────────► Next.js  :3000
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

Toda lectura de datos ocurre **en el servidor de Next.js**. El navegador nunca llama a WordPress: no consume GraphQL, no consume la REST de comentarios y no conoce el token de solicitudes. Esa es la decisión que permite, en producción, cerrar WordPress al público salvo los archivos subidos (§12.6).

### 4.2 Componentes

| Componente | Contenedor | Responsabilidad | Estado |
|---|---|---|---|
| Portal Next.js | `next_frontend` | Render, rutas, metadatos, ISR, SSE, formularios, proxy de comentarios | Implementado |
| CMS WordPress | `wp_site` | Contenido, medios, comentarios, solicitudes, administración | Implementado |
| Base de datos | `wp_mariadb` | Persistencia única del sistema | Implementado |
| Mu-plugins | volumen en `wp_site` | Solicitudes, comentarios, seguridad y privacidad | Implementado |
| WPGraphQL | volumen en `wp_site` | API GraphQL de contenido | Implementado |
| Seed portable | `seed/` + `scripts/` | Reconstrucción idempotente del contenido | Implementado |
| CI | GitHub Actions | Validación, QA y pentesting | Implementado |
| Proxy inverso y TLS | — | Publicación segura | **Pendiente** |
| Backups y monitoreo | — | Operación | **Pendiente** |

### 4.3 Flujos de datos

1. **Contenido (lectura).** Server Component → `consultarGraphQL()` → `/graphql` de WordPress → mapeo a `Noticia` → HTML con `cacheLife('noticias')`. El listado y el detalle se revalidan por etiqueta (`noticias`, `noticia-<slug>`).
2. **Comentarios (lectura y escritura).** Componente cliente → `POST /api/noticias/[slug]/comentarios` (Next) → REST propia de WordPress → `wp_insert_comment` en `wp_comments`. La lectura se refresca por polling de 20 s y tras publicar.
3. **Solicitudes (escritura).** Formulario → `/api/admisiones`, `/api/posgrados` o `/api/contacto` → validación → rate limit → honeypot y tiempo mínimo → `POST /wp-json/uneti/v1/solicitudes` con `X-UNETI-Token` → CPT privado `solicitud_uneti` → folio `UNETI-AAAA-NNNNNN`.
4. **Tiempo real.** `GET /api/noticias/stream` (SSE) consulta WordPress cada 15 s y emite solo si cambia el hash del contenido; el cliente cae a polling de 30 s si `EventSource` falla.
5. **Revalidación.** WordPress o un operador llama `POST /api/revalidar` con `X-UNETI-Token`; el handler compara en tiempo constante y ejecuta `revalidateTag` + `revalidatePath`.

### 4.4 Rutas públicas

| Ruta | Tipo | Contenido | Estrategia |
|---|---|---|---|
| `/` | Estática + ISR | Portada institucional | Shell parcial + noticias en Suspense |
| `/nosotros` | Estática | Misión, visión, historia, modalidad híbrida | Prerender |
| `/carreras` | Estática | Oferta PNF y posgrados | Prerender |
| `/carreras/[slug]` | Dinámica | Detalle de PNF (2) | `generateStaticParams` + ISR |
| `/posgrados` | Estática | 7 PNFA con malla y requisitos | Prerender |
| `/cursos` | Estática | Cursos cortos con CTA a WhatsApp | Prerender |
| `/admisiones` | Estática | Proceso y formulario | Prerender |
| `/contacto` | Estática | Sedes, mapas y formulario | Prerender |
| `/noticias` | ISR | Listado | `cacheLife('noticias')` (5 min) |
| `/noticias/[slug]` | ISR | Detalle, relacionadas y comentarios | Tag por slug + revalidación |
| `/privacidad` | Estática | Aviso de privacidad | Prerender |
| `robots.txt`, `sitemap.xml` | Metadata routes | SEO técnico | Dinámicas con `NEXT_PUBLIC_SITE_URL` |
| `/.well-known/security.txt` | Estático | Canal de reporte de seguridad | Servido desde `public` |

Redirecciones permanentes (301) en `next.config.ts`: `/about` → `/nosotros`, `/admissions` → `/admisiones`, `/contact` y `/contactanos` → `/contacto#formulario-contacto`, `/news` y `/news/:slug*` → `/noticias…`, `/courses` y `/courses/:slug*` → `/carreras…`, `/api/contact` → `/api/contacto`.

### 4.5 Endpoints propios

| Endpoint | Método | Función | Protecciones |
|---|---|---|---|
| `/api/admisiones` | POST / GET(405) | Solicitud de admisión PNF | Origin, `application/json`, rate limit 5/10 min, cuerpo 16 KB, honeypot, tiempo mínimo, validación |
| `/api/posgrados` | POST / GET(405) | Solicitud de posgrado | Ídem, whitelist de 7 programas |
| `/api/contacto` | POST / GET(405) | Mensaje de contacto | Ídem |
| `/api/noticias` | GET | Listado para clientes | Sin caché |
| `/api/noticias/stream` | GET (SSE) | Cambios en vivo | Hash de contenido, cierre limpio |
| `/api/noticias/[slug]/comentarios` | GET / POST | Comentarios | Cuerpo 8 KB, rate limit, validación, 404/403 |
| `/api/revalidar` | POST / GET(405) | Invalidación ISR | Token en tiempo constante, cuerpo 2 KB, rate limit 20/min |

### 4.6 Modelo de contenido y de datos

- **Noticias:** `wp_posts` + `wp_postmeta`, con imagen destacada, categorías, etiquetas, autor genérico y comentarios nativos.
- **Medios:** originales en `seed/media/AAAA/MM/`; WordPress genera variantes y miniaturas en `wp_data/wp-content/uploads/`.
- **Comentarios:** tabla nativa `wp_comments`. Se guardan aprobados en el flujo demo; en producción deben moderarse (§11).
- **Solicitudes:** CPT privado `solicitud_uneti` + `wp_postmeta`, clasificado por la taxonomía `estado_solicitud`. Campos: tipo (`admision` | `posgrado` | `contacto`), nombre, cédula, correo, teléfono, programa, asunto, mensaje, consentimiento, origen, IP hasheada y folio. Exportación CSV desde el panel.
- **Carreras y posgrados:** contenido estático en `frontend/app/lib/carreras.ts` (2 PNF), `posgrados.ts` (7 PNFA) y `cursos.ts`. No pasan por el CMS.
- **Retención:** `uneti-privacidad.php` borra a diario las solicitudes con más de **365 días** (`UNETI_PRIV_RETENCION_DIAS`, ajustable con el filtro `uneti_dias_retencion`) y expone el CPT en las herramientas de privacidad de WordPress.

### 4.7 Caché, render y topología

**Render.** `cacheComponents: true` y `partialPrefetching: true` en `next.config.ts`. Los perfiles `cacheLife` son `noticias` (stale 60 s, revalidate 300 s, expire 3600 s) y `contenido` (3600 / 86400 / 604800). Los route handlers son dinámicos; SSE y polling leen con `cache: "no-store"`.

**Topología actual.** Un host con Docker Compose, tres contenedores en la red `frontend_net`, dos puertos publicados (`3000`, `8080`) y sin proxy. Es una topología de desarrollo, no de servicio.

**Topología objetivo.** Un proxy inverso con TLS en el borde, los contenedores accesibles solo por loopback o red interna, base de datos sin puerto publicado, administración del CMS por red privada, backups fuera del host y monitoreo activo. El detalle ejecutable está en §12.

**Límites de confianza.** Internet → proxy → Next.js (zona expuesta); Next.js → WordPress (zona interna, token de servicio); WordPress → MariaDB (zona de datos); operadores → `wp-admin` (zona administrativa, acceso restringido).

---

## 5. Metodología

### 5.1 Base metodológica

El proyecto declara una hibridación de **Scrum** para la organización del trabajo y **Programación Extrema (XP)** para la calidad del código, alineada con **ISO/IEC/IEEE 12207** (ciclo de vida, verificación, validación y trazabilidad). Sobre esa base se añaden tres prácticas documentales: **Docs-as-Code** (documentación versionada junto al código), **ADR** (registro de decisiones con su contexto y consecuencias) y **Feature Branching**.

| Práctica | Aplicación concreta en SD-UNETI |
|---|---|
| Scrum | Backlog priorizado, iteraciones cortas, demo y revisión al cierre de cada ronda |
| XP | Simplicidad, feedback rápido, refactor continuo y validaciones automatizadas |
| ISO/IEC/IEEE 12207 | Ciclo de vida, verificación, validación, mantenimiento y trazabilidad |
| Docs-as-Code | `PROGRESS.md`, `Documents/`, QA e informes de implementación versionados |
| ADR | Decisiones registradas en `Soberanía Digital 2026.md` §13.5 |
| Feature Branching | `main` estable, `develop` de integración, ramas cortas por funcionalidad |

### 5.2 Ciclo de trabajo

1. **Descubrimiento:** necesidad, alcance, rutas, datos y restricciones.
2. **Diseño:** contrato de datos, impacto arquitectónico y criterios de aceptación.
3. **Implementación:** rama corta con commits atómicos y mensajes imperativos.
4. **Validación:** tipos, lint, build, smoke tests y pruebas manuales.
5. **Documentación:** actualización de `PROGRESS.md` y ADR cuando corresponde.
6. **Revisión:** regresiones, seguridad, accesibilidad y coherencia visual.
7. **Cierre:** integración, evidencia registrada y actualización de la hoja de ruta.

### 5.3 Definition of Ready y Definition of Done

**Ready:** necesidad y alcance comprendidos; rutas, componentes y fuente de datos identificados; criterios de aceptación escritos; impacto de seguridad, privacidad y accesibilidad evaluado; dependencias y riesgos conocidos.

**Done:** código implementado y tipado; `npx tsc --noEmit` sin errores; `npm run lint` sin errores nuevos; `npm run build` exitoso; smoke tests de las rutas afectadas; persistencia o contrato verificado; documentación y ADR actualizados; `lookdown` regenerado si cambió la estructura; sin secretos en el diff; revisión responsive y de accesibilidad básica.

### 5.4 Priorización y roles

El backlog se ordena por valor institucional, riesgo de seguridad o privacidad, dependencia técnica, impacto en la experiencia y esfuerzo disponible. En la etapa actual una misma persona cubre varios roles (producto, arquitectura, frontend, backend/CMS, operaciones, contenido y seguridad), lo que constituye un riesgo de concentración de conocimiento (§10).

### 5.5 Gobernanza documental

| Necesidad | Documento | Regla de actualización |
|---|---|---|
| Metodología y arquitectura | `Soberanía Digital 2026.md` | Cambio relevante o revisión de versión |
| Estado operativo | `PROGRESS.md` | Después de cada hito |
| Decisiones | ADR en `Soberanía Digital 2026.md` §13.5 | Al decidir o revertir |
| Navegación del código | `lookdown/` | Tras cambio estructural |
| Créditos de activos | `seed/CREDITS.md` e `instituciones/CREDITS.md` | Al agregar activos |
| QA y evidencias | `Documents/qa-*.md`, `Documents/2026-11-*/` | Al cerrar cada ronda |

La regla es explícita: las afirmaciones de cumplimiento deben incluir evidencia verificable, y los secretos nunca se documentan con su valor real.

---

## 6. Fases de construcción

### 6.1 Cronología

| Fase | Periodo | Objetivo | Entregables principales | Estado |
|---|---|---|---|---|
| Antecedente | — | Propuesta original: tema WP + Elementor Pro | Documento metodológico `.docx` | Reemplazado |
| **Fase 0** | Hasta 18/10/2026 | MVP local headless | Next.js 16, WordPress headless, MariaDB, noticias, SSE, comentarios, carreras, Docker | **Completada** |
| **Fase 1** | 20/10/2026 | Seed portable | `seed/`, `seed.py`, `export.php`, `importar.php`, montaje de WPGraphQL, créditos | **Completada** |
| **Fase 2** | 20/10/2026 | Bootstrap limpio y portabilidad | `bootstrap.php`, eliminación de `database/init.sql`, `.env.example`, URLs y puertos configurables, imágenes fijadas | **Completada** |
| **Fase 3** | 20/10/2026 | Validación continua y documentación | `seed.yml`, `validate`/`verify`, actualización documental, regeneración de `lookdown` | **Completada** |
| **Fase 4** | 29/10/2026 | Limpieza opcional | Poda de `wp_content`, evaluación de LFS, separación de backup operativo | **Completada** |
| **Fase 5** | 27/10 – 09/11/2026 | Renovación UI/UX y madurez funcional | Retiro de jQuery, React, imágenes WebP, `/cursos`, ISR, posgrados, formularios, hardening | **En cierre** |
| **Fase 6** | Sin iniciar | Despliegue productivo | Proxy, TLS, firewall, backups, monitoreo, staging, runbook | **Pendiente** |

### 6.2 Fases 0 a 4 — de la plantilla al entorno reproducible

La **Fase 0** construyó el MVP headless y validó las rutas críticas: noticias desde WPGraphQL, SSE con latencia menor a 20 segundos, comentarios persistidos en `wp_comments`, carreras completas y build de producción. El criterio de salida se cumplió el 18/10/2026.

La **Fase 1** resolvió el problema estructural del proyecto. El diagnóstico previo identificó ocho hallazgos, entre ellos que `wp_data/` estaba fuera de Git, que `database/init.sql` era un dump con usuarios, sesiones e IPs, y que el script de seed no era portable. Se evaluaron cuatro alternativas y se eligió **fixtures JSON + APIs nativas de WordPress + orquestador Python**. El principio rector quedó escrito: *Python no escribe en MariaDB; orquesta y valida. PHP usa `wp_insert_post`, `media_handle_sideload` y `wp_insert_comment`*. Así se respetan metadatos serializados, miniaturas, términos y cachés.

La **Fase 2** completó la portabilidad: `bootstrap.php` instala WordPress solo si la base está vacía, se eliminó el dump SQL, se externalizaron contraseñas, URLs, puertos y nombres de contenedor en `.env`, y se fijaron las imágenes por etiqueta. La **Fase 3** añadió el workflow de clon limpio (`seed.yml`), los subcomandos `validate` y `verify`, y la documentación de estado. La **Fase 4** podó el árbol de WordPress y separó el respaldo operativo del repositorio.

El resultado verificable de este bloque es que un clon sin `wp_data/` ni `db_data/` reconstruye el sitio con `docker compose up -d` y `python3 scripts/seed/seed.py bootstrap`, sin duplicar contenido en una segunda ejecución.

### 6.3 Fase 5 — renovación UI/UX (27–29/10/2026)

Objetivo: eliminar el runtime heredado del template y recuperar identidad institucional. Se retiró `ScriptsPlantilla`, `jquery.js`, `vendors.min.js` y `main.js`; las interacciones se reimplementaron como componentes React (`EncabezadoSitio`, `CarruselSimple`, `ContadorAnimado`, `SeccionPreguntas`, `Reveal`, `ParticulasDecorativas`). Se corrigió un defecto crítico de cascada: el selector `[class*=ti-]` de `style.css` coincidía con todas las clases `uneti-*` y aplicaba `display:inline-block`, rompiendo rejillas completas; se acotó a tokens completos. Se incorporaron imágenes WebP institucionales, `imagePosition` en `TituloPagina` y la ruta `/cursos`.

Quedaron pendientes tres entregables: la nueva fotografía del hero, el organigrama institucional en `/nosotros` (E-09, con fuente oficial en `organigrama-uneti-2026.pdf`) y la verificación Playwright en escritorio y móvil como puerta automatizada.

### 6.4 Ronda del 31/10/2026 — migración de runtime y auditoría headless

Se sustituyó Bun por **Node.js 26.13.0 LTS + npm**, con `package-lock.json` versionado. Se actualizaron Next.js `16.4.3`, React `19.3.1`, WordPress `7.1.4`, WPGraphQL `2.26.0` y MariaDB `11.8.9`. La auditoría con Playwright sobre 11 rutas y dos viewports reportó **0 errores de hidratación, 0 overflow, 0 IDs duplicados, 0 imágenes sin `alt` y un solo `h1` por vista**. El build generó 23 páginas y las 6 noticias quedaron prerenderizadas. También se corrigió el fallo de `/_global-error`, causado por fijar `NODE_ENV=development` en el servicio `frontend`.

### 6.5 Ronda del 05/11/2026 — ISR, posgrados y formularios

Se implementó **ISR con Cache Components** (`'use cache'` + `cacheLife` + `cacheTag` + `/api/revalidar`) porque en Next 16 con `cacheComponents` las opciones `dynamic`, `revalidate` y `fetchCache` dejan de existir como configuración de segmento. Se añadieron `/posgrados` con siete PNFA, el formulario de posgrado, los mapas de las dos sedes, la navegación rápida, WhatsApp centralizado y `/privacidad`. Los tres formularios comparten el mismo patrón de validación, rate limit, honeypot, control de tiempo mínimo y reenvío con token.

### 6.6 Ronda del 08/11/2026 — 22 puntos y endurecimiento

Se ejecutaron 22 requerimientos en **6 PRs temáticos** (`grupo-1-ui-portada` a `grupo-6-docs`) con 31 commits descriptivos. El alcance combinó rediseño (portada, carreras, posgrados, nosotros, responsive), corrección de defectos (TFSA, flashcards, parallax, justificación tipográfica) y —el punto de mayor impacto— un **proceso de hardening alineado con SOC 2, ISO/IEC 27001 e ISO/IEC 27701**. El cierre reportó:

| Validación | Resultado |
|---|---|
| `npx tsc --noEmit` | Sin errores |
| `npm run lint` | Sin errores |
| `npm run build` | Correcto, ISR activo |
| `docker compose config -q` | Correcto |
| Contenedores | 3 en estado `healthy` |
| `qa-frontend.sh` | **29/29**, 120 enlaces e imágenes verificados, 0 brechas |
| `probar-formulario.mjs` | **12/12**, folios UNETI-2026-000035 a 000038 |
| `pentest-nextjs.sh` | **26/26**, 0 brechas |

### 6.7 Fase 6 — despliegue productivo (no iniciada)

Es la fase actual pendiente. Sus entregables están definidos en la hoja de ruta: contenedores o VM reproducibles en Proxmox, acceso remoto seguro por Tailscale y SSH, proxy inverso y TLS, dominio institucional, backups automáticos con restauración probada, monitoreo y alertas, staging previo y runbook de despliegue y rollback. El §12 de este informe desarrolla ese procedimiento.

---

## 7. Fase actual

### 7.1 Posición en la hoja de ruta

El proyecto está en **cierre de Fase 5 y antesala de Fase 6**. No hay una fase de desarrollo abierta: lo que resta de la Fase 5 son tres entregables concretos y lo que falta para producción es infraestructura, no producto.

| Área | Estado | Evidencia |
|---|---|---|
| Sitio público (11 rutas) | Cerrado | QA 29/29 y smoke tests de rutas |
| Noticias dinámicas, SEO y relacionadas | Cerrado | ISR + tags + `sitemap.xml` |
| Comentarios | Cerrado (moderación pendiente) | Persistencia en `wp_comments` |
| Solicitudes y folios | Cerrado | 12/12 pruebas de formulario |
| Oferta académica | Cerrado | 2 PNF + 7 PNFA + cursos |
| Responsive | Cerrado | Verificación 1440 px y 390 px |
| Accesibilidad | Parcial | Sin auditoría formal axe/WCAG |
| Organigrama institucional (E-09) | Pendiente | `fase-5-ui-ux-2026.md` |
| Hero definitivo | Pendiente | `nextSteps.md` §8 |
| Pruebas E2E en CI | Pendiente | Playwright solo manual (31/10) |
| Despliegue productivo (Fase 6) | Pendiente | Sin proxy, TLS, backups ni monitoreo |

### 7.2 Verificación ejecutada para este informe (10/11/2026)

| Comprobación | Resultado | Observación |
|---|---|---|
| `python3 scripts/seed/seed.py validate` | **OK** | 6 posts, 6 medios, 3 comentarios, 6 categorías, 18 etiquetas; checksums y manifiesto correctos |
| `docker compose config -q` | **Falla sin `.env`** | `MYSQL_ROOT_PASSWORD` y `MYSQL_PASSWORD` son obligatorias; no hay `.env` en esta copia |
| `frontend/node_modules` | Ausente | No se puede ejecutar `tsc`, `lint` ni `build` sin instalar dependencias |
| Node del host | `v20.20.2` | Por debajo de `>=26.13.0`; el build debe hacerse en el contenedor |
| Docker / Compose | `28.1.1` / `v2.36.0` | Compatible con `!reset`/`!override` (Compose ≥ 2.24) |
| Python del host | `3.14.5` | Compatible con la stdlib usada por `seed.py` |
| Git | Rama `develop`, árbol limpio, 1 commit | Historia consolidada; trazabilidad en `Documents/` |

Esta verificación confirma dos cosas: el contenido es reproducible hoy, y el entorno **no está listo para arrancar sin configuración** —lo cual es correcto por diseño, pero implica que cualquier despliegue debe crear su `.env` y sus secretos antes de levantar el stack.

### 7.3 Qué falta exactamente para cerrar la Fase 5

1. Sustituir el hero por la imagen institucional definida y su variante móvil.
2. Construir el organigrama animado de `/nosotros` con el PDF oficial como única fuente.
3. Verificar `/`, `/nosotros`, `/carreras`, `/cursos`, `/admisiones`, `/contacto` y `/noticias` a 1440 px y 390 px.
4. Auditar accesibilidad (contraste, foco, `prefers-reduced-motion`) y peso de imágenes.
5. Convertir la verificación Playwright en una puerta de CI, no en una revisión manual.

Ninguno de estos puntos bloquea la publicación, salvo el de accesibilidad si la institución exige WCAG AA desde el primer día.

---

## 8. Calidad y validación

### 8.1 Evidencias acumuladas

| Verificación | Última evidencia | Resultado |
|---|---|---|
| Tipos (`tsc --noEmit`) | 08/11/2026 | Sin errores |
| Lint (`npm run lint`) | 08/11/2026 | Sin errores |
| Build (`npm run build`) | 08/11/2026 | Correcto; ISR activo |
| QA funcional | 08/11/2026 | 29/29, 120 enlaces e imágenes, 0 brechas |
| Formularios punta a punta | 08/11/2026 | 12/12, folios persistidos en MariaDB |
| Pentest Next.js | 08/11/2026 | 26/26, 0 brechas |
| Pentest WordPress | Configurado en CI | Manual/mensual; WPScan con token opcional |
| Pentest MariaDB | Configurado en CI | Manual/mensual |
| Seed | 08/11/2026 y 10/11/2026 | `validate`, `import` idempotente y `verify` correctos |
| Auditoría headless | 31/10/2026 | 11 rutas × 2 viewports, 0 hidratación, 0 overflow, 0 `alt` faltante |
| Accesibilidad formal | — | **No ejecutada** (axe, teclado, contraste, lector) |
| Rendimiento | — | **No medido** (sin Lighthouse ni presupuesto) |
| E2E automatizado | — | **No integrado en CI** |

### 8.2 Cobertura real de las pruebas

La estrategia es de **pirámide invertida con base en smoke tests**: no hay pruebas unitarias ni de integración de componentes, pero sí pruebas de extremo a extremo de las rutas y de los formularios, ejecutadas contra el stack levantado. Es una elección razonable para un MVP, con un costo claro: cualquier regresión de lógica interna (validaciones, mapeo de datos, caché) solo se detecta si se manifiesta en HTTP o en base de datos.

### 8.3 Puertas de calidad en CI

`03-frontend.yml` ejecuta `npm ci`, TypeScript y ESLint con Node 26. `02-wordpress.yml` hace lint PHP y pruebas de CPT, REST, GraphQL y endurecimiento. `04-formulario.yml` envía un formulario real y verifica la persistencia en `wp_posts`/`wp_postmeta`. `01-despliegue.yml` levanta el stack de producción en el runner, siembra y ejecuta QA. `09-seguridad.yml` corre `npm audit`, `gitleaks` y validación de compose. Los pentests (`06`–`08`) son manuales y mensuales para no consumir minutos del plan gratuito.

---

## 9. Seguridad y privacidad

### 9.1 Controles implementados

| Capa | Control | Implementación |
|---|---|---|
| Red (aplicación) | Rate limiting por IP y por clave | `app/lib/rate-limit.ts` en todas las rutas que escriben |
| Red (aplicación) | Validación de `Origin` | `origenValido()` acepta el host real y el sitio configurado; rechaza el resto con 403 |
| Red (aplicación) | Límite de cuerpo | 16 KB formularios, 8 KB comentarios, 2 KB revalidación |
| Aplicación | Anti-CSRF de origen cruzado | Verificación de `Origin` + token de servicio |
| Aplicación | Anti-bot | Honeypot (`sitio_web`) y tiempo mínimo de 2,5 s |
| Aplicación | Comparación de tokens | `timingSafeEqual` con verificación de longitud |
| Aplicación | Cabeceras | CSP, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP, CORP, `X-Permitted-Cross-Domain-Policies`, `Origin-Agent-Cluster` |
| Aplicación | HSTS | `max-age=31536000; includeSubDomains` solo en producción |
| Aplicación | TRACE/TRACK | `proxy.ts` responde 405 antes del handler |
| WordPress | XML-RPC y pingback | Deshabilitados en `uneti-seguridad.php` |
| WordPress | Enumeración de usuarios | `?author=` redirigido, `/wp/v2/users` oculto, sitemap sin usuarios |
| WordPress | Fuerza bruta | Límite de intentos y mensajes genéricos en el login |
| WordPress | Application Passwords | Deshabilitadas |
| WordPress | Edición de archivos | `DISALLOW_FILE_EDIT` |
| Servidor web | Apache | Sin listados, bloqueo de archivos sensibles y de PHP en `uploads` |
| PHP | `seguridad.ini` | `expose_php=Off`, errores ocultos, cookies `HttpOnly`/`SameSite` |
| Base de datos | MariaDB | Sin puerto publicado, `local-infile=0`, `skip-name-resolve`, `root` solo local |
| Contenedores | Endurecimiento | `no-new-privileges`, `pids_limit`, healthchecks |
| Datos | Minimización y retención | CPT privado, IP hasheada, borrado diario a los 365 días |
| Datos | Transparencia | `/privacidad`, aviso de cookies, `security.txt` |
| CI | Secretos | `gitleaks` con historial completo |
| CI | Dependencias | `npm audit --omit=dev --audit-level=high` |

### 9.2 Correspondencia normativa

El proyecto documenta su alineación en `Documents/seguridad/2026-11-08-hardening.md`:

- **SOC 2 (Trust Services Criteria):** gobierno y gestión de cambios, identidad y acceso, cifrado en tránsito, seguridad de aplicaciones, detección y respuesta.
- **ISO/IEC 27001:2022:** controles organizacionales, de personas, físicos y tecnológicos, con evidencias y comandos de verificación.
- **ISO/IEC 27701:2019:** rol de responsable del tratamiento, consentimiento explícito en formularios, finalidad, limitación de la recolección, transparencia, calidad del dato, derechos de las personas y supresión.

Conviene leerlo con precisión: es una **alineación de controles**, no una certificación. No hubo auditoría externa y varios requisitos de operación (TLS en el host, respaldos, MFA, monitoreo) están declarados como pendientes dentro del propio documento.

### 9.3 Riesgos residuales de seguridad

| Riesgo | Estado actual | Mitigación recomendada |
|---|---|---|
| CSP con `'unsafe-inline'` en `script-src` | Aceptado por compatibilidad con el template | Migrar a *nonces* con el proxy de Next 16 |
| Rate limit en memoria | Límite por proceso; se reinicia al reiniciar el contenedor | Redis compartido si se escala horizontalmente |
| Sin MFA en WordPress | Login limitado y `wp-admin` restringible por red | Plugin MFA o SSO institucional |
| Sin WAF ni protección volumétrica | Solo controles de aplicación | Caddy/Fail2ban o WAF institucional |
| TLS terminado en el host | Documentado, no implementado | Certificado gestionado con renovación automática (§12) |
| Backups | Solo `db_data/` local | Copia cifrada fuera del host y prueba de restauración |
| Monitoreo | Healthchecks y CI | Alertas a correo/Telegram ante caídas |
| TRACE en el proxy inverso | Next lo corta con 405 | Devolver 405 también en el proxy |

---

## 10. Riesgos y deuda técnica

### 10.1 Matriz de riesgos actualizada

| ID | Riesgo | Probabilidad | Impacto | Estado real | Tratamiento |
|---|---|---|---|---|---|
| R-01 | Secretos en `.env` sin rotación ni gestor | Alta | Alto | **Abierto** | Secrets de Docker o gestor externo; rotar tokens y salts |
| R-02 | Imágenes fijadas por etiqueta, no por digest | Media | Medio | **Abierto** | Fijar por digest y registrar el procedimiento |
| R-03 | Comentarios autoaprobados y sin anti-spam | Alta | Alto | **Parcial** | El rate limit existe; falta moderación previa y CAPTCHA |
| R-04 | Persistencia y notificación de leads | Baja | Medio | **Mitigado** | CPT + folio + exportación CSV; falta correo/CRM |
| R-05 | Multimedia no reproducible fuera de `seed/` | Baja | Bajo | **Mitigado** | Seed con SHA-256 y regeneración de miniaturas |
| R-06 | WPGraphQL actualizado fuera del repositorio | Media | Medio | **Abierto** | Está versionado y montado; falta procedimiento de actualización |
| R-07 | Sin pruebas E2E en CI | Alta | Alta | **Abierto** | Playwright manual; convertir en workflow |
| R-08 | Sin TLS, proxy ni backups | Alta | Alto en producción | **Abierto** | Fase 6 / §12 |
| R-09 | Accesibilidad no auditada | Media | Media | **Abierto** | axe, teclado, contraste y lector de pantalla |
| R-10 | Rendimiento no medido | Media | Media | **Abierto** | Lighthouse móvil y presupuesto |
| R-11 | Caché SSE en memoria por conexión | Media | Bajo en MVP | **Aceptado** | Pub/sub solo si se escala horizontalmente |
| R-12 | Navegación con recarga completa | Baja | N/A | **Aceptado** | Decisión deliberada de simplicidad |
| R-13 | Dependencia del runtime jQuery del template | Baja | Medio | **Mitigado** | Runtime eliminado; interacciones en React |
| R-14 | Licencias de plantilla, imágenes y librerías sin revisar | Media | Media | **Abierto** | Auditoría legal antes de publicar; `LICENSE` |
| R-15 | Concentración de conocimiento en pocas personas | Alta | Media | **Mitigación parcial** | Documentación, onboarding y entorno reproducible |
| R-16 | Sin staging ni CI/CD de despliegue | Media | Alta | **Parcial** | Hay CI de validación; falta staging y promoción |

### 10.2 Deuda técnica aceptada

- La navegación no es SPA: se usa `<a>` con recarga completa porque el template mutaba el DOM.
- Las carreras y posgrados son estáticos en TypeScript: un CMS de oferta académica se evaluará cuando exista flujo editorial.
- Los comentarios se aprueban automáticamente para la demo. **No es aceptable en producción.**
- El formulario persiste en WordPress, pero no notifica por correo ni integra CRM.
- Los pentests son comprobaciones automatizadas, no una auditoría profesional.
- La CSP mantiene `'unsafe-inline'`; el plan de nonces está documentado pero no ejecutado.

### 10.3 Riesgos específicos de la puesta en producción

| Riesgo | Por qué importa | Mitigación en §12 |
|---|---|---|
| Ejecutar `next dev` en producción | Rendimiento bajo, mensajes de error expuestos, recarga de código | Imagen construida con `next build` + `next start` |
| Publicar `3000`/`8080` | WordPress y Next expuestos sin proxy ni control | Publicar solo en `127.0.0.1`; Caddy en el borde |
| `NEXT_PUBLIC_*` ausente en el build | `metadataBase`, `robots.txt`, `sitemap.xml` y las URL absolutas quedan mal | Pasarlas como `ARG` en la etapa de build |
| WordPress detrás de proxy sin `X-Forwarded-Proto` | Bucles de redirección y cookies inseguras | Ajuste en `WORDPRESS_CONFIG_EXTRA` |
| `DISABLE_WP_CRON=true` sin cron del sistema | Cron de WordPress y limpieza de retención no se ejecutan | Timer de systemd cada 5–15 min |
| Restaurar sin probar | Un backup no verificado no es un backup | Prueba trimestral documentada |

---

## 11. Veredicto de aptitud para producción

### 11.1 Semáforo por dimensión

| Dimensión | Nota | Justificación |
|---|---|---|
| Funcionalidad | 🟢 Apto | Once rutas operativas, noticias, comentarios, formularios con folio, oferta académica completa y QA 29/29 |
| Calidad de código | 🟢 Apto | TypeScript estricto, lint limpio, build correcto, árbol de dependencias mínimo |
| Seguridad de aplicación | 🟡 Apto con reservas | Controles sólidos y pentest sin brechas; quedan CSP `unsafe-inline`, rate limit en memoria y ausencia de MFA/WAF |
| Privacidad y cumplimiento | 🟡 Apto con reservas | Minimización, retención y aviso existen; falta revisión legal y `LICENSE` |
| Operación | 🔴 **No apto** | Sin TLS, proxy, firewall, backups, monitoreo ni staging; compose de desarrollo |
| Continuidad | 🟡 Parcial | Seed reproducible y docs extensas, pero sin runbook ejecutado ni restauración probada |

### 11.2 Bloqueadores P0 (antes de cualquier exposición pública)

| # | Bloqueador | Evidencia en el repositorio | Acción mínima | Esfuerzo |
|---|---|---|---|---|
| 1 | Sin TLS ni proxy inverso; `3000` y `8080` publicados | `docker-compose.yml` líneas 41–42 y 88–89 | Caddy en el host + publicar solo en `127.0.0.1` | 0,5 j |
| 2 | Sin firewall ni segmentación administrativa | No hay reglas en el repo | Firewall Proxmox + UFW; `wp-admin` por Tailscale | 0,5 j |
| 3 | Sin build inmutable | No existe `Dockerfile`; `docker-compose.prod.yml` compila al arrancar | `frontend/Dockerfile` multi-stage + imagen taggeada | 0,5 j |
| 4 | Sin backups ni restauración probada | `db_data/`, `wp_data/` sin cron | Script `mariadb-dump` + tar + cifrado + cron + prueba | 0,5 j |
| 5 | Sin monitoreo ni alertas | Solo healthchecks | Uptime Kuma o chequeo por timer + alerta | 0,25 j |
| 6 | Secretos sin rotación | `.env`, `.env.example` | Secretos con permisos `600`, rotar tokens y salts | 0,25 j |
| 7 | Licencia y créditos sin cerrar | `README.md` §Licencia, `seed/CREDITS.md` | `LICENSE`, auditoría de plantilla e imágenes | Gestión + legal |

Además, dos condiciones blandas que la institución debería decidir antes del *go-live*: **moderación de comentarios** (hoy se aprueban solos) y **accesibilidad** (sin auditoría formal).

### 11.3 Respuesta directa

**¿Está apto para subir a producción?** En su estado actual, **no** para exposición pública en Internet. Sí está apto para un **staging interno** en Proxmox accesible por Tailscale, que es de hecho el paso 1 recomendado.

**¿Cuánto falta?** Entre **3 y 5 jornadas técnicas** para cerrar los bloqueadores 1 a 6, más **1 o 2 jornadas** de verificación (pruebas de formulario, pentests, restauración y checklist) y el tiempo de trámite de dominio, DNS y aprobación legal. No hace falta desarrollo de producto: hace falta infraestructura y procedimiento.

**Condición para declarar producción.** Semáforo verde en operación (proxy, TLS, firewall), backups probados, monitoreo activo, secretos rotados, `LICENSE` definida y comentarios moderados. Con eso, el riesgo residual es el normal de un portal institucional de este tamaño.

---

## 12. Cómo subirlo a producción

> **Estado de esta sección: Propuesta.** Ninguno de los archivos de despliegue descritos existe todavía en el repositorio. Se incluyen completos para que puedan copiarse, revisarse y versionarse en la Fase 6.

### 12.1 Topología recomendada

**Decisión: Proxmox VE con una VM Debian y Caddy 2 instalado en el host (no en contenedor).**

```text
Internet
   │  80 / 443
   ▼
┌──────────────────────────── VM Debian 13 (Proxmox) ───────────────────────────┐
│  Caddy 2 (systemd)  ── TLS automático, HSTS, HTTP→HTTPS, logs                 │
│      │ 127.0.0.1:3000                          │ 127.0.0.1:8080               │
│      ▼                                          ▼                             │
│  ┌──────────────────────── Docker Compose ────────────────────────┐           │
│  │  frontend (Next.js build)   wordpress (Apache + PHP 8.5)       │           │
│  │              └──────────────► db (MariaDB, sin puerto)          │           │
│  └────────────────────────────────────────────────────────────────┘           │
│                                                                               │
│  UFW: 22 (solo Tailscale), 80, 443       Proxmox FW: 8006 (solo LAN/Tailscale) │
│  Backups: /srv/uneti/backups → NAS / otro nodo (cifrado)                      │
└───────────────────────────────────────────────────────────────────────────────┘
```

**Por qué Caddy y no Nginx.** No hay experiencia previa con Nginx en el equipo y el proyecto necesita algo que funcione el primer día. Caddy obtiene y renueva certificados de Let's Encrypt sin configuración adicional, redirige HTTP a HTTPS por defecto, se configura en un `Caddyfile` de veinte líneas y no exige módulos ni `certbot`. Nginx sigue siendo válido, pero implica gestionar certificados, `sites-enabled`, cifrados y recargas: más superficie de error para el mismo resultado.

**Por qué Caddy en el host y no en un contenedor.** Si Caddy corre en Docker, la IP remota que ve es la del *gateway* del puente, no la del cliente. Eso rompe las reglas por IP (Tailscale, `wp-admin`) y obliga a `network_mode: host` o a un sidecar. Instalado en el host, la IP real llega limpia y las reglas `remote_ip` funcionan.

| Alternativa | Cuándo elegirla | Coste |
|---|---|---|
| **Caddy en host** (recomendada) | Caso actual: una VM, pocos servicios, equipo sin experiencia en proxy | Bajo |
| Nginx Proxy Manager | Se prefiere una interfaz gráfica y certificados por clic | Medio: un contenedor más y puertos gestionados por Docker |
| Traefik | Varios servicios y despliegues frecuentes por etiquetas | Alto para este tamaño |
| Cloudflare Tunnel | CANTV no ofrece IP pública o hay CGNAT | Alto en soberanía: el tráfico pasa por un tercero |

### 12.2 Prerrequisitos

| Requisito | Valor sugerido | Nota |
|---|---|---|
| Proxmox VE | 8.x o 9.x | Con almacenamiento para snapshots |
| VM | Debian 13, 4 vCPU, 8 GB RAM, 100 GB SSD | No usar LXC para Docker |
| Dominio | `uneti.edu.ve` con `www` y `cms` | TTL 300 durante la migración |
| DNS | A/AAAA de `www` y `cms` a la IP pública | Verificar propagación antes de TLS |
| Puertos | 80 y 443 abiertos de Internet al host | 22, 3000, 8080 y 3306 cerrados |
| Docker | Engine 28.x + Compose ≥ 2.24 | `!reset`/`!override` requieren 2.24+ |
| Tailscale | Cuenta institucional, instalado en el host y en los equipos de operación | Para SSH, Proxmox UI y `wp-admin` |
| Backups | NAS, otro nodo Proxmox o disco externo | Fuera del host y cifrado |

### 12.3 Variables de entorno de producción

Nunca se versionan valores. Se listan solo los nombres y su significado, con el valor de ejemplo en el `.env.example` del repositorio.

| Variable | Producción | Consumidor |
|---|---|---|
| `COMPOSE_PROJECT_NAME` | `uneti-prod` | Compose |
| `MYSQL_ROOT_PASSWORD` / `MYSQL_PASSWORD` | Generadas con `openssl rand -base64 32` | MariaDB / WordPress |
| `MYSQL_DATABASE` / `MYSQL_USER` | `wordpress_db` / `wp_user` | MariaDB |
| `DB_DATA_DIR` / `WP_DATA_DIR` | `/srv/uneti/data/db` y `/srv/uneti/data/wp` | Compose |
| `WORDPRESS_URL` | `https://cms.dominio` | WordPress (`WP_HOME`, `WP_SITEURL`) y GraphQL |
| `SITE_URL` / `NEXT_PUBLIC_SITE_URL` | `https://www.dominio` | Next (metadatos, `robots`, `sitemap`, Origin) |
| `NEXT_PUBLIC_WP_URL` / `NEXT_PUBLIC_GRAPHQL_URL` | `https://cms.dominio` y `…/graphql` | Solo cliente, si se usara |
| `WP_INTERNAL_URL` / `WP_GRAPHQL_URL` | `http://wordpress` y `http://wordpress/graphql` | Next (servidor) |
| `WP_FORM_TOKEN` / `UNETI_FORM_TOKEN` | Mismo secreto en ambos lados | Next ⇄ WordPress |
| `UNETI_REVALIDATE_TOKEN` | Secreto distinto | `/api/revalidar` |
| `WP_FORCE_SSL` | `1` | WordPress |
| `WORDPRESS_PORT` / `FRONTEND_PORT` | `8080` / `3000` | Solo enlace a loopback |
| `MARIADB_IMAGE` / `WORDPRESS_IMAGE` / `NODE_IMAGE` | Etiquetas fijas (o digest) | Reproducibilidad |

> **Importante:** `NEXT_PUBLIC_SITE_URL` se inlinea en tiempo de build. Debe pasarse como `ARG`/`--build-arg` al construir la imagen; si solo se define en ejecución, `metadataBase`, `robots.txt` y `sitemap.xml` quedan apuntando al valor por defecto.

### 12.4 Preparación de la infraestructura

**Paso 0 — Congelar una versión.** No se despliega `develop`.

```bash
# En el repositorio local
git checkout develop && git pull
git tag -a v1.0.0-mvp -m "MVP SD-UNETI validado 2026-11-08"
git push origin v1.0.0-mvp
# Abrir PR develop → main y fusionar tras el CI
```

**Paso 1 — Crear la VM en Proxmox.** Desde la interfaz: *Create VM*, Debian 13, 4 vCPU, 8 GB, disco 100 GB en el almacenamiento de mayor rendimiento, red en el puente con VLAN institucional. Instalar con SSH habilitado y sin entorno gráfico. Tomar un **snapshot** antes de instalar Docker.

**Paso 2 — Endurecer el sistema operativo.**

```bash
adduser operador && usermod -aG sudo operador
# Copiar la clave pública al nuevo usuario y deshabilitar el acceso por contraseña
sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

sudo apt update && sudo apt upgrade -y
sudo apt install -y ufw fail2ban unattended-upgrades curl ca-certificates
sudo timedatectl set-timezone America/Caracas
sudo ufw default deny incoming && sudo ufw default allow outgoing
sudo ufw allow in on tailscale0
sudo ufw allow 80/tcp && sudo ufw allow 443/tcp
sudo ufw enable
```

> El orden importa: instalar Tailscale **antes** de cerrar el puerto 22 evita perder el acceso.

**Paso 3 — Tailscale y acceso administrativo.**

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --ssh --advertise-tags=tag:uneti-prod
# Comprobar: tailscale status  y  ssh operador@<nombre-tailscale>
sudo ufw status verbose   # 22 no debe aparecer abierto al público
```

**Paso 4 — Firewall de Proxmox.** En *Datacenter → Firewall*, política de entrada `DROP`; reglas: `22` solo desde la subred de administración o Tailscale, `8006` (interfaz Proxmox) solo desde LAN/Tailscale, `80` y `443` desde cualquier origen. Aplicar también al nivel de la VM.

**Paso 5 — Docker y estructura de directorios.**

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker operador
sudo mkdir -p /srv/uneti/{app,data/db,data/wp,backups,secrets}
sudo chown -R operador:operador /srv/uneti

git clone --branch v1.0.0-mvp https://github.com/IVasquezRui/SD-UNETI.git /srv/uneti/app
cd /srv/uneti/app
cp .env.example .env && chmod 600 .env
```

### 12.5 Build inmutable del frontend

**Archivo propuesto: `frontend/Dockerfile`.** No existe hoy; el compose actual usa la imagen de Node y monta el código.

```dockerfile
# syntax=docker/dockerfile:1
FROM node:26.13.0-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:26.13.0-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:26.13.0-slim AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN groupadd --system uneti && useradd --system --gid uneti --create-home uneti
COPY --from=build --chown=uneti:uneti /app/.next ./.next
COPY --from=build --chown=uneti:uneti /app/public ./public
COPY --from=build --chown=uneti:uneti /app/package.json ./package.json
COPY --from=build --chown=uneti:uneti /app/next.config.ts ./next.config.ts
COPY --from=build --chown=uneti:uneti /app/node_modules ./node_modules
USER uneti
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["npm", "run", "start"]
```

Se copia `node_modules` completo para no depender de la resolución de TypeScript al leer `next.config.ts` en el arranque. Si se busca una imagen más pequeña, el camino es activar `output: "standalone"` en `next.config.ts` y arrancar `node server.js`; eso cambia el contrato de arranque y debe probarse en staging.

**Archivo propuesto: `deploy/compose.prod.yml`.** Se mantiene separado de `docker-compose.prod.yml` para no alterar el workflow `01-despliegue.yml`, que depende de ese override.

```yaml
name: uneti-prod

services:
  db:
    image: ${MARIADB_IMAGE}
    restart: unless-stopped
    command: ["--local-infile=0", "--skip-name-resolve"]
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MARIADB_ROOT_HOST: localhost
    volumes:
      - /srv/uneti/data/db:/var/lib/mysql
      - ../scripts/database/endurecer.sql:/docker-entrypoint-initdb.d/zz-uneti-endurecer.sql:ro
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 12
      start_period: 20s
    security_opt: ["no-new-privileges:true"]
    pids_limit: 512
    logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }

  wordpress:
    image: ${WORDPRESS_IMAGE}
    restart: unless-stopped
    depends_on:
      db: { condition: service_healthy }
    ports: ["127.0.0.1:8080:80"]
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: ${MYSQL_USER}
      WORDPRESS_DB_PASSWORD: ${MYSQL_PASSWORD}
      WORDPRESS_DB_NAME: ${MYSQL_DATABASE}
      UNETI_FORM_TOKEN: ${UNETI_FORM_TOKEN}
      WP_FORCE_SSL: "1"
      WORDPRESS_CONFIG_EXTRA: |
        define( 'WP_HOME', '${WORDPRESS_URL}' );
        define( 'WP_SITEURL', '${WORDPRESS_URL}' );
        define( 'WP_MEMORY_LIMIT', '512M' );
        define( 'DISALLOW_FILE_EDIT', true );
        define( 'DISABLE_WP_CRON', true );
        define( 'FS_METHOD', 'direct' );
        if ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && 'https' === $_SERVER['HTTP_X_FORWARDED_PROTO'] ) {
            $_SERVER['HTTPS'] = 'on';
        }
    volumes:
      - /srv/uneti/data/wp:/var/www/html
      - ../scripts/wordpress/mu-plugins:/var/www/html/wp-content/mu-plugins:ro
      - ../scripts/wordpress/apache/seguridad.conf:/etc/apache2/conf-enabled/zz-uneti-seguridad.conf:ro
      - ../scripts/wordpress/php/seguridad.ini:/usr/local/etc/php/conf.d/zz-uneti-seguridad.ini:ro
      - ../wp_content/plugins/wp-graphql:/var/www/html/wp-content/plugins/wp-graphql:ro
      - ../scripts/wordpress:/opt/uneti-scripts:ro
    healthcheck:
      test: ["CMD-SHELL", "curl -fsS http://127.0.0.1/wp-login.php > /dev/null || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 10
      start_period: 40s
    security_opt: ["no-new-privileges:true"]
    pids_limit: 512
    logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }

  frontend:
    build:
      context: ../frontend
      args:
        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
    image: uneti-frontend:${UNETI_VERSION:-v1.0.0-mvp}
    restart: unless-stopped
    depends_on:
      wordpress: { condition: service_started }
    ports: ["127.0.0.1:3000:3000"]
    environment:
      NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
      WP_INTERNAL_URL: http://wordpress
      WP_GRAPHQL_URL: http://wordpress/graphql
      WP_FORM_TOKEN: ${UNETI_FORM_TOKEN}
      UNETI_REVALIDATE_TOKEN: ${UNETI_REVALIDATE_TOKEN}
    security_opt: ["no-new-privileges:true"]
    pids_limit: 512
    read_only: true
    tmpfs: ["/tmp", "/app/.next/cache"]
    logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }
```

Notas de diseño: no hay `container_name` (evita colisiones), la base no publica puertos, WordPress y Next escuchan solo en loopback, los volúmenes son rutas absolutas en `/srv/uneti/data` y cada servicio rota sus logs. El `read_only` del frontend exige el `tmpfs` para la caché de `.next`.

### 12.6 Proxy inverso y TLS con Caddy

**Archivo propuesto: `deploy/Caddyfile`.**

```caddyfile
{
    email admin@uneti.edu.ve
    admin off
}

uneti.edu.ve {
    redir https://www.uneti.edu.ve{uri} permanent
}

www.uneti.edu.ve {
    encode zstd gzip
    header {
        -Server
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
    reverse_proxy 127.0.0.1:3000
}

cms.uneti.edu.ve {
    encode zstd gzip
    header -Server

    # Único contenido público del CMS: las imágenes de las noticias
    @uploads path /wp-content/uploads/*
    handle @uploads {
        reverse_proxy 127.0.0.1:8080
    }

    # Administración, REST, GraphQL y activos del panel: solo por Tailscale
    @interno {
        path /wp-admin/* /wp-login.php /wp-json/* /graphql /xmlrpc.php /wp-includes/* /wp-content/plugins/* /wp-content/mu-plugins/*
        remote_ip 100.64.0.0/10
    }
    handle @interno {
        reverse_proxy 127.0.0.1:8080
    }

    # Todo lo demás del CMS no se expone
    handle {
        respond 404
    }
}
```

Este diseño aprovecha que **el navegador nunca habla con WordPress**: GraphQL y la REST de comentarios los consume Next.js por la red interna de Docker. Por eso se puede bloquear `/graphql`, `/wp-json` y `/wp-admin` al público sin romper el portal; solo quedan públicas las imágenes, que el HTML referencia por `sourceUrl`.

**Instalación y activación.**

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy

sudo cp /srv/uneti/app/deploy/Caddyfile /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
sudo journalctl -u caddy -f        # observar la emisión del certificado
curl -I https://www.uneti.edu.ve   # 200 + HSTS
```

Si el DNS aún no propaga, Caddy no podrá emitir el certificado. Probar primero con `--staging` de Let's Encrypt o dejar el DNS listo antes del corte.

### 12.7 Configuración de WordPress en producción

```bash
cd /srv/uneti/app
COMPOSE="docker compose --env-file .env -f deploy/compose.prod.yml"

$COMPOSE up -d db wordpress
$COMPOSE ps

# Rotar sales y revisar integridad del núcleo
$COMPOSE exec -T wordpress wp config shuffle-salts
$COMPOSE exec -T wordpress wp core verify-checksums

# Moderación de comentarios: no se publican sin aprobación
$COMPOSE exec -T wordpress wp option update comment_moderation 1
$COMPOSE exec -T wordpress wp option update comment_previously_approved 1
$COMPOSE exec -T wordpress wp option update default_comment_status closed

# Verificaciones de endurecimiento
$COMPOSE exec -T wordpress wp plugin list
$COMPOSE exec -T wordpress wp user list --role=administrator
$COMPOSE exec -T wordpress wp eval 'echo defined("DISALLOW_FILE_EDIT") ? "edit-off\n" : "edit-on\n";'
```

Además, en el panel (`https://cms.uneti.edu.ve/wp-admin`, accesible por Tailscale):

1. Cambiar el usuario `admin` por un nombre no adivinable y establecer una contraseña larga y única.
2. Instalar un plugin de MFA (o SSO institucional) para las cuentas administradoras.
3. Revisar que no queden plugins o temas activos innecesarios.
4. Confirmar que la moderación de comentarios está activa y que el correo de notificación funciona (o desactivarlo si no hay SMTP).
5. Verificar que la zona horaria y el formato de fecha coinciden con `America/Caracas`.

**Cron del sistema.** El compose define `DISABLE_WP_CRON=true`; sin un cron externo, la retención de 365 días y las tareas de WordPress no se ejecutan.

```bash
sudo tee /etc/systemd/system/uneti-wp-cron.service >/dev/null <<'EOF'
[Unit]
Description=WP-Cron de SD-UNETI
[Service]
Type=oneshot
WorkingDirectory=/srv/uneti/app
ExecStart=/usr/bin/docker compose --env-file /srv/uneti/app/.env -f deploy/compose.prod.yml exec -T wordpress wp cron event run --due-now
EOF

sudo tee /etc/systemd/system/uneti-wp-cron.timer >/dev/null <<'EOF'
[Unit]
Description=Ejecuta WP-Cron cada 10 minutos
[Timer]
OnCalendar=*:0/10
Persistent=true
[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now uneti-wp-cron.timer
```

### 12.8 Primera carga de contenido y verificación

```bash
cd /srv/uneti/app
COMPOSE="docker compose --env-file .env -f deploy/compose.prod.yml"

$COMPOSE up -d
$COMPOSE ps                       # los 3 servicios deben quedar healthy

# El proyecto se siembra con las APIs nativas de WordPress
python3 scripts/seed/seed.py bootstrap --project uneti-prod --service wordpress
python3 scripts/seed/seed.py verify   --project uneti-prod --service wordpress
```

> `seed.py` invoca `docker compose -p <proyecto>`, por lo que el nombre del proyecto del compose de producción (`name: uneti-prod`) debe coincidir con `COMPOSE_PROJECT_NAME` y con el `--project` que se pase. El script localiza el contenedor por etiqueta de proyecto y servicio, no por archivo compose.

Verificación funcional desde el host:

```bash
for r in / /nosotros /carreras /carreras/pnf-informatica /posgrados /cursos \
         /admisiones /contacto /noticias /noticias/uneti-abre-convocatoria-admision-2026 /privacidad; do
  printf '%-60s %s\n' "$r" "$(curl -s -o /dev/null -w '%{http_code}' https://www.uneti.edu.ve$r)"
done

curl -s https://www.uneti.edu.ve/api/noticias | head -c 200
curl -sI https://www.uneti.edu.ve | grep -Ei 'strict-transport|content-security|x-frame'
curl -s -o /dev/null -w '%{http_code}\n' https://cms.uneti.edu.ve/wp-admin/   # 404 desde fuera de Tailscale
```

Después, con el stack arriba y desde el repositorio:

```bash
bash scripts/ci/qa-frontend.sh https://www.uneti.edu.ve
node scripts/ci/probar-formulario.mjs        # ajustar BASE_URL al dominio real
bash scripts/ci/pentest-nextjs.sh https://www.uneti.edu.ve
bash scripts/ci/pentest-wordpress.sh         # requiere acceso al CMS
```

### 12.9 Endurecimiento de MariaDB

```bash
COMPOSE="docker compose --env-file .env -f deploy/compose.prod.yml"

# Sin usuarios anónimos
$COMPOSE exec -T db mariadb -uroot -p"$MYSQL_ROOT_PASSWORD" -e \
  "SELECT User, Host FROM mysql.user WHERE User='';"

# Privilegios efectivos del usuario de WordPress
$COMPOSE exec -T db mariadb -uroot -p"$MYSQL_ROOT_PASSWORD" -e \
  "SHOW GRANTS FOR 'wp_user'@'%';"

# local_infile debe estar OFF
$COMPOSE exec -T db mariadb -uroot -p"$MYSQL_ROOT_PASSWORD" -e \
  "SHOW VARIABLES LIKE 'local_infile';"

# El puerto 3306 no debe estar publicado
sudo ss -ltnp | grep 3306 || echo "3306 no expuesto"
```

`wp_user` debe tener permisos solo sobre `wordpress_db` (sin `FILE`, `SUPER` ni `GRANT OPTION`). El script `scripts/database/endurecer.sql` ya se aplica en la primera inicialización del volumen; si el volumen se creó antes de añadirlo, hay que ejecutarlo a mano una vez.

### 12.10 Backups y restauración

**Archivo propuesto: `deploy/backup.sh`.**

```bash
#!/usr/bin/env bash
set -euo pipefail

RAIZ=/srv/uneti
FECHA=$(date +%F-%H%M)
DESTINO="$RAIZ/backups"
COMPOSE=(docker compose --env-file "$RAIZ/app/.env" -f "$RAIZ/app/deploy/compose.prod.yml")
source "$RAIZ/secrets/backup.env"   # MYSQL_ROOT_PASSWORD, AGE_RECIPIENT

mkdir -p "$DESTINO"

"${COMPOSE[@]}" exec -T db sh -c \
  'exec mariadb-dump --single-transaction --quick --routines --triggers \
   -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' \
  | gzip -9 > "$DESTINO/db-$FECHA.sql.gz"

tar -C "$RAIZ/data" -czf "$DESTINO/wp-$FECHA.tar.gz" wp

age -r "$AGE_RECIPIENT" -o "$DESTINO/db-$FECHA.sql.gz.age" "$DESTINO/db-$FECHA.sql.gz"
age -r "$AGE_RECIPIENT" -o "$DESTINO/wp-$FECHA.tar.gz.age"  "$DESTINO/wp-$FECHA.tar.gz"
rm -f "$DESTINO/db-$FECHA.sql.gz" "$DESTINO/wp-$FECHA.tar.gz"

# Retención: 14 diarios, 8 semanales, 12 mensuales (simplificada)
find "$DESTINO" -name '*.age' -mtime +14 -delete

# Copia fuera del host (NAS u otro nodo)
rsync -a --delete "$DESTINO/" backup@nas.uneti.local:/backups/sd-uneti/
```

Programación y prueba:

```bash
chmod 700 /srv/uneti/app/deploy/backup.sh
sudo crontab -e
# 30 3 * * * /srv/uneti/app/deploy/backup.sh >> /var/log/uneti-backup.log 2>&1

# Prueba de restauración (trimestral, en staging)
age -d -i /root/age.key -o /tmp/db.sql.gz /srv/uneti/backups/db-2026-11-10-0330.sql.gz.age
gunzip -c /tmp/db.sql.gz | docker compose --env-file .env -f deploy/compose.prod.yml \
  exec -T db mariadb -uroot -p"$MYSQL_ROOT_PASSWORD" wordpress_db
```

Un backup que no se restaura no es un backup: la prueba debe quedar registrada con fecha, responsable y resultado.

### 12.11 Monitoreo, alertas y logs

**Mínimo viable (recomendado para el arranque):**

```bash
# Un contenedor de monitoreo fuera del proyecto principal
docker run -d --name uptime-kuma --restart unless-stopped \
  -p 127.0.0.1:3001:3001 -v /srv/uneti/uptime:/app/data louislam/uptime-kuma:1
```

Con Caddy publicando `status.uneti.edu.ve` solo por Tailscale, se configuran cuatro monitores:

| Monitor | Tipo | Umbral |
|---|---|---|
| `https://www.uneti.edu.ve/` | HTTP | 200 en menos de 2 s |
| `https://www.uneti.edu.ve/api/noticias` | HTTP con palabra clave | 200 y `"noticias"` |
| `https://cms.uneti.edu.ve/wp-content/uploads/` | HTTP | 200 en un archivo conocido |
| Certificado TLS | HTTPS | Aviso a 14 días de expirar |

Alertas por correo institucional y por Telegram. Complementos:

- **Healthchecks de Docker**: `docker compose ps` debe mostrar `healthy`; un `restart: unless-stopped` recupera caídas simples, pero no avisa.
- **Logs**: cada servicio rota con `json-file` a 10 MB × 3. Caddy escribe en `journald`. Revisión semanal de `docker compose logs --since 24h` y `journalctl -u caddy`.
- **Disco**: alerta al 80 %. MariaDB y `wp_data` crecen; un disco lleno tumba el portal.
- **`fail2ban`**: vigilar `/var/log/auth.log` y los intentos de login del CMS.

### 12.12 Go-live, rollback y post-lanzamiento

**Checklist de salida (firmable).**

- [ ] DNS de `www` y `cms` resuelve a la IP correcta (A y AAAA).
- [ ] Certificado emitido y renovación automática verificada.
- [ ] HTTP redirige a HTTPS y HSTS presente.
- [ ] `3000`, `8080`, `3306` y `8006` no accesibles desde Internet.
- [ ] `wp-admin` responde 404 desde fuera de Tailscale.
- [ ] Las once rutas responden 200 y `/news` responde 301.
- [ ] Las imágenes de noticias cargan desde `cms`.
- [ ] Los tres formularios crean folio y se ven en `wp-admin`.
- [ ] Los comentarios quedan pendientes de aprobación.
- [ ] `robots.txt`, `sitemap.xml`, `security.txt` y `/privacidad` publicados.
- [ ] Backup ejecutado y restauración probada en staging.
- [ ] Monitoreo verde y alertas de prueba recibidas.
- [ ] `LICENSE` decidida y créditos de imágenes completos.
- [ ] Acta de aceptación con responsable y fecha.

**Rollback.**

1. **Solo frontend:** `docker compose ... up -d --no-deps frontend` con `UNETI_VERSION` apuntando a la imagen anterior. Es la operación más frecuente y no toca datos.
2. **Contenido:** restaurar el `wp_data` y el dump previos; el código no cambia.
3. **Todo:** restaurar el snapshot de la VM tomado antes del despliegue.
4. **DNS:** si el problema es de origen, bajar el TTL a 60 s antes del corte permite revertir en minutos.

**Post-lanzamiento (primeros 30 días).**

- Rotar todos los secretos que hayan existido en `.env` de desarrollo.
- Ejecutar WPScan, Nuclei y los tres pentests contra el dominio real.
- Revisar `wp-admin` y los logs de acceso en busca de fuerza bruta.
- Medir Lighthouse móvil y registrar la línea base.
- Programar la primera prueba de restauración y la revisión de accesibilidad.
- Congelar cambios de infraestructura durante la primera semana salvo incidentes.

### 12.13 Puertos y errores a evitar

| Puerto | Servicio | Exposición correcta |
|---|---|---|
| `22` | SSH | Solo Tailscale o VLAN de administración |
| `80` | Caddy (redirección) | Internet |
| `443` | Caddy (TLS) | Internet |
| `3000` | Next.js | `127.0.0.1` |
| `8080` | WordPress | `127.0.0.1` |
| `3306` | MariaDB | Sin publicar |
| `8006` | Proxmox VE | LAN/Tailscale |
| `3001` | Uptime Kuma (opcional) | Tailscale |

**Errores que este runbook evita deliberadamente:**

- Desplegar `develop` en lugar de una etiqueta.
- Levantar `docker compose up` con el compose de desarrollo y dejar `next dev` en producción.
- Publicar `8080` «para probar» y olvidarlo.
- Olvidar `NEXT_PUBLIC_SITE_URL` en el build y publicar `sitemap.xml` con `localhost`.
- Configurar `WP_HOME` con `http://` detrás de TLS (bucles de redirección).
- Activar `DISABLE_WP_CRON` sin cron del sistema.
- Confiar en un backup que nunca se restauró.

---

## 13. Resumen y conclusión

### 13.1 Qué se construyó

SD-UNETI pasó de una plantilla estática y una propuesta de tema WordPress con Elementor a una plataforma headless completa: Next.js 16 con App Router y React 19 renderiza once rutas en español; WordPress administra noticias, medios, comentarios y solicitudes; MariaDB concentra la persistencia; y un conjunto de scripts en Python y PHP reconstruye el sitio entero desde fixtures versionados, sin dumps SQL ni archivos locales.

El proyecto resolvió además tres problemas que suelen quedar abiertos en un MVP: la **reproducibilidad** (seed idempotente con checksums y adopción por slug), la **seguridad de aplicación** (CSP, tokens en tiempo constante, rate limiting, honeypot, anti-enumeración, retención de datos) y la **documentación operativa** (planes por fecha, QA con evidencias, ADR y un grafo de navegación para agentes).

### 13.2 Qué tan maduro es

La madurez no es homogénea. En producto y en código, el proyecto está por encima de un MVP típico: tipado estricto, tres dependencias de ejecución, build reproducible, QA funcional automatizado y pentests propios. En operación, está en el punto de partida: no hay proxy, ni TLS, ni firewall, ni backups, ni monitoreo, y el compose que existe es de desarrollo.

Esa asimetría es la conclusión central del informe: **el riesgo del proyecto hoy no está en el código, está en la infraestructura**. Publicar con el compose actual expondría WordPress y Next directamente a Internet, sin cifrado y sin respaldo, lo que convertiría un producto sólido en un incidente esperando ocurrir.

### 13.3 Recomendación

1. **No publicar todavía.** Cerrar los seis bloqueadores técnicos de §11.2 y la definición de licencia.
2. **Habilitar staging primero.** La misma topología de §12, accesible solo por Tailscale, permite validar proxy, TLS, backups y formularios sin exposición pública.
3. **Publicar después, con etiqueta.** Desplegar `v1.0.0-mvp` (no `develop`), con el checklist de §12.12 firmado y el monitoreo en verde.
4. **Cerrar la Fase 5 en paralelo.** Organigrama, hero y Playwright en CI no bloquean el despliegue, pero sí la calidad percibida.
5. **Planificar la siguiente fase.** E2E en CI, auditoría de accesibilidad, Lighthouse y moderación de comentarios son la deuda natural del próximo ciclo.

### 13.4 Estimación

| Bloque | Esfuerzo | Dependencias |
|---|---|---|
| Bloqueadores 1–6 de §11.2 | 3–5 jornadas | Acceso a Proxmox, dominio y DNS |
| Verificación y checklist | 1–2 jornadas | Staging operativo |
| Licencia, créditos y aprobación | Gestión + legal | Decisión institucional |
| Cierre de Fase 5 | 3–4 jornadas | Activos fotográficos y PDF del organigrama |

Con esos tiempos, el portal puede estar publicado en un horizonte de **dos a tres semanas**, siempre que el dominio y la infraestructura estén disponibles desde el inicio.

---

## 14. Anexos

### Anexo A — Inventario de archivos clave

| Ruta | Para qué sirve |
|---|---|
| `docker-compose.yml` | Stack de desarrollo: MariaDB, WordPress y Next.js |
| `docker-compose.prod.yml` | Override usado por el CI: compila y arranca el frontend |
| `.env.example` | Contrato de variables de entorno (sin valores reales) |
| `frontend/next.config.ts` | Cabeceras, redirecciones, `cacheLife` e imágenes remotas |
| `frontend/proxy.ts` | Bloqueo de TRACE/TRACK |
| `frontend/app/lib/wordpress.ts` | Cliente GraphQL y endpoint interno de WordPress |
| `frontend/app/lib/noticias.ts` | Mapeo de datos y perfiles de caché |
| `frontend/app/lib/solicitudes.ts` / `solicitudes-wp.ts` | Validación y envío con token de servicio |
| `frontend/app/lib/rate-limit.ts` | Rate limiting y validación de `Origin` |
| `frontend/app/lib/security.ts` | Comparación constante y límite de cuerpo |
| `scripts/seed/seed.py` | `export`, `import`, `bootstrap`, `verify`, `validate` |
| `scripts/wordpress/bootstrap.php` | Instalación de WordPress y activación de WPGraphQL |
| `scripts/wordpress/seed/importar.php` | Importación idempotente con APIs nativas |
| `scripts/wordpress/mu-plugins/uneti-solicitudes.php` | CPT, REST, folio y notificación |
| `scripts/wordpress/mu-plugins/uneti-comentarios.php` | API de comentarios |
| `scripts/wordpress/mu-plugins/uneti-seguridad.php` | Endurecimiento de WordPress |
| `scripts/wordpress/mu-plugins/uneti-privacidad.php` | Retención de 365 días y herramientas de privacidad |
| `scripts/database/endurecer.sql` | Privilegios mínimos y `local_infile=OFF` |
| `scripts/ci/*.sh`, `scripts/ci/probar-formulario.mjs` | QA funcional y pentests |
| `.github/workflows/*` | Diez workflows de calidad, despliegue de prueba y seguridad |
| `seed/manifest.json` | Conteos y versión del esquema de fixtures |

### Anexo B — Glosario

| Término | Definición |
|---|---|
| Headless | CMS que administra contenido sin renderizar el sitio público |
| CPT | *Custom Post Type* de WordPress; aquí `solicitud_uneti` |
| ISR | *Incremental Static Regeneration*: HTML estático revalidado por tiempo o evento |
| SSE | *Server-Sent Events*: canal unidireccional servidor → navegador |
| Folio | Identificador público de una solicitud (`UNETI-AAAA-NNNNNN`) |
| Seed | Conjunto de fixtures que reconstruyen el contenido |
| Idempotencia | Repetir la importación sin duplicar objetos |
| ADR | *Architecture Decision Record* |
| P0/P1/P2 | Prioridad de un riesgo o tarea |

### Anexo C — Referencias

- `SD-UNETI/README.md` — visión general, arquitectura y comandos.
- `SD-UNETI/Documents/PROGRESS.md` — estado operativo y validaciones.
- `SD-UNETI/Documents/Soberanía Digital 2026.md` — metodología, arquitectura y ADR.
- `SD-UNETI/Documents/ci-cd-2026.md` — workflows, presupuesto y pentests.
- `SD-UNETI/Documents/seguridad/2026-11-08-hardening.md` — controles y mapeo normativo.
- `SD-UNETI/Documents/doc-as-code_20102026.md` — fases 1 a 5 y diagnóstico original.
- `SD-UNETI/Documents/2026-11-05/` y `SD-UNETI/Documents/2026-11-08/` — planes, QA e informes de implementación.
- `SD-UNETI/Documents/qa-20261031.md` — auditoría headless y migración a Node 26.
- `SD-UNETI/Documents/fase-5-ui-ux-2026.md` — alcance y pendientes de la Fase 5.

### Anexo D — Historial del documento

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 10/11/2026 | Creación del informe técnico integral, veredicto de producción y runbook Proxmox + Caddy |
