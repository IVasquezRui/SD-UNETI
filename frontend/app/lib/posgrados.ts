/**
 * Oferta de posgrado (PNFA) de la UNETI.
 *
 * Fuente: `docs/PosgradosUNETI.docx` (Formación Avanzada e Innovación Tecnológica:
 * Análisis Integral de la Oferta Académica de Posgrado en la UNETI).
 *
 * Cada programa conserva los tres ejes transversales de los PNFA:
 * sociocrítico, epistemológico/metodológico y específico/tecnológico.
 */

export type EjePosgrado = {
  eje: string;
  icono: string;
  contenidos: string[];
};

export type Posgrado = {
  slug: string;
  nombre: string;
  siglas: string;
  nivel: string;
  grados: string[];
  duracion: string;
  carga: string;
  resumen: string;
  proposito: string;
  /** Color identificador del programa (borde, acentos y selección en el formulario). */
  color: string;
  icono: string;
  ejes: EjePosgrado[];
  requisitos: string[];
  egreso: string[];
};

export const PROGRAMAS_POSGRADO = [
  "Especialización y Maestría en Gestión de Operaciones Satelitales (PNFA-OPSAT)",
  "Especialización y Maestría en Ciberseguridad",
  "Especialización y Maestría en Automatización, Control y Robótica (PNFA-ACR)",
  "Especialización y Maestría en Economía Digital y Tecnologías Blockchain",
  "Especialización y Maestría en Gestión en Telecomunicaciones (PNFA-GT)",
  "Especialización y Maestría en Interoperabilidad y Bases de Datos",
  "Doctorado en Gerencia Evaluativa Tecnológica, Empresarial y Educativa",
] as const;

export type ProgramaPosgrado = (typeof PROGRAMAS_POSGRADO)[number];

