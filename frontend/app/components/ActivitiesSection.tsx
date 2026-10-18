import type { ActivityItem } from "../lib/institutional";

type ActivitiesSectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  items: ActivityItem[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
};

export default function ActivitiesSection({
  id,
  eyebrow,
  title,
  description,
  items,
  image,
  imageAlt,
  reverse = false,
}: ActivitiesSectionProps) {
  return (
    <section id={id} className="position-relative overflow-hidden">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className={`col-lg-5 col-md-10 ${reverse ? "order-lg-2 offset-lg-1" : ""} md-mb-40px`}>
            <span className="uneti-section-eyebrow mb-15px">{eyebrow}</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-20px">{title}</h2>
            <p className="mb-30px">{description}</p>
            <div className="border-radius-6px overflow-hidden box-shadow-large">
              <img src={image} alt={imageAlt} className="w-100 h-auto" />
            </div>
          </div>
          <div className={`col-lg-6 ${reverse ? "order-lg-1" : "offset-lg-1"} col-md-10`}>
            <div className="row row-cols-1 row-cols-sm-2 g-4">
              {items.map((item) => (
                <div className="col" key={item.title}>
                  <div className="uneti-activity-card d-flex flex-column align-items-center justify-content-center">
                    <span className={`uneti-icon-tone uneti-tone-${item.tone}`}>
                      <i className={item.icon}></i>
                    </span>
                    <p>{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
