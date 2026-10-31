# 1 - Diseño de la vista en el repo principal en la rama main:

"
Crea y/o actualiza el archivo `README.md` en la raíz del repositorio con una documentación técnica de alto nivel, atractiva y completamente formateada en Markdown, orientada a la presentación del proyecto **Soberanía Digital 2026-2030** para la Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI).

El `README.md` debe incluir la siguiente estructura y contenido:

1. **Encabezado Institucional:**
   - Título impactante: `🇻🇪 Proyecto Soberanía Digital 2026-2030 — UNETI`
   - Un badge descriptivo del estado del proyecto (MVP v1.0, Next.js 16+, WordPress, Dockerized, License: MIT/Gobierno Abierto).
   - Una breve y potente declaración de la visión del portal institucional y la cara pública de la universidad.

2. **Visión General de la Arquitectura (Desacoplada):**
   - Resumen del enfoque decoupled / headless: **Frontend** dinámico, rápido y optimizado para SEO (Next.js App Router) separado del **Backend CMS** para gestión de contenidos institucionales y captación (WordPress + MariaDB vía WPGraphQL).
   - Beneficios clave: Alta velocidad, seguridad avanzada, separación de responsabilidades y soberanía tecnológica.

3. **Stack Tecnológico:**
   - **Frontend:** Next.js (App Router, React 19/18, TypeScript, Tailwind CSS).
   - **Backend / CMS:** WordPress Headless, WPGraphQL, MariaDB.
   - **Infraestructura:** Docker & Docker Compose (Orquestación multi-contenedor).
   - **Memoria Técnica Local:** Grafo de conocimiento indexado vía Node.js / Lookdown.

4. **Guía de Inicio Rápido (Quickstart / Onboarding para Desarrolladores):**
   - Requisitos previos (Git, Docker, Docker Compose).
   - Pasos detallados para clonar e iniciar el entorno con un solo comando:
     ```bash
     git clone [https://github.com/ivasquezrui/SD-UNETI.git](https://github.com/ivasquezrui/SD-UNETI.git)
     cd SD-UNETI
     cp .env.example .env
     docker compose up -d
     python3 scripts/seed/seed.py bootstrap
     ```
   - Indicaciones sobre el seed portable de `seed/`; no se usa un dump SQL previo.
   - Mapeo de puertos para el entorno local:
     - Portal Frontend: `http://localhost:3000`
     - WordPress GraphQL/Admin: `http://localhost:8080/wp-admin` / `http://localhost:8080/graphql`

5. **Estructura del Proyecto:**
   - Árbol de directorios simplificado explicando el propósito de `frontend/`, `database/`, `docker-compose.yml`, scripts de indexación y archivos de configuración.

7. **Contribución y Licencia:**
   - Guía corta para colaboradores del proyecto.
   - Mención del compromiso técnico con la Soberanía Tecnológica e Innovación Educativa Universitaria de Venezuela.
"

# 2 - probar si automaticamnete las noticias creadas se muestran en el front
- despues de probar el repositorio en otra maquina, se ve afectado el panel de noticias porque wp_data contiene en la carpeta wp_content todas las iamgenes de las noticias y de la gran mayoria de la pagina. Pero el directorio wp_content que funciona como respaldo no tiene la información actualizada. Hay que acualizarle un nuevo respaldo, y ver si el comando automatizado para seed de datos del contenedor docker resuelve esto, o hay que hacer una funcion que haga de seed del respaldoque hay en el directorio raiz wp_content.

> Resuelto: `database/init.sql` se eliminó. Las 6 noticias, sus imágenes y comentarios viven en `seed/`; `python3 scripts/seed/seed.py bootstrap` reconstruye un entorno limpio y `verify` comprueba GraphQL, comentarios e imágenes.

# 3 - Preparar despliegue productivo con reverse proxy, TLS, backups y monitoreo.

# 4 - implementar sisu

# 5 - implemetar sis-uneti, y que todos sean una plataforma unificada

# 6 - actualizar y mejorar script de grafo para que el agente realmente utilice la bóveda de rutas y conocimiento sobre el proyecto, para no gastar tantos tokens.

