# Doc-as-code · SD-UNETI · 2026-11-05

> **Guía principal de seguimiento.** Este documento resume la intervención completa del
> 05/11/2026 sobre el portal `SD-UNETI/frontend`: ISR, correcciones visuales, posgrados,
> formularios con confirmación TFSA, WhatsApp, mapas de sedes y navegación rápida.
> El detalle de pruebas está en `qa-2026-11-05.md` (misma carpeta).

## 1. Contexto

- Proyecto: `SD-UNETI` (portal institucional UNETI).
- Stack: Next.js `16.4.3` (App Router) · React `19.3.1` · TypeScript `5.9` · Tailwind v4 sin preflight.
- Configuración clave: `cacheComponents: true` y `partialPrefetching: true` en `next.config.ts`.
- Backend de contenido: WordPress con WPGraphQL + mu-plugin propio de solicitudes.
- Alcance respetado: solo se modificó `SD-UNETI/**`. No se tocaron `sis-uneti/`, `sisu/` ni otros proyectos.

## 2. Decisión técnica: ISR en Next 16 con Cache Components

En Next 16, cuando `cacheComponents` está activo, **`dynamic`, `dynamicParams`, `revalidate` y
`fetchCache` se eliminan como route segment config**. Por eso el ISR se implementó con el modelo
nativo:

| Necesidad | Implementación aplicada |
|---|---|
| Revalidación por tiempo | `'use cache'` + `cacheLife('noticias')` (perfil definido en `next.config.ts`) |
| Invalidación por contenido | `cacheTag('noticias', 'noticia-<slug>')` |
| Revalidación bajo demanda | `POST /api/revalidar` → `revalidateTag(tag, 'max')` + `revalidatePath()` |
| Prerender de rutas dinámicas | `generateStaticParams` en `/carreras/[slug]` y `/noticias/[slug]` |
| Lectura sin caché (SSE/polling) | `obtenerNoticiasEnVivo()` con `fetch(..., { cache: 'no-store' })` |

Perfiles (`next.config.ts`):

```ts
cacheLife: {
  noticias:  { stale: 60,   revalidate: 300,   expire: 3600 },
  contenido: { stale: 3600, revalidate: 86400, expire: 604800 },
}
```

Cobertura por ruta:

| Ruta | Estrategia |
|---|---|
| `/` | Shell estático + noticias en caché ISR (5 min) |
| `/nosotros`, `/carreras`, `/posgrados`, `/cursos`, `/admisiones`, `/contacto` | Prerender estático |
| `/carreras/[slug]` | `generateStaticParams` + upgrade ISR bajo demanda |
| `/noticias`, `/noticias/[slug]` | ISR 5 min + tag por slug + webhook de revalidación |
| `/api/*` | Route handlers dinámicos (`await connection()`) |

Variables nuevas/relacionadas:

- `UNETI_REVALIDATE_TOKEN` (opcional): token del webhook `/api/revalidar`; si no existe se usa
  `WP_FORM_TOKEN`.
- `WP_FORM_TOKEN`: token servidor-a-servidor hacia WordPress (sin prefijo `NEXT_PUBLIC_`).

## 3. Estado de los puntos solicitados

