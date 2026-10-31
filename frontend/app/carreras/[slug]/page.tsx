import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CarruselCarrera from "../../componentes/CarruselCarrera";
import EncabezadoSitio from "../../componentes/EncabezadoSitio";
import MallaCurricular from "../../componentes/MallaCurricular";
import PieSitio from "../../componentes/PieSitio";
import ResumenCarrera from "../../componentes/ResumenCarrera";
import TarjetaLaboratorio from "../../componentes/TarjetaLaboratorio";
import TituloPagina from "../../componentes/TituloPagina";
import {
  CARRERAS,
  obtenerCarreraPorSlug,
  obtenerCarrerasRelacionadas,
} from "../../lib/carreras";

type PropiedadesCarrera = {
  params: Promise<{ slug: string }>;
};

// Los detalles leen `params` para resolver el PNF; se declaran bloqueantes
// para cumplir con la validación de URL data de Next.js 16.
export const instant = false;

export function generateStaticParams() {
  return CARRERAS.map((carrera) => ({ slug: carrera.slug }));
}

export async function generateMetadata({
  params,
}: PropiedadesCarrera): Promise<Metadata> {
  const { slug } = await params;
  const carrera = obtenerCarreraPorSlug(slug);

  if (!carrera) {
    return { title: "Carrera no encontrada | UNETI" };
  }

  return {
    title: `${carrera.nombre} | UNETI`,
    description: carrera.resumen,
  };
}

