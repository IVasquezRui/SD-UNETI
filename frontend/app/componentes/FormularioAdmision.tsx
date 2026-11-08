"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { PROGRAMAS_ADMISION, validarSolicitud } from "../lib/solicitudes";
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
  { numero: 2, titulo: "Interés académico", descripcion: "Elige el PNF que quieres estudiar." },
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

export default function FormularioAdmision() {
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState<Datos>(DATOS_INICIALES);
  const [errores, setErrores] = useState<Errores>({});
  const [consentimiento, setConsentimiento] = useState(false);
  const [estado, setEstado] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [mensajeError, setMensajeError] = useState("");
  const [tfsa, setTfsa] = useState<{
    estado: "exito" | "error";
    ticket?: string | null;
    detalle?: string;
  } | null>(null);
  const inicio = useRef(0);
  const panel = useRef<HTMLDivElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inicio.current = Date.now();
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
      const id = campo === "consentimiento" ? "adm-consentimiento" : `adm-${campo}`;
      const elemento = document.getElementById(id);
      if (elemento instanceof HTMLElement) elemento.focus();
    });
  }

  function validarPaso(numero: number): Errores {
    const resultado = validarSolicitud(
      {
        ...datos,
        tipo: "admision",
        consentimiento: numero === 3 ? consentimiento : true,
      },
      "admision",
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
    setMensajeError("");
    setPaso(1);
    inicio.current = Date.now();
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validacion = validarSolicitud(
      { ...datos, tipo: "admision", consentimiento },
      "admision",
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
    setMensajeError("");

    try {
      const response = await fetch("/api/admisiones", {
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
        | { ok?: boolean; folio?: string; ticket?: string; id?: number; error?: string; errores?: Errores }
        | null;

      if (!response.ok) {
        if (body?.errores) setErrores(body.errores);
        throw new Error(body?.error ?? "No pudimos registrar tu solicitud.");
      }

      const ticket = body?.ticket ?? body?.folio ?? null;
      setEstado("idle");
      setTfsa({ estado: "exito", ticket });
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "No pudimos registrar tu solicitud. Inténtalo de nuevo.";
      setMensajeError(mensaje);
      setEstado("error");
      setTfsa({ estado: "error", detalle: mensaje });
    }
  }

  const progreso = Math.round((paso / PASOS.length) * 100);

  return (
    <>
      <form onSubmit={enviar} className="uneti-admision" noValidate>
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
          aria-label="Progreso de la solicitud"
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
              <label className="uneti-campo__label" htmlFor="adm-nombre">
                Nombre completo *
              </label>
              <div className={`uneti-campo${errores.nombre ? " uneti-campo--error" : ""}`}>
                <span className="uneti-campo__icono">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  id="adm-nombre"
                  type="text"
                  name="nombre"
                  value={datos.nombre}
                  onChange={actualizar("nombre")}
                  placeholder="Nombre y apellido"
                  autoComplete="name"
                  maxLength={120}
                  aria-invalid={Boolean(errores.nombre)}
                  aria-describedby={errores.nombre ? "adm-nombre-error" : undefined}
                />
              </div>
              {errores.nombre && (
                <p id="adm-nombre-error" className="uneti-campo__error" role="alert">
                  {errores.nombre}
                </p>
              )}
            </div>

            <div className="col-md-6">
              <label className="uneti-campo__label" htmlFor="adm-cedula">
                Cédula de identidad *
              </label>
              <div className={`uneti-campo${errores.cedula ? " uneti-campo--error" : ""}`}>
                <span className="uneti-campo__icono">
                  <i className="bi bi-person-vcard"></i>
                </span>
                <input
                  id="adm-cedula"
                  type="text"
                  name="cedula"
                  value={datos.cedula}
                  onChange={actualizar("cedula")}
                  placeholder="Ej. 12345678"
                  inputMode="numeric"
                  maxLength={12}
                  aria-invalid={Boolean(errores.cedula)}
                  aria-describedby={errores.cedula ? "adm-cedula-error" : undefined}
                />
              </div>
              {errores.cedula && (
                <p id="adm-cedula-error" className="uneti-campo__error" role="alert">
                  {errores.cedula}
                </p>
              )}
            </div>

            <div className="col-md-6">
              <label className="uneti-campo__label" htmlFor="adm-correo">
                Correo electrónico *
              </label>
              <div className={`uneti-campo${errores.correo ? " uneti-campo--error" : ""}`}>
                <span className="uneti-campo__icono">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  id="adm-correo"
                  type="email"
                  name="correo"
                  value={datos.correo}
                  onChange={actualizar("correo")}
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                  maxLength={160}
                  aria-invalid={Boolean(errores.correo)}
                  aria-describedby={errores.correo ? "adm-correo-error" : undefined}
                />
              </div>
              {errores.correo && (
                <p id="adm-correo-error" className="uneti-campo__error" role="alert">
                  {errores.correo}
                </p>
              )}
            </div>

            <div className="col-md-6">
              <label className="uneti-campo__label" htmlFor="adm-telefono">
                Teléfono *
              </label>
              <div className={`uneti-campo${errores.telefono ? " uneti-campo--error" : ""}`}>
                <span className="uneti-campo__icono">
                  <i className="bi bi-telephone"></i>
                </span>
                <input
                  id="adm-telefono"
                  type="tel"
                  name="telefono"
                  value={datos.telefono}
                  onChange={actualizar("telefono")}
                  placeholder="Ej. 0212-505-1402"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={25}
                  aria-invalid={Boolean(errores.telefono)}
                  aria-describedby={errores.telefono ? "adm-telefono-error" : undefined}
                />
              </div>
              {errores.telefono && (
                <p id="adm-telefono-error" className="uneti-campo__error" role="alert">
                  {errores.telefono}
                </p>
              )}
            </div>
          </div>
        )}

        {paso === 2 && (
          <>
            <fieldset className="uneti-programas">
              <legend className="uneti-campo__label">Programa Nacional de Formación *</legend>
              <div className="row g-3">
                {PROGRAMAS_ADMISION.map((programa) => {
                  const icono = programa.includes("Informática") ? "bi bi-cpu" : "bi bi-broadcast";
                  return (
                    <div className="col-md-6" key={programa}>
                      <label
                        className={`uneti-programa${
                          datos.programa === programa ? " is-selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="programa"
                          value={programa}
                          checked={datos.programa === programa}
                          onChange={() => seleccionarPrograma(programa)}
                        />
                        <span className="uneti-programa__icono">
                          <i className={icono}></i>
                        </span>
                        <span className="uneti-programa__texto">
                          <strong>{programa}</strong>
                          <small>TSU · 2 años · Ingeniería · 4 años</small>
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
              <label className="uneti-campo__label" htmlFor="adm-mensaje">
                Cuéntanos sobre tu interés
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
                  id="adm-mensaje"
                  name="mensaje"
                  value={datos.mensaje}
                  onChange={actualizar("mensaje")}
                  placeholder="¿Por qué quieres estudiar en la UNETI?"
                  rows={4}
                  maxLength={2000}
                  aria-invalid={Boolean(errores.mensaje)}
                  aria-describedby={errores.mensaje ? "adm-mensaje-error" : undefined}
                ></textarea>
              </div>
              {errores.mensaje && (
                <p id="adm-mensaje-error" className="uneti-campo__error" role="alert">
                  {errores.mensaje}
                </p>
              )}
            </div>
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
              <div>
                <dt>Programa</dt>
                <dd>{datos.programa}</dd>
              </div>
              {datos.mensaje && (
                <div className="uneti-admision__resumen-ancho">
                  <dt>Mensaje</dt>
                  <dd>{datos.mensaje}</dd>
                </div>
              )}
            </dl>

            <label className="uneti-consentimiento" htmlFor="adm-consentimiento">
              <input
                id="adm-consentimiento"
                type="checkbox"
                checked={consentimiento}
                onChange={(event) => {
                  setConsentimiento(event.target.checked);
                  limpiarError("consentimiento");
                }}
                aria-invalid={Boolean(errores.consentimiento)}
                aria-describedby={
                  errores.consentimiento ? "adm-consentimiento-error" : undefined
                }
              />
              <span>
                Autorizo el tratamiento de mis datos para que la UNETI pueda gestionar esta
                solicitud de admisión, conforme a su política de privacidad.
              </span>
            </label>
            {errores.consentimiento && (
              <p id="adm-consentimiento-error" className="uneti-campo__error" role="alert">
                {errores.consentimiento}
              </p>
            )}
          </>
        )}

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
          <label htmlFor="adm-sitio-web">Sitio web</label>
          <input
            id="adm-sitio-web"
            type="text"
            name="sitio_web"
            ref={honeypot}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div aria-live="polite">
          {estado === "error" && (
            <p className="uneti-admision__error" role="alert">
              {mensajeError ||
                "No pudimos registrar tu solicitud. Inténtalo de nuevo o escribe a rectorado@uneti.edu.ve."}
            </p>
          )}
        </div>
      </div>
      </form>

      {tfsa && (
        <AnimacionTFSA
          estado={tfsa.estado}
          ticket={tfsa.ticket}
          detalle={tfsa.detalle}
          etiquetaCerrar={tfsa.estado === "exito" ? "Enviar otra solicitud" : undefined}
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
