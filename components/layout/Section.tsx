import { Container } from "./Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * A home-page section with the numbered mono label ("01 / Selected Work"),
 * a thin rule, and a heading.
 */
export function Section({
  id,
  number,
  label,
  title,
  intro,
  children,
  className,
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("py-16 md:py-20", className)}>
      <Container>
        <Reveal>
          <div className="flex items-center gap-4">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">
              <span className="text-accent">{number}</span> / {label}
            </p>
            <span aria-hidden className="h-px flex-1 bg-border" />
          </div>
          <h2 id={headingId} className="mt-6 text-[28px] font-semibold leading-9 tracking-[-0.01em] text-text">
            {title}
          </h2>
          {intro ? <p className="mt-3 max-w-2xl text-[17px] leading-7 text-muted">{intro}</p> : null}
          <div className="mt-10">{children}</div>
        </Reveal>
      </Container>
    </section>
  );
}
