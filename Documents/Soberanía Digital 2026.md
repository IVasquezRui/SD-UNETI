# Soberanía Digital 2026

**Documentación metodológica y arquitectura técnica — SD-UNETI v2.0**

> Documento de referencia del Proyecto Soberanía Digital 2026-2030 (SD-UNETI) de la Universidad Nacional Experimental de las Telecomunicaciones e Informática. Reconstruye la normativa metodológica original y la alinea con el estado verificado del MVP headless implementado en este repositorio.

## Control del documento

| Campo | Valor |
|---|---|
| Proyecto | Soberanía Digital 2026-2030 (SD-UNETI) |
| Institución | Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI) |
| Nombre del sitio | UNETI |
| Nombre destino | SD-UNETI, sin cambios respecto a la etapa anterior |
| Versión del documento | 2.0 |
| Fecha de corte | 20/10/2026 |
| Estado | MVP funcional en entorno local; no desplegado públicamente |
| Rama de integración | `main` |
| Commit de referencia | `9033cfb` |
| Repositorio | `https://github.com/IVasquezRui/SD-UNETI.git` |
| Documento base | `Documentación Metodológica_ Proyecto Soberanía Digital 2026-2030 (SD-UNETI)-1.docx` |
| Estado operativo vivo | [`PROGRESS.md`](./PROGRESS.md) |

**Alcance de esta versión.** Este documento describe la metodología, la arquitectura y los criterios de gobernanza del proyecto. No sustituye a `PROGRESS.md`, que concentra la evidencia operativa y cambia con cada hito. Tampoco declara un despliegue institucional terminado: el estado real es un MVP local validado.

**Convención de lectura.** Se distingue entre:

- **Implementado:** existe en el repositorio y fue validado.
- **Parcial:** existe una base funcional, pero falta un requisito de producción.
- **Pendiente:** no está implementado o no fue verificado.
- **Objetivo:** dirección planificada, sujeta a priorización institucional.

---

## 1. Resumen ejecutivo

SD-UNETI es el marco de ejecución técnica para modernizar la infraestructura web de la UNETI bajo una visión de autonomía operativa 2026-2030. El propósito institucional se mantiene: reducir la dependencia de servicios de terceros, centralizar la lógica en infraestructura controlada por la universidad y construir un ecosistema web mantenible, escalable y documentado.

La versión 2.0 del proyecto reemplaza la propuesta inicial de un tema WordPress con Elementor por una arquitectura **headless**: WordPress administra el contenido y Next.js renderiza el sitio público. Esta decisión permite separar responsabilidades, reducir el acoplamiento entre contenido y presentación y facilitar la evolución del frontend sin alterar el CMS.

### 1.1 Resultado entregado

El MVP local incluye:

- Frontend Next.js 16 con App Router, React 19 y TypeScript estricto.
- WordPress headless con WPGraphQL como fuente de contenido.
- MariaDB como base de datos persistente.
- Noticias dinámicas con listado, detalle, SEO, relacionadas y etiquetas.
- Actualización de noticias en vivo mediante Server-Sent Events (SSE), con polling de respaldo.
- Comentarios persistidos en la tabla nativa `wp_comments`.
- Carreras PNF con información académica completa.
- Rutas y nomenclatura en español, con redirecciones permanentes de compatibilidad.
- Entorno Docker Compose con tres servicios y datos demo idempotentes.
- Validaciones de tipos, lint, build, smoke tests HTTP y persistencia en base de datos.

### 1.2 Límites actuales

Quedan pendientes, las siguientes configuraciones/funcionalidades para un MVP puesto a punto para producción.

- despliegue en VM de Proxmox y testear como se comporta como una plataforma unificada.
   > SD-UNETI (portal web de la universidad) ---> Interacción con SISU al público ---> conexión estable entre SD-UNETI y SIS-UNETI.
- Endurecimiento de secretos, TLS, reverse proxy con un Nginx virtualizado o conterizado, backups en el mismo servidor y un servidor de respaldo, y un servicio de monitoreo.
- Moderación y protección anti-spam de comentarios.
- Persistencia y notificación de los leads del formulario de contacto.
- Pruebas E2E automatizadas.
- Auditoría de accesibilidad y medición formal de rendimiento.
- Estrategia de licencias y créditos de todos los activos de la plantilla.

### 1.3 Relación con la documentación existente

| Documento | Función | Frecuencia de actualización |
|---|---|---|
| `Soberanía Digital 2026.md` | Metodología, arquitectura, gobernanza y hoja de ruta | Por cambio metodológico o arquitectónico relevante |
| `PROGRESS.md` | Estado operativo, hitos, validaciones y deuda técnica | Después de cada hito o validación |

---

## 2. Antecedentes, propósito y continuidad

### 2.1 Documento metodológico original

El documento base define SD-UNETI como el marco de ejecución técnica para la modernización integral de la infraestructura frontend de la UNETI. Sus elementos centrales son:

- Autonomía operativa para el periodo 2026-2030.
- Ecosistema web independiente, escalable y de alto rendimiento.
- Gestión desde capacidades de cómputo propias de la institución.
- Arquitectura híbrida de CMS más microcomponentes reactivos.
- Eliminación de la dependencia de servicios de terceros.
- Normativa técnica y metodológica para el MVP.
- Estándares internacionales de ingeniería de software.
- Mantenimiento y evolución sin silos de conocimiento.

El documento original también propone objetivos SMART, una metodología Scrum + XP + ISO/IEC/IEEE 12207, un flujo de trabajo remoto sobre Proxmox y Tailscale, una arquitectura WordPress + Elementor Pro + Tailwind + React + TypeScript y estándares de documentación basados en Docs-as-Code, ADR y guía de estilo.

### 2.2 Etapa previa y versión 2.0

La versión 2.0 retoma el proyecto después de una etapa en la que participó un equipo más amplio de desarrolladores. El nombre destino **SD-UNETI se conserva**, al igual que su propósito institucional. Lo que cambia es la implementación técnica y la forma de documentar el conocimiento.

Esta versión parte de tres premisas de continuidad:

1. **El conocimiento no debe depender de personas específicas.** Las decisiones, el estado y los procedimientos quedan en el repositorio.
2. **El entorno debe ser reproducible.** Docker Compose, los scripts de siembra y las validaciones permiten reconstruir el MVP sin acceso al entorno original.
3. **La arquitectura debe reflejar el código real.** No se documenta una intención que el repositorio no pueda demostrar.

No se atribuyen nombres, responsabilidades nominales ni causas de salida a los integrantes de la etapa anterior. Tampoco se identificaron ADR formales de esa etapa dentro del repositorio; esta versión registra las decisiones vigentes y deja la base para formalizar las siguientes.

### 2.3 Qué se conserva y qué se sustituye

| Elemento | Documento original | Implementación v2.0 | Tratamiento |
|---|---|---|---|
| CMS | WordPress administrable | WordPress headless | Conservado |
| Constructor visual | Elementor Pro | No forma parte del stack implementado | Sustituido |
| Frontend | Tema WordPress + widgets React | Next.js 16 App Router + React 19 | Sustituido |
| Estilos | Tailwind CSS JIT | Template `demo-elearning` + `uneti.css`; Tailwind v4 sin preflight | Adaptado |
| Lógica dinámica | Widgets React dentro de WordPress | Server Components y hooks cliente | Evolucionado |
| Infraestructura | Proxmox local | Docker Compose local; Proxmox como destino | Transitorio |
| Trabajo remoto | Proxmox + Tailscale + VS Code Remote | Docker local; misma dirección tecnológica | Pendiente de institucionalizar |
| Documentación | Markdown, ADR y guía de estilo | `PROGRESS.md`, este documento; ADR en sección 13 | Parcial |
| Accesibilidad | Optimización progresiva post-MVP | Sin auditoría todavía | Se mantiene como objetivo |

### 2.4 Propósito de este documento

Este documento cumple cuatro funciones:

- **Normativa:** fija los principios y criterios que debe respetar el desarrollo.
- **Explicativa:** justifica las decisiones de arquitectura y sus consecuencias.
- **Operativa:** orienta la ejecución, la validación y el traspaso de conocimiento.
- **Auditable:** permite reconstruir qué se hizo, por qué y con qué evidencia.

---

## 3. Alcance y principios

### 3.1 Alcance del MVP

