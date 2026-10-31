#!/usr/bin/env bash
# Utilidades compartidas por los scripts de QA y pentesting.
# Se cargan con: source "$(dirname "$0")/comun.sh"

VERDE="\033[0;32m"
ROJO="\033[0;31m"
AMARILLO="\033[0;33m"
SIN_COLOR="\033[0m"

FALLOS=0
OKS=0
REPORTE="${REPORTE:-reportes/reporte.md}"

mkdir -p "$(dirname "$REPORTE")"

function registrar_ok() {
  OKS=$((OKS + 1))
  printf "${VERDE}[POSITIVO]${SIN_COLOR} %s\n" "$1"
  printf -- '- [POSITIVO] %s\n' "$1" >> "$REPORTE"
}

function registrar_fallo() {
  FALLOS=$((FALLOS + 1))
  printf "${ROJO}[NEGATIVO]${SIN_COLOR} %s\n" "$1"
  printf -- '- [NEGATIVO] %s\n' "$1" >> "$REPORTE"
}

function registrar_aviso() {
  printf "${AMARILLO}[AVISO]${SIN_COLOR} %s\n" "$1"
  printf -- '- [AVISO] %s\n' "$1" >> "$REPORTE"
}

function estado_http() {
  curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$@"
}

function cerrar_reporte() {
  echo
  if [ "$FALLOS" -eq 0 ]; then
    echo "RESULTADO GENERAL: POSITIVO ($OKS comprobaciones, 0 brechas)"
    printf '\n**RESULTADO GENERAL: POSITIVO** (%s comprobaciones, 0 brechas)\n' "$OKS" >> "$REPORTE"
    exit 0
  fi

  echo "RESULTADO GENERAL: NEGATIVO ($FALLOS brechas, $OKS comprobaciones correctas)"
  printf '\n**RESULTADO GENERAL: NEGATIVO** (%s brechas)\n' "$FALLOS" >> "$REPORTE"
  exit 1
}

function iniciar_reporte() {
  printf '# %s\n\n' "$1" > "$REPORTE"
  printf 'Fecha: %s\n\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" >> "$REPORTE"
}
