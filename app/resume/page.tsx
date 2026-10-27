import type { Metadata } from "next";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";
import { Download } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { experience } from "@/content/experience";
import { education, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name}: data analytics, business intelligence, SQL, Python, and business systems.`,
  alternates: { canonical: "/resume" },
};

const hasPdf = existsSync(path.join(process.cwd(), "public", site.resumePdf));

const summary =
  "Computer Science and Business Entrepreneurship graduate with hands-on experience in data analytics, business intelligence, operational reporting, SQL databases, dashboard development, and process improvement. Skilled at transforming operational data into clear insights, reports, and recommendations that support business decisions. Bilingual in English and Spanish.";

const coreSkills = [
  { label: "Analytics & BI", value: "Power BI, Tableau, Excel, KPI reporting, dashboards, trend analysis, data visualization, reporting QA" },
  { label: "Data", value: "SQL, SQL Server, PostgreSQL, Supabase, Python, pandas, scikit-learn, data validation, ETL concepts, relational data modeling" },
  { label: "Business Analysis", value: "Requirements analysis, process improvement, operational reporting, stakeholder communication, workflow analysis" },
  { label: "Tools", value: "Microsoft Office, Git, GitHub, Vercel, Google Workspace, ClickUp" },
];

/** Full resume bullets (the home page shows a shorter version). Matches the PDF. */
const resumeBullets: Record<string, string[]> = {
  "Bonaro Tech": [
    "Translated business needs into documented workflows, system requirements, analytics tracking, and customer-facing solutions across lead capture, booking, communication, and automation processes.",
    "Tested releases, diagnosed issues across APIs and data-routing workflows, and created process documentation to improve reliability and support repeatable operations.",
    "Used analytics, issue tracking, process reviews, and stakeholder feedback to identify operational gaps and support data-informed improvements.",
  ],
  "ALOY Commercial LLC": [
    "Analyzed supplier costs, pricing, sales, shipment activity, inventory movement, revenue, and margin performance across 13,000+ SKUs using Excel-based reporting workflows.",
    "Reviewed supplier, customer, purchase, shipment, and inventory records to identify inconsistencies, improve reporting accuracy, and support operational and financial decisions.",
    "Organized supporting data and communicated findings to support purchasing, vendor, customer, and pricing decisions.",
  ],
  "Panda Express & Zipps Sports Grill": [
    "Supported high-volume operations, trained team members, resolved customer issues, coordinated across teams, and maintained accuracy and professionalism under deadline and service pressure.",
  ],
};

const resumeProjects = [
  {
    title: "MakMex Data & Pricing System",
    meta: "GCU Capstone, Team Lead · 2025–2026",
    href: "/projects/makmex-data-system",
    bullets: [
      "Led a 4-person capstone team and designed the PostgreSQL/Supabase data model for an operating tools business, migrating 13,000+ product records from Excel across products, multi-warehouse inventory, dated price history, kits, and combos.",
      "Built SQL views for condition-based pricing and bundle availability; audited the live database, fixing a join error that overstated kit availability (3,355 → 492 kits) and removing public access to customer data.",
    ],
  },
  {
    title: "Fire & EMS Data Warehouse",
    meta: "GCU Analytics Project · 2025–2026",
    href: "/projects/fire-ems-data-warehouse",
    bullets: [
      "Developed Python and SQL workflows to clean, transform, and validate operational data for analysis and reporting.",
      "Built Power BI and Tableau dashboards tracking response times, call volume, resource utilization, and operational KPIs; presented trends and findings to technical and non-technical audiences.",
    ],
  },
  {
    title: "Predictive Pricing & Revenue Optimization",
    meta: "Python Analytics Project · 2026",
    href: "/projects/predictive-pricing",
    bullets: [
      "Built a Python ML pipeline (Random Forest) to predict demand from pricing, discount, and seasonality signals on a 10,000-row synthetic dataset, reducing forecast error ~82% vs. baseline; simulated discount scenarios to compare revenue and margin tradeoffs.",
    ],
  },
];

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-border pb-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">
      {children}
    </h2>
  );
}

export default function ResumePage() {
  return (
    <div className="pb-16 pt-10 md:pb-24 md:pt-14">
      <Container>
        <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">Resume</p>
          {hasPdf ? (
            <ButtonLink href={site.resumePdf} download>
              <Download aria-hidden className="size-4" />
              Download PDF
            </ButtonLink>
          ) : null}
        </div>

        <article className="mt-6 rounded-[10px] border border-border bg-surface p-6 sm:p-10">
          <header>
            <h1 className="text-[32px] font-semibold leading-10 tracking-[-0.015em] text-text">{site.name}</h1>
            <p className="mt-2 font-mono text-xs font-medium uppercase leading-5 tracking-[0.08em] text-muted">
              Data Analytics · Business Intelligence · SQL · Power BI · Python · Process Improvement
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <span>Phoenix, AZ</span>
              <a href={`mailto:${site.email}`} className="text-accent hover:underline">
                {site.email}
              </a>
              <a href={site.links.linkedin} className="text-accent hover:underline">
                linkedin.com/in/jonathanbonilla03
              </a>
              <a href={site.links.github} className="text-accent hover:underline">
                github.com/jonathanBonilla03
              </a>
            </p>
          </header>

          <section className="mt-8" aria-labelledby="r-summary">
            <Heading>
              <span id="r-summary">Professional summary</span>
            </Heading>
            <p className="mt-3 text-[15px] leading-7 text-text">{summary}</p>
          </section>

          <section className="mt-8" aria-labelledby="r-skills">
            <Heading>
              <span id="r-skills">Core skills</span>
            </Heading>
            <dl className="mt-3 space-y-1.5 text-[15px] leading-7">
              {coreSkills.map((s) => (
                <div key={s.label}>
                  <dt className="inline font-semibold text-text">{s.label}: </dt>
                  <dd className="inline text-text">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-8" aria-labelledby="r-experience">
            <Heading>
              <span id="r-experience">Experience</span>
            </Heading>
            <div className="mt-4 space-y-6">
              {experience.map((job) => (
                <div key={job.company}>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-[15px] font-semibold text-text">
                      {job.role} · {job.company}
                    </h3>
                    <p className="font-mono text-xs text-muted">
                      {job.location} · {job.period}
                      {job.note ? ` · ${job.note}` : ""}
                    </p>
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-6 text-text marker:text-muted">
                    {(resumeBullets[job.company] ?? job.bullets).map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8" aria-labelledby="r-projects">
            <Heading>
              <span id="r-projects">Analytics & BI projects</span>
            </Heading>
            <div className="mt-4 space-y-6">
              {resumeProjects.map((p) => (
                <div key={p.title}>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-[15px] font-semibold text-text">
                      <Link href={p.href} className="hover:text-accent">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="font-mono text-xs text-muted">{p.meta}</p>
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-6 text-text marker:text-muted">
                    {p.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8" aria-labelledby="r-education">
            <Heading>
              <span id="r-education">Education & certifications</span>
            </Heading>
            <div className="mt-3 space-y-1.5 text-[15px] leading-7 text-text">
              <p>
                <span className="font-semibold">{education.school}</span> · {education.degree}, {education.year} ·{" "}
                {education.honors.join(" · ")}
              </p>
              <p>
                <span className="font-semibold">Certifications:</span> {education.certifications.map((c, i) => (
                  <span key={c.name}>
                    {i > 0 ? " · " : ""}
                    {c.href ? (
                      <a href={c.href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                        {c.name}
                      </a>
                    ) : (
                      c.name
                    )}
                  </span>
                ))}
              </p>
              <p>
                <span className="font-semibold">Relevant coursework:</span> {education.coursework.join(", ")}
              </p>
            </div>
          </section>
        </article>
      </Container>
    </div>
  );
}