| Área | Incluido en el MVP |
|---|---|
| Sitio institucional | Inicio, nosotros, admisiones y contacto |
| Noticias | Listado dinámico, detalle, SEO, relacionadas y etiquetas |
| Actualización en vivo | SSE con polling de respaldo |
| Comentarios | Lectura y publicación sobre noticias abiertas |
| Carreras | Listado y detalle de los PNF en Informática y Telecomunicaciones |
| Formularios | Contacto, inscripción y becas con validación básica |
| CMS | WordPress, WPGraphQL y administración de contenido |
| Datos | MariaDB con contenido demo idempotente |
| Infraestructura | Docker Compose con MariaDB, WordPress y Next.js |
| Documentación | Estado, metodología, arquitectura y mapa técnico |

### 3.2 Fuera de alcance en esta fase

- Inscripción en línea con expediente académico.
- Pagos, pasarelas o facturación.
- gestión de cursos y lecciones.
- Despliegue público y alta institucional del dominio.
- Auditoría WCAG completa.
- Integración con CRM, SMTP o analítica institucional.
- Estrategia de backups y recuperación ante desastres.

Estos elementos pueden formar parte de la hoja de ruta, pero no deben presentarse como entregados.

### 3.3 Principios de arquitectura y gestión

1. **Soberanía tecnológica.** El contenido y la lógica institucional permanecen en infraestructura controlada por la UNETI.
2. **Separación de responsabilidades.** WordPress gestiona contenido; Next.js renderiza; MariaDB persiste.
3. **Server-first.** Se priorizan Server Components y `fetch` nativo para reducir JavaScript cliente y dependencias.
4. **Contenido desacoplado.** El sitio público no depende de un tema PHP de WordPress.
5. **Reproducibilidad.** El entorno se levanta con Docker Compose y datos de siembra.
6. **Documentación como activo.** El conocimiento vive en el repositorio, no solo en la memoria del equipo.
7. **Seguridad por diseño, con brechas explícitas.** Las carencias actuales se documentan y priorizan; no se ocultan.
8. **Accesibilidad progresiva.** Se reconoce como objetivo de calidad, no como requisito bloqueante del primer MVP.
9. **KISS y YAGNI.** Se evita complejidad y abstracción prematuras.
10. **Trazabilidad.** Cada decisión relevante debe poder explicarse y auditarse.

---

## 4. Objetivos SMART

El marco SMART del documento original se conserva como línea base. La tabla siguiente contrasta cada objetivo con la evidencia disponible en la versión 2.0. No se reescriben los objetivos como si se hubieran cumplido.

| Objetivo original | Meta original | Evidencia v2.0 | Estado |
|---|---|---|---|
| Despliegue del MVP | Landing funcional con accesos críticos en 60 días y disponibilidad en `uneti.edu.ve` | MVP funcional en `localhost`; sin dominio público | Parcial |
| Rendimiento | Más de 90/100 en móvil según PageSpeed | Sin auditoría formal registrada | Pendiente |
| Autonomía de alojamiento | 100 % de servicios en Proxmox local y traza de IP local | Docker Compose local; Proxmox no implementado en este repositorio | Parcial |
| Avance inmediato | Prototipo navegable con header y hero | MVP completo con rutas institucionales, noticias y carreras | Cumplido |
| Propuesta IPv6 | Informe de factibilidad IPv6-mostly para finales de 2026 | No existe informe en el repositorio | Pendiente |
| Accesibilidad | Optimización progresiva post-MVP, no bloqueante | Sin auditoría WCAG; formularios con labels y regiones `aria-live` básicas | Pendiente |
| Integración headless | No definida en el documento original | Next.js + WPGraphQL + MariaDB operativos | Cumplido en v2.0 |
| Noticias en vivo | No definida en el documento original | SSE validado con latencia menor a 20 segundos | Cumplido en v2.0 |
| Comentarios persistentes | No definidos en el documento original | 3 comentarios demo en `wp_comments` | Cumplido en v2.0 |
| Documentación de continuidad | Docs-as-Code y ADR | `PROGRESS.md`, este documento y `lookdown`; ADR en sección 13 | Parcial |

### 4.1 Lectura de los resultados
- El plazo de 60 días **no es verificable**: el documento original no registra fecha de inicio.
- La disponibilidad pública no se alcanzó; el entorno validado es local.
- El objetivo de rendimiento sigue siendo válido, pero requiere medición con Lighthouse o PageSpeed antes de afirmar cumplimiento.
- La autonomía de alojamiento avanzó con Docker, pero no equivale a Proxmox ni a una traza de IP institucional.
- La accesibilidad se mantiene como objetivo progresivo, tal como establecía el documento original.
- Los objetivos nuevos de la v2.0 responden al alcance realmente implementado y quedan separados de los originales.

### 4.2 Métricas de éxito para la siguiente fase

| Dimensión | Métrica propuesta | Evidencia esperada |
|---|---|---|
| Disponibilidad | HTTPS público con respuesta 200 en rutas críticas | Smoke test en dominio institucional |
| Rendimiento | Lighthouse móvil ≥ 90 | Reporte adjunto a `PROGRESS.md` |
| Accesibilidad | Sin errores críticos en axe; revisión manual de teclado y foco | Informe de auditoría |
| Calidad | `tsc`, lint y build sin errores | Salida de comandos en CI |
| Regresión | Rutas principales y redirecciones cubiertas por E2E | Reporte Playwright |
| Seguridad | Secretos fuera del repositorio y credenciales rotadas | Checklist de seguridad |
| Operación | Backup y restauración probados | Acta de prueba |
| Contenido | Flujo editorial y moderación definidos | Procedimiento documentado |

---

## 5. Marco metodológico

### 5.1 Base metodológica

La gestión del proyecto adopta una hibridación de Scrum para la organización del trabajo y Programación Extrema (XP) para la calidad del código, alineada con la norma ISO/IEC/IEEE 12207 referida en el documento base. La edición exacta de la norma debe verificarse antes de una auditoría formal; este documento la conserva como referencia metodológica heredada.

| Práctica | Aplicación en SD-UNETI |
|---|---|
| Scrum | Backlog priorizado, iteraciones cortas, demo y revisión al cierre |
| XP | Simplicidad, feedback rápido, código limpio y validaciones automatizadas |
| ISO/IEC/IEEE 12207 | Ciclo de vida, verificación, validación, mantenimiento y trazabilidad |
| Docs-as-Code | Documentación versionada junto al código |
| ADR | Registro de decisiones arquitectónicas y sus consecuencias |
| Feature Branching | Rama `main` estable, rama `develop` para integración de versiones para pruebas y ramas cortas por funcionalidad |

### 5.2 Ciclo de trabajo

1. **Descubrimiento:** identificar necesidad, alcance, rutas, datos y restricciones.
2. **Diseño:** definir contrato de datos, impacto arquitectónico y criterios de aceptación.
3. **Implementación:** desarrollar en una rama corta con commits atómicos.
4. **Validación:** ejecutar tipos, lint, build, smoke tests y pruebas manuales.
5. **Documentación:** crear la siguiente fase de un nuevo archivo `PROGRESS2.md` y ADR cuando corresponda.
6. **Revisión:** verificar regresiones, seguridad, accesibilidad y coherencia con el template.
7. **Cierre:** integrar a `develop`, testear, registrar evidencia y actualizar la hoja de ruta, y subir a rama principal la version estable.

### 5.3 Roles funcionales

Los roles se definen por función, no por persona. En la etapa actual una misma persona puede cubrir varios roles.

| Rol | Responsabilidad principal |
|---|---|
| Coordinación de producto | Priorizar alcance, validar necesidades institucionales y aprobar entregables |
| Arquitectura y liderazgo técnico | Definir stack, revisar decisiones, cuidar deuda técnica y estándares |
| Desarrollo frontend | Rutas, componentes, estilos, accesibilidad y consumo de datos |
| Desarrollo backend/CMS | WordPress, WPGraphQL, REST, datos y scripts operativos |
| Operaciones | Docker, red, despliegue, backups, TLS y monitoreo |
| Contenido y comunicaciones | Noticias, carreras, textos institucionales y moderación |
| Seguridad y privacidad | Secretos, validación de entradas, PII, licencias y cumplimiento |

### 5.4 Planificación y priorización

El backlog se ordena por:

1. Valor institucional.
2. Riesgo de seguridad o privacidad.
3. Dependencia técnica.
4. Impacto en la experiencia del usuario.
5. Esfuerzo y capacidad disponible.

Cada iteración debe producir un incremento verificable. No se considera terminada una tarea solo porque el código exista: debe estar integrada, validada y documentada.

### 5.5 Flujo de Git

- `main` es la rama de integración y debe permanecer estable.
- Cada cambio se desarrolla en una rama corta y descriptiva (Feature Branching).
- Los commits son atómicos y usan mensajes imperativos.
- Se recomienda revisión por pares antes de integrar cambios arquitectónicos.
- No se versionan secretos, credenciales, volúmenes de datos ni artefactos generados.
- Los cambios estructurales deben regenerar `lookdown/`.

