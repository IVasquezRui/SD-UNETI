"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  POSGRADOS,
  obtenerPosgradoPorNombre,
  obtenerPosgradoPorSlug,
  programaDePosgrado,
} from "../lib/posgrados";
import { validarSolicitud } from "../lib/solicitudes";
import AnimacionTFSA from "./AnimacionTFSA";

type Datos = {
  nombre: string;
  cedula: string;
  correo: string;
  telefono: string;
  programa: string;
  mensaje: string;
};

type Errores = Record<string, string>;

type Tfsa = {
  estado: "exito" | "error";
  ticket?: string | null;
  detalle?: string;
};

const DATOS_INICIALES: Datos = {
  nombre: "",
  cedula: "",
  correo: "",
  telefono: "",
  programa: "",
  mensaje: "",
};

const PASOS = [
  { numero: 1, titulo: "Datos personales", descripcion: "Cuéntanos cómo contactarte." },
  { numero: 2, titulo: "Interés académico", descripcion: "Elige el posgrado que quieres cursar." },
  {
    numero: 3,
    titulo: "Confirma y envía",
    descripcion: "Revisa tus datos y autoriza el tratamiento.",
  },
];

function camposDelPaso(paso: number): string[] {
  if (paso === 1) return ["nombre", "cedula", "correo", "telefono"];
  if (paso === 2) return ["programa", "mensaje"];
  return ["consentimiento"];
}

