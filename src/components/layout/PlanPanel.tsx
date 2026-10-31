"use client";

import React, { useState, useRef } from "react";
import { EventPlan } from "@/lib/types";
import { ExportBar } from "../plan/ExportBar";
import { SnapshotCard } from "../plan/SnapshotCard";
import { NextActions } from "../plan/NextActions";
import { BudgetTable } from "../plan/BudgetTable";
import { Timeline } from "../plan/Timeline";
import { VendorChecklist } from "../plan/VendorChecklist";
import { IdeasGrid } from "../plan/IdeasGrid";
import { RisksList } from "../plan/RisksList";
import {
  Sparkles,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Lightbulb,
  AlertTriangle,
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface PlanPanelProps {
  plan: EventPlan | null;
  onClose?: () => void; // for drawer in tablet/mobile
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

type TabType = "overview" | "budget" | "timeline" | "vendors" | "ideas" | "risks";

export const PlanPanel: React.FC<PlanPanelProps> = ({
  plan,
  onClose,
  isExpanded,
  onToggleExpand,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const tabsRef = useRef<HTMLDivElement>(null);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "budget", label: "Budget", icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: "timeline", label: "Timeline", icon: <Clock className="w-3.5 h-3.5" /> },
    { id: "vendors", label: "Vendors", icon: <Users className="w-3.5 h-3.5" /> },
    { id: "ideas", label: "Ideas", icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { id: "risks", label: "Risks", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  ];

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: direction === "left" ? -120 : 120,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-app border-l border-token overflow-hidden">
      {/* Header with Export Bar & Resizer Toggles */}
      <div className="px-4 py-3 bg-surface border-b border-token flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-[#7A3E9D]/10 text-[#7A3E9D] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-main leading-tight truncate">
              {plan ? plan.event.title : "Event Plan"}
            </h2>
            <span className="text-[10px] text-muted">
              {plan ? "Saved & synced" : "Awaiting draft"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <ExportBar plan={plan} />

          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="p-1.5 rounded-xl border border-token hover:border-[#7A3E9D] hover:bg-black/5 dark:hover:bg-white/5 text-muted hover:text-main transition-colors cursor-pointer hidden lg:flex items-center"
              title={isExpanded ? "Restore panel size" : "Expand panel (slide wider)"}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-token hover:bg-black/5 text-muted lg:hidden cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Slideable Tabs Bar */}
      <div className="relative flex items-center bg-surface/90 border-b border-token shrink-0 px-1">
        <button
          onClick={() => scrollTabs("left")}
          className="p-1 text-muted hover:text-main hover:bg-black/5 rounded-md transition-colors"
          title="Scroll tabs left"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div
          ref={tabsRef}
          className="flex items-center gap-1 px-1 py-2 overflow-x-auto scrollbar-none no-scrollbar scroll-smooth flex-1"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#7A3E9D] text-white shadow-2xs font-bold"
                    : "text-muted hover:text-main hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scrollTabs("right")}
          className="p-1 text-muted hover:text-main hover:bg-black/5 rounded-md transition-colors"
          title="Scroll tabs right"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Panel Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {!plan ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-surface rounded-2xl border border-token">
            <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 text-muted flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-muted" />
            </div>
            <h3 className="text-sm font-bold text-main mb-1">
              No Plan Generated Yet
            </h3>
            <p className="text-xs text-muted max-w-xs leading-relaxed">
              Describe your dream wedding, birthday, or festival in the chat. Eventra will instantly populate your snapshot, budget, and timeline!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <NextActions actions={plan.next_actions} />
                <SnapshotCard plan={plan} />
              </div>
            )}

            {activeTab === "budget" && (
              <BudgetTable
                items={plan.budget}
                totalBudget={plan.total_budget}
                currency={plan.currency}
              />
            )}

            {activeTab === "timeline" && <Timeline items={plan.timeline} />}

            {activeTab === "vendors" && (
              <VendorChecklist vendors={plan.vendors} />
            )}

            {activeTab === "ideas" && <IdeasGrid ideas={plan.ideas} />}

            {activeTab === "risks" && <RisksList risks={plan.risks} />}
          </div>
        )}
      </div>
    </div>
  );
};
