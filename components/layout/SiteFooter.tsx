import { site } from "@/content/site";
import { Container } from "./Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name} · Phoenix, AZ · © {new Date().getFullYear()}
        </p>
        <p className="no-print">
          Built with Next.js and deployed on Vercel ·{" "}
          <a
            href={`${site.links.github}/portfolio`}
            className="underline underline-offset-4 hover:text-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </p>
      </Container>
    </footer>
  );
}
