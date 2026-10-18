# Plan de implementación — UNETI Headless 2026

## Objetivo

Reconstruir la home y `/about` con el contenido real de UNETI, actualizar header/footer/contacto y eliminar los errores de runtime e hidratación de `/news` y `/about`.

## Diagnóstico

- `main.js:3331-3342` ejecuta `particlesJS(undefined, ...)` cuando el contenedor `[data-particle="true"]` no tiene `id`. `PageTitle.tsx` y `ArticleHeader.tsx` omitían el `id`, lo que provoca `Cannot read properties of null (reading 'getElementsByClassName')` en `vendors.min.js:159` y aborta el resto del bootstrap.
- `main.js:85-110` envuelve `section, footer` en `.page-layout` y clona `#navbarNav` cuando `data-mobile-nav-style="modern"`. Con navegación SPA (`next/link`) React reutiliza un DOM mutado y falla la hidratación.
- Solución: IDs de partículas únicos + navegación de documento completo con `<a>` para que el template se inicialice de cero en cada ruta.

## Tipos

En `frontend/app/lib/institutional.ts`: `ContactInfo`, `SupportChannel`, `FaqItem`, `ActivityItem`, `InnovationArea`, `Testimonial`, `ValueItem`, `Milestone`.

`PageTitleProps` añade `particleId?: string` (default `page-title-particles`).

## Archivos nuevos

- `frontend/app/lib/institutional.ts`
- `frontend/app/components/SupportSection.tsx`
- `frontend/app/components/FaqSection.tsx`
- `frontend/app/components/InnovationSection.tsx`
- `frontend/app/components/ActivitiesSection.tsx`
- `frontend/app/components/VideoSection.tsx`
- `frontend/app/components/SiteLogo.tsx`
- `frontend/public/assets/css/uneti.css`
- `frontend/public/assets/images/uneti/*` (assets descargados de uneti.edu.ve)

## Archivos modificados

- `app/page.tsx`, `app/about/page.tsx`, `app/layout.tsx`, `globals.css`
- `components/{HeroSection,AboutSection,TestimonialsSection,ArticlesSection,SiteHeader,SiteFooter,PageTitle,ArticleHeader,NewsletterForm,LeadForm,BlogCard,CourseCard,CourseSidebar,CoursesSection}.tsx`
- `app/{news/page.tsx,news/[slug]/page.tsx,courses/page.tsx,courses/[slug]/page.tsx,contact/page.tsx,admissions/page.tsx}`
- `app/lib/navigation.ts`

## Contenido

- Home: Hero UNETI, canales de atención, modalidad híbrida + diferencias, FAQs, innovación (blockchain, metaverso, IA, 3D), testimonios, actividades, video y últimas noticias.
- About: PageTitle, intro institucional, 4 valores, contador 7.000, acordeón Misión/Visión/8 objetivos/5 puntos del modelo, actividades.
- Footer/contacto: dirección, 0212-505-1402 / 0212-505-1406, `rectorado@uneti.edu.ve`, `www.uneti.edu.ve`, Mesa de Ayuda, Campus Virtual, UNETI 360 y YouTube.

## Funciones

- `FaqSection({ id, eyebrow, title, description, image, items, backgroundImage })`
- `ActivitiesSection({ layout, eyebrow, title, description, items, image, backgroundImage })`
- `SupportSection()`, `InnovationSection()`, `VideoSection()`, `SiteLogo({ variant })`
- `PageTitle` con `particleId`; `ArticleHeader` con `id="article-header-particles"`.

## Dependencias

Sin paquetes NPM nuevos. Se mantienen `fetch` nativo, `<img>` y los scripts del template.

## Pruebas

- Consola sin errores de partículas ni hidratación en `/news` y `/about`.
- Navegación interna con recarga completa (Network: documento HTML).
- `docker exec next_frontend bun run lint` y `bun run build`.
- Revisión visual de `/`, `/about`, `/contact`, `/news`, `/courses`.
- `bun build_graph.js` al finalizar.

## Orden

1. Assets y `uneti.css`.
2. `institutional.ts` y `navigation.ts`.
3. Fix de partículas y reemplazo de `next/link` por `<a>`.
4. Header, footer, logo y formularios.
5. Home y About.
6. Contacto, metadatos y textos restantes.
7. Lint, build, pruebas y actualización del grafo.
