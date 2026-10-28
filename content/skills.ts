import type { SkillGroup } from "@/lib/types";

const fireEms = { label: "Fire & EMS", href: "/projects/fire-ems-data-warehouse" };
const makmex = { label: "MakMex", href: "/projects/makmex-data-system" };
const pricing = { label: "Predictive Pricing", href: "/projects/predictive-pricing" };
const bonaro = { label: "Bonaro Tech", href: "/projects/bonaro-tech-platform" };
const aloy = { label: "ALOY", href: "/#experience" };
const salesMargin = { label: "Sales & Margin", href: "/projects/sales-inventory-margin" };

export const skillGroups: SkillGroup[] = [
  {
    title: "Data & Analytics",
    skills: ["SQL", "Python", "Excel", "Power BI", "Tableau", "pandas"],
    usedIn: [fireEms, pricing, makmex, salesMargin],
  },
  {
    title: "Data Systems",
    skills: ["PostgreSQL", "Supabase", "Data modeling", "SQL views", "Data validation"],
    usedIn: [makmex, fireEms],
  },
  {
    title: "Business Analysis",
    skills: ["Requirements", "Process improvement", "KPI reporting", "Pricing analysis", "Stakeholder communication"],
    usedIn: [makmex, bonaro, aloy],
  },
  {
    title: "Development",
    skills: ["TypeScript", "React", "Next.js", "REST APIs", "Git & GitHub"],
    usedIn: [bonaro, makmex],
  },
];
