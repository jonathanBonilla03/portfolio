import Image from "next/image";
import type { ImageAsset } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Framed figure with a numbered caption ("Fig. 1 — …"). */
export function FigureFrame({
  number,
  caption,
  children,
  className,
}: {
  number?: number;
  caption: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("my-8", className)}>
      <div className="rounded-[10px] border border-border bg-surface-muted p-3 sm:p-4">{children}</div>
      <figcaption className="mt-3 text-sm leading-6 text-muted">
        {number ? <span className="font-mono text-xs text-text">Fig. {number} — </span> : null}
        {caption}
      </figcaption>
    </figure>
  );
}

export function FigureImage({
  image,
  priority,
  sizes = "(min-width: 1024px) 720px, 100vw",
}: {
  image: ImageAsset;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      className={cn(
        "h-auto w-full rounded-md border border-border bg-surface",
        // Keep tall screenshots from dominating the page.
        image.height > image.width * 0.85 && "mx-auto max-w-xl",
      )}
    />
  );
}