### 5.6 Definición de Ready y Done

**Definition of Ready**

- Necesidad y alcance comprendidos.
- Rutas, componentes y fuente de datos identificados.
- Criterios de aceptación escritos.
- Impacto de seguridad, privacidad y accesibilidad evaluado.
- Dependencias y riesgos conocidos.

**Definition of Done**

- Código implementado y tipado.
- `bunx tsc --noEmit` sin errores.
- `bun run lint` sin errores nuevos.
- `bun run build` exitoso.
- Smoke tests de las rutas afectadas.
- Persistencia o contrato de datos verificado cuando aplica.
- Documentación y ADR actualizados.
- `lookdown` regenerado si cambió la estructura.
- Sin secretos ni credenciales en el diff.
- Revisión responsive y de accesibilidad básica.

### 5.7 Trabajo remoto y entorno institucional

El documento original propone acceso SSH a contenedores aislados en Proxmox, VS Code Remote Development y una red privada mesh con Tailscale. Esa dirección se mantiene como objetivo de despliegue institucional. El estado actual usa Docker Compose en el entorno local y no debe describirse como si ya estuviera sobre Proxmox.

Criterios de salida para la etapa Proxmox/Tailscale:

- Contenedores o máquinas virtuales reproducibles.
- Acceso remoto seguro sin transferencias SFTP manuales.
- Variables y secretos fuera del repositorio.
- Reverse proxy, TLS y backups definidos.
- Prueba de restauración documentada.
- Trazabilidad de IP y persistencia verificadas.

---

## 6. Arquitectura de referencia

### 6.1 Principios aplicados

- **Headless:** WordPress no renderiza el sitio público; expone contenido por WPGraphQL y una API REST propia para comentarios.
- **Una sola capa de presentación:** Next.js es responsable de HTML, metadatos, rutas, estilos y experiencia de usuario.
- **Server-first:** las páginas y el detalle de noticias se resuelven con Server Components; el JavaScript cliente se reserva para interacción, formularios, comentarios y SSE.
- **`fetch` nativo:** no se introducen clientes GraphQL pesados ni Axios.
- **Persistencia nativa:** los comentarios usan `wp_comments` en lugar de una tabla paralela.
- **Contenido académico estático en el MVP:** las carreras viven en TypeScript para no sobredimensionar el CMS antes de definir un modelo editorial.
- **Recarga completa deliberada:** la navegación interna usa `<a>` para reinicializar el runtime jQuery del template y evitar errores de hidratación.
- **SSE con respaldo:** actualización en vivo sin WebSockets ni infraestructura adicional; polling cada 30 segundos si `EventSource` falla.

### 6.2 Diagrama de contexto

```text
Navegador
   │
   ├── HTML / SSE ──────────────► Next.js :3000
   │                                  │
   │                                  ├── WPGraphQL ─────► WordPress :8080
   │                                  │                      │
   │                                  ├── REST comentarios ──┤
   │                                  │                      ▼
   │                                  └── API contacto ──► logs (temporal)
   │
   └──────────────────────────────────────────────────► MariaDB :3306
```

Next.js es la única capa pública. WordPress actúa como CMS, fuente de noticias y almacén de comentarios. MariaDB conserva contenido, metadatos y comentarios. El formulario de contacto todavía no persiste datos: registra el lead en los logs del contenedor.

### 6.3 Componentes y versiones

| Capa | Tecnología | Versión verificada | Función |
|---|---|---|---|
| Frontend | Next.js | `16.4.2` | Render, rutas, API interna y SSE |
| UI | React | `19.3.0` | Componentes de servidor y cliente |
| Runtime | Bun | `1.4.3` | Instalación y ejecución del frontend |
| Lenguaje | TypeScript | `^5` | Tipado estricto |
| Estilos | Template `demo-elearning` + `uneti.css` | Template + CSS propio | Base visual institucional |
| Utilidades CSS | Tailwind CSS | `^4` | Tema y utilidades sin preflight |
| CMS | WordPress | `7.1.3` | Administración de contenido |
| API de contenido | WPGraphQL | `2.24.2` | Consultas GraphQL |
| Base de datos | MariaDB | `11.4.13` | Persistencia |
| Infraestructura | Docker Compose | 3 servicios | Orquestación local |

### 6.4 Flujos de datos

**Contenido institucional y noticias**

1. El editor publica o actualiza contenido en WordPress.
2. Next.js consulta WPGraphQL desde el servidor.
3. El mapeo normaliza la respuesta al modelo `Noticia`.
4. El Server Component renderiza HTML y metadatos.
5. La caché ISR revalida el listado cada 15 segundos y el detalle cada 30 segundos.

**Comentarios**

1. El cliente envía nombre, correo opcional y contenido al proxy Next.js.
2. El proxy valida y reenvía a la API REST del mu-plugin.
3. WordPress valida la noticia, el estado de comentarios y sanitiza los campos.
4. El comentario se inserta en `wp_comments`.
5. El listado se refresca de forma inmediata y periódica.

**Actualización en vivo**

1. El cliente abre `/api/noticias/stream`.
2. La ruta SSE consulta WPGraphQL sin caché.
3. Se calcula un hash del contenido relevante.
4. Si cambia, se envía un evento al navegador.
5. Si `EventSource` falla, el hook activa polling cada 30 segundos.

**Contacto**

1. El formulario envía un JSON a `/api/contacto`.
2. La API valida correo y nombre.
3. El lead se registra en los logs del contenedor.
4. Persistencia, correo o CRM: pendiente.

### 6.5 Estrategia de caché y renderizado

| Recurso | Estrategia | Revalidación |
|---|---|---|
| Listado de noticias | Server Component + ISR | 15 segundos |
| Detalle de noticia | Server Component + ISR | 30 segundos |
| Noticias conocidas | `generateStaticParams` | Según build y revalidación |
| `/api/noticias` | Route Handler sin caché | `no-store` |
| `/api/noticias/stream` | SSE sin caché | `no-store` |
| Comentarios | Proxy sin caché | `no-store` |
| Carreras | Contenido estático en TypeScript | Cambios por despliegue |

`cacheComponents` y `partialPrefetching` están habilitados en `next.config.ts` para combinar shells estáticos con datos dinámicos. La caché SSE se mantiene en memoria por conexión; si se escala horizontalmente, se requerirá pub/sub.

### 6.6 Topología actual y topología objetivo

| Dimensión | Actual | Objetivo institucional |
|---|---|---|
| Orquestación | Docker Compose local | Proxmox con contenedores o VM reproducibles |
| Acceso remoto | Entorno local | Tailscale + SSH + VS Code Remote |
| Publicación | `localhost:3000` y `localhost:8080` | Dominio `uneti.edu.ve` con HTTPS |
| Red | `frontend_net` bridge | Segmentación, firewall y reverse proxy |
| Persistencia | Volúmenes `db_data` y `wp_data` | Almacenamiento respaldado y política de retención |
| Observabilidad | Logs de contenedor | Métricas, alertas y trazas |
| Backups | No implementados | Respaldo y restauración probados |
| Secretos | Variables en Compose | `.env` institucional o Docker secrets |

La topología objetivo no debe confundirse con el estado actual. La migración requiere una fase de endurecimiento y una prueba de despliegue.

### 6.7 Capa de estilos y compatibilidad con el template

La base visual proviene del template `demo-elearning`, cargado en el mismo orden de cascada que el HTML original:

1. `vendors.min.css`
2. `icon.min.css`
3. `style.css`
4. `responsive.css`
5. `elearning.css`
6. `uneti.css`

Tailwind v4 se usa sin preflight: se importan `theme.css` y `utilities.css`, pero la base visual la aporta el template. Esto evita que las utilidades de Tailwind sobrescriban estilos institucionales.

Decisiones de compatibilidad:

- Los assets se sirven desde `frontend/public/assets`.
- Los scripts del template se inicializan mediante `ScriptsPlantilla`.
- La navegación interna usa `<a>` para forzar recarga completa y reinicializar swipers, partículas y contadores.
- No se migra `<img>` a `next/image` mientras el template dependa de atributos como `data-at2x` y de su propio comportamiento de carga.
- Los IDs de partículas son únicos por página para evitar colisiones.
- El hero usa una sola capa visual con `banner_bg.png` y degradado; se eliminó la imagen duplicada.

### 6.8 Límites de confianza

