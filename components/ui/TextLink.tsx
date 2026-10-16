import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Accent text link with an arrow that nudges on hover. External links get ↗. */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = href.startsWith("http");
  const classes = cn(
    "group inline-flex items-center gap-1 font-medium text-accent underline-offset-4 hover:text-accent-hover hover:underline",
    className,
  );
  const Icon = external ? ArrowUpRight : ArrowRight;
  const icon = (
    <Icon
      aria-hidden
      className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
      strokeWidth={2}
    />
  );
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
        {icon}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      {icon}
    </Link>
  );
}
