import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseGrid from "../../components/CourseGrid";
import CourseSidebar from "../../components/CourseSidebar";
import PageTitle from "../../components/PageTitle";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { COURSES, getCourseBySlug, getRelatedCourses } from "../../lib/courses";

type CourseDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: CourseDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return { title: "Course not found | UNETI" };
  }

  return {
    title: `${course.title} | UNETI`,
    description: course.summary,
  };
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const relatedCourses = getRelatedCourses(course.slug);

  return (
    <>
      <SiteHeader />
      <main>
        <PageTitle
          title="Course details"
          subtitle={course.title}
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: course.category },
          ]}
        />

        <section className="border-bottom border-color-extra-medium-gray pt-20px pb-20px">
          <div className="container">
            <div
              className="row text-center justify-content-center align-items-center"
              data-anime='{ "el": "childs", "opacity": [0, 1], "translateX": [30, 0], "duration": 600, "delay": 0, "staggervalue": 200, "easing": "easeOutQuad" }'
            >
              <div className="col-lg-auto d-flex justify-content-center md-mb-10px icon-with-text-style-08 text-center text-sm-start">
                <div className="feature-box feature-box-left-icon-middle d-inline-flex align-middle">
                  <div className="feature-box-icon me-15px">
                    <img
                      src={course.instructor.avatar}
                      className="rounded-circle w-60px"
                      alt={course.instructor.name}
                    />
                  </div>
                  <div className="feature-box-content">
                    <span>
                      <span className="fw-600 text-dark-gray">Instructor:</span>{" "}
                      {course.instructor.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-auto lg-p-0 d-none d-lg-block">
                <span className="w-1px h-20px bg-extra-medium-gray d-block"></span>
              </div>
              <div className="col-sm-auto">
                <span>
                  <span className="fw-600 text-dark-gray">Categories:</span> {course.category}
                </span>
              </div>
              <div className="col-auto lg-p-0 d-none d-sm-inline-block">
                <span className="w-1px h-20px bg-extra-medium-gray d-block"></span>
              </div>
              <div className="col-sm-auto">
                <span>
                  <span className="fw-600 text-dark-gray">Enrolled:</span> {course.students} students
                </span>
              </div>
              <div className="col-auto lg-p-0 d-none d-md-inline-block">
                <span className="w-1px h-20px bg-extra-medium-gray d-block"></span>
              </div>
              <div className="col-sm-auto">
                <div className="review-star-icon d-inline-block">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <div className="fs-15 lh-26 d-inline-block">({course.reviews} Reviews)</div>
              </div>
            </div>
          </div>
        </section>

        {/* start course content */}
        <section className="position-relative">
          <div className="container">
            <div
              className="row justify-content-center"
              data-anime='{ "el": "childs", "opacity": [0,1], "duration": 600, "delay": 100, "staggervalue": 300, "easing": "easeOutQuad" }'
            >
              <div className="col-lg-8 md-mb-50px">
                <div className="col-12">
                  {/* TODO(WPGraphQL): featuredImage del CPT curso */}
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-100 border-radius-6px mb-7"
                  />
                  {course.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  <div className="col-12 p-0 tab-style-04 mt-45px">
                    <ul className="nav nav-tabs justify-content-center fw-500 fs-18 ls-minus-05px mb-50px sm-mb-30px lh-70 sm-lh-40 text-center">
                      <li className="nav-item">
                        <a
                          data-bs-toggle="tab"
                          href="#course-tab-overview"
                          className="nav-link active"
                        >
                          Overview<span className="tab-border bg-dark-gray"></span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a data-bs-toggle="tab" href="#course-tab-content" className="nav-link">
                          Content<span className="tab-border bg-dark-gray"></span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a data-bs-toggle="tab" href="#course-tab-instructor" className="nav-link">
                          Instructor<span className="tab-border bg-dark-gray"></span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a data-bs-toggle="tab" href="#course-tab-review" className="nav-link">
                          Review<span className="tab-border bg-dark-gray"></span>
                        </a>
                      </li>
                    </ul>

                    <div className="tab-content">
                      {/* start overview tab */}
                      <div className="tab-pane fade in active show" id="course-tab-overview">
                        <div className="row align-items-center justify-content-center">
                          <div className="col-12 last-paragraph-no-margin">
                            <span className="fs-18 text-dark-gray fw-600 ls-minus-05px d-inline-block mb-5px">
                              Course description
                            </span>
                            <p>{course.summary}</p>
                            <div className="mt-20px mb-30px md-mt-10px d-inline-block w-100">
                              <span className="fs-18 text-dark-gray fw-600 ls-minus-05px d-inline-block mb-10px">
                                What you&apos;ll learn from this course
                              </span>
                              <ul className="p-0 m-0 list-style-02 text-dark-gray">
                                {course.highlights.map((highlight) => (
                                  <li key={highlight} className="mb-10px">
                                    <i className="bi bi-check-circle-fill text-base-color me-10px"></i>
                                    {highlight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="row row-cols-2 row-cols-md-4 g-3">
                              {[
                                { label: "Level", value: course.level },
                                { label: "Duration", value: course.duration },
                                { label: "Lessons", value: `${course.lessons}` },
                                { label: "Certificate", value: course.certificate },
                              ].map((fact) => (
                                <div className="col" key={fact.label}>
                                  <div className="bg-very-light-gray border-radius-4px p-20px text-center">
                                    <span className="d-block fs-14 text-uppercase fw-600 mb-5px">
                                      {fact.label}
                                    </span>
                                    <span className="d-block fs-18 text-dark-gray fw-600">
                                      {fact.value}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* end overview tab */}
                      {/* start content tab */}
                      <div className="tab-pane fade in" id="course-tab-content">
                        <div className="row">
                          <div className="col-12">
                            <div className="accordion accordion-style-04" id="course-accordion">
                              {course.curriculum.map((module, moduleIndex) => (
                                <div className="accordion-item" key={module.title}>
                                  <div className="accordion-header border-bottom border-color-extra-medium-gray mb-0">
                                    <a
                                      href={`#course-module-${moduleIndex + 1}`}
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#course-module-${moduleIndex + 1}`}
                                      aria-expanded={moduleIndex === 0}
                                      data-bs-parent="#course-accordion"
                                    >
                                      <div className="accordion-title position-relative mb-0 pe-20px text-dark-gray fw-600 ls-minus-05px">
                                        <span>{module.title}</span>
                                        <i className="fa-solid fa-angle-right icon-small"></i>
                                      </div>
                                    </a>
                                  </div>
                                  <div
                                    id={`course-module-${moduleIndex + 1}`}
                                    className={`accordion-collapse collapse${moduleIndex === 0 ? " show" : ""}`}
                                    data-bs-parent="#course-accordion"
                                  >
                                    <div className="accordion-body bg-white last-paragraph-no-margin">
                                      <ul className="p-0 m-0 list-style-02">
                                        {module.lessons.map((lesson, lessonIndex) => (
                                          <li
                                            key={lesson.title}
                                            className={
                                              lessonIndex === module.lessons.length - 1
                                                ? "pt-15px"
                                                : "border-bottom border-color-extra-medium-gray pt-15px pb-15px"
                                            }
                                          >
                                            <span>{lesson.title}</span>
                                            <span className="ms-auto text-medium-gray">
                                              {lesson.duration}
                                            </span>
                                            <a
                                              href={course.video}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="ms-15px text-dark-gray"
                                              aria-label={`Ver ${lesson.title}`}
                                            >
                                              <i className="fa-solid fa-circle-play fs-18"></i>
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* end content tab */}
                      {/* start instructor tab */}
                      <div className="tab-pane fade in" id="course-tab-instructor">
                        <div className="row align-items-center justify-content-center">
                          <div className="col-12">
                            <div className="feature-box feature-box-left-icon-middle d-md-inline-flex align-middle d-block text-md-start text-center">
                              <div className="feature-box-icon me-50px sm-me-0 sm-mb-30px">
                                <img
                                  src={course.instructor.avatar}
                                  className="border-radius-6px"
                                  alt={course.instructor.name}
                                />
                              </div>
                              <div className="feature-box-content">
                                <span className="d-block fs-18 mb-5px">
                                  <span className="fw-600 text-dark-gray">
                                    {course.instructor.name}
                                  </span>
                                  <span className="ps-10px pe-10px">/</span>
                                  {course.instructor.role}
                                </span>
                                <p>{course.instructor.bio}</p>
                                <div className="col-12 elements-social social-icon-style-03">
                                  <ul className="medium-icon">
                                    <li className="sm-mb-0">
                                      <a
                                        className="facebook"
                                        href="https://www.facebook.com/"
                                        target="_blank"
                                        rel="noreferrer"
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
                                      >
                                        <i className="fa-brands fa-instagram"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* end instructor tab */}
                      {/* start review tab */}
                      <div className="tab-pane fade in" id="course-tab-review">
                        <div className="row align-items-center mb-40px">
                          <div className="col-lg-3 pe-0 md-pe-15px text-center">
                            <div className="border-radius-4px p-30px md-mb-25px xl-p-20px bg-very-light-gray">
                              <h2 className="mb-5px text-dark-gray fw-700">{course.rating}</h2>
                              <span className="text-golden-yellow icon-small d-block ls-minus-2px">
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                              </span>
                              <span className="d-block fs-14 mt-10px">
                                ({course.reviews} Reviews)
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-9">
                            <div className="row g-4">
                              <div className="col-md-6">
                                <div className="d-flex align-items-center mb-15px">
                                  <img
                                    src="https://placehold.co/130x130"
                                    className="rounded-circle w-70px me-15px"
                                    alt=""
                                  />
                                  <div>
                                    <span className="d-block fw-600 text-dark-gray">
                                      Herman Miller
                                    </span>
                                    <span className="fs-14">Verified student</span>
                                  </div>
                                </div>
                                <p className="mb-0">
                                  Clear explanations and practical exercises. The curriculum is
                                  well structured and the instructor answers every question.
                                </p>
                              </div>
                              <div className="col-md-6">
                                <div className="d-flex align-items-center mb-15px">
                                  <img
                                    src="https://placehold.co/130x130"
                                    className="rounded-circle w-70px me-15px"
                                    alt=""
                                  />
                                  <div>
                                    <span className="d-block fw-600 text-dark-gray">
                                      Alexa Harvard
                                    </span>
                                    <span className="fs-14">Verified student</span>
                                  </div>
                                </div>
                                <p className="mb-0">
                                  I applied what I learned in my current job from the first week.
                                  Highly recommended for students and professionals.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* TODO(WPGraphQL): formulario de reseñas conectado a comentarios del CPT curso */}
                        <div className="row justify-content-center">
                          <div className="col-auto text-center">
                            <a
                              href="/contact"
                              className="btn btn-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text"
                            >
                              <span>
                                <span className="btn-double-text" data-text="Escribir una reseña">
                                  Escribir una reseña
                                </span>
                                <span>
                                  <i className="fa-solid fa-arrow-right"></i>
                                </span>
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* end review tab */}                    </div>
                  </div>
                </div>
              </div>
              <aside className="col-lg-4 ps-60px lg-ps-30px md-ps-15px">
                <CourseSidebar course={course} />
              </aside>
            </div>
          </div>
        </section>
        {/* end course content */}

        {/* start related courses */}
        <section className="bg-tranquil overflow-hidden position-relative overlap-height">
          <div className="container overlap-gap-section">
            <div className="row justify-content-center mb-2">
              <div className="col-xl-5 col-lg-6 text-center">
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px">Related courses</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <CourseGrid courses={relatedCourses} />
              </div>
            </div>
          </div>
        </section>
        {/* end related courses */}
      </main>
      <SiteFooter />
    </>
  );
}
