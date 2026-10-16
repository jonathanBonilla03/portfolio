import { highlight } from "@/lib/highlight";

export function CodeBlock({
  code,
  language,
  caption,
  number,
}: {
  code: string;
  language: "sql" | "python";
  caption?: string;
  number?: number;
}) {
  const tokens = highlight(code, language);
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-[10px] border border-border bg-surface-muted">
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{language}</span>
        </div>
        <pre className="code-block overflow-x-auto p-4 font-mono text-[13px] leading-6 text-text sm:text-sm">
          <code>
            {tokens.map((token, i) =>
              token.kind ? (
                <span key={i} className={`tok-${token.kind}`}>
                  {token.text}
                </span>
              ) : (
                token.text
              ),
            )}
          </code>
        </pre>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm leading-6 text-muted">
          {number ? <span className="font-mono text-xs text-text">Fig. {number} — </span> : null}
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
