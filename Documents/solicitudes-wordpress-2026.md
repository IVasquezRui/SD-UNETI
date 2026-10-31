# Solicitudes UNETI 2026 — CPT, REST y exportación

> Implementación nativa de WordPress para recibir las solicitudes del formulario de admisiones y los mensajes de contacto del portal SD-UNETI.

## 1. Flujo

```text
Navegador
   │  POST /api/admisiones (JSON)
   ▼
Next.js (route handler)
   │  valida, aplica rate limit y añade X-UNETI-Token
   ▼
WordPress REST: POST /wp-json/uneti/v1/solicitudes
   │  valida y sanea
   ▼
wp_posts (post_type = solicitud_uneti, post_status = private)
wp_postmeta (campos _uneti_*)
wp_term_relationships (estado_solicitud)
   │
   ├── WP Admin → Solicitudes UNETI
   └── Exportar CSV / WP All Export
```

El token vive solo en el servidor de Next.js (`WP_FORM_TOKEN`). El navegador nunca lo recibe.

## 2. Modelo de datos

| Elemento | Valor |
|---|---|
| Custom Post Type | `solicitud_uneti` |
| Estado del post | `private` |
| Taxonomía | `estado_solicitud` |
| Estados | `nueva`, `en_revision`, `contactada`, `admitida`, `descartada` |
| Título | `Solicitud de admisión/contacto — Nombre — Fecha` |
| Autor | `0` (solicitud anónima) |

### Metadatos

| Meta key | Contenido |
|---|---|
| `_uneti_folio` | `UNETI-2026-000123` |
| `_uneti_tipo` | `admision` o `contacto` |
| `_uneti_nombre` | Nombre completo |
| `_uneti_cedula` | Cédula normalizada |
| `_uneti_correo` | Correo validado |
| `_uneti_telefono` | Teléfono |
| `_uneti_programa` | PNF de interés |
| `_uneti_asunto` | Asunto (contacto) |
| `_uneti_mensaje` | Mensaje |
| `_uneti_consentimiento` | `si` |
| `_uneti_origen` | URL de origen |
| `_uneti_fecha` | Fecha del servidor |
| `_uneti_ip_hash` | SHA-256 con `wp_salt('auth')` |
| `_uneti_user_agent` | Navegador truncado a 255 caracteres |

No se guarda la IP cruda.

## 3. Endpoint REST

- Método: `POST`.
- Ruta: `/wp-json/uneti/v1/solicitudes`.
- Cabecera obligatoria: `X-UNETI-Token`.
- Respuesta correcta: `201 { "ok": true, "folio": "UNETI-2026-000123", "id": 123 }`.
- `GET` responde `405`.
- Sin token o token inválido: `403`.
- Token no configurado: `503`.
- Payload inválido: `400`.
- Límite superado: `429`.

Ejemplo:

```bash
curl -X POST http://localhost:8080/wp-json/uneti/v1/solicitudes \
  -H "Content-Type: application/json" \
  -H "X-UNETI-Token: $UNETI_FORM_TOKEN" \
  -d '{
    "tipo": "admision",
    "nombre": "María Pérez",
    "cedula": "12345678",
    "correo": "maria@example.com",
    "telefono": "0212-505-1402",
    "programa": "PNF en Informática",
    "mensaje": "Quiero iniciar el proceso de admisión.",
    "consentimiento": true,
    "origen": "http://localhost:3000/admisiones",
    "inicio": 1
  }'
```

## 4. Panel de administración

1. Entra a `http://localhost:8080/wp-admin`.
2. Menú **Solicitudes**.
3. Columnas: folio, nombre, cédula, correo, teléfono, programa, tipo, estado y fecha.
4. Abre una solicitud para ver el detalle completo.
5. Cambia el estado desde la taxonomía **Estados**.

El rol Editor puede gestionar las solicitudes. Para un analista, crea un usuario con rol Editor y no compartas la cuenta de administrador.

## 5. Exportación

### CSV nativo

En el listado de **Solicitudes**, pulsa **Exportar CSV**. Se descarga un archivo UTF-8 con BOM y separador `;`, compatible con Excel en español.

### WP All Export

1. Instala **WP All Export** desde `Plugins → Añadir nuevo`.
2. Crea una exportación y selecciona **Solicitudes UNETI**.
3. Arrastra los campos deseados, incluidos los metadatos `_uneti_*`.
4. Exporta a CSV o Excel.

También funciona **Export any WordPress data to XML/CSV** con el mismo CPT.

## 6. Seguridad y privacidad

- Token servidor-a-servidor con `hash_equals`.
- Honeypot `sitio_web` y control de tiempo mínimo de llenado.
- Límite de 5 solicitudes por hora por IP y 200 por hora global.
- Validación y saneamiento en Next.js y en WordPress.
- `show_in_rest = false` y `public = false` para el CPT.
- Sin exposición del CPT en WPGraphQL.
- Sitemap de usuarios bloqueado y acceso directo a `mu-plugins` denegado.
- IP almacenada solo como hash.
- Exportación protegida con nonce y capacidad `edit_others_posts`.
- CSV protegido contra inyección de fórmulas.
- Datos personales: acceso restringido a Administradores y Editores.

## 7. Pruebas

- `scripts/ci/probar-wordpress.sh`: CPT, REST, token, validación y persistencia.
- `scripts/ci/probar-formulario.mjs`: flujo Next.js → WordPress, errores, honeypot y rate limit.
- `04-formulario.yml`: ejecuta el flujo completo y verifica el folio en MariaDB.

## 8. Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| `503` | `UNETI_FORM_TOKEN` vacío | Definirlo en `.env` y reiniciar WordPress/Next.js. |
| `403` | Token distinto entre contenedores | Verificar que ambos servicios reciban el mismo `UNETI_FORM_TOKEN`. |
| `429` | Límite de intentos | Esperar una hora o limpiar los transients en desarrollo. |
| `502` | WordPress no responde | Revisar `docker compose logs wordpress`. |
| El folio no aparece | El CPT no está registrado | Verificar el montaje de `scripts/wordpress/mu-plugins` y reiniciar WordPress. |
