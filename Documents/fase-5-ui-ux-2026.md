# Fase 5 — Renovación UI/UX 2026 (SD-UNETI)

> Documento de fase del portal institucional **Soberanía Digital 2026-2030** de la Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI).
> Continúa la cronología de `doc-as-code_20102026.md` (fases 1 a 4) y complementa el estado funcional descrito en `PROGRESS.md`.

| Campo | Valor |
|---|---|
| Proyecto | SD-UNETI — portal institucional headless |
| Rama de trabajo | `main` (repositorio `SD-UNETI`) |
| Periodo | 27 al 29 de octubre de 2026 |
| Estado | **En curso** — bloque visual cerrado, organigrama y verificación pendientes |
| Alcance | Frontend Next.js (`frontend/`), estilos propios (`uneti.css`, `style.css`) y documentación |
| Impacto en backend / base de datos | Nulo |
| Fase anterior | Fase 4 — limpieza opcional (ver `doc-as-code_20102026.md`) |
| Fase siguiente | Fase 6 — despliegue productivo (ver §6) |

---

## 1. Contexto y motivación

Las fases 1 a 4 resolvieron la portabilidad del entorno: seed idempotente, bootstrap limpio, CI de clon limpio y poda de activos. Con esa base estable, el siguiente cuello de botella dejó de ser la infraestructura y pasó a ser la **experiencia pública del portal**: la plantilla original arrastraba un runtime jQuery que mutaba el DOM después de la hidratación, imágenes heredadas sin criterio institucional y secciones que no representaban la oferta actual de la universidad.

La Fase 5 aborda tres frentes:

1. **Consistencia técnica de la capa visual** — eliminar el runtime heredado y reimplementar sus interacciones como componentes React.
2. **Identidad institucional** — sustituir imágenes genéricas por fotografía de la comunidad UNETI y ordenar la jerarquía tipográfica.
3. **Contenido y navegación** — incorporar la oferta de cursos cortos, revisar admisiones y preparar el organigrama institucional.

---

## 2. Alcance ejecutado

### 2.1 Runtime e interacciones

- Se retiró `ScriptsPlantilla` junto con `jquery.js`, `vendors.min.js` y `main.js`. El documento ya no se muta después de la hidratación.
- Las interacciones de la plantilla se reimplementaron como componentes React: `EncabezadoSitio` (menú móvil por estado), `CarruselSimple`, `ContadorAnimado`, `SeccionPreguntas` (acordeón nativo con `<details>`), `BotonVideo` (modal), `Reveal` (aparición progresiva con `IntersectionObserver`) y `ParticulasDecorativas`.

### 2.2 Corrección crítica de cascada

La hoja `style.css` de la plantilla incluía el selector `[class*=ti-]`, pensado para los iconos Themify. Ese patrón coincidía con **todas** las clases propias del proyecto (`uneti-*`) y les aplicaba `display: inline-block`, rompiendo rejillas y secciones completas. Se acotó a tokens completos (`[class^=ti-]`, `[class*=" ti-"]`, entre otros), lo que restituyó el comportamiento esperado del layout.

### 2.3 Identidad visual y fotografía

- Nueva portada con jerarquía editorial: hero a pantalla completa, degradado de legibilidad, indicadores en vivo y llamada a la admisión.
- Imágenes institucionales derivadas a WebP: `hero-estudiantes.webp`, `nosotros-estudiantes.webp`, `nosotros-graduados.webp`, `carreras-hero.webp` y `cursos-hero.webp`.
- Los originales entregados por la universidad se conservan en `frontend/public/assets/images/uneti_new/`, **excluido de Git**; solo se publican los derivados optimizados.

### 2.4 Navegación y páginas

- `TituloPagina` incorpora la propiedad `imagePosition` para controlar el encuadre de la cabecera por ruta; se aplicó en `/noticias` y `/contacto`.
- Pasos de admisión renumerados de `01–04` a `1–4` para alinearlos con el resto de la retícula.
- El canal de soporte "Asistente SISU" se sustituyó por **"Cursos UNETI"** en la grilla de canales; el acceso a SISU permanece en la cabecera del sitio.

### 2.5 Cursos UNETI

- Nueva ruta `/cursos` con cuatro rutas de formación corta: blockchain, inteligencia artificial aplicada, criptografía y programación asistida con IA (*vibe coding*).
- Datos declarativos en `frontend/app/lib/cursos.ts` (`CURSOS`, `PASOS_CURSOS`), tarjeta reutilizable `TarjetaCurso.tsx` y estilos `.uneti-course-card*` y `.uneti-course-steps*`.
- "Cursos" se añadió a la navegación principal y a la navegación del pie.

---

## 3. Entregables y estado