| Límite | Consideración |
|---|---|
| Navegador → Next.js | Entradas de formularios y comentarios no confiables |
| Next.js → WordPress | Red interna Docker; no expuesta al navegador para REST |
| WordPress → MariaDB | Credenciales de desarrollo en Compose; deben externalizarse |
| WordPress → Internet | Administración local sin TLS ni restricción de red en el MVP |
| Activos estáticos | Plantilla, imágenes y librerías de terceros; licencias por verificar |
| Logs de contacto | Contienen PII; requieren retención y acceso controlado |

### 6.9 Estructura relevante del repositorio

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
└── Documents/
    ├── PROGRESS.md
    └── Soberanía Digital 2026.md
```

`wp_content/` es una copia de referencia versionada. El WordPress en ejecución usa `wp_data/`, que no se publica por contener datos y archivos volátiles.

---

## 7. Rutas, contratos y datos

### 7.1 Rutas públicas

| Ruta | Función | Fuente de datos |
|---|---|---|
| `/` | Inicio institucional | Contenido local y componentes |
| `/nosotros` | Misión, visión, valores e hitos | Contenido local |
| `/admisiones` | Proceso, requisitos, becas y formularios | Contenido local |
| `/contacto` | Canales de atención, ubicación y formulario | Contenido local + `/api/contacto` |
| `/noticias` | Listado dinámico | WPGraphQL + `/api/noticias/stream` |
| `/noticias/[slug]` | Detalle, relacionadas y comentarios | WPGraphQL + API de comentarios |
| `/carreras` | Oferta académica PNF | TypeScript |
| `/carreras/[slug]` | Detalle del PNF | TypeScript |

### 7.2 Redirecciones permanentes

| Origen | Destino | Código |
|---|---|---|
| `/about` | `/nosotros` | 301 |
| `/admissions` | `/admisiones` | 301 |
| `/contact` | `/contacto` | 301 |
| `/api/contact` | `/api/contacto` | 301 |
| `/news` | `/noticias` | 301 |
| `/news/:slug*` | `/noticias/:slug*` | 301 |
| `/courses` | `/carreras` | 301 |
| `/courses/:slug*` | `/carreras/:slug*` | 301 |

Las redirecciones preservan enlaces heredados y evitan rupturas de SEO durante la migración.

### 7.3 Endpoints

| Tipo | Recurso | Consumidor | Persistencia |
|---|---|---|---|
| GraphQL | `posts`, `post`, `featuredImage`, `categories`, `tags`, `author` | Server Components | WordPress/MariaDB |
| SSE | `/api/noticias/stream` | `useNoticiasEnVivo` | Consulta WPGraphQL |
| JSON | `/api/noticias` | Polling de respaldo | WPGraphQL |
| JSON | `/api/noticias/[slug]/comentarios` | Listado y publicación | Proxy a WordPress |
| REST WordPress | `/wp-json/uneti/v1/comentarios/{slug}` | Proxy Next.js | `wp_comments` |
| JSON | `/api/contacto` | Formularios institucionales | Logs temporales |

### 7.4 Modelos principales

| Modelo | Campos relevantes | Uso |
|---|---|---|
| `Noticia` | `slug`, `titulo`, `resumen`, `contenidoHtml`, `categoria`, `etiquetas`, `fecha`, `fechaISO`, `tiempoLectura`, `comentarios`, `comentariosAbiertos`, `imagen`, `imagenAlt`, `autor` | Listado y detalle |
| `ResumenNoticia` | `slug`, `titulo`, `fecha`, `comentarios` | Stream SSE |
| `Comentario` | `nombre`, `contenido`, `fecha`, `avatar` | Sección de comentarios |
| `Carrera` | `slug`, `nombre`, `codigo`, `lema`, `resumen`, `descripcion`, `portada`, `galeria`, `fundamentacion`, `mision`, `vision`, perfiles, competencias, campo laboral, trayectos, laboratorios, salidas, FAQs | Listado y detalle PNF |
| `LeadPayload` | `type`, `name`, `email`, `phone`, `subject`, `message` | Formularios de contacto, inscripción y beca |

### 7.5 Reglas de validación

**Comentarios**

- Nombre mínimo de 2 caracteres.
- Contenido entre 3 y 2000 caracteres.
- Correo opcional con validación de formato.
- Noticia inexistente o no publicada: HTTP 404.
- Comentarios cerrados: HTTP 403.
- Sanitización con `sanitize_text_field`, `sanitize_email` y `sanitize_textarea_field`.
- Renderizado como texto plano con `white-space: pre-line`; no se interpreta HTML.
- Los comentarios se insertan aprobados en el flujo demo del MVP. La moderación previa es una brecha pendiente.

**Contacto**

- Correo obligatorio y con formato válido.
- Nombre obligatorio para formularios distintos de newsletter.
- El resto de campos se registra si está presente.
- Persistencia, notificación y consentimiento explícito: pendientes.

### 7.6 SEO y metadatos

- `metadataBase`, título y descripción institucional en el layout.
- Metadatos y Open Graph por noticia.
- `generateStaticParams` para noticias conocidas.
- Rutas en español y redirecciones 301.
- Imágenes con texto alternativo cuando el CMS lo proporciona.
- Pendientes: `sitemap.xml`, `robots.txt`, canonical explícito y auditoría de datos estructurados.

### 7.7 Gestión de contenido

- WordPress es la fuente de verdad para noticias y comentarios.
- Los borradores no se publican en el frontend.
- Las imágenes originales se versionan en `seed/media/AAAA/MM/`; WordPress genera las variantes en `wp_data/wp-content/uploads/`.
- El seed es idempotente: busca por `_uneti_seed_key`, adopta por slug/archivo/autor+contenido y evita duplicados.
- `seed/` contiene sitio, taxonomías, media, noticias y comentarios en JSON.
- En una instalación nueva, `python3 scripts/seed/seed.py bootstrap` instala WordPress, activa WPGraphQL, importa y verifica.

---

## 8. Calidad, seguridad y accesibilidad

### 8.1 Puertas de calidad

| Puerta | Herramienta o evidencia | Estado |
|---|---|---|
| Tipado estricto | `bunx tsc --noEmit` | Sin errores |
| Lint | `bun run lint` | 0 errores; 6 advertencias por CSS manual del template |
| Build | `bun run build` | Exitoso; 22 rutas prerenderizadas |
| Configuración Docker | `docker compose config` | Válida |
| Rutas críticas | Smoke tests HTTP | 200 |
| Redirecciones | Smoke tests HTTP | 301 |
| Persistencia | Consulta a MariaDB | Verificada |
| SSE | Publicación de prueba | Visible en menos de 20 segundos |
| E2E | Playwright | Pendiente |
| Accesibilidad | axe / revisión manual | Pendiente |
| Rendimiento | Lighthouse / PageSpeed | Pendiente |

### 8.2 Estrategia de pruebas

**Implementado**

- Tipos, lint y build como validación estática.
- Smoke tests manuales o por `curl` de rutas y redirecciones.
- Verificación de respuestas JSON de noticias y comentarios.
- Verificación de persistencia en `wp_comments`.
- Prueba funcional de publicación y propagación por SSE.
- Workflow de GitHub Actions que valida fixtures, ejecuta `bootstrap`, comprueba idempotencia y construye el frontend.

**Pendiente**

- Pruebas E2E con Playwright para navegación, formularios, comentarios y SSE.
- Pruebas de contrato para WPGraphQL y REST.
- Pruebas de regresión visual del template.
- Pruebas de carga del stream SSE.
- Pruebas de restauración de backups.

### 8.3 Seguridad

**Controles presentes**

- `DISALLOW_FILE_EDIT` en WordPress.
- `WP_MEMORY_LIMIT` en 512 MB.
- WordPress no expone un tema público.
- Sanitización de comentarios en el backend.
- Validación de correo y nombre en el proxy y en la API de contacto.
- Renderizado de comentarios como texto plano.
- Variables internas separadas de las URLs públicas.
- `.clinerules`, volúmenes y artefactos generados excluidos de Git.

**Brechas conocidas**

- Credenciales de desarrollo embebidas en `docker-compose.yml`; deben migrarse a `.env` o Docker secrets.
- Existe riesgo de credenciales expuestas en el historial de Git; deben rotarse y auditarse.
- `wordpress:latest` no está fijado por digest.
- Comentarios autoaprobados, sin CAPTCHA, rate limiting ni moderación previa.
- Formulario de contacto sin persistencia segura, sin política de retención y sin consentimiento explícito.
- Sin TLS, reverse proxy ni restricción de acceso a `wp-admin` en el entorno local.
- Sin backups ni restauración probada.
- Dependencias y activos de la plantilla sin auditoría de licencias y suministro.
- Logs con PII sin política de acceso o rotación.

**Regla de seguridad documental**

Este documento no reproduce contraseñas, tokens ni valores de `.clinerules`. La existencia de secretos en configuración o historial se registra como riesgo, no como dato operativo.

### 8.4 Accesibilidad

La accesibilidad se mantiene como objetivo de optimización progresiva, tal como establece el documento original. No se declara cumplimiento WCAG.

Acciones mínimas para la siguiente fase:

- Auditoría automática con axe o Lighthouse.
- Revisión manual con teclado, foco visible y orden de tabulación.
- Contraste de color en componentes institucionales.
- Textos alternativos en imágenes y carruseles.
- Formularios con labels, mensajes de error y regiones `aria-live`.
- Respeto a `prefers-reduced-motion` en partículas, carruseles y animaciones.
- Revisión de estructura de encabezados y landmarks.
- Pruebas con lector de pantalla en rutas críticas.
- Meta: WCAG 2.2 AA como referencia de calidad post-MVP.

### 8.5 Rendimiento

**Optimizaciones presentes**

- Server Components para reducir JavaScript cliente.
- `fetch` nativo sin clientes GraphQL pesados.
- ISR para listado y detalle.
- `generateStaticParams` para noticias conocidas.
- SSE sin caché y polling de respaldo.
- Assets estáticos servidos desde `public`.
- Build con 22 tareas de generación estática.

**Pendiente**

- Medición formal en móvil con Lighthouse o PageSpeed.
- Optimización de imágenes del template y del CMS.
- Evaluación de `next/image` sin romper `data-at2x`.
- Reducción o división de CSS del template.
- Revisión de fuentes, iconos y librerías de terceros.
- Presupuesto de rendimiento y monitoreo de regresiones.

### 8.6 Privacidad y licencias

- Los formularios recolectan nombre, correo, teléfono y mensaje.
- Los comentarios recolectan nombre, correo opcional y contenido.
- Se requiere aviso de privacidad, base de consentimiento, retención y procedimiento de eliminación.
- Los logs de contacto no deben convertirse en un almacén informal de PII.
- Las imágenes de carreras tienen créditos en `CREDITS.md`; falta revisar la licencia de la plantilla y del resto de activos antes de publicar.
- La política de cookies y analítica debe definirse antes de incorporar herramientas de medición.

### 8.7 SEO técnico

- Metadatos por página y por noticia.
- Open Graph en el detalle de noticias.
- Rutas semánticas en español.
- Redirecciones 301 de rutas heredadas.
- Contenido de carreras estático y rastreable.
- Pendientes: sitemap, robots, canonical, datos estructurados y verificación en Search Console.

---

## 9. Estado de avance y validación

### 9.1 Hitos alcanzados

| Hito | Evidencia | Estado |
|---|---|---|
| Migración de la plantilla | `demo-elearning` integrada en `frontend/public/assets` | Implementado |
| Nomenclatura en español | Rutas, componentes, hooks, tipos y constantes | Implementado |
| Noticias dinámicas | Listado, detalle, SEO y relacionadas desde WPGraphQL | Implementado |
| Actualización en vivo | SSE con fallback a polling | Implementado |
| Comentarios | Persistencia en `wp_comments` y proxy Next.js | Implementado |
| Carreras PNF | Informática y Telecomunicaciones con detalle completo | Implementado |
| DevOps | Docker Compose, healthcheck y seed idempotente | Implementado |
| Documentación | `PROGRESS.md`, este documento y `lookdown` | Implementado |
| Pruebas E2E | Playwright | Pendiente |
| Producción | TLS, dominio, backups, monitoreo | Pendiente |

### 9.2 Estado del CMS y datos demo

| Elemento | Estado |
|---|---|
| WordPress | `7.1.3` |
| WPGraphQL | `2.24.2`, activo |
| MariaDB | `11.4.13`, contenedor saludable |
| Noticias publicadas | 6 |
| Comentarios demo visibles | 3, en la noticia de convocatoria 2026 |
| Posts de ejemplo | `hola-mundo` y `noticia-de-prueba-institucional` en borrador |
| Imágenes destacadas | Originales en `seed/media/2026/10/`; variantes en `wp_data/wp-content/uploads/` |
| Seed | JSON + imágenes versionadas; idempotente por `_uneti_seed_key` |
| Base inicial | Sin dump; `seed.py bootstrap` reconstruye el sitio |

### 9.3 Validación técnica ejecutada

| Verificación | Resultado |
|---|---|
| `bunx tsc --noEmit` | Sin errores |
| `bun run lint` | 0 errores; 6 advertencias por CSS manual |
| `bun run build` | Exitoso; 22 rutas prerenderizadas. El fallo previo de `/_global-error` se debía a `NODE_ENV=development` en el servicio `frontend` |
| `docker compose config` | Configuración válida |
| `seed.py validate` | 6 posts, 6 media, 3 comentarios, checksums correctos |
| `seed.py import` | Idempotente: segunda ejecución sin duplicados |
| `seed.py verify` | 6 posts, 3 comentarios, 6 imágenes HTTP 200 `image/jpeg`, GraphQL activo |
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
| Persistencia de comentario | Verificada en `wp_comments` |
| Contenedor MariaDB | `healthy` |

La noticia y el comentario temporales usados para validar el flujo fueron eliminados después de las pruebas.

### 9.4 Criterios de aceptación del MVP

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
- [x] Workflow CI de bootstrap, verificación e idempotencia.
- [ ] Pruebas E2E automatizadas.
- [ ] Endurecimiento de seguridad y despliegue productivo.

### 9.5 Instantánea y vigencia

Los valores de esta sección corresponden al corte del 20/10/2026 y al commit `9033cfb`. Para el estado más reciente, consultar [`PROGRESS.md`](./PROGRESS.md). Este documento no debe actualizarse con cada noticia o comentario nuevo; solo cuando cambie la metodología, la arquitectura o los criterios de aceptación.

---

## 10. Operación y configuración

### 10.1 Servicios

| Servicio | Contenedor | Imagen | Puerto | Función |
|---|---|---|---|---|
| Base de datos | `wp_mariadb` | `mariadb:11.4` | Interno `3306` | Persistencia |
| CMS | `wp_site` | `wordpress:latest` | `8080:80` | WordPress y WPGraphQL |
| Frontend | `next_frontend` | `oven/bun:1-alpine` | `3000:3000` | Next.js en desarrollo |

MariaDB tiene healthcheck y volumen persistente. WordPress espera a que la base esté saludable. Next.js usa la red interna `frontend_net`.

### 10.2 Variables de entorno relevantes

| Variable | Ámbito | Uso |
|---|---|---|
| `NEXT_PUBLIC_WP_URL` | Navegador | URL pública de WordPress |
| `NEXT_PUBLIC_GRAPHQL_URL` | Navegador | URL pública de GraphQL |
| `WP_INTERNAL_URL` | Servidor | URL interna para REST |
| `WP_GRAPHQL_URL` | Servidor | URL interna para GraphQL |
| `WORDPRESS_DB_*` | WordPress | Conexión a MariaDB |
| `MYSQL_*` | MariaDB | Inicialización de base y usuario |

Las variables `NEXT_PUBLIC_*` son visibles en el cliente y no deben contener secretos. Las credenciales viven en `.env` (ignorado) y `.env.example` documenta las claves; para producción deben migrarse a Docker secrets o un gestor externo.

### 10.3 Comandos operativos

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

### 10.4 Persistencia y datos

| Ruta | Contenido | Versionada |
|---|---|---|
| `db_data/` | Datos de MariaDB | No |
| `wp_data/` | Instalación WordPress, plugins, uploads | No |
| `wp_content/` | Copia de referencia de `wp-content` y WPGraphQL | Sí |
| `seed/` | Fixtures de sitio, noticias, imágenes y comentarios | Sí |
| `database/` | Solo documentación; sin dump SQL | Sí |
| `frontend/public/assets/` | Assets del template y de carreras | Sí |
| `frontend/.next/` | Build de Next.js | No |
| `frontend/node_modules/` | Dependencias instaladas | No |
| `lookdown/` | Grafo generado | No |

No se debe ejecutar `docker compose down -v` sin un respaldo: elimina los volúmenes y con ellos la base y WordPress.

### 10.5 Entornos

| Entorno | Estado | Uso |
|---|---|---|
| Local | Operativo | Desarrollo, demo y validación |
| Staging | No existe | Validación previa a producción |
| Producción | No existe | Despliegue institucional |

La creación de staging es recomendable antes de cualquier migración a Proxmox.

### 10.6 Backups y recuperación

No implementados. La estrategia mínima debe incluir:

- Respaldo lógico de MariaDB.
- Respaldo de `wp_data/wp-content/uploads`.
- Copia de configuración y variables no secretas.
- Retención definida.
- Prueba periódica de restauración.
- Registro de la fecha y versión restaurada.

Un backup no probado no se considera una capacidad operativa.

### 10.7 Onboarding técnico

1. Clonar el repositorio.
2. Revisar este documento y `PROGRESS.md`.
3. Copiar `.env.example` a `.env` y ajustar credenciales.
4. Ejecutar `docker compose up -d`.
5. Verificar `docker compose ps`.
6. Ejecutar `python3 scripts/seed/seed.py bootstrap`.
7. Abrir `http://localhost:3000` y `http://localhost:8080/wp-admin`.
8. Ejecutar tipos, lint y build. No fijar `NODE_ENV` en el servicio `frontend`: `next dev` y `next build` lo gestionan.
9. Revisar `lookdown/INDEX.md` para ubicar módulos.
10. Leer los ADR de la sección 13.
11. No commitear secretos ni volúmenes.

