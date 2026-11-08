"use client";

import { useEffect, useRef } from "react";

type PropiedadesTFSA = {
  estado: "exito" | "error";
  /** Folio devuelto por WordPress, mostrado como número de ticket. */
  ticket?: string | null;
  /** Mensaje adicional del backend (solo en error). */
  detalle?: string;
  onCerrar: () => void;
  onReintentar?: () => void;
  etiquetaCerrar?: string;
};

/**
 * TFSA — Transferencia Final de Solicitud Aceptada.
 *
 * Confirmación a pantalla completa de que una solicitud se envió y quedó
 * guardada en el backend. La variante de error conserva el mismo lenguaje
 * visual con el checklist en rojo.
 */
export default function AnimacionTFSA({
  estado,
  ticket,
  detalle,
  onCerrar,
  onReintentar,
  etiquetaCerrar,
}: PropiedadesTFSA) {
  const esExito = estado === "exito";
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const alPresionar = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCerrar();
    };

    document.addEventListener("keydown", alPresionar);
    const foco = window.setTimeout(() => cerrarRef.current?.focus(), 60);

    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener("keydown", alPresionar);
      window.clearTimeout(foco);
    };
  }, [onCerrar]);

  return (
    <div
      className={`uneti-tfsa uneti-tfsa--${estado}`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="uneti-tfsa-titulo"
      aria-describedby="uneti-tfsa-subtitulo"
    >
      <span className="uneti-tfsa__scrim" aria-hidden="true"></span>

      <div className="uneti-tfsa__card">
        <span className="uneti-tfsa__pulse">
          <span className="uneti-tfsa__halo" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>

          <span className="uneti-tfsa__icono" aria-hidden="true">
            <svg viewBox="0 0 120 120" role="presentation" focusable="false">
              <circle className="uneti-tfsa__aro" cx="60" cy="60" r="52" />
              {esExito ? (
                <path className="uneti-tfsa__trazo" d="M34 63l18 18 34-40" />
              ) : (
                <>
                  <path className="uneti-tfsa__trazo" d="M42 42l36 36" />
                  <path className="uneti-tfsa__trazo uneti-tfsa__trazo--dos" d="M78 42l-36 36" />
                </>
              )}
            </svg>
          </span>
        </span>

        <span className="uneti-tfsa__sello">TFSA</span>

        <h2 id="uneti-tfsa-titulo" className="uneti-tfsa__titulo">
          {esExito ? "Su solicitud ha sido enviada" : "No pudimos enviar su solicitud"}
        </h2>

        <p id="uneti-tfsa-subtitulo" className="uneti-tfsa__subtitulo" aria-live="assertive">
          {esExito ? (
            <>
              Su solicitud fue asignada bajo el número de ticket{" "}
              <strong className="uneti-tfsa__ticket">{ticket ?? "por confirmar"}</strong>
            </>
          ) : (
            "No se completó el envío. Revise su conexión e inténtelo de nuevo."
          )}
        </p>

        {detalle && <p className="uneti-tfsa__detalle">{detalle}</p>}

        <div className="uneti-tfsa__acciones">
          {!esExito && onReintentar && (
            <button type="button" className="uneti-tfsa__btn uneti-tfsa__btn--ghost" onClick={onReintentar}>
              <i className="bi bi-arrow-clockwise" aria-hidden="true"></i>
              Reintentar
            </button>
          )}

          <button
            ref={cerrarRef}
            type="button"
            className="uneti-tfsa__btn uneti-tfsa__btn--solido"
            onClick={onCerrar}
          >
            {etiquetaCerrar ?? (esExito ? "Entendido" : "Volver al formulario")}
            <i className={`bi ${esExito ? "bi-check2" : "bi-arrow-left"}`} aria-hidden="true"></i>
          </button>
        </div>

        <p className="uneti-tfsa__nota">
          <i className="bi bi-shield-check" aria-hidden="true"></i>
          {esExito
            ? "La información quedó registrada de forma segura en el gestor de contenido de la UNETI."
            : "Sus datos siguen en el formulario: puede corregirlos y reenviar."}
        </p>
      </div>
    </div>
  );
}
