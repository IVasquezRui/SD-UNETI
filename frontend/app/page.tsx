import SeccionNosotros from "./componentes/SeccionNosotros";
import SeccionActividades from "./componentes/SeccionActividades";
import SeccionArticulos from "./componentes/SeccionArticulos";
import SeccionCarreras from "./componentes/SeccionCarreras";
import SeccionPreguntas from "./componentes/SeccionPreguntas";
import PortadaPrincipal from "./componentes/PortadaPrincipal";
import SeccionInnovacion from "./componentes/SeccionInnovacion";
import PieSitio from "./componentes/PieSitio";
import EncabezadoSitio from "./componentes/EncabezadoSitio";
import RutaUNETI from "./componentes/RutaUNETI";
import SeccionTestimonios from "./componentes/SeccionTestimonios";
import RedesSocialesResumen from "./componentes/RedesSocialesResumen";
import { ACTIVIDADES_INICIO, PREGUNTAS_INICIO } from "./lib/institucional";

export default function Inicio() {
  return (
    <>
      <EncabezadoSitio />
      <main>
        <PortadaPrincipal />
        <RutaUNETI />
        <SeccionNosotros />
        <SeccionCarreras />
        <SeccionPreguntas
          id="preguntas"
          eyebrow="Preguntas y respuestas"
          title="Nuestros estudiantes nos preguntan."
          description="Estos son los puntos que nuestros estudiantes nos han estado preguntando con más frecuencia."
          image="/assets/images/uneti/faq-estudiantes.webp"
          imageAlt="Estudiante de la UNETI"
          items={PREGUNTAS_INICIO}
        />
        <SeccionInnovacion />
        <SeccionTestimonios />
        <SeccionActividades
          id="actividades"
          eyebrow="Vida universitaria"
          title="Nuestras mejores actividades"
          description="Las actividades están hechas para ayudar a nuestros estudiantes y profesores a crecer juntos de manera profesional. Te presentamos algunas de ellas que están esperando por ti."
          items={ACTIVIDADES_INICIO}
          image="/assets/images/uneti/actividades-taller.webp"
          imageAlt="Actividades de la UNETI"
        />
        <RedesSocialesResumen />
        <SeccionArticulos />
      </main>
      <PieSitio />
    </>
  );
}