### 10.8 Regeneración de la memoria técnica

Después de crear o mover archivos estructurales:

```bash
docker run --rm -v "$PWD:/app" -w /app --entrypoint bun oven/bun:1-alpine build_graph.js
```

El grafo `lookdown/` está excluido de Git y se regenera localmente.

---

## 11. Riesgos y deuda técnica

### 11.1 Matriz de riesgos

| ID | Riesgo | Impacto | Probabilidad | Mitigación | Estado |
|---|---|---|---|---|---|
| R-01 | Credenciales de desarrollo en `docker-compose.yml` y posible exposición histórica | Alto | Alta | Externalizar a `.env` o secrets; rotar credenciales; revisar historial | Abierto |
| R-02 | Imagen `wordpress:latest` sin digest | Medio | Media | Fijar versión y digest; probar actualizaciones | Abierto |
| R-03 | Comentarios autoaprobados sin anti-spam | Alto | Media | Moderación previa, CAPTCHA, rate limiting y auditoría | Abierto |
| R-04 | Leads de contacto solo en logs | Medio | Alta | Persistir en CMS/CRM y notificar por correo | Abierto |
| R-05 | Multimedia del seed en `wp_data/` ignorado | Medio | Alta | Incluir assets en el repositorio o ampliar el seed | Abierto |
| R-06 | WPGraphQL requiere instalación manual en un clon limpio | Medio | Media | Automatizar activación o documentar paso obligatorio | Abierto |
| R-07 | Sin pruebas E2E | Medio | Alta | Playwright para rutas, comentarios y SSE | Abierto |
| R-08 | Sin TLS, reverse proxy ni backups | Alto | Alta en producción | Fase de endurecimiento y despliegue | Abierto |
| R-09 | Accesibilidad no auditada | Medio | Media | axe, teclado, contraste y lector de pantalla | Abierto |
| R-10 | Rendimiento no medido | Medio | Media | Lighthouse móvil y presupuesto de rendimiento | Abierto |
| R-11 | Caché SSE en memoria por conexión | Medio | Baja en MVP | Pub/sub si se escala horizontalmente | Aceptado |
| R-12 | Navegación con recarga completa | Bajo | N/A | Limitación deliberada por compatibilidad con el template | Aceptado |
| R-13 | Dependencia del runtime jQuery del template | Medio | Media | Documentar, aislar y probar actualizaciones | Aceptado |
| R-14 | Licencias de plantilla, imágenes y librerías sin revisar | Medio | Media | Auditoría legal antes de publicación | Abierto |
| R-15 | Concentración de conocimiento en pocas personas | Alto | Media | Documentación, onboarding y entorno reproducible | Mitigación parcial |
| R-16 | Sin staging ni CI/CD | Medio | Alta | Crear staging y pipeline de validaciones | Abierto |

