/**
 * Catálogo estático de cursos.
 * TODO(WPGraphQL): sustituir COURSES por la consulta del CPT `curso`
 * (ver COURSES_QUERY en app/lib/wp.ts) manteniendo este mismo contrato.
 */

export type CourseLesson = {
  title: string;
  duration: string;
};

export type CourseModule = {
  title: string;
  lessons: CourseLesson[];
};

export type CourseInstructor = {
  name: string;
  role: string;
  avatar: string;
  bio: string;
};

export type Course = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  /** Clases usadas por el filtro Isotope del template (.development, .design, ...) */
  categories: string[];
  price: string;
  reviews: number;
  rating: string;
  lessons: number;
  students: number;
  duration: string;
  language: string;
  level: string;
  certificate: string;
  image: string;
  video: string;
  description: string[];
  highlights: string[];
  curriculum: CourseModule[];
  instructor: CourseInstructor;
};

const CURRICULUM_BASE: CourseModule[] = [
  {
    title: "Foundations and getting started",
    lessons: [
      { title: "Welcome and course roadmap", duration: "08:24" },
      { title: "Key concepts and vocabulary", duration: "12:10" },
      { title: "Setting up your learning environment", duration: "15:45" },
    ],
  },
  {
    title: "Core techniques in practice",
    lessons: [
      { title: "Guided walkthrough of a real case", duration: "22:30" },
      { title: "Exercises and self-assessment", duration: "18:05" },
      { title: "Common mistakes and how to avoid them", duration: "11:40" },
    ],
  },
  {
    title: "Advanced application and certification",
    lessons: [
      { title: "Applied project briefing", duration: "09:15" },
      { title: "Final project review", duration: "26:50" },
      { title: "Next steps and certification", duration: "06:30" },
    ],
  },
];

const curriculum = (moduleTitles: [string, string, string]): CourseModule[] =>
  CURRICULUM_BASE.map((module, index) => ({ ...module, title: moduleTitles[index] }));

