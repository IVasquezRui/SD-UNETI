const ACCORDION_ITEMS = [
  { id: "01", title: "Master the skills that matter to you", icon: "line-icon-Address-Book", open: true },
  { id: "02", title: "Connect with effective methods", icon: "line-icon-Sand-watch", open: false },
  { id: "03", title: "Increase your learning skills", icon: "line-icon-Gear-2", open: false },
];

const MARQUEE_TEXTS = [
  "providing amazing online",
  "courses bringing you",
  "outstanding online learning",
];

const MARQUEE_OPTIONS = JSON.stringify({
  slidesPerView: "auto",
  spaceBetween: 80,
  centeredSlides: true,
  speed: 30000,
  loop: true,
  pagination: { el: ".slider-four-slide-pagination-2", clickable: false },
  allowTouchMove: false,
  autoplay: { delay: 1, disableOnInteraction: false },
  navigation: { nextEl: ".slider-four-slide-next-2", prevEl: ".slider-four-slide-prev-2" },
  keyboard: { enabled: true, onlyInViewport: true },
  effect: "slide",
});

export default function LearningSection() {
  return (
    <section className="overflow-hidden">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div
            className="col-xl-7 col-lg-6 text-center md-mb-50px sm-mb-30px"
            data-anime='{ "el": "childs", "opacity": [0, 1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'
          >
            <div
              className="position-relative pe-50px lg-pe-0 outside-box-left-10 md-outside-box-left-0 atropos"
              data-atropos
            >
              <div className="atropos-scale">
                <div className="atropos-rotate">
                  <div className="atropos-inner text-center w-100 overflow-visible">
                    <div data-atropos-offset="-5" className="position-absolute left-0px">
                      <img src="https://placehold.co/835x710" alt="" />
                    </div>
                    <img
                      data-atropos-offset="5"
                      className="position-relative z-index-9"
                      src="/assets/images/demo-elearning-06.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xl-5 col-lg-6 col-md-11 position-relative"
            data-anime='{ "el": "childs", "translateX": [30, 0], "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 100, "staggervalue": 300, "easing": "easeOutQuad" }'
          >
            <div className="icon-with-text-style-08 mb-20px">
              <div className="feature-box feature-box-left-icon-middle">
                <div className="feature-box-icon feature-box-icon-rounded w-55px h-55px rounded-circle bg-yellow me-15px">
                  <i className="bi bi-briefcase d-inline-block icon-extra-medium text-dark-gray"></i>
                </div>
                <div className="feature-box-content last-paragraph-no-margin">
                  <span className="d-inline-block alt-font fs-19 fw-500 ls-minus-05px text-dark-gray">
                    Premium learning experience
                  </span>
                </div>
              </div>
            </div>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-40px sm-mb-25px mx-auto">
              Providing amazing online courses.
            </h2>
            <div className="accordion accordion-style-06 text-start" id="accordion-style-07">
              {ACCORDION_ITEMS.map((item) => (
                <div className={`accordion-item${item.open ? " active-accordion" : ""}`} key={item.id}>
                  <div className="accordion-header">
                    <a
                      href="#"
                      data-bs-toggle="collapse"
                      data-bs-target={`#accordion-style-07-${item.id}`}
                      aria-expanded={item.open}
                      data-bs-parent="#accordion-style-07"
                    >
                      <div
                        className={`accordion-title fs-18 position-relative pe-0 text-dark-gray fw-600 mb-0${item.open ? " xs-lh-28px" : ""}`}
                      >
                        {item.title}
                      </div>
                    </a>
                  </div>
                  <div
                    id={`accordion-style-07-${item.id}`}
                    className={`accordion-collapse collapse${item.open ? " show" : ""}`}
                    data-bs-parent="#accordion-style-07"
                  >
                    <div className="accordion-body last-paragraph-no-margin">
                      <p>Web-based training you can consume at your own pace. Courses are interactive.</p>
                      <i className={`${item.icon} icon-extra-double-large opacity-2`}></i>
                    </div>
                  </div>
                </div>
              ))}

            </div>
            <a
              href="#courses"
              className="btn btn-extra-large btn-dark-gray btn-box-shadow btn-rounded btn-switch-text mt-30px"
            >
              <span>
                <span className="btn-double-text" data-text="Explore courses">
                  Explore courses
                </span>
                <span>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row position-relative mt-40px xs-mt-20px">
          <div
            className="col swiper swiper-width-auto feather-shadow text-center"
            data-slider-options={MARQUEE_OPTIONS}
          >
            <div className="swiper-wrapper marquee-slide">
              {MARQUEE_TEXTS.map((text) => (
                <div className="swiper-slide" key={text}>
                  <div className="fs-190 ls-minus-10px pt-10px pb-10px alt-font fw-600 opacity-1">
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 position-absolute top-0 h-100 d-flex justify-content-center align-items-center left-0px z-index-1 text-center">
            <h4 className="alt-font text-dark-gray fs-45 fw-600 ls-minus-2px xs-ls-minus-1px mb-0 mt-40px xs-mt-15px">
              Online learning wherever and whenever.
            </h4>
          </div>
        </div>
      </div>

    </section>
  );
}
