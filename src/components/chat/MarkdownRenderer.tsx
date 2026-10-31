"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Parse lines into blocks
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={`h2-${i}`}
          className="text-xl font-bold mt-4 mb-2 text-main flex items-center gap-2"
        >
          {line.replace("## ", "").trim()}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push(
        <h3
          key={`h3-${i}`}
          className="text-lg font-semibold mt-3 mb-1 text-main flex items-center gap-2"
        >
          {line.replace("### ", "").trim()}
        </h3>
      );
      i++;
      continue;
    }

    // Tables
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim().startsWith("|") &&
        lines[i].trim().endsWith("|")
      ) {
        tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        const dataRows = tableLines.slice(2);

        blocks.push(
          <div
            key={`table-${i}`}
            className="my-3 overflow-x-auto rounded-xl border border-token shadow-xs max-w-full"
          >
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-black/5 dark:bg-white/5 border-b border-token">
                  {headerCells.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="px-3 py-2 font-semibold text-main text-xs uppercase tracking-wider"
                    >
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-token bg-surface">
                {dataRows.map((row, rIdx) => {
                  const cells = row
                    .split("|")
                    .slice(1, -1)
                    .map((c) => c.trim());
                  return (
                    <tr
                      key={rIdx}
                      className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      {cells.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-3 py-2.5 text-main text-xs sm:text-sm whitespace-normal break-words leading-relaxed"
                        >
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Lists (numbered or bulleted or checklists)
    if (
      line.trim().startsWith("- [ ]") ||
      line.trim().startsWith("- [x]") ||
      line.trim().startsWith("- ") ||
      line.trim().startsWith("* ") ||
      /^\d+\.\s/.test(line.trim())
    ) {
      const listItems: { type: "checkbox" | "bullet" | "number"; text: string; checked?: boolean; num?: string }[] = [];
      while (i < lines.length && lines[i].trim() && (
        lines[i].trim().startsWith("- ") ||
        lines[i].trim().startsWith("* ") ||
        /^\d+\.\s/.test(lines[i].trim())
      )) {
        const l = lines[i].trim();
        if (l.startsWith("- [ ]")) {
          listItems.push({ type: "checkbox", text: l.replace("- [ ]", "").trim(), checked: false });
        } else if (l.startsWith("- [x]")) {
          listItems.push({ type: "checkbox", text: l.replace("- [x]", "").trim(), checked: true });
        } else if (l.startsWith("- ") || l.startsWith("* ")) {
          listItems.push({ type: "bullet", text: l.replace(/^[-*]\s+/, "").trim() });
        } else {
          const match = l.match(/^(\d+)\.\s+(.*)/);
          if (match) {
            listItems.push({ type: "number", num: match[1], text: match[2] });
          }
        }
        i++;
      }

      blocks.push(
        <div key={`list-${i}`} className="my-2 space-y-1.5">
          {listItems.map((item, idx) => {
            if (item.type === "checkbox") {
              return (
                <div key={idx} className="flex items-start gap-2 text-sm text-main">
                  <input
                    type="checkbox"
                    readOnly
                    checked={item.checked}
                    className="mt-1 rounded border-token text-[#7A3E9D] focus:ring-[#7A3E9D]"
                  />
                  <span>{renderInline(item.text)}</span>
                </div>
              );
            }
            if (item.type === "number") {
              return (
                <div key={idx} className="flex items-start gap-2 text-sm text-main">
                  <span className="font-semibold text-[#7A3E9D] dark:text-[#C9A0E6] min-w-5">
                    {item.num}.
                  </span>
                  <span>{renderInline(item.text)}</span>
                </div>
              );
            }
            return (
              <div key={idx} className="flex items-start gap-2 text-sm text-main">
                <span className="text-muted mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                <span>{renderInline(item.text)}</span>
              </div>
            );
          })}
        </div>
      );
      continue;
    }

    // Standard paragraph or blockquote
    if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-3 border-[#7A3E9D] pl-3 italic text-muted my-2 text-sm"
        >
          {renderInline(line.replace("> ", ""))}
        </blockquote>
      );
      i++;
      continue;
    }

    blocks.push(
      <p key={`p-${i}`} className="my-1.5 text-main text-sm leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1">{blocks}</div>;
};

function renderInline(text: string): React.ReactNode {
  // Bold **text**
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-semibold text-main">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic text-muted">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs font-mono"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

