"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface NextActionsProps {
  actions: string[];
}

export const NextActions: React.FC<NextActionsProps> = ({ actions }) => {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const toggleAction = (idx: number) => {
    setCompleted((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="bg-surface rounded-2xl p-4 border border-token shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1F8A5B]" />
          Priority Next Actions (This Week)
        </h3>
        <span className="text-[11px] text-muted font-medium">
          {Object.values(completed).filter(Boolean).length}/3 completed
        </span>
      </div>

      <div className="space-y-2">
        {actions.slice(0, 3).map((action, idx) => {
          const isDone = !!completed[idx];
          return (
            <button
              key={idx}
              onClick={() => toggleAction(idx)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group ${
                isDone
                  ? "bg-black/[0.02] dark:bg-white/[0.02] border-token opacity-60"
                  : "bg-surface border-token hover:border-[#7A3E9D]/50 hover:bg-[#7A3E9D]/[0.02]"
              }`}
            >
              <div className="mt-0.5 shrink-0 text-[#7A3E9D]">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#1F8A5B]" />
                ) : (
                  <Circle className="w-4 h-4 text-muted group-hover:text-[#7A3E9D]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs font-medium ${
                    isDone ? "line-through text-muted" : "text-main"
                  }`}
                >
                  <span className="font-bold mr-1.5 text-[#7A3E9D]">
                    {idx + 1}.
                  </span>
                  {action}
                </div>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

