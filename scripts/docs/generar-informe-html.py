#!/usr/bin/env python3
"""Genera la vista HTML del informe técnico de SD-UNETI.

El Markdown sigue siendo la fuente de verdad; este script solo lo presenta.
No usa dependencias externas: solo la biblioteca estándar.

Uso:
    python3 scripts/docs/generar-informe-html.py

Salida:
    Documents/informe-tecnico-2026-11-10.html
"""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
ORIGEN = RAIZ / "Documents" / "informe-tecnico-2026-11-10.md"
DESTINO = RAIZ / "Documents" / "informe-tecnico-2026-11-10.html"

AUTOR = "Iván Vásquez"
VERSION = "1.0"
FECHA = "10/11/2026"
COMMIT = "0658af1"

RE_H2 = re.compile(r"^##\s+(.+)$")
RE_H3 = re.compile(r"^###\s+(.+)$")
RE_H4 = re.compile(r"^####\s+(.+)$")
RE_NUM = re.compile(r"^(\d+)\.\s+(.+)$")
RE_SUB = re.compile(r"^(\d+\.\d+)\s+(.+)$")
RE_ANEXO = re.compile(r"^Anexo\s+([A-D])\s+—\s+(.+)$")
RE_ITEM = re.compile(r"^[-*]\s+(.+)$")
RE_TAREA = re.compile(r"^[-*]\s+\[([ xX])\]\s+(.+)$")
RE_ORDEN = re.compile(r"^(\d+)\.\s+(.+)$")
RE_SEP = re.compile(r"^:?-{3,}:?$")


def esc(texto: str) -> str:
    return html.escape(texto, quote=False)


def inline(texto: str) -> str:
    """Convierte el marcado inline del Markdown en HTML seguro."""
    codigos: list[str] = []

    def guardar(m: re.Match[str]) -> str:
        codigos.append(m.group(1))
        return f"\x00{len(codigos) - 1}\x00"

    texto = re.sub(r"`([^`]+)`", guardar, texto)
    texto = esc(texto)

    texto = re.sub(
        r"\[([^\]]+)\]\(([^)\s]+)\)",
        lambda m: '<a href="%s">%s</a>' % (m.group(2), m.group(1)),
        texto,
    )
    texto = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", texto)
    texto = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", texto)

    for indice, codigo in enumerate(codigos):
        texto = texto.replace(f"\x00{indice}\x00", f"<code>{esc(codigo)}</code>")

    return texto


def celdas(linea: str) -> list[str]:
    """Divide una fila de tabla respetando los pipes dentro de `código`."""
    fila = linea.strip()
    if fila.startswith("|"):
        fila = fila[1:]
    if fila.endswith("|"):
        fila = fila[:-1]

    partes: list[str] = []
    actual: list[str] = []
    en_codigo = False

    for caracter in fila:
        if caracter == "`":
            en_codigo = not en_codigo
        if caracter == "|" and not en_codigo:
            partes.append("".join(actual).strip())
            actual = []
        else:
            actual.append(caracter)

    partes.append("".join(actual).strip())
    return partes


def render_tabla(lineas: list[str]) -> str:
    cabecera = celdas(lineas[0])
    alineaciones: list[str] = []

    for separador in celdas(lineas[1]) if len(lineas) > 1 else []:
        if RE_SEP.match(separador):
            if separador.startswith(":") and separador.endswith(":"):
                alineaciones.append("center")
            elif separador.endswith(":"):
                alineaciones.append("right")
            else:
                alineaciones.append("left")
        else:
            alineaciones.append("left")

    def celda(tag: str, valor: str, indice: int) -> str:
        alineacion = alineaciones[indice] if indice < len(alineaciones) else "left"
        estilo = f' style="text-align:{alineacion}"' if alineacion != "left" else ""
        return f"<{tag}{estilo}>{inline(valor)}</{tag}>"

    filas = [
        "<tr>" + "".join(celda("th", valor, i) for i, valor in enumerate(cabecera)) + "</tr>"
    ]

    for linea in lineas[2:]:
        valores = celdas(linea)
        if not any(valores):
            continue
        filas.append(
            "<tr>" + "".join(celda("td", valor, i) for i, valor in enumerate(valores)) + "</tr>"
        )

    return (
        '<div class="tabla-envoltura">\n<table class="tabla">\n<thead>\n'
        + filas[0]
        + "\n</thead>\n<tbody>\n"
        + "\n".join(filas[1:])
        + "\n</tbody>\n</table>\n</div>"
    )


