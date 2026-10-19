export const site = {
  name: "Jonathan Bonilla",
  url: "https://jonathan-bonilla.vercel.app",
  title: "Jonathan Bonilla | Data Analytics & Business Intelligence",
  description:
    "Jonathan Bonilla is a data and business analyst in Phoenix, AZ with hands-on experience in SQL, Python, Power BI, Tableau, relational data modeling, and business systems.",
  tagline: ["Data Analytics", "Business Intelligence", "SQL", "Python", "Business Systems"],
  headline: "I turn messy business data into clear decisions, and build the systems that keep it clean.",
  intro:
    "Computer Science and Business graduate with hands-on experience in SQL, Python, Power BI, and real-world operational data.",
  email: "jbonilla9933@gmail.com",
  links: {
    github: "https://github.com/jonathanBonilla03",
    linkedin: "https://www.linkedin.com/in/jonathanbonilla03",
  },
  resumePdf: "/jonathan-bonilla-resume.pdf",
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
  lead: "I sit between the business problem and the data.",
  paragraphs: [
    "What I enjoy most is understanding what a team actually needs to decide, then getting the right data in front of them clearly.",
    "I studied Computer Science and Business Entrepreneurship at Grand Canyon University, and I've spent the last few years applying both. As co-founder of a commercial supply business, I analyzed pricing, margins, and inventory across thousands of products, and learned how messy real business data can be. As a developer, I've built the databases, workflows, and tools that keep that data reliable.",
    "I'm bilingual in English and Spanish, and comfortable explaining technical work to non-technical people.",
  ],
  steps: [
    { title: "Understand the problem", text: "What decision does this need to support?" },
    { title: "Model the data", text: "Structure it so it can answer that question reliably." },
    { title: "Validate", text: "Catch duplicates, gaps, and inconsistencies before they reach a report." },
    { title: "Visualize", text: "Build dashboards and reports people can read quickly." },
    { title: "Communicate", text: "Explain what the data shows and what to do about it." },
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
