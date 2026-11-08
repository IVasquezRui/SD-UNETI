# SD-UNETI — Frontend Next.js

Portal institucional de la UNETI construido con Next.js (App Router), React y TypeScript.

## Requisitos

- Node.js `26.13.0` LTS
- npm

## Desarrollo

```bash
npm install
npm run dev
```

El servidor queda disponible en [http://localhost:3000](http://localhost:3000).

## Calidad

```bash
npm run lint
npx tsc --noEmit
npm run build
```

El build de producción requiere WordPress arriba y el seed importado, porque `generateStaticParams` prerenderiza las noticias publicadas.

## Docker

Desde la raíz del repositorio:

```bash
docker compose up -d
python3 scripts/seed/seed.py bootstrap
```

Para validar el build de producción con WordPress arriba:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d frontend
```

## Formularios

- `/api/contacto`: mensajes de contacto y altas del boletín.
- `/api/admisiones`: solicitud de admisión a los PNF; reenvía a WordPress con `WP_FORM_TOKEN`.
- `/api/posgrados`: solicitud de admisión a un PNFA (posgrado), mismo flujo y mismo token.

Los tres formularios comparten validación (`app/lib/solicitudes.ts`), rate limit por IP, honeypot y
control de tiempo mínimo. WordPress responde con `folio`/`ticket` e `id`, que el frontend muestra en
la animación de confirmación **TFSA**.

El token debe coincidir con `UNETI_FORM_TOKEN` en el contenedor WordPress. Nunca uses el prefijo `NEXT_PUBLIC_` para este valor.

## Caché e ISR

El proyecto usa **Cache Components** (`cacheComponents: true`) con Partial Prefetching. En Next 16
con esta opción `revalidate`/`dynamic` ya no existen como *route segment config*: el ISR se declara
con `'use cache'`, `cacheLife` y `cacheTag`.

- Perfiles en `next.config.ts`: `noticias` (5 min, expira 1 h) y `contenido` (1 día).
- Cargadores en `app/lib/noticias.ts`: `obtenerNoticias`, `obtenerNoticiaPorSlug` (con tags) y
  `obtenerNoticiasEnVivo` (sin caché para SSE/polling).
- `generateStaticParams` prerenderiza las carreras y las noticias publicadas.
- Revalidación bajo demanda: `POST /api/revalidar` con `X-UNETI-Token`
  (`UNETI_REVALIDATE_TOKEN` o `WP_FORM_TOKEN`) y cuerpo `{ "slug": "<slug>" }`.

## WhatsApp

`app/lib/whatsapp.ts` centraliza el número de atención (`584241427051`). Las tarjetas de `/cursos`
abren WhatsApp con el mensaje «Hola UNETI, quiero saber más información al respecto de los cursos:
{curso}».

## Seguridad y privacidad

- Cabeceras globales en `next.config.ts` (CSP, COOP, CORP, `X-Permitted-Cross-Domain-Policies`,
  `Permissions-Policy`). `proxy.ts` corta `TRACE`/`TRACK`.
- `app/lib/security.ts`: comparación de tokens en tiempo constante y lectura de JSON con límite.
- `app/lib/rate-limit.ts`: límite por IP en formularios, comentarios, noticias, stream y revalidación;
  `origenValido` acepta el host real de la petición (acceso por IP de LAN) y rechaza orígenes ajenos.
- `/privacidad` con la política de tratamiento y enlaces desde el pie y los consentimientos.
- `public/.well-known/security.txt`, `app/robots.ts` y `app/sitemap.ts`.
- Mapa de controles SOC 2 / ISO 27001 / ISO 27701 en `../Documents/seguridad/2026-11-08-hardening.md`.

## QA

```bash
bash ../scripts/ci/qa-frontend.sh http://localhost:3000
node ../scripts/ci/probar-formulario.mjs
bash ../scripts/ci/pentest-nextjs.sh http://localhost:3000
```
