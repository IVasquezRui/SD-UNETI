export type SalidaProfesional = {
  nivel: string;
  duracion: string;
  titulo: string;
  descripcion: string;
};

export type Trayecto = {
  numero: string;
  nombre: string;
  descripcion: string;
  unidades: string[];
};

export type Laboratorio = {
  nombre: string;
  descripcion: string;
  icono: string;
  imagen: string;
};

export type PreguntaCarrera = {
  pregunta: string;
  respuesta: string;
};

export type Carrera = {
  slug: string;
  nombre: string;
  codigo: string;
  lema: string;
  resumen: string;
  descripcion: string[];
  portada: string;
  galeria: { imagen: string; alt: string }[];
  icono: string;
  duracion: string;
  modalidad: string;
  sedes: string;
  tituloOtorgado: string;
  fundamentacion: string[];
  mision: string;
  vision: string;
  perfilIngreso: string[];
  perfilEgreso: string[];
  competencias: string[];
  campoLaboral: string[];
  trayectos: Trayecto[];
  laboratorios: Laboratorio[];
  salidas: SalidaProfesional[];
  faqs: PreguntaCarrera[];
};

const SALIDAS_INFORMATICA: SalidaProfesional[] = [
  {
    nivel: "TSU",
    duracion: "2 años · 4 semestres",
    titulo: "Técnico Superior Universitario en Informática",
    descripcion:
      "Desarrollo de software, administración de bases de datos y soporte de infraestructura tecnológica.",
  },
  {
    nivel: "Ingeniería",
    duracion: "4 años · 8 semestres",
    titulo: "Ingeniero(a) en Informática",
    descripcion:
      "Diseño de arquitecturas, seguridad, ciencia de datos y dirección de proyectos sociotecnológicos.",
  },
];

const SALIDAS_TELECOMUNICACIONES: SalidaProfesional[] = [
  {
    nivel: "TSU",
    duracion: "2 años · 4 semestres",
    titulo: "Técnico Superior Universitario en Telecomunicaciones",
    descripcion:
      "Operación de redes, transmisión de señales, radiofrecuencia y soporte de infraestructura de telecomunicaciones.",
  },
  {
    nivel: "Ingeniería",
    duracion: "4 años · 8 semestres",
    titulo: "Ingeniero(a) en Telecomunicaciones",
    descripcion:
      "Planificación de redes, diseño de sistemas inalámbricos y ópticos, regulación y gestión de espectro.",
  },
];

