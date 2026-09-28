import React from "react";

// Wraps the measurable parts of a string in <span class="metric"> so case study
// copy can render its numbers at full strength against dimmed body text.
//
// The pattern deliberately requires a unit after a bare number, which is what
// keeps version numbers and specs out of it: "React 16", "Storybook 7", "SB7",
// "8pt", "10pt grid", "2FA", "1:1" and "Q1 2024" all stay unhighlighted, while
// "20 months", "500+ users" and "$3M+" do not.

const UNITS = [
  "users?",
  "designers?",
  "engineers?",
  "developers?",
  "devs?",
  "technologists?",
  "customers?",
  "employees?",
  "interns?",
  "brands?",
  "products?",
  "platforms?",
  "entities?",
  "business\\s+units?",
  "BUs?",
  "FTE",
  "teams?",
  "squads?",
  "quarters?",
  "months?",
  "weeks?",
  "days?",
  "hours?",
  "years?",
  "releases?",
  "components?",
  "skills?",
  "files?",
  "projects?",
  "prototypes?",
  "surfaces?",
  "stacks?",
  "stages?",
  "steps?",
  "variants?",
  "overlays?",
  "tags?",
  "pages?",
  "signups?",
  "changes?",
].join("|");

const NUM = "\\d[\\d,]*(?:\\.\\d+)?";

const METRIC = new RegExp(
  [
    // $3M+, $2M
    `\\$${NUM}[KMB]?\\+?`,
    // 50%, +10%, ~10%
    `[+~]?${NUM}%`,
    // employee #3
    `#\\d+`,
    // 0 → 1, 400 → 1,000+ employees
    `~?${NUM}\\+?\\s*(?:→|->)\\s*~?${NUM}\\+?(?:\\s+(?:${UNITS}))?`,
    // 1 of 2
    `\\b\\d+\\s+of\\s+\\d+\\b`,
    // 5+1 developers
    `\\b\\d+\\+\\d+\\s+(?:${UNITS})\\b`,
    // 7-page, 6-month, 20-month
    `\\b\\d+-[A-Za-z]+\\b`,
    // 500+ users, ~35 designers, 4-6 quarters, 3 end-to-end hi-fi prototypes
    `~?\\b${NUM}(?:-\\d+)?\\+?\\s+(?:[A-Za-z][\\w-]*\\s+){0,2}?(?:${UNITS})\\b`,
  ].join("|"),
  "g"
);

export const highlightMetrics = (input: string): React.ReactNode => {
  METRIC.lastIndex = 0;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = METRIC.exec(input)) !== null) {
    if (match.index > last) parts.push(input.slice(last, match.index));
    parts.push(
      <span className="metric" key={key++}>
        {match[0]}
      </span>
    );
    last = match.index + match[0].length;
  }

  if (parts.length === 0) return input;
  if (last < input.length) parts.push(input.slice(last));

  // One wrapper node, not a fragment. `.text` is inline-flex, so every direct
  // child becomes a flex item — returning the pieces loose would lay each
  // fragment out as its own column. Inside a single child they flow as normal
  // inline text, and every existing Text layout keeps behaving as it did.
  return <span className="metrics">{parts}</span>;
};

export default highlightMetrics;
