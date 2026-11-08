"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { validarSolicitud } from "../lib/solicitudes";
import AnimacionTFSA from "./AnimacionTFSA";

type Datos = {
  nombre: string;
  correo: string;
  telefono: string;
  asunto: string;
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
  correo: "",
  telefono: "",
  asunto: "",
  mensaje: "",
};

const MOTIVOS = [
  { valor: "Información académica", icono: "bi bi-info-circle" },
  { valor: "Admisiones PNF", icono: "bi bi-mortarboard" },
  { valor: "Posgrados", icono: "bi bi-award" },
  { valor: "Cursos", icono: "bi bi-journal-code" },
  { valor: "Campus Virtual", icono: "bi bi-laptop" },
  { valor: "Otro", icono: "bi bi-three-dots" },
];

const PASOS = [
  { numero: 1, titulo: "Datos personales", descripcion: "Cuéntanos cómo contactarte." },
  { numero: 2, titulo: "Motivo de contacto", descripcion: "Selecciona el tema y escribe tu mensaje." },
  {
    numero: 3,
    titulo: "Confirma y envía",
    descripcion: "Revisa tus datos y autoriza el tratamiento.",
  },
];

function camposDelPaso(paso: number): string[] {
  if (paso === 1) return ["nombre", "correo", "telefono"];
  if (paso === 2) return ["asunto", "mensaje"];
  return ["consentimiento"];
}

