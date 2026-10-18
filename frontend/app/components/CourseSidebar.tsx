import type { Course } from "../lib/courses";

export default function CourseSidebar({ course }: { course: Course }) {
  const features = [
    { icon: "bi bi-clock-history", label: "Duration", value: course.duration },
    { icon: "bi bi-people", label: "Enrolled", value: `${course.students} students` },
    { icon: "bi bi-globe", label: "Language", value: course.language },
    { icon: "bi bi-clipboard-check", label: "Lessons", value: `${course.lessons}` },
    { icon: "bi bi-award", label: "Certificate", value: course.certificate },
  ];

  return (
    <div className="position-sticky top-150px lg-position-relative lg-top-0px">
      <div className="border-radius-6px overflow-hidden bg-tranquil">
        <div className="position-relative">
          {/* TODO(WPGraphQL): preview/video destacado del curso */}
          <img src={course.image} className="md-w-100" alt={course.title} />
          <a
            href={course.video}
            className="absolute-middle-center d-inline-block text-center bg-white box-shadow-extra-large rounded-circle video-icon-box video-icon-large popup-youtube"
            aria-label={`Ver presentación de ${course.title}`}
          >
            <span>
              <span className="video-icon bg-white">
                <i className="fa-solid fa-play text-dark-gray"></i>
                <span className="video-icon-sonar">
                  <span className="video-icon-sonar-bfr bg-white opacity-9"></span>
                </span>
              </span>
            </span>
          </a>
        </div>
        <div className="p-35px lg-p-25px">
          <ul className="p-0 mb-20px list-style-02">
            {features.map((feature, index) => (
              <li
                key={feature.label}
                className={
                  index === features.length - 1
                    ? "pt-10px pb-15px"
                    : "border-bottom border-color-extra-medium-gray pt-15px pb-15px first:pt-0"
                }
              >
                <span className="text-dark-gray d-flex">
                  <span className="me-10px">
                    <i className={`${feature.icon} fs-20`}></i>
                  </span>
                  <span className="fw-600">{feature.label}</span>
                </span>
                <span className="ms-auto">{feature.value}</span>
              </li>
            ))}
          </ul>
          <div className="text-white bg-dark-gray text-center border-radius-50px pt-10px pb-10px fs-18 fw-500 lh-34 w-100 mb-15px">
            Price: {course.price}
          </div>
          <a
            href="/admissions"
            className="btn btn-extra-large btn-base-color btn-rounded btn-switch-text fw-600 left-icon w-100"
          >
            <span>
              <span>
                <i className="feather icon-feather-thumbs-up"></i>
              </span>
              <span className="btn-double-text" data-text="Enroll now">
                Enroll now
              </span>
            </span>
          </a>
          <div className="elements-social social-icon-style-02 mt-20px">
            <ul className="small-icon dark text-center">
              <li className="sm-mb-0">
                <a className="facebook" href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              </li>
              <li className="sm-mb-0">
                <a className="twitter" href="https://www.twitter.com/" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-twitter"></i>
                </a>
              </li>
              <li className="sm-mb-0">
                <a className="instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
