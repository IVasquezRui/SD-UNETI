/* ==========================================================================
   Despliegue a producción UNETI — navegación de la presentación
   Hecho por Iván Vásquez · 2026-11-11
   JavaScript clásico, sin dependencias, compatible con file://
   ========================================================================== */

(function () {
  "use strict";

  var cuerpo = document.body;
  var escenario = document.querySelector(".escenario");
  var listaIndice = document.querySelector("[data-indice]");
  var botonAnterior = document.querySelector("[data-anterior]");
  var botonSiguiente = document.querySelector("[data-siguiente]");
  var contador = document.querySelector("[data-contador]");
  var barraProgreso = document.querySelector("[data-progreso]");
  var selectorRuta = document.querySelector("[data-ruta-select]");
  var todas = Array.prototype.slice.call(document.querySelectorAll(".diapositiva"));
  var visibles = [];
  var actual = 0;

  function rutaActiva() {
    return cuerpo.getAttribute("data-ruta") || "todas";
  }

  function esVisible(diapositiva) {
    var ruta = rutaActiva();
    var propia = diapositiva.getAttribute("data-ruta") || "todas";
    return ruta === "todas" || propia === "todas" || propia === ruta;
  }

  function calcularVisibles() {
    visibles = todas.filter(esVisible);
    if (actual >= visibles.length) actual = Math.max(0, visibles.length - 1);
  }

  function pintarIndice() {
    if (!listaIndice) return;
    listaIndice.innerHTML = "";

    todas.forEach(function (diapositiva) {
      var titulo = diapositiva.getAttribute("data-titulo") || diapositiva.id;
      var item = document.createElement("li");
      item.setAttribute("data-ruta", diapositiva.getAttribute("data-ruta") || "todas");

      var enlace = document.createElement("a");
      enlace.href = "#" + diapositiva.id;
      enlace.textContent = titulo;
      enlace.setAttribute("data-destino", diapositiva.id);

      enlace.addEventListener("click", function (evento) {
        evento.preventDefault();
        irA(diapositiva.id);
        cerrarMenu();
      });

      item.appendChild(enlace);
      listaIndice.appendChild(item);
    });
  }

  function marcarIndice(id) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-destino]"), function (enlace) {
      if (enlace.getAttribute("data-destino") === id) enlace.setAttribute("aria-current", "true");
      else enlace.removeAttribute("aria-current");
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-indice] li"), function (item) {
      var propia = item.getAttribute("data-ruta");
      item.classList.toggle("oculto", !(rutaActiva() === "todas" || propia === "todas" || propia === rutaActiva()));
    });
  }

  function mostrar(indice) {
    if (!visibles.length) return;
    actual = (indice + visibles.length) % visibles.length;

    todas.forEach(function (diapositiva) {
      diapositiva.classList.remove("activa");
    });

    var diapositiva = visibles[actual];
    diapositiva.classList.add("activa");

    if (escenario) escenario.scrollTop = 0;

    if (contador) {
      var numero = String(actual + 1).padStart(2, "0");
      var total = String(visibles.length).padStart(2, "0");
      contador.textContent = numero + " / " + total;
    }

    if (barraProgreso) {
      barraProgreso.style.width = ((actual + 1) / visibles.length) * 100 + "%";
    }

    if (botonAnterior) botonAnterior.disabled = actual === 0;
    if (botonSiguiente) botonSiguiente.disabled = actual === visibles.length - 1;

    marcarIndice(diapositiva.id);

    try {
      history.replaceState(null, "", "#" + diapositiva.id);
    } catch (error) {
      /* file:// sin historial */
    }
  }

  function irA(id) {
    calcularVisibles();
    var indice = visibles.findIndex(function (diapositiva) {
      return diapositiva.id === id;
    });
    mostrar(indice >= 0 ? indice : 0);
  }

  function siguiente() {
    calcularVisibles();
    mostrar(actual + 1);
  }

  function anterior() {
    calcularVisibles();
    mostrar(actual - 1);
  }

  function cambiarRuta(valor) {
    cuerpo.setAttribute("data-ruta", valor);
    try {
      localStorage.setItem("uneti-prod-ruta", valor);
    } catch (error) {
      /* sin persistencia */
    }
    calcularVisibles();
    actual = 0;
    mostrar(0);
  }

  /* --- Tema ----------------------------------------------------------------- */

  function prepararTema() {
    var boton = document.querySelector("[data-tema]");
    if (!boton) return;

    boton.addEventListener("click", function () {
      var oscuro = document.documentElement.getAttribute("data-tema") === "oscuro";
      document.documentElement.setAttribute("data-tema", oscuro ? "claro" : "oscuro");
      try {
        localStorage.setItem("uneti-prod-tema", oscuro ? "claro" : "oscuro");
      } catch (error) {
        /* sin persistencia */
      }
    });
  }

  /* --- Imprimir ------------------------------------------------------------- */

  function prepararImpresion() {
    var boton = document.querySelector("[data-imprimir]");
    if (boton) boton.addEventListener("click", function () { window.print(); });
  }

  /* --- Copiar comandos ------------------------------------------------------ */

  function prepararCopiado() {
    Array.prototype.forEach.call(document.querySelectorAll(".bloque"), function (bloque) {
      var pre = bloque.querySelector("pre");
      if (!pre) return;

      var barra = document.createElement("div");
      barra.className = "bloque__barra";

      var puntos = document.createElement("span");
      puntos.className = "bloque__puntos";
      puntos.setAttribute("aria-hidden", "true");
      puntos.innerHTML = "<i></i><i></i><i></i>";

      var lenguaje = document.createElement("span");
      lenguaje.className = "bloque__lenguaje";
      lenguaje.textContent = bloque.getAttribute("data-lenguaje") || "texto";

      var boton = document.createElement("button");
      boton.type = "button";
      boton.className = "bloque__copiar";
      boton.textContent = "Copiar";

      boton.addEventListener("click", function () {
        var texto = pre.innerText;

        function listo() {
          boton.textContent = "Copiado";
          boton.classList.add("copiado");
          window.setTimeout(function () {
            boton.textContent = "Copiar";
            boton.classList.remove("copiado");
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
      barra.appendChild(lenguaje);
      barra.appendChild(boton);
      bloque.insertBefore(barra, pre);
    });
  }

  /* --- Checklist del go-live ------------------------------------------------ */

  function prepararChecklist() {
    var caja = document.querySelector('[data-control="golive"]');
    var tareas = Array.prototype.slice.call(document.querySelectorAll("input[data-tarea]"));
    if (!caja || !tareas.length) return;

    var CLAVE = "uneti-prod-golive";
    var contadorTareas = caja.querySelector("[data-contador]");
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
      if (contadorTareas) contadorTareas.textContent = hechas + " de " + tareas.length + " completados";
      if (avance) avance.style.width = (hechas / tareas.length) * 100 + "%";
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

  /* --- Menú lateral --------------------------------------------------------- */

  var botonMenu = document.querySelector("[data-menu]");

  function cerrarMenu() {
    var panel = document.getElementById("indice");
    if (panel) panel.classList.remove("abierto");
    cuerpo.classList.remove("menu-abierto");
    if (botonMenu) botonMenu.setAttribute("aria-expanded", "false");
  }

  function prepararMenu() {
    var panel = document.getElementById("indice");
    if (!botonMenu || !panel) return;

    botonMenu.addEventListener("click", function () {
      var abierto = panel.classList.toggle("abierto");
      cuerpo.classList.toggle("menu-abierto", abierto);
      botonMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
    });

    panel.addEventListener("click", function (evento) {
      if (evento.target.closest("a")) cerrarMenu();
    });
  }

  /* --- Arranque ------------------------------------------------------------- */

  function prepararRuta() {
    if (!selectorRuta) return;

    var guardada = null;
    try {
      guardada = localStorage.getItem("uneti-prod-ruta");
    } catch (error) {
      guardada = null;
    }

    if (guardada) {
      cuerpo.setAttribute("data-ruta", guardada);
      selectorRuta.value = guardada;
    }

    selectorRuta.addEventListener("change", function () {
      cambiarRuta(selectorRuta.value);
    });
  }

  function iniciar() {
    pintarIndice();
    prepararRuta();
    calcularVisibles();

    var destino = (window.location.hash || "").replace("#", "");
    var indiceInicial = visibles.findIndex(function (diapositiva) {
      return diapositiva.id === destino;
    });

    mostrar(indiceInicial >= 0 ? indiceInicial : 0);
  }

  if (botonSiguiente) botonSiguiente.addEventListener("click", siguiente);
  if (botonAnterior) botonAnterior.addEventListener("click", anterior);

  document.addEventListener("keydown", function (evento) {
    var etiqueta = (evento.target.tagName || "").toLowerCase();
    if (etiqueta === "input" || etiqueta === "select" || etiqueta === "textarea") return;

    if (evento.key === "ArrowRight" || evento.key === "ArrowDown" || evento.key === "PageDown" || evento.key === " ") {
      evento.preventDefault();
      siguiente();
    } else if (evento.key === "ArrowLeft" || evento.key === "ArrowUp" || evento.key === "PageUp") {
      evento.preventDefault();
      anterior();
    } else if (evento.key === "Home") {
      evento.preventDefault();
      calcularVisibles();
      mostrar(0);
    } else if (evento.key === "End") {
      evento.preventDefault();
      calcularVisibles();
      mostrar(visibles.length - 1);
    } else if (evento.key === "Escape") {
      cerrarMenu();
    }
  });

  window.addEventListener("hashchange", function () {
    var destino = (window.location.hash || "").replace("#", "");
    if (!destino) return;
    calcularVisibles();
    var indice = visibles.findIndex(function (diapositiva) {
      return diapositiva.id === destino;
    });
    if (indice >= 0 && indice !== actual) mostrar(indice);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) cerrarMenu();
  });

  prepararTema();
  prepararImpresion();
  prepararCopiado();
  prepararChecklist();
  prepararMenu();
  iniciar();
})();


