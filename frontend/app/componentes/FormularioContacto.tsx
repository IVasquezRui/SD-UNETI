"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

export default function FormularioContacto() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [mensajeError, setMensajeError] = useState("");
  const [folio, setFolio] = useState<string | null>(null);
  const inicio = useRef(0);

  useEffect(() => {
    inicio.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      tipo: "contacto",
      nombre: String(data.get("nombre") ?? ""),
      correo: String(data.get("correo") ?? ""),
      telefono: String(data.get("telefono") ?? ""),
      asunto: String(data.get("asunto") ?? ""),
      mensaje: String(data.get("mensaje") ?? ""),
      consentimiento: data.get("consentimiento") === "on",
      origen: window.location.href,
      inicio: inicio.current,
      sitio_web: String(data.get("sitio_web") ?? ""),
    };

    setStatus("sending");
    setMensajeError("");

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; folio?: string }
        | null;

      if (!response.ok) {
        throw new Error(body?.error ?? "No pudimos enviar tu mensaje.");
      }

      form.reset();
      inicio.current = Date.now();
      setFolio(body?.folio ?? null);
      setStatus("sent");
    } catch (error) {
      setMensajeError(
        error instanceof Error
          ? error.message
          : "No pudimos enviar tu mensaje. Inténtalo de nuevo o escribe a rectorado@uneti.edu.ve.",
      );
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contacto-form-style-03 uneti-contacto-form">
      <div className="row">
        <div className="col-md-6">
          <label
            htmlFor="contacto-nombre"
            className="form-label fs-14 text-uppercase text-dark-gray fw-600 mb-0"
          >
            Nombre completo*
          </label>
          <div className="position-relative form-group mb-30px">
            <span className="form-icon">
              <i className="bi bi-emoji-smile text-dark-gray"></i>
            </span>
            <input
              className="ps-0 border-radius-0px border-color-extra-medium-gray bg-transparent form-control"
              id="contacto-nombre"
              type="text"
              name="nombre"
              placeholder="Escribe tu nombre completo"
              autoComplete="name"
              maxLength={120}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <label
            htmlFor="contacto-correo"
            className="form-label fs-14 text-uppercase text-dark-gray fw-600 mb-0"
          >
            Correo electrónico*
          </label>
          <div className="position-relative form-group mb-30px">
            <span className="form-icon">
              <i className="bi bi-envelope text-dark-gray"></i>
            </span>
            <input
              className="ps-0 border-radius-0px border-color-extra-medium-gray bg-transparent form-control"
              id="contacto-correo"
              type="email"
              name="correo"
              placeholder="Escribe tu correo electrónico"
              autoComplete="email"
              maxLength={160}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <label
            htmlFor="contacto-telefono"
            className="form-label fs-14 text-uppercase text-dark-gray fw-600 mb-0"
          >
            Teléfono
          </label>
          <div className="position-relative form-group mb-30px">
            <span className="form-icon">
              <i className="bi bi-telephone text-dark-gray"></i>
            </span>
            <input
              className="ps-0 border-radius-0px border-color-extra-medium-gray bg-transparent form-control"
              id="contacto-telefono"
              type="tel"
              name="telefono"
              placeholder="Ej. 0212-505-1402"
              autoComplete="tel"
              maxLength={25}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <label
            htmlFor="contacto-asunto"
            className="form-label fs-14 text-uppercase text-dark-gray fw-600 mb-0"
          >
            Asunto
          </label>
          <div className="position-relative form-group mb-30px">
            <span className="form-icon">
              <i className="bi bi-journals text-dark-gray"></i>
            </span>
            <input
              className="ps-0 border-radius-0px border-color-extra-medium-gray bg-transparent form-control"
              id="contacto-asunto"
              type="text"
              name="asunto"
              placeholder="¿Cómo podemos ayudarte?"
              maxLength={160}
            />
          </div>
        </div>
        <div className="col-12 mb-35px">
          <label
            htmlFor="contacto-mensaje"
            className="form-label fs-14 text-uppercase text-dark-gray fw-600 mb-0"
          >
            Tu mensaje
          </label>
          <div className="position-relative form-group form-textarea mb-0">
            <textarea
              className="ps-0 border-radius-0px border-color-extra-medium-gray bg-transparent form-control"
              id="contacto-mensaje"
              name="mensaje"
              placeholder="Describe tu mensaje"
              rows={4}
              maxLength={2000}
            ></textarea>
            <span className="form-icon">
              <i className="bi bi-chat-square-dots text-dark-gray"></i>
            </span>
          </div>
        </div>
        <div className="col-12 mb-25px">
          <label className="uneti-consentimiento" htmlFor="contacto-consentimiento">
            <input
              id="contacto-consentimiento"
              type="checkbox"
              name="consentimiento"
              required
            />
            <span>
              Autorizo el tratamiento de mis datos para que la UNETI pueda atender esta
              solicitud, conforme a su política de privacidad.
            </span>
          </label>
        </div>
        <div className="uneti-honeypot" aria-hidden="true">
          <label htmlFor="contacto-sitio-web">Sitio web</label>
          <input
            id="contacto-sitio-web"
            type="text"
            name="sitio_web"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="col-md-8 sm-mb-30px text-center text-md-start">
          <p className="mb-0 fs-15 lh-26 w-80 lg-w-100">
            Nos comprometemos a proteger tu privacidad. Nunca recopilaremos información sobre ti
            sin tu consentimiento explícito.
          </p>
        </div>
        <div className="col-md-4 text-center text-md-end">
          <button
            className="btn btn-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text left-icon"
            type="submit"
            disabled={status === "sending"}
          >
            <span>
              <span>
                <i className="fa-regular fa-paper-plane"></i>
              </span>
              <span className="btn-double-text" data-text="Enviar mensaje">
                {status === "sending" ? "Enviando..." : "Enviar mensaje"}
              </span>
            </span>
          </button>
        </div>
        <div className="col-12 md-mb-20px" aria-live="polite">
          {status === "sent" && (
            <p className="form-results mt-20px mb-0 text-success">
              Gracias. Recibimos tu mensaje y nuestro equipo te contactará en breve.
              {folio && <span className="d-block fs-14">Folio: {folio}</span>}
            </p>
          )}
          {status === "error" && (
            <p className="form-results mt-20px mb-0 text-danger">
              {mensajeError ||
                "No pudimos enviar tu mensaje. Inténtalo de nuevo o escribe a rectorado@uneti.edu.ve."}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
