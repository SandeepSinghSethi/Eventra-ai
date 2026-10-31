"use client";

import React from "react";
import { FileText, Calendar as CalendarIcon } from "lucide-react";
import { EventPlan } from "@/lib/types";

interface ExportBarProps {
  plan: EventPlan | null;
}

export const ExportBar: React.FC<ExportBarProps> = ({ plan }) => {
  const isEnabled = !!plan && !!plan.id;

  const handleExportPDF = () => {
    if (!isEnabled) return;
    window.print();
  };

  const handleExportICS = () => {
    if (!isEnabled || !plan?.id) return;
    window.location.href = `/api/export/ics?id=${encodeURIComponent(plan.id)}`;
  };

  return (
    <div className="flex items-center gap-1.5 no-print shrink-0">
      <button
        onClick={handleExportPDF}
        disabled={!isEnabled}
        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-token hover:border-[#7A3E9D] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer text-main active:scale-95 shadow-2xs whitespace-nowrap"
        title="Export full plan as PDF"
      >
        <FileText className="w-3.5 h-3.5 text-[#7A3E9D] dark:text-[#C9A0E6]" />
        <span>PDF</span>
      </button>

      <button
        onClick={handleExportICS}
        disabled={!isEnabled}
        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-token hover:border-[#7A3E9D] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer text-main active:scale-95 shadow-2xs whitespace-nowrap"
        title="Add to calendar (.ics)"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-[#E8684A]" />
        <span>.ICS</span>
      </button>
    </div>
  );
};
