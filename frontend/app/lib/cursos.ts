export type Curso = {
  slug: string;
  titulo: string;
  resumen: string;
  descripcion: string;
  icono: string;
  tono: "light-blue" | "blue" | "green" | "orange";
  duracion: string;
  modalidad: string;
  nivel: string;
  temas: string[];
  resultado: string;
};

export type PasoCurso = {
  titulo: string;
  descripcion: string;
};

export const CURSOS: Curso[] = [
  {
    slug: "blockchain",
    titulo: "Blockchain y contratos inteligentes",
    resumen: "Diseña registros verificables y automatiza acuerdos sin intermediarios.",
    descripcion:
      "Recorre los fundamentos de las cadenas de bloques, el ciclo de vida de un contrato inteligente y su aplicación en la trazabilidad de documentos académicos.",
    icono: "bi bi-diagram-3",
    tono: "blue",
    duracion: "8 semanas",
    modalidad: "Híbrida",
    nivel: "Intermedio",
    temas: [
      "Fundamentos de blockchain",
      "Contratos inteligentes",
      "Trazabilidad y auditoría",
      "Casos de uso institucionales",
    ],
    resultado: "Publicarás un contrato inteligente documentado y auditado.",
  },
  {
    slug: "inteligencia-artificial",
    titulo: "Inteligencia artificial aplicada",
    resumen: "Convierte datos en decisiones con modelos generativos y aprendizaje automático.",
    descripcion:
      "Desde los conceptos esenciales del aprendizaje automático hasta la construcción de asistentes con modelos generativos, con énfasis en ética, sesgos y uso responsable.",
    icono: "bi bi-cpu",
    tono: "green",
    duracion: "10 semanas",
    modalidad: "Híbrida",
    nivel: "Básico a intermedio",
    temas: [
      "Fundamentos de IA y machine learning",
      "Modelos generativos",
      "Prompt engineering",
      "Ética, sesgos y datos",
    ],
    resultado: "Construirás un prototipo de asistente con IA para un caso real.",
  },
  {
    slug: "criptografia",
    titulo: "Criptografía y seguridad de la información",
    resumen: "Protege la información y firma digitalmente los documentos de la universidad.",
    descripcion:
      "Criptografía simétrica y asimétrica, funciones hash, infraestructura de clave pública y verificación de documentos aplicada al ecosistema SIS-UNETI.",
    icono: "bi bi-shield-lock",
    tono: "orange",
    duracion: "8 semanas",
    modalidad: "Híbrida",
    nivel: "Intermedio",
    temas: [
      "Criptografía simétrica y asimétrica",
      "Funciones hash y firmas digitales",
      "PKI y certificados",
      "Verificación de documentos",
    ],
    resultado: "Implementarás la verificación de un documento firmado de punta a punta.",
  },
  {
    slug: "vibe-coding",
    titulo: "Programación asistida con IA — Vibe Coding",
    resumen: "Del prompt al producto: construye software acompañado por asistentes de IA.",
    descripcion:
      "Aprende a planificar, generar, revisar y probar código con asistentes de IA, manteniendo criterio técnico, trazabilidad y buenas prácticas de ingeniería.",
    icono: "bi bi-code-slash",
    tono: "light-blue",
    duracion: "6 semanas",
    modalidad: "En línea",
    nivel: "Básico",
    temas: [
      "Del prompt al producto",
      "Revisión de código asistida",
      "Pruebas y despliegue",
      "Buenas prácticas y licencias",
    ],
    resultado: "Publicarás una aplicación pequeña creada con tu asistente de IA.",
  },
];

export const PASOS_CURSOS: PasoCurso[] = [
  {
    titulo: "Elige tu curso",
    descripcion: "Revisa el temario, la duración y el nivel. Puedes cursar más de uno en paralelo.",
  },
  {
    titulo: "Inscríbete en línea",
    descripcion: "Escríbenos desde el formulario de contacto indicando el curso de tu interés.",
  },
  {
    titulo: "Certifica tu participación",
    descripcion: "Al completar el proyecto final recibirás una constancia digital verificable de la UNETI.",
  },
];
