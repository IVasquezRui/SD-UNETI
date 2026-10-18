"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterForm() {
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
        body: JSON.stringify({ ...payload, type: "newsletter" }),
      });

      if (!response.ok) throw new Error("Request failed");

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="position-relative w-100">
      <input
        className="input-small bg-dark-gray border-color-transparent-white-light w-100 form-control"
        type="email"
        name="email"
        placeholder="Ingresa tu correo electrónico..."
        aria-label="Email address"
        required
      />
      <button
        type="submit"
        aria-label="submit"
        className="btn pe-20px text-white fs-13 fw-500 lg-ps-15px lg-pe-15px submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Enviando" : "Enviar"}{" "}
        <i className="feather icon-feather-arrow-right submit"></i>
      </button>
      <div
        className="form-results border-radius-4px pt-5px pb-5px ps-15px pe-15px fs-14 lh-22 mt-10px w-100 text-center"
        aria-live="polite"
      >
        {status === "sent" && "Gracias por suscribirte a nuestro boletín."}
        {status === "error" && "No se pudo completar la suscripción. Inténtalo de nuevo."}
      </div>
    </form>
  );
}
