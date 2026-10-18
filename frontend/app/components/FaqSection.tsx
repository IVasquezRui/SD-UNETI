import type { FaqItem } from "../lib/institutional";

type FaqSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  items: FaqItem[];
  backgroundImage?: string;
};

export default function FaqSection({
  id,
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  items,
  backgroundImage,
}: FaqSectionProps) {
  return (
    <section
      id={id}
      className="position-relative overflow-hidden"
      style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-5 col-md-10 md-mb-40px">
            <span className="uneti-section-eyebrow mb-15px">{eyebrow}</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-20px">{title}</h2>
            {description && <p className="mb-30px">{description}</p>}
            {image && (
              <div className="border-radius-6px overflow-hidden box-shadow-large">
                <img src={image} alt={imageAlt} className="w-100 h-auto" />
              </div>
            )}
          </div>
          <div className="col-lg-6 offset-lg-1 col-md-10">
            <div className="accordion uneti-accordion" id={`${id}-accordion`}>
              {items.map((item, index) => {
                const headingId = `${id}-heading-${item.id}`;
                const collapseId = `${id}-collapse-${item.id}`;
                const expanded = index === 0;

                return (
                  <div className="accordion-item" key={item.id}>
                    <h3 className="accordion-header" id={headingId}>
                      <button
                        className={`accordion-button${expanded ? "" : " collapsed"}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`}
                        aria-expanded={expanded}
                        aria-controls={collapseId}
                      >
                        {item.title}
                      </button>
                    </h3>
                    <div
                      id={collapseId}
                      className={`accordion-collapse collapse${expanded ? " show" : ""}`}
                      aria-labelledby={headingId}
                      data-bs-parent={`#${id}-accordion`}
                    >
                      <div className="accordion-body">
                        {item.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                        {item.list && item.ordered && (
                          <ol className="uneti-objectives-list">
                            {item.list.map((entry) => (
                              <li key={entry.title ?? entry.text}>
                                {entry.title && <strong>{entry.title}: </strong>}
                                {entry.text}
                              </li>
                            ))}
                          </ol>
                        )}
                        {item.list && !item.ordered && (
                          <ul className="uneti-model-list">
                            {item.list.map((entry) => (
                              <li key={entry.title ?? entry.text}>
                                {entry.icon && (
                                  <span className="uneti-model-icon" aria-hidden="true">
                                    {entry.icon}
                                  </span>
                                )}
                                <span>
                                  {entry.title && <strong>{entry.title}: </strong>}
                                  {entry.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
