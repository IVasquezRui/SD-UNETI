import type { CSSProperties } from "react";

const PARTICULAS = [
  { left: "4%", top: "24%", size: 7, delay: "0s", duration: "13s" },
  { left: "10%", top: "68%", size: 4, delay: "1.2s", duration: "17s" },
  { left: "18%", top: "38%", size: 9, delay: "2.4s", duration: "15s" },
  { left: "27%", top: "76%", size: 5, delay: "0.6s", duration: "19s" },
  { left: "36%", top: "16%", size: 6, delay: "3.1s", duration: "14s" },
  { left: "46%", top: "60%", size: 4, delay: "1.8s", duration: "18s" },
  { left: "55%", top: "30%", size: 8, delay: "2.8s", duration: "16s" },
  { left: "64%", top: "72%", size: 5, delay: "0.9s", duration: "20s" },
  { left: "72%", top: "20%", size: 4, delay: "3.6s", duration: "15s" },
  { left: "80%", top: "54%", size: 7, delay: "1.5s", duration: "17s" },
  { left: "88%", top: "82%", size: 4, delay: "2.1s", duration: "13s" },
  { left: "93%", top: "34%", size: 5, delay: "0.3s", duration: "19s" },
];

type PropiedadesParticulas = {
  id?: string;
  className?: string;
};

export default function ParticulasDecorativas({
  id,
  className = "",
}: PropiedadesParticulas) {
  return (
    <div id={id} className={`uneti-particles ${className}`.trim()} aria-hidden="true">
      {PARTICULAS.map((particula, indice) => (
        <span
          key={indice}
          style={
            {
              left: particula.left,
              top: particula.top,
              width: particula.size,
              height: particula.size,
              animationDelay: particula.delay,
              animationDuration: particula.duration,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