export const COURSES: Course[] = [
  {
    slug: "business-accounting-and-taxation-fundamental",
    title: "Business accounting and taxation fundamental",
    summary:
      "Understand financial statements, tax obligations and the accounting cycle from the ground up.",
    category: "Design",
    categories: ["design"],
    price: "$55",
    reviews: 20,
    rating: "4.8",
    lessons: 10,
    students: 18,
    duration: "3 weeks",
    language: "English",
    level: "Beginner",
    certificate: "Yes",
    /* TODO(WPGraphQL): featuredImage { node { sourceUrl } } del CPT curso */
    image: "https://placehold.co/600x385",
    video: "https://www.youtube.com/watch?v=cfXHhfNy7tU",
    description: [
      "This course introduces the accounting cycle, from journal entries to the preparation of financial statements, with a practical focus on small and medium organisations.",
      "You will work through taxation fundamentals, compliance routines and reporting best practices using guided exercises and real-world case studies.",
    ],
    highlights: [
      "Read and interpret balance sheets and income statements",
      "Apply double-entry bookkeeping in day-to-day operations",
      "Understand VAT, withholding and income tax obligations",
      "Prepare a complete financial report for a case company",
    ],
    curriculum: curriculum([
      "Accounting cycle foundations",
      "Taxation and compliance",
      "Financial reporting project",
    ]),
    instructor: {
      name: "Matthew taylor",
      role: "Accounting teacher",
      avatar: "https://placehold.co/148x148",
      bio: "Certified public accountant with 12 years of experience advising universities and non-profit organisations on financial planning.",
    },
  },
  {
    slug: "finance-fundamentals-of-management-and-planning",
    title: "Finance fundamentals of management and planning",
    summary:
      "Build budgets, forecast cash flow and support strategic decisions with solid financial models.",
    category: "Finance",
    categories: ["business", "marketing"],
    price: "$65",
    reviews: 39,
    rating: "4.9",
    lessons: 22,
    students: 30,
    duration: "5 weeks",
    language: "English",
    level: "Intermediate",
    certificate: "Yes",
    image: "https://placehold.co/600x385",
    video: "https://www.youtube.com/watch?v=cfXHhfNy7tU",
    description: [
      "Learn how finance teams plan, budget and monitor performance across the fiscal year, connecting operational decisions with financial outcomes.",
      "The course combines spreadsheet modelling, scenario analysis and management reporting so you can present recommendations with confidence.",
    ],
    highlights: [
      "Design operating and capital budgets",
      "Forecast cash flow under different scenarios",
      "Analyse variances and communicate results",
      "Align financial planning with institutional strategy",
    ],
    curriculum: curriculum([
      "Budgeting and planning cycle",
      "Forecasting and variance analysis",
      "Management reporting capstone",
    ]),
    instructor: {
      name: "Leonel mooney",
      role: "Finance and planning teacher",
      avatar: "https://placehold.co/148x148",
      bio: "Financial analyst and university lecturer specialised in planning models for higher education institutions.",
    },
  },
  {
    slug: "introduction-to-application-design-and-development",
    title: "Introduction to application design and development",
    summary:
      "Move from idea to working prototype using user-centred design and modern development workflows.",
    category: "Design",
    categories: ["development", "marketing"],
    price: "$80",
    reviews: 55,
    rating: "4.7",
    lessons: 15,
    students: 55,
    duration: "4 weeks",
    language: "English",
    level: "Beginner",
    certificate: "Yes",
    image: "https://placehold.co/600x385",
    video: "https://www.youtube.com/watch?v=cfXHhfNy7tU",
    description: [
      "This hands-on course guides you through discovery, wireframing, prototyping and the first iteration of a web application.",
      "You will learn how design decisions translate into accessible interfaces and maintainable front-end code.",
    ],
    highlights: [
      "Plan a product discovery and define user stories",
      "Create wireframes and interactive prototypes",
      "Build a responsive interface with reusable components",
      "Test usability and iterate with feedback",
    ],
    curriculum: curriculum([
      "Product discovery and UX research",
      "Interface design and prototyping",
      "Build, test and iterate",
    ]),
    instructor: {
      name: "Herman miller",
      role: "Product design teacher",
      avatar: "https://placehold.co/148x148",
      bio: "Product designer and front-end developer who has shipped learning platforms for universities across Latin America.",
    },
  },
  {
    slug: "genetic-testing-and-sequencing-technique",
    title: "Genetic testing and sequencing technique",
    summary:
      "Explore the laboratory methods behind genetic testing and the interpretation of sequencing data.",
    category: "Medicine",
    categories: ["business", "design"],
    price: "$60",
    reviews: 42,
    rating: "4.8",
    lessons: 10,
    students: 34,
    duration: "3 weeks",
    language: "English",
    level: "Intermediate",
    certificate: "Yes",
    image: "https://placehold.co/600x385",
    video: "https://www.youtube.com/watch?v=cfXHhfNy7tU",
    description: [
      "From sample preparation to bioinformatics, this course explains each step of a modern genetic testing pipeline.",
      "Case-based lessons connect laboratory results with clinical interpretation and ethical considerations.",
    ],
    highlights: [
      "Describe the main sequencing technologies",
      "Follow a sample through the laboratory workflow",
      "Interpret basic variant reports",
      "Discuss quality control and ethical safeguards",
    ],
    curriculum: curriculum([
      "Molecular biology essentials",
      "Sequencing laboratory workflow",
      "Data interpretation and ethics",
    ]),
    instructor: {
      name: "Shoko mugikura",
      role: "Molecular biology teacher",
      avatar: "https://placehold.co/148x148",
      bio: "Biomedical researcher focused on molecular diagnostics and laboratory quality management.",
    },
  },
  {
    slug: "introduction-to-web-design-and-visualization",
    title: "Introduction to web design and visualization",
    summary:
      "Create clear, accessible web experiences and turn complex data into visual stories.",
    category: "Design",
    categories: ["development", "design"],
    price: "$70",
    reviews: 56,
    rating: "4.9",
    lessons: 20,
    students: 59,
    duration: "4 weeks",
    language: "English",
    level: "Beginner",
    certificate: "Yes",
    image: "https://placehold.co/600x385",
    video: "https://www.youtube.com/watch?v=cfXHhfNy7tU",
    description: [
      "Learn layout, typography, colour and accessibility principles while building a responsive website from scratch.",
      "The second part of the course introduces data visualisation techniques to communicate information effectively.",
    ],
    highlights: [
      "Apply visual hierarchy and responsive layout patterns",
      "Build accessible colour and typography systems",
      "Choose the right chart for each data story",
      "Publish a portfolio-ready landing page",
    ],
    curriculum: curriculum([
      "Visual design fundamentals",
      "Responsive layout and accessibility",
      "Data visualisation project",
    ]),
    instructor: {
      name: "Alexa harvard",
      role: "Web design teacher",
      avatar: "https://placehold.co/148x148",
      bio: "Design lead and accessibility advocate with a decade of experience in editorial and data-driven products.",
    },
  },
  {
    slug: "improve-your-english-vocabulary-and-language",
    title: "Improve your english vocabulary and language",
    summary:
      "Strengthen academic English with practical vocabulary, writing routines and speaking practice.",
    category: "Business",
    categories: ["development", "business", "marketing"],
    price: "$45",
    reviews: 76,
    rating: "4.6",
    lessons: 18,
    students: 80,
    duration: "6 weeks",
    language: "English",
    level: "Beginner",
    certificate: "Yes",
    image: "https://placehold.co/600x385",
    video: "https://www.youtube.com/watch?v=cfXHhfNy7tU",
    description: [
      "Designed for university students and professionals, this course builds the vocabulary and structures needed for academic reading and writing.",
      "Weekly speaking tasks, writing workshops and feedback sessions help you use new language with confidence.",
    ],
    highlights: [
      "Expand academic and professional vocabulary",
      "Write clear paragraphs, emails and short reports",
      "Improve listening and pronunciation",
      "Prepare for academic presentations",
    ],
    curriculum: curriculum([
      "Vocabulary building strategies",
      "Academic reading and writing",
      "Speaking and presentation practice",
    ]),
    instructor: {
      name: "Leonel mooney",
      role: "Language teacher",
      avatar: "https://placehold.co/148x148",
      bio: "Language educator specialised in English for academic purposes and content-integrated learning.",
    },
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((course) => course.slug === slug);
}

export function getRelatedCourses(slug: string, limit = 3): Course[] {
  return COURSES.filter((course) => course.slug !== slug).slice(0, limit);
}
