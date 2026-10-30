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
    cardStack: ["PostgreSQL", "SQL", "Supabase"],
    cardHighlights: [
      { value: "4-person", label: "capstone team I led" },
      { value: "6", label: "live data issues found and fixed" },
      { value: "13,269", label: "product descriptions cleaned" },
    ],
    atAGlance: {
      problem: "An operating tools business ran 13,000+ products, three warehouses, and bundle pricing out of Excel.",
      role: "Defined the requirements from the business side, led the team, and designed the database.",
      solution: "A PostgreSQL/Supabase relational model with SQL views for pricing and availability.",
      impact: "Found and fixed six data-quality issues in the live system, including kit availability overstated at 3,355 when only 492 could be assembled.",
    },
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
    cardStack: ["Python", "SQL", "Power BI"],
    atAGlance: {
      problem: "Raw emergency call records couldn't answer basic questions about response performance.",
      role: "Data analyst on an academic project.",
      solution: "A Python and SQL pipeline that cleans, validates, and models the data for reporting.",
      impact: "Power BI and Tableau dashboards tracking response time, call volume, and resource utilization.",
    },
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
    cardStack: ["Python", "scikit-learn", "pandas"],
    cardHighlights: [{ value: "30%", label: "discount where predicted margin turns negative" }],
    atAGlance: {
      problem: "Do discounts that raise revenue also raise profit?",
      role: "Analyst, independent project on synthetic data.",
      solution: "A Random Forest demand model plus a simulator that tests discounts from 0% to 30%.",
      impact: "About 82% lower prediction error than baseline, and a clear result: a 5% discount lifts revenue but cuts margin.",
    },
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
    cardStack: ["Next.js", "TypeScript", "REST APIs"],
    atAGlance: {
      problem: "Service businesses lose leads between the form, the follow-up, and the booking.",
      role: "Founder and developer.",
      solution: "One connected flow: lead capture, AI chat, booking, automated email, and analytics.",
      impact: "Live at bonarotech.com, and running two client sites: a cabinet and countertop company and a teeth-whitening studio.",
    },
    focus: "Business process design and systems integration",
    cover: {
      src: "/images/projects/bonaro/cover.webp",
      alt: "Bonaro Tech homepage with the AI assistant chat panel open.",
      width: 1821,
      height: 1138,
    },
    cardHighlights: [{ value: "2", label: "client sites live" }],
    links: [
      { label: "Bonaro Tech", href: "https://bonarotech.com" },
      { label: "DBL Cabinet Designs", href: "https://www.dblcabinetdesigns.com" },
      { label: "CamiGlow Smiles", href: "https://camiglowsmiles.com" },
    ],
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
            type: "figure",
            image: {
              src: "/images/projects/bonaro/home-chat.webp",
              alt: "Bonaro Tech homepage with the Bonaro Assistant chat open, answering a visitor's question about what the company does.",
              width: 1821,
              height: 1554,
            },
            caption:
              "The AI assistant on the live site answers a visitor's question in context, so a lead gets a response before anyone on the team sees it.",
          },
          {
            type: "figure",
            image: {
              src: "/images/projects/bonaro/lead-form.webp",
              alt: "Bonaro Tech lead form asking for name, email, phone, business name, service of interest, and a description of the business.",
              width: 1825,
              height: 1415,
            },
            caption:
              "The lead form captures the fields the follow-up needs (business, service, and the customer's own description) instead of a bare name and email.",
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
        id: "result",
        heading: "Result",
        blocks: [
          {
            type: "paragraph",
            text: "The system is live at bonarotech.com. A visitor gets an immediate answer from the assistant, and every form submission arrives with the business, the service they need, and their own description of the problem, so follow-up can start without a back-and-forth.",
          },
        ],
      },
      {
        id: "client-work",
        heading: "Client work",
        blocks: [
          {
            type: "paragraph",
            text: "The same approach, applied to real local businesses. Each site starts from how the owner gets customers, then gives visitors one clear next step.",
          },
          {
            type: "figure",
            image: {
              src: "/images/projects/bonaro/dbl-cabinet.webp",
              alt: "DBL Cabinet Designs homepage: dark navy hero with the headline 'Cabinet & Countertop Solutions for Every Space & Budget', Free Quote buttons, and kitchen and vanity photos.",
              width: 1800,
              height: 982,
            },
            caption:
              "DBL Cabinet Designs (Gilbert, AZ). Next.js and TypeScript site for a cabinet and countertop company, with call, text, and WhatsApp quote requests one tap away, and all content kept in one file so updates never touch layout code.",
          },
          {
            type: "figure",
            image: {
              src: "/images/projects/bonaro/camiglow.webp",
              alt: "CamiGlow Smiles homepage: cream and gold hero reading 'Reveal Your Radiant Smile' with Book a Session and Our Services buttons beside the gold logo.",
              width: 1800,
              height: 980,
            },
            caption:
              "CamiGlow Smiles (Phoenix, AZ). React and Supabase booking site for a teeth-whitening studio, built around getting a visitor from services and results to a booked session.",
          },
        ],
      },
      {
        id: "demonstrates",
        heading: "What this demonstrates",
        blocks: [
          {
            type: "list",
            items: [
              "Business requirements translated into a working system",
              "Workflow design across several tools",
              "API integration (Calendly, Resend, AI)",
              "Full-stack development in Next.js and TypeScript",
              "Testing and troubleshooting in production",
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
    slug: "sales-inventory-margin",
    kind: "case-study",
    title: "Sales, Inventory & Margin Dashboard",
    label: "INDEPENDENT · IN PROGRESS · 2026",
    summary:
      "Cleaned six raw tables in Power Query, built a star-schema model with DAX measures, and traced weak margin, high returns, and missed targets to their causes.",
    role: "BI analyst",
    period: "2026",
    type: "Independent Power BI project, synthetic data",
    stack: ["Power BI", "Power Query", "DAX", "Data modeling"],
    cardStack: ["Power BI", "Power Query", "DAX"],
    atAGlance: {
      problem: "A multi-branch distributor needs to see where revenue and margin come from, and why one branch earns less.",
      role: "BI analyst, independent project on synthetic data.",
      solution: "Power Query cleaning with a staging query and an exceptions check, a star-schema model, and DAX measures for revenue, margin, and discounts.",
      impact: "Found three separate problems: one branch's margin lost to discounting, an online returns rate about 2.5× the other channels, and one branch below its revenue target in 19 of 21 months.",
    },
    focus: "Data preparation, star-schema modeling, and margin analysis in Power BI",
    cover: {
      src: "/images/projects/sales-margin/model-view.webp",
      alt: "Power BI model view: a Sales fact table linked to products, customers, locations, and Date, with inventory and targets fact tables sharing the same dimensions.",
      width: 1578,
      height: 1148,
    },
    highlights: [
      { value: "26,091", label: "sales lines, matching the expected count after cleaning" },
      { value: "18", label: "sales lines caught referencing a product that doesn't exist" },
      { value: "15.4% vs 9.6%", label: "discount at the weakest branch vs. the other five" },
    ],
    cardHighlights: [{ value: "30.3%", label: "margin at the weakest branch, vs. about 35% elsewhere" }],
    sections: [
      {
        id: "overview",
        heading: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "A Power BI project built end to end: raw CSV files cleaned in Power Query, a star-schema data model, and DAX measures that answer business questions about sales, margin, and inventory for a fictional six-branch Arizona trade-supply distributor.",
          },
          {
            type: "callout",
            title: "In progress",
            text: "The data preparation, model, and sales, discount, return, and target measures are finished and validated. Inventory and time-based measures come next, followed by the report pages.",
          },
        ],
      },
      {
        id: "problem",
        heading: "Problem",
        blocks: [
          {
            type: "paragraph",
            text: "Management wants one place to see revenue, profitability, discounts, inventory health, and branch performance. The data arrives as six separate exports with inconsistent values, duplicates, and broken references, so it can't be trusted until it's cleaned and connected.",
          },
        ],
      },
      {
        id: "data",
        heading: "Data",
        blocks: [
          {
            type: "paragraph",
            text: "Synthetic data covering January 2025 to September 2026: about 26,000 sales lines, 147 products, 450 customers, 6 branches, monthly inventory snapshots, and monthly revenue and margin targets. The files contain known data-quality problems, so each cleaning step could be checked against an expected result.",
          },
        ],
      },
      {
        id: "preparation",
        heading: "Data preparation",
        blocks: [
          {
            type: "list",
            items: [
              "Removed 45 duplicate sales lines using the line-level key.",
              "Standardized the Channel field from 14 spellings down to 4, and fixed lowercase branch codes that would have broken the join to the branch table.",
              "Found 260 missing discount values. Instead of defaulting them to 0, I checked the prices first: most of those lines sold below list price, so I calculated the discount from list and selling price. The formula reproduced every discount that was recorded.",
              "Excluded 12 lines with zero or negative quantities, since returns are tracked in a separate field.",
              "Moved the shared cleaning into a staging query, then branched it: an inner join builds the clean sales table, and a left anti-join builds an exceptions table of sales whose product doesn't exist.",
              "Trimmed text, standardized casing, and removed duplicate keys in the customer and product tables so every dimension key is unique.",
            ],
          },
          {
            type: "figure",
            image: {
              src: "/images/projects/sales-margin/power-query-steps.webp",
              alt: "Power Query editor showing the Sales_Staging query, column quality profiles, and a list of renamed applied steps such as 'Remove duplicate lines' and 'Derived missing discounts from prices'.",
              width: 1680,
              height: 1161,
            },
            caption:
              "The staging query. Each step is renamed to describe what it does, and column profiling runs on the full dataset.",
          },
          {
            type: "figure",
            image: {
              src: "/images/projects/sales-margin/exceptions-query.webp",
              alt: "Power Query exceptions query listing 18 sales lines, all with product ID P-9999, spread across several branches and dates from 2025 to 2026.",
              width: 1662,
              height: 1154,
            },
            caption:
              "The exceptions query: 18 sales lines pointing to a product that isn't in the product table. They span five branches and both years, which points to a recurring setup problem rather than a one-time import error.",
          },
          {
            type: "paragraph",
            text: "After cleaning, the sales table loaded with 26,091 rows and 11,491 distinct orders, matching the expected counts exactly.",
          },
        ],
      },
      {
        id: "model",
        heading: "Data model",
        blocks: [
          {
            type: "figure",
            image: {
              src: "/images/projects/sales-margin/model-view.webp",
              alt: "Power BI model view with nine one-to-many relationships between the products, customers, locations, and Date dimensions and the Sales, inventory, and targets fact tables.",
              width: 1578,
              height: 1148,
            },
            caption:
              "Three fact tables (sales, inventory snapshots, and targets) share four dimension tables through nine one-to-many relationships.",
          },
          {
            type: "list",
            items: [
              "Built a Date table in DAX covering every date in every fact table, marked it as the model's date table, and set month names to sort by month number.",
              "Kept every relationship one-to-many with single-direction filtering, so filters flow from dimensions to facts.",
              "Deleted an auto-detected relationship on City between customers and branches, which would have created a second filter path to sales.",
              "Hid the key columns on the fact tables so reports filter through the dimensions. A filter on a fact table's key can't reach the other fact tables.",
              "Turned off default summing for prices, percentages, and sort keys, so totals only come from measures.",
            ],
          },
        ],
      },
      {
        id: "measures",
        heading: "Measures",
        blocks: [
          {
            type: "table",
            caption: "Core DAX measures, kept in a dedicated measures table",
            columns: ["Measure", "Definition"],
            rows: [
              ["Revenue", "Units × selling price, summed row by row (SUMX)"],
              ["COGS", "Units × unit cost, summed row by row"],
              ["Gross Margin / Gross Margin %", "Revenue − COGS, and that divided by revenue (DIVIDE)"],
              ["Orders", "Distinct order IDs, since one order has several lines"],
              ["Average Order Value", "Revenue ÷ orders"],
              ["Discount %", "1 − revenue ÷ revenue at list price, weighted by sale size"],
              ["Discount $", "Revenue at list price − actual revenue"],
              ["Returned Units / Return Rate", "Units sold with Returned = Y (CALCULATE), divided by all units sold"],
              ["Revenue Target / % to Target", "Monthly targets up to the last sale date only, and revenue divided by that"],
            ],
          },
          {
            type: "paragraph",
            text: "Discount % is weighted on purpose. A plain average of the discount column counts a $5 line the same as a $30,000 one; weighting by revenue answers how much of the list price was actually given away.",
          },
        ],
      },
      {
        id: "finding",
        heading: "Finding 1: margin lost to discounting",
        blocks: [
          {
            type: "figure",
            image: {
              src: "/images/projects/sales-margin/location-margin-table.webp",
              alt: "Power BI table by branch: Mesa shows 30.3% gross margin and 15.4% discount, while the other five branches show 34.2% to 35.3% margin and 8.9% to 10.2% discount.",
              width: 657,
              height: 171,
            },
            caption: "Revenue, margin, and discount by branch, sorted by gross margin.",
          },
          {
            type: "paragraph",
            text: "Mesa had about the same revenue as Tempe, but a 30.3% gross margin compared with about 35% at the other branches. The cause was pricing, not cost: Mesa discounted 15.4% off list, while the other five averaged 9.6%. At the other branches' rate, Mesa would have given away about $79,000 less in discounts.",
          },
          {
            type: "paragraph",
            text: "Breaking margin out by discount level showed the same pattern across branches: each additional 5 points of discount cost roughly 3 to 4 points of margin. That makes discount approval the lever to look at first.",
          },
        ],
      },
      {
        id: "returns",
        heading: "Finding 2: two separate returns problems",
        blocks: [
          {
            type: "figure",
            image: {
              src: "/images/projects/sales-margin/returns-by-channel.webp",
              alt: "Power BI table of returns by channel: E-Commerce returned 7.2% of units, compared with 2.3% to 2.9% for Counter, Field Sales, and Inside Sales. Total return rate 3.5%.",
              width: 326,
              height: 120,
            },
            caption: "Return rate by channel, measured in units rather than sales lines.",
          },
          {
            type: "paragraph",
            text: "I measured return rate by units, not by line count, so a 50-unit return weighs more than a 1-unit one. E-Commerce returned 7.2% of units, compared with 2.3% to 2.9% in the other channels. It sells the fewest units but accounts for about 38% of returned revenue.",
          },
          {
            type: "paragraph",
            text: "Thermostats and power tools also returned at about 8.4%, against roughly 3% for most products. To check whether one explained the other, I filtered by channel: those two products returned at 8% to 10% in every channel, and E-Commerce still returned about 7% of everything else. So there are two issues, a product fit or quality problem and an online ordering problem, and each needs a different fix.",
          },
        ],
      },
      {
        id: "targets",
        heading: "Finding 3: a steady miss against target",
        blocks: [
          {
            type: "figure",
            image: {
              src: "/images/projects/sales-margin/target-matrix.webp",
              alt: "Power BI matrix of percent to revenue target by branch and month, January 2025 to September 2026, shaded red below 100% and blue above. Tucson's row is red in nearly every month and totals 88.9%; other branches total 97.8% to 104.8%.",
              width: 1730,
              height: 250,
            },
            caption: "Percent to revenue target by branch and month. White is on target, red is below, blue is above.",
          },
          {
            type: "paragraph",
            text: "My first target measure showed the company at 87% of target. That was wrong: the targets file runs through December 2026, but sales end in September, so three future months of targets had no sales against them. I changed the measure to count targets only up to the last sale date, which put the company at 98.9%.",
          },
          {
            type: "paragraph",
            text: "With that fixed, Tucson stood out at 88.9% of target, below 100% in 19 of 21 months, while its margin was healthy. Mesa showed the opposite: 104.8% of target with the weakest margin. Hitting a revenue target doesn't mean a branch is healthy, and Tucson's shortfall could come from the target being set too high as much as from the branch itself.",
          },
        ],
      },
      {
        id: "next",
        heading: "What's next",
        blocks: [
          {
            type: "list",
            items: [
              "Inventory measures that use only the latest snapshot in each period, plus items below reorder point.",
              "Month-over-month, year-to-date, and year-over-year comparisons.",
              "Report pages: executive overview, sales and margin, products, inventory health, and branch performance.",
            ],
          },
          {
            type: "placeholder",
            text: "Add the report page screenshots (1600×1000) to /public/images/projects/sales-margin/ and use the executive overview as the cover.",
          },
        ],
      },
      {
        id: "learned",
        heading: "What I learned so far",
        blocks: [
          {
            type: "paragraph",
            text: "Check what a missing value means before filling it. Defaulting the missing discounts to zero would have understated discounting in exactly the analysis this project is about. A target row count also made the cleaning testable: I knew the work was right when the table landed on 26,091. The target measure taught the same lesson from the other side: compare actuals only against periods that have actually happened.",
          },
        ],
      },
    ],
  },
];

export const caseStudies = projects.filter((p) => p.kind === "case-study");

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