export default async function DetalleCarreraPage({ params }: PropiedadesCarrera) {
  const { slug } = await params;
  const carrera = obtenerCarreraPorSlug(slug);

  if (!carrera) {
    notFound();
  }

  const relacionadas = obtenerCarrerasRelacionadas(carrera.slug);

  return (
    <>
      <EncabezadoSitio />
      <main>
        <TituloPagina
          title={carrera.nombre}
          subtitle={carrera.lema}
          image={carrera.portada}
          crumbs={[
            { label: "Inicio", href: "/" },
            { label: "Carreras", href: "/carreras" },
            { label: carrera.codigo },
          ]}
          particleId="carrera-detalle-particles"
        />

        <section className="position-relative overflow-hidden">
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-7 lg-mb-40px">
                <span className="uneti-section-eyebrow mb-15px">Presentación</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-20px">
                  {carrera.tituloOtorgado}
                </h2>
                {carrera.descripcion.map((parrafo) => (
                  <p key={parrafo} className="mb-20px">
                    {parrafo}
                  </p>
                ))}
                <div className="row row-cols-1 row-cols-sm-2 g-3 mt-30px">
                  {carrera.salidas.map((salida) => (
                    <div className="col" key={salida.titulo}>
                      <div className="uneti-salida-card h-100">
                        <span className="uneti-salida-nivel">{salida.nivel}</span>
                        <h3 className="alt-font fs-18 fw-600 text-dark-gray mb-5px">
                          {salida.titulo}
                        </h3>
                        <span className="d-block fs-14 text-base-color fw-600 mb-10px">
                          {salida.duracion}
                        </span>
                        <p className="fs-14 mb-0">{salida.descripcion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-5">
                <ResumenCarrera carrera={carrera} />
              </div>
            </div>
          </div>
        </section>

        <CarruselCarrera carrera={carrera} />

        <section className="bg-gradient-tranquil-white position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Fundamentos</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
                  Identidad y propósito del programa
                </h2>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-lg-7">
                <div className="bg-white border-radius-6px p-40px sm-p-30px h-100 box-shadow-large">
                  <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-15px">
                    Fundamentación
                  </h3>
                  {carrera.fundamentacion.map((parrafo) => (
                    <p key={parrafo} className="mb-15px">
                      {parrafo}
                    </p>
                  ))}
                  <ul className="uneti-difference-list mb-0">
                    {carrera.competencias.map((competencia) => (
                      <li key={competencia}>{competencia}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="row g-4">
                  <div className="col-12">
                    <div className="uneti-mision-card h-100 bg-dark-gray text-white border-radius-6px p-35px">
                      <span className="uneti-icon-tone uneti-tone-orange mb-15px">
                        <i className="bi bi-compass"></i>
                      </span>
                      <h3 className="alt-font fs-20 fw-600 text-white mb-10px">Misión</h3>
                      <p className="text-white opacity-7 mb-0">{carrera.mision}</p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="uneti-mision-card h-100 bg-white border-radius-6px p-35px box-shadow-large">
                      <span className="uneti-icon-tone uneti-tone-blue mb-15px">
                        <i className="bi bi-eye"></i>
                      </span>
                      <h3 className="alt-font fs-20 fw-600 text-dark-gray mb-10px">Visión</h3>
                      <p className="mb-0">{carrera.vision}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className="bg-white border-radius-6px p-40px sm-p-30px h-100 box-shadow-large">
                  <span className="uneti-section-eyebrow mb-15px">Perfil de ingreso</span>
                  <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-15px">
                    ¿Qué necesitas para comenzar?
                  </h3>
                  <ul className="uneti-difference-list mb-0">
                    {carrera.perfilIngreso.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="bg-white border-radius-6px p-40px sm-p-30px h-100 box-shadow-large">
                  <span className="uneti-section-eyebrow mb-15px">Perfil de egreso</span>
                  <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-15px">
                    ¿Qué podrás hacer al graduarte?
                  </h3>
                  <ul className="uneti-difference-list mb-0">
                    {carrera.perfilEgreso.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="position-relative overflow-hidden">
          <div className="container">
            <div className="row align-items-start g-4">
              <div className="col-lg-7">
                <span className="uneti-section-eyebrow mb-15px">Campo laboral</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-20px">
                  ¿Dónde podrás trabajar?
                </h2>
                <p className="mb-30px">
                  Nuestros egresados se desempeñan en instituciones públicas, empresas privadas,
                  organizaciones comunitarias y emprendimientos propios.
                </p>
                <ul className="uneti-campo-list list-unstyled mb-0">
                  {carrera.campoLaboral.map((campo) => (
                    <li key={campo}>
                      <i className="bi bi-check2-circle"></i>
                      <span>{campo}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-5">
                <div className="uneti-campo-imagen border-radius-6px overflow-hidden box-shadow-large">
                  <img src={carrera.galeria[1].imagen} alt={carrera.galeria[1].alt} loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="bg-tranquil position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Plan de estudios</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
                  Malla curricular por trayectos
                </h2>
                <p className="mb-0">
                  Cada trayecto integra unidades curriculares, laboratorio y un proyecto
                  sociotecnológico vinculado al territorio.
                </p>
              </div>
            </div>
            <MallaCurricular trayectos={carrera.trayectos} />
          </div>
        </section>

        <section className="position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Infraestructura</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
                  Laboratorios y espacios de práctica
                </h2>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {carrera.laboratorios.map((laboratorio) => (
                <div className="col" key={laboratorio.nombre}>
                  <TarjetaLaboratorio laboratorio={laboratorio} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-tranquil-white position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Salidas profesionales</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
                  Avanza por etapas, obtén títulos progresivos
                </h2>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {carrera.salidas.map((salida, indice) => (
                <div className="col" key={salida.titulo}>
                  <article className="uneti-salida-etapa h-100 bg-white border-radius-6px p-35px box-shadow-large">
                    <span className="uneti-etapa-numero">{String(indice + 1).padStart(2, "0")}</span>
                    <span className="uneti-salida-nivel">{salida.nivel}</span>
                    <h3 className="alt-font fs-20 fw-600 text-dark-gray mb-10px">
                      {salida.titulo}
                    </h3>
                    <span className="d-block fs-14 text-base-color fw-600 mb-15px">
                      {salida.duracion}
                    </span>
                    <p className="mb-0">{salida.descripcion}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <div className="text-center mb-4">
                  <span className="uneti-section-eyebrow mb-15px">Preguntas frecuentes</span>
                  <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
                    Resolvemos tus dudas
                  </h2>
                </div>
                <div className="uneti-faq-carrera">
                  {carrera.faqs.map((faq) => (
                    <details
                      key={faq.pregunta}
                      className="uneti-faq-item bg-white border-radius-6px mb-15px box-shadow-large"
                    >
                      <summary>
                        <span>{faq.pregunta}</span>
                        <i className="bi bi-plus-lg"></i>
                      </summary>
                      <p className="mb-0">{faq.respuesta}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {relacionadas.length > 0 && (
          <section className="bg-tranquil position-relative overflow-hidden">
            <div className="container">
              <div className="row align-items-center mb-4">
                <div className="col-lg-8">
                  <span className="uneti-section-eyebrow mb-10px">Otra ruta</span>
                  <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
                    También puedes explorar
                  </h2>
                </div>
                <div className="col-lg-4 text-lg-end">
                  <a
                    href="/carreras"
                    className="btn btn-link btn-hover-animation-switch btn-large text-dark-gray fw-600"
                  >
                    <span>
                      <span className="btn-text">Ver todas las carreras</span>
                      <span className="btn-icon">
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                      <span className="btn-icon">
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </span>
                  </a>
                </div>
              </div>
              <div className="row g-4">
                {relacionadas.map((otraCarrera) => (
                  <div className="col-lg-6" key={otraCarrera.slug}>
                    <article className="uneti-carrera-relacionada bg-white border-radius-6px overflow-hidden box-shadow-large h-100">
                      <div className="row g-0 h-100">
                        <div className="col-sm-5">
                          <a href={`/carreras/${otraCarrera.slug}`} className="d-block h-100">
                            <img
                              src={otraCarrera.portada}
                              alt={otraCarrera.nombre}
                              className="uneti-relacionada-imagen"
                              loading="lazy"
                            />
                          </a>
                        </div>
                        <div className="col-sm-7">
                          <div className="p-30px d-flex flex-column h-100">
                            <span className="uneti-section-eyebrow mb-10px">
                              {otraCarrera.codigo}
                            </span>
                            <h3 className="alt-font fs-20 fw-600 text-dark-gray mb-10px">
                              {otraCarrera.nombre}
                            </h3>
                            <p className="fs-15 mb-20px">{otraCarrera.resumen}</p>
                            <a
                              href={`/carreras/${otraCarrera.slug}`}
                              className="fw-600 text-dark-gray mt-auto"
                            >
                              Conocer el PNF{" "}
                              <i className="feather icon-feather-arrow-right ms-5px"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}


        <section className="position-relative overflow-hidden pb-0">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9 text-center">
                <span className="uneti-section-eyebrow mb-15px">Da el siguiente paso</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
                  Inicia tu admisión al {carrera.nombre}
                </h2>
                <p className="mb-30px">
                  Reúne tus documentos, consulta las fechas y recibe acompañamiento del equipo de
                  admisiones de la UNETI.
                </p>
                <a
                  href="/admisiones"
                  className="btn btn-extra-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text me-15px mb-15px"
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
                <a
                  href="/contacto"
                  className="btn btn-extra-large btn-link btn-hover-animation-switch text-dark-gray fw-600 mb-15px"
                >
                  <span>
                    <span className="btn-text">Habla con nosotros</span>
                    <span className="btn-icon">
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                    <span className="btn-icon">
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PieSitio />
    </>
  );
}
