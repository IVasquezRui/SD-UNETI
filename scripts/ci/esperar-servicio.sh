#!/usr/bin/env bash
# Espera a que una URL responda con HTTP 2xx/3xx.
set -euo pipefail

url="${1:?Uso: esperar-servicio.sh URL [intentos]}"
intentos="${2:-60}"

for intento in $(seq 1 "$intentos"); do
  if curl -fsS -o /dev/null --max-time 5 "$url"; then
    echo "Servicio disponible: $url (intento $intento)"
    exit 0
  fi
  sleep 2
done

echo "ERROR: $url no respondió después de $intentos intentos." >&2
exit 1
