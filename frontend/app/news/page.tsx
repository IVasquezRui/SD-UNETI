import type { Metadata } from "next";
import BlogGrid from "../components/BlogGrid";
import PageTitle from "../components/PageTitle";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { POSTS } from "../lib/news";

export const metadata: Metadata = {
  title: "News | UNETI",
  description:
    "Noticias institucionales, vida universitaria, investigación y novedades académicas de UNETI.",
};

export default function NewsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageTitle
          title="Últimas noticias"
          subtitle="Noticias institucionales, vida universitaria e investigación."
          crumbs={[{ label: "Inicio", href: "/" }, { label: "Noticias" }]}
        />

        <section className="bg-gradient-tranquil-white overflow-hidden position-relative overlap-height">
          <div className="container overlap-gap-section">
            <div className="row mb-4 md-mb-6">
              <div className="col-12">
                <BlogGrid posts={POSTS} />
              </div>
            </div>
            {/* TODO(WPGraphQL): sustituir por paginación basada en pageInfo de POSTS_QUERY */}
            <div className="row justify-content-center">
              <div className="col-auto icon-with-text-style-08 md-mb-10px xs-mb-15px pe-25px md-pe-15px">
                <div className="feature-box feature-box-left-icon-middle xs-lh-28">
                  <div className="feature-box-icon me-10px">
                    <i className="feather icon-feather-mail fs-20 text-dark-gray"></i>
                  </div>
                  <div className="feature-box-content">
                    <span className="text-dark-gray fw-500 fs-20 xs-fs-18 ls-minus-05px">
                      Looking for help?{" "}
                      <a
                        href="/contact"
                        className="text-decoration-line-bottom-medium text-dark-gray fw-600"
                      >
                        Contáctanos hoy
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
                      Keep in touch.{" "}
                      <a
                        href="https://www.facebook.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-line-bottom-medium text-dark-gray fw-600"
                      >
                        Follow us on Facebook
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
