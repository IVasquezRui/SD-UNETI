#!/usr/bin/env bash
# Pruebas funcionales y de configuración de WordPress.
set -euo pipefail

source "$(dirname "$0")/comun.sh"

WP="${WP_URL:-http://localhost:8080}"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

TOKEN="${UNETI_FORM_TOKEN:-ci-form-token}"
REPORTE="reportes/wordpress.md"
iniciar_reporte "Pruebas de WordPress"

if ! docker compose ps --status running --services 2>/dev/null | grep -qx wordpress; then
  registrar_fallo "El contenedor wordpress no está corriendo"
  cerrar_reporte
fi

# Limpia los límites de intentos de ejecuciones anteriores.
docker compose exec -T wordpress php -r '
require "/var/www/html/wp-load.php";
global $wpdb;
$wpdb->query( "DELETE FROM " . $wpdb->options . " WHERE option_name LIKE \"_transient_uneti_solicitud_%\" OR option_name LIKE \"_transient_timeout_uneti_solicitud_%\" OR option_name = \"_transient_uneti_solicitud_global\" OR option_name = \"_transient_timeout_uneti_solicitud_global\"" );
' >/dev/null 2>&1 || true

# REST y WPGraphQL
codigo="$(estado_http "$WP/wp-json/")"
if [ "$codigo" = "200" ]; then
  registrar_ok "La API REST de WordPress responde 200"
else
  registrar_fallo "La API REST de WordPress respondió $codigo"
fi

codigo="$(estado_http "$WP/graphql")"
if [ "$codigo" = "200" ] || [ "$codigo" = "405" ] || [ "$codigo" = "400" ]; then
  registrar_ok "WPGraphQL está publicado en /graphql"
else
  registrar_fallo "WPGraphQL respondió $codigo en /graphql"
fi

# CPT y taxonomía
if [ "$(docker compose exec -T wordpress php -r 'require "/var/www/html/wp-load.php"; echo post_type_exists("solicitud_uneti") ? "ok" : "no";' 2>/dev/null)" = "ok" ]; then
  registrar_ok "El CPT solicitud_uneti está registrado"
else
  registrar_fallo "El CPT solicitud_uneti no está registrado"
fi

if [ "$(docker compose exec -T wordpress php -r 'require "/var/www/html/wp-load.php"; echo taxonomy_exists("estado_solicitud") ? "ok" : "no";' 2>/dev/null)" = "ok" ]; then
  registrar_ok "La taxonomía estado_solicitud está registrada"
else
  registrar_fallo "La taxonomía estado_solicitud no está registrada"
fi

# Endpoint de solicitudes: método, token y validación
codigo="$(estado_http "$WP/wp-json/uneti/v1/solicitudes")"
if [ "$codigo" = "405" ]; then
  registrar_ok "GET /solicitudes responde 405"
else
  registrar_fallo "GET /solicitudes respondió $codigo (se esperaba 405)"
fi

codigo="$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' --data '{}' "$WP/wp-json/uneti/v1/solicitudes")"
if [ "$codigo" = "403" ]; then
  registrar_ok "POST /solicitudes sin token responde 403"
else
  registrar_fallo "POST /solicitudes sin token respondió $codigo (se esperaba 403)"
fi

codigo="$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' -H 'X-UNETI-Token: token-incorrecto' --data '{}' "$WP/wp-json/uneti/v1/solicitudes")"
if [ "$codigo" = "403" ]; then
  registrar_ok "POST /solicitudes con token inválido responde 403"
else
  registrar_fallo "POST /solicitudes con token inválido respondió $codigo"
fi

codigo="$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' -H "X-UNETI-Token: $TOKEN" --data '{"tipo":"admision","nombre":"A","correo":"invalido","telefono":"1","consentimiento":false}' "$WP/wp-json/uneti/v1/solicitudes")"
if [ "$codigo" = "400" ]; then
  registrar_ok "POST /solicitudes inválido responde 400"
else
  registrar_fallo "POST /solicitudes inválido respondió $codigo (se esperaba 400)"
fi

RESPUESTA="$(mktemp)"
trap 'rm -f "$RESPUESTA"' EXIT