| # | Entregable | Artefactos | Estado |
|---|---|---|---|
| E-01 | Retiro del runtime jQuery y reimplementación React | `EncabezadoSitio`, `CarruselSimple`, `ContadorAnimado`, `SeccionPreguntas`, `BotonVideo`, `Reveal`, `ParticulasDecorativas` | ✅ Completado |
| E-02 | Corrección del selector `[class*=ti-]` | `public/assets/css/style.css` | ✅ Completado |
| E-03 | Renovación de portada y collage institucional | `PortadaPrincipal.tsx`, `SeccionNosotros.tsx`, `uneti.css` | ✅ Completado |
| E-04 | Sustitución de imágenes por fotografía UNETI | `public/assets/images/uneti/*.webp`, `uneti_new/` (ignorado) | ✅ Completado |
| E-05 | Encuadre configurable de cabeceras internas | `TituloPagina.tsx`, `/noticias`, `/contacto` | ✅ Completado |
| E-06 | Ajustes de admisiones y canales de soporte | `admisiones/page.tsx`, `lib/institucional.ts` | ✅ Completado |
| E-07 | Ruta y contenido de Cursos UNETI | `app/cursos/page.tsx`, `lib/cursos.ts`, `TarjetaCurso.tsx`, `uneti.css` | ✅ Completado |
| E-08 | Nueva fotografía del hero principal | `UNETI-STUDENTS/WhatsApp Image 2026-10-29 at 10.33.46 (1).jpeg` → `hero-comunidad.webp` + variante móvil | ⏳ Pendiente |
| E-09 | Organigrama institucional animado en `/nosotros` | `lib/organigrama.ts`, `OrganigramaInstitucional.tsx`, `uneti.css`, fotos de autoridades | ⏳ Pendiente |
| E-10 | Verificación visual y funcional | Playwright en `/`, `/nosotros`, `/carreras`, `/cursos`, `/admisiones`, `/contacto`, `/noticias` a 1440 px y 390 px | ⏳ Pendiente |
| E-11 | Accesibilidad y peso de imágenes | Auditoría de contraste, foco y `prefers-reduced-motion`; presupuesto de imagen | ⏳ Pendiente |

### Fuente del organigrama (E-09)

La estructura oficial vive en el repositorio de la organización: `docs/04-academico-institucional/gobierno/organigrama-uneti-2026.pdf`. Contiene tres niveles y tres autoridades documentadas:

- **Rectorado** — Dr. Carlos Ramón Berbecí (máxima autoridad).
- **Vicerrectorado Académico** — Dr. Daniel Peña → Dirección de Docencia, Dirección de Investigación y Postgrado, Dirección de Extensión Universitaria.
- **Secretaría General** — Dra. María Del Carmen Marín → Control de Estudios, Admisión y Registro, Archivo Central.

Las fotografías de las autoridades se reutilizan desde `sis-uneti-frontend/public/autoridades/` con su crédito correspondiente. No se añadirán cargos ni titulares que no estén respaldados por ese documento.

---

## 4. Criterios de aceptación

- `bun run build` y `bun run lint` finalizan sin errores en `frontend/`.
- Ninguna ruta de la navegación principal ni del pie devuelve 404.
- Todas las imágenes publicadas son WebP con `width`/`height` declarados y `loading="lazy"` salvo el hero.
- Las animaciones se anulan con `prefers-reduced-motion: reduce`.
- El contraste de texto sobre fondos institucionales cumple AA.
- Sin errores de consola ni desbordamiento horizontal a 1440 px y 390 px.
- El organigrama refleja exactamente el PDF oficial, sin cargos inventados.

---

## 5. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Fotografías sin licencia documentada | Créditos en `instituciones/CREDITS.md`; originales fuera de Git (`uneti_new/`) |
| Regresión de layout por la hoja heredada `style.css` | Selectores acotados y verificación visual por ruta |
| Dependencias nativas `lightningcss`/`oxide` en arm64 | Instalación documentada de los binarios `*-darwin-x64` junto a Bun |
| Duplicidad de fuentes de imágenes | Un solo origen en `uneti/`; `uneti_new/` solo como banco de originales |
| Datos del organigrama desactualizados | Se toma el PDF oficial del repositorio de la organización como fuente única |

---

## 6. Continuidad

- **Fase 6 — despliegue productivo:** reverse proxy, TLS, backups y monitoreo, según `PROGRESS.md` §10.
- **Fase 7 — calidad continua:** pruebas E2E con Playwright en CI, auditoría de accesibilidad y presupuesto de rendimiento.

---

## 7. Referencias

- `Documents/PROGRESS.md` — estado funcional del MVP.
- `Documents/doc-as-code_20102026.md` — fases 1 a 4 y decisiones de arquitectura.
- `Documents/nextSteps.md` — lista de trabajo acumulada.
- `docs/04-academico-institucional/gobierno/organigrama-uneti-2026.pdf` — organigrama oficial (repositorio de la organización).


