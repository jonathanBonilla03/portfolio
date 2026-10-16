# Jonathan Bonilla — Portfolio

Personal portfolio for data analytics, business intelligence, and business analysis roles.
Built with Next.js (App Router), TypeScript, and Tailwind CSS v4. Deployed on Vercel.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Where things live

| Path | What it is |
|---|---|
| `content/` | **All site copy.** Edit these files to change text; no layout code needed. |
| `content/projects.ts` | The case studies, written as typed blocks (paragraphs, figures, code, tables, metrics) |
| `components/home/` | Home page sections |
| `components/project/` | Project cards and the case-study building blocks |
| `components/diagrams/` | Theme-aware diagrams and the pricing chart, drawn in code |
| `public/images/projects/` | Screenshots (WebP) |
| `app/globals.css` | Color tokens for light and dark themes |

## Adding assets

- **Resume PDF:** save it as `public/jonathan-bonilla-resume.pdf`. The "Download PDF" button on `/resume` appears automatically once the file exists.
- **Headshot:** save a square photo (about 600×600) as `public/images/headshot.webp`. It appears in the About section automatically.
- **Screenshots:** export at 16:10 (e.g. 1600×1000) as WebP into `public/images/projects/<project>/`, then add a `figure` block in `content/projects.ts`.

## Placeholders

Blocks with `type: "placeholder"` in `content/projects.ts` mark missing details. They show as dashed notes in `npm run dev` and are hidden in production builds.
