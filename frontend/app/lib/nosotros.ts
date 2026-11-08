/** Contenido narrativo de /nosotros, contrastado con el mini proyecto `uneti/`. */

export type PasoHistoria = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type RutaUNETI = {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  tone: "light-blue" | "blue" | "green" | "orange";
};

export type RequisitoModalidad = {
  icon: string;
  title: string;
  description: string;
};

export type SedeUNETI = {
  name: string;
  kind: string;
  address: string;
  reference: string;
  activity: string;
  mapsUrl: string;
  /** URL del iframe de Google Maps para incrustar el mapa de la sede. */
  mapsEmbed: string;
  image: string;
  alt: string;
};

export const HISTORIA_PASOS: PasoHistoria[] = [
  {
    id: "publica",
    eyebrow: "01 · Origen",
    title: "Educación pública y gratuita",
    description:
      "La UNETI es una universidad pública: la docencia de pregrado es gratuita. El ingreso se gestiona por los canales oficiales del Sistema Nacional de Ingreso (SNI/OPSU).",
    image: "/assets/images/uneti/contacto-estudiantes.webp",
    alt: "Estudiantes de la UNETI durante una actividad académica",
  },
  {
    id: "pnf",
    eyebrow: "02 · Oferta académica",
    title: "Dos PNF, dos formas de construir el futuro",
    description:
      "La oferta se compone de los PNF en Informática y en Telecomunicaciones. Cada uno ofrece salida de TSU en 2 años e Ingeniería en 4 años, con prosecución dentro del mismo programa.",
    image: "/assets/images/uneti/carreras-hero-2026.webp",
    alt: "Estudiantes de la UNETI en el campus universitario",
  },
  {
    id: "modalidad",
    eyebrow: "03 · Modalidad",
    title: "Predominio a distancia, prácticas presenciales",
    description:
      "La mayor parte de la formación se desarrolla a distancia con apoyo del Campus Virtual. Las prácticas son obligatorias y se realizan en espacios equipados, como el Núcleo CANTV San Martín.",
    image: "/assets/images/uneti/RectorConferencia2.jpg",
    alt: "Rector de la UNETI durante una conferencia institucional",
  },
  {
    id: "sedes",
    eyebrow: "04 · Territorio",
    title: "Dos sedes, un mismo proyecto",
    description:
      "La Sede Administrativa de Altagracia concentra la gestión institucional. El Núcleo CANTV San Martín reúne la docencia y las prácticas de telecomunicaciones en espacios equipados.",
    image: "/assets/images/uneti/BannerSedeSanMartin.jpg",
    alt: "Sede del Núcleo CANTV San Martín de la UNETI",
  },
];

export const RUTAS_UNETI: RutaUNETI[] = [
  {
    icon: "bi bi-mortarboard",
    title: "Soy aspirante",
    description:
      "Ingresa por el SNI/OPSU y revisa requisitos, cronograma y recaudos antes de iniciar tu trámite.",
    href: "/admisiones",
    cta: "Iniciar mi admisión",
    tone: "orange",
  },
  {
    icon: "bi bi-laptop",
    title: "Soy estudiante",
    description:
      "Accede al Campus Virtual, conoce la modalidad híbrida y gestiona la reinscripción de UC por los canales oficiales.",
    href: "campus",
    cta: "Ir al Campus Virtual",
    tone: "blue",
  },
  {
    icon: "bi bi-buildings",
    title: "Soy empresa",
    description:
      "Usa los canales oficiales de contacto para organizaciones interesadas en nuestros PNF y proyectos.",
    href: "/contacto",
    cta: "Hablar con la UNETI",
    tone: "green",
  },
];

export const MODALIDAD_A_DISTANCIA = [
  "Estudio desde tu entorno, con organización flexible.",
  "Acceso a contenidos y actividades por el Campus Virtual.",
  "Acompañamiento académico por los canales oficiales.",
];

export const MODALIDAD_PRESENCIAL = [
  "Prácticas de laboratorio y taller en espacios equipados.",
  "Uso de la infraestructura tecnológica de la sede.",
  "Planificación previa de cada encuentro presencial.",
];

export const REQUISITOS_MODALIDAD: RequisitoModalidad[] = [
  {
    icon: "bi bi-display",
    title: "Equipo actualizado",
    description: "Computadora o dispositivo con un navegador moderno y actualizado.",
  },
  {
    icon: "bi bi-wifi",
    title: "Conexión estable",
    description: "Internet suficiente para acceder a contenidos y actividades sincrónicas.",
  },
  {
    icon: "bi bi-camera-video",
    title: "Cámara y micrófono",
    description: "Para las actividades que requieran participación remota.",
  },
  {
    icon: "bi bi-envelope-at",
    title: "Correo electrónico",
    description: "Una cuenta activa para recibir comunicaciones y avisos oficiales.",
  },
  {
    icon: "bi bi-house-door",
    title: "Espacio de estudio",
    description: "Un entorno adecuado para atender las actividades académicas.",
  },
];

export const SEDES_UNETI: SedeUNETI[] = [
  {
    name: "Sede Administrativa",
    kind: "Altagracia, Caracas",
    address:
      "Av. Universidad, esquina El Chorro, Edificio del Ministerio de Ciencia y Tecnología (Mincyt), Piso 12, Parroquia Altagracia, Caracas 1010, Venezuela.",
    reference: "A una cuadra de la estación de metro La Hoyada.",
    activity: "Gestión administrativa e institucional de la UNETI.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Torre+Ministerial+El+Chorro+Caracas",
    mapsEmbed:
      "https://maps.google.com/maps?q=Torre%20Ministerial%20El%20Chorro%20Caracas&z=16&output=embed",
    image: "/assets/images/uneti/nosotros-principal.webp",
    alt: "Sede administrativa de la UNETI en Altagracia, Caracas",
  },
  {
    name: "Núcleo CANTV",
    kind: "Centro de Estudios de Telecomunicaciones, San Martín",
    address:
      "Centro de Estudios de Telecomunicaciones de Cantv, Avenida San Martín, Edificio Arvelo, detrás del C.C. Los Molinos, Artigas, Caracas.",
    reference: "Detrás del C.C. Los Molinos, en Artigas.",
    activity: "Docencia y prácticas de telecomunicaciones en espacios equipados.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Centro+de+Estudios+de+Telecomunicaciones+Cantv+San+Martin+Caracas",
    mapsEmbed:
      "https://maps.google.com/maps?q=Centro%20de%20Estudios%20de%20Telecomunicaciones%20Cantv%20San%20Martin%20Caracas&z=16&output=embed",
    image: "/assets/images/uneti/BannerSedeSanMartin.jpg",
    alt: "Núcleo CANTV San Martín de la UNETI en Caracas",
  },
];