export const POSGRADOS: Posgrado[] = [
  {
    slug: "operaciones-satelitales",
    nombre: "Gestión de Operaciones Satelitales",
    siglas: "PNFA-OPSAT",
    nivel: "Especialización y Maestría",
    grados: ["Especialista", "Magíster Scientiarum"],
    duracion: "3 períodos (Especialización) · 5 períodos (Maestría)",
    carga: "27 UC · Especialización / 36+ UC + Tesis · Maestría",
    resumen:
      "Formación avanzada para operar, controlar y administrar la infraestructura espacial del país.",
    proposito:
      "Preparar profesionales capaces de operar segmentos de vuelo y de terreno, gestionar cargas útiles, aplicar astrodinámica y administrar redes satelitales en coordinación con la Agencia Bolivariana para Actividades Espaciales (ABAE).",
    color: "#4582ff",
    icono: "bi bi-satellite",
    ejes: [
      {
        eje: "Eje sociocrítico",
        icono: "bi bi-people",
        contenidos: [
          "Soberanía tecnológica espacial.",
          "Marco regulatorio nacional e internacional del espacio ultraterrestre.",
          "Ética en el uso de datos satelitales.",
        ],
      },
      {
        eje: "Eje epistemológico y metodológico",
        icono: "bi bi-journal-text",
        contenidos: [
          "Metodología de la investigación aplicada a misiones espaciales.",
          "Diseño de proyectos tecnológicos.",
          "Seminarios de sistematización operativa.",
        ],
      },
      {
        eje: "Eje específico tecnológico",
        icono: "bi bi-cpu",
        contenidos: [
          "Introducción a la ingeniería espacial y arquitectura de misiones.",
          "Segmento de vuelo y cargas útiles: sensores ópticos, radar SAR y transpondedores.",
          "Astrodinámica y sistemas de determinación y control de orientación y órbita (AOCS).",
          "Subsistemas de telemetría, telecomando y mantenimiento de órbita (TT&C).",
          "Regulación y distribución de potencia y control térmico.",
          "Operaciones en estaciones terrenas con plataformas CubeSat.",
        ],
      },
    ],
    requisitos: [
      "Título de grado universitario en ingeniería, licenciatura o área afín.",
      "Copia certificada del título y notas de pregrado.",
      "Resumen curricular acreditado y documento de identidad.",
      "Anteproyecto o intención de investigación preliminar.",
      "Entrevista académica con el comité del programa.",
    ],
    egreso: [
      "Especialización: 27 UC aprobadas y Trabajo Especial de Grado.",
      "Maestría: 36+ UC, suficiencia de idioma técnico y defensa de tesis.",
    ],
  },
  {
    slug: "ciberseguridad",
    nombre: "Ciberseguridad",
    siglas: "PNFA-CIBER",
    nivel: "Especialización y Maestría",
    grados: ["Especialista", "Magíster Scientiarum"],
    duracion: "3 períodos (Especialización) · 2 años (Maestría)",
    carga: "27 UC · Especialización / 36+ UC + Tesis · Maestría",
    resumen:
      "Ciberdefensa de infraestructuras críticas, auditoría, hacking ético y análisis forense digital.",
    proposito:
      "Atender las demandas de ciberdefensa de las infraestructuras críticas del Estado, el sector financiero y las telecomunicaciones nacionales, formando especialistas capaces de prevenir, detectar, mitigar y responder ante incidentes complejos.",
    color: "#0f9d76",
    icono: "bi bi-shield-lock",
    ejes: [
      {
        eje: "Eje sociocrítico",
        icono: "bi bi-people",
        contenidos: [
          "Aspectos legales de los delitos informáticos.",
          "Normativas nacionales e internacionales de privacidad.",
          "Ética del hacking y soberanía de la información.",
        ],
      },
      {
        eje: "Eje epistemológico y metodológico",
        icono: "bi bi-journal-text",
        contenidos: [
          "Métodos de investigación en seguridad informática.",
          "Análisis de vectores de ataque.",
          "Formulación de planes estratégicos de ciberdefensa.",
        ],
      },
      {
        eje: "Eje específico tecnológico",
        icono: "bi bi-terminal",
        contenidos: [
          "Criptografía aplicada y comunicaciones seguras.",
          "Seguridad en sistemas operativos, redes y entornos en la nube.",
          "Análisis y gestión de riesgos según ISO/IEC 27001 y NIST.",
          "Hacking ético y pruebas de penetración (pentesting).",
          "Informática forense, preservación de evidencia y cadena de custodia.",
          "Auditoría de seguridad de software y desarrollo seguro.",
        ],
      },
    ],
    requisitos: [
      "Título de grado universitario.",
      "Recaudos académicos y documento de identidad.",
      "Anteproyecto de investigación en seguridad de la información.",
      "Entrevista académica evaluativa.",
    ],
    egreso: [
      "Especialización: 27 UC y Trabajo Especial de Grado.",
      "Maestría: 36+ UC, idioma técnico y tesis con defensa pública.",
    ],
  },
  {
    slug: "automatizacion-control-robotica",
    nombre: "Automatización, Control y Robótica",
    siglas: "PNFA-ACR",
    nivel: "Especialización y Maestría",
    grados: ["Especialista", "Magíster Scientiarum"],
    duracion: "3 períodos (Especialización) · 2 años (Maestría)",
    carga: "27 UC · Especialización / 36+ UC + Tesis · Maestría",
    resumen:
      "Modernización de procesos industriales con robótica, SCADA, control robusto e IIoT.",
    proposito:
      "Modernizar líneas de producción, industrias extractivas y servicios públicos mediante la integración de sistemas de control inteligente, sensórica avanzada y robótica industrial.",
    color: "#ff7f46",
    icono: "bi bi-robot",
    ejes: [
      {
        eje: "Eje sociocrítico",
        icono: "bi bi-people",
        contenidos: [
          "Impacto social de la automatización industrial.",
          "Soberanía productiva y ética en la automatización.",
          "Sostenibilidad ambiental.",
        ],
      },
      {
        eje: "Eje epistemológico y metodológico",
        icono: "bi bi-journal-text",
        contenidos: [
          "Modelado matemático de procesos dinámicos.",
          "Diseño de experimentos industriales.",
          "Formulación de proyectos de ingeniería de control.",
        ],
      },
      {
        eje: "Eje específico tecnológico",
        icono: "bi bi-gear-wide-connected",
        contenidos: [
          "Instrumentación industrial y acondicionamiento de señales.",
          "Control adaptativo, robusto y multivariable.",
          "Controladores lógicos programables (PLC) y SCADA.",
          "Cinemática, dinámica y programación de robots industriales.",
          "Integración de Internet Industrial de las Cosas (IIoT) y redes industriales.",
        ],
      },
    ],
    requisitos: [
      "Título de grado en ingeniería o área tecnológica afín.",
      "Recaudos académicos y documento de identidad.",
      "Anteproyecto vinculado a automatización o control.",
      "Entrevista académica evaluativa.",
    ],
    egreso: [
      "Especialización: 27 UC y Trabajo Especial de Grado.",
      "Maestría: 36+ UC, idioma técnico y tesis de investigación aplicada.",
    ],
  },
  {
    slug: "economia-digital-blockchain",
    nombre: "Economía Digital y Tecnologías Blockchain",
    siglas: "PNFA-EDB",
    nivel: "Especialización y Maestría",
    grados: ["Especialista", "Magíster Scientiarum"],
    duracion: "3 a 4 períodos (Especialización) · 4 a 5 períodos (Maestría)",
    carga: "27 UC · Especialización / 36+ UC + Tesis · Maestría",
    resumen:
      "Programa pionero en criptoeconomía, contratos inteligentes, DeFi y arquitecturas DLT.",
    proposito:
      "Acompañar la adopción estatal de criptoactivos, tecnologías de contabilidad distribuida (DLT) y la transformación digital de las finanzas públicas y privadas del país.",
    color: "#f2b705",
    icono: "bi bi-currency-bitcoin",
    ejes: [
      {
        eje: "Eje sociocrítico",
        icono: "bi bi-people",
        contenidos: [
          "Geopolítica monetaria e inclusión financiera.",
          "Marcos regulatorios de activos digitales.",
          "Prevención de legitimación de capitales.",
        ],
      },
      {
        eje: "Eje epistemológico y metodológico",
        icono: "bi bi-journal-text",
        contenidos: [
          "Métodos cuantitativos y econométricos aplicados a mercados digitales.",
          "Analítica de datos financieros.",
          "Metodologías de innovación tecnológica.",
        ],
      },
      {
        eje: "Eje específico tecnológico",
        icono: "bi bi-diagram-3",
        contenidos: [
          "Criptografía de clave pública y teoría de redes distribuidas.",
          "Arquitectura de cadenas de bloques y algoritmos de consenso.",
          "Diseño, programación y auditoría de contratos inteligentes.",
          "Tokenomía, modelos de negocio Web3 y finanzas descentralizadas (DeFi).",
          "Infraestructura de pagos digitales y ciberseguridad transaccional.",
        ],
      },
    ],
    requisitos: [
      "Título de grado universitario.",
      "Recaudos académicos y documento de identidad.",
      "Anteproyecto en economía digital, DLT o finanzas tecnológicas.",
      "Entrevista académica evaluativa.",
    ],
    egreso: [
      "Especialización: 27 UC y Trabajo Especial de Grado.",
      "Maestría: 36+ UC y tesis de investigación aplicada con defensa pública.",
    ],
  },
  {
    slug: "gestion-telecomunicaciones",
    nombre: "Gestión en Telecomunicaciones",
    siglas: "PNFA-GT",
    nivel: "Especialización y Maestría",
    grados: ["Especialista", "Magíster Scientiarum"],
    duracion: "3 períodos (Especialización) · 2 años (Maestría)",
    carga: "27 UC · Especialización / 36+ UC + Tesis · Maestría",
    resumen:
      "Planificación y administración de redes ópticas, 5G, espectro radioeléctrico y QoS.",
    proposito:
      "Formar especialistas en la planificación, diseño, mantenimiento y administración estratégica de redes de telecomunicaciones públicas y privadas, garantizando la eficiencia del transporte de datos nacional.",
    color: "#00b8b5",
    icono: "bi bi-broadcast-pin",
    ejes: [
      {
        eje: "Eje sociocrítico",
        icono: "bi bi-people",
        contenidos: [
          "Marco normativo y regulatorio de las telecomunicaciones.",
          "Gestión pública del espectro radioeléctrico.",
          "Soberanía en infraestructura de conectividad.",
        ],
      },
      {
        eje: "Eje epistemológico y metodológico",
        icono: "bi bi-journal-text",
        contenidos: [
          "Metodología de la investigación en ingeniería de datos.",
          "Formulación de proyectos de telecomunicaciones.",
          "Gestión de proyectos tecnológicos.",
        ],
      },
      {
        eje: "Eje específico tecnológico",
        icono: "bi bi-router",
        contenidos: [
          "Redes de transporte óptico de alta capacidad (DWDM y SDH) y acceso FTTx.",
          "Comunicaciones móviles avanzadas y arquitectura 4G/5G.",
          "Gestión y administración estratégica del espectro radioeléctrico.",
          "Enrutamiento IP avanzado y redes definidas por software (SDN).",
          "Ingeniería de tráfico y calidad de servicio (QoS) en redes convergentes.",
        ],
      },
    ],
    requisitos: [
      "Título de grado en ingeniería o área afín a las telecomunicaciones.",
      "Recaudos académicos y documento de identidad.",
      "Anteproyecto en redes, espectro o servicios de telecomunicaciones.",
      "Entrevista académica evaluativa.",
    ],
    egreso: [
      "Especialización: 27 UC y Trabajo Especial de Grado.",
      "Maestría: 36+ UC, componente investigador y defensa de tesis.",
    ],
  },
  {
    slug: "interoperabilidad-bases-datos",
    nombre: "Interoperabilidad y Bases de Datos",
    siglas: "PNFA-IBD",
    nivel: "Especialización y Maestría",
    grados: ["Especialista", "Magíster Scientiarum"],
    duracion: "3 períodos (Especialización) · 2 años (Maestría)",
    carga: "27 UC · Especialización / 36+ UC + Tesis · Maestría",
    resumen:
      "Gobierno electrónico, integración de sistemas, Big Data y gestión de datos masivos.",
    proposito:
      "Atender la necesidad estratégica de integrar plataformas informáticas heterogéneas en la administración pública y la industria privada, garantizando continuidad operativa y flujo seguro de datos.",
    color: "#7c5cff",
    icono: "bi bi-database-gear",
    ejes: [
      {
        eje: "Eje sociocrítico",
        icono: "bi bi-people",
        contenidos: [
          "Gobernanza de datos y estándares de gobierno abierto.",
          "Marcos legales de protección de datos personales.",
          "Intercambio de información estatal.",
        ],
      },
      {
        eje: "Eje epistemológico y metodológico",
        icono: "bi bi-journal-text",
        contenidos: [
          "Metodología de la investigación de software.",
          "Ingeniería de requerimientos integrados.",
          "Arquitectura de información.",
        ],
      },
      {
        eje: "Eje específico tecnológico",
        icono: "bi bi-server",
        contenidos: [
          "Administración avanzada de bases de datos relacionales y NoSQL.",
          "Arquitectura de datos distribuidos y procesamiento masivo en la nube.",
          "Marcos de interoperabilidad: APIs RESTful, microservicios y SOAP.",
          "Gobernanza de Big Data, almacenamiento distribuido y analítica en tiempo real.",
          "Integración continua, migración segura de datos y alta disponibilidad.",
        ],
      },
    ],
    requisitos: [
      "Título de grado en informática, ingeniería o área afín.",
      "Recaudos académicos y documento de identidad.",
      "Anteproyecto en datos, interoperabilidad o arquitectura de software.",
      "Entrevista académica evaluativa.",
    ],
    egreso: [
      "Especialización: 27 UC y Trabajo Especial de Grado.",
      "Maestría: 36+ UC, idioma técnico y tesis de maestría.",
    ],
  },
  {
    slug: "doctorado-gerencia-evaluativa",
    nombre: "Gerencia Evaluativa Tecnológica, Empresarial y Educativa",
    siglas: "Doctorado",
    nivel: "Doctorado",
    grados: ["Doctor(a)"],
    duracion: "3 a 4 años académicos (6 a 8 semestres)",
    carga: "120+ créditos académicos + Tesis Doctoral",
    resumen:
      "Máximo grado académico: generación autónoma de conocimiento e investigación de alto impacto.",
    proposito:
      "Formar investigadores capaces de formular marcos teóricos y epistémicos para evaluar, dirigir e innovar sistemas tecnológicos complejos, organizaciones empresariales y modelos educativos emergentes.",
    color: "#c0263c",
    icono: "bi bi-mortarboard",
    ejes: [
      {
        eje: "Fase lectiva e investigativa inicial (años 1 y 2)",
        icono: "bi bi-book",
        contenidos: [
          "Epistemología de la ciencia y la tecnología.",
          "Métodos cuantitativos y cualitativos avanzados.",
          "Gerencia evaluativa de sistemas complejos.",
          "Tendencias tecnológicas disruptivas.",
          "Innovación educativa tecnológica.",
        ],
      },
      {
        eje: "Fase de tesis y producción científica (años 3 y 4)",
        icono: "bi bi-file-earmark-text",
        contenidos: [
          "Trabajo tutorado individualizado del proyecto de tesis doctoral.",
          "Publicación de al menos un artículo científico en revista arbitrada e indexada.",
          "Defensa pública de la tesis ante jurado calificado.",
        ],
      },
    ],
    requisitos: [
      "Título de grado universitario y, preferentemente, de maestría.",
      "Copia certificada de título y notas, resumen curricular acreditado y documento de identidad.",
      "Anteproyecto de investigación doctoral.",
      "Entrevista académica con el comité del programa.",
    ],
    egreso: [
      "Cumplimiento del plan de créditos lectivos e investigativos.",
      "Acreditación de publicaciones científicas arbitradas.",
      "Defensa aprobada de la Tesis Doctoral.",
    ],
  },
];

