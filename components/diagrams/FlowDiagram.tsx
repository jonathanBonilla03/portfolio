import { ArrowDown, ArrowRight } from "lucide-react";
import { Fragment } from "react";

export type FlowStep = { title: string; detail: string; tool?: string };

/** A left-to-right process flow that stacks vertically on small screens. */
export function FlowDiagram({ steps, label }: { steps: FlowStep[]; label: string }) {
  // Long flows read better as a numbered grid than as a cramped single row.
  if (steps.length > 4) {
    return (
      <ol aria-label={label} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-[10px] border border-border bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-1.5 text-[15px] font-semibold leading-snug text-text">{step.title}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{step.detail}</p>
            {step.tool ? <p className="mt-2 font-mono text-xs text-muted">{step.tool}</p> : null}
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol aria-label={label} className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch">
      {steps.map((step, i) => (
        <Fragment key={step.title}>
          <li className="flex-1 rounded-[10px] border border-border bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-1.5 text-[15px] font-semibold leading-snug text-text">{step.title}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{step.detail}</p>
            {step.tool ? <p className="mt-2 font-mono text-xs text-muted">{step.tool}</p> : null}
          </li>
          {i < steps.length - 1 ? (
            <li aria-hidden className="flex items-center justify-center text-border-strong">
              <ArrowDown className="size-4 lg:hidden" />
              <ArrowRight className="hidden size-4 lg:block" />
            </li>
          ) : null}
        </Fragment>
      ))}
    </ol>
  );
}

export const fireEmsSteps: FlowStep[] = [
  { title: "Raw call records", detail: "Emergency call, dispatch, and arrival records", tool: "Source data" },
  { title: "Clean & validate", detail: "Fix formats, flag missing or out-of-order times", tool: "Python" },
  { title: "Reporting model", detail: "Structured tables and calculated KPIs", tool: "SQL" },
  { title: "Dashboards", detail: "Response time, call volume, utilization", tool: "Power BI · Tableau" },
];

export const bonaroSteps: FlowStep[] = [
  { title: "Visit", detail: "A potential customer lands on the site", tool: "Website" },
  { title: "Capture", detail: "Forms route to the right place", tool: "Next.js API routes" },
  { title: "AI chat", detail: "Answers questions, qualifies leads", tool: "AI integration" },
  { title: "Booking", detail: "Customer picks a time", tool: "Calendly" },
  { title: "Follow-up", detail: "Confirmations and reminders", tool: "Resend" },
  { title: "Analytics", detail: "Sources and drop-off at each step", tool: "Analytics tracking" },
];
