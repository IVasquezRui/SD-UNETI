import AboutSection from "./components/AboutSection";
import ActivitiesSection from "./components/ActivitiesSection";
import ArticlesSection from "./components/ArticlesSection";
import CoursesSection from "./components/CoursesSection";
import FaqSection from "./components/FaqSection";
import HeroSection from "./components/HeroSection";
import InnovationSection from "./components/InnovationSection";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import SupportSection from "./components/SupportSection";
import TestimonialsSection from "./components/TestimonialsSection";
import VideoSection from "./components/VideoSection";
import { HOME_ACTIVITIES, HOME_FAQ } from "./lib/institutional";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <SupportSection />
        <AboutSection />
        <CoursesSection />
        <FaqSection
          id="preguntas"
          eyebrow="Preguntas y respuestas"
          title="Nuestros estudiantes nos preguntan."
          description="Estos son los puntos que nuestros estudiantes nos han estado preguntando con más frecuencia."
          image="/assets/images/uneti/preguntasyrespuestas.png"
          imageAlt="Estudiantes de la UNETI"
          items={HOME_FAQ}
        />
        <InnovationSection />
        <TestimonialsSection />
        <ActivitiesSection
          id="actividades"
          eyebrow="Vida universitaria"
          title="Nuestras mejores actividades"
          description="Las actividades están hechas para ayudar a nuestros estudiantes y profesores a crecer juntos de manera profesional. Te presentamos algunas de ellas que están esperando por ti."
          items={HOME_ACTIVITIES}
          image="/assets/images/uneti/activities_bg.jpg"
          imageAlt="Actividades de la UNETI"
        />
        <VideoSection />
        <ArticlesSection />
      </main>
      <SiteFooter />
    </>
  );
}


