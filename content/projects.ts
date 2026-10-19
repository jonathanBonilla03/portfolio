import type { Project } from "@/lib/types";

const KIT_AVAILABILITY_SQL = `-- How many complete kits each warehouse can assemble right now.
-- A component with no inventory row at a warehouse counts as zero.
CREATE OR REPLACE VIEW public.kit_availability AS
WITH stock AS (
  SELECT product_id, warehouse_location, SUM(quantity) AS qty
  FROM public.inventory
  GROUP BY product_id, warehouse_location
)
SELECT w.id AS warehouse_location,
       k.id AS kit_id,
       MIN(FLOOR(COALESCE(s.qty, 0)::numeric / ki.quantity))::integer
         AS max_kits_available
FROM public.kits k
JOIN public.kit_items ki ON ki.kit_id = k.id
CROSS JOIN public.warehouse w
LEFT JOIN stock s
  ON s.product_id = ki.product_id AND s.warehouse_location = w.id
GROUP BY w.id, k.id;`;

const PRODUCT_PRICE_SQL = `-- One selling price per product: latest base price x condition multiplier.
-- NULL when no valid price exists, so the store shows "Price unavailable".
CREATE OR REPLACE VIEW public.product_price AS
WITH latest_price AS (
  SELECT DISTINCT ON (product_id) product_id, price_aa
  FROM public.prices
  WHERE product_id IS NOT NULL
  ORDER BY product_id, created_at DESC NULLS LAST
)
SELECT p.id AS product_id,
       (CASE WHEN lp.price_aa > 0
             THEN lp.price_aa * c.multiplier END)::numeric(12,2) AS price
FROM public.products p
LEFT JOIN latest_price lp ON lp.product_id = p.id
LEFT JOIN public.conditions c ON c.id = p.condition_id;`;

