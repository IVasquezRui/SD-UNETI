import type { Post } from "../lib/news";

const PARTICLE_OPTIONS = JSON.stringify({
  particles: {
    number: { value: 12, density: { enable: true, value_area: 2000 } },
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

export default function ArticleHeader({ post }: { post: Post }) {
  return (
    <section
      className="ipad-top-space-margin bg-dark-gray cover-background one-fifth-screen d-flex align-items-center"
      style={{ backgroundImage: `url(${post.image})` }}
    >
      <div
        className="background-position-center-top h-100 w-100 position-absolute left-0px top-0"
        style={{ backgroundImage: "url('/assets/images/vertical-line-bg-small.svg')" }}
      ></div>
      <div
        id="article-header-particles"
        className="h-100 position-absolute left-0px top-0 w-100"
        data-particle="true"
        data-particle-options={PARTICLE_OPTIONS}
      ></div>
      <div className="opacity-light bg-dark-gray"></div>
      <div className="container">
        <div className="row justify-content-center">
          <div
            className="col-lg-10 position-relative"
            data-anime='{ "el": "childs", "opacity": [0, 1], "translateX": [50, 0], "staggervalue": 100, "easing": "easeOutQuad" }'
          >
            <div className="d-inline-block mb-20px sm-mb-25px">
              <span className="text-white fs-18 opacity-5">
                <time dateTime={post.dateISO}>{post.date}</time>
                <span className="d-inline-block fs-24 align-top ms-10px me-10px">•</span>
                <a href="/news" className="text-white">
                  {post.category}
                </a>
                <span className="d-inline-block fs-24 align-top ms-10px me-10px">•</span>
                {post.readTime}
              </span>
            </div>
            <h1 className="text-white w-60 lg-w-80 md-w-70 sm-w-100 fw-500 ls-minus-2px alt-font mb-30px overflow-hidden">
              {post.title}
            </h1>
            <div className="text-white fs-18 mt-40px d-flex align-items-center">
              <img
                className="w-80px h-80px rounded-circle me-15px"
                src={post.author.avatar}
                alt={post.author.name}
              />
              <span>
                By{" "}
                <a href="/news" className="text-white text-decoration-line-bottom">
                  {post.author.name}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
