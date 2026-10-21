# Seed portable de contenido

Fixtures versionados del sitio UNETI. Permiten reconstruir las noticias, sus
imágenes destacadas, categorías, etiquetas y comentarios en una instalación
nueva de WordPress sin depender de `wp_data/` ni de un dump SQL.

## Contenido

| Ruta | Descripción |
|---|---|
| `site.json` | Título, opciones de lectura/comentarios, locale y autor genérico. |
| `taxonomies.json` | Categorías y etiquetas utilizadas por las noticias. |
| `media.json` | Inventario de originales con ruta, MIME, dimensiones y SHA-256. |
| `posts/*.json` | Una noticia por archivo, con sus comentarios. |
| `media/AAAA/MM/` | Solo imágenes originales; las variantes las genera WordPress. |
| `manifest.json` | Versión del esquema y conteos esperados. |
| `CREDITS.md` | Procedencia y licencia de las imágenes. |

## Uso

```bash
# Exportar el WordPress que está corriendo a seed/
python3 scripts/seed/seed.py export

# Validar los fixtures sin tocar WordPress
python3 scripts/seed/seed.py validate

# Importar de forma idempotente
python3 scripts/seed/seed.py import

# Reemplazar originales y regenerar miniaturas
python3 scripts/seed/seed.py import --refresh-media

# Verificar GraphQL, comentarios e imágenes
python3 scripts/seed/seed.py verify
```

Para una instalación desde cero:

```bash
cp .env.example .env
# Ajusta credenciales y URL
docker compose up -d
python3 scripts/seed/seed.py bootstrap
```

`bootstrap` instala WordPress si la base está vacía, activa WPGraphQL, importa
los fixtures y ejecuta la verificación. El script nunca escribe SQL ni manipula
MariaDB directamente: Python orquesta Docker y PHP usa las APIs nativas de
WordPress (`wp_insert_post`, `wp_insert_attachment`, `wp_insert_comment`).

## Privacidad

El export no incluye usuarios reales, hashes, sesiones ni IPs. Los posts se
asignan al autor genérico `Redacción UNETI` (`redaccion@example.com`) y solo se
conservan correos de comentarios con dominio `example.com`, `example.org` o
`example.net`.

## Marcas de idempotencia

Cada objeto importado guarda metadatos `_uneti_seed_*`:

- Posts: `_uneti_seed_key`.
- Adjuntos: `_uneti_seed_key`, `_uneti_seed_archivo`, `_uneti_seed_sha256`.
- Comentarios: `_uneti_seed_key`.

La importación busca primero por esas marcas. Si no existen, adopta por slug
(posts), por `_uneti_seed_archivo` o nombre de archivo (adjuntos) y por
autor + contenido (comentarios). Así no duplica el contenido de una instalación
que ya tenía las noticias creadas con el seed anterior.

## Placeholders de contenido

El HTML exportado normaliza las URLs para que el mismo fixture funcione en
cualquier host:

- `{{SITE_URL}}`: URL base del sitio.
- `{{UPLOADS_URL}}/`: URL base de `wp-content/uploads` (incluye variantes).
- `{{MEDIA_URL:clave}}`: URL pública del original.
- `{{MEDIA_ID:clave}}`: ID del adjunto dentro de clases `wp-image-*`.

La importación los resuelve con la URL y los IDs del entorno destino.
