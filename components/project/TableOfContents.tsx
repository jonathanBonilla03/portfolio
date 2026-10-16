"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky "On this page" list that tracks the section in view. */
export function TableOfContents({ items }: { items: { id: string; heading: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    // Above the first section nothing is in the tracking band; default to it.
    const onScroll = () => {
      if (sections[0] && sections[0].getBoundingClientRect().top > window.innerHeight * 0.15) {
        setActive(items[0]?.id);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-24">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">On this page</p>
      <ul className="mt-4 space-y-1 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "-ml-px block border-l py-1 pl-4 text-sm transition-colors",
                active === item.id
                  ? "border-accent font-medium text-text"
                  : "border-transparent text-muted hover:text-text",
              )}
            >
              {item.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
