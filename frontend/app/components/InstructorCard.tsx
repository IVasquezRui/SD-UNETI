import type { CourseInstructor } from "../lib/courses";

export default function InstructorCard({
  instructor,
  image,
}: {
  instructor: CourseInstructor;
  image?: string;
}) {
  return (
    <div className="text-center">
      <div className="position-relative overflow-hidden border-radius-6px mb-25px">
        {/* TODO(WPGraphQL): foto del instructor desde el CPT curso */}
        <img src={image ?? instructor.avatar} alt={instructor.name} className="w-100" />
      </div>
      <span className="d-block alt-font fs-20 fw-600 text-dark-gray ls-minus-05px">
        {instructor.name}
      </span>
      <span className="d-block fs-15 text-uppercase fw-600 mb-15px">{instructor.role}</span>
      <p className="w-90 mx-auto">{instructor.bio}</p>
      <div className="elements-social social-icon-style-02">
        <ul className="small-icon dark">
          <li className="sm-mb-0">
            <a
              className="facebook"
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label={`Facebook de ${instructor.name}`}
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>
          </li>
          <li className="sm-mb-0">
            <a
              className="twitter"
              href="https://www.twitter.com/"
              target="_blank"
              rel="noreferrer"
              aria-label={`Twitter de ${instructor.name}`}
            >
              <i className="fa-brands fa-twitter"></i>
            </a>
          </li>
          <li className="sm-mb-0">
            <a
              className="instagram"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label={`Instagram de ${instructor.name}`}
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