# 7 - prompt para refactorizar y mejorar bóveda de grafo y hacer un harness universal para mis desarrollos:

/deep-planning
Analiza la siguinete regla:

"
# ==========================================
# PROTOCOLO DE NAVEGACIÓN POR GRAFO (LOOKDOWN)
# ==========================================

## 1. PROHIBICIÓN DE EXPLORACIÓN CIEGA A LA TERMINAL
- Queda ESTRICTAMENTE PROHIBIDO utilizar comandos de la terminal para buscar texto o estructura (`grep -r`, `find .`, `cat .`, `ls` masivos) con el fin de entender el proyecto.
- No gastes tokens explorando directorios que ya han sido mapeados.

## 2. OBLIGACIÓN DE CONSULTA EN LA BÓVEDA
Antes de modificar, crear o analizar cualquier archivo en el proyecto, DEBES seguir este orden estricto:
1. **Consulta el Índice Maestro:** Lee el archivo `lookdown/INDEX.md` para ubicar la ruta exacta del componente o módulo.
2. **Lee la Ficha del Nodo:** Si necesitas entender de qué depende un archivo o a quién llama, abre directamente su ficha en `lookdown/nodes/[nombre_del_archivo].md`.
3. **Acción Directa:** Con base en las conexiones `[[Wikilinks]]` de la ficha del grafo, ve directo a editar o leer el archivo de código fuente necesario.

## 3. ACTUALIZACIÓN POST-CAMBIO
- Si creas un archivo nuevo o modificas la estructura del proyecto, recuerda ejecutar al terminar en la terminal: `node build_graph.js` para mantener sincronizados los grafos y la bóveda de Obsidian.
"

Bien sabes que existe el la carpeta lookdown y el script js que "indexa" la gran mayoría de archivos tanto en Wordpress como en el Frontend.

Lo que quiero que hagas acontinuación es que pienses bien en cómo sería la boveda/archivo de grafo como mapa para un agente de codigo (ejemplo -> tu),  idonea para guiarte y utilizar menos tokens y menos flujo de trabajo "buscando archivos" que estaran plasmados en ese mapa de grafos .md... Puede ser con fases, reglamentos, segmentación de información, etc... LO que mejor se adapte a gastar menos tokens y ayude a un agente de codigo como tu a desarrollar de forma más eficiente. Algo como un harness quiero que hagas en la carpeta @lookdown para que gastes menos tokens, seas tu u otro agente más rentable al basarte en la información precisa que exista allí, y que sea un script python multi-lenguaje ya que vas a mapear en este proyecto archivos con lenguajes y extensiones como .js, .ts, .php, .sql, .jpg, entre otros relevantes.

# 8 - Fase 5 — Renovación UI/UX 2026 (en curso)

> Documento de fase: `Documents/fase-5-ui-ux-2026.md`.

- [x] Retirar el runtime jQuery y reimplementar las interacciones como componentes React.
- [x] Corregir el selector `[class*=ti-]` de `style.css` que rompía las clases `uneti-*`.
- [x] Renovar portada, collage de Nosotros y cabeceras de Carreras con imágenes WebP institucionales.
- [x] Añadir `imagePosition` a `TituloPagina` y renumerar los pasos de admisión (`1–4`).
- [x] Crear la ruta `/cursos` (`lib/cursos.ts`, `TarjetaCurso.tsx`, `app/cursos/page.tsx`) y su CSS.
- [ ] Sustituir el hero por `UNETI-STUDENTS/WhatsApp Image 2026-10-29 at 10.33.46 (1).jpeg` con variante móvil.
- [ ] Construir el organigrama institucional animado en `/nosotros` a partir de `organigrama-uneti-2026.pdf`.
- [ ] Verificar `/`, `/nosotros`, `/carreras`, `/cursos`, `/admisiones`, `/contacto` y `/noticias` a 1440 px y 390 px.
- [ ] Auditar accesibilidad (contraste, foco, `prefers-reduced-motion`) y peso de imágenes.

# 9 - Fase 6 — Despliegue productivo

- Reverse proxy, TLS, backups y monitoreo (ver `PROGRESS.md` §10).