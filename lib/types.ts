export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Diagrams are drawn as theme-aware SVG components, referenced by id. */
export type DiagramId = "makmex-erd" | "fire-ems-pipeline" | "bonaro-architecture";

/** Charts are rendered from data, so they match the site and both themes. */
export type ChartId = "pricing-scenarios";

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "groups"; groups: { title: string; items: string[] }[] }
  | { type: "figure"; image: ImageAsset; caption: string; frame?: "dark" | "light" }
  | { type: "diagram"; diagram: DiagramId; caption: string }
  | { type: "chart"; chart: ChartId; caption: string }
  | { type: "code"; language: "sql" | "python"; code: string; caption?: string }
  | {
      type: "table";
      columns: string[];
      rows: string[][];
      caption?: string;
      /** Indexes of columns to right-align (numbers). */
      numeric?: number[];
    }
  | { type: "metrics"; items: { label: string; before?: string; after: string; note?: string }[] }
  | { type: "callout"; title: string; text: string }
  | { type: "placeholder"; text: string };

export type CaseStudySection = {
  id: string;
  heading: string;
  blocks: Block[];
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  kind: "case-study" | "field-note";
  title: string;
  /** Mono label above the title, e.g. "CAPSTONE · 2025–26". */
  label: string;
  /** One sentence, used on cards and as the meta description. */
  summary: string;
  role: string;
  team?: string;
  period: string;
  type: string;
  stack: string[];
  /** What the project demonstrates, shown on cards. */
  focus: string;
  featured?: boolean;
  cover?: ImageAsset & { frame?: "dark" | "light" };
  /** Shown on the card when there is no screenshot. */
  coverDiagram?: DiagramId;
  coverChart?: ChartId;
  links?: ProjectLink[];
  sections: CaseStudySection[];
};

export type ExperienceEntry = {
  company: string;
  role: string;
  location: string;
  period: string;
  note?: string;
  summary: string;
  bullets: string[];
};

export type SkillGroup = {
  title: string;
  skills: string[];
  usedIn: { label: string; href: string }[];
};
