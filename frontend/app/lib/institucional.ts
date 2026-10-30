export type InfoContacto = {
  name: string;
  shortName: string;
  address: string;
  phones: string[];
  phoneHref: string;
  email: string;
  website: string;
  helpDesk: string;
  campus: string;
  uneti360: string;
  sisu: string;
  sis: string;
  instagram: string;
  youtube: string;
  youtubeVideo: string;
};

export type CanalSoporte = {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  tone: "light-blue" | "blue" | "green" | "orange";
};

export type ElementoPregunta = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: Array<{ title?: string; text: string; icon?: string }>;
  ordered?: boolean;
};

export type ElementoActividad = {
  icon: string;
  title: string;
  tone: "light-blue" | "blue" | "green" | "orange";
};

export type AreaInnovacion = {
  slug: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export type Testimonio = {
  name: string;
  location: string;
  role: string;
  quote: string;
  image: string;
  rating: number;
};

export type ElementoValor = {
  icon: string;
  title: string;
  description: string;
};

export type Hito = {
  value: string;
  label: string;
};

export const CONTACTO: InfoContacto = {
  name: "Universidad Nacional Experimental de las Telecomunicaciones e Informática",
  shortName: "UNETI",
  address:
    "Avenida Universidad, esquina El Chorro, piso 12, Ministerio de Ciencia y Tecnología, Caracas, Venezuela",
  phones: ["0212-505-1402", "0212-505-1406"],
  phoneHref: "tel:+582125051402",
  email: "rectorado@uneti.edu.ve",
  website: "https://www.uneti.edu.ve",
  helpDesk: "https://www.uneti.edu.ve/ayuda/",
  campus: "https://www.uneti.edu.ve/campus/",
  uneti360: "https://uneti360.unetieduca.edu.ve/",
  sisu: process.env.NEXT_PUBLIC_SISU_URL ?? "http://localhost:8000",
  sis: process.env.NEXT_PUBLIC_SIS_URL ?? "http://localhost:8080",
  instagram: "https://www.instagram.com/unetivzla",
  youtube: "https://www.youtube.com/@UNETIEducativo",
  youtubeVideo: "https://www.youtube.com/watch?v=gB9PsUUKqL8",
};

export const CANALES_SOPORTE: CanalSoporte[] = [
  {
    icon: "bi bi-mortarboard",
    title: "SIS-UNETI",
    description: "Gestiona tu matrícula, notas, constancias y trámites académicos.",
    href: CONTACTO.sis,
    cta: "Entrar al SIS-UNETI",
    tone: "blue",
  },
  {
    icon: "bi bi-journal-code",
    title: "Cursos UNETI",
    description: "Blockchain, inteligencia artificial, criptografía y vibe coding.",
    href: "/cursos",
    cta: "Ver los cursos",
    tone: "green",
  },
  {
    icon: "bi bi-journal-check",
    title: "Admisiones",
    description: "Consulta requisitos, fechas y opciones de ingreso a la UNETI.",
    href: "/admisiones",
    cta: "Iniciar admisión",
    tone: "orange",
  },
  {
    icon: "bi bi-telephone",
    title: "Atención telefónica",
    description: "Habla con nuestro equipo de lunes a viernes.",
    href: CONTACTO.phoneHref,
    cta: "Llamar ahora",
    tone: "light-blue",
  },
];

export const DIFERENCIAS: string[] = [
  "Acceso a la educación gratuita a nivel de Pregrado.",
  "Educación a distancia, usando una plataforma tecnológica.",
  "Opciones: PNF en Telecomunicaciones y PNF en Informática.",
  "Con posibilidad de egresar como TSU en ambos PNF.",
  "Generadores de bases de conocimientos disruptivas.",
];

export const PREGUNTAS_INICIO: ElementoPregunta[] = [
  {
    id: "sedes",
    title: "¿Cuántas sedes tiene la UNETI?",
    paragraphs: [
      "Nodo Administrativo: ubicado en la esquina «El Chorro», a una cuadra de la estación del metro «La Hoyada», torre ministerial, piso 12, Caracas – Venezuela.",
      "Nodo Académico CANTV – San Martín: Edificio Arvelo, detrás del centro comercial «Los Molinos» – Artigas.",
    ],
  },
  {
    id: "pregrado",
    title: "¿Qué pregrado dictan?",
    paragraphs: [
      "Dictamos los PNF (Programa Nacional de Formación) en Telecomunicaciones y en Informática, con tres salidas profesionales: en el primer año se otorga el título de Técnico Medio, a los dos años el título de Técnico Superior Universitario y en 4 años el de Ingeniero.",
    ],
  },
  {
    id: "requisitos",
    title: "¿Cuáles son los requisitos para ingresar?",
    paragraphs: [
      "Por ser una universidad del Estado, nos regimos bajo los mismos estándares que dicta la OPSU para el ingreso a una casa de estudios universitaria.",
      "Es importante que te registres ante el Sistema Nacional de Ingreso (SNI).",
    ],
  },
  {
    id: "modalidad",
    title: "¿Cómo es su modalidad de estudio?",
    paragraphs: [
      "Es multimodal, con una tendencia mayoritaria hacia la educación a distancia. El participante de cualquier PNF debe asistir a prácticas profesionales en espacios donde se desarrolle la temática del programa nacional de formación.",
    ],
  },
];

export const PREGUNTAS_NOSOTROS: ElementoPregunta[] = [
  {
    id: "mision",
    title: "Misión",
    paragraphs: [
      "Contribuir al desarrollo, independencia y soberanía tecnológica de Venezuela mediante la formación de profesionales y técnicos en telecomunicaciones, informática y tecnologías emergentes, de alta calidad y pertinencia social.",
      "Estos profesionales estarán formados para responder a los desafíos globales a través de la investigación e innovación tecnológica, con un perfil humanista, solidario, sensibilidad social y ambiental, identidad nacional y regional, y capacidad para integrarse en un mundo multicultural, multiétnico y pluripolar.",
    ],
  },
  {
    id: "vision",
    title: "Visión",
    paragraphs: [
      "Ser una institución de referencia nacional e internacional en innovación y desarrollo de las telecomunicaciones e informática, destacándose por su vanguardia en investigación, innovación y excelencia académica.",
      "La UNETI propicia oportunidades de estudio caracterizadas por la pluralidad, metodología, creatividad y universalidad del conocimiento, contribuyendo al mejoramiento continuo del proceso socio-productivo venezolano y a la consolidación de la nación como miembro activo del mundo multicultural, multiétnico y pluripolar.",
    ],
  },
  {
    id: "objetivos",
    title: "Objetivos Estratégicos",
    paragraphs: ["La UNETI orienta su gestión académica e institucional hacia ocho objetivos estratégicos:"],
    ordered: true,
    list: [
      {
        title: "Formación Ética y Técnica Integral",
        text: "Formar profesionales con sólidas cualidades éticas y morales, junto con conocimientos técnicos, científicos y económicos, capaces de responder a las necesidades del país en telecomunicaciones e informática, fortaleciendo la soberanía tecnológica de la nación.",
      },
      {
        title: "Educación Continua de Alto Nivel",
        text: "Promover estudios académicos avanzados y permanentes mediante programas nacionales de formación y formación avanzada, garantizando una actualización constante y pertinente del conocimiento.",
      },
      {
        title: "Democratización del Conocimiento",
        text: "Contribuir a la universalización de la educación universitaria, articulando acciones con las misiones sociales y fortaleciendo la inclusión educativa en todos los niveles.",
      },
      {
        title: "Universidad Productiva y Popular",
        text: "Impulsar un modelo de universidad abierta al pueblo, centrada en el trabajo socio-productivo, que integra ciencia, investigación, innovación tecnológica y saberes populares para contribuir al desarrollo nacional.",
      },
      {
        title: "Compromiso con el Socialismo y la Soberanía Tecnológica",
        text: "Contribuir a la construcción del socialismo bolivariano mediante la consolidación de la soberanía tecnológica y el acceso oportuno y equitativo a las telecomunicaciones y la informática en todo el territorio venezolano.",
      },
      {
        title: "Gestión Estratégica de Proyectos Tecnológicos",
        text: "Fortalecer la capacidad institucional para formular, dirigir, planificar y evaluar iniciativas y proyectos en telecomunicaciones y tecnologías de la información, con enfoque estratégico y transformador.",
      },
      {
        title: "Desarrollo Sustentable del Sector Tecnológico Nacional",
        text: "Aportar al desarrollo sostenible de la industria nacional en telecomunicaciones e informática, incentivando la innovación, la producción nacional y la independencia tecnológica.",
      },
      {
        title: "Democratización del Conocimiento Técnico y Científico",
        text: "Garantizar la creación, apropiación y aplicación del conocimiento en telecomunicaciones, informática y servicios postales, mediante procesos formativos dirigidos a personas, funcionarios públicos y comunidades organizadas en todo el país.",
      },
    ],
  },
  {
    id: "modelo",
    title: "Modelo Educativo: Currículo Unetista Sociocrítico",
    paragraphs: [
      "La Universidad Nacional Experimental de las Telecomunicaciones e Informática implementa un modelo educativo centrado en el desarrollo humano, social y científico, estructurado en torno a un currículo sociocrítico que busca:",
    ],
    list: [
      {
        icon: "🌱",
        title: "Desarrollo Integral de Capacidades",
        text: "Promueve el crecimiento pleno de las capacidades individuales y colectivas de los estudiantes, enfocándose en su potencial como ciudadanos críticos y comprometidos.",
      },
      {
        icon: "📚",
        title: "Progresividad y Ciencia Disruptiva",
        text: "Fomenta un proceso educativo progresivo y secuencial que impulsa el aprendizaje de ciencias y tecnologías emergentes y disruptivas, alineadas con las necesidades nacionales y globales.",
      },
      {
        icon: "💡",
        title: "Formación para la Libertad y la Identidad",
        text: "Apuesta por el desarrollo de potencialidades humanas que permitan alcanzar una auténtica libertad personal y una sólida identidad cultural, formando individuos capaces de construir y transformar una nueva sociedad.",
      },
      {
        icon: "🧠",
        title: "Pensamiento Crítico y Productivo",
        text: "Incorpora el pensamiento crítico y reflexivo como base del aprendizaje, facilitando la participación activa de los estudiantes en procesos productivos orientados a fortalecer la soberanía tecnológica del país.",
      },
      {
        icon: "🌍",
        title: "Currículo Participativo y Contextualizado",
        text: "Diseña sus programas de estudio a partir de una visión contextualizada de la realidad venezolana, utilizando los problemas y necesidades del entorno como punto de partida para la comprensión científica y la búsqueda de soluciones prácticas y transformadoras.",
      },
    ],
  },

];

export const AREAS_INNOVACION: AreaInnovacion[] = [
  {
    slug: "blockchain",
    title: "Blockchain / Cripto",
    description:
      "Estamos a la vanguardia de las últimas tendencias en tecnología y educación. Hemos desarrollado un innovador programa enfocado en blockchain y criptomonedas para potenciar tus habilidades en áreas de gran demanda laboral.",
    image: "/assets/images/uneti/innovacion-blockchain.webp",
    href: "/contacto",
  },
  {
    slug: "metaverso",
    title: "Metaverso / Aula Inmersiva",
    description:
      "Creemos que la educación del futuro es inmersiva. Estamos desarrollando innovadores espacios educativos en realidad virtual y metaversos para ofrecer una experiencia de aprendizaje única.",
    image: "/assets/images/uneti/innovacion-metaverso.webp",
    href: "/contacto",
  },
  {
    slug: "ia",
    title: "IA como Herramienta Tecno-pedagógica",
    description:
      "La inteligencia artificial está transformando la manera de educar y aprender. En UNETI queremos prepararte para usar la IA de forma efectiva en tus lecciones y cursos.",
    image: "/assets/images/uneti/innovacion-ia.webp",
    href: "/contacto",
  },
  {
    slug: "modelado-3d",
    title: "Modelado en 3D",
    description:
      "El modelado y diseño 3D son habilidades altamente valoradas en la industria tecnológica y creativa actual. En UNETI queremos que explotes tu talento y te conviertas en un experto en la creación de modelos y mundos 3D.",
    image: "/assets/images/uneti/innovacion-3d.webp",
    href: "/contacto",
  },
];

export const TESTIMONIOS: Testimonio[] = [
  {
    name: "Juan Rodríguez",
    location: "Caracas",
    role: "Estudiante",
    quote:
      "Gracias a los cursos de modelado 3D en Blender dictados por la UNETI pude conseguir un empleo como freelance. Los recomiendo ampliamente.",
    image: "/assets/images/uneti/testimonio-juan.webp",
    rating: 5,
  },
  {
    name: "María González",
    location: "Maracaibo",
    role: "Estudiante",
    quote:
      "Estudié marketing digital en UNETI y ahora manejo exitosamente las redes sociales de la empresa donde trabajo. Las clases virtuales son muy interactivas.",
    image: "/assets/images/uneti/testimonio-maria.webp",
    rating: 5,
  },
  {
    name: "Samuel Rodríguez",
    location: "Mérida",
    role: "Estudiante",
    quote:
      "Realicé el diplomado en criptoeconomía y blockchain en UNETI y quedé muy satisfecho. Aprendí sobre Bitcoin, criptoactivos, NFTs, DeFi y más. Los profesores expertos resolvieron todas mis dudas y ahora me siento listo para iniciar proyectos blockchain.",
    image: "/assets/images/uneti/testimonio-samuel.webp",
    rating: 5,
  },
];

export const ACTIVIDADES_INICIO: ElementoActividad[] = [
  {
    icon: "bi bi-camera-video",
    title: "Miércoles de Formación, por nuestro canal de YouTube UNETI Educativo",
    tone: "light-blue",
  },
  {
    icon: "bi bi-mortarboard",
    title: "Formación Tecno-pedagógica para los docentes",
    tone: "blue",
  },
  {
    icon: "bi bi-lightning-charge",
    title: "Actividades en Plataformas",
    tone: "green",
  },
  {
    icon: "bi bi-graph-up-arrow",
    title: "Investigación y Desarrollo",
    tone: "orange",
  },
];

export const ACTIVIDADES_NOSOTROS: ElementoActividad[] = [
  {
    icon: "bi bi-robot",
    title: "Martes de formación en inteligencia artificial",
    tone: "light-blue",
  },
  {
    icon: "bi bi-mic",
    title: "Tu Podcast Universitario – UNETI",
    tone: "blue",
  },
  {
    icon: "bi bi-trophy",
    title: "Actividades Deportivas y Culturales",
    tone: "green",
  },
  {
    icon: "bi bi-easel",
    title: "Cursos y Talleres Especializados",
    tone: "orange",
  },
];

export const VALORES: ElementoValor[] = [
  {
    icon: "bi bi-people",
    title: "Estudiantes formados con éxito",
    description:
      "Miles de estudiantes se han formado en UNETI bajo un modelo educativo innovador y comprometido con el progreso social y tecnológico del país.",
  },
  {
    icon: "bi bi-graph-up-arrow",
    title: "Crecimiento académico sostenido",
    description:
      "Nuestra comunidad académica se fortalece día a día, impulsando el desarrollo del conocimiento, la investigación aplicada y la transformación digital.",
  },
  {
    icon: "bi bi-lightbulb",
    title: "Talento humano con visión de futuro",
    description:
      "Formamos ciudadanos y profesionales con ética, compromiso y capacidad para liderar en áreas críticas como informática, telecomunicaciones, blockchain y metaverso.",
  },
  {
    icon: "bi bi-bank",
    title: "Educación al servicio de la Nación",
    description:
      "A través de programas adaptados a los desafíos contemporáneos, UNETI se consolida como un pilar en la construcción de un futuro tecnológico para Venezuela.",
  },
];

export const HITOS: Hito[] = [
  { value: "7.000", label: "Estudiantes confían en UNETI" },
];