export function obtenerPosgradoPorSlug(slug: string): Posgrado | undefined {
  return POSGRADOS.find((posgrado) => posgrado.slug === slug);
}

export function obtenerPosgradoPorNombre(nombre: string): Posgrado | undefined {
  return POSGRADOS.find((posgrado) => nombre.includes(posgrado.nombre));
}

/**
 * Etiqueta exacta que viaja al backend para un posgrado.
 * `PROGRAMAS_POSGRADO` y `POSGRADOS` se declaran en el mismo orden.
 */
export function programaDePosgrado(posgrado: Posgrado): ProgramaPosgrado {
  const indice = POSGRADOS.findIndex((item) => item.slug === posgrado.slug);
  return PROGRAMAS_POSGRADO[indice] ?? PROGRAMAS_POSGRADO[0];
}

export const NIVELES_POSGRADO = [
  {
    nivel: "Especialización",
    icono: "bi bi-patch-check",
    descripcion:
      "Título profesional enfocado en el dominio operativo e instrumental de un área específica. Mínimo 27 unidades de crédito y Trabajo Especial de Grado.",
  },
  {
    nivel: "Maestría",
    icono: "bi bi-award",
    descripcion:
      "Profundiza en la investigación aplicada e innovación científica con un aporte metodológico inédito. Mínimo 36 UC, idioma técnico y tesis.",
  },
  {
    nivel: "Doctorado",
    icono: "bi bi-mortarboard",
    descripcion:
      "Grado máximo universitario orientado a la generación autónoma de conocimiento teórico-práctico de alto impacto. 120+ créditos y tesis doctoral.",
  },
];