def render_codigo(lenguaje: str, lineas: list[str]) -> str:
    etiqueta = lenguaje.strip() or "texto"
    cuerpo = esc("\n".join(lineas))
    return (
        f'<div class="bloque-codigo" data-lenguaje="{esc(etiqueta)}">'
        f'<pre><code class="lenguaje-{esc(etiqueta)}">{cuerpo}</code></pre></div>'
    )


FASES = """
<ul class="fases" aria-label="Fases del proyecto">
  <li class="fases__paso" data-estado="hecha"><b>Fase 0</b><span>MVP local</span></li>
  <li class="fases__paso" data-estado="hecha"><b>Fase 1</b><span>Seed portable</span></li>
  <li class="fases__paso" data-estado="hecha"><b>Fase 2</b><span>Portabilidad</span></li>
  <li class="fases__paso" data-estado="hecha"><b>Fase 3</b><span>CI y docs</span></li>
  <li class="fases__paso" data-estado="hecha"><b>Fase 4</b><span>Limpieza</span></li>
  <li class="fases__paso" data-estado="curso"><b>Fase 5</b><span>UI/UX · cierre</span></li>
  <li class="fases__paso" data-estado="pendiente"><b>Fase 6</b><span>Producción</span></li>
</ul>
"""

VEREDICTO = """
<div class="veredicto" role="list" aria-label="Semáforo de aptitud">
  <div class="veredicto__item" role="listitem" data-nivel="ok">
    <span class="veredicto__luz" aria-hidden="true"></span>
    <div><p class="veredicto__titulo">Funcionalidad</p><p class="veredicto__nota">11 rutas, noticias, comentarios, formularios y oferta completa.</p></div>
  </div>
  <div class="veredicto__item" role="listitem" data-nivel="ok">
    <span class="veredicto__luz" aria-hidden="true"></span>
    <div><p class="veredicto__titulo">Calidad de código</p><p class="veredicto__nota">TypeScript estricto, lint limpio y build reproducible.</p></div>
  </div>
  <div class="veredicto__item" role="listitem" data-nivel="medio">
    <span class="veredicto__luz" aria-hidden="true"></span>
    <div><p class="veredicto__titulo">Seguridad de aplicación</p><p class="veredicto__nota">Controles sólidos; quedan CSP inline, rate limit en memoria y MFA.</p></div>
  </div>
  <div class="veredicto__item" role="listitem" data-nivel="medio">
    <span class="veredicto__luz" aria-hidden="true"></span>
    <div><p class="veredicto__titulo">Privacidad</p><p class="veredicto__nota">Retención y aviso existen; falta revisión legal y licencia.</p></div>
  </div>
  <div class="veredicto__item" role="listitem" data-nivel="mal">
    <span class="veredicto__luz" aria-hidden="true"></span>
    <div><p class="veredicto__titulo">Operación</p><p class="veredicto__nota">Sin TLS, proxy, firewall, backups ni monitoreo.</p></div>
  </div>
  <div class="veredicto__item" role="listitem" data-nivel="medio">
    <span class="veredicto__luz" aria-hidden="true"></span>
    <div><p class="veredicto__titulo">Continuidad</p><p class="veredicto__nota">Seed reproducible, pero sin runbook ejecutado ni restauración probada.</p></div>
  </div>
</div>
"""

