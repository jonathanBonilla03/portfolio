"use client";

import { useState } from "react";

/** Simulator output for SKU-06252, from reports/scenario_results_SKU-06252.csv. */
const data = [
  { discount: 0, revenue: 24471.54, margin: 7035.62 },
  { discount: 5, revenue: 24507.18, margin: 6126.85 },
  { discount: 10, revenue: 23527.99, margin: 4901.72 },
  { discount: 15, revenue: 22686.9, margin: 3670.0 },
  { discount: 20, revenue: 22454.65, margin: 2456.04 },
  { discount: 25, revenue: 21915.91, margin: 1095.86 },
  { discount: 30, revenue: 20944.54, margin: -373.94 },
];

const series = [
  { key: "revenue", label: "Predicted revenue", color: "var(--chart-1)" },
  { key: "margin", label: "Predicted margin", color: "var(--chart-2)" },
] as const;

const W = 640;
const H = 300;
const pad = { top: 16, right: 112, bottom: 40, left: 56 };
const yMin = -2000;
const yMax = 26000;
const yTicks = [0, 5000, 10000, 15000, 20000, 25000];

const x = (discount: number) => pad.left + (discount / 30) * (W - pad.left - pad.right);
const y = (value: number) => pad.top + ((yMax - value) / (yMax - yMin)) * (H - pad.top - pad.bottom);

const money = (v: number) =>
  (v < 0 ? "−$" : "$") + Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 });

export function PricingScenarioChart() {
  const [hover, setHover] = useState<number | null>(null);
  const point = hover === null ? null : data[hover];

  return (
    <div>
      <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted" aria-label="Legend">
        {series.map((s) => (
          <li key={s.key} className="inline-flex items-center gap-2">
            <span aria-hidden className="inline-block h-0.5 w-4 rounded-full" style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Line chart: as the discount rises from 0% to 30%, predicted revenue stays between about $21,000 and $24,500 while predicted margin falls from about $7,000 to below zero."
          onMouseLeave={() => setHover(null)}
        >
          {/* Grid and y-axis labels */}
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={pad.left}
                x2={W - pad.right}
                y1={y(t)}
                y2={y(t)}
                stroke={t === 0 ? "var(--text-muted)" : "var(--border)"}
                strokeWidth={1}
              />
              <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted font-mono text-[11px]">
                {t === 0 ? "$0" : `$${t / 1000}k`}
              </text>
            </g>
          ))}
          {/* x-axis labels */}
          {data.map((d) => (
            <text key={d.discount} x={x(d.discount)} y={H - pad.bottom + 20} textAnchor="middle" className="fill-muted font-mono text-[11px]">
              {d.discount}%
            </text>
          ))}
          <text x={(pad.left + W - pad.right) / 2} y={H - 4} textAnchor="middle" className="fill-muted text-[11px]">
            Discount
          </text>

          {/* Crosshair */}
          {point ? (
            <line x1={x(point.discount)} x2={x(point.discount)} y1={pad.top} y2={H - pad.bottom} stroke="var(--border-strong)" strokeWidth={1} />
          ) : null}

          {/* Series */}
          {series.map((s) => (
            <g key={s.key}>
              <polyline
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                points={data.map((d) => `${x(d.discount)},${y(d[s.key])}`).join(" ")}
              />
              {data.map((d, i) => (
                <circle
                  key={d.discount}
                  cx={x(d.discount)}
                  cy={y(d[s.key])}
                  r={hover === i ? 5 : 3.5}
                  fill={s.color}
                  stroke="var(--surface)"
                  strokeWidth={2}
                />
              ))}
              {/* Direct label at the line end */}
              <text
                x={x(30) + 10}
                y={y(data[data.length - 1][s.key])}
                dy="0.32em"
                className="fill-text text-[12px] font-medium"
              >
                {s.key === "revenue" ? "Revenue" : "Margin"}
              </text>
            </g>
          ))}

          {/* Hover targets, wider than the marks */}
          {data.map((d, i) => (
            <rect
              key={d.discount}
              x={x(d.discount) - 24}
              y={pad.top}
              width={48}
              height={H - pad.top - pad.bottom}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}
        </svg>

        {point ? (
          <div
            className="pointer-events-none absolute top-2 rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-sm"
            style={{
              left: `${(x(point.discount) / W) * 100}%`,
              transform: point.discount > 15 ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
            }}
          >
            <p className="font-mono text-muted">{point.discount}% discount</p>
            <p className="mt-1 text-text">Revenue {money(point.revenue)}</p>
            <p className="text-text">Margin {money(point.margin)}</p>
          </div>
        ) : null}
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted hover:text-text">View data</summary>
        <table className="mt-2 w-full max-w-md text-left">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-1.5 font-medium">Discount</th>
              <th className="py-1.5 text-right font-medium">Revenue</th>
              <th className="py-1.5 text-right font-medium">Margin</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {data.map((d) => (
              <tr key={d.discount} className="border-b border-border">
                <td className="py-1.5">{d.discount}%</td>
                <td className="py-1.5 text-right">{money(d.revenue)}</td>
                <td className="py-1.5 text-right">{money(d.margin)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
