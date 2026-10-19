import { cn } from "@/lib/utils";

/** Headline numbers for a project, used on cards and case-study headers. */
export function Highlights({
  items,
  size = "md",
  className,
}: {
  items: { value: string; label: string }[];
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid gap-px overflow-hidden rounded-[10px] border border-border bg-border",
        items.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className={cn("bg-surface", size === "lg" ? "p-5" : "p-4")}>
          <dt className="sr-only">{item.label}</dt>
          <dd
            className={cn(
              "font-mono font-semibold tracking-[-0.02em] text-accent",
              size === "lg" ? "text-[28px] leading-9" : "text-xl leading-7",
            )}
          >
            {item.value}
          </dd>
          <dd aria-hidden className="mt-1 text-sm leading-5 text-muted">
            {item.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
