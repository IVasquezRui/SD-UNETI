const FILTERS = [
  { label: "All", filter: "*" },
  { label: "Development", filter: ".development" },
  { label: "Business", filter: ".business" },
  { label: "Design", filter: ".design" },
  { label: "Marketing", filter: ".marketing" },
];

/** Filtros Isotope del template: main.js escucha `.portfolio-filter > li > a`. */
export default function CourseFilterNav({ targetId = "courses" }: { targetId?: string }) {
  return (
    <ul className="portfolio-filter fw-500 nav nav-tabs justify-content-center justify-content-xl-end border-0">
      {FILTERS.map((item, index) => (
        <li className={`nav${index === 0 ? " active" : ""}`} key={item.label}>
          <a data-filter={item.filter} href={`#${targetId}`}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