CONTROL = """
<div class="control" data-control="go-live">
  <div class="control__cabecera">
    <p class="control__titulo">Progreso del go-live</p>
    <span class="control__contador" data-contador>0 de 0 completados</span>
    <button type="button" class="control__reiniciar" data-reiniciar>Reiniciar</button>
  </div>
  <div class="control__barra"><span class="control__avance" data-avance></span></div>
</div>
"""


def partir_lista(lineas: list[str], inicio: int) -> tuple[list[tuple[str, str, str | None]], int]:
    """Devuelve (tipo, texto, estado_checkbox) y el índice siguiente."""
    items: list[tuple[str, str, str | None]] = []
    i = inicio

    while i < len(lineas):
        linea = lineas[i]

        if not linea.strip():
            j = i + 1
            while j < len(lineas) and not lineas[j].strip():
                j += 1
            if j < len(lineas) and (
                RE_ITEM.match(lineas[j]) or RE_ORDEN.match(lineas[j]) or RE_TAREA.match(lineas[j])
            ):
                i = j
                continue
            break

        tarea = RE_TAREA.match(linea)
        item = RE_ITEM.match(linea)
        orden = RE_ORDEN.match(linea)

        if tarea:
            items.append(("ul", tarea.group(2), tarea.group(1).lower()))
            i += 1
        elif item:
            items.append(("ul", item.group(1), None))
            i += 1
        elif orden:
            items.append(("ol", orden.group(2), None))
            i += 1
        elif linea.startswith("  ") and items:
            tipo, texto, estado = items[-1]
            items[-1] = (tipo, f"{texto} {linea.strip()}", estado)
            i += 1
        else:
            break

    return items, i


def render_lista(items: list[tuple[str, str, str | None]], contador: list[int]) -> str:
    salida: list[str] = []
    tipo_actual = None

    for tipo, texto, estado in items:
        if tipo != tipo_actual:
            if tipo_actual:
                salida.append(f"</{tipo_actual}>")
            clase = ' class="lista-tareas"' if estado is not None else ""
            salida.append(f"<{tipo}{clase}>")
            tipo_actual = tipo

        if estado is not None:
            contador[0] += 1
            identificador = f"tarea-{contador[0]}"
            marcado = " checked" if estado == "x" else ""
            salida.append(
                f'<li class="tarea"><input type="checkbox" id="{identificador}" '
                f'data-tarea="{identificador}"{marcado}>'
                f"<span>{inline(texto)}</span></li>"
            )
        else:
            salida.append(f"<li>{inline(texto)}</li>")

    if tipo_actual:
        salida.append(f"</{tipo_actual}>")

    return "\n".join(salida)


