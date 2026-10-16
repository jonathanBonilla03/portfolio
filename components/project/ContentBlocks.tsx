import { Info, PencilLine } from "lucide-react";
import { Chart, Diagram } from "@/components/diagrams/Diagram";
import type { Block } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";
import { FigureFrame, FigureImage } from "./Figure";

const showPlaceholders = process.env.NODE_ENV !== "production";

/**
 * Renders a case-study section's blocks. Figures, diagrams, charts, and code
 * share one running number per page via `figureNumbers`.
 */
export function ContentBlocks({ blocks, figureNumbers }: { blocks: Block[]; figureNumbers: Map<Block, number> }) {
  return (
    <>
      {blocks.map((block, i) => {
        const number = figureNumbers.get(block);
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="mt-4 text-[17px] leading-7 text-text first:mt-0">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="mt-4 space-y-2.5 first:mt-0">
                {block.items.map((item) => (
                  <li key={item} className="relative pl-5 text-[17px] leading-7 text-text">
                    <span aria-hidden className="absolute left-0 top-[0.7em] h-px w-2.5 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "groups":
            return (
              <div key={i} className="mt-4 space-y-6 first:mt-0">
                {block.groups.map((group) => (
                  <div key={group.title}>
                    <h3 className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">
                      {group.title}
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {group.items.map((item) => (
                        <li key={item} className="relative pl-5 text-[17px] leading-7 text-text">
                          <span aria-hidden className="absolute left-0 top-[0.7em] h-px w-2.5 bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
          case "figure":
            return (
              <FigureFrame key={i} number={number} caption={block.caption}>
                <FigureImage image={block.image} />
              </FigureFrame>
            );
          case "diagram":
            return (
              <FigureFrame key={i} number={number} caption={block.caption}>
                <Diagram id={block.diagram} />
              </FigureFrame>
            );
          case "chart":
            return (
              <FigureFrame key={i} number={number} caption={block.caption}>
                <div className="rounded-md border border-border bg-surface p-4">
                  <Chart id={block.chart} />
                </div>
              </FigureFrame>
            );
          case "code":
            return (
              <CodeBlock key={i} code={block.code} language={block.language} caption={block.caption} number={number} />
            );
          case "table":
            return (
              <div key={i} className="my-8 overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
                  {block.caption ? (
                    <caption className="mb-3 text-left font-mono text-xs uppercase tracking-[0.08em] text-muted">
                      {block.caption}
                    </caption>
                  ) : null}
                  <thead>
                    <tr className="border-b border-border-strong">
                      {block.columns.map((col, c) => (
                        <th
                          key={col}
                          scope="col"
                          className={cn(
                            "py-2.5 pr-4 align-bottom text-sm font-medium text-muted",
                            block.numeric?.includes(c) && "text-right",
                          )}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.join("|")} className="border-b border-border">
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className={cn(
                              "py-3 pr-4 align-top leading-6",
                              c === 0 ? "font-medium text-text" : "text-muted",
                              block.numeric?.includes(c) && "text-right font-mono text-sm text-text",
                            )}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "metrics":
            return (
              <dl key={i} className="my-8 grid gap-px overflow-hidden rounded-[10px] border border-border bg-border sm:grid-cols-2">
                {block.items.map((item) => (
                  <div key={item.label} className="bg-surface p-5">
                    <dt className="text-sm text-muted">{item.label}</dt>
                    <dd className="mt-2 flex flex-wrap items-baseline gap-x-2 font-mono">
                      {item.before ? (
                        <>
                          <span className="text-lg text-muted line-through decoration-1">{item.before}</span>
                          <span aria-hidden className="text-muted">
                            →
                          </span>
                          <span className="sr-only">changed to</span>
                        </>
                      ) : null}
                      <span className="text-2xl font-semibold text-text">{item.after}</span>
                    </dd>
                    {item.note ? <dd className="mt-1 text-xs text-muted">{item.note}</dd> : null}
                  </div>
                ))}
              </dl>
            );
          case "callout":
            return (
              <aside key={i} className="my-8 rounded-r-[10px] border-l-2 border-muted bg-surface-muted p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-text">
                  <Info aria-hidden className="size-4 text-muted" />
                  {block.title}
                </p>
                <p className="mt-2 text-[15px] leading-7 text-text">{block.text}</p>
              </aside>
            );
          case "placeholder":
            return showPlaceholders ? (
              <p
                key={i}
                className="my-6 flex gap-2 rounded-md border border-dashed border-chart-2 p-3 text-sm text-chart-2"
              >
                <PencilLine aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>
                  <strong>To do (hidden in production):</strong> {block.text}
                </span>
              </p>
            ) : null;
        }
      })}
    </>
  );
}

/** Assigns Fig. numbers in reading order across all sections. */
export function numberFigures(blocks: Block[]): Map<Block, number> {
  const map = new Map<Block, number>();
  let n = 0;
  for (const block of blocks) {
    if (
      block.type === "figure" ||
      block.type === "diagram" ||
      block.type === "chart" ||
      (block.type === "code" && block.caption)
    ) {
      map.set(block, ++n);
    }
  }
  return map;
}
