/**
 * Noticias institucionales (stub local).
 * TODO(WPGraphQL): sustituir POSTS por la consulta de `posts` (ver POSTS_QUERY
 * en app/lib/wp.ts) respetando el mismo contrato.
 */

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  dateISO: string;
  readTime: string;
  likes: number;
  image: string;
  /* TODO(WPGraphQL): avatar desde `author { node { avatar { url } } }` */
  author: {
    name: string;
    avatar: string;
  };
  body: string[];
  tags: string[];
};

export const POSTS: Post[] = [
  {
    slug: "how-to-evaluate-the-effective-of-training-programs",
    title: "How to evaluate the effective of training programs.",
    excerpt:
      "A practical framework to measure whether a training program is really changing classroom outcomes.",
    category: "eLearning",
    date: "26 November 2020",
    dateISO: "2020-11-26",
    readTime: "6 min read",
    likes: 65,
    image: "https://placehold.co/600x425",
    author: { name: "Andy glamer", avatar: "https://placehold.co/125x125" },
    body: [
      "Evaluating a training program is not only about satisfaction surveys at the end of a course. Effective evaluation connects learning activities with changes in practice and, ultimately, with results for students and the institution.",
      "Start by defining a small set of observable outcomes. Then decide which evidence will show that those outcomes were reached: submitted projects, classroom observations, self-assessment rubrics or follow-up interviews months after the course ends.",
      "Collect the evidence at several moments of the program and share partial results with participants. Transparency turns evaluation into a learning tool instead of an administrative obligation.",
      "Finally, document what you will change in the next edition. A review that does not modify the program is only a report; a review that closes the loop improves teaching.",
    ],
    tags: ["eLearning", "Assessment", "Faculty"],
  },
  {
    slug: "experience-the-breathtaking-views-and-perspectives",
    title: "Experience the breathtaking views and perspectives.",
    excerpt:
      "Fieldwork, visits and exchange experiences that widen the perspective of our students.",
    category: "Campus",
    date: "18 November 2020",
    dateISO: "2020-11-18",
    readTime: "4 min read",
    likes: 35,
    image: "https://placehold.co/600x425",
    author: { name: "Den viliamson", avatar: "https://placehold.co/125x125" },
    body: [
      "Learning does not stop at the classroom door. During the last academic term, students from different programs joined guided visits to laboratories, community projects and cultural institutions.",
      "These experiences connect theory with real practice and help students build a professional network before graduation.",
      "The next call for field experiences will be published through the institutional news channel and the student portal.",
    ],
    tags: ["Campus", "Students"],
  },
  {
    slug: "build-up-healthy-habits-and-strong-peaceful-life",
    title: "Build up healthy habits and strong peaceful life.",
    excerpt:
      "Wellbeing resources available to UNETI students throughout the academic year.",
    category: "Wellbeing",
    date: "10 November 2020",
    dateISO: "2020-11-10",
    readTime: "5 min read",
    likes: 58,
    image: "https://placehold.co/600x425",
    author: { name: "Jones robbert", avatar: "https://placehold.co/125x125" },
    body: [
      "Academic life brings deadlines, new responsibilities and long study sessions. Building sustainable routines is as important as mastering the content of each course.",
      "Our student support team offers workshops on time management, sleep hygiene and stress regulation, both on campus and online.",
      "If you need individual support, request an appointment with the wellbeing office. All consultations are confidential and free for enrolled students.",
    ],
    tags: ["Wellbeing", "Students"],
  },
  {
    slug: "design-is-not-just-what-it-looks-like",
    title: "Good design is obvious, great design is transparent.",
    excerpt:
      "How our design program teaches students to solve problems before styling interfaces.",
    category: "Design",
    date: "02 November 2020",
    dateISO: "2020-11-02",
    readTime: "7 min read",
    likes: 41,
    image: "https://placehold.co/600x425",
    author: { name: "Andy glamer", avatar: "https://placehold.co/125x125" },
    body: [
      "Great design rarely calls attention to itself. It removes friction, orders information and helps people complete a task without noticing the decisions behind the interface.",
      "In the design program, students begin with research and problem definition before opening a design tool. The visual language comes later, once the problem is understood.",
      "This approach prepares graduates to work with multidisciplinary teams, where clarity of reasoning matters as much as visual craft.",
    ],
    tags: ["Design", "Curriculum"],
  },
  {
    slug: "research-opportunities-for-undergraduate-students",
    title: "Research opportunities for undergraduate students.",
    excerpt:
      "Open calls for research assistantships in engineering, health and social sciences.",
    category: "Research",
    date: "24 October 2020",
    dateISO: "2020-10-24",
    readTime: "5 min read",
    likes: 47,
    image: "https://placehold.co/600x425",
    author: { name: "Den viliamson", avatar: "https://placehold.co/125x125" },
    body: [
      "Undergraduate students can now apply for research assistantships in active projects across the university. Selected students will work alongside faculty members during one academic term.",
      "Applicants should have completed at least half of their program and maintain a solid academic record. Previous research experience is welcome but not required.",
      "The application includes a short motivation letter and a recommendation from a faculty member. Results will be announced through the institutional news channel.",
    ],
    tags: ["Research", "Students"],
  },
  {
    slug: "sometimes-were-tested-not-to-show-our-weaknesses",
    title: "Sometimes we're tested not to show our weaknesses.",
    excerpt:
      "Students share how they faced their first academic project and what they learned.",
    category: "Student life",
    date: "15 October 2020",
    dateISO: "2020-10-15",
    readTime: "4 min read",
    likes: 33,
    image: "https://placehold.co/600x425",
    author: { name: "Jones robbert", avatar: "https://placehold.co/125x125" },
    body: [
      "The first academic project can feel overwhelming. Students from the introductory seminar describe how they organised their work, asked for help and delivered a result they were proud of.",
      "Their advice is consistent: start early, divide the work into small deliverables and ask for feedback before the final submission.",
      "The seminar will run again next term with new mentors from the student association.",
    ],
    tags: ["Student life", "Community"],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  return POSTS.filter((post) => post.slug !== slug).slice(0, limit);
}
