"use client";

import { useState, type FormEvent } from "react";

export type LeadVariant = "contact" | "enrollment" | "scholarship";

type LeadFormProps = {
  variant?: LeadVariant;
  programs?: string[];
};

const COPY: Record<
  LeadVariant,
  { subjectLabel: string; subjectPlaceholder: string; messagePlaceholder: string; submit: string }
> = {
  contact: {
    subjectLabel: "Asunto",
    subjectPlaceholder: "¿Cómo podemos ayudarte?",
    messagePlaceholder: "Describe tu mensaje",
    submit: "Enviar mensaje",
  },
  enrollment: {
    subjectLabel: "Programa de interés",
    subjectPlaceholder: "Selecciona un programa",
    messagePlaceholder: "Cuéntanos sobre tu formación académica",
    submit: "Solicitar admisión",
  },
  scholarship: {
    subjectLabel: "Programa de interés",
    subjectPlaceholder: "Selecciona un programa",
    messagePlaceholder: "Cuéntanos por qué solicitas una beca",
    submit: "Solicitar beca",
  },
};

export default function LeadForm({ variant = "contact", programs = [] }: LeadFormProps) {
  const copy = COPY[variant];
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, type: variant }),
      });

      if (!response.ok) throw new Error("Request failed");

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form-style-03">
      <div className="row">
        <div className="col-md-6">
          <label
            htmlFor={`${variant}-name`}
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
              id={`${variant}-name`}
              type="text"
              name="name"
              placeholder="Escribe tu nombre completo"
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <label
            htmlFor={`${variant}-email`}
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
              id={`${variant}-email`}
              type="email"
              name="email"
              placeholder="Escribe tu correo electrónico"
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <label
            htmlFor={`${variant}-phone`}
            className="form-label fs-14 text-uppercase text-dark-gray fw-600 mb-0"
          >
            Your phone number
          </label>
          <div className="position-relative form-group mb-30px">
            <span className="form-icon">
              <i className="bi bi-telephone text-dark-gray"></i>
            </span>
            <input
              className="ps-0 border-radius-0px border-color-extra-medium-gray bg-transparent form-control"
              id={`${variant}-phone`}
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
        <div className="col-md-6">
          <label
            htmlFor={`${variant}-subject`}
            className="form-label fs-14 text-uppercase text-dark-gray fw-600 mb-0"
          >
            {copy.subjectLabel}
          </label>
          <div className="position-relative form-group mb-30px">
            <span className="form-icon">
              <i className="bi bi-journals text-dark-gray"></i>
            </span>
            {variant === "contact" ? (
              <input
                className="ps-0 border-radius-0px border-color-extra-medium-gray bg-transparent form-control"
                id={`${variant}-subject`}
                type="text"
                name="subject"
                placeholder={copy.subjectPlaceholder}
              />
            ) : (
              <select
                className="ps-0 border-radius-0px border-color-extra-medium-gray bg-transparent form-control"
                id={`${variant}-subject`}
                name="subject"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  {copy.subjectPlaceholder}
                </option>
                {programs.map((program) => (
                  <option value={program} key={program}>
                    {program}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="col-12 mb-35px">
          <label
            htmlFor={`${variant}-message`}
            className="form-label fs-14 text-uppercase text-dark-gray fw-600 mb-0"
          >
            Tu mensaje
          </label>
          <div className="position-relative form-group form-textarea mb-0">
            <textarea
              className="ps-0 border-radius-0px border-color-extra-medium-gray bg-transparent form-control"
              id={`${variant}-message`}
              name="message"
              placeholder={copy.messagePlaceholder}
              rows={4}
            ></textarea>
            <span className="form-icon">
              <i className="bi bi-chat-square-dots text-dark-gray"></i>
            </span>
          </div>
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
              <span className="btn-double-text" data-text={copy.submit}>
                {status === "sending" ? "Enviando..." : copy.submit}
              </span>
            </span>
          </button>
        </div>
        <div className="col-12 md-mb-20px" aria-live="polite">
          {status === "sent" && (
            <p className="form-results mt-20px mb-0 text-success">
              Gracias. Recibimos tu solicitud y nuestro equipo te contactará en breve.
            </p>
          )}
          {status === "error" && (
            <p className="form-results mt-20px mb-0 text-danger">
              No pudimos enviar tu solicitud. Inténtalo de nuevo o escribe a rectorado@uneti.edu.ve.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
