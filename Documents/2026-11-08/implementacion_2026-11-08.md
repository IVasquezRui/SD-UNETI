# Implementación del plan 2026-11-08

Informe de ejecución de los 22 puntos de `Documents/2026-11-08/doc-as-code_2026-11-08.md`.
Todo el trabajo se realizó **solo sobre `SD-UNETI/`**, con un commit descriptivo por punto y PRs
temáticos a `main`.

## Resumen

| Dato | Valor |
| --- | --- |
| Puntos del plan | 22 (21 numerados + 4.1) |
| Commits de implementación | 30 |
| PRs temáticos | 6 (más el PR base) |
| Ramas | `grupo-1-ui-portada`, `grupo-2-carreras-posgrados`, `grupo-3-nosotros`, `grupo-4-responsive`, `grupo-5-hardening`, `grupo-6-docs` |
| QA final | 29/29, 120 enlaces e imágenes, 0 brechas |
| Pentest | 26/26, 0 brechas |
| Formularios | 12/12, 0 brechas |

## PRs publicados

| PR | Rama | Contenido |
| --- | --- | --- |
| #1 | `develop` | Estado del portal al 05/11 (posgrados, TFSA, ISR, renovación visual) |
| #2 | `grupo-1-ui-portada` | Puntos 10, 12, 13, 15 (portada), 16, 17 y 18 |
| #3 | `grupo-2-carreras-posgrados` | Puntos 4, 4.1, 8, 11, 19 y 20 |
| #4 | `grupo-3-nosotros` | Puntos 3, 6, 9, 14 y 15 (detalle) |
| #5 | `grupo-4-responsive` | Puntos 1, 2, 5, 7 y 22 |
| #6 | `grupo-5-hardening` | Punto 21 |
| #7 | `grupo-6-docs` | Este informe, QA y `PROGRESS.md` |

## Detalle por punto

| # | Punto | Estado | Implementación |
| --- | --- | --- | --- |
| 1 | Alinear animación TFSA | Hecho | `.uneti-tfsa__pulse` centra halo e icono; keyframe con `translate(-50%,-50%)` |
| 2 | Formularios móviles y responsive | Hecho | `origenValido` acepta el host real; ajuste compacto "Fit" |
| 3 | Storytelling con parallax | Hecho | El bloque baja de −40 px a +180 px, cambia por punto y muestra barra de progreso |
| 4 | Ficha del programa | Hecho | Sin ítem "Título"; "Salidas profesionales" → **Títulos obtenidos** |
| 4.1 | Títulos centrados | Hecho | Tarjetas centradas con degradado azul-morado |
| 5 | Justificación tipográfica | Hecho | Justificado general; botones y flashcards excluidos |
| 6 | Flashcards sin artefactos | Hecho | Transición 2D de opacidad; sin `preserve-3d` ni `rotateY` |
| 7 | CTA de cursos | Hecho | "Solicitar información" con WhatsApp genérico |
| 8 | Quitar "Comunidad UNETI" en carreras/posgrados | Hecho | `PieSitio` con `conPrefooter={false}` |
| 9 | Componente de redes en Nosotros | Hecho | `RedesSocialesDetalle` con imágenes de `STUDENTS` y animación |
| 10 | Redes en la portada | Hecho | `RedesSocialesResumen` sustituye el bloque de YouTube |
| 11 | Narrativa de territorio | Hecho | Solo dos sedes propias + cobertura vía CANTV/Movilnet, Infocentros y convenios |
| 12 | Cursos reales en la portada | Hecho | Cuatro tarjetas enlazadas a `/cursos#curso-<slug>`, sin imágenes |
| 13 | Retirar `nosotros-fondo` y `nosotros-equipo` | Hecho | Eliminadas de storytelling, "Somos UNETI", collage y prefooter |
| 14 | Orden de Nosotros | Hecho | "Conoce nuestra casa de estudios" tras el parallax; "Tu ruta" fuera de Nosotros |
| 15 | Flashcards de modalidad híbrida | Hecho | Cuatro tarjetas en la portada y detalle territorial en `/nosotros#modalidad` |
| 16 | Mover "Tu ruta" a la portada | Hecho | `RutaUNETI` reemplaza "Ecosistema UNETI" |
| 17 | Dos últimas imágenes en el hero | Hecho | `EquipoDeDesarrolloDeSoftware.jpg` + `DiLorenzoEnseña.jpg` |
| 18 | Viñeta de color por curso | Hecho | `color` en `Curso`; vineta en portada y `/cursos` |
| 19 | Títulos centrados en el PNF | Hecho | Etapas TSU/Ingeniería centradas con azul-morado |
| 20 | "Otra ruta" con PNFA | Hecho | Los 7 PNFA enlazados a `/posgrados#slug` |
| 21 | Hardening SOC 2 / ISO 27001 / ISO 27701 | Hecho | Ver `Documents/seguridad/2026-11-08-hardening.md` |
| 22 | Navegación rápida | Hecho | Secciones, anclas de cursos y "Títulos obtenidos" actualizados |

## Cambios estructurales destacados

### Portada
- Hero con solo dos imágenes y sin `mobileSrc` (no existen versiones móviles de esas fotos).
- Orden final: hero, **Tu ruta**, Somos UNETI, Programas, **Modalidad híbrida**, Preguntas,
  **Cursos**, Testimonios, Vida universitaria, **Redes sociales**, Noticias.
- Se eliminan `SeccionSoporte`, `SeccionVideo`, `BotonVideo`, `SeccionInnovacion` y `AREAS_INNOVACION`.

### Carreras y posgrados
- `ResumenCarrera` sin "Título" y con "Títulos obtenidos" en tarjetas centradas.
- `[slug]` con títulos progresivos centrados y los PNFA en "Otra ruta".
- `PieSitio` admite `conPrefooter` para las vistas que no muestran la banda de comunidad.

### Nosotros
- Storytelling no sticky con desplazamiento y barra de progreso.
- Flashcards con transición 2D.
- `RedesSocialesDetalle` ocupa el lugar de la banda "Comunidad UNETI".
- "Conoce nuestra casa de estudios" justo después del parallax.
- Detalle del modelo híbrido territorial con las cuatro alianzas.

### Responsive y móvil
- Los formularios aceptan `Origin` de la IP de LAN cuando coincide con el host de la petición.
- Campos de 48 px y 16 px, acciones a ancho completo y TFSA adaptado.
- Hero, cabeceras, secciones y tarjetas compactadas en pantallas pequeñas.

### Seguridad y privacidad
- Comparación de tokens en tiempo constante y límites de cuerpo por ruta.
- Rate limiting en todas las rutas que escriben o consultan en exceso.
- Cabeceras COOP/CORP, CSP endurecida, `proxy.ts` para TRACE/TRACK.
- `/privacidad`, `security.txt`, `robots.txt`, `sitemap.xml`.
- WordPress, Apache, PHP y Docker endurecidos; retención de 12 meses.

## Verificación final

```text
npx tsc --noEmit            → sin errores
npm run lint                → sin errores
npm run build               → correcto (ISR activo)
docker compose config -q    → correcto
docker compose ps           → 3 contenedores healthy
qa-frontend.sh              → POSITIVO (29 comprobaciones, 0 brechas)
probar-formulario.mjs       → POSITIVO (12 comprobaciones, 0 brechas)
pentest-nextjs.sh           → POSITIVO (26 comprobaciones, 0 brechas)
```
