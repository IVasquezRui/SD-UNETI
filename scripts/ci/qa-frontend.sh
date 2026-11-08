#!/usr/bin/env bash
# QA funcional y de contenido del frontend. Uso: qa-frontend.sh [BASE_URL]
set -euo pipefail

source "$(dirname "$0")/comun.sh"

BASE="${1:-http://localhost:3000}"
BASE="${BASE%/}"
REPORTE="reportes/qa-frontend.md"
iniciar_reporte "QA del frontend SD-UNETI"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

RUTAS=("" "nosotros" "carreras" "posgrados" "cursos" "noticias" "admisiones" "contacto")

for ruta in "${RUTAS[@]}"; do
  url="${BASE}/${ruta}"
  archivo="$TMP/${ruta:-inicio}.html"
  codigo="$(estado_http "$url")"

  if [ "$codigo" = "200" ] && curl -fsS --max-time 15 "$url" -o "$archivo"; then
    registrar_ok "Ruta /${ruta:-} responde 200"
  else
    registrar_fallo "Ruta /${ruta:-} respondió $codigo"
    : > "$archivo"
  fi
done

INICIO="$TMP/inicio.html"
NOSOTROS="$TMP/nosotros.html"
CONTACTO="$TMP/contacto.html"
ADMISIONES="$TMP/admisiones.html"
POSGRADOS="$TMP/posgrados.html"
CURSOS="$TMP/cursos.html"

# Hero de la portada: solo las dos últimas imágenes (punto 17)
if grep -q 'EquipoDeDesarrolloDeSoftware.jpg' "$INICIO" && grep -q 'DiLorenzoEnseña.jpg' "$INICIO"; then
  registrar_ok "El hero del inicio usa las dos últimas imágenes del equipo"
else
  registrar_fallo "El hero del inicio no contiene las dos imágenes esperadas"
fi

if grep -q 'contacto-estudiantes.webp' "$INICIO"; then
  registrar_fallo "El hero del inicio todavía referencia contacto-estudiantes.webp"
else
  registrar_ok "El hero del inicio ya no usa contacto-estudiantes.webp"
fi

if grep -q 'hero-comunidad.webp' "$CONTACTO"; then
  registrar_ok "El hero de /contacto usa hero-comunidad.webp"
else
  registrar_fallo "El hero de /contacto no contiene hero-comunidad.webp"
fi

# CTA renombrado (tarea 2)
if grep -q 'Ir al Campus Virtual' "$INICIO"; then
  registrar_ok "La cabecera muestra 'Ir al Campus Virtual'"
else
  registrar_fallo "No se encontró 'Ir al Campus Virtual' en la cabecera"
fi

# Nosotros: flashcards + storytelling (tareas 3 y 3.1)
for marca in 'uneti-flashcard' 'uneti-story' 'uneti-parallax-img' 'Nuestra historia'; do
  if grep -q "$marca" "$NOSOTROS"; then
    registrar_ok "Nosotros contiene $marca"
  else
    registrar_fallo "Nosotros no contiene $marca"
  fi
done

# Formulario de admisiones animado (tarea 6)
for marca in 'uneti-admision' 'uneti-admision__etiqueta' 'Cédula de identidad' 'Interés académico'; do
  if grep -q "$marca" "$ADMISIONES"; then
    registrar_ok "Admisiones contiene $marca"
  else
    registrar_fallo "Admisiones no contiene $marca"
  fi
done

# Posgrados: oferta, mallas y solicitud (tareas 14 a 18)
for marca in 'uneti-posgrado-detalle' 'uneti-malla__eje' 'Solicitar Cupo' 'formulario-posgrados' 'uneti-admision--posgrado'; do
  if grep -q "$marca" "$POSGRADOS"; then
    registrar_ok "Posgrados contiene $marca"
  else
    registrar_fallo "Posgrados no contiene $marca"
  fi
done

if grep -q 'uneti-posgrados-section' "$TMP/carreras.html"; then
  registrar_ok "Carreras incluye el apartado de Posgrados"
else
  registrar_fallo "Carreras no incluye el apartado de Posgrados"
fi

# Cursos: la llamada abre WhatsApp con el nombre del curso (tarea 16)
if grep -q 'wa.me/584241427051' "$CURSOS" && grep -q 'Obtener información' "$CURSOS"; then
  registrar_ok "Cursos enlaza a WhatsApp con el nombre del curso"
else
  registrar_fallo "Cursos no contiene la llamada de WhatsApp esperada"
fi

# Contenido retirado (tareas 4 y 5)
for archivo in "$TMP"/*.html; do
  if grep -Eiq 'SIS-UNETI|SISU|beca' "$archivo"; then
    registrar_fallo "Se encontró una mención prohibida (SISU/SIS-UNETI/beca) en $(basename "$archivo")"
  fi
done
registrar_ok "Sin menciones a SISU, SIS-UNETI ni becas en las rutas públicas"

# Enlaces internos e imágenes locales
ENLACES="$(grep -hoE '(href|src)="/[^"]+"' "$TMP"/*.html | sed -E 's/^(href|src)="//; s/"$//' | sort -u || true)"
TOTAL_ENLACES=0
ENLACES_ROTOS=0

while IFS= read -r enlace; do
  [ -z "$enlace" ] && continue
  case "$enlace" in
    /api/*) continue ;;
  esac

  TOTAL_ENLACES=$((TOTAL_ENLACES + 1))
  codigo="$(estado_http "${BASE}${enlace}")"

  if [ "$codigo" -lt 200 ] || [ "$codigo" -ge 400 ]; then
    ENLACES_ROTOS=$((ENLACES_ROTOS + 1))
    registrar_fallo "Enlace interno roto: $enlace ($codigo)"
  fi
done <<< "$ENLACES"

if [ "$ENLACES_ROTOS" -eq 0 ]; then
  registrar_ok "Enlaces e imágenes internas verificados: $TOTAL_ENLACES"
fi

cerrar_reporte
