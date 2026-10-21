import Image from "next/image";
import { FileText, Mail } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { FeaturedProjectCard, ProjectCard } from "@/components/project/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { TextLink } from "@/components/ui/TextLink";
import { experience } from "@/content/experience";
import { caseStudies } from "@/content/projects";
import { about, education, site } from "@/content/site";
import { skillGroups } from "@/content/skills";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";

export function SelectedWork() {
  const [featured, ...rest] = caseStudies;
  return (
    <Section
      id="work"
      number="01"
      label="Selected Work"
      title="Selected work"
      intro="Each project shows how I turn a business problem into a tested, data-backed solution."
    >
      <div className="grid gap-6">
        <FeaturedProjectCard project={featured} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </Section>
  );
}

const headshotPath = "/images/headshot.webp";
const hasHeadshot = existsSync(path.join(process.cwd(), "public", headshotPath));

export function About() {
  return (
    <Section id="about" number="02" label="About" title={about.lead}>
      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        {hasHeadshot ? (
          <Image
            src={headshotPath}
            alt={`Portrait of ${site.name}`}
            width={200}
            height={200}
            className="size-[160px] shrink-0 rounded-[10px] border border-border object-cover md:size-[200px]"
          />
        ) : null}
        <div className="max-w-3xl space-y-4">
          {about.paragraphs.map((p) => (
            <p
              key={p}
              className="text-[17px] leading-7 text-text"
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h3 className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">How I work</h3>
        <ol className="relative mt-6 grid gap-6 md:grid-cols-3 md:gap-8">
          <span aria-hidden className="absolute left-[11px] top-3 bottom-3 w-px bg-border md:left-3 md:right-3 md:top-[11px] md:bottom-auto md:h-px md:w-auto" />
          {about.steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 md:flex-col md:gap-3">
              <span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg font-mono text-[11px] text-accent">
                {i + 1}
              </span>
              <div>
                <p className="text-[15px] font-semibold text-text">{step.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export function Skills() {
  return (
    <Section
      id="skills"
      number="03"
      label="Skills"
      title="Skills, with evidence"
      intro="Grouped by how I use them. Each group links to the work where I used it."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.title} className="rounded-[10px] border border-border bg-surface p-6">
            <h3 className="text-[17px] font-semibold text-text">{group.title}</h3>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <li key={skill}>
                  <Chip>{skill}</Chip>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">
              Used in:{" "}
              {group.usedIn.map((link, i) => (
                <span key={link.href}>
                  <Link href={link.href} className="text-accent underline-offset-4 hover:text-accent-hover hover:underline">
                    {link.label}
                  </Link>
                  {i < group.usedIn.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" number="04" label="Experience" title="Experience">
      <ol className="divide-y divide-border border-y border-border">
        {experience.map((job) => (
          <li key={job.company} className="grid gap-2 py-8 lg:grid-cols-[180px_1fr] lg:gap-8">
            <p className="font-mono text-sm text-muted">
              {job.period}
              {job.note ? <span className="block text-xs">{job.note}</span> : null}
            </p>
            <div>
              <h3 className="text-xl font-semibold leading-7 tracking-[-0.01em] text-text">
                {job.role} <span className="font-normal text-muted">· {job.company}</span>
              </h3>
              <p className="mt-3 max-w-3xl text-[17px] leading-7 text-text">{job.summary}</p>
              {job.bullets.length > 0 ? (
                <ul className="mt-4 max-w-3xl space-y-2">
                  {job.bullets.map((b) => (
                    <li key={b} className="relative pl-5 text-[15px] leading-6 text-muted">
                      <span aria-hidden className="absolute left-0 top-[0.7em] h-px w-2.5 bg-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" number="05" label="Education" title="Education">
      <div className="rounded-[10px] border border-border bg-surface p-6 md:p-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="text-xl font-semibold text-text">{education.school}</h3>
          <p className="font-mono text-sm text-muted">{education.year}</p>
        </div>
        <p className="mt-1 text-[17px] text-text">{education.degree}</p>
        <p className="mt-1 text-sm text-muted">{education.honors.join(" · ")}</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">Certifications</h4>
            <ul className="mt-3 space-y-1.5 text-[15px] text-text">
              {education.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">
              Relevant coursework
            </h4>
            <p className="mt-3 text-[15px] leading-7 text-text">{education.coursework.join(", ")}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Contact() {
  return (
    <Section id="contact" number="06" label="Contact" title="Let's talk.">
      <div className="max-w-2xl">
        <p className="text-[17px] leading-7 text-text">
          I&apos;m looking for roles in data analytics, business intelligence, business analysis, and technical operations. If you&apos;re
          hiring, or just want to talk data, I&apos;d like to hear from you.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mt-8 inline-flex items-center gap-3 break-all text-2xl font-semibold tracking-[-0.01em] text-accent underline-offset-8 hover:text-accent-hover hover:underline md:text-3xl"
        >
          <Mail aria-hidden className="size-6 shrink-0" />
          {site.email}
        </a>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <ButtonLink href="/resume">
            <FileText aria-hidden className="size-4" />
            Resume
          </ButtonLink>
          <TextLink href={site.links.linkedin}>LinkedIn</TextLink>
          <TextLink href={site.links.github}>GitHub</TextLink>
        </div>
      </div>
    </Section>
  );
}
