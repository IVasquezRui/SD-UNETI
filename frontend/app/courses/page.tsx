import type { Metadata } from "next";
import CourseFilterNav from "../components/CourseFilterNav";
import CourseGrid from "../components/CourseGrid";
import PageTitle from "../components/PageTitle";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { COURSES } from "../lib/courses";

export const metadata: Metadata = {
  title: "Carreras | UNETI",
  description:
    "Explora la oferta académica de UNETI: PNF en Telecomunicaciones y PNF en Informática, con salidas como Técnico Medio, TSU e Ingeniero.",
};

export default function CoursesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageTitle
          title="Oferta académica"
          subtitle="PNF en Telecomunicaciones y PNF en Informática."
          crumbs={[{ label: "Inicio", href: "/" }, { label: "Carreras" }]}
        />

        <section id="courses" className="bg-tranquil position-relative overlap-height">
          <div
            className="position-absolute left-minus-200px top-25"
            data-bottom-top="transform: translateY(-80px)"
            data-top-bottom="transform: translateY(80px)"
          >
            <img src="/assets/images/demo-elearning-bg-04.png" alt="" />
          </div>
          <div className="container overlap-gap-section">
            <div className="row align-items-center mb-4">
              <div className="col-xl-5 lg-mb-30px text-center text-xl-start">
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
                  Programas y cursos
                </h2>
              </div>
              <div className="col-xl-7 tab-style-04 text-center text-xl-end">
                <CourseFilterNav />
              </div>
            </div>
            <div className="row">
              <div className="col-12 filter-content p-md-0">
                <CourseGrid courses={COURSES} />
              </div>
            </div>
            {/* TODO(WPGraphQL): paginar con pageInfo.endCursor al conectar el CPT curso */}
            <div className="row justify-content-center mt-5">
              <div className="col-auto icon-with-text-style-08 md-mb-10px xs-mb-15px pe-25px md-pe-15px">
                <div className="feature-box feature-box-left-icon-middle xs-lh-28">
                  <div className="feature-box-icon me-10px">
                    <i className="feather icon-feather-mail fs-20 text-dark-gray"></i>
                  </div>
                  <div className="feature-box-content">
                    <span className="text-dark-gray fw-500 fs-20 xs-fs-18 ls-minus-05px">
                      Need guidance?{" "}
                      <a
                        href="/contact"
                        className="text-decoration-line-bottom-medium text-dark-gray fw-600"
                      >
                        Habla con admisiones
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-auto icon-with-text-style-08 ps-25px md-ps-15px md-pe-15px">
                <div className="feature-box feature-box-left-icon-middle xs-lh-28">
                  <div className="feature-box-icon me-10px">
                    <i className="feather icon-feather-thumbs-up fs-20 text-dark-gray"></i>
                  </div>
                  <div className="feature-box-content">
                    <span className="text-dark-gray fw-500 fs-20 xs-fs-18 ls-minus-05px">
                      Ready to apply?{" "}
                      <a
                        href="/admissions"
                        className="text-decoration-line-bottom-medium text-dark-gray fw-600"
                      >
                        Inicia tu admisión
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
