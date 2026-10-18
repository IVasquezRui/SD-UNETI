import type { Course } from "../lib/courses";
import CourseCard from "./CourseCard";

const GRID_ANIME =
  '{ "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }';

export default function CourseGrid({
  courses,
  anime = GRID_ANIME,
}: {
  courses: Course[];
  anime?: string;
}) {
  return (
    <ul
      className="portfolio-wrapper grid-loading grid grid-3col xxl-grid-3col xl-grid-3col lg-grid-2col md-grid-2col sm-grid-1col xs-grid-1col gutter-extra-large"
      data-anime={anime}
    >
      <li className="grid-sizer"></li>
      {courses.map((course) => (
        <li
          className={`grid-item ${course.categories.join(" ")} transition-inner-all`}
          key={course.slug}
        >
          <CourseCard course={course} />
        </li>
      ))}
    </ul>
  );
}
