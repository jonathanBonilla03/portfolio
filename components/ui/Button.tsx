import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-[15px] font-medium transition-colors duration-150 ease-out";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-contrast hover:bg-accent-hover",
  secondary: "border border-border-strong bg-surface text-text hover:border-text hover:bg-surface-muted",
};

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

/** A link styled as a button. External and file links use a plain <a>. */
export function ButtonLink({ href, variant = "primary", className, children, ...rest }: ButtonLinkProps) {
  const classes = cn(base, variants[variant], className);
  const isPlainAnchor = href.startsWith("http") || href.startsWith("mailto:") || href.endsWith(".pdf");
  if (isPlainAnchor) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
