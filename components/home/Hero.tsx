import { Briefcase, Languages, MapPin, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";

const icons: Record<(typeof site.quickScan)[number]["icon"], LucideIcon> = {
  location: MapPin,
  work: Briefcase,
  language: Languages,
};

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div aria-hidden className="grid-paper pointer-events-none absolute inset-0" />
      <Container className="relative pb-16 pt-14 md:pb-24 md:pt-24">
        <div className="max-w-3xl">
          <p className="text-[17px] font-semibold text-text">{site.name}</p>
          <p className="mt-2 font-mono text-xs font-medium uppercase leading-5 tracking-[0.08em] text-muted">
            {site.tagline.join(" · ")}
          </p>
          <h1
            id="hero-heading"
            className="mt-6 text-[clamp(2.25rem,1.5rem+3vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-text"
          >
            {site.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-7 text-muted">{site.intro}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/#work">View projects</ButtonLink>
            <ButtonLink href="/resume" variant="secondary">
              Resume
            </ButtonLink>
            <span className="flex items-center gap-1 pl-1">
              <a
                href={site.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-md px-3 text-[15px] font-medium text-muted transition-colors hover:bg-surface-muted hover:text-text"
              >
                GitHub
              </a>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-md px-3 text-[15px] font-medium text-muted transition-colors hover:bg-surface-muted hover:text-text"
              >
                LinkedIn
              </a>
            </span>
          </div>
        </div>

        <ul aria-label="At a glance" className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6">
          {site.quickScan.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.label} className="inline-flex items-center gap-2 text-sm text-muted">
                <Icon aria-hidden className="size-4" strokeWidth={1.75} />
                {item.label}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