export default function FormularioPosgrado() {
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState<Datos>(DATOS_INICIALES);
  const [errores, setErrores] = useState<Errores>({});
  const [consentimiento, setConsentimiento] = useState(false);
  const [estado, setEstado] = useState<"idle" | "sending">("idle");
  const [tfsa, setTfsa] = useState<Tfsa | null>(null);
  const inicio = useRef(0);
  const panel = useRef<HTMLDivElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inicio.current = Date.now();
  }, []);

  // Preselección desde `/posgrados?posgrado=slug` y desde el evento de las tarjetas.
  useEffect(() => {
    const aplicar = (referencia: unknown) => {
      if (typeof referencia !== "string" || referencia.trim() === "") return;

      const posgrado =
        obtenerPosgradoPorSlug(referencia) ??
        obtenerPosgradoPorNombre(referencia) ??
        POSGRADOS.find((item) => item.siglas.toLowerCase() === referencia.toLowerCase());

      if (!posgrado) return;
      setDatos((previos) => ({ ...previos, programa: programaDePosgrado(posgrado) }));
      setErrores((previos) => {
        if (!("programa" in previos)) return previos;
        const copia = { ...previos };
        delete copia.programa;
        return copia;
      });
    };

    try {
      aplicar(new URLSearchParams(window.location.search).get("posgrado"));
    } catch {
      // Sin query string válido se mantiene el formulario vacío.
    }

    const alElegirPosgrado = (evento: Event) => {
      aplicar((evento as CustomEvent<unknown>).detail);
      panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener("uneti:posgrado", alElegirPosgrado);
    return () => window.removeEventListener("uneti:posgrado", alElegirPosgrado);
  }, []);

  function limpiarError(campo: string) {
    setErrores((previos) => {
      if (!(campo in previos)) return previos;
      const copia = { ...previos };
      delete copia[campo];
      return copia;
    });
  }

  function actualizar(campo: keyof Datos) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const valor = event.target.value;
      setDatos((previos) => ({ ...previos, [campo]: valor }));
      limpiarError(campo);
    };
  }

  function seleccionarPrograma(programa: string) {
    setDatos((previos) => ({ ...previos, programa }));
    limpiarError("programa");
  }

  function enfocar(campo: string) {
    requestAnimationFrame(() => {
      if (campo === "programa") {
        document.querySelector<HTMLInputElement>('input[name="programa"]')?.focus();
        return;
      }
      const id = campo === "consentimiento" ? "posg-consentimiento" : `posg-${campo}`;
      const elemento = document.getElementById(id);
      if (elemento instanceof HTMLElement) elemento.focus();
    });
  }

  function validarPaso(numero: number): Errores {
    const resultado = validarSolicitud(
      {
        ...datos,
        tipo: "posgrado",
        consentimiento: numero === 3 ? consentimiento : true,
      },
      "posgrado",
    );

    const permitidos = camposDelPaso(numero);
    const filtrados: Errores = {};

    for (const campo of permitidos) {
      if (resultado.errores[campo]) filtrados[campo] = resultado.errores[campo];
    }

    return filtrados;
  }

  function avanzar() {
    const nuevos = validarPaso(paso);
    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) {
      enfocar(Object.keys(nuevos)[0]);
      return;
    }

    setPaso((actual) => Math.min(3, actual + 1));
    panel.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function retroceder() {
    setErrores({});
    setPaso((actual) => Math.max(1, actual - 1));
  }

  function reiniciar() {
    setDatos(DATOS_INICIALES);
    setConsentimiento(false);
    setErrores({});
    setEstado("idle");
    setTfsa(null);
    setPaso(1);
    inicio.current = Date.now();
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validacion = validarSolicitud(
      { ...datos, tipo: "posgrado", consentimiento },
      "posgrado",
    );

    if (!validacion.valido || !validacion.datos) {
      setErrores(validacion.errores);
      const campos = Object.keys(validacion.errores);
      const pasoConError = campos.some((campo) => camposDelPaso(1).includes(campo))
        ? 1
        : campos.some((campo) => camposDelPaso(2).includes(campo))
          ? 2
          : 3;
      setPaso(pasoConError);
      enfocar(campos[0]);
      return;
    }

    setEstado("sending");
    setErrores({});

    try {
      const response = await fetch("/api/posgrados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validacion.datos,
          origen: window.location.href,
          inicio: inicio.current,
          sitio_web: honeypot.current?.value ?? "",
        }),
      });

      const body = (await response.json().catch(() => null)) as
        | { ok?: boolean; folio?: string; ticket?: string; error?: string; errores?: Errores }
        | null;

      if (!response.ok) {
        if (body?.errores) setErrores(body.errores);
        throw new Error(body?.error ?? "No pudimos registrar tu solicitud.");
      }

      setEstado("idle");
      setTfsa({ estado: "exito", ticket: body?.ticket ?? body?.folio ?? null });
    } catch (error) {
      setEstado("idle");
      setTfsa({
        estado: "error",
        detalle:
          error instanceof Error
            ? error.message
            : "No pudimos registrar tu solicitud. Inténtalo de nuevo.",
      });
    }
  }

  const progreso = Math.round((paso / PASOS.length) * 100);
  const posgradoElegido = datos.programa ? obtenerPosgradoPorNombre(datos.programa) : undefined;

  return (
    <>
      <form onSubmit={enviar} className="uneti-admision uneti-admision--posgrado" noValidate>
        <div className="uneti-admision__cabecera">
          <span className="uneti-admision__etiqueta">
            Paso {paso} de {PASOS.length}
          </span>
          <div
            className="uneti-admision__progreso"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progreso}
            aria-label="Progreso de la solicitud de posgrado"
          >
            <span className="uneti-admision__barra" style={{ width: `${progreso}%` }}></span>
          </div>
          <ol className="uneti-admision__pasos">
            {PASOS.map((item) => (
              <li
                key={item.numero}
                className={`uneti-admision__paso${paso === item.numero ? " is-active" : ""}${
                  paso > item.numero ? " is-complete" : ""
                }`}
                aria-current={paso === item.numero ? "step" : undefined}
              >
                <span className="uneti-admision__paso-numero">
                  {paso > item.numero ? <i className="bi bi-check-lg"></i> : item.numero}
                </span>
                <span className="uneti-admision__paso-texto">
                  <strong>{item.titulo}</strong>
                  <small>{item.descripcion}</small>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div ref={panel} className="uneti-admision__panel" key={paso}>
          <span className="uneti-admision__panel-etiqueta">{PASOS[paso - 1].titulo}</span>

          {paso === 1 && (
            <div className="row">
              <div className="col-md-6">
                <label className="uneti-campo__label" htmlFor="posg-nombre">
                  Nombre completo *
                </label>
                <div className={`uneti-campo${errores.nombre ? " uneti-campo--error" : ""}`}>
                  <span className="uneti-campo__icono">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    id="posg-nombre"
                    type="text"
                    name="nombre"
                    value={datos.nombre}
                    onChange={actualizar("nombre")}
                    placeholder="Nombre y apellido"
                    autoComplete="name"
                    maxLength={120}
                    aria-invalid={Boolean(errores.nombre)}
                    aria-describedby={errores.nombre ? "posg-nombre-error" : undefined}
                  />
                </div>
                {errores.nombre && (
                  <p id="posg-nombre-error" className="uneti-campo__error" role="alert">
                    {errores.nombre}
                  </p>
                )}
              </div>

              <div className="col-md-6">
                <label className="uneti-campo__label" htmlFor="posg-cedula">
                  Cédula de identidad *
                </label>
                <div className={`uneti-campo${errores.cedula ? " uneti-campo--error" : ""}`}>
                  <span className="uneti-campo__icono">
                    <i className="bi bi-person-vcard"></i>
                  </span>
                  <input
                    id="posg-cedula"
                    type="text"
                    name="cedula"
                    value={datos.cedula}
                    onChange={actualizar("cedula")}
                    placeholder="Ej. 12345678"
                    inputMode="numeric"
                    maxLength={10}
                    aria-invalid={Boolean(errores.cedula)}
                    aria-describedby={errores.cedula ? "posg-cedula-error" : undefined}
                  />
                </div>
                {errores.cedula && (
                  <p id="posg-cedula-error" className="uneti-campo__error" role="alert">
                    {errores.cedula}
                  </p>
                )}
              </div>

              <div className="col-md-6">
                <label className="uneti-campo__label" htmlFor="posg-correo">
                  Correo electrónico *
                </label>
                <div className={`uneti-campo${errores.correo ? " uneti-campo--error" : ""}`}>
                  <span className="uneti-campo__icono">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    id="posg-correo"
                    type="email"
                    name="correo"
                    value={datos.correo}
                    onChange={actualizar("correo")}
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    maxLength={160}
                    aria-invalid={Boolean(errores.correo)}
                    aria-describedby={errores.correo ? "posg-correo-error" : undefined}
                  />
                </div>
                {errores.correo && (
                  <p id="posg-correo-error" className="uneti-campo__error" role="alert">
                    {errores.correo}
                  </p>
                )}
              </div>

              <div className="col-md-6">
                <label className="uneti-campo__label" htmlFor="posg-telefono">
                  Teléfono *
                </label>
                <div className={`uneti-campo${errores.telefono ? " uneti-campo--error" : ""}`}>
                  <span className="uneti-campo__icono">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <input
                    id="posg-telefono"
                    type="tel"
                    name="telefono"
                    value={datos.telefono}
                    onChange={actualizar("telefono")}
                    placeholder="0212-505-1402"
                    autoComplete="tel"
                    maxLength={20}
                    aria-invalid={Boolean(errores.telefono)}
                    aria-describedby={errores.telefono ? "posg-telefono-error" : undefined}
                  />
                </div>
                {errores.telefono && (
                  <p id="posg-telefono-error" className="uneti-campo__error" role="alert">
                    {errores.telefono}
                  </p>
                )}
              </div>
            </div>
          )}

          {paso === 2 && (
            <>
              <fieldset className="uneti-programas uneti-programas--posgrado">
                <legend className="uneti-campo__label">Posgrado de interés (PNFA) *</legend>
                <div className="row g-3">
                  {POSGRADOS.map((posgrado) => {
                    const programa = programaDePosgrado(posgrado);
                    const activo = datos.programa === programa;

                    return (
                      <div className="col-md-6" key={posgrado.slug}>
                        <label
                          className={`uneti-programa uneti-programa--posgrado${
                            activo ? " is-selected" : ""
                          }`}
                          style={{ "--posgrado-color": posgrado.color } as CSSProperties}
                        >
                          <input
                            type="radio"
                            name="programa"
                            value={programa}
                            checked={activo}
                            onChange={() => seleccionarPrograma(programa)}
                          />
                          <span className="uneti-programa__icono">
                            <i className={posgrado.icono}></i>
                          </span>
                          <span className="uneti-programa__texto">
                            <strong>{posgrado.nombre}</strong>
                            <small>
                              {posgrado.siglas} · {posgrado.nivel}
                            </small>
                          </span>
                          <span className="uneti-programa__check">
                            <i className="bi bi-check-lg"></i>
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
                {errores.programa && (
                  <p className="uneti-campo__error" role="alert">
                    {errores.programa}
                  </p>
                )}
              </fieldset>

              <div className="mt-30px">
                <label className="uneti-campo__label" htmlFor="posg-mensaje">
                  Cuéntanos tu motivación
                </label>
                <div
                  className={`uneti-campo uneti-campo--textarea${
                    errores.mensaje ? " uneti-campo--error" : ""
                  }`}
                >
                  <span className="uneti-campo__icono">
                    <i className="bi bi-chat-square-dots"></i>
                  </span>
                  <textarea
                    id="posg-mensaje"
                    name="mensaje"
                    value={datos.mensaje}
                    onChange={actualizar("mensaje")}
                    placeholder="¿Por qué te interesa este posgrado?"
                    rows={4}
                    maxLength={2000}
                    aria-invalid={Boolean(errores.mensaje)}
                    aria-describedby={errores.mensaje ? "posg-mensaje-error" : undefined}
                  ></textarea>
                </div>
                {errores.mensaje && (
                  <p id="posg-mensaje-error" className="uneti-campo__error" role="alert">
                    {errores.mensaje}
                  </p>
                )}
              </div>

              {posgradoElegido && (
                <div
                  className="uneti-posgrado-elegido"
                  style={{ "--posgrado-color": posgradoElegido.color } as CSSProperties}
                >
                  <span className="uneti-posgrado-elegido__icono">
                    <i className={posgradoElegido.icono} aria-hidden="true"></i>
                  </span>
                  <div>
                    <strong>{posgradoElegido.nombre}</strong>
                    <span>
                      {posgradoElegido.nivel} · {posgradoElegido.duracion}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {paso === 3 && (
            <>
              <dl className="uneti-admision__resumen">
                <div>
                  <dt>Nombre</dt>
                  <dd>{datos.nombre}</dd>
                </div>
                <div>
                  <dt>Cédula</dt>
                  <dd>{datos.cedula}</dd>
                </div>
                <div>
                  <dt>Correo</dt>
                  <dd>{datos.correo}</dd>
                </div>
                <div>
                  <dt>Teléfono</dt>
                  <dd>{datos.telefono}</dd>
                </div>
                <div className="uneti-admision__resumen-ancho">
                  <dt>Posgrado</dt>
                  <dd
                    style={
                      posgradoElegido
                        ? ({ color: posgradoElegido.color } as CSSProperties)
                        : undefined
                    }
                  >
                    {datos.programa || "Sin seleccionar"}
                  </dd>
                </div>
                {datos.mensaje && (
                  <div className="uneti-admision__resumen-ancho">
                    <dt>Mensaje</dt>
                    <dd>{datos.mensaje}</dd>
                  </div>
                )}
              </dl>

              <label className="uneti-consentimiento" htmlFor="posg-consentimiento">
                <input
                  id="posg-consentimiento"
                  type="checkbox"
                  checked={consentimiento}
                  onChange={(event) => {
                    setConsentimiento(event.target.checked);
                    limpiarError("consentimiento");
                  }}
                  aria-invalid={Boolean(errores.consentimiento)}
                  aria-describedby={
                    errores.consentimiento ? "posg-consentimiento-error" : undefined
                  }
                />
                <span>
                  Autorizo el tratamiento de mis datos para que la UNETI pueda gestionar esta
                  solicitud de admisión a un posgrado (PNFA), conforme a su política de privacidad.
                </span>
              </label>
              {errores.consentimiento && (
                <p id="posg-consentimiento-error" className="uneti-campo__error" role="alert">
                  {errores.consentimiento}
                </p>
              )}
            </>
          )}
        </div>

        <div className="uneti-admision__acciones">
          {paso > 1 && (
            <button
              type="button"
              className="uneti-admision__atras"
              onClick={retroceder}
              disabled={estado === "sending"}
            >
              <i className="bi bi-arrow-left" aria-hidden="true"></i>
              Atrás
            </button>
          )}

          {paso < 3 ? (
            <button
              type="button"
              className="btn btn-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text"
              onClick={avanzar}
            >
              <span>
                <span className="btn-double-text" data-text="Siguiente">
                  Siguiente
                </span>
                <span>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </span>
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text left-icon"
              disabled={estado === "sending"}
            >
              <span>
                <span>
                  <i className="fa-regular fa-paper-plane"></i>
                </span>
                <span className="btn-double-text" data-text="Enviar solicitud">
                  {estado === "sending" ? "Enviando..." : "Enviar solicitud"}
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="uneti-honeypot" aria-hidden="true">
          <label htmlFor="posg-sitio-web">Sitio web</label>
          <input
            id="posg-sitio-web"
            type="text"
            name="sitio_web"
            ref={honeypot}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </form>

      {tfsa && (
        <AnimacionTFSA
          estado={tfsa.estado}
          ticket={tfsa.ticket}
          detalle={tfsa.detalle}
          onCerrar={() => {
            const eraExito = tfsa.estado === "exito";
            setTfsa(null);
            if (eraExito) reiniciar();
          }}
          onReintentar={
            tfsa.estado === "error"
              ? () => {
                  setTfsa(null);
                  setPaso(3);
                }
              : undefined
          }
        />
      )}
    </>
  );
}
