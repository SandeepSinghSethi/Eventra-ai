"use client";

import React from "react";
import { RiskItem } from "@/lib/types";
import { AlertCircle, LifeBuoy } from "lucide-react";

interface RisksListProps {
  risks: RiskItem[];
}

export const RisksList: React.FC<RisksListProps> = ({ risks }) => {
  return (
    <div className="bg-surface rounded-2xl p-5 border border-token shadow-xs space-y-4">
      <div className="border-b border-token pb-3">
        <h3 className="text-lg font-bold text-main">Risk Mitigation & Contingencies</h3>
        <p className="text-xs text-muted">
          Pre-emptive safety plans for common event hiccups
        </p>
      </div>

      <div className="space-y-3">
        {risks.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-token p-4 bg-app/40 space-y-2 hover:border-[#E8684A]/40 transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#E8684A] shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-main">
                {item.risk}
              </div>
            </div>

            <div className="flex items-start gap-2.5 pl-6 pt-1 border-t border-token/40">
              <LifeBuoy className="w-3.5 h-3.5 text-[#1F8A5B] shrink-0 mt-0.5" />
              <div className="text-xs text-muted leading-relaxed">
                <span className="font-semibold text-main">Backup Plan: </span>
                {item.backup_plan}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

