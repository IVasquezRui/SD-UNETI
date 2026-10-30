## Diagnóstico técnico

> **Estado de implementación (20/10/2026):** fases 1 y 2 implementadas y validadas en un entorno limpio con puerto alternativo `8081`. Fase 3: workflow CI implementado en `.github/workflows/seed.yml`; `lookdown/` regenerado localmente con 975 nodos (excluido de Git).
>
> **Actualización (29/10/2026):** Fase 4 cerrada. **Fase 5 en curso**: renovación UI/UX, ruta `/cursos` y organigrama institucional. Detalle y pendientes en `Documents/fase-5-ui-ux-2026.md`.

| # | Hallazgo | Evidencia | Consecuencia |
|---|---|---|---|
| H-01 | `wp_data/` está fuera de Git | `.gitignore` lo excluye; las 6 imágenes originales pesan ~1.6 MB | Un clon limpio no tiene multimedia |
| H-02 | `wp_content/` no es un respaldo de contenido | 27 MB, 1056 archivos; solo contiene `015.jpg`, no las 6 imágenes de noticias | Confunde vendor con contenido y no resuelve el seed |
| H-03 | `database/init.sql` es un dump completo, no un seed | 642 líneas, ~1.5 MB, 10 `INSERT`; no contiene `uneti-abre-convocatoria...`; incluye `wp_users`, `wp_usermeta`, `session_tokens` y `comment_author_IP` | Riesgo de seguridad y fuente de datos no portable |
| H-04 | WPGraphQL no se monta en un clon limpio | `wp_content/plugins/wp-graphql` está versionado en 2.24.2, pero Compose solo monta `mu-plugins` y scripts | `active_plugins` apunta a un plugin inexistente; GraphQL falla |
| H-05 | `seed-noticias.php` no es portable | Hardcodea autor `1`, imágenes en `wp_data/2026/10`, fechas relativas de comentarios y no exporta | No reconstruye el entorno de forma determinista |
| H-06 | Compose fija URLs, puertos, contraseñas y nombres | `localhost:8080`, `wp_site`, `frontend_net`, puertos fijos | Dificulta colaboración, CI y ejecución en paralelo |
| H-07 | Las imágenes de noticias no tienen créditos | Solo existe `frontend/public/assets/images/carreras/CREDITS.md` | Riesgo legal al publicar el repositorio |
| H-08 | No hay validación de portabilidad | No existía `.github/` ni prueba de clon limpio | La regresión se descubre en otra laptop, no en CI. Mitigado con `.github/workflows/seed.yml` |

## Decisión de arquitectura

| Opción | Portabilidad | Idempotencia | Revisión | Riesgo | Veredicto |
|---|---|---|---|---|---|
| Dump SQL + uploads | Media | Baja | Baja | Alto: IDs, usuarios, sesiones | Rechazada |
| WXR + importador WordPress | Media | Parcial | Media | Medio: plugin/CLI, medios remotos | No recomendada |
| JSON fixtures + APIs de WordPress + orquestador Python | Alta | Alta | Alta | Bajo | **Recomendada** |
| Python escribiendo SQL directo | Media | Baja | Media | Alto: rompe serialización, hooks y metadatos | Rechazada |

**Principio:** Python no debe escribir en MariaDB. Python orquesta Docker y valida; PHP ejecuta las APIs nativas de WordPress (`wp_insert_post`, `media_handle_sideload`, `wp_insert_comment`, etc.). Así se respetan metadatos serializados, miniaturas, términos, contadores y cachés.

## Diseño propuesto

```text
seed/                                  # Fixture versionado y revisable
├── site.json                          # Título, zona horaria, formatos, autor genérico
├── taxonomies.json                    # Categorías y etiquetas con slug estable
├── media.json                         # Clave lógica, archivo, SHA-256, alt, título
├── posts/
│   ├── uneti-abre-convocatoria-admision-2026.json
│   └── ...                            # Un archivo por noticia, con comentarios
├── media/
│   ├── 2026/10/*.jpg                  # Solo originales, ~1.6 MB
│   └── CREDITS.md                     # Fuente y licencia de cada imagen
└── manifest.json                      # schemaVersion, counts, checksums

scripts/
├── seed/
│   ├── seed.py                        # CLI Python, solo stdlib
│   └── README.md
└── wordpress/
    ├── bootstrap.php                  # Instala WordPress y activa WPGraphQL
    └── seed/
        ├── export.php                 # Exporta usando APIs de WordPress
        ├── importar.php               # Importa usando APIs de WordPress
        └── lib.php                    # Utilidades compartidas
```

### Separación de responsabilidades