export default function FormularioContacto() {
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

  function seleccionarMotivo(asunto: string) {
    setDatos((previos) => ({ ...previos, asunto }));
    limpiarError("asunto");
  }

  function enfocar(campo: string) {
    requestAnimationFrame(() => {
      if (campo === "asunto") {
        document.querySelector<HTMLButtonElement>('[data-motivo="true"]')?.focus();
        return;
      }
      const id = campo === "consentimiento" ? "cont-consentimiento" : `cont-${campo}`;
      const elemento = document.getElementById(id);
      if (elemento instanceof HTMLElement) elemento.focus();
    });
  }

  function validarPaso(numero: number): Errores {
    const resultado = validarSolicitud(
      {
        ...datos,
        tipo: "contacto",
        consentimiento: numero === 3 ? consentimiento : true,
      },
      "contacto",
    );

    const permitidos = camposDelPaso(numero);
    const filtrados: Errores = {};

    for (const campo of permitidos) {
      if (resultado.errores[campo]) filtrados[campo] = resultado.errores[campo];
    }

    if (numero === 2) {
      if (datos.asunto.trim() === "") {
        filtrados.asunto = "Selecciona el motivo de tu consulta.";
      }
      if (datos.mensaje.trim().length < 10) {
        filtrados.mensaje = "Cuéntanos brevemente tu consulta (mínimo 10 caracteres).";
      }
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
      { ...datos, tipo: "contacto", consentimiento },
      "contacto",
    );

    const adicionales: Errores = {};
    if (datos.asunto.trim() === "") adicionales.asunto = "Selecciona el motivo de tu consulta.";
    if (datos.mensaje.trim().length < 10) {
      adicionales.mensaje = "Cuéntanos brevemente tu consulta (mínimo 10 caracteres).";
    }

    if (!validacion.valido || !validacion.datos || Object.keys(adicionales).length > 0) {
      const todos = { ...validacion.errores, ...adicionales };
      setErrores(todos);

      const campos = Object.keys(todos);
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
      const response = await fetch("/api/contacto", {
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
        throw new Error(body?.error ?? "No pudimos enviar tu mensaje.");
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
            : "No pudimos enviar tu mensaje. Inténtalo de nuevo.",
      });
    }
  }

  const progreso = Math.round((paso / PASOS.length) * 100);

  return (
    <>
      <form onSubmit={enviar} className="uneti-admision uneti-admision--contacto" noValidate>
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
            aria-label="Progreso del mensaje de contacto"
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
                <label className="uneti-campo__label" htmlFor="cont-nombre">
                  Nombre completo *
                </label>
                <div className={`uneti-campo${errores.nombre ? " uneti-campo--error" : ""}`}>
                  <span className="uneti-campo__icono">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    id="cont-nombre"
                    type="text"
                    name="nombre"
                    value={datos.nombre}
                    onChange={actualizar("nombre")}
                    placeholder="Escribe tu nombre completo"
                    autoComplete="name"
                    maxLength={120}
                    aria-invalid={Boolean(errores.nombre)}
                    aria-describedby={errores.nombre ? "cont-nombre-error" : undefined}
                  />
                </div>
                {errores.nombre && (
                  <p id="cont-nombre-error" className="uneti-campo__error" role="alert">
                    {errores.nombre}
                  </p>
                )}
              </div>

              <div className="col-md-6">
                <label className="uneti-campo__label" htmlFor="cont-correo">
                  Correo electrónico *
                </label>
                <div className={`uneti-campo${errores.correo ? " uneti-campo--error" : ""}`}>
                  <span className="uneti-campo__icono">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    id="cont-correo"
                    type="email"
                    name="correo"
                    value={datos.correo}
                    onChange={actualizar("correo")}
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    maxLength={160}
                    aria-invalid={Boolean(errores.correo)}
                    aria-describedby={errores.correo ? "cont-correo-error" : undefined}
                  />
                </div>
                {errores.correo && (
                  <p id="cont-correo-error" className="uneti-campo__error" role="alert">
                    {errores.correo}
                  </p>
                )}
              </div>

              <div className="col-md-6">
                <label className="uneti-campo__label" htmlFor="cont-telefono">
                  Teléfono *
                </label>
                <div className={`uneti-campo${errores.telefono ? " uneti-campo--error" : ""}`}>
                  <span className="uneti-campo__icono">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <input
                    id="cont-telefono"
                    type="tel"
                    name="telefono"
                    value={datos.telefono}
                    onChange={actualizar("telefono")}
                    placeholder="0212-505-1402"
                    autoComplete="tel"
                    maxLength={20}
                    aria-invalid={Boolean(errores.telefono)}
                    aria-describedby={errores.telefono ? "cont-telefono-error" : undefined}
                  />
                </div>
                {errores.telefono && (
                  <p id="cont-telefono-error" className="uneti-campo__error" role="alert">
                    {errores.telefono}
                  </p>
                )}
              </div>

              <div className="col-md-6 d-flex align-items-end">
                <p className="fs-14 mb-30px">
                  <i className="bi bi-shield-check text-base-color me-2" aria-hidden="true"></i>
                  Responderemos en un plazo de dos días hábiles.
                </p>
              </div>
            </div>
          )}

          {paso === 2 && (
            <>
              <fieldset className="uneti-motivos">
                <legend className="uneti-campo__label">Motivo de contacto *</legend>
                <div className="uneti-motivos__grid">
                  {MOTIVOS.map((motivo) => (
                    <button
                      key={motivo.valor}
                      type="button"
                      data-motivo="true"
                      className={`uneti-motivo${datos.asunto === motivo.valor ? " is-selected" : ""}`}
                      onClick={() => seleccionarMotivo(motivo.valor)}
                      aria-pressed={datos.asunto === motivo.valor}
                    >
                      <i className={motivo.icono} aria-hidden="true"></i>
                      {motivo.valor}
                    </button>
                  ))}
                </div>
                {errores.asunto && (
                  <p className="uneti-campo__error" role="alert">
                    {errores.asunto}
                  </p>
                )}
              </fieldset>

              <div className="mt-30px">
                <label className="uneti-campo__label" htmlFor="cont-mensaje">
                  Tu mensaje *
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
                    id="cont-mensaje"
                    name="mensaje"
                    value={datos.mensaje}
                    onChange={actualizar("mensaje")}
                    placeholder="Describe tu consulta"
                    rows={5}
                    maxLength={2000}
                    aria-invalid={Boolean(errores.mensaje)}
                    aria-describedby={errores.mensaje ? "cont-mensaje-error" : undefined}
                  ></textarea>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fs-13">Mínimo 10 caracteres.</span>
                  <span className="fs-13">{datos.mensaje.length}/2000</span>
                </div>
                {errores.mensaje && (
                  <p id="cont-mensaje-error" className="uneti-campo__error" role="alert">
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
                  <dt>Correo</dt>
                  <dd>{datos.correo}</dd>
                </div>
                <div>
                  <dt>Teléfono</dt>
                  <dd>{datos.telefono}</dd>
                </div>
                <div>
                  <dt>Motivo</dt>
                  <dd>{datos.asunto || "Sin seleccionar"}</dd>
                </div>
                <div className="uneti-admision__resumen-ancho">
                  <dt>Mensaje</dt>
                  <dd>{datos.mensaje}</dd>
                </div>
              </dl>

              <label className="uneti-consentimiento" htmlFor="cont-consentimiento">
                <input
                  id="cont-consentimiento"
                  type="checkbox"
                  checked={consentimiento}
                  onChange={(event) => {
                    setConsentimiento(event.target.checked);
                    limpiarError("consentimiento");
                  }}
                  aria-invalid={Boolean(errores.consentimiento)}
                  aria-describedby={
                    errores.consentimiento ? "cont-consentimiento-error" : undefined
                  }
                />
                <span>
                  Autorizo el tratamiento de mis datos para que la UNETI pueda atender esta
                  solicitud, conforme a su política de privacidad.
                </span>
              </label>
              {errores.consentimiento && (
                <p id="cont-consentimiento-error" className="uneti-campo__error" role="alert">
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
                <span className="btn-double-text" data-text="Enviar mensaje">
                  {estado === "sending" ? "Enviando..." : "Enviar mensaje"}
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="uneti-honeypot" aria-hidden="true">
          <label htmlFor="cont-sitio-web">Sitio web</label>
          <input
            id="cont-sitio-web"
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
          etiquetaCerrar={tfsa.estado === "exito" ? "Enviar otro mensaje" : undefined}
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
