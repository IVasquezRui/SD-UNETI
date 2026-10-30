import type { Curso } from "../lib/cursos";

export default function TarjetaCurso({ curso }: { curso: Curso }) {
  return (
    <article className="uneti-course-card h-100">
      <div className="uneti-course-card__head">
        <span className={`uneti-icon-tone uneti-tone-${curso.tono}`}>
          <i className={curso.icono}></i>
        </span>
        <span className="uneti-course-card__level">{curso.nivel}</span>
      </div>
      <h2 className="alt-font fs-24 fw-600 text-dark-gray mb-10px">{curso.titulo}</h2>
      <p className="uneti-course-card__summary">{curso.resumen}</p>
      <p className="fs-15 lh-26 mb-0">{curso.descripcion}</p>
      <ul className="uneti-course-card__topics">
        {curso.temas.map((tema) => (
          <li key={tema}>{tema}</li>
        ))}
      </ul>
      <dl className="uneti-course-card__meta">
        <div>
          <dt>Duración</dt>
          <dd>{curso.duracion}</dd>
        </div>
        <div>
          <dt>Modalidad</dt>
          <dd>{curso.modalidad}</dd>
        </div>
      </dl>
      <p className="uneti-course-card__result">
        <i className="bi bi-patch-check" aria-hidden="true"></i>
        <span>{curso.resultado}</span>
      </p>
      <a href="/contacto" className="uneti-course-card__cta">
        Solicitar información
        <i className="bi bi-arrow-right" aria-hidden="true"></i>
      </a>
    </article>
  );
}
