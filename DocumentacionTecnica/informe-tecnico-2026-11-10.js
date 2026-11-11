/* ==========================================================================
   Informe técnico SD-UNETI — comportamiento de la vista
   Hecho por Iván Vásquez · 2026-11-10
   JavaScript clásico (sin módulos) para que funcione también con file://
   ========================================================================== */

(function () {
  "use strict";

  var raiz = document.documentElement;
  var topbar = document.querySelector(".barra");
  var contenido = document.getElementById("contenido");
  var enlacesIndice = [];

  function alturaBarra() {
    return topbar ? topbar.getBoundingClientRect().height : 64;
  }

  function normalizar(texto) {
    return (texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  /* --- Índice lateral y rail --------------------------------------------- */

  var secciones = [];
  var titulos = Array.prototype.slice.call(
    contenido.querySelectorAll("h2.titulo-seccion, h3.subtitulo[id]")
  );

  function construirIndice() {
    var lista = document.querySelector("[data-indice]");
    if (!lista) return;

    var seccionActual = null;
    var sublista = null;

    titulos.forEach(function (titulo) {
      if (!titulo.id) return;

      var esSeccion = titulo.tagName === "H2";
      var numero = titulo.querySelector(".titulo-seccion__num, .subtitulo__num");
      var etiqueta = titulo.textContent.trim();
      if (numero) etiqueta = etiqueta.replace(numero.textContent, "").trim();

      var enlace = document.createElement("a");
      enlace.className = "toc__enlace";
      enlace.href = "#" + titulo.id;

      var num = document.createElement("span");
      num.className = "toc__num";
      num.textContent = numero ? numero.textContent : "•";

      var texto = document.createElement("span");
      texto.textContent = etiqueta;

      enlace.appendChild(num);
      enlace.appendChild(texto);

      var elemento = document.createElement("li");
      elemento.className = "toc__grupo";
      elemento.appendChild(enlace);

      if (esSeccion) {
        lista.appendChild(elemento);
        seccionActual = {
          id: titulo.id,
          titulo: etiqueta,
          elemento: elemento,
          enlace: enlace,
          hijos: [],
        };
        secciones.push(seccionActual);
        sublista = document.createElement("ul");
        sublista.className = "toc__sub";
        elemento.appendChild(sublista);
      } else if (seccionActual && sublista) {
        sublista.appendChild(elemento);
        seccionActual.hijos.push({ id: titulo.id, titulo: etiqueta, enlace: enlace });
      }

      enlacesIndice.push(enlace);
    });
  }

  /* --- Scroll-spy --------------------------------------------------------- */

  var rail = document.querySelector("[data-rail]");
  var seccionVisible = null;
  var tickPendiente = false;

  function tituloEnFoco() {
    var limite = alturaBarra() + 28;
    var actual = titulos[0];

    for (var i = 0; i < titulos.length; i += 1) {
      if (titulos[i].getBoundingClientRect().top - limite <= 0) actual = titulos[i];
      else break;
    }

    return actual;
  }

  function pintarRail(seccion) {
    if (!rail || !seccion) return;
    rail.innerHTML = "";

    if (!seccion.hijos.length) {
      var vacio = document.createElement("li");
      vacio.textContent = "Sección única";
      vacio.style.color = "var(--muted)";
      vacio.style.padding = "6px 12px";
      rail.appendChild(vacio);
      return;
    }

    seccion.hijos.forEach(function (hijo) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + hijo.id;
      a.textContent = hijo.titulo;
      li.appendChild(a);
      rail.appendChild(li);
    });
  }

  function actualizarSpy() {
    tickPendiente = false;

    var actual = tituloEnFoco();
    if (!actual) return;

    var barra = document.querySelector("[data-progreso]");
    if (barra) {
      var recorrido = document.documentElement.scrollHeight - window.innerHeight;
      var avance = recorrido > 0 ? Math.min(1, Math.max(0, window.scrollY / recorrido)) : 0;
      barra.style.width = (avance * 100).toFixed(2) + "%";
    }

    var volver = document.querySelector("[data-volver]");
    if (volver) volver.classList.toggle("es-visible", window.scrollY > 700);

    enlacesIndice.forEach(function (enlace) {
      if (enlace.getAttribute("href") === "#" + actual.id) enlace.setAttribute("aria-current", "true");
      else enlace.removeAttribute("aria-current");
    });

    var seccionDe = null;
    for (var i = secciones.length - 1; i >= 0; i -= 1) {
      if (
        secciones[i].id === actual.id ||
        secciones[i].hijos.some(function (hijo) { return hijo.id === actual.id; })
      ) {
        seccionDe = secciones[i];
        break;
      }
    }

    if (seccionDe && seccionDe !== seccionVisible) {
      seccionVisible = seccionDe;
      pintarRail(seccionDe);
    }

    if (rail) {
      Array.prototype.forEach.call(rail.querySelectorAll("a"), function (a) {
        if (a.getAttribute("href") === "#" + actual.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }
  }

  function alDesplazar() {
    if (tickPendiente) return;
    tickPendiente = true;
    window.requestAnimationFrame(actualizarSpy);
  }

  /* --- Tema --------------------------------------------------------------- */

  function prepararTema() {
    var boton = document.querySelector("[data-tema]");
    if (!boton) return;

    boton.addEventListener("click", function () {
      var oscuro = raiz.dataset.theme === "dark";
      raiz.dataset.theme = oscuro ? "light" : "dark";
      try {
        localStorage.setItem("uneti-tema", oscuro ? "claro" : "oscuro");
      } catch (error) {
        /* sin persistencia */
      }
    });
  }

  /* --- Cajón móvil -------------------------------------------------------- */

  function prepararCajon() {
    var boton = document.querySelector("[data-menu]");
    var panel = document.getElementById("indice");
    if (!boton || !panel) return;

    function abrir(estado) {
      panel.classList.toggle("es-abierto", estado);
      boton.setAttribute("aria-expanded", estado ? "true" : "false");
    }

    boton.addEventListener("click", function () {
      abrir(!panel.classList.contains("es-abierto"));
    });

    panel.addEventListener("click", function (evento) {
      if (evento.target.closest("a")) abrir(false);
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") abrir(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) abrir(false);
    });
  }

  /* --- Copiar código ------------------------------------------------------ */

  function prepararCopiado() {
    Array.prototype.forEach.call(document.querySelectorAll(".bloque-codigo"), function (bloque) {
      var pre = bloque.querySelector("pre");
      if (!pre) return;

      var barra = document.createElement("div");
      barra.className = "codigo__barra";

      var puntos = document.createElement("span");
      puntos.className = "codigo__puntos";
      puntos.setAttribute("aria-hidden", "true");
      puntos.innerHTML = "<i></i><i></i><i></i>";

      var etiqueta = document.createElement("span");
      etiqueta.className = "codigo__etiqueta";
      etiqueta.textContent = bloque.getAttribute("data-lenguaje") || "texto";

      var boton = document.createElement("button");
      boton.type = "button";
      boton.className = "codigo__copiar";
      boton.textContent = "Copiar";

      boton.addEventListener("click", function () {
        var texto = pre.innerText;

        function listo() {
          boton.textContent = "Copiado";
          boton.classList.add("es-copiado");
          window.setTimeout(function () {
            boton.textContent = "Copiar";
            boton.classList.remove("es-copiado");
          }, 1800);
        }

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(texto).then(listo, function () {});
          return;
        }

        var area = document.createElement("textarea");
        area.value = texto;
        area.setAttribute("readonly", "readonly");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy");
          listo();
        } catch (error) {
          /* sin copiado */
        }
        document.body.removeChild(area);
      });

      barra.appendChild(puntos);
      barra.appendChild(etiqueta);
      barra.appendChild(boton);
      bloque.insertBefore(barra, pre);
    });
  }

  /* --- Insignias de estado ------------------------------------------------ */

  var ESTADOS = {
    Implementado: "ok",
    Completada: "ok",
    Cerrado: "ok",
    Cerrada: "ok",
    Mitigado: "ok",
    Apto: "ok",
    Parcial: "parcial",
    "Mitigación parcial": "parcial",
    "Apto con reservas": "parcial",
    Aceptado: "parcial",
    Pendiente: "pendiente",
    Abierto: "pendiente",
    "No apto": "pendiente",
    Propuesta: "propuesta",
  };

  function prepararInsignias() {
    Array.prototype.forEach.call(contenido.querySelectorAll("td"), function (celda) {
      if (celda.children.length) return;
      var texto = celda.textContent.trim();
      var tipo = ESTADOS[texto];
      if (!tipo) return;

      celda.innerHTML = "";
      var insignia = document.createElement("span");
      insignia.className = "insignia insignia--" + tipo;
      insignia.textContent = texto;
      celda.appendChild(insignia);
    });
  }

  /* --- Checklist del go-live --------------------------------------------- */

  function prepararControl() {
    var caja = document.querySelector('[data-control="go-live"]');
    var tareas = Array.prototype.slice.call(
      contenido.querySelectorAll(".lista-tareas input[data-tarea]")
    );
    if (!caja || !tareas.length) return;

    var CLAVE = "uneti-go-live";
    var contador = caja.querySelector("[data-contador]");
    var avance = caja.querySelector("[data-avance]");
    var reiniciar = caja.querySelector("[data-reiniciar]");
    var guardado = {};

    try {
      guardado = JSON.parse(localStorage.getItem(CLAVE) || "{}");
    } catch (error) {
      guardado = {};
    }

    function guardar() {
      var estado = {};
      tareas.forEach(function (tarea) {
        if (tarea.checked) estado[tarea.getAttribute("data-tarea")] = 1;
      });
      try {
        localStorage.setItem(CLAVE, JSON.stringify(estado));
      } catch (error) {
        /* sin persistencia */
      }
    }

    function pintar() {
      var hechas = tareas.filter(function (tarea) { return tarea.checked; }).length;
      var total = tareas.length;
      if (contador) contador.textContent = hechas + " de " + total + " completados";
      if (avance) avance.style.width = (total ? (hechas / total) * 100 : 0) + "%";
    }

    tareas.forEach(function (tarea) {
      if (guardado[tarea.getAttribute("data-tarea")]) tarea.checked = true;
      tarea.addEventListener("change", function () {
        guardar();
        pintar();
      });
    });

    if (reiniciar) {
      reiniciar.addEventListener("click", function () {
        tareas.forEach(function (tarea) { tarea.checked = false; });
        try {
          localStorage.removeItem(CLAVE);
        } catch (error) {
          /* sin persistencia */
        }
        pintar();
      });
    }

    pintar();
  }

  /* --- Buscador ----------------------------------------------------------- */

  var entradas = [];

  function tituloLimpio(nodo) {
    var copia = nodo.cloneNode(true);
    var numero = copia.querySelector(".titulo-seccion__num, .subtitulo__num");
    if (numero) numero.remove();
    return copia.textContent.replace(/\s+/g, " ").trim();
  }

  function construirEntradas() {
    var nodos = contenido.querySelectorAll("h2.titulo-seccion, h3.subtitulo[id]");

    Array.prototype.forEach.call(nodos, function (nodo) {
      var seccion = nodo.closest("section");
      var h2 = seccion ? seccion.querySelector("h2") : null;
      var partes = [];
      var hermano = nodo.nextElementSibling;

      while (hermano && !/^H[23]$/.test(hermano.tagName)) {
        partes.push(hermano.textContent);
        hermano = hermano.nextElementSibling;
      }

      entradas.push({
        id: nodo.id,
        titulo: tituloLimpio(nodo),
        seccion: h2 ? tituloLimpio(h2) : "",
        texto: partes.join(" ").replace(/\s+/g, " ").trim(),
      });
    });
  }

  function escaparRegExp(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function recortar(texto, consulta) {
    var posicion = normalizar(texto).indexOf(normalizar(consulta));
    if (posicion < 0) {
      return { antes: texto.slice(0, 160), coincide: "", despues: texto.length > 160 ? "…" : "" };
    }

    var inicio = Math.max(0, posicion - 70);
    var fin = Math.min(texto.length, posicion + consulta.length + 110);
    var fragmento = texto.slice(inicio, fin);
    var patron = new RegExp(escaparRegExp(consulta), "i");
    var encontrado = fragmento.match(patron);

    if (!encontrado || encontrado.index === undefined) {
      return { antes: fragmento, coincide: "", despues: "" };
    }

    return {
      antes: (inicio > 0 ? "…" : "") + fragmento.slice(0, encontrado.index),
      coincide: encontrado[0],
      despues: fragmento.slice(encontrado.index + encontrado[0].length) + (fin < texto.length ? "…" : ""),
    };
  }

  function prepararBuscador() {
    var capa = document.querySelector("[data-buscador]");
    var campo = document.querySelector("[data-campo]");
    var lista = document.querySelector("[data-resultados]");
    var abrirBtn = document.querySelector("[data-abrir-buscador]");
    if (!capa || !campo || !lista) return;

    var seleccionado = -1;
    var ultimoFoco = null;

    function abrir() {
      ultimoFoco = document.activeElement;
      capa.classList.add("es-visible");
      campo.value = "";
      pintar("");
      window.setTimeout(function () { campo.focus(); }, 20);
    }

    function cerrar() {
      capa.classList.remove("es-visible");
      seleccionado = -1;
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }

    function resaltar(partes) {
      var fragmento = document.createDocumentFragment();
      fragmento.appendChild(document.createTextNode(partes.antes));
      if (partes.coincide) {
        var marca = document.createElement("mark");
        marca.textContent = partes.coincide;
        fragmento.appendChild(marca);
      }
      fragmento.appendChild(document.createTextNode(partes.despues));
      return fragmento;
    }

    function marcarSeleccion() {
      var opciones = lista.querySelectorAll("a");
      Array.prototype.forEach.call(opciones, function (a, indice) {
        a.setAttribute("aria-selected", indice === seleccionado ? "true" : "false");
        if (indice === seleccionado) a.scrollIntoView({ block: "nearest" });
      });
    }

    function pintar(consulta) {
      lista.innerHTML = "";
      seleccionado = -1;

      var termino = consulta.trim();
      if (termino.length < 2) {
        var aviso = document.createElement("li");
        aviso.className = "buscador__vacio";
        aviso.textContent = "Escribe al menos dos letras para buscar en el informe.";
        lista.appendChild(aviso);
        return;
      }

      var buscado = normalizar(termino);
      var encontrados = entradas
        .map(function (entrada) {
          var enTitulo = normalizar(entrada.titulo).indexOf(buscado);
          var enTexto = normalizar(entrada.texto).indexOf(buscado);
          var puntaje = enTitulo >= 0 ? 0 : enTexto >= 0 ? 1 : 2;
          return { entrada: entrada, puntaje: puntaje };
        })
        .filter(function (item) { return item.puntaje < 2; })
        .sort(function (a, b) { return a.puntaje - b.puntaje; })
        .slice(0, 12);

      if (!encontrados.length) {
        var vacio = document.createElement("li");
        vacio.className = "buscador__vacio";
        vacio.textContent = "Sin resultados para «" + termino + "».";
        lista.appendChild(vacio);
        return;
      }

      encontrados.forEach(function (item) {
        var li = document.createElement("li");
        li.setAttribute("role", "option");

        var a = document.createElement("a");
        a.href = "#" + item.entrada.id;
        a.setAttribute("role", "option");
        a.setAttribute("aria-selected", "false");

        var ruta = document.createElement("span");
        ruta.className = "buscador__ruta";
        ruta.textContent = item.entrada.seccion;

        var texto = document.createElement("span");
        texto.className = "buscador__texto";

        var fuerte = document.createElement("strong");
        fuerte.textContent = item.entrada.titulo;
        texto.appendChild(fuerte);

        if (item.entrada.texto) {
          var parrafo = document.createElement("span");
          parrafo.appendChild(document.createTextNode(" — "));
          parrafo.appendChild(resaltar(recortar(item.entrada.texto, termino)));
          texto.appendChild(parrafo);
        }

        a.appendChild(ruta);
        a.appendChild(texto);
        a.addEventListener("click", cerrar);

        li.appendChild(a);
        lista.appendChild(li);
      });

      seleccionado = 0;
      marcarSeleccion();
    }

    campo.addEventListener("input", function () {
      window.clearTimeout(campo._retardo);
      campo._retardo = window.setTimeout(function () { pintar(campo.value); }, 90);
    });

    campo.addEventListener("keydown", function (evento) {
      var opciones = lista.querySelectorAll("a");

      if (evento.key === "ArrowDown") {
        evento.preventDefault();
        if (opciones.length) {
          seleccionado = (seleccionado + 1) % opciones.length;
          marcarSeleccion();
        }
      } else if (evento.key === "ArrowUp") {
        evento.preventDefault();
        if (opciones.length) {
          seleccionado = (seleccionado - 1 + opciones.length) % opciones.length;
          marcarSeleccion();
        }
      } else if (evento.key === "Enter") {
        if (opciones.length && seleccionado >= 0) {
          evento.preventDefault();
          opciones[seleccionado].click();
        }
      } else if (evento.key === "Escape") {
        evento.preventDefault();
        cerrar();
      }
    });

    capa.addEventListener("click", function (evento) {
      if (evento.target === capa) cerrar();
    });

    document.addEventListener("keydown", function (evento) {
      if ((evento.metaKey || evento.ctrlKey) && evento.key.toLowerCase() === "k") {
        evento.preventDefault();
        if (capa.classList.contains("es-visible")) cerrar();
        else abrir();
      }
      if (evento.key === "Escape" && capa.classList.contains("es-visible")) cerrar();
    });

    if (abrirBtn) abrirBtn.addEventListener("click", abrir);
  }

  /* --- Acciones globales --------------------------------------------------- */

  function prepararAcciones() {
    var imprimir = document.querySelector("[data-imprimir]");
    if (imprimir) imprimir.addEventListener("click", function () { window.print(); });

    var volver = document.querySelector("[data-volver]");
    if (volver) {
      volver.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* --- Arranque ------------------------------------------------------------ */

  construirIndice();
  construirEntradas();
  prepararTema();
  prepararCajon();
  prepararCopiado();
  prepararInsignias();
  prepararControl();
  prepararBuscador();
  prepararAcciones();

  window.addEventListener("scroll", alDesplazar, { passive: true });
  window.addEventListener("resize", alDesplazar);
  actualizarSpy();
})();





