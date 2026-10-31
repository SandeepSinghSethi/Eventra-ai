"use client";

import React, { useState } from "react";
import { TimelineItem } from "@/lib/types";
import { Flag, CheckCircle2, Circle } from "lucide-react";

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items: initialItems }) => {
  const [items, setItems] = useState<TimelineItem[]>(initialItems);

  const toggleTask = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            done: !item.done,
            status: !item.done ? "done" : "upcoming",
          }
          : item
      )
    );
  };

  // Group by month/period
  const grouped = items.reduce((acc, item) => {
    const key = item.due_date
      ? new Date(item.due_date).toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      })
      : "Milestones";

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, TimelineItem[]>);

  return (
    <div className="bg-surface rounded-2xl p-5 border border-token shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-token pb-3">
        <div>
          <h3 className="text-lg font-bold text-main">Timeline & Action Plan</h3>
          <p className="text-xs text-muted">Counted backward from event date</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1F8A5B]/10 text-[#1F8A5B]">
          {items.filter((i) => i.done).length}/{items.length} Done
        </span>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([period, periodItems], gIdx) => (
          <div key={gIdx} className="space-y-3">
            {/* Month Header */}
            <div className="text-xs font-bold uppercase tracking-wider text-[#7A3E9D] dark:text-[#C9A0E6] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {period}
            </div>

            {/* Tasks under this period */}
            <div className="relative pl-5 border-l-2 border-token space-y-3 ml-2">
              {periodItems.map((item, idx) => {
                const globalIndex = items.findIndex((i) => i === item);
                const isHigh = item.priority === "high";

                // Status chip styling
                let statusBadge = (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-muted">
                    Upcoming
                  </span>
                );

                if (item.status === "do_now" && !item.done) {
                  statusBadge = (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#C0392B]/10 text-[#C0392B]">
                      Do now
                    </span>
                  );
                } else if (item.done || item.status === "done") {
                  statusBadge = (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1F8A5B]/10 text-[#1F8A5B]">
                      Done
                    </span>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`relative p-3 rounded-xl border transition-all flex items-start gap-3 group ${item.done
                      ? "bg-black/[0.02] dark:bg-white/[0.02] border-token opacity-60"
                      : "bg-surface border-token hover:border-[#7A3E9D]/40"
                      }`}
                  >
                    {/* Node on vertical line */}
                    <div className="absolute -left-[27px] top-4 w-3 h-3 rounded-full border-2 border-surface bg-[#7A3E9D] shrink-0" />

                    {/* Interactive Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleTask(globalIndex)}
                      className="mt-0.5 shrink-0 text-muted hover:text-[#7A3E9D] cursor-pointer"
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-[#1F8A5B]" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-semibold text-muted">
                            {item.when}
                          </span>

                          {isHigh && (
                            <span
                              className="inline-flex items-center text-[#E8684A]"
                              title="High Priority"
                            >
                              <Flag className="w-3 h-3 fill-current" />
                            </span>
                          )}

                          {statusBadge}
                        </div>

                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-muted shrink-0">
                          {item.owner}
                        </span>
                      </div>

                      <div
                        className={`text-xs font-medium leading-relaxed break-words ${item.done ? "line-through text-muted" : "text-main"
                          }`}
                      >
                        {item.task}
                      </div>

                      {item.due_date && (
                        <div className="text-[10px] text-muted mt-1">
                          Due: {new Date(item.due_date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