| Ruta | Contenido | Se versiona |
|---|---|---|
| `seed/` | Fixture curado: noticias, medios, comentarios, opciones | Sí |
| `wp_content/` | Vendor: WPGraphQL, temas y traducciones de referencia | Sí, pero no es respaldo de contenido |
| `wp_data/` | Runtime de WordPress y uploads | No |
| `db_data/` | Datos de MariaDB | No |
| `frontend/public/assets/` | Activos estáticos del frontend | Sí |

### Esquema de una noticia

```json
{
  "schemaVersion": 1,
  "key": "uneti-abre-convocatoria-admision-2026",
  "type": "post",
  "status": "publish",
  "title": "UNETI abre la convocatoria de admisión 2026",
  "slug": "uneti-abre-convocatoria-admision-2026",
  "excerpt": "El proceso de ingreso...",
  "content": "<p>La Universidad Nacional...</p>",
  "date": "2026-10-17 09:00:00",
  "dateGmt": "2026-10-17 13:00:00",
  "author": "redaccion",
  "commentStatus": "open",
  "categories": ["admision"],
  "tags": ["admision", "pnf", "ingreso"],
  "featuredMedia": "admisiones-2026",
  "comments": [
    {
      "key": "uneti-abre-convocatoria-admision-2026-comment-1",
      "author": "María Fernanda Rojas",
      "email": "maria.rojas@example.com",
      "content": "Excelente noticia...",
      "date": "2026-10-18 15:30:21",
      "dateGmt": "2026-10-18 19:30:21",
      "approved": 1,
      "parent": null
    }
  ]
}
```

## Flujo de exportación e importación

### Exportar el entorno actual

```bash
python3 scripts/seed/seed.py export
```

1. `export.php` lee posts publicados, términos, comentarios y adjuntos mediante APIs de WordPress.
2. Normaliza URLs absolutas a marcadores `{{SITE_URL}}`, `{{MEDIA_URL:clave}}` y `{{MEDIA_ID:clave}}`.
3. Copia solo los archivos originales a `seed/media/2026/10/`.
4. Calcula SHA-256 y escribe JSON con orden determinista.
5. Python valida referencias, duplicados y checksums.
6. Reemplaza `seed/` de forma atómica.

### Importar en un entorno limpio

```bash
python3 scripts/seed/seed.py import
```

1. Python valida `manifest.json`, medios y checksums.
2. Copia el fixture al contenedor WordPress.
3. `importar.php` importa primero los medios, forzando la ruta original con un filtro de `upload_dir`.
4. Crea o actualiza términos por slug.
5. Crea o actualiza posts por slug; reemplaza marcadores de medios.
6. Asigna miniaturas y crea comentarios por clave lógica.
7. Actualiza contadores, limpia cachés y ejecuta `flush_rewrite_rules()`.

### Idempotencia y adopción

- Posts: búsqueda por `slug`; se añade `_uneti_seed_key`.
- Adjuntos: búsqueda por `_uneti_seed_key`, luego por `_uneti_seed_archivo` o nombre de archivo.
- Comentarios: búsqueda por `_uneti_seed_key`; si no existe, por autor + contenido para adoptar los 3 comentarios actuales sin duplicarlos.
- `--prune` elimina únicamente objetos marcados con `_uneti_seed_key` que ya no estén en el manifiesto. Nunca toca contenido manual.
- `--dry-run` muestra el plan sin escribir.
- `--skip-existing` evita sobrescribir ediciones manuales.

### Bootstrap completo

```bash
docker compose up -d
python3 scripts/seed/seed.py bootstrap
```

`bootstrap` debe:

1. Esperar MariaDB y WordPress.
2. Ejecutar `wp_install()` solo si WordPress no está instalado.
3. Borrar el contenido por defecto únicamente cuando la instalación se acaba de crear.
4. Activar `wp-graphql/wp-graphql.php`.
5. Importar el fixture.
6. Verificar `/api/noticias` y los comentarios.

## Ajustes de infraestructura

- Montar WPGraphQL desde el repositorio:

```yaml
- ./wp_content/plugins/wp-graphql:/var/www/html/wp-content/plugins/wp-graphql:ro
```

El entrypoint oficial omite copiar directorios de `wp-content/*/*/` que ya existen; por eso el montaje directo no compite con la copia inicial del core.

- Externalizar en `.env`:
  - `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`.
  - `WORDPRESS_URL`, `WORDPRESS_PORT`, `FRONTEND_PORT`.
  - `WORDPRESS_ADMIN_USER`, `WORDPRESS_ADMIN_PASSWORD`, `WORDPRESS_ADMIN_EMAIL`.
