import ContadorAnimado from "./ContadorAnimado";

const AVATARES = ["A", "M", "J"];

type PropiedadesIndicador = {
  cantidad?: number;
  className?: string;
};

export default function IndicadorEnLinea({
  cantidad = 1240,
  className = "",
}: PropiedadesIndicador) {
  return (
    <div className={`uneti-live-card ${className}`.trim()}>
      <div className="uneti-live-card__head">
        <span className="uneti-live-dot" aria-hidden="true"></span>
        <span>En línea ahora</span>
      </div>
      <div className="uneti-live-card__value">
        <ContadorAnimado valor={cantidad} sufijo="+" />
        <span>estudiantes</span>
      </div>
      <div className="uneti-live-card__avatars" aria-hidden="true">
        {AVATARES.map((inicial) => (
          <span key={inicial}>{inicial}</span>
        ))}
      </div>
    </div>
  );
}
