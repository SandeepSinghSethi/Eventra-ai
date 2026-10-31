"use client";

import React, { useState } from "react";
import { BudgetItem } from "@/lib/types";
import { IconHelper } from "../ui/IconHelper";
import { PieChart, ListFilter, Info } from "lucide-react";

interface BudgetTableProps {
  items: BudgetItem[];
  totalBudget: number;
  currency: string;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({
  items,
  totalBudget,
  currency,
}) => {
  const [showChart, setShowChart] = useState(true);
  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency;

  // Donut chart colors
  const strokeColors = [
    "#7A3E9D", // Plum
    "#E8684A", // Coral
    "#1F8A5B", // Success Green
    "#D4AF37", // Gold
    "#2D6A4F", // Dark Green
    "#3A86FF", // Blue
    "#FF006E", // Pink
    "#8338EC", // Purple
    "#B8AFC0", // Contingency Gray
  ];

  let cumulativePercent = 0;
  const totalCalculated = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-surface rounded-2xl p-5 border border-token shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-token pb-3 gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-main">Budget Allocation</h3>
          <p className="text-xs text-muted">
            Total Target: <strong className="text-main font-semibold">{currencySymbol}{totalBudget.toLocaleString()}</strong>
          </p>
        </div>

        <button
          onClick={() => setShowChart(!showChart)}
          className={`p-1.5 rounded-xl border border-token text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
            showChart
              ? "bg-[#7A3E9D]/10 text-[#7A3E9D] border-[#7A3E9D]/30"
              : "bg-surface text-muted hover:text-main"
          }`}
          title="Toggle Donut Visualizer"
        >
          <PieChart className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">{showChart ? "Hide Chart" : "Show Chart"}</span>
        </button>
      </div>

      {/* SVG Donut Visualizer */}
      {showChart && (
        <div className="p-4 rounded-2xl bg-app/50 border border-token/80 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke="currentColor"
                className="text-black/5 dark:text-white/5"
                strokeWidth="3.8"
              />
              {items.map((item, idx) => {
                const strokeDasharray = `${item.percent} ${100 - item.percent}`;
                const strokeDashoffset = -cumulativePercent;
                cumulativePercent += item.percent;

                const color = item.category.toLowerCase().includes("contingency")
                  ? "#6B625B"
                  : strokeColors[idx % strokeColors.length];

                return (
                  <circle
                    key={idx}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="transparent"
                    stroke={color}
                    strokeWidth="3.8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 ease-out"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] uppercase font-semibold text-muted">Total</span>
              <span className="text-xs font-bold text-main leading-tight">
                {currencySymbol}{totalBudget.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {items.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: item.category.toLowerCase().includes("contingency")
                      ? "#6B625B"
                      : strokeColors[idx % strokeColors.length],
                  }}
                />
                <span className="text-muted text-[11px] truncate max-w-[110px]" title={item.category}>
                  {item.category}:
                </span>
                <span className="font-semibold text-main text-[11px]">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Rows Table (With Full Multiline Notes, Never Snipped) */}
      <div className="overflow-x-auto -mx-1 sm:mx-0">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-token text-[11px] uppercase tracking-wider text-muted">
              <th className="pb-2.5 font-semibold">Category & Details</th>
              <th className="pb-2.5 text-right font-semibold whitespace-nowrap">Share</th>
              <th className="pb-2.5 text-right font-semibold whitespace-nowrap">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-token/60">
            {items.map((item, idx) => {
              const isContingency = item.category.toLowerCase().includes("contingency");

              return (
                <tr
                  key={idx}
                  className={`group transition-colors ${
                    isContingency
                      ? "bg-black/[0.02] dark:bg-white/[0.02] text-muted"
                      : "hover:bg-black/[0.01] dark:hover:bg-white/[0.01]"
                  }`}
                >
                  <td className="py-3 pr-3 align-top">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          isContingency
                            ? "bg-black/5 dark:bg-white/5 text-muted"
                            : "bg-[#7A3E9D]/10 text-[#7A3E9D]"
                        }`}
                      >
                        <IconHelper name={item.icon} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-semibold leading-tight ${
                            isContingency ? "text-muted italic" : "text-main"
                          }`}
                        >
                          {item.category}
                        </div>
                        {/* Fully visible, multiline notes - NEVER clipped! */}
                        {item.notes && (
                          <div className="text-[11px] text-muted leading-relaxed break-words mt-1">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-2 text-right whitespace-nowrap align-top">
                    <div className="text-xs font-bold text-main">
                      {item.percent}%
                    </div>
                    {/* Progress Bar */}
                    <div className="w-14 h-1.5 bg-black/5 dark:bg-white/10 rounded-full ml-auto mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isContingency ? "bg-muted" : "bg-[#7A3E9D]"
                        }`}
                        style={{ width: `${Math.min(item.percent * 2.2, 100)}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-3 pl-2 text-right whitespace-nowrap font-bold text-xs text-main align-top">
                    {currencySymbol}{item.amount.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-token font-bold text-xs text-main bg-black/[0.01] dark:bg-white/[0.01]">
              <td className="py-3">Total Estimated Budget</td>
              <td className="py-3 text-right">100%</td>
              <td className="py-3 text-right text-sm text-[#7A3E9D] dark:text-[#C9A0E6]">
                {currencySymbol}{totalCalculated.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