def convertir(markdown: str) -> tuple[str, dict[str, int]]:
    lineas = markdown.splitlines()
    inicio = next(i for i, l in enumerate(lineas) if l.startswith("## "))

    salida: list[str] = []
    estadisticas = {"secciones": 0, "subsecciones": 0, "tablas": 0, "codigos": 0, "tareas": 0}
    contador_tareas = [0]
    seccion = ""
    abierta = False
    control_puesto = False
    i = inicio

    while i < len(lineas):
        linea = lineas[i]

        if not linea.strip():
            i += 1
            continue

        if linea.startswith("```"):
            lenguaje = linea[3:].strip()
            i += 1
            cuerpo: list[str] = []
            while i < len(lineas) and not lineas[i].startswith("```"):
                cuerpo.append(lineas[i])
                i += 1
            i += 1
            salida.append(render_codigo(lenguaje, cuerpo))
            estadisticas["codigos"] += 1
            continue

        encabezado2 = RE_H2.match(linea)
        if encabezado2:
            if abierta:
                salida.append("</section>")
                abierta = False

            texto = encabezado2.group(1).strip()
            numero = RE_NUM.match(texto)
            salida.append('<section class="seccion">')

            if numero:
                salida.append(
                    f'<h2 id="s{numero.group(1)}" class="titulo-seccion">'
                    f'<span class="titulo-seccion__num">{numero.group(1).zfill(2)}</span>'
                    f'<span>{inline(numero.group(2))}</span></h2>'
                )
                seccion = f"s{numero.group(1)}"
                estadisticas["secciones"] += 1
                if numero.group(1) == "6":
                    salida.append("@@FASES@@")
                if numero.group(1) == "11":
                    salida.append("@@VEREDICTO@@")
            else:
                salida.append(
                    f'<h2 id="control" class="titulo-seccion"><span>{inline(texto)}</span></h2>'
                )
                seccion = "control"

            abierta = True
            i += 1
            continue

        encabezado3 = RE_H3.match(linea)
        if encabezado3:
            texto = encabezado3.group(1).strip()
            sub = RE_SUB.match(texto)
            anexo = RE_ANEXO.match(texto)

            if sub:
                identificador = f"s{sub.group(1).replace('.', '-')}"
                salida.append(
                    f'<h3 id="{identificador}" class="subtitulo">'
                    f'<span class="subtitulo__num">{sub.group(1)}</span>'
                    f'<span>{inline(sub.group(2))}</span></h3>'
                )
                seccion = identificador
            elif anexo:
                identificador = f"anexo-{anexo.group(1).lower()}"
                salida.append(
                    f'<h3 id="{identificador}" class="subtitulo">'
                    f'<span class="subtitulo__num">{anexo.group(1)}</span>'
                    f'<span>{inline(anexo.group(2))}</span></h3>'
                )
                seccion = identificador
            else:
                salida.append(f'<h3 class="subtitulo"><span>{inline(texto)}</span></h3>')

            estadisticas["subsecciones"] += 1
            i += 1
            continue

        encabezado4 = RE_H4.match(linea)
        if encabezado4:
            salida.append(f"<h4>{inline(encabezado4.group(1))}</h4>")
            i += 1
            continue

        if linea.strip() == "---":
            j = i + 1
            while j < len(lineas) and not lineas[j].strip():
                j += 1
            if not (j < len(lineas) and lineas[j].startswith("## ")):
                salida.append("<hr>")
            i += 1
            continue

        if linea.startswith("|"):
            tabla: list[str] = []
            while i < len(lineas) and lineas[i].startswith("|"):
                tabla.append(lineas[i])
                i += 1
            salida.append(render_tabla(tabla))
            estadisticas["tablas"] += 1
            continue

        if linea.startswith(">"):
            cita: list[str] = []
            while i < len(lineas) and lineas[i].startswith(">"):
                cita.append(lineas[i].lstrip(">").strip())
                i += 1
            texto = inline(" ".join(cita).strip())
            clase = "aviso aviso--alerta" if "Estado de esta sección: Propuesta" in texto else "aviso"
            salida.append(f'<div class="{clase}"><p>{texto}</p></div>')
            continue

        if RE_ITEM.match(linea) or RE_ORDEN.match(linea) or RE_TAREA.match(linea):
            if seccion == "s12-12" and not control_puesto and RE_TAREA.match(linea):
                salida.append("@@CONTROL@@")
                control_puesto = True
            items, i = partir_lista(lineas, i)
            salida.append(render_lista(items, contador_tareas))
            continue

        parrafo = [linea.strip()]
        i += 1
        while i < len(lineas) and lineas[i].strip():
            siguiente = lineas[i]
            if (
                siguiente.startswith(("#", "|", ">", "```", "---"))
                or RE_ITEM.match(siguiente)
                or RE_ORDEN.match(siguiente)
            ):
                break
            parrafo.append(siguiente.strip())
            i += 1
        salida.append(f"<p>{inline(' '.join(parrafo))}</p>")

    if abierta:
        salida.append("</section>")

    estadisticas["tareas"] = contador_tareas[0]
    contenido = "\n".join(salida)
    contenido = contenido.replace("@@FASES@@", FASES)
    contenido = contenido.replace("@@VEREDICTO@@", VEREDICTO)
    contenido = contenido.replace("@@CONTROL@@", CONTROL)
    return contenido, estadisticas


