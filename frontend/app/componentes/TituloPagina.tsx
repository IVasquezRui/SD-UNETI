import type { ReactNode } from "react";

type MigaPan = {
  label: string;
  href?: string;
};

type PropiedadesTituloPagina = {
  title: string;
  subtitle?: string;
  image?: string;
  crumbs?: MigaPan[];
  children?: ReactNode;
  particleId?: string;
};

const PARTICLE_OPTIONS = JSON.stringify({
  particles: {
    number: { value: 8, density: { enable: true, value_area: 2000 } },
    color: { value: ["#ff7f46", "#ff7f46", "#ff7f46", "#ff7f46", "#ff7f46"] },
    shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
    opacity: { value: 1, random: false, anim: { enable: false, speed: 1, sync: false } },
    size: { value: 8, random: true, anim: { enable: false, sync: true } },
    line_linked: { enable: false, distance: 0, color: "#ffffff", opacity: 1, width: 1 },
    move: { enable: true, speed: 1, direction: "right", random: false, straight: false },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: false, mode: "repulse" },
      onclick: { enable: false, mode: "push" },
      resize: true,
    },
  },
  retina_detect: false,
});

export default function TituloPagina({
  title,
  subtitle,
  image,
  crumbs,
  children,
  particleId = "page-title-particles",
}: PropiedadesTituloPagina) {
  return (
    <section
      className="ipad-top-space-margin bg-dark-gray cover-background page-title-big-typography"
      style={{ backgroundImage: `url(${image ?? "/assets/images/uneti/about_top_bg.jpg"})` }}
    >
      <div
        className="background-position-center-top h-100 w-100 position-absolute left-0px top-0"
        style={{ backgroundImage: "url('/assets/images/vertical-line-bg-small.svg')" }}
      ></div>
      <div
        id={particleId}
        className="h-100 position-absolute left-0px top-0 w-100"
        data-particle="true"
        data-particle-options={PARTICLE_OPTIONS}
      ></div>
      <div className="container">
        <div className="row align-items-center extra-small-screen">
          <div
            className="col-xl-7 col-lg-8 col-md-9 position-relative page-title-extra-small"
            data-anime='{ "el": "childs", "translateY": [-15, 0], "perspective": [1200,1200], "scale": [1.1, 1], "rotateX": [50, 0], "opacity": [0,1], "duration": 800, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'
          >
            {crumbs && crumbs.length > 0 && (
              <div className="d-inline-block mb-20px">
                <span className="text-white fs-16 opacity-5">
                  {crumbs.map((crumb, index) => (
                    <span key={crumb.label}>
                      {index > 0 && (
                        <span className="d-inline-block fs-18 align-top ms-10px me-10px">•</span>
                      )}
                      {crumb.href ? (
                        <a href={crumb.href} className="text-white">
                          {crumb.label}
                        </a>
                      ) : (
                        crumb.label
                      )}
                    </span>
                  ))}
                </span>
              </div>
            )}
            <h1 className="mb-20px alt-font text-yellow">{title}</h1>
            {subtitle && (
              <h2 className="fw-500 m-0 ls-minus-2px text-white alt-font">{subtitle}</h2>
            )}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
