import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bonaroSteps, fireEmsSteps } from "@/components/diagrams/FlowDiagram";
import { ChipList } from "@/components/ui/Chip";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Compact cover art for projects without a screenshot. */
function MiniFlow({ steps }: { steps: { title: string }[] }) {
  const dense = steps.length > 4;
  return (
    <div aria-hidden className={cn("flex h-full flex-col justify-center px-6 sm:px-10", dense ? "gap-1 py-3" : "gap-1.5 py-5")}>
      {steps.map((step, i) => (
        <div key={step.title} className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
          <span
            className={cn(
              "flex-1 truncate rounded-md border border-border bg-surface px-3 text-text",
              dense ? "py-1 text-[13px]" : "py-1.5 text-sm",
            )}
          >
            {step.title}
          </span>
        </div>
      ))}
    </div>
  );
}

/** A static thumbnail of the pricing chart: revenue flat, margin falling. */
function MiniPricingChart() {
  const revenue = [24471, 24507, 23528, 22687, 22455, 21916, 20945];
  const margin = [7036, 6127, 4902, 3670, 2456, 1096, -374];
  const x = (i: number) => 24 + i * 52;
  const y = (v: number) => 20 + ((26000 - v) / 28000) * 160;
  const line = (values: number[]) => values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  return (
    <svg aria-hidden viewBox="0 0 360 200" className="h-full w-full">
      {[0, 10000, 20000].map((t) => (
        <line key={t} x1={24} x2={336} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--text-muted)" : "var(--border)"} />
      ))}
      <polyline points={line(revenue)} fill="none" stroke="var(--chart-1)" strokeWidth={2.5} strokeLinejoin="round" />
      <polyline points={line(margin)} fill="none" stroke="var(--chart-2)" strokeWidth={2.5} strokeLinejoin="round" />
      <text x={336} y={y(20945) - 10} textAnchor="end" className="fill-muted font-mono text-[11px]">
        revenue
      </text>
      <text x={336} y={y(-374) - 10} textAnchor="end" className="fill-muted font-mono text-[11px]">
        margin
      </text>
    </svg>
  );
}

export function CardCover({ project, priority, sizes }: { project: Project; priority?: boolean; sizes: string }) {
  if (project.cover) {
    return (
      <Image
        src={project.cover.src}
        alt=""
        width={project.cover.width}
        height={project.cover.height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover object-top"
      />
    );
  }
  if (project.coverDiagram === "fire-ems-pipeline") return <MiniFlow steps={fireEmsSteps} />;
  if (project.coverDiagram === "bonaro-architecture") return <MiniFlow steps={bonaroSteps} />;
  if (project.coverChart === "pricing-scenarios") return <MiniPricingChart />;
  return null;
}

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const href = `/projects/${project.slug}`;
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[10px] border border-border bg-surface transition duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_6px_20px_-12px_rgba(0,0,0,0.25)] motion-reduce:hover:translate-y-0",
        featured && "lg:flex-row",
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-muted",
          featured && "lg:aspect-auto lg:w-[58%] lg:border-r lg:border-b-0",
        )}
      >
        <CardCover
          project={project}
          priority={featured}
          sizes={featured ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 768px) 560px, 100vw"}
        />
      </div>
      <div className={cn("flex flex-1 flex-col gap-3 p-6", featured && "lg:justify-center lg:p-8")}>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">{project.label}</p>
        <h3 className={cn("font-semibold leading-7 tracking-[-0.01em] text-text", featured ? "text-2xl leading-8" : "text-xl")}>
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none after:rounded-[10px] focus-visible:after:outline-2 focus-visible:after:outline-accent">
            {project.title}
          </Link>
        </h3>
        <p className="text-[15px] leading-6 text-muted">{project.summary}</p>
        <p className="text-sm text-muted">
          <span className="text-text">{project.role}</span>
          {project.team ? ` · ${project.team}` : null}
        </p>
        <ChipList items={project.stack.slice(0, featured ? 6 : 5)} className="mt-1" />
        <p className="mt-auto inline-flex items-center gap-1 pt-2 text-[15px] font-medium text-accent">
          View case study
          <ArrowRight aria-hidden className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </p>
      </div>
    </article>
  );
}

export function FieldNoteCard({ project }: { project: Project }) {
  return (
    <article className="group relative rounded-[10px] border border-border bg-surface-muted p-6 transition-colors hover:border-border-strong md:p-8">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-accent">Field note</p>
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="max-w-2xl">
          <h3 className="text-xl font-semibold leading-7 tracking-[-0.01em] text-text">
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0 after:rounded-[10px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-accent"
            >
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 text-[15px] leading-6 text-muted">{project.summary}</p>
          <p className="mt-2 text-sm text-muted">
            <span className="text-text">{project.role}</span> · {project.period}
          </p>
        </div>
        <p className="inline-flex shrink-0 items-center gap-1 text-[15px] font-medium text-accent">
          Read field note
          <ArrowRight aria-hidden className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </p>
      </div>
    </article>
  );
}
