import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="py-24 md:py-32">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">404</p>
      <h1 className="mt-3 text-[32px] font-semibold leading-10 tracking-[-0.015em] text-text">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-xl text-[17px] leading-7 text-muted">
        The link may be out of date. The projects and resume are one click away.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/#work">View projects</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Home
        </ButtonLink>
      </div>
    </Container>
  );
}
