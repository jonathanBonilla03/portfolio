"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

// "top" is the hero; while it is in view, no nav item is highlighted.
const sectionIds = ["top", ...site.nav.map((item) => item.href.replace("/#", ""))];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Solid background once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view on the home page.
  useEffect(() => {
    if (pathname !== "/") {
      setActive(null);
      return;
    }
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id === "top" ? null : visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const closeMenu = useCallback((returnFocus: boolean) => {
    setMenuOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  }, []);

  // Mobile menu: close on Escape, trap focus, lock page scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (event.key !== "Tab") return;
      const items = [menuButtonRef.current, ...focusables()].filter((el): el is HTMLElement => el !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, closeMenu]);

  // Close the menu when the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-40 border-b transition-colors duration-150",
        solid ? "border-border bg-surface" : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-[15px] font-semibold tracking-[-0.01em] text-text">
          {site.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => {
            const id = item.href.replace("/#", "");
            const isActive = active === id;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-[15px] transition-colors",
                  isActive ? "bg-accent-soft text-accent" : "text-muted hover:text-text",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/resume"
            aria-current={pathname === "/resume" ? "page" : undefined}
            className="ml-2 inline-flex h-9 items-center rounded-md border border-border-strong px-3.5 text-[15px] font-medium text-text transition-colors hover:border-text"
          >
            Resume
          </Link>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => (menuOpen ? closeMenu(false) : setMenuOpen(true))}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center rounded-md text-text hover:bg-surface-muted"
          >
            {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <div
          ref={panelRef}
          id="mobile-menu"
          className="fixed inset-x-0 top-16 bottom-0 z-40 border-t border-border bg-surface lg:hidden"
        >
          <Container>
            <nav aria-label="Mobile" className="flex flex-col py-4">
              {[...site.nav, { label: "Resume", href: "/resume" }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => closeMenu(false)}
                  className="border-b border-border py-4 text-lg font-medium text-text"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
