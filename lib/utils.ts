import { site } from "@/content/site";

/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Absolute site URL for canonical links, the sitemap, and social previews. */
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
}
