export const site = {
  name: "Jonathan Bonilla",
  url: "https://jonathan-bonilla.vercel.app",
  title: "Jonathan Bonilla | Data Analytics & Business Intelligence",
  description:
    "Jonathan Bonilla is a data and business analyst in Phoenix, AZ with hands-on experience in SQL, Python, Power BI, Tableau, relational data modeling, and business systems.",
  tagline: ["Data Analytics", "Business Intelligence", "Business Systems"],
  headline: "I turn messy business data into clear decisions and build systems that keep it reliable.",
  intro:
    "Computer Science and Business graduate with hands-on experience in SQL, Python, Power BI, and real-world operational data.",
  email: "jbonilla9933@gmail.com",
  links: {
    github: "https://github.com/jonathanBonilla03",
    linkedin: "https://www.linkedin.com/in/jonathanbonilla03",
  },
  resumePdf: "/jonathan-bonilla-resume.pdf",
  /** Headline evidence shown directly under the hero. */
  proof: [
    { value: "13,340", label: "product records migrated and modeled for MakMex", href: "/projects/makmex-data-system" },
    { value: "3,355 → 492", label: "overstated kit availability found and fixed", href: "/projects/makmex-data-system#audit" },
    { value: "~82%", label: "lower forecast error than baseline (Random Forest)", href: "/projects/predictive-pricing" },
  ],
  quickScan: [
    { icon: "location", label: "Phoenix, AZ" },
    { icon: "work", label: "Open to on-site, hybrid, or remote" },
    { icon: "language", label: "English / Spanish" },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export const about = {
  lead: "Business question first, then the data and the build.",
  paragraphs: [
    "I studied Computer Science and Business Entrepreneurship, which shaped how I approach problems: understand the business question first, then use data and technology to solve it. My experience ranges from analyzing 13,000+ SKUs in an operating business to designing databases, dashboards, automation workflows, and machine-learning projects.",
    "What I enjoy most is understanding what a team actually needs to decide, then getting the right data in front of them clearly. I'm bilingual in English and Spanish, and comfortable explaining technical work to non-technical people.",
  ],
  steps: [
    { title: "Understand", text: "Define the decision and the requirements behind it." },
    { title: "Build & validate", text: "Structure the data, test assumptions, and catch inconsistencies." },
    { title: "Communicate", text: "Turn the result into something a stakeholder can act on." },
  ],
};

export const education = {
  school: "Grand Canyon University",
  degree: "B.S. Computer Science and Business Entrepreneurship",
  year: "2026",
  honors: ["Honors College", "President's Scholarship"],
  certifications: ["Google Data Analytics Professional Certificate", "Foundations of Business Intelligence"],
  coursework: [
    "Database Systems",
    "Analytics",
    "Requirements Analysis",
    "Software Engineering",
    "Data Structures & Algorithms",
  ],
};