export const projects: Project[] = [
  // ---------------------------------------------------------------------------
  {
    slug: "makmex-data-system",
    kind: "case-study",
    title: "MakMex Data & Pricing System",
    label: "CAPSTONE · REAL BUSINESS · 2025–26",
    summary:
      "Designed the PostgreSQL data model behind an operating tools business, migrated 13,000+ product records from Excel, then audited it and fixed where the numbers were wrong.",
    role: "Team lead & database designer",
    team: "4-person team",
    period: "2025 – 2026",
    type: "GCU capstone for an operating business",
    stack: ["PostgreSQL", "Supabase", "SQL", "Row-level security", "React", "Python"],
    focus: "Data migration, relational modeling, pricing and availability logic, data quality",
    featured: true,
    highlights: [
      { value: "13,340", label: "product records migrated from Excel" },
      { value: "3,355 → 492", label: "kits shown as available, corrected after the audit" },
      { value: "343 → 1,977", label: "in-stock products restored to the catalog" },
    ],
    cover: {
      src: "/images/projects/makmex/before-after.webp",
      alt: "SQL query comparing kits shown as available before and after the fix, by warehouse: CDMX 3,031 to 76, CEDIS 3,351 to 435, DENMOR 3,341 to 148.",
      width: 1058,
      height: 678,
    },
    links: [
      { label: "Database docs on GitHub", href: "https://github.com/jonathanBonilla03/makmex/tree/main/database" },
      { label: "Live storefront", href: "https://makmex.vercel.app/shopping" },
    ],
    sections: [
      {
        id: "overview",
        heading: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "MakMex is a tools and equipment business operated by ALOY Commercial, the company I co-founded. For my Computer Science capstone at Grand Canyon University, I brought MakMex's real data problem to the project, led a four-person team, and designed the database tables and SQL logic the whole system runs on.",
          },
          {
            type: "paragraph",
            text: "After the capstone, I went back and audited the live database the way an analyst would. That audit is the most useful part of this case study: it found places where the numbers customers saw were wrong, and I traced each one to its cause and fixed it.",
          },
        ],
      },
      {
        id: "problem",
        heading: "Problem",
        blocks: [
          {
            type: "paragraph",
            text: "I saw this problem from the inside. As co-founder of ALOY, I spent years reconciling product, pricing, and inventory data across spreadsheets. MakMex managed everything in Excel with manual file uploads, and as the catalog grew it became hard to keep accurate:",
          },
          {
            type: "list",
            items: [
              "Inventory across three warehouses was difficult to keep in sync.",
              "Kits (a tool, battery, and charger sold together) and combos had to be priced by hand from their parts.",
              "The same product information lived in several places and drifted apart.",
            ],
          },
        ],
      },
      {
        id: "data",
        heading: "Data model",
        blocks: [
          {
            type: "paragraph",
            text: "I designed a relational model where each fact lives in one place. Products reference brands, product types, and a condition grade. Inventory is one row per product per warehouse. Prices are stored as dated history rather than overwritten. Kits and combos reference their component products through junction tables that carry quantity and bundle discount.",
          },
          {
            type: "diagram",
            diagram: "makmex-erd",
            caption: "Core tables. Kits and combos are built from products through junction tables.",
          },
          {
            type: "table",
            caption: "What the database holds",
            columns: ["Data", "Count"],
            numeric: [1],
            rows: [
              ["Product records", "13,340"],
              ["Products in stock", "1,981 across 3 warehouses"],
              ["Kits / kit component lines", "3,444 / 10,328"],
              ["Combos / combo component lines", "139 / 697"],
              ["Dated price records", "13,376"],
              ["Brands · product types · condition grades", "47 · 12 · 7"],
            ],
          },
        ],
      },
      {
        id: "what-i-did",
        heading: "What I did",
        blocks: [
          {
            type: "groups",
            groups: [
              {
                title: "As the business owner",
                items: [
                  "Defined the requirements: how MakMex handles products, condition grades, kits and combos, and multi-warehouse stock, and where the spreadsheet process was breaking down.",
                ],
              },
              {
                title: "As database designer",
                items: [
                  "Designed the tables for products, brands, conditions, warehouses, inventory, dated prices, images, kits, and combos.",
                  "Built condition-based pricing: each product stores one base price for a new item, and a multiplier from 1.0 down to 0.4 prices every other grade.",
                  "Wrote SQL views that calculate bundle prices from their parts and how many complete kits each warehouse can assemble.",
                  "Added CHECK constraints, foreign keys, and unique keys so bad data is rejected at the source.",
                  "Led the migration of MakMex's Excel data into PostgreSQL on Supabase.",
                ],
              },
              {
                title: "As team lead",
                items: [
                  "Oversaw the React storefront and the Python employee app so both were built on the shared data model.",
                  "Coordinated priorities and kept the team aligned with what the business actually needed.",
                ],
              },
            ],
          },
          {
            type: "figure",
            image: {
              src: "/images/projects/makmex/kit-items.webp",
              alt: "Query results listing kits with their tool, charger, and battery components, quantity, and kit discount.",
              width: 872,
              height: 872,
            },
            caption: "Each kit is a tool, battery, and charger referenced from the products table, not copied into it.",
          },
        ],
      },
      {
        id: "audit",
        heading: "Data quality audit",
        blocks: [
          {
            type: "paragraph",
            text: "In October 2026 I audited the live database and storefront. I found six problems. Each one was producing numbers that looked plausible and were wrong.",
          },
          {
            type: "metrics",
            items: [
              { label: "Kits shown as available", before: "3,355", after: "492", note: "join error fixed" },
              { label: "Combos shown as available", before: "133", after: "49" },
              { label: "Products listed in the catalog", before: "343", after: "1,977", note: "API row limit fixed" },
              { label: "Spec descriptions cleaned", after: "13,269", note: "CSV import artifacts" },
            ],
          },
          {
            type: "paragraph",
            text: "The biggest issue was availability. To decide how many kits a warehouse can build, the view divides each component's stock by the quantity needed and takes the lowest result. But it used an inner join to inventory, so a component with no stock record at a warehouse simply disappeared instead of counting as zero.",
          },
          {
            type: "figure",
            image: {
              src: "/images/projects/makmex/kit-breakdown.webp",
              alt: "Query results for kit 2726-20-E-KIT5A at warehouse CEDIS: tool stock 0, battery stock 20, charger stock 42.",
              width: 1003,
              height: 560,
            },
            caption:
              "One kit at one warehouse. The tool has no stock, so zero kits can be built. The old view ignored the tool row and reported 20.",
          },
          {
            type: "code",
            language: "sql",
            code: KIT_AVAILABILITY_SQL,
            caption:
              "The fix: check every kit at every warehouse (CROSS JOIN) and treat missing stock as zero (LEFT JOIN + COALESCE).",
          },
          {
            type: "figure",
            image: {
              src: "/images/projects/makmex/before-after.webp",
              alt: "Before and after counts of kits shown as available by warehouse: CDMX 3,031 to 76, CEDIS 3,351 to 435, DENMOR 3,341 to 148.",
              width: 1058,
              height: 678,
            },
            caption: "Kits shown as available, old logic versus fixed view, per warehouse.",
          },
          {
            type: "table",
            caption: "All six findings",
            columns: ["Issue", "Root cause", "Fix"],
            rows: [
              [
                "Kits and combos shown as available when they couldn't be assembled",
                "Inner join dropped components with no stock record",
                "Cross join with warehouses, left join to stock, missing stock counted as zero",
              ],
              [
                "Storefront showing random prices",
                "The catalog requested whole tables in one call; the API returns at most 1,000 rows, and missing prices fell back to a random placeholder",
                "Added a product_price view, paged every catalog query, removed all random fallbacks",
              ],
              [
                "Bundles silently underpriced",
                "SUM() skips NULL, so a part with no price was treated as free",
                "Bundle price is NULL when any part lacks a price; views use the latest dated price",
              ],
              [
                "Customer and order data publicly readable",
                "Row-level security policies let the public API key read customer and order rows",
                "Removed browser access to sales tables",
              ],
              [
                "Duplicate inventory rows",
                "The same product and warehouse were imported more than once",
                "Merged 32 duplicate rows with total stock unchanged, added a unique constraint",
              ],
              [
                "Product specs wrapped in stray quotes",
                "The Excel-to-CSV import escaped text twice",
                "Removed both layers of escaping across 13,269 descriptions",
              ],
            ],
          },
          {
            type: "code",
            language: "sql",
            code: PRODUCT_PRICE_SQL,
            caption: "Prices now come from one view, so the catalog and product pages always agree.",
          },
          {
            type: "figure",
            image: {
              src: "/images/projects/makmex/catalog.webp",
              alt: "MakMex storefront catalog with filters and product cards showing condition grades and prices.",
              width: 950,
              height: 510,
            },
            caption: "The storefront after the fixes: real, condition-adjusted prices and the full in-stock catalog.",
          },
        ],
      },
      {
        id: "result",
        heading: "Result",
        blocks: [
          {
            type: "paragraph",
            text: "MakMex's product, pricing, and inventory data now lives in one structured database instead of scattered spreadsheets. Pricing and availability are calculated in SQL, so the storefront, the employee app, and any future report use the same rules. After the audit, the numbers customers see match the database.",
          },
          {
            type: "paragraph",
            text: "Some storefront and employee-app features, such as checkout, were left as next steps at the end of the capstone.",
          },
        ],
      },
      {
        id: "learned",
        heading: "What I learned",
        blocks: [
          {
            type: "paragraph",
            text: "Good data modeling prevents most downstream problems, but a correct model is not enough. Every bug in the audit produced believable output; none of them threw an error. I now check numbers against an independent count before trusting them.",
          },
          {
            type: "paragraph",
            text: "Being both the stakeholder and the technical lead also showed me how much gets lost between what the business needs and what gets built, and how much of the job is closing that gap.",
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "fire-ems-data-warehouse",
    kind: "case-study",
    title: "Fire & EMS Data Warehouse",
    label: "ACADEMIC · 2025–26",
    summary:
      "Cleaned and modeled emergency response data with Python and SQL, then built Power BI and Tableau dashboards to track response performance.",
    role: "Data analyst",
    period: "2025 – 2026",
    type: "Academic analytics project, GCU",
    stack: ["Python", "SQL", "Power BI", "Tableau"],
    focus: "Operational KPIs: response times, call volume, resource utilization",
    coverDiagram: "fire-ems-pipeline",
    sections: [
      {
        id: "overview",
        heading: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "An academic analytics project at Grand Canyon University. I built a data pipeline and dashboards to analyze emergency response performance, from raw call records to KPIs a non-technical audience could read.",
          },
        ],
      },
      {
        id: "problem",
        heading: "Problem",
        blocks: [
          {
            type: "paragraph",
            text: "Fire and EMS operations depend on fast, well-distributed response. Raw call records couldn't answer basic operational questions directly: how fast units respond, where demand is concentrated, and how evenly resources are used. The data first had to be cleaned, structured, and validated.",
          },
        ],
      },
      {
        id: "pipeline",
        heading: "Data pipeline",
        blocks: [
          {
            type: "diagram",
            diagram: "fire-ems-pipeline",
            caption: "From raw records to dashboards.",
          },
          {
            type: "placeholder",
            text: "Add the data source (public city dataset or course-provided) and the main fields used.",
          },
        ],
      },
      {
        id: "what-i-did",
        heading: "What I did",
        blocks: [
          {
            type: "list",
            items: [
              "Cleaned raw records in Python, handling missing timestamps, inconsistent formats, and invalid entries.",
              "Transformed and loaded the data into a SQL model built for reporting.",
              "Wrote validation checks to confirm the data was complete and that calculated fields such as response time were reasonable.",
              "Defined KPIs for response time, call volume, and resource utilization.",
              "Built dashboards in Power BI and Tableau to track those KPIs over time.",
              "Presented the findings to technical and non-technical audiences.",
            ],
          },
          {
            type: "placeholder",
            text: "Add 1–2 dashboard screenshots (1600×1000) to /public/images/projects/fire-ems/ and reference them here as figures.",
          },
        ],
      },
      {
        id: "challenges",
        heading: "Challenges",
        blocks: [
          {
            type: "list",
            items: [
              "Calculating response time reliably. Timestamps had gaps and sequencing errors, so I set rules for which records were valid before calculating averages.",
              "Building the same views in two tools. Doing this in both Power BI and Tableau meant keeping KPI definitions identical across them.",
              "Making the results usable. I designed the dashboards so a non-technical viewer could find the key trend quickly.",
            ],
          },
        ],
      },
      {
        id: "result",
        heading: "Result",
        blocks: [
          {
            type: "paragraph",
            text: "A working pipeline and a set of dashboards that show how response performance, call volume, and resource use vary over time.",
          },
          {
            type: "placeholder",
            text: "Add 1–2 qualitative findings, e.g. when call volume peaked and where response times were longest.",
          },
        ],
      },
      {
        id: "learned",
        heading: "What I learned",
        blocks: [
          {
            type: "paragraph",
            text: "Most of the work in analytics happens before the dashboard. A KPI is only as trustworthy as the validation behind it, and defining a metric clearly matters as much as calculating it.",
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "predictive-pricing",
    kind: "case-study",
    title: "Predictive Pricing & Revenue Optimization",
    label: "INDEPENDENT · 2026",
    summary:
      "Trained a Random Forest model to predict demand from price, discount, and seasonality, then simulated discount scenarios to compare revenue and margin.",
    role: "Analyst",
    period: "2026",
    type: "Independent project, synthetic data",
    stack: ["Python", "pandas", "scikit-learn", "matplotlib"],
    focus: "Demand prediction and revenue-versus-margin tradeoffs",
    coverChart: "pricing-scenarios",
    highlights: [
      { value: "~82%", label: "lower prediction error than the baseline" },
      { value: "0.967", label: "R² on the holdout test set" },
      { value: "30%", label: "discount where predicted margin turns negative" },
    ],
    links: [{ label: "Code on GitHub", href: "https://github.com/jonathanBonilla03/pricing-ml-optimization" }],
    sections: [
      {
        id: "overview",
        heading: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "An end-to-end Python machine learning pipeline. It predicts product demand from pricing and operational signals, then simulates discount scenarios to estimate their effect on revenue and margin.",
          },
          {
            type: "chart",
            chart: "pricing-scenarios",
            caption:
              "The key result: simulated discounts for one product (SKU-06252). Revenue barely moves, but margin falls with every step and turns negative at 30%.",
          },
        ],
      },
      {
        id: "problem",
        heading: "Problem",
        blocks: [
          {
            type: "paragraph",
            text: "Discounts usually raise sales volume, but that doesn't mean they raise profit. I wanted to answer two questions with data: how does price drive demand, and does the discount that maximizes revenue also maximize margin?",
          },
        ],
      },
      {
        id: "data",
        heading: "Data",
        blocks: [
          {
            type: "paragraph",
            text: "I generated a synthetic retail dataset of 10,000 rows in Python, with category, brand, base price, discount, final price, month, stock level, unit cost, and units sold. Synthetic data let me build and test the full workflow without using confidential sales records.",
          },
        ],
      },
      {
        id: "what-i-did",
        heading: "What I did",
        blocks: [
          {
            type: "list",
            items: [
              "Wrote a data generator that simulates relationships between price, seasonality, and demand.",
              "Preprocessed features with one-hot encoding for categorical fields.",
              "Trained and compared three models on a holdout test set: a mean baseline, linear regression, and a random forest.",
              "Built a simulator that tests discounts from 0% to 30% for a product, predicts units sold, and calculates revenue and margin.",
              "Ran feature importance analysis to see what drove the predictions.",
              "Organized the work as separate scripts for generation, training, simulation, plotting, and feature importance.",
            ],
          },
        ],
      },
      {
        id: "results",
        heading: "Results",
        blocks: [
          {
            type: "table",
            caption: "Model comparison on the holdout test set (units sold)",
            columns: ["Model", "MAE", "RMSE", "R²"],
            numeric: [1, 2, 3],
            rows: [
              ["Random forest", "5.25", "6.62", "0.967"],
              ["Linear regression", "8.52", "10.36", "0.920"],
              ["Baseline (mean)", "30.34", "36.71", "0.000"],
            ],
          },
          {
            type: "paragraph",
            text: "The random forest cut prediction error by about 82% compared with the baseline. Final price accounted for about 84% of feature importance and month (seasonality) for about 12%; brand and category mattered little.",
          },
          {
            type: "paragraph",
            text: "In the simulation (Fig. 1), a 5% discount slightly increased predicted revenue for the sample product, but margin fell from about $7,036 to $6,127. Keeping the original price was the better choice for profit.",
          },
        ],
      },
      {
        id: "limitations",
        heading: "Limitations",
        blocks: [
          {
            type: "callout",
            title: "Why the scores are high",
            text: "Because the data was synthetic, the model largely recovered relationships I built into the generator. The strong scores show the pipeline works end to end, not that it would predict real customer behavior this accurately. A real deployment would need historical transactions, time-aware validation, and competitor and stockout data.",
          },
        ],
      },
      {
        id: "learned",
        heading: "What I learned",
        blocks: [
          {
            type: "paragraph",
            text: "The most useful output wasn't a single best price. It was making the revenue-versus-margin tradeoff visible, so the decision depends on the business goal. I also learned to treat a high model score with skepticism until the data behind it is real.",
          },
          {
            type: "paragraph",
            text: "Next step: retrain the model on real transaction data, such as MakMex's dated price history, to test whether the patterns hold.",
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "bonaro-tech-platform",
    kind: "case-study",
    title: "Bonaro Tech Digital Operations Platform",
    label: "BUSINESS SYSTEMS · 2026",
    summary:
      "Designed and built a connected system for service businesses that links lead capture, AI chat, booking, automated email, and analytics.",
    role: "Founder & developer",
    period: "2026 – Present",
    type: "Business systems project",
    stack: ["Next.js", "TypeScript", "Tailwind", "REST APIs", "AI integration", "Resend", "Calendly", "Vercel"],
    focus: "Business process design and systems integration",
    coverDiagram: "bonaro-architecture",
    sections: [
      {
        id: "overview",
        heading: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "A connected system for home service businesses that links lead capture, AI chat, booking, automated communication, and analytics, so no lead falls through the gaps between steps.",
          },
        ],
      },
      {
        id: "problem",
        heading: "Problem",
        blocks: [
          {
            type: "paragraph",
            text: "Small service businesses often lose leads between steps. Someone fills out a form or asks a question, and the follow-up is slow, manual, or never happens. The business also can't see where leads come from or where they drop off.",
          },
        ],
      },
      {
        id: "architecture",
        heading: "Architecture",
        blocks: [
          {
            type: "diagram",
            diagram: "bonaro-architecture",
            caption: "Each step hands off to the next automatically, and every step reports to analytics.",
          },
        ],
      },
      {
        id: "what-i-did",
        heading: "What I did",
        blocks: [
          {
            type: "list",
            items: [
              "Mapped the customer journey from first visit to booked appointment, and turned it into documented workflows and system requirements.",
              "Built the platform in Next.js and TypeScript, with API routes connecting forms, chat, booking, and email.",
              "Integrated an AI chatbot to answer common questions and route leads.",
              "Set up automated confirmation and follow-up emails.",
              "Added analytics tracking to measure lead sources and conversion steps.",
              "Tested releases, diagnosed issues across APIs and data routing, and documented processes.",
            ],
          },
          {
            type: "placeholder",
            text: "Add 1–2 screenshots of the lead form, chat, or booking flow to /public/images/projects/bonaro/.",
          },
        ],
      },
      {
        id: "challenges",
        heading: "Challenges",
        blocks: [
          {
            type: "list",
            items: [
              "Reliable data routing. Every form submission and booking had to reach the right place, and failures had to be visible rather than silent.",
              "Designing for non-technical owners. The system had to work without the business owner touching any code.",
            ],
          },
        ],
      },
      {
        id: "learned",
        heading: "What I learned",
        blocks: [
          {
            type: "paragraph",
            text: "Building a system is mostly understanding a business process. The code is the easier part; getting the workflow right comes first.",
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "aloy-field-note",
    kind: "field-note",
    title: "ALOY Commercial: analysis across 13,000+ SKUs",
    label: "FIELD NOTE · 2022–26",
    summary:
      "How I structured pricing, margin, and inventory analysis for a commercial supply business, and what real data taught me about data quality.",
    role: "Co-founder & business analyst",
    period: "2022 – June 2026",
    type: "Field note",
    stack: ["Excel", "Operational and financial records"],
    focus: "Pricing, margin, and inventory analysis on real business data",
    sections: [
      {
        id: "what-it-was",
        heading: "What it was",
        blocks: [
          {
            type: "paragraph",
            text: "Four years as co-founder and business analyst of a commercial supply business with more than 13,000 SKUs.",
          },
        ],
      },
      {
        id: "analysis",
        heading: "The analysis",
        blocks: [
          {
            type: "paragraph",
            text: "I tracked supplier costs, pricing, sales, shipments, inventory, revenue, and margins in Excel-based reporting workflows. That analysis fed decisions about purchasing, vendors, customers, and pricing.",
          },
        ],
      },
      {
        id: "lessons",
        heading: "What real data taught me",
        blocks: [
          {
            type: "paragraph",
            text: "Records from suppliers, customers, purchases, and shipments rarely matched perfectly. Much of my work was reconciling them: catching inconsistencies, tracing where they came from, and making sure the numbers behind a decision were right.",
          },
          {
            type: "paragraph",
            text: "This is where I learned that analysis exists to support decisions, and that data quality decides whether a decision can be trusted.",
          },
        ],
      },
      {
        id: "next",
        heading: "What came next",
        blocks: [
          {
            type: "paragraph",
            text: "Those spreadsheet limits are what led to MakMex, my capstone, where I moved one of ALOY's businesses onto a real database.",
          },
        ],
      },
    ],
  },
];

export const caseStudies = projects.filter((p) => p.kind === "case-study");
export const fieldNotes = projects.filter((p) => p.kind === "field-note");

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
