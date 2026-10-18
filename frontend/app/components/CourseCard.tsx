import type { Course } from "../lib/courses";

export default function CourseCard({ course }: { course: Course }) {
  const href = `/courses/${course.slug}`;

  return (
    <div className="services-box-style-06 border-radius-6px hover-box overflow-hidden box-shadow-large">
      <div className="image">
        {/* TODO(WPGraphQL): imagen destacada del CPT curso */}
        <a href={href}>
          <img src={course.image} alt={course.title} />
        </a>
      </div>
      <div className="bg-white position-relative">
        <div className="bg-dark-gray w-80px h-80px md-w-75px md-h-75px rounded-circle d-flex justify-content-center align-items-center fw-500 text-white fs-20 position-absolute right-30px top-minus-40px">
          {course.price}
        </div>
        <div className="ps-35px pe-35px pt-30px pb-30px xl-ps-25px xl-pe-25px border-bottom border-color-transparent-dark-very-light">
          <span className="d-block mb-10px">
            <a
              href="/courses"
              className="text-dark-gray text-uppercase fs-15 fw-600 services-text"
            >
              {course.category}
            </a>
            <span className="fs-16">{course.instructor.name}</span>
          </span>
          <div className="d-flex align-items-center mb-5px">
            <a href={href} className="text-dark-gray fw-600 fs-19 md-fs-18 lh-28 w-90">
              {course.title}
            </a>
          </div>
          <div className="d-flex align-items-center">
            <div className="d-inline-block me-auto">
              <div className="review-star-icon float-start">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
              </div>
              <div className="fs-15 float-start ms-5px position-relative top-2px">
                ({course.reviews} Reviews)
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center ps-35px pe-35px xl-ps-25px xl-pe-25px pt-15px pb-20px">
          <div className="me-auto">
            <i className="feather icon-feather-clipboard text-dark-gray d-inline-block me-5px"></i>
            <span className="fs-16 text-dark-gray fw-500">{course.lessons} Lessons</span>
          </div>
          <div>
            <i className="feather icon-feather-users text-dark-gray d-inline-block me-5px"></i>
            <span className="fs-16 text-dark-gray fw-500">{course.students} Students</span>
          </div>
        </div>
      </div>
    </div>
  );
}