### 11.2 Priorización

**P0 — antes de cualquier exposición pública**

- R-01: secretos y rotación.
- R-08: TLS, reverse proxy, backups y restricción de administración.
- R-03: moderación y anti-spam.
- R-04: persistencia de leads y privacidad.
- R-14: licencias.

**P1 — siguiente iteración**

- R-07: E2E.
- R-09: accesibilidad.
- R-10: rendimiento.
- R-06: automatización de WPGraphQL.
- R-05: multimedia reproducible.
- R-16: staging y CI.

**P2 — evolución**

- R-02: fijación de imágenes.
- R-11: pub/sub si hay escala.
- R-13: aislamiento del runtime del template.

### 11.3 Deuda técnica aceptada

- La navegación con recarga completa no es una SPA. Se acepta porque el template muta el DOM y requiere reinicialización.
- Las carreras son estáticas en TypeScript. Se acepta para el MVP; un CMS de carreras se evaluará cuando exista un flujo editorial definido.
- Los comentarios se aprueban automáticamente para la demo. No es aceptable en producción.
- El formulario de contacto registra en logs. Es una solución temporal, no un flujo de negocio.

---

## 12. Hoja de ruta 2026-2030

La hoja de ruta conserva el horizonte 2026-2030 del documento original. Las fases y fechas son una propuesta de planificación, no un compromiso institucional. Su ejecución depende de prioridades, capacidad del equipo, infraestructura y aprobación correspondiente.

| Fase | Horizonte | Objetivo | Entregables principales | Estado |
|---|---|---|---|---|
| Fase 0 | 2026 | MVP local funcional | Next.js, WordPress headless, MariaDB, noticias, comentarios, carreras y Docker | Completada |
| Fase 1 | 2026 | Endurecimiento y calidad | Secretos, moderación, leads, E2E, accesibilidad, rendimiento y CI | Siguiente |
| Fase 2 | 2026-2027 | Despliegue institucional | Proxmox, Tailscale, dominio, TLS, backups, monitoreo y staging | Pendiente |
| Fase 3 | 2027-2028 | Ecosistema académico | Cursos/lecciones, búsqueda, roles editoriales y flujos de contenido | Planificada |
| Fase 4 | 2029-2030 | Consolidación | IPv6, WCAG AA, observabilidad, recuperación ante desastres y optimización continua | Planificada |

### 12.1 Fase 0 — MVP local

**Criterio de salida:** rutas críticas operativas, noticias y comentarios persistentes, carreras completas, build exitoso y documentación de estado.

Estado: cumplido en el entorno local al 18/10/2026.

### 12.2 Fase 1 — Endurecimiento y calidad

**Objetivo:** convertir el MVP en una base segura y verificable antes de exponerla.

Entregables:

- Secretos externalizados y credenciales rotadas.
- Comentarios con moderación, rate limiting y anti-spam.
- Leads persistidos y notificados.
- Seed multimedia reproducible.
- Pruebas E2E de rutas, comentarios y SSE.
- Auditoría de accesibilidad y plan de corrección.
- Línea base de rendimiento móvil.
- Pipeline de tipos, lint y build.
- Revisión de licencias y créditos.

**Criterio de salida:** checklist P0 y P1 cerrado; build y E2E estables; sin secretos en el repositorio.

### 12.3 Fase 2 — Despliegue institucional

**Objetivo:** publicar el sitio en infraestructura controlada por la UNETI.

Entregables:

- Contenedores o VM reproducibles en Proxmox.
- Acceso remoto seguro por Tailscale y SSH.
- Reverse proxy y TLS.
- Dominio institucional y DNS.
- Backups automáticos y restauración probada.
- Monitoreo, alertas y registros.
- Staging previo a producción.
- Runbook de despliegue y rollback.

**Criterio de salida:** sitio público con HTTPS, smoke tests, backup/restore validado y monitoreo activo.

### 12.4 Fase 3 — Ecosistema académico

**Objetivo:** ampliar el sitio más allá de la vitrina institucional.

Líneas posibles:

- Modelo de cursos y lecciones en WordPress.
- Búsqueda de contenido.
- Roles y flujos editoriales.
- Integración con procesos académicos.
- Contenido multiidioma si se requiere.
- Analítica respetuosa de la privacidad.

**Criterio de salida:** modelo de contenido aprobado, flujo editorial documentado y pruebas de carga.

### 12.5 Fase 4 — Consolidación 2029-2030

**Objetivo:** sostener la operación y reducir riesgos de largo plazo.

Líneas posibles:

- Informe e implementación IPv6.
- WCAG 2.2 AA.
- Observabilidad y trazabilidad.
- Recuperación ante desastres.
- Presupuesto de rendimiento y optimización continua.
- Revisión de dependencias y ciclo de actualización.
- Transferencia de conocimiento y formación interna.

**Criterio de salida:** operación sostenible, auditorías periódicas y dependencia crítica de personas reducida.

---

## 13. Gobernanza documental y continuidad

### 13.1 Sistema documental