export const CARRERAS: Carrera[] = [
  {
    slug: "pnf-informatica",
    nombre: "PNF en Informática",
    codigo: "PNF-I",
    lema: "Construye el software y la infraestructura que transforma el país.",
    resumen:
      "Formación integral en desarrollo de software, infraestructura, seguridad informática, ciencia de datos y tecnologías emergentes, con salida de TSU en 2 años e Ingeniería en 4 años.",
    descripcion: [
      "El Programa Nacional de Formación en Informática de la UNETI forma profesionales capaces de diseñar, construir y mantener soluciones tecnológicas para las necesidades reales de las comunidades, las instituciones públicas y el sector productivo.",
      "El plan de estudios combina proyectos sociotecnológicos, laboratorios especializados y prácticas profesionalizantes. El estudiante avanza desde la alfabetización computacional hasta la ingeniería de software, la ciberseguridad y la analítica de datos.",
      "La modalidad multimodal permite estudiar con acompañamiento docente y recursos virtuales, manteniendo el vínculo con los laboratorios y los proyectos de territorio.",
    ],
    portada: "/assets/images/carreras/pnf-informatica/portada.jpg",
    galeria: [
      {
        imagen: "/assets/images/carreras/pnf-informatica/carrusel-1.jpg",
        alt: "Estudiantes del PNF en Informática durante una práctica de laboratorio",
      },
      {
        imagen: "/assets/images/carreras/pnf-informatica/carrusel-2.jpg",
        alt: "Formación en desarrollo de software del PNF en Informática",
      },
      {
        imagen: "/assets/images/carreras/pnf-informatica/carrusel-3.jpg",
        alt: "Práctica de redes y ciberseguridad del PNF en Informática",
      },
      {
        imagen: "/assets/images/carreras/pnf-informatica/carrusel-4.jpg",
        alt: "Encuentro académico de estudiantes de Informática de la UNETI",
      },
    ],
    icono: "bi bi-cpu",
    duracion: "4 años · 8 semestres",
    modalidad: "Multimodal (presencial y virtual)",
    sedes: "Nodo Administrativo Caracas y nodos regionales",
    tituloOtorgado: "Ingeniero(a) en Informática",
    fundamentacion: [
      "La informática es un área estratégica para la soberanía tecnológica: permite producir software, proteger la información y gestionar infraestructura crítica con talento nacional.",
      "El programa se sustenta en el aprender haciendo, la investigación aplicada y la vinculación permanente con las comunidades y las instituciones del Estado.",
      "Los contenidos se organizan por trayectos y proyectos que integran teoría, práctica de laboratorio y reflexión sobre el impacto social de la tecnología.",
    ],
    mision:
      "Formar profesionales en informática con sólidas bases científicas, técnicas y éticas, capaces de crear soluciones digitales que contribuyan al desarrollo productivo y a la inclusión social de Venezuela.",
    vision:
      "Ser el programa de referencia nacional en formación de ingenieros e ingenieras en informática, reconocido por la calidad de sus proyectos, su producción científica y su compromiso con la soberanía tecnológica.",
    perfilIngreso: [
      "Título de bachiller o documento equivalente.",
      "Interés por la tecnología, la lógica y la resolución de problemas.",
      "Disposición para el trabajo colaborativo y el aprendizaje autónomo.",
      "Manejo básico de herramientas ofimáticas y acceso a un equipo de cómputo.",
    ],
    perfilEgreso: [
      "Diseña, desarrolla e implanta sistemas de información seguros y escalables.",
      "Administra bases de datos, redes y plataformas de infraestructura digital.",
      "Aplica marcos de ciberseguridad y protección de datos personales.",
      "Utiliza ciencia de datos y tecnologías emergentes para apoyar la toma de decisiones.",
      "Dirige proyectos sociotecnológicos con criterios de calidad, ética y sostenibilidad.",
    ],
    competencias: [
      "Programación y estructuras de datos",
      "Bases de datos relacionales y no relacionales",
      "Redes, sistemas operativos y virtualización",
      "Ingeniería de software y metodologías ágiles",
      "Seguridad informática y gestión de riesgos",
      "Ciencia de datos, inteligencia artificial y automatización",
    ],
    campoLaboral: [
      "Desarrollo de software en empresas públicas, privadas y cooperativas.",
      "Administración de sistemas, redes y centros de datos.",
      "Auditoría y consultoría en ciberseguridad.",
      "Analítica de datos y automatización de procesos.",
      "Docencia, investigación y proyectos de innovación social.",
      "Emprendimiento tecnológico y trabajo independiente.",
    ],
    trayectos: [
      {
        numero: "Trayecto I",
        nombre: "Pensamiento computacional y formación inicial",
        descripcion:
          "Bases de matemática, lógica, alfabetización digital y primeros proyectos de programación.",
        unidades: [
          "Matemática aplicada",
          "Lógica y algoritmos",
          "Introducción a la programación",
          "Ofimática avanzada",
          "Proyecto sociotecnológico I",
        ],
      },
      {
        numero: "Trayecto II",
        nombre: "Programación y estructuras de datos",
        descripcion:
          "Construcción de programas robustos, manejo de datos y modelado de soluciones.",
        unidades: [
          "Programación orientada a objetos",
          "Estructuras de datos",
          "Programación web",
          "Bases de datos I",
          "Proyecto sociotecnológico II",
        ],
      },
      {
        numero: "Trayecto III",
        nombre: "Sistemas, redes y persistencia",
        descripcion:
          "Sistemas operativos, redes de datos y administración de bases de datos.",
        unidades: [
          "Sistemas operativos",
          "Redes de computadoras",
          "Bases de datos II",
          "Arquitectura del computador",
          "Proyecto sociotecnológico III",
        ],
      },
      {
        numero: "Trayecto IV",
        nombre: "Ingeniería de software y seguridad",
        descripcion:
          "Metodologías de desarrollo, calidad, ciberseguridad y gestión de proyectos.",
        unidades: [
          "Ingeniería de software",
          "Seguridad informática",
          "Gestión de proyectos",
          "Computación en la nube",
          "Proyecto sociotecnológico IV",
        ],
      },
      {
        numero: "Trayecto V",
        nombre: "Especialización y práctica profesional",
        descripcion:
          "Ciencia de datos, tecnologías emergentes y consolidación del trabajo de grado.",
        unidades: [
          "Ciencia de datos",
          "Inteligencia artificial",
          "DevOps y automatización",
          "Ética y legislación informática",
          "Trabajo de grado",
        ],
      },
    ],
    laboratorios: [
      {
        nombre: "Laboratorio de Desarrollo de Software",
        descripcion:
          "Estaciones de trabajo con entornos de programación, control de versiones y herramientas de integración continua.",
        icono: "bi bi-code-slash",
        imagen: "/assets/images/carreras/pnf-informatica/laboratorio-2.jpg",
      },
      {
        nombre: "Laboratorio de Redes y Ciberseguridad",
        descripcion:
          "Equipos de conmutación, enrutamiento, servidores y entornos aislados para prácticas de seguridad.",
        icono: "bi bi-shield-lock",
        imagen: "/assets/images/carreras/pnf-informatica/laboratorio-1.jpg",
      },
    ],
    salidas: SALIDAS_INFORMATICA,
    faqs: [
      {
        pregunta: "¿Necesito saber programar antes de ingresar?",
        respuesta:
          "No. El primer trayecto introduce la lógica y la programación desde cero. Solo necesitas disposición para practicar y resolver problemas.",
      },
      {
        pregunta: "¿Puedo estudiar y trabajar al mismo tiempo?",
        respuesta:
          "Sí. La modalidad multimodal combina encuentros presenciales con actividades virtuales y proyectos que puedes organizar con acompañamiento docente.",
      },
      {
        pregunta: "¿Qué computador necesito?",
        respuesta:
          "Un equipo con al menos 8 GB de memoria RAM y acceso a internet es suficiente para la mayoría de las actividades. Los laboratorios cubren el software especializado.",
      },
    ],
  },
  {
    slug: "pnf-telecomunicaciones",
    nombre: "PNF en Telecomunicaciones",
    codigo: "PNF-T",
    lema: "Conecta comunidades, territorios y oportunidades.",
    resumen:
      "Formación en redes, transmisión, radiofrecuencia, fibra óptica y servicios de telecomunicaciones, con salida de TSU en 2 años e Ingeniería en 4 años.",
    descripcion: [
      "El Programa Nacional de Formación en Telecomunicaciones de la UNETI forma profesionales para diseñar, operar y mantener las redes y los servicios que garantizan la conectividad del país.",
      "El estudiante trabaja con señales, electrónica, sistemas de transmisión, redes de datos y comunicaciones inalámbricas y ópticas. Los laboratorios y las pasantías permiten aplicar los conocimientos en infraestructura real.",
      "La formación incorpora la dimensión social de la conectividad: llevar servicios de calidad a zonas rurales, fortalecer la telemedicina, la teleeducación y la gestión de emergencias.",
    ],
    portada: "/assets/images/carreras/pnf-telecomunicaciones/portada.jpg",
    galeria: [
      {
        imagen: "/assets/images/carreras/pnf-telecomunicaciones/carrusel-1.jpg",
        alt: "Estudiantes del PNF en Telecomunicaciones en práctica de laboratorio",
      },
      {
        imagen: "/assets/images/carreras/pnf-telecomunicaciones/carrusel-2.jpg",
        alt: "Formación en redes y transmisión del PNF en Telecomunicaciones",
      },
      {
        imagen: "/assets/images/carreras/pnf-telecomunicaciones/carrusel-3.jpg",
        alt: "Práctica de telecomunicaciones en los espacios de la UNETI",
      },
    ],
    icono: "bi bi-broadcast",
    duracion: "4 años · 8 semestres",
    modalidad: "Multimodal (presencial y virtual)",
    sedes: "Nodo Administrativo Caracas y nodos regionales",
    tituloOtorgado: "Ingeniero(a) en Telecomunicaciones",
    fundamentacion: [
      "Las telecomunicaciones son infraestructura esencial para el ejercicio de derechos, la educación, la salud y la actividad productiva.",
      "El programa articula electricidad, electrónica, señales y redes con una visión de servicio público y soberanía tecnológica.",
      "Cada trayecto culmina en un proyecto sociotecnológico que responde a una necesidad concreta de conectividad o de acceso a servicios.",
    ],
    mision:
      "Formar profesionales en telecomunicaciones con competencias para diseñar, operar y mantener redes y servicios de comunicación, actuando con ética, responsabilidad social y compromiso con el desarrollo nacional.",
    vision:
      "Ser un programa de referencia en la formación de ingenieros e ingenieras en telecomunicaciones, impulsor de la conectividad universal y de la innovación en infraestructura de comunicaciones.",
    perfilIngreso: [
      "Título de bachiller o documento equivalente.",
      "Aptitud para la matemática, la física y el trabajo experimental.",
      "Interés por las redes, la electrónica y las comunicaciones.",
      "Disposición para el trabajo de campo y la resolución de problemas.",
    ],
    perfilEgreso: [
      "Diseña y dimensiona redes de datos, transporte y acceso.",
      "Opera y mantiene sistemas de transmisión, radiofrecuencia y fibra óptica.",
      "Gestiona proyectos de despliegue de infraestructura de telecomunicaciones.",
      "Aplica normativas de espectro, calidad de servicio y seguridad de la información.",
      "Evalúa el impacto social de la conectividad y propone soluciones inclusivas.",
    ],

    competencias: [
      "Electricidad, electrónica y teoría de señales",
      "Redes de datos y conmutación",
      "Transmisión por fibra óptica y medios guiados",
      "Comunicaciones inalámbricas y radiofrecuencia",
      "Gestión de redes y calidad de servicio",
      "Regulación, espectro y proyectos de conectividad",
    ],
    campoLaboral: [
      "Operadores de telecomunicaciones y proveedores de internet.",
      "Empresas de infraestructura, energía y transporte.",
      "Organismos públicos de regulación y gestión del espectro.",
      "Diseño e instalación de redes empresariales y comunitarias.",
      "Telemedicina, teleeducación y sistemas de emergencia.",
      "Investigación, docencia y emprendimiento en conectividad.",
    ],
    trayectos: [
      {
        numero: "Trayecto I",
        nombre: "Fundamentos de electricidad y señales",
        descripcion:
          "Matemática, física, electricidad y medición de señales para comprender los sistemas de comunicación.",
        unidades: [
          "Matemática aplicada",
          "Física",
          "Electricidad básica",
          "Mediciones eléctricas",
          "Proyecto sociotecnológico I",
        ],
      },
      {
        numero: "Trayecto II",
        nombre: "Electrónica y sistemas de transmisión",
        descripcion:
          "Circuitos electrónicos, modulación y principios de transmisión de información.",
        unidades: [
          "Electrónica analógica",
          "Electrónica digital",
          "Teoría de señales",
          "Sistemas de transmisión",
          "Proyecto sociotecnológico II",
        ],
      },
      {
        numero: "Trayecto III",
        nombre: "Redes de datos y conmutación",
        descripcion:
          "Protocolos, direccionamiento, conmutación y administración de redes de datos.",
        unidades: [
          "Redes de datos I",
          "Redes de datos II",
          "Conmutación y enrutamiento",
          "Sistemas operativos de red",
          "Proyecto sociotecnológico III",
        ],
      },
      {
        numero: "Trayecto IV",
        nombre: "Comunicaciones inalámbricas y ópticas",
        descripcion:
          "Radiofrecuencia, antenas, fibra óptica y tecnologías de acceso de banda ancha.",
        unidades: [
          "Comunicaciones inalámbricas",
          "Antenas y propagación",
          "Fibra óptica",
          "Redes de acceso",
          "Proyecto sociotecnológico IV",
        ],
      },
      {
        numero: "Trayecto V",
        nombre: "Gestión, regulación y práctica profesional",
        descripcion:
          "Gestión de redes, normativa, calidad de servicio y consolidación del trabajo de grado.",
        unidades: [
          "Gestión de redes",
          "Regulación y espectro",
          "Calidad de servicio",
          "Seguridad de redes",
          "Trabajo de grado",
        ],
      },
    ],
    laboratorios: [
      {
        nombre: "Laboratorio de Redes y Transmisión",
        descripcion:
          "Racks de comunicaciones, switches, routers y equipos de medición para prácticas de redes y transporte.",
        icono: "bi bi-diagram-3",
        imagen: "/assets/images/carreras/pnf-telecomunicaciones/laboratorio-1.jpg",
      },
      {
        nombre: "Laboratorio de Radiofrecuencia y Fibra Óptica",
        descripcion:
          "Analizadores de espectro, generadores, antenas y equipos de empalme y medición de fibra óptica.",
        icono: "bi bi-broadcast-pin",
        imagen: "/assets/images/carreras/pnf-telecomunicaciones/laboratorio-2.jpg",
      },
    ],
    salidas: SALIDAS_TELECOMUNICACIONES,
    faqs: [
      {
        pregunta: "¿La carrera incluye trabajo de campo?",
        respuesta:
          "Sí. Los proyectos sociotecnológicos y las prácticas profesionalizantes incluyen visitas, levantamiento de información e instalación de soluciones en territorio.",
      },
      {
        pregunta: "¿Qué diferencia hay entre TSU e Ingeniería?",
        respuesta:
          "El TSU se obtiene al completar dos años y se orienta a la operación y el soporte técnico. La Ingeniería completa cuatro años y añade diseño, gestión y dirección de proyectos.",
      },
      {
        pregunta: "¿Puedo continuar desde el TSU hacia la Ingeniería?",
        respuesta:
          "Sí. El diseño curricular es continuo: al culminar el TSU puedes proseguir en el mismo PNF hasta obtener el título de Ingeniero o Ingeniera.",
      },
    ],
  },
];

export function obtenerCarreraPorSlug(slug: string): Carrera | undefined {
  return CARRERAS.find((carrera) => carrera.slug === slug);
}

export function obtenerCarrerasRelacionadas(slug: string): Carrera[] {
  return CARRERAS.filter((carrera) => carrera.slug !== slug);
}