| # | Requerimiento | Estado | Evidencia / archivos |
|---|---|---|---|
| 0 | ISR en todo el frontend | Hecho | `next.config.ts`, `app/lib/noticias.ts`, `app/lib/wordpress.ts`, `app/api/revalidar/route.ts` |
| 1 | Arranque sin errores ni hidratación | Hecho | `npm run build` + QA de rutas (ver `qa-2026-11-05.md`) |
| 2 | Parallax del storytelling | Hecho | `useParallax` con `alcanceSelector`; `HistoriaParallax` mide `.uneti-story` |
| 3 | Nuevas fotos del storytelling | Hecho | `app/lib/nosotros.ts` (4 imágenes nuevas) |
| 4 | Formulario de contacto dinámico | Hecho | `FormularioContacto` (3 pasos) + `POST /api/contacto` → WordPress |
| 5 | Hero más claro + carrusel 5 s | Hecho | `MediaHeroParallax` (4 diapositivas), `PortadaPrincipal`, CSS `.uneti-hero__dots` |
| 6 | Destello/cruz en flashcards | Hecho | CSS: hover sin 3D, `translateZ`, `isolation`, recorte exterior |
| 7 | Imagen de "Cómo se estudia" | Hecho | `ModalidadHibrida` → `EquipoDeDesarrolloDeSoftware.jpg` |
| 8 | Logo del footer a color y nítido | Hecho | `LogotipoSitio` + `logo@2x.png` + placa blanca |
| 9 | Apartado "Posgrados" en /carreras | Hecho | `SeccionPosgrados`, `TarjetaPosgrado`, `lib/posgrados.ts` |
| 10 | Dos sedes con Google Maps | Hecho | `MapaSede` ×2 en `/contacto` (`#sede-administrativa`, `#nucleo-cantv`) |
| 11 | Justificar párrafos | Hecho | CSS `main p { text-align: justify }` + excepciones |
| 12 | Carrusel de imágenes nuevas por PNF | Hecho | `CarruselFundido` + `carrusel-*.jpg` + `CarruselCarrera` |
| 13 | Hamburguesa de navegación rápida | Hecho | `NavegacionRapida` en `layout.tsx` + `lib/navegacion-rapida.ts` |
| 14 | Vista `/posgrados` con mallas | Hecho | `app/posgrados/page.tsx`, `DetallePosgrado` |
| 15 | Doc-as-code en carpeta con fecha | Hecho | Este documento + `qa-2026-11-05.md` |
| 16 | Cursos → WhatsApp con nombre | Hecho | `lib/whatsapp.ts`, `TarjetaCurso` (`wa.me/584241427051`) |
| 17 | "Solicitar Cupo" por posgrado | Hecho | `SolicitarCupo` → `#formulario-posgrados` con preselección |
| 18 | Formulario Posgrados + TFSA | Hecho | `FormularioPosgrado`, `/api/posgrados`, `AnimacionTFSA` |
| 19 | TFSA en Admisiones PNF | Hecho | `FormularioAdmision` + `AnimacionTFSA` |

## 4. Formularios y confirmación TFSA

Los tres formularios comparten el mismo patrón (validación con `app/lib/solicitudes.ts`, rate limit
por IP, honeypot, control de tiempo mínimo y reenvío a WordPress con token):

| Formulario | Componente | Endpoint Next | `tipo` en WordPress |
|---|---|---|---|
| Admisiones PNF | `FormularioAdmision` | `/api/admisiones` | `admision` |
| Admisiones Posgrados | `FormularioPosgrado` | `/api/posgrados` | `posgrado` |
| Contacto | `FormularioContacto` | `/api/contacto` | `contacto` |

**TFSA** (`app/componentes/AnimacionTFSA.tsx`): confirmación a pantalla completa que sombrea todo el
viewport. Variante de éxito con checklist verde dibujado (`stroke-dasharray`), halos y paleta clara
(calma · moderno · control · seguridad); variante de error con el checklist en rojo. Muestra el
título «Su solicitud ha sido enviada» y el número de ticket devuelto por WordPress
(`UNETI-2026-000123`). Accesible (`role="alertdialog"`, `aria-modal`, foco, `Escape`, bloqueo de
scroll) y con soporte de `prefers-reduced-motion`.

## 5. Posgrados (PNFA)

- `app/lib/posgrados.ts`: 7 programas con nivel, duración, carga, grados, propósito, malla por ejes,
  requisitos y color identificador.
- `/posgrados`: presentación de los 3 niveles, las 7 fichas con malla curricular, requisitos
  generales y el formulario al final.
- `/carreras`: resumen con tarjetas y enlace a la ficha completa.
- «Solicitar Cupo» lleva a `#formulario-posgrados` y preselecciona el programa (evento
  `uneti:posgrado` + `?posgrado=<slug>` para enlaces entre páginas).
- El paso 2 del formulario muestra las 7 opciones con el borde y el icono del color de cada posgrado.

## 6. WordPress (mu-plugin `uneti-solicitudes.php`)

- Nuevo tipo `posgrado` en la whitelist de `tipo`.
- Whitelist de `programa` por tipo (2 PNF para admisión, 7 PNFA para posgrado); obligatorio en ambos.
- Cédula obligatoria también para posgrado.
- Etiqueta legible centralizada (`uneti_solicitud_etiqueta_tipo`): título, columna, detalle, CSV y correo.
- La respuesta REST devuelve `folio`, `ticket` (alias) e `id`.

## 7. WhatsApp y navegación

- `app/lib/whatsapp.ts` centraliza el número `584241427051` y el mensaje
  «Hola UNETI, quiero saber más información al respecto de los cursos: {curso}».
