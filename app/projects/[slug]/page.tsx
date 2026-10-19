import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ContentBlocks, numberFigures } from "@/components/project/ContentBlocks";
import { Highlights } from "@/components/project/Highlights";
import { TableOfContents } from "@/components/project/TableOfContents";
import { ChipList } from "@/components/ui/Chip";
import { TextLink } from "@/components/ui/TextLink";
import { getProject, projects } from "@/content/projects";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title: project.title,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const previous = index > 0 ? projects[index - 1] : undefined;
  const next = index < projects.length - 1 ? projects[index + 1] : undefined;
  const figureNumbers = numberFigures(project.sections.flatMap((s) => s.blocks));

  const meta = [
    { label: "Role", value: project.role },
    { label: "Timeline", value: project.period },
    ...(project.team ? [{ label: "Team", value: project.team }] : []),
    { label: "Type", value: project.type },
  ];

  return (
    <article className="pb-16 pt-10 md:pb-24 md:pt-14">
      <Container>
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          <ArrowLeft aria-hidden className="size-4" />
          All projects
        </Link>

        <header className="mt-8 max-w-3xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">{project.label}</p>
          <h1 className="mt-3 text-[32px] font-semibold leading-10 tracking-[-0.015em] text-text md:text-[40px] md:leading-[48px]">
            {project.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted">{project.summary}</p>
        </header>

        <dl
          className={`mt-10 grid gap-px overflow-hidden rounded-[10px] border border-border bg-border ${
            meta.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"
          }`}
        >
          {meta.map((item) => (
            <div key={item.label} className="bg-surface p-4">
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{item.label}</dt>
              <dd className="mt-1.5 text-[15px] leading-6 text-text">{item.value}</dd>
            </div>
          ))}
        </dl>
        {project.highlights?.length ? <Highlights items={project.highlights} size="lg" className="mt-4" /> : null}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ChipList items={project.stack} />
          {project.links?.length ? (
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {project.links.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-16">
          <div className="max-w-3xl">
            {project.sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="scroll-mt-24 pb-10">
                <h2 id={`${section.id}-h`} className="mb-5 text-[28px] font-semibold leading-9 tracking-[-0.01em] text-text">
                  {section.heading}
                </h2>
                <ContentBlocks blocks={section.blocks} figureNumbers={figureNumbers} />
              </section>
            ))}
          </div>
          <aside className="hidden lg:block">
            <TableOfContents items={project.sections.map(({ id, heading }) => ({ id, heading }))} />
          </aside>
        </div>

        <nav
          aria-label="More projects"
          className="mt-8 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
        >
          {previous ? (
            <Link href={`/projects/${previous.slug}`} className="group rounded-[10px] border border-border p-5 transition-colors hover:border-border-strong">
              <span className="inline-flex items-center gap-1 text-sm text-muted">
                <ArrowLeft aria-hidden className="size-4" /> Previous
              </span>
              <span className="mt-1 block font-semibold text-text group-hover:text-accent">{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group rounded-[10px] border border-border p-5 text-right transition-colors hover:border-border-strong"
            >
              <span className="inline-flex items-center gap-1 text-sm text-muted">
                Next <ArrowRight aria-hidden className="size-4" />
              </span>
              <span className="mt-1 block font-semibold text-text group-hover:text-accent">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </Container>
    </article>
  );
}