- Añadir `!.env.example` al `.gitignore`, porque la regla actual `.env.*` también ignoraría el ejemplo.
- Parametrizar puertos: `${WORDPRESS_PORT:-8080}:80` y `${FRONTEND_PORT:-3000}:3000`.
- Eliminar `container_name` fijos y el nombre fijo de red para permitir proyectos paralelos y CI.
- Fijar versiones: WordPress 7.1.3, MariaDB 11.4.13, WPGraphQL 2.24.2 y Bun 1.4.3.

## Fases de implementación

| Fase | Alcance | Entregables | Complejidad |
|---|---|---|---|
| Fase 1 | Seed portable de noticias, imágenes y comentarios | `seed/`, `seed.py`, `export.php`, `importar.php`, montaje de WPGraphQL, `seed/CREDITS.md` | Media |
| Fase 2 | Bootstrap limpio y portabilidad de infraestructura | `bootstrap.php`, eliminación de `database/init.sql`, `.env.example`, URLs/puertos/nombres configurables, pinning de imágenes | Media |
| Fase 3 | Validación continua y documentación | Workflow CI de clon limpio, `seed.py validate/verify`, actualización de `Documents/PROGRESS.md` y `Documents/Soberanía Digital 2026.md`, ADR-011, regeneración de `lookdown/` | Media-baja. Workflow implementado; `lookdown/` regenerado localmente (975 nodos) |
| Fase 4 | Limpieza opcional | Podar `wp_content/themes` y `languages`, evaluar Git LFS, backup operativo separado del repositorio | Baja |
| Fase 5 | Renovación UI/UX 2026 | Retiro del runtime jQuery y reimplementación React, corrección del selector `[class*=ti-]`, imágenes WebP institucionales, `imagePosition` en cabeceras, ruta `/cursos` con `TarjetaCurso`, organigrama en `/nosotros`, verificación Playwright | Media. Completados el bloque visual y `/cursos`; pendientes el hero nuevo, el organigrama y la verificación (ver `Documents/fase-5-ui-ux-2026.md`) |

## Criterios de aceptación

- Un clon limpio, sin `wp_data/` ni `db_data/`, ejecuta `docker compose up -d` y `python3 scripts/seed/seed.py bootstrap`.
- `/api/noticias` devuelve exactamente 6 noticias.
- `/api/noticias/uneti-abre-convocatoria-admision-2026/comentarios` devuelve 3 comentarios.
- Las 6 imágenes responden HTTP 200 con `Content-Type: image/jpeg`.
- Una segunda importación no duplica posts, medios ni comentarios.
- `seed.py export` sobre el entorno actual produce un `seed/` sin diferencias inesperadas.
- `seed/media/` contiene solo originales, no las variantes generadas.
- `seed/` no contiene usuarios, contraseñas, sesiones, IPs ni correos personales.
- `database/init.sql` fue eliminado; ya no se versionan usuarios ni sesiones.
- `docker compose config`, `bunx tsc --noEmit`, `bun run lint` y `bun run build` pasan. El fallo de `/_global-error` se corrigió eliminando `NODE_ENV=development` del servicio `frontend`; `next dev` y `next build` gestionan ese valor.
- La prueba se repite en un segundo entorno o en CI con puertos alternativos `3001/8081`.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| `database/init.sql` expone hash, correo y sesiones | Rotar contraseña, invalidar sesiones y reemplazar el dump en Fase 2 |
| Las imágenes no tienen licencia documentada | Completar `seed/CREDITS.md` o reemplazarlas antes de commitear |
| El plugin montado read-only no se actualiza solo | Versionarlo en `wp_content` y documentar el procedimiento de actualización |
| El seed se desactualiza respecto a WordPress | Exportar antes de cada release y validar en CI |
| La caché ISR muestra datos viejos tras importar | Importar antes de la primera visita, esperar 15-30 s o añadir revalidación explícita |
| Crecimiento de binarios en Git | Versionar solo originales; evaluar LFS si `seed/media` supera ~50 MB |
| Duplicación al ejecutar sobre el entorno actual | Adopción por slug/clave y fallback por autor+contenido; probar con `--dry-run` |

## Decisión pendiente

Recomiendo implementar **Fase 1 + Fase 2 en la misma rama**, con estos valores por defecto:

- Autor genérico `Redacción UNETI`, sin exportar usuarios reales.
- Imágenes actuales solo si se puede documentar su licencia; si no, reemplazarlas.
- `schemaVersion: 1`, sin Git LFS.
- `seed/` como fuente del fixture; `wp_content/` solo como vendor.

Antes de implementar hay que separar el movimiento actual de `PROGRESS.md` e `implementation_plan.md` a `Documents/`, que sigue sin commit.

¿Implemento Fase 1 + Fase 2, o prefieres primero solo Fase 1 para validar el seed en tu otra laptop? Para ejecutar los cambios, cambia a **Act mode**.