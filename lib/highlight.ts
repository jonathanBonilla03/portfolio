/**
 * Minimal server-side highlighter for the SQL and Python snippets in the
 * case studies. Keeps the bundle free of a highlighting library.
 */
export type Token = { text: string; kind?: "keyword" | "string" | "comment" | "number" };

const SQL_KEYWORDS = new Set(
  `select from where join left inner right outer cross on and or not as group by order
  having limit with case when then else end create replace view table alter add constraint
  unique primary key foreign references cascade restrict update set delete insert into values
  distinct desc asc nulls last first is null in exists sum min max count floor coalesce
  bool_and over partition row_number begin commit numeric integer text boolean using
  security_invoker true false`
    .split(/\s+/)
    .filter(Boolean),
);

const PYTHON_KEYWORDS = new Set(
  `def return for in if elif else import from as with class while not and or is none true
  false lambda yield try except finally raise pass break continue range print`
    .split(/\s+/)
    .filter(Boolean),
);

const PATTERN =
  /(--[^\n]*|#[^\n]*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+|[^\sA-Za-z0-9_'"#-]+|-)/g;

export function highlight(code: string, language: "sql" | "python"): Token[] {
  const keywords = language === "sql" ? SQL_KEYWORDS : PYTHON_KEYWORDS;
  const tokens: Token[] = [];
  for (const match of code.matchAll(PATTERN)) {
    const [text, comment, string, number, word] = match;
    if (comment && (language === "sql" ? comment.startsWith("--") : comment.startsWith("#"))) {
      tokens.push({ text, kind: "comment" });
    } else if (string) {
      tokens.push({ text, kind: "string" });
    } else if (number) {
      tokens.push({ text, kind: "number" });
    } else if (word && keywords.has(word.toLowerCase())) {
      tokens.push({ text, kind: "keyword" });
    } else {
      tokens.push({ text });
    }
  }
  return tokens;
}
