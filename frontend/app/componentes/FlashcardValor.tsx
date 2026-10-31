"use client";

import { useState } from "react";
import type { ElementoValor } from "../lib/institucional";

type PropiedadesFlashcard = {
  valor: ElementoValor;
  indice: number;
};

/** Tarjeta con dos caras: resumen institucional y descripción completa. */
export default function FlashcardValor({ valor, indice }: PropiedadesFlashcard) {
  const [volteada, setVolteada] = useState(false);
  const numero = String(indice + 1).padStart(2, "0");
  const idReverso = `flashcard-${indice}`;

  return (
    <article
      className={`uneti-flashcard uneti-flashcard--${valor.tone}${
        volteada ? " is-flipped" : ""
      }`}
    >
      <div className="uneti-flashcard__inner">
        <div className="uneti-flashcard__cara uneti-flashcard__frente" aria-hidden={volteada}>
          <span className="uneti-flashcard__numero">{numero}</span>
          <span className="uneti-flashcard__icono" aria-hidden="true">
            <i className={valor.icon}></i>
          </span>
          <h3>{valor.title}</h3>
          <button
            type="button"
            className="uneti-flashcard__toggle"
            onClick={() => setVolteada(true)}
            aria-expanded={volteada}
            aria-controls={idReverso}
            tabIndex={volteada ? -1 : 0}
          >
            Ver descripción
            <i className="bi bi-arrow-right" aria-hidden="true"></i>
          </button>
        </div>

        <div
          id={idReverso}
          className="uneti-flashcard__cara uneti-flashcard__reverso"
          aria-hidden={!volteada}
        >
          <span className="uneti-flashcard__numero">{numero}</span>
          <p>{valor.description}</p>
          <button
            type="button"
            className="uneti-flashcard__toggle"
            onClick={() => setVolteada(false)}
            tabIndex={volteada ? 0 : -1}
          >
            <i className="bi bi-arrow-left" aria-hidden="true"></i>
            Volver
          </button>
        </div>
      </div>
    </article>
  );
}