| Necesidad | Documento | Responsable funcional | Regla de actualización |
|---|---|---|---|
| Metodología y arquitectura | Este documento | Arquitectura/liderazgo técnico | Cambio relevante o revisión de versión |
| Estado del proyecto | `PROGRESS.md` | Desarrollo/operaciones | Después de cada hito |
| Decisiones | ADR de este documento | Arquitectura/liderazgo técnico | Al decidir o revertir |
| Navegación del código | `lookdown/` | Desarrollo | Después de cambio estructural |
| Historia de la primera iteración | `implementation_plan.md` | Arquitectura | No se reescribe |
| Créditos de activos | `CREDITS.md` | Contenido/comunicaciones | Al agregar activos |

### 13.2 Reglas de actualización

- `PROGRESS.md` es la fuente de verdad del estado operativo.
- Este documento es la fuente de verdad de la metodología y la arquitectura.
- Un cambio de arquitectura debe registrar un ADR y actualizar la sección afectada.
- Un cambio de estado debe actualizar `PROGRESS.md`, no inflar este documento con datos transitorios.
- Un cambio estructural debe regenerar `lookdown/`.
- Los secretos nunca se documentan con su valor real.
- Las afirmaciones de cumplimiento deben incluir evidencia verificable.

### 13.3 Versionado

- La versión 2.0 corresponde a la alineación entre el documento original y el MVP headless.
- Los cambios menores pueden incrementar la versión a 2.1, 2.2, etc.
- Un cambio de arquitectura, alcance o metodología puede requerir una versión mayor.
- La fecha de corte debe actualizarse en cada revisión.
- El commit de referencia debe corresponder al estado validado.

### 13.4 Continuidad del conocimiento

Para reducir el riesgo de dependencia de personas:

- Todo procedimiento debe estar en el repositorio.
- El entorno debe reconstruirse con Docker Compose y scripts.
- Las decisiones deben explicar el contexto, no solo el resultado.
- El onboarding debe poder completarse sin acceso al entorno original.
- Los datos demo deben ser reproducibles.
- Las credenciales y accesos institucionales deben tener custodia definida.

### 13.5 Registro de decisiones de arquitectura

#### ADR-001 — WordPress headless + Next.js

- **Estado:** aceptado.
- **Contexto:** el documento original proponía un tema WordPress con Elementor; el objetivo de autonomía y mantenibilidad exige separar contenido y presentación.
- **Decisión:** WordPress administra contenido y Next.js renderiza el sitio público.
- **Consecuencias:** menor acoplamiento y mejor control del frontend; requiere mantener WPGraphQL, CORS interno y contratos de datos.

#### ADR-002 — Server Components y `fetch` nativo

- **Estado:** aceptado.
- **Contexto:** se busca reducir JavaScript cliente y dependencias.
- **Decisión:** usar Server Components por defecto y `fetch` nativo para GraphQL.
- **Consecuencias:** menos bundle y menos librerías; el equipo debe conocer los límites de RSC y la caché de Next.js.

#### ADR-003 — Navegación con recarga completa

- **Estado:** aceptado.
- **Contexto:** el runtime jQuery del template muta el DOM, envuelve secciones y clona `#navbarNav`.
- **Decisión:** usar `<a>` para navegación interna y recarga completa.
- **Consecuencias:** se evitan errores de hidratación y se reinicializan swipers, partículas y contadores; no se obtiene navegación SPA.

#### ADR-004 — SSE con polling de respaldo

- **Estado:** aceptado.
- **Contexto:** se requiere contenido “en vivo” sin WebSockets ni infraestructura adicional.
- **Decisión:** endpoint SSE que consulta WPGraphQL cada 15 segundos y hook con polling cada 30 segundos si falla.
- **Consecuencias:** simplicidad operativa; la caché es por conexión y el escalado horizontal requerirá pub/sub.

#### ADR-005 — Comentarios en `wp_comments`

- **Estado:** aceptado.
- **Contexto:** se necesita moderación, avatares y compatibilidad con WordPress.
- **Decisión:** mu-plugin con REST propia y persistencia en `wp_comments`.
- **Consecuencias:** se conserva el modelo nativo; la moderación y el anti-spam quedan pendientes.

#### ADR-006 — Carreras estáticas en TypeScript

- **Estado:** aceptado para el MVP.
- **Contexto:** el contenido de los PNF es estable y no existe un flujo editorial definido.
- **Decisión:** mantener las carreras en `frontend/app/lib/carreras.ts`.
- **Consecuencias:** menos complejidad de CMS; los cambios requieren despliegue y no son editables por comunicaciones.

#### ADR-007 — Docker local, Proxmox como destino

- **Estado:** aceptado como transición.
- **Contexto:** el documento original propone Proxmox; el equipo necesita un entorno reproducible inmediato.
- **Decisión:** usar Docker Compose local y planificar la migración a Proxmox/Tailscale.
- **Consecuencias:** el MVP es reproducible; la autonomía institucional plena aún no está demostrada.

#### ADR-008 — Rutas en español y redirecciones 301

- **Estado:** aceptado.
- **Contexto:** la plantilla original usa rutas en inglés.
- **Decisión:** rutas públicas en español y redirecciones permanentes desde las rutas heredadas.
- **Consecuencias:** coherencia con el dominio y preservación de enlaces; requiere mantener la tabla de redirecciones.

#### ADR-009 — Accesibilidad progresiva

- **Estado:** aceptado.
- **Contexto:** el documento original no la considera bloqueante para el MVP.
- **Decisión:** mantener accesibilidad como objetivo progresivo con meta WCAG 2.2 AA post-MVP.
- **Consecuencias:** el MVP puede publicarse sin auditoría completa, pero no puede declararse accesible sin evidencia.

#### ADR-010 — Docs-as-Code y `lookdown`

- **Estado:** aceptado.
- **Contexto:** la etapa previa dependía de conocimiento distribuido y no dejó ADR formales.
- **Decisión:** documentar en Markdown, mantener `PROGRESS.md` y regenerar `lookdown/` tras cambios estructurales.
- **Consecuencias:** mayor trazabilidad y onboarding; requiere disciplina de actualización.

#### ADR-011 — Seed portable con JSON + APIs nativas de WordPress

- **Estado:** aceptado.
- **Contexto:** `wp_data/` y `db_data/` están fuera de Git; el dump SQL contenía usuarios, sesiones e IPs y no incluía las noticias. Un clon limpio no reconstruía el sitio.
- **Decisión:** versionar contenido en `seed/` (JSON + imágenes originales) y orquestar con Python. La escritura en WordPress la realizan scripts PHP mediante `wp_insert_post`, `wp_insert_attachment`, `wp_insert_comment` y `wp_insert_term`. Python solo valida, copia archivos y ejecuta Docker.
- **Consecuencias:** el sitio es reproducible e idempotente sin escribir SQL a mano; se mantienen serializaciones, miniaturas, términos y contadores nativos. Requiere mantener el schema de fixtures y documentar la licencia de las imágenes.

### 13.6 Guía de estilo y Knowledge Conductors

La documentación se trata como parte integral del desarrollo, no como una tarea posterior. Cada módulo debe poder rastrearse desde el código hasta su ficha en `lookdown/`, y cada decisión relevante debe dejar un ADR o una nota en `PROGRESS.md`.

Convenciones de nomenclatura:

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes React | PascalCase | `FormularioContacto.tsx` |
| Hooks | `use` + PascalCase | `useNoticiasEnVivo.ts` |
| Tipos e interfaces | PascalCase | `Noticia`, `Carrera` |
| Funciones y variables | camelCase | `obtenerNoticias`, `revalidate` |
| Constantes | UPPER_SNAKE_CASE | `WP_GRAPHQL_ENDPOINT` |
| Rutas | minúsculas y guiones | `/noticias/[slug]` |
| Clases del template | No renombrar | `contacto-form-style-03` |
| Clases propias nuevas | Prefijo `uneti-` cuando aplique | `uneti-news-card` |

Reglas de código:

- TypeScript estricto; evitar `any` y casts innecesarios.
- Comentarios en español, solo para lógica compleja o decisiones no obvias.
- Separar componentes de servidor y cliente; usar `"use client"` solo cuando sea necesario.
- No introducir dependencias sin justificar la alternativa nativa.
- No duplicar consultas GraphQL; reutilizar las definiciones de `frontend/app/lib/wordpress.ts`.
- Mantener las rutas y los textos de interfaz en español.
- Actualizar `PROGRESS.md` y `lookdown/` en el mismo cambio cuando corresponda.

---

## 14. Criterios de aceptación

### 14.1 Aceptación del MVP