codigo="$(curl -s -o "$RESPUESTA" -w '%{http_code}' -X POST \
  -H 'Content-Type: application/json' \
  -H "X-UNETI-Token: $TOKEN" \
  --data '{"tipo":"admision","nombre":"Prueba CI","cedula":"12345678","correo":"ci@example.com","telefono":"0212-505-1402","programa":"PNF en Informática","mensaje":"Solicitud de prueba automatizada.","consentimiento":true,"origen":"http://localhost:3000/admisiones","inicio":1}' \
  "$WP/wp-json/uneti/v1/solicitudes")"

if [ "$codigo" = "201" ] && grep -q '"folio"' "$RESPUESTA"; then
  registrar_ok "POST /solicitudes válido responde 201 con folio"
else
  registrar_fallo "POST /solicitudes válido respondió $codigo"
  cat "$RESPUESTA" >> "$REPORTE" || true
fi

CORREO_GUARDADO="$(docker compose exec -T wordpress php -r '
require "/var/www/html/wp-load.php";
$posts = get_posts( array( "post_type" => "solicitud_uneti", "post_status" => "private", "numberposts" => 1, "orderby" => "ID", "order" => "DESC" ) );
if ( ! $posts ) { echo "sin-posts"; exit; }
echo get_post_meta( $posts[0]->ID, "_uneti_correo", true );
' 2>/dev/null | tr -d '\r')"

if [ "$CORREO_GUARDADO" = "ci@example.com" ]; then
  registrar_ok "La solicitud se guardó en wp_posts/wp_postmeta"
else
  registrar_fallo "No se encontró la solicitud guardada (valor: $CORREO_GUARDADO)"
fi

# Endurecimiento básico
codigo="$(estado_http "$WP/wp-json/wp/v2/users")"
if [ "$codigo" = "401" ] || [ "$codigo" = "403" ] || [ "$codigo" = "404" ]; then
  registrar_ok "El listado REST de usuarios está bloqueado ($codigo)"
else
  registrar_fallo "El listado REST de usuarios responde $codigo"
fi

codigo="$(estado_http "$WP/?author=1")"
if [ "$codigo" = "301" ] || [ "$codigo" = "302" ] || [ "$codigo" = "404" ]; then
  registrar_ok "La enumeración por ?author=1 está bloqueada ($codigo)"
else
  registrar_fallo "La enumeración por ?author=1 responde $codigo"
fi

codigo="$(curl -s -o /dev/null -w '%{http_code}' -X POST --data '<?xml version="1.0"?><methodCall><methodName>system.listMethods</methodName></methodCall>' "$WP/xmlrpc.php")"
if [ "$codigo" = "403" ] || [ "$codigo" = "405" ] || [ "$codigo" = "404" ]; then
  registrar_ok "XML-RPC está deshabilitado ($codigo)"
else
  registrar_fallo "XML-RPC responde $codigo"
fi

for recurso in "readme.html" "license.txt" "wp-config.php.bak" ".env"; do
  codigo="$(estado_http "$WP/$recurso")"
  if [ "$codigo" = "403" ] || [ "$codigo" = "404" ]; then
    registrar_ok "El recurso /$recurso está bloqueado ($codigo)"
  else
    registrar_fallo "El recurso /$recurso responde $codigo"
  fi
done

codigo="$(estado_http "$WP/wp-content/uploads/")"
if [ "$codigo" = "403" ] || [ "$codigo" = "404" ]; then
  registrar_ok "El listado de uploads está deshabilitado ($codigo)"
else
  registrar_fallo "El listado de uploads responde $codigo"
fi

CABECERAS="$(curl -sSI "$WP/wp-login.php" | tr -d '\r')"
for cabecera in "x-content-type-options: nosniff" "x-frame-options: SAMEORIGIN" "referrer-policy: strict-origin-when-cross-origin"; do
  if printf '%s' "$CABECERAS" | grep -qi "^$cabecera"; then
    registrar_ok "Cabecera presente: $cabecera"
  else
    registrar_fallo "Falta la cabecera: $cabecera"
  fi
done

if printf '%s' "$CABECERAS" | grep -qi '^x-pingback:'; then
  registrar_fallo "La cabecera X-Pingback sigue expuesta"
else
  registrar_ok "La cabecera X-Pingback no se expone"
fi

cerrar_reporte

