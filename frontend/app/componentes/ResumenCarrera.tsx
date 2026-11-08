import type { Carrera } from "../lib/carreras";

const DATOS = [
  { icono: "bi bi-clock", clave: "duracion" as const, etiqueta: "Duración" },
  { icono: "bi bi-laptop", clave: "modalidad" as const, etiqueta: "Modalidad" },
  { icono: "bi bi-geo-alt", clave: "sedes" as const, etiqueta: "Sedes" },
];

export default function ResumenCarrera({ carrera }: { carrera: Carrera }) {
  return (
    <div className="uneti-resumen-carrera bg-white border-radius-6px box-shadow-large p-40px sm-p-30px">
      <span className="uneti-section-eyebrow mb-15px">Ficha del programa</span>
      <h2 className="alt-font fs-26 fw-600 text-dark-gray mb-25px">
        {carrera.nombre}
      </h2>

      <ul className="uneti-ficha-list list-unstyled mb-30px">
        {DATOS.map((dato) => (
          <li key={dato.etiqueta}>
            <span className="uneti-ficha-icono">
              <i className={dato.icono}></i>
            </span>
            <span>
              <span className="uneti-ficha-etiqueta">{dato.etiqueta}</span>
              <span className="uneti-ficha-valor">{carrera[dato.clave]}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="uneti-titulos">
        <span className="uneti-titulos__titulo">Títulos obtenidos</span>
        <ul className="uneti-titulos__lista list-unstyled mb-0">
          {carrera.salidas.map((salida) => (
            <li key={salida.titulo}>
              <span className="uneti-titulos__nivel">{salida.nivel}</span>
              <span className="d-block fw-600 text-dark-gray">{salida.titulo}</span>
              <span className="fs-14">{salida.duracion}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="/admisiones"
        className="btn btn-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text w-100 text-center"
      >
        <span>
          <span className="btn-double-text" data-text="Inicia tu admisión">
            Inicia tu admisión
          </span>
          <span>
            <i className="feather icon-feather-thumbs-up"></i>
          </span>
        </span>
      </a>
    </div>
  );
}