- `TarjetaCurso` abre WhatsApp con el nombre del curso; el paso 2 de `/cursos` lo menciona.
- `NavegacionRapida` (global, en `layout.tsx`): botón flotante «Índice» con panel lateral en
  escritorio y hoja inferior en móvil; lista las secciones reales de cada ruta, resalta la activa con
  `IntersectionObserver`, permite volver arriba y cierra con `Escape` o al navegar.

## 8. Archivos nuevos y modificados (resumen)

**Nuevos**

- `app/lib/posgrados.ts`, `app/lib/whatsapp.ts`, `app/lib/navegacion-rapida.ts`
- `app/posgrados/page.tsx`
- `app/componentes/`: `AnimacionTFSA`, `FormularioPosgrado`, `DetallePosgrado`, `TarjetaPosgrado`,
  `SeccionPosgrados`, `SolicitarCupo`, `CarruselFundido`, `MapaSede`, `NavegacionRapida`
- `app/api/posgrados/route.ts`, `app/api/revalidar/route.ts`
- `public/assets/images/uneti/logo@2x.png`
- `public/assets/images/carreras/pnf-informatica/carrusel-1..4.jpg`
- `public/assets/images/carreras/pnf-telecomunicaciones/carrusel-1..3.jpg`

**Modificados**

- `next.config.ts`, `app/layout.tsx`, `app/lib/{institucional,navegacion,nosotros,carreras,cursos,solicitudes,solicitudes-wp,noticias,wordpress}.ts`
- `app/componentes/{PortadaPrincipal,MediaHeroParallax,HistoriaParallax,ParallaxImagen,ModalidadHibrida,TarjetaCarrera,CarruselCarrera,TarjetaCurso,FormularioContacto,FormularioAdmision,LogotipoSitio,PieSitio}.tsx`
- `app/hooks/useParallax.ts`
- `app/{contacto,carreras,cursos,admisiones,noticias}/page.tsx`, `app/noticias/[slug]/page.tsx`, `app/carreras/[slug]/page.tsx`
- `public/assets/css/uneti.css`
- `scripts/wordpress/mu-plugins/uneti-solicitudes.php`
- `scripts/ci/qa-frontend.sh`, `scripts/ci/probar-formulario.mjs`

## 9. Validación ejecutada

Ver `qa-2026-11-05.md`. Resumen:

- `npx tsc --noEmit` sin errores.
- `npm run lint` sin errores ni advertencias.
- `npm run build`: 27 rutas, ISR activo (`/` y `/noticias` con `5m / 1h`), sin errores.
- `scripts/ci/qa-frontend.sh`: 28 comprobaciones positivas, 0 brechas, 117 enlaces/imágenes válidos.
- `scripts/ci/probar-formulario.mjs`: 12 comprobaciones positivas, 0 brechas (incluye posgrados y
  contacto, y el ticket devuelto por WordPress).
- Producción local (`PORT=3100`): `x-nextjs-cache: HIT` y `Cache-Control: s-maxage=300,
  stale-while-revalidate=3300` en `/` y `/noticias`; revalidación bajo demanda verificada con
  `/api/revalidar`.
- Capturas headless (Firefox) del hero, `/nosotros`, `/posgrados`, el footer y los mapas de contacto.

## 10. Riesgos y pendientes

| Riesgo / pendiente | Mitigación |
|---|---|
| El build prerenderiza noticias: requiere WordPress arriba | Si WP no responde, `obtenerNoticias` devuelve `[]` y las URLs se generan bajo demanda (ISR) |
| El token `WP_FORM_TOKEN` debe coincidir entre Next y WordPress | Documentado en `README.md` y `solicitudes-wordpress-2026.md` |
| Webhook de revalidación sin configurar | Definir `UNETI_REVALIDATE_TOKEN` y llamar `/api/revalidar` desde WordPress al publicar |
| Las mallas son la estructura por ejes del DOCX | Si se disponen mallas oficiales por período/UC, ampliar `lib/posgrados.ts` |
| Verificación visual de TFSA y del paso 2 de posgrados | Requiere interacción real en el navegador; el HTML/CSS y los flujos API están verificados |

## 11. Próximos pasos sugeridos

1. Configurar el webhook de publicación de WordPress hacia `/api/revalidar`.
2. Añadir pruebas E2E de navegador (Playwright) para TFSA y para el carrusel del hero.
3. Sustituir las mallas por las versiones oficiales cuando estén disponibles.
4. Revisar el copy institucional de los posgrados con Rectorado antes de publicar.

