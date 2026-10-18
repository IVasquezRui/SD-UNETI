import { CONTACT } from "../lib/institutional";

export default function VideoSection() {
  return (
    <section className="position-relative overflow-hidden">
      <div className="container">
        <div className="uneti-video-banner position-relative overflow-hidden p-9 sm-p-7 text-center">
          <div className="row justify-content-center position-relative z-index-1">
            <div className="col-lg-9">
              <span className="uneti-section-eyebrow text-white mb-20px">
                UNETI Educativo
              </span>
              <h2 className="alt-font text-white fw-600 ls-minus-2px mb-20px">
                Conéctate a nuestro canal educativo.
              </h2>
              <p className="text-white opacity-7 mb-40px">
                Mantente informado de nuestras transmisiones educativas, talleres y actividades
                académicas.
              </p>
              <a
                href={CONTACT.youtubeVideo}
                className="uneti-video-play popup-youtube mb-25px"
                aria-label="Reproducir video de UNETI Educativo"
              >
                <i className="fa-solid fa-play"></i>
              </a>
              <div>
                <a
                  href={CONTACT.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-link btn-hover-animation-switch btn-large text-white"
                >
                  <span>
                    <span className="btn-text">Suscríbete al canal</span>
                    <span className="btn-icon">
                      <i className="feather icon-feather-youtube"></i>
                    </span>
                    <span className="btn-icon">
                      <i className="feather icon-feather-youtube"></i>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
