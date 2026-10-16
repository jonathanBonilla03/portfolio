import type { SkillGroup } from "@/lib/types";

const fireEms = { label: "Fire & EMS", href: "/projects/fire-ems-data-warehouse" };
const makmex = { label: "MakMex", href: "/projects/makmex-data-system" };
const pricing = { label: "Predictive Pricing", href: "/projects/predictive-pricing" };
const bonaro = { label: "Bonaro Tech", href: "/projects/bonaro-tech-platform" };
const aloy = { label: "ALOY", href: "/projects/aloy-field-note" };

export const skillGroups: SkillGroup[] = [
  {
    title: "Data & Analytics",
    skills: ["SQL", "Python", "pandas", "scikit-learn", "Excel", "Power BI", "Tableau", "KPI reporting", "Trend analysis"],
    usedIn: [fireEms, pricing, aloy],
  },
  {
    title: "Databases & Modeling",
    skills: [
      "PostgreSQL",
      "SQL Server",
      "Supabase",
      "Relational data modeling",
      "SQL views",
      "Data validation",
      "Row-level security",
      "ETL concepts",
    ],
    usedIn: [makmex, fireEms],
  },
  {
    title: "Business Analysis",
    skills: [
      "Requirements analysis",
      "Process improvement",
      "Workflow analysis",
      "Pricing & margin analysis",
      "Stakeholder communication",
      "Process documentation",
    ],
    usedIn: [aloy, makmex, bonaro],
  },
  {
    title: "Development & Tools",
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "REST APIs", "Git & GitHub", "Vercel", "Docker"],
    usedIn: [bonaro, makmex],
  },
];
