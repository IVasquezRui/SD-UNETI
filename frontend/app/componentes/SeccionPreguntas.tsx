import type { ElementoPregunta } from "../lib/institucional";

type FaqSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  items: ElementoPregunta[];
  backgroundImage?: string;
};

export default function SeccionPreguntas({
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
              <div className="uneti-faq-figure border-radius-6px overflow-hidden box-shadow-large">
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-100 h-auto"
                  width={960}
                  height={1280}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </div>
          <div className="col-lg-6 offset-lg-1 col-md-10">
            <div className="uneti-faq-list">
              {items.map((item, index) => (
                <details className="uneti-faq-item" key={item.id} open={index === 0}>
                  <summary>
                    <span className="uneti-faq-title">{item.title}</span>
                    <i className="bi bi-plus-lg" aria-hidden="true"></i>
                  </summary>
                  <div className="uneti-faq-answer">
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
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
