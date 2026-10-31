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
- `/api/admisiones`: solicitud de admisión; reenvía a WordPress con `WP_FORM_TOKEN`.

El token debe coincidir con `UNETI_FORM_TOKEN` en el contenedor WordPress. Nunca uses el prefijo `NEXT_PUBLIC_` para este valor.

## QA

```bash
bash ../scripts/ci/qa-frontend.sh http://localhost:3000
node ../scripts/ci/probar-formulario.mjs
```