- [x] Frontend Next.js conectado a WordPress headless.
- [x] Rutas y nomenclatura en español.
- [x] Redirecciones de compatibilidad.
- [x] Noticias dinámicas desde WPGraphQL.
- [x] Actualización en vivo por SSE con fallback.
- [x] Comentarios persistidos en MariaDB.
- [x] Detalle de noticias con SEO y relacionadas.
- [x] Carreras PNF con información completa.
- [x] Entorno Docker operativo y documentado.
- [x] Datos demo y validaciones técnicas.
- [ ] Pruebas E2E automatizadas.
- [ ] Endurecimiento de seguridad y despliegue productivo.

### 14.2 Definition of Done para nuevas tareas

Una tarea se considera terminada cuando:

- El código está implementado y tipado.
- `bunx tsc --noEmit` no reporta errores.
- `bun run lint` no agrega errores nuevos.
- `bun run build` finaliza correctamente.
- Las rutas afectadas responden con el código esperado.
- La persistencia o el contrato de datos fue verificada.
- La documentación y el ADR correspondiente están actualizados.
- `lookdown/` fue regenerado si cambió la estructura.
- No hay secretos ni credenciales en el diff.
- Se revisó el comportamiento responsive y la accesibilidad básica.

### 14.3 Criterios de salida a producción

Antes de publicar en el dominio institucional:

- [ ] Secretos fuera del repositorio y credenciales rotadas.
- [ ] Imágenes Docker fijadas por versión o digest.
- [ ] TLS y reverse proxy operativos.
- [ ] `wp-admin` restringido por red o autenticación adicional.
- [ ] Backups automáticos y restauración probada.
- [ ] Monitoreo, alertas y retención de logs.
- [ ] Moderación y anti-spam de comentarios.
- [ ] Persistencia y notificación de leads.
- [ ] Aviso de privacidad y base de consentimiento.
- [ ] Licencias y créditos revisados.
- [ ] Pruebas E2E estables.
- [ ] Auditoría de accesibilidad con plan de corrección.
- [ ] Línea base de rendimiento móvil.
- [ ] Staging validado.
- [ ] Runbook de despliegue y rollback.

### 14.4 Distinción entre MVP y producción

| Dimensión | MVP local | Producción institucional |
|---|---|---|
| Disponibilidad | Local | Pública con SLA operativo |
| Seguridad | Controles básicos | Endurecida y auditada |
| Datos | Demo | Reales con privacidad y retención |
| Backups | No | Probados |
| Monitoreo | Logs | Métricas y alertas |
| Accesibilidad | Parcial | Auditada |
| Rendimiento | No medido | Medido y con presupuesto |
| Soporte | Equipo de desarrollo | Operación definida |

---

## 15. Trazabilidad y referencias

### 15.1 Correspondencia con el documento original

| Documento original | Contenido | Sección de este documento |
|---|---|---|
| Introducción | Definición y propósito de SD-UNETI | 2.1 |
| 1. Definición y Propósito | Transición, autonomía y normativa | 2.1, 3.3 |
| 2. Objetivos SMART | Metas del MVP y accesibilidad | 4 |
| 3. Metodología híbrida | Scrum, XP, ISO 12207 y flujo remoto | 5 |
| 4. Arquitectura técnica | WordPress, Elementor, Tailwind, React, Proxmox | 6 y 2.3 |
| 5. Estándares de documentación | Docs-as-Code, ADR y guía de estilo | 13 |
| Fuentes citadas | Referencias metodológicas | 15.3 |

### 15.2 Correspondencia con `PROGRESS.md`

| `PROGRESS.md` | Contenido | Sección de este documento |
|---|---|---|
| 1. Resumen ejecutivo | Alcance y URLs locales | 1, 10.1 |
| 2. Stack tecnológico | Versiones y flujo de datos | 6.3, 6.4 |
| 3. Hitos alcanzados | Migración, rutas, noticias, SSE, comentarios, carreras, DevOps | 7, 9.1 |
| 4. Estructura del repositorio | Árbol de carpetas | 6.9 |
| 5. Contrato de datos y endpoints | GraphQL, SSE, REST y modelos | 7.3, 7.4 |
| 6. Estado del CMS y datos demo | Versiones, noticias y comentarios | 9.2 |
| 7. Validación técnica | Resultados de tipos, lint, build y HTTP | 9.3 |
| 8. Decisiones de arquitectura | Criterios técnicos | 13.5 |
| 9. Deuda técnica y riesgos | Brechas conocidas | 11 |
| 10. Próximos pasos | Hoja de ruta | 12 |
| 11. Operación | Comandos y entorno | 10.3 |
| 12. Criterios de aceptación | Checklist del MVP | 14.1 |

### 15.3 Fuentes del documento original

| Fuente | Tema | URL |
|---|---|---|
| Elementor | Rediseño de sitios web | `https://elementor.com/blog/redesign-your-website/` |
| Southern New Hampshire University | Objetivos SMART | `https://www.snhu.edu/about-us/newsroom/education/what-are-smart-goals` |
| Visual Studio Code | Desarrollo remoto por SSH | `https://code.visualstudio.com/docs/remote/ssh` |
| Visual Studio Code | Remote Development | `https://code.visualstudio.com/docs/remote/remote-overview` |
| Christian Amado | VS Code Dev Tunnels y Tailscale | `https://cmas.dev/posts/2024-10-11-wsl2-vs-code-integration/` |
| Tailscale | Extensión de VS Code | `https://tailscale.com/docs/integrations/vscode-extension` |
| GitLab | Buenas prácticas de control de versiones | `https://about.gitlab.com/topics/version-control/best-practices/` |
| Daily.dev | Buenas prácticas de Git | `https://daily.dev/blog/git-best-practices-effective-source-control-management` |

Las fuentes fueron citadas en el documento original con fecha de acceso mayo de 2026. Se conservan como referencia metodológica; su vigencia debe verificarse si se usan en una auditoría formal.

### 15.4 Referencias normativas y técnicas

- ISO/IEC/IEEE 12207: norma de procesos del ciclo de vida del software referida en el documento base. Verificar edición vigente antes de auditoría.
- WCAG 2.2: referencia de accesibilidad objetivo, no certificada en el MVP.
- Next.js 16 App Router: documentación oficial del framework.
- WPGraphQL: documentación oficial del plugin.
- Docker Compose: documentación oficial de orquestación local.

---

## Anexo A. Comandos de referencia

```bash
# Entorno
docker compose up -d
docker compose ps
docker compose logs -f frontend
docker compose logs -f wordpress

# Datos y verificación
python3 scripts/seed/seed.py bootstrap
python3 scripts/seed/seed.py verify

# Calidad
docker exec next_frontend bunx tsc --noEmit
docker exec next_frontend bun run lint

# Memoria técnica
docker run --rm -v "$PWD:/app" -w /app --entrypoint bun oven/bun:1-alpine build_graph.js

# Git
git status
git diff --check
git log -1 --oneline
```

No usar `docker compose down -v` sin respaldo: elimina los volúmenes persistentes.

---

## Anexo B. Glosario

| Término | Definición |
|---|---|
| ADR | Architecture Decision Record; registro de una decisión de arquitectura y sus consecuencias |
| CMS | Content Management System; sistema de gestión de contenidos |
| DoD | Definition of Done; criterios para considerar terminada una tarea |
| Headless | Arquitectura en la que el CMS no renderiza el sitio público |
| ISR | Incremental Static Regeneration; revalidación de páginas estáticas |
| MVP | Minimum Viable Product; producto mínimo viable |
| PNF | Programa Nacional de Formación |
| PII | Personally Identifiable Information; datos personales identificables |
| RSC | React Server Components |
| SD-UNETI | Proyecto Soberanía Digital de la UNETI |
| SSE | Server-Sent Events; canal de eventos unidireccional del servidor al cliente |
| TSU | Técnico Superior Universitario |
| WPGraphQL | Plugin que expone WordPress mediante GraphQL |

---

## Anexo C. Historial del documento

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | Sin fecha explícita en el `.docx` | Documento metodológico original de la etapa previa |
| 2.0 | 18/10/2026 | Reconstrucción metodológica, alineación con el MVP headless, ADR, riesgos, hoja de ruta y criterios de producción |

---

## Anexo D. Declaración de estado

Al corte del 18/10/2026:

- El proyecto **tiene** un MVP local funcional y documentado.
- El proyecto **no tiene** despliegue público, Proxmox, IPv6, TLS, backups ni pruebas E2E.
- El proyecto **no declara** cumplimiento WCAG ni rendimiento superior a 90/100.
- El proyecto **conserva** el nombre SD-UNETI y su propósito de soberanía tecnológica.
- La siguiente acción recomendada es cerrar las brechas P0 de la sección 11 antes de cualquier exposición pública.