PLANTILLA = """<!DOCTYPE html>
<!-- Vista del informe técnico SD-UNETI · Hecho por Iván Vásquez · generado desde el Markdown -->
<html lang="es" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Informe técnico — SD-UNETI · 2026-11-10</title>
<meta name="description" content="Informe técnico integral del portal SD-UNETI: tecnologías, metodología, fases, estado actual, veredicto de producción y runbook Proxmox + Caddy.">
<meta name="author" content="Iván Vásquez">
<meta name="theme-color" content="#002f6c">
<link rel="icon" href="../frontend/public/assets/images/uneti/logo.png">
<link rel="stylesheet" href="informe-tecnico-2026-11-10.css">
<script>
  (function () {
    try {
      var guardado = localStorage.getItem('uneti-tema');
      var oscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.dataset.theme =
        guardado === 'claro' ? 'light' : guardado === 'oscuro' ? 'dark' : (oscuro ? 'dark' : 'light');
    } catch (error) {
      document.documentElement.dataset.theme = 'light';
    }
  })();
</script>
</head>
<body>

<a class="salto-contenido" href="#contenido">Saltar al contenido</a>

<div class="progreso" aria-hidden="true"><span class="progreso__barra" data-progreso></span></div>

<header class="barra">
  <button class="boton-icono boton-menu" type="button" data-menu aria-label="Abrir índice" aria-expanded="false" aria-controls="indice">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
  </button>

  <a class="marca" href="#inicio">
    <span class="marca__placa">
      <img class="marca__logo" src="../frontend/public/assets/images/uneti/logo.png" alt="UNETI" width="104" height="32" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'UNETI',className:'marca__respaldo'}))">
    </span>
    <span class="marca__texto">
      <span class="marca__titulo">Informe técnico SD-UNETI</span>
      <span class="marca__sub">Soberanía Digital 2026-2030</span>
    </span>
  </a>

  <div class="barra__acciones">
    <button class="boton-buscar" type="button" data-abrir-buscador aria-label="Buscar en el informe">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <span>Buscar</span>
      <kbd>⌘K</kbd>
    </button>

    <button class="boton-icono" type="button" data-tema aria-label="Cambiar entre tema claro y oscuro" title="Cambiar tema">
      <svg class="icono-luna" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
      <svg class="icono-sol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
    </button>

    <button class="boton-icono" type="button" data-imprimir aria-label="Imprimir o guardar como PDF" title="Imprimir / PDF">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/></svg>
    </button>
  </div>
</header>

<div class="diseno">
  <aside class="lateral" id="indice" aria-label="Índice del informe">
    <p class="lateral__titulo">Contenido</p>
    <nav><ul class="toc" data-indice></ul></nav>
  </aside>

  <main class="contenido" id="contenido">
    <article>
      <header class="portada" id="inicio">
        <span class="portada__logo">
          <img src="../frontend/public/assets/images/uneti/logo@2x.png" alt="Universidad Nacional Experimental de las Telecomunicaciones e Informática" width="168" height="51">
        </span>
        <p class="portada__etiqueta">Proyecto Soberanía Digital 2026-2030</p>
        <h1>Informe técnico — SD-UNETI</h1>
        <p class="portada__entradilla">
          Análisis integral del portal institucional: tecnologías, metodología, fases de construcción,
          estado actual, veredicto de aptitud para producción y procedimiento de salida a producción.
        </p>

        <div class="portada__chips">
          <span class="chip"><b>Versión</b> {{VERSION}}</span>
          <span class="chip"><b>Fecha</b> {{FECHA}}</span>
          <span class="chip"><b>Commit</b> {{COMMIT}}</span>
          <span class="chip chip--alerta"><b>Veredicto</b> No apto aún para exposición pública</span>
        </div>

        <div class="kpis">
          <div class="kpi"><span class="kpi__valor">3</span><span class="kpi__texto">Contenedores</span></div>
          <div class="kpi"><span class="kpi__valor">11</span><span class="kpi__texto">Rutas públicas</span></div>
          <div class="kpi"><span class="kpi__valor">7</span><span class="kpi__texto">Endpoints propios</span></div>
          <div class="kpi"><span class="kpi__valor">6</span><span class="kpi__texto">Noticias sembradas</span></div>
          <div class="kpi"><span class="kpi__valor">2 + 7</span><span class="kpi__texto">PNF y posgrados</span></div>
          <div class="kpi"><span class="kpi__valor">10</span><span class="kpi__texto">Workflows de CI</span></div>
        </div>

        <p class="portada__firma">
          <strong>Hecho por {{AUTOR}}</strong>
          <span>Universidad Nacional Experimental de las Telecomunicaciones e Informática</span>
        </p>
      </header>

      {{CONTENIDO}}

      <footer class="pie">
        <p class="pie__firma">Hecho por {{AUTOR}} <span>Documento técnico</span></p>
        <p>Informe técnico de SD-UNETI · versión {{VERSION}} · {{FECHA}} · commit {{COMMIT}}.</p>
        <p>Vista generada desde <code>informe-tecnico-2026-11-10.md</code> con <code>scripts/docs/generar-informe-html.py</code>. El Markdown es la fuente de verdad.</p>
        <p>Sin dependencias externas: tipografía del sistema, sin CDN ni analítica.</p>
      </footer>
    </article>
  </main>

  <aside class="rail" aria-label="Secciones de esta página">
    <p class="rail__titulo">En esta página</p>
    <ul class="rail__lista" data-rail></ul>
  </aside>
</div>

<button class="volver" type="button" data-volver aria-label="Volver arriba">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5m0 0-6 6m6-6 6 6"/></svg>
</button>

<div class="buscador" role="dialog" aria-modal="true" aria-label="Buscar en el informe" data-buscador>
  <div class="buscador__panel">
    <div class="buscador__campo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input type="search" placeholder="Buscar sección, tabla o concepto…" aria-label="Término de búsqueda" autocomplete="off" data-campo>
      <kbd>Esc</kbd>
    </div>
    <ul class="buscador__resultados" data-resultados role="listbox" aria-label="Resultados"></ul>
  </div>
</div>

<noscript>
  <p style="padding:16px 24px;background:#fff3cd;color:#664d03;border-bottom:1px solid #ffe69c">
    El índice, la búsqueda y el tema necesitan JavaScript. El contenido completo sigue siendo legible sin él.
  </p>
</noscript>

<script src="informe-tecnico-2026-11-10.js" defer></script>
</body>
</html>
"""


def main() -> int:
    if not ORIGEN.exists():
        print(f"No se encontró el informe: {ORIGEN}", file=sys.stderr)
        return 1

    contenido, estadisticas = convertir(ORIGEN.read_text(encoding="utf-8"))

    documento = (
        PLANTILLA.replace("{{CONTENIDO}}", contenido)
        .replace("{{AUTOR}}", AUTOR)
        .replace("{{VERSION}}", VERSION)
        .replace("{{FECHA}}", FECHA)
        .replace("{{COMMIT}}", COMMIT)
    )

    DESTINO.write_text(documento, encoding="utf-8")

    print("Informe HTML generado")
    print(f"  destino        : {DESTINO.relative_to(RAIZ)}")
    print(f"  secciones      : {estadisticas['secciones']}")
    print(f"  subsecciones   : {estadisticas['subsecciones']}")
    print(f"  tablas         : {estadisticas['tablas']}")
    print(f"  bloques código : {estadisticas['codigos']}")
    print(f"  tareas         : {estadisticas['tareas']}")
    print(f"  tamaño         : {len(documento) / 1024:.1f} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())




